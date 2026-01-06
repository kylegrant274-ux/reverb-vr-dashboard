export default {
  async fetch(request) {
    if (request.method !== 'POST') {
      return new Response('Method not allowed', { status: 405 });
    }

    try {
      const { playerId, itemId, action } = await request.json();

      const endpoint = action === 'remove' 
        ? 'https://1620F0.playfabapi.com/Server/RevokeInventoryItems'
        : 'https://1620F0.playfabapi.com/Server/GrantItemsToUser';

      const body = action === 'remove'
        ? { PlayFabId: playerId, Items: [{ ItemId: itemId }] }
        : { PlayFabId: playerId, ItemIds: [itemId] };

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-SecretKey': 'WS6N34UHIP64N56QEGX45UGXT59GQE9PDPFM9WTQ1AA7GMIEZ7'
        },
        body: JSON.stringify(body)
      });

      const text = await response.text();
      if (!text) {
        return new Response(JSON.stringify({ success: true }), {
          headers: { 'Content-Type': 'application/json' }
        });
      }

      const data = JSON.parse(text);
      return new Response(JSON.stringify({ 
        success: data.status === 'OK' || data.code === 200 
      }), {
        headers: { 'Content-Type': 'application/json' }
      });
    } catch (e) {
      return new Response(JSON.stringify({ success: false, error: e.message }), {
        headers: { 'Content-Type': 'application/json' }
      });
    }
  }
};
