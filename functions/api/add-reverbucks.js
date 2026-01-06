export async function onRequestPost(context) {
  const { request } = context;
  
  const { playerId, amount, action, reason } = await request.json();

  try {
    let endpoint, body;

    if (action === 'remove') {
      endpoint = 'https://1620F0.playfabapi.com/Server/SubtractUserVirtualCurrency';
      body = {
        PlayFabId: playerId,
        VirtualCurrency: 'RB',
        Amount: parseInt(amount)
      };
    } else {
      endpoint = 'https://1620F0.playfabapi.com/Server/AddUserVirtualCurrency';
      body = {
        PlayFabId: playerId,
        VirtualCurrency: 'RB',
        Amount: parseInt(amount)
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