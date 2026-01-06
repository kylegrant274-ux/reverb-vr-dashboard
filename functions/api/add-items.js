export async function onRequestPost(context) {
  const { request } = context;
  
  try {
    const { playerId, itemId, action } = await request.json();

    if (!playerId || !itemId) {
      return new Response(JSON.stringify({ success: false, error: 'Missing playerId or itemId' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    let endpoint, body;

    if (action === 'remove') {
      endpoint = 'https://1620F0.playfabapi.com/Server/RevokeInventoryItems';
      body = {
        PlayFabId: playerId,
        Items: [{
          ItemId: itemId,
          InstanceId: '*'
        }]
      };
    } else {
      endpoint = 'https://1620F0.playfabapi.com/Server/GrantItemsToUser';
      body = {
        PlayFabId: playerId,
        ItemIds: [itemId]
      };
    }

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

    if (data.status === 'OK' || data.code === 200) {
      return new Response(JSON.stringify({ success: true, data }), {
        headers: { 'Content-Type': 'application/json' }
      });
    } else {
      return new Response(JSON.stringify({ success: false, error: data.errorMessage || 'Error from PlayFab' }), {
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
