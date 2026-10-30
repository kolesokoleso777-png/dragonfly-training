export async function onRequest({ env }) {
  if (!env.DB) return Response.json({ ok: false, database: 'missing', message: 'D1 binding DB is missing' }, { status: 503 });
  try {
    const row = await env.DB.prepare('SELECT 1 AS ok').first();
    return Response.json({ ok: row?.ok === 1, database: 'connected', service: 'Dragonfly Training API' });
  } catch (e) {
    return Response.json({ ok: false, database: 'error', message: 'D1 is bound but query failed. Apply migrations/0001_initial.sql.' }, { status: 500 });
  }
}
