export async function onRequestPost(context) {
  const { request } = context;
  
  const { playerId, itemId, action } = await request.json();

  try {
    let endpoint = action === 'remove' 
      ? 'https://1620F0.playfabapi.com/Server/RevokeInventoryItems'
      : 'https://1620F0.playfabapi.com/Server/GrantItemsToUser';

    const body = action === 'remove'
      ? {
          PlayFabId: playerId,
          Items: [{
            ItemId: itemId,
            InstanceId: '*'
          }]
        }
      : {
          PlayFabId: playerId,
          ItemIds: [itemId]
        };

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-SecretKey': 'WS6N34UHIP64N56QEGX45UGXT59GQE9PDPFM9WTQ1AA7GMIEZ7'
      },
      body: JSON.stringify(body)
    });

    const text = await response.text();
    
    if (!text || text.length === 0) {
      return new Response(JSON.stringify({ success: true }), {
        headers: { 'Content-Type': 'application/json' }
      });
    }

    let data = JSON.parse(text);

    if (data.status === 'OK' || data.code === 200 || response.ok) {
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