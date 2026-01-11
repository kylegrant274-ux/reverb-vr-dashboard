export async function onRequestPost(context) {
  const { request } = context;
  
  const { playerId, itemId, action } = await request.json();

  try {
    if (action === 'add') {
      // Add item with correct catalog version
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
      const data = JSON.parse(text);

      if (data.code === 200) {
        return new Response(JSON.stringify({ success: true }), {
          headers: { 'Content-Type': 'application/json' }
        });
      } else {
        return new Response(JSON.stringify({ success: false, error: data.errorMessage }), {
          headers: { 'Content-Type': 'application/json' }
        });
      }
    } else {
      // Remove item - first get inventory to find ItemInstanceId
      const invResponse = await fetch('https://1620F0.playfabapi.com/Server/GetUserInventory', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-SecretKey': 'WS6N34UHIP64N56QEGX45UGXT59GQE9PDPFM9WTQ1AA7GMIEZ7'
        },
        body: JSON.stringify({ PlayFabId: playerId })
      });

      const invText = await invResponse.text();
      const invData = JSON.parse(invText);

      if (invData.code !== 200) {
        return new Response(JSON.stringify({ success: false, error: 'Failed to get inventory' }), {
          headers: { 'Content-Type': 'application/json' }
        });
      }

      const item = invData.data.Inventory.find(i => i.ItemId === itemId);
      if (!item) {
        return new Response(JSON.stringify({ success: false, error: 'Item not found in inventory' }), {
          headers: { 'Content-Type': 'application/json' }
        });
      }

      // Now revoke the item using its instance ID
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
      const revokeData = JSON.parse(revokeText);

      if (revokeData.code === 200) {
        return new Response(JSON.stringify({ success: true }), {
          headers: { 'Content-Type': 'application/json' }
        });
      } else {
        return new Response(JSON.stringify({ success: false, error: revokeData.errorMessage }), {
          headers: { 'Content-Type': 'application/json' }
        });
      }
    }
  } catch (error) {
    return new Response(JSON.stringify({ success: false, error: error.message }), {
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
```

Push:
```
git add .
git commit -m "fix add-item with correct playfab flow"
git push