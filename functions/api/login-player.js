export async function onRequestPost(context) {
  const { request, env } = context;
  const { deviceId } = await request.json();

  try {
    const player = await env.DB.prepare(
      `SELECT * FROM players WHERE deviceId = ?`
    ).bind(deviceId).first();

    if (!player) {
      return new Response(JSON.stringify({ success: false, error: 'Player not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    await env.DB.prepare(
      `UPDATE players SET lastLogin = ? WHERE id = ?`
    ).bind(new Date().toISOString(), player.id).run();

    return new Response(JSON.stringify({ 
      success: true, 
      playerId: player.id,
      displayName: player.displayName
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