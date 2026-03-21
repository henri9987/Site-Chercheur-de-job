async function fetchCSV() {
  const res = await fetch('https://docs.google.com/spreadsheets/d/e/2PACX-1vT6MoqXH--QkcdfV3MrrYKxtjYYahiYx0eP29sde89bAsBHOI62tMtJoWexOvKZoUMQ1RnqgjmaLa0C/pub?gid=0&single=true&output=csv');
  const text = await res.text();
  const lines = text.split('\n');
  const headers = lines[0].split(',');
  const datePostIdx = headers.findIndex(h => h.trim() === 'Date post');
  const dateIdx = headers.findIndex(h => h.trim() === 'date');
  
  const datePosts = new Set();
  const dates = new Set();
  
  for (let i = 1; i < lines.length; i++) {
    // simple csv split
    const cols = lines[i].split(',');
    if (cols.length > Math.max(datePostIdx, dateIdx)) {
      datePosts.add(cols[datePostIdx]);
      dates.add(cols[dateIdx]);
    }
  }
  
  console.log('Unique Date posts:', Array.from(datePosts).slice(0, 10));
  console.log('Unique dates:', Array.from(dates).slice(0, 10));
}
fetchCSV();
