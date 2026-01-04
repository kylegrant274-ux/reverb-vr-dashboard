export async function onRequestPost(context) {
  const { request } = context;
  
  const { playerId, amount, action, reason } = await request.json();

  try {
    const amountToSend = action === 'remove' ? -parseInt(amount) : parseInt(amount);

    const requestBody = {
      PlayFabId: playerId,
      VirtualCurrency: 'RB',
      Amount: amountToSend
    };

    const response = await fetch('https://1620F0.playfabapi.com/Server/SubtractUserVirtualCurrency', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-SecretKey': 'WS6N34UHIP64N56QEGX45UGXT59GQE9PDPFM9WTQ1AA7GMIEZ7'
      },
      body: JSON.stringify({
        PlayFabId: playerId,
        VirtualCurrency: 'RB',
        Amount: action === 'remove' ? parseInt(amount) : 0
      })
    });

    if (action === 'remove' && response.ok) {
      return new Response(JSON.stringify({ success: true }), {
        headers: { 'Content-Type': 'application/json' }
      });
    }

    if (action === 'add') {
      const addResponse = await fetch('https://1620F0.playfabapi.com/Server/AddUserVirtualCurrency', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-SecretKey': 'WS6N34UHIP64N56QEGX45UGXT59GQE9PDPFM9WTQ1AA7GMIEZ7'
        },
        body: JSON.stringify(requestBody)
      });

      const text = await addResponse.text();
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
    }

    return new Response(JSON.stringify({ success: false, error: 'Invalid action' }), {
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