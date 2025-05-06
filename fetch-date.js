const fs = require('fs');
const https = require('https');

https.get('https://ckan0.cf.opendata.inter.prod-toronto.ca/dataset/58efb906-0ba2-4e83-9a2e-a64f03a3d58e/resource/be812ddb-35d5-4d9d-9969-5aa9c084669b/download/clothing-drop-box-locations-4326.geojson', res => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    fs.mkdirSync('./data', { recursive: true });
    fs.writeFileSync('./data/clothing-dropboxes.geojson', data);
    console.log('GeoJSON fetched and saved!');
  });
});
