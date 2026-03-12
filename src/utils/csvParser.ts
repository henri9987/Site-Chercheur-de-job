import Papa from 'papaparse';
import { Job } from '../types';

export const fetchJobs = async (): Promise<Job[]> => {
  const url = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vT6MoqXH--QkcdfV3MrrYKxtjYYahiYx0eP29sde89bAsBHOI62tMtJoWexOvKZoUMQ1RnqgjmaLa0C/pub?gid=0&single=true&output=csv';
  
  return new Promise((resolve, reject) => {
    Papa.parse(url, {
      download: true,
      header: true,
      complete: (results) => {
        const parsedJobs: Job[] = results.data.map((row: any, index: number) => {
          if (!row.title) return null;
          
          // Extract company from title or description
          let company = 'Entreprise Inconnue';
          if (row.title.includes(' - ')) {
            const parts = row.title.split(' - ');
            if (parts.length >= 2) {
              company = parts[1].trim();
            }
          }

          // Extract location
          let location = 'Non spécifié';
          if (row.title.toLowerCase().includes('lyon')) location = 'Lyon';
          else if (row.title.toLowerCase().includes('grenoble')) location = 'Grenoble';
          else if (row.title.toLowerCase().includes('echirolles')) location = 'Echirolles';
          else if (row.description && row.description.toLowerCase().includes('lyon')) location = 'Lyon';

          // Extract contract type
          let contractType = 'Non spécifié';
          if (row.title.toLowerCase().includes('cdi') || (row.description && row.description.toLowerCase().includes('cdi'))) contractType = 'CDI';
          else if (row.title.toLowerCase().includes('cdd') || (row.description && row.description.toLowerCase().includes('cdd'))) contractType = 'CDD';
          else if (row.title.toLowerCase().includes('stage') || (row.description && row.description.toLowerCase().includes('stage'))) contractType = 'Stage';
          else if (row.title.toLowerCase().includes('alternance') || (row.description && row.description.toLowerCase().includes('alternance'))) contractType = 'Alternance';

          // Extract salary
          let salary = 'Non spécifié';
          const salaryMatch = row.description ? row.description.match(/Salaire\s*:\s*([^;]+)/i) : null;
          if (salaryMatch && salaryMatch[1]) {
            salary = salaryMatch[1].trim();
          }

          // Extract remote
          let remote = 'Non spécifié';
          if (row.description && row.description.toLowerCase().includes('télétravail')) {
            const remoteMatch = row.description.match(/Télétravail\s*([^;]+)/i);
            if (remoteMatch && remoteMatch[1]) {
              remote = 'Télétravail ' + remoteMatch[1].trim();
            } else {
              remote = 'Télétravail possible';
            }
          }

          const tags = [];
          if (contractType !== 'Non spécifié') tags.push(contractType);
          if (location !== 'Non spécifié') tags.push(location);
          if (remote !== 'Non spécifié') tags.push(remote);

          return {
            id: row.position || String(index),
            title: row.title,
            company: company,
            location: location,
            contractType: contractType,
            salary: salary,
            remote: remote,
            description: row.description,
            source: row.source,
            datePost: row['Date post'] || row.date,
            link: row.link,
            tags: tags,
          };
        }).filter(Boolean) as Job[];
        
        resolve(parsedJobs);
      },
      error: (error) => {
        reject(error);
      }
    });
  });
};
