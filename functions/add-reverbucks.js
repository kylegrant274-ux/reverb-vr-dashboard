export async function onRequest(context) {
  const request = context.request;
  
  if (request.method === 'POST') {
    const { playerId, amount, reason } = await request.json();

    try {
      const response = await fetch('https://1620F0.playfabapi.com/Server/AddUserVirtualCurrency', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-SecretKey': 'WS6N34UHIP64N56QEGX45UGXT59GQE9PDPFM9WTQ1AA7GMIEZ7'
        },
        body: JSON.stringify({
          PlayFabId: playerId,
          VirtualCurrency: 'RB',
          Amount: parseInt(amount)
        })
      });

      const text = await response.text();
      
      try {
        const data = JSON.parse(text);
        if (data.code === 'OK') {
          return new Response(JSON.stringify({ success: true, data }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
          });
        } else {
          return new Response(JSON.stringify({ success: false, error: data.errorMessage || 'PlayFab error' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' }
          });
        }
      } catch (parseError) {
        return new Response(JSON.stringify({ success: false, error: `Invalid response: ${text}` }), {
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

  return new Response('Method not allowed', { status: 405 });
}