const https = require('https');

https.get('https://api.sunrise-sunset.org/json?lat=28.6139&lng=77.209&formatted=0', (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => console.log('Success:', data));
}).on('error', (err) => console.error('Error:', err.message));