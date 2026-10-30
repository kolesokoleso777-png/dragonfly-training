/**
 * Dragonfly Training shared-data endpoint (initial cross-device test build).
 * Requires Pages D1 binding: DB. Apply migrations/0001_initial.sql first.
 * NOTE: This is a controlled-test adapter, not production-grade authorization.
 * Do not use with real employee/personal data until server-side login/session
 * enforcement is added and verified.
 */
const headers = { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' };
const json = (data, status = 200) => new Response(JSON.stringify(data), { status, headers });
function allowedKey(key) {
  return key === 'org' || /^state:dfx_(?:s_[A-Za-z0-9_-]+|mgr_v1|v1)$/.test(key);
}
export async function onRequest({ request, env }) {
  if (!env.DB) return json({ ok: false, error: 'D1 binding DB is missing' }, 503);
  const url = new URL(request.url);
  if (request.method === 'GET') {
    const key = url.searchParams.get('key') || '';
    if (!allowedKey(key)) return json({ ok: false, error: 'Invalid key' }, 400);
    try {
      const row = await env.DB.prepare('SELECT record_value, updated_at FROM app_records WHERE record_key = ?').bind(key).first();
      return json({ ok: true, found: !!row, value: row ? JSON.parse(row.record_value) : null, updatedAt: row?.updated_at ?? null });
    } catch (e) { return json({ ok: false, error: 'Database read failed' }, 500); }
  }
  if (request.method === 'PUT') {
    let body;
    try { body = await request.json(); } catch { return json({ ok: false, error: 'Invalid JSON' }, 400); }
    const key = typeof body?.key === 'string' ? body.key : '';
    if (!allowedKey(key) || !Object.prototype.hasOwnProperty.call(body, 'value')) return json({ ok: false, error: 'Invalid key or value' }, 400);
    const raw = JSON.stringify(body.value);
    if (raw.length > 1_500_000) return json({ ok: false, error: 'Record too large' }, 413);
    try {
      await env.DB.prepare(`INSERT INTO app_records (record_key, record_value, updated_at) VALUES (?, ?, ?)
        ON CONFLICT(record_key) DO UPDATE SET record_value = excluded.record_value, updated_at = excluded.updated_at`)
        .bind(key, raw, Date.now()).run();
      return json({ ok: true, updatedAt: Date.now() });
    } catch (e) { return json({ ok: false, error: 'Database write failed' }, 500); }
  }
  return json({ ok: false, error: 'Method not allowed' }, 405);
}
