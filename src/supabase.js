var SUPA_URL = import.meta.env.VITE_SUPABASE_URL || "";
var SUPA_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || "";
var TABLE = "life_data";

var hdrs = {
  "apikey": SUPA_KEY,
  "Authorization": "Bearer " + SUPA_KEY,
  "Content-Type": "application/json"
};

export var supabaseEnabled = SUPA_URL.length > 0 && SUPA_KEY.length > 0;

function tFetch(url, opts) {
  return new Promise(function(ok, fail) {
    var t = setTimeout(function() { fail(new Error("timeout")); }, 5000);
    fetch(url, opts || {})
      .then(function(r) { clearTimeout(t); ok(r); })
      .catch(function(e) { clearTimeout(t); fail(e); });
  });
}

export function cloudLoad() {
  if (!supabaseEnabled) return Promise.resolve(null);
  var url = SUPA_URL + "/rest/v1/" + TABLE + "?select=user_id,data,updated_at&order=updated_at.desc&limit=1";
  return tFetch(url, { method: "GET", headers: hdrs })
    .then(function(r) { return r.ok ? r.json() : null; })
    .then(function(rows) {
      if (!rows || rows.length === 0) return null;
      return { data: rows[0].data, userId: rows[0].user_id };
    })
    .catch(function() { return null; });
}

export function cloudSave(data) {
  if (!supabaseEnabled) return Promise.resolve(false);
  var url = SUPA_URL + "/rest/v1/" + TABLE + "?on_conflict=user_id";
  var body = JSON.stringify({
    user_id: "owner",
    data: data,
    updated_at: new Date().toISOString()
  });
  var h = {};
  Object.keys(hdrs).forEach(function(k) { h[k] = hdrs[k]; });
  h["Prefer"] = "resolution=merge-duplicates";
  return tFetch(url, { method: "POST", headers: h, body: body })
    .then(function(r) { return r.ok; })
    .catch(function() { return false; });
}

export function cloudCleanup() {
  if (!supabaseEnabled) return Promise.resolve(false);
  var url = SUPA_URL + "/rest/v1/" + TABLE + "?user_id=neq.owner";
  return tFetch(url, { method: "DELETE", headers: hdrs })
    .then(function(r) { return r.ok; })
    .catch(function() { return false; });
}
