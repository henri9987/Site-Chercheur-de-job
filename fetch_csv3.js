import Papa from 'papaparse';

async function fetchCSV() {
  const res = await fetch('https://docs.google.com/spreadsheets/d/e/2PACX-1vT6MoqXH--QkcdfV3MrrYKxtjYYahiYx0eP29sde89bAsBHOI62tMtJoWexOvKZoUMQ1RnqgjmaLa0C/pub?gid=0&single=true&output=csv');
  const text = await res.text();
  
  Papa.parse(text, {
    header: true,
    complete: (results) => {
      const datePosts = new Set();
      const dates = new Set();
      
      results.data.forEach(row => {
        if (row['Date post']) datePosts.add(row['Date post']);
        if (row['date']) dates.add(row['date']);
      });
      
      console.log('Unique Date posts:', Array.from(datePosts).slice(0, 20));
      console.log('Unique dates:', Array.from(dates).slice(0, 20));
    }
  });
}
fetchCSV();
