export async function onRequestPost(context) {
  const { request } = context;
  
  const { query } = await request.json();

  try {
    // Try to search by PlayFab ID first
    const response = await fetch('https://1620F0.playfabapi.com/Server/GetPlayerProfile', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-SecretKey': 'WS6N34UHIP64N56QEGX45UGXT59GQE9PDPFM9WTQ1AA7GMIEZ7'
      },
      body: JSON.stringify({
        PlayFabId: query,
        ProfileConstraints: {
          ShowDisplayName: true,
          ShowCreated: true
        }
      })
    });

    const text = await response.text();
    let data = JSON.parse(text);

    if (data.code === 200 && data.data) {
      return new Response(JSON.stringify({ 
        success: true, 
        players: [{
          PlayFabId: data.data.PlayFabId,
          DisplayName: data.data.DisplayName || 'Unknown',
          Created: data.data.Created
        }] 
      }), {
        headers: { 'Content-Type': 'application/json' }
      });
    } else {
      return new Response(JSON.stringify({ success: true, players: [] }), {
        headers: { 'Content-Type': 'application/json' }
      });
    }
  } catch (error) {
    return new Response(JSON.stringify({ success: false, error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
