// Supabase sync layer — uses REST API directly, no SDK needed
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;
const TABLE = "life_data";

const headers = {
  apikey: SUPABASE_KEY,
  Authorization: `Bearer ${SUPABASE_KEY}`,
  "Content-Type": "application/json",
  Prefer: "return=representation",
};

export const supabaseEnabled = !!(SUPABASE_URL && SUPABASE_KEY);

export async function cloudLoad(userId) {
  if (!supabaseEnabled) return null;
  try {
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/${TABLE}?user_id=eq.${encodeURIComponent(userId)}&select=data,updated_at`,
      { headers }
    );
    if (!res.ok) return null;
    const rows = await res.json();
    if (rows.length === 0) return null;
    return { data: rows[0].data, updatedAt: rows[0].updated_at };
  } catch {
    return null;
  }
}

export async function cloudSave(userId, data) {
  if (!supabaseEnabled) return false;
  try {
    const body = JSON.stringify({
      user_id: userId,
      data,
      updated_at: new Date().toISOString(),
    });

    // Upsert: insert or update on conflict
    const res = await fetch(`${SUPABASE_URL}/rest/v1/${TABLE}`, {
      method: "POST",
      headers: { ...headers, Prefer: "resolution=merge-duplicates,return=representation" },
      body,
    });
    return res.ok;
  } catch {
    return false;
  }
}
