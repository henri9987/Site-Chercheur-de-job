/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import JobCard from './components/JobCard';
import Pagination from './components/Pagination';
import { fetchJobs } from './utils/csvParser';
import { Job } from './types';
import { Filter } from 'lucide-react';

const ITEMS_PER_PAGE = 10;

export default function App() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [keyword, setKeyword] = useState('');
  const [location, setLocation] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  
  const [filters, setFilters] = useState<{
    contract: string[];
    remote: string[];
  }>({
    contract: [],
    remote: [],
  });

  useEffect(() => {
    const loadJobs = async () => {
      try {
        const data = await fetchJobs();
        setJobs(data);
      } catch (err) {
        setError('Erreur lors du chargement des offres.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadJobs();
  }, []);

  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      // Keyword match
      if (keyword && !job.title.toLowerCase().includes(keyword.toLowerCase()) && !job.company.toLowerCase().includes(keyword.toLowerCase())) {
        return false;
      }
      
      // Location match
      if (location && !job.location.toLowerCase().includes(location.toLowerCase())) {
        return false;
      }

      // Contract filter
      if (filters.contract.length > 0 && !filters.contract.includes(job.contractType)) {
        return false;
      }

      // Remote filter
      if (filters.remote.length > 0) {
        const isRemote = job.remote.toLowerCase().includes('télétravail');
        if (filters.remote.includes('Télétravail total') && !job.remote.toLowerCase().includes('total')) return false;
        if (filters.remote.includes('Télétravail partiel') && !job.remote.toLowerCase().includes('partiel') && !job.remote.toLowerCase().includes('occasionnel')) return false;
        if (filters.remote.includes('Pas de télétravail') && isRemote) return false;
      }

      return true;
    });
  }, [jobs, keyword, location, filters]);

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
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          
          {/* Mobile filter toggle */}
          <div className="md:hidden flex justify-between items-center mb-4">
            <h1 className="text-xl font-bold text-gray-900">{filteredJobs.length} offres d'emploi</h1>
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="flex items-center gap-2 bg-white border border-gray-300 px-4 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              <Filter className="h-4 w-4" />
              Filtres
            </button>
          </div>

          {/* Sidebar */}
          <Sidebar 
            isOpen={isSidebarOpen} 
            onClose={() => setIsSidebarOpen(false)} 
            filters={filters}
            setFilters={setFilters}
          />

          {/* Main Content */}
          <div className="flex-1">
            <div className="hidden md:block mb-6">
              <h1 className="text-2xl font-bold text-gray-900">{filteredJobs.length} offres d'emploi</h1>
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
