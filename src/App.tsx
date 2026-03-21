/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import Header from './components/Header';
import JobCard from './components/JobCard';
import Pagination from './components/Pagination';
import { fetchJobs } from './utils/csvParser';
import { Job } from './types';

const ITEMS_PER_PAGE = 10;

const CATEGORIES = [
  { id: 'moa', name: 'MOA', gid: '0' },
  { id: 'moe', name: 'MOE', gid: '1936288267' },
  { id: 'entr_trvx', name: 'Entr trvx', gid: '2115456946' },
  { id: 'fourn', name: 'Fourn', gid: '1715631405' },
];

export default function App() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [activeCategoryId, setActiveCategoryId] = useState(CATEGORIES[0].id);
  const [keyword, setKeyword] = useState('');
  const [location, setLocation] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const loadJobs = async () => {
      setLoading(true);
      setError(null);
      try {
        const activeCategory = CATEGORIES.find(c => c.id === activeCategoryId);
        const data = await fetchJobs(activeCategory?.gid || '0');
        setJobs(data);
        setCurrentPage(1); // Reset page when category changes
      } catch (err) {
        setError('Erreur lors du chargement des offres.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadJobs();
  }, [activeCategoryId]);

  const parseDate = (dateStr: string) => {
    if (!dateStr) return 0;
    const parts = dateStr.split('/');
    if (parts.length === 3) {
      const [day, month, year] = parts;
      return new Date(parseInt(year), parseInt(month) - 1, parseInt(day)).getTime();
    }
    return 0;
  };

  const uniqueDates = useMemo(() => {
    const dates = new Set<string>(jobs.map(j => j.date).filter(Boolean));
    return Array.from(dates).sort((a, b) => parseDate(b) - parseDate(a));
  }, [jobs]);

  const filteredJobs = useMemo(() => {
    let result = jobs.filter((job) => {
      // Keyword match
      if (keyword && !job.title.toLowerCase().includes(keyword.toLowerCase()) && !job.company.toLowerCase().includes(keyword.toLowerCase())) {
        return false;
      }
      
      // Location match
      if (location && !job.location.toLowerCase().includes(location.toLowerCase())) {
        return false;
      }

      // Date match
      if (dateFilter && job.date !== dateFilter) {
        return false;
      }

      return true;
    });

    // Sort by date descending
    result.sort((a, b) => {
      const dateA = parseDate(a.date);
      const dateB = parseDate(b.date);
      return dateB - dateA;
    });

    return result;
  }, [jobs, keyword, location, dateFilter]);

  const totalPages = Math.ceil(filteredJobs.length / ITEMS_PER_PAGE);
  const currentJobs = filteredJobs.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const handleSearch = () => {
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen bg-[var(--color-bg-main)] font-sans text-[var(--color-text-main)]">
      <Header 
        keyword={keyword} 
        setKeyword={setKeyword} 
        location={location} 
        setLocation={setLocation} 
        onSearch={handleSearch} 
        categories={CATEGORIES}
        activeCategoryId={activeCategoryId}
        onCategoryChange={setActiveCategoryId}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col gap-8">
          
          {/* Mobile Title */}
          <div className="md:hidden flex flex-col gap-4 mb-4">
            <h1 className="text-xl font-bold text-gray-900">
              {filteredJobs.length} {CATEGORIES.find(c => c.id === activeCategoryId)?.name}
            </h1>
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="w-full bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] block p-2.5"
            >
              <option value="">Toutes les dates d'offre</option>
              {uniqueDates.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            <div className="hidden md:flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold text-gray-900">
                {filteredJobs.length} {CATEGORIES.find(c => c.id === activeCategoryId)?.name}
              </h1>
              <select
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] block p-2.5 min-w-[200px]"
              >
                <option value="">Toutes les dates d'offre</option>
                {uniqueDates.map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>

            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--color-primary)]"></div>
              </div>
            ) : error ? (
              <div className="bg-red-50 text-red-800 p-4 rounded-lg">
                {error}
              </div>
            ) : currentJobs.length === 0 ? (
              <div className="bg-white border border-gray-200 rounded-xl p-8 text-center">
                <h3 className="text-lg font-medium text-gray-900">Aucune offre trouvée</h3>
                <p className="mt-2 text-gray-500">Essayez de modifier vos critères de recherche.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {currentJobs.map((job) => (
                  <JobCard key={job.id} job={job} />
                ))}
              </div>
            )}

            <Pagination 
              currentPage={currentPage} 
              totalPages={totalPages} 
              onPageChange={setCurrentPage} 
            />
          </div>
        </div>
      </main>

      <footer className="bg-white border-t border-gray-200 mt-12 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-gray-500 text-sm">
            &copy; 2026 HelloJob. Tous droits réservés.
          </div>
        </div>
      </footer>
    </div>
  );
}
