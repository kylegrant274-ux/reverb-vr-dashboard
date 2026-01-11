// functions/api/get-inventory.js
export async function onRequestPost(context) {
  const { request } = context;
  const { playerId } = await request.json();

  if (!playerId) {
    return new Response(JSON.stringify({ success: false, error: 'Missing playerId' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  try {
    const response = await fetch('https://1620F0.playfabapi.com/Server/GetUserInventory', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-SecretKey': 'WS6N34UHIP64N56QEGX45UGXT59GQE9PDPFM9WTQ1AA7GMIEZ7'
      },
      body: JSON.stringify({ PlayFabId: playerId })
    });

    const text = await response.text();
    const data = JSON.parse(text);

    if (data.code === 200 && data.data) {
      return new Response(JSON.stringify({ success: true, inventory: data.data.Inventory || [], virtualCurrency: data.data.VirtualCurrency || {} }), {
        headers: { 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify({ success: false, error: data.errorMessage || 'Failed to get inventory' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    return new Response(JSON.stringify({ success: false, error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
