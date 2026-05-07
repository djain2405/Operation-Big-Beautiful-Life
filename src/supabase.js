// Supabase sync layer — uses REST API directly, no SDK needed
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || "";
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || "";
const TABLE = "life_data";

const headers = {
  apikey: SUPABASE_KEY,
  Authorization: "Bearer " + SUPABASE_KEY,
  "Content-Type": "application/json",
  Prefer: "return=representation",
};

export const supabaseEnabled = Boolean(SUPABASE_URL && SUPABASE_KEY);

// Fetch with 5-second timeout so the app never hangs
function fetchWithTimeout(url, options, ms) {
  var controller = new AbortController();
  var timer = setTimeout(function() { controller.abort(); }, ms || 5000);
  options = options || {};
  options.signal = controller.signal;
  return fetch(url, options).finally(function() { clearTimeout(timer); });
}

export function cloudLoad(userId) {
  if (!supabaseEnabled) return Promise.resolve(null);
  return fetchWithTimeout(
    SUPABASE_URL + "/rest/v1/" + TABLE + "?user_id=eq." + encodeURIComponent(userId) + "&select=data,updated_at",
    { headers: headers },
    5000
  )
  .then(function(res) {
    if (!res.ok) return null;
    return res.json();
  })
  .then(function(rows) {
    if (!rows || rows.length === 0) return null;
    return { data: rows[0].data, updatedAt: rows[0].updated_at };
  })
  .catch(function() {
    return null;
  });
}

export function cloudSave(userId, data) {
  if (!supabaseEnabled) return Promise.resolve(false);
  var body = JSON.stringify({
    user_id: userId,
    data: data,
    updated_at: new Date().toISOString(),
  });
  return fetchWithTimeout(SUPABASE_URL + "/rest/v1/" + TABLE, {
    method: "POST",
    headers: Object.assign({}, headers, { Prefer: "resolution=merge-duplicates,return=representation" }),
    body: body,
  }, 5000)
  .then(function(res) { return res.ok; })
  .catch(function() { return false; });
}
