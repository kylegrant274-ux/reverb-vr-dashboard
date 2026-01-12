export async function onRequestPost(context) {
  const { request, env } = context;
  const { deviceId, displayName } = await request.json();

  try {
    if (!deviceId || !displayName) {
      return new Response(JSON.stringify({ success: false, error: 'Missing deviceId or displayName' }), {
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const customId = 'P_' + Math.random().toString(36).substring(2, 10).toUpperCase();
    const now = new Date().toISOString();

    await env.DB.prepare(
      `INSERT INTO players (id, displayName, deviceId, created, lastLogin) 
       VALUES (?, ?, ?, ?, ?)`
    ).bind(customId, displayName, deviceId, now, now).run();

    return new Response(JSON.stringify({ 
      success: true, 
      playerId: customId,
      displayName: displayName
    }), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ success: false, error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}