export async function onRequestPost(context) {
  const { request } = context;
  
  const { playerId, itemId, action } = await request.json();

  try {
    if (action === 'add') {
      const response = await fetch('https://1620F0.playfabapi.com/Server/GrantItemsToUser', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-SecretKey': 'WS6N34UHIP64N56QEGX45UGXT59GQE9PDPFM9WTQ1AA7GMIEZ7'
        },
        body: JSON.stringify({
          PlayFabId: playerId,
          ItemIds: [itemId],
          CatalogVersion: 'Items'
        })
      });

      const text = await response.text();
      let data = JSON.parse(text);

      if (data.code === 200) {
        return new Response(JSON.stringify({ success: true, data }), {
          headers: { 'Content-Type': 'application/json' }
        });
      } else {
        return new Response(JSON.stringify({ success: false, error: data.errorMessage || JSON.stringify(data) }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        });
      }
    } else {
      const invResponse = await fetch('https://1620F0.playfabapi.com/Server/GetUserInventory', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-SecretKey': 'WS6N34UHIP64N56QEGX45UGXT59GQE9PDPFM9WTQ1AA7GMIEZ7'
        },
        body: JSON.stringify({ PlayFabId: playerId })
      });

      const invText = await invResponse.text();
      let invData = JSON.parse(invText);

      if (invData.code !== 200) {
        return new Response(JSON.stringify({ success: false, error: 'Failed to get inventory' }), {
          headers: { 'Content-Type': 'application/json' }
        });
      }

      const item = invData.data.Inventory.find(i => i.ItemId === itemId);
      if (!item) {
        return new Response(JSON.stringify({ success: false, error: 'Item not found' }), {
          headers: { 'Content-Type': 'application/json' }
        });
      }

      const revokeResponse = await fetch('https://1620F0.playfabapi.com/Server/RevokeInventoryItems', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-SecretKey': 'WS6N34UHIP64N56QEGX45UGXT59GQE9PDPFM9WTQ1AA7GMIEZ7'
        },
        body: JSON.stringify({
          PlayFabId: playerId,
          Items: [{ ItemInstanceId: item.ItemInstanceId }]
        })
      });

      const revokeText = await revokeResponse.text();
      let revokeData = JSON.parse(revokeText);

      if (revokeData.code === 200) {
        return new Response(JSON.stringify({ success: true, data: revokeData }), {
          headers: { 'Content-Type': 'application/json' }
        });
      } else {
        return new Response(JSON.stringify({ success: false, error: revokeData.errorMessage || JSON.stringify(revokeData) }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        });
      }
    }
  } catch (error) {
    return new Response(JSON.stringify({ success: false, error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
