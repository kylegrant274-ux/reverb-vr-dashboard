export async function onRequestPost(context) {
  const { request } = context;
  
  const { playerId, itemId, quantity } = await request.json();

  try {
    const requestBody = {
      PlayFabId: playerId,
      ItemIds: [itemId],
      GetCharacterInventories: false
    };

    const response = await fetch('https://1620F0.playfabapi.com/Server/GrantItemsToUser', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-SecretKey': 'WS6N34UHIP64N56QEGX45UGXT59GQE9PDPFM9WTQ1AA7GMIEZ7'
      },
      body: JSON.stringify(requestBody)
    });

    const text = await response.text();
    let data = JSON.parse(text);

    if (data.status === 'OK' || data.code === 200) {
      return new Response(JSON.stringify({ success: true, data }), {
        headers: { 'Content-Type': 'application/json' }
      });
    } else {
      return new Response(JSON.stringify({ success: false, error: data.errorMessage || JSON.stringify(data) }), {
        status: 400,
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
