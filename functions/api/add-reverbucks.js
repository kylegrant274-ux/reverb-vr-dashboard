// functions/api/add-reverbucks.js
export async function onRequestPost(context) {
  const { request } = context;
  const { playerId, amount, action, reason } = await request.json();

  if (!playerId || !amount || !action) {
    return new Response(JSON.stringify({ success: false, error: 'Missing parameters' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
  }

  try {
    const body = {
      PlayFabId: playerId,
      VirtualCurrency: { RB: action === 'add' ? parseInt(amount) : -parseInt(amount) },
      Reason: reason || 'Manual grant'
    };

    const response = await fetch('https://1620F0.playfabapi.com/Server/AddUserVirtualCurrency', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-SecretKey': 'WS6N34UHIP64N56QEGX45UGXT59GQE9PDPFM9WTQ1AA7GMIEZ7'
      },
      body: JSON.stringify(body)
    });

    const data = await response.json();

    if (data.code === 200) {
      return new Response(JSON.stringify({ success: true, data }), { headers: { 'Content-Type': 'application/json' } });
    }

    return new Response(JSON.stringify({ success: false, error: data.errorMessage || JSON.stringify(data) }), {
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
