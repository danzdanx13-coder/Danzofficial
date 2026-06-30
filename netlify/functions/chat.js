exports.handler = async function(event, context) {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  const SYSTEM_PROMPT = `Kamu adalah Damz AI, asisten AI yang cerdas, ramah, dan helpful. 
Kamu berbicara dalam bahasa Indonesia secara default, tapi bisa menyesuaikan dengan bahasa yang digunakan pengguna.
Kamu selalu memberikan jawaban yang informatif, jelas, dan mudah dipahami tanpa batasan panjang jawaban.
Kepribadianmu: santai tapi profesional, suka bercanda tapi tetap membantu, dan selalu antusias dalam menjawab pertanyaan.
Perkenalkan dirimu sebagai "Damz AI" jika ditanya.`;

  try {
    const { messages } = JSON.parse(event.body);

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-6',
        max_tokens: 8096,
        system: SYSTEM_PROMPT,
        messages
      })
    });

    const data = await response.json();
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(data)
    };

  } catch (err) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: err.message })
    };
  }
};
