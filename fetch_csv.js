async function fetchCSV() {
  const res = await fetch('https://docs.google.com/spreadsheets/d/e/2PACX-1vT6MoqXH--QkcdfV3MrrYKxtjYYahiYx0eP29sde89bAsBHOI62tMtJoWexOvKZoUMQ1RnqgjmaLa0C/pub?gid=0&single=true&output=csv');
  const text = await res.text();
  console.log(text.split('\n').slice(0, 2).join('\n'));
}
fetchCSV();
