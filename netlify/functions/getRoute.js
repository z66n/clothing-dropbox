// netlify/functions/getRoute.js
const fetch = require('node-fetch');

exports.handler = async function(event, context) {
  const { startLat, startLng, endLat, endLng } = event.queryStringParameters;

  // Secret API key stored as an environment variable
  const apiKey = process.env.ORS_API_KEY;

  const url = `https://api.openrouteservice.org/v2/directions/foot-walking?api_key=${apiKey}&start=${startLng},${startLat}&end=${endLng},${endLat}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    return {
      statusCode: 200,
      body: JSON.stringify(data),
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to fetch route', details: err.message }),
    };
  }
};
