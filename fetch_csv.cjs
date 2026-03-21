const https = require('https');

https.get('https://docs.google.com/spreadsheets/d/e/2PACX-1vT6MoqXH--QkcdfV3MrrYKxtjYYahiYx0eP29sde89bAsBHOI62tMtJoWexOvKZoUMQ1RnqgjmaLa0C/pub?gid=0&single=true&output=csv', (res) => {
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
    if (data.split('\n').length > 2) {
      console.log(data.split('\n').slice(0, 2).join('\n'));
      process.exit(0);
    }
  });
});
