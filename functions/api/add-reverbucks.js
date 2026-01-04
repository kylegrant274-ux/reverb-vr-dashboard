export async function onRequestPost(context) {
  const { request } = context;
  
  const { playerId, amount, reason } = await request.json();

  try {
    const response = await fetch('https://1620F0.playfabapi.com/Server/AddUserVirtualCurrency', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-SecretKey': 'YOUR_REAL_SECRET_KEY_HERE'
      },
      body: JSON.stringify({
        TitleId: '1620F0',
        PlayFabId: playerId,
        VirtualCurrency: 'RB',
        Amount: parseInt(amount)
      })
    });

    const data = await response.json();
    return new Response(JSON.stringify({ success: true, data }), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ success: false, error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
