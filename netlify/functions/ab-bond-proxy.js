const https = require('https');

exports.handler = async (event) => {
  const GAS_PWD = process.env.GAS_PWD;
  const GAS_BASE_URL = process.env.GAS_URL; 

  if (!GAS_PWD || !GAS_BASE_URL) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Missing environment variables' })
    };
  }

  const fullUrl = `${GAS_BASE_URL}?pwd=${GAS_PWD}`;

  return new Promise((resolve) => {
    https.get(fullUrl, (resp) => {
      let data = '';
      resp.on('data', (chunk) => { data += chunk; });
      resp.on('end', () => {
        resolve({
          statusCode: 200,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
          },
          body: data
        });
      });
    }).on('error', (error) => {
      resolve({
        statusCode: 500,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ error: 'Failed to fetch data' })
      });
    });
  });
};
