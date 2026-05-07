var SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || "";
var SUPABASE_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || "";
var TABLE = "life_data";

var headers = {
  apikey: SUPABASE_KEY,
  Authorization: "Bearer " + SUPABASE_KEY,
  "Content-Type": "application/json",
};

export var supabaseEnabled = Boolean(SUPABASE_URL && SUPABASE_KEY);

function fetchT(url, opts) {
  return new Promise(function(resolve, reject) {
    var timer = setTimeout(function() { reject(new Error("timeout")); }, 5000);
    fetch(url, opts || {}).then(function(r) { clearTimeout(timer); resolve(r); }).catch(function(e) { clearTimeout(timer); reject(e); });
  });
}

// Load the most recent row — no user_id filter, just grab latest
export function cloudLoad() {
  if (!supabaseEnabled) return Promise.resolve(null);
  return fetchT(
    SUPABASE_URL + "/rest/v1/" + TABLE + "?select=user_id,data,updated_at&order=updated_at.desc&limit=1",
    { headers: headers }
  )
  .then(function(res) { return res.ok ? res.json() : null; })
  .then(function(rows) {
    if (!rows || rows.length === 0) return null;
    return { data: rows[0].data, userId: rows[0].user_id };
  })
  .catch(function() { return null; });
}

// Always save as user_id = "owner", upsert
export function cloudSave(data) {
  if (!supabaseEnabled) return Promise.resolve(false);
  return fetchT(SUPABASE_URL + "/rest/v1/" + TABLE, {
    method: "POST",
    headers: Object.assign({}, headers, { Prefer: "resolution=merge-duplicates,return=representation" }),
    body: JSON.stringify({ user_id: "owner", data: data, updated_at: new Date().toISOString() }),
  })
  .then(function(res) { return res.ok; })
  .catch(function() { return false; });
}

// Delete old rows that aren't "owner" — call once after migration
export function cloudCleanup() {
  if (!supabaseEnabled) return Promise.resolve(false);
  return fetchT(
    SUPABASE_URL + "/rest/v1/" + TABLE + "?user_id=neq.owner",
    { method: "DELETE", headers: headers }
  )
  .then(function(res) { return res.ok; })
  .catch(function() { return false; });
}
