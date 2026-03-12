import React from 'react';
import { X } from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  filters: {
    contract: string[];
    remote: string[];
  };
  setFilters: React.Dispatch<React.SetStateAction<{
    contract: string[];
    remote: string[];
  }>>;
}

export default function Sidebar({ isOpen, onClose, filters, setFilters }: SidebarProps) {
  const handleContractChange = (val: string) => {
    setFilters(prev => ({
      ...prev,
      contract: prev.contract.includes(val) 
        ? prev.contract.filter(c => c !== val)
        : [...prev.contract, val]
    }));
  };

  const handleRemoteChange = (val: string) => {
    setFilters(prev => ({
      ...prev,
      remote: prev.remote.includes(val) 
        ? prev.remote.filter(r => r !== val)
        : [...prev.remote, val]
    }));
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={onClose}
        />
      )}
      
      <div className={`
        fixed inset-y-0 left-0 z-50 w-72 bg-white shadow-xl transform transition-transform duration-300 ease-in-out
        md:relative md:translate-x-0 md:shadow-none md:w-[280px] md:flex-shrink-0 md:bg-transparent
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="h-full flex flex-col p-6 md:p-0 overflow-y-auto">
          <div className="flex items-center justify-between md:hidden mb-6">
            <h2 className="text-xl font-bold text-gray-900">Filtres</h2>
            <button onClick={onClose} className="p-2 text-gray-500 hover:text-gray-900">
              <X className="h-6 w-6" />
            </button>
          </div>

          <div className="space-y-8">
            {/* Contract Type */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase mb-4">Type de contrat</h3>
              <div className="space-y-3">
                {['CDI', 'CDD', 'Stage', 'Alternance', 'Intérim'].map((type) => (
                  <label key={type} className="flex items-center">
                    <input
                      type="checkbox"
                      className="h-4 w-4 text-[var(--color-primary)] focus:ring-[var(--color-primary)] border-gray-300 rounded"
                      checked={filters.contract.includes(type)}
                      onChange={() => handleContractChange(type)}
                    />
                    <span className="ml-3 text-sm text-gray-600">{type}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Remote Work */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase mb-4">Télétravail</h3>
              <div className="space-y-3">
                {['Télétravail total', 'Télétravail partiel', 'Pas de télétravail'].map((type) => (
                  <label key={type} className="flex items-center">
                    <input
                      type="checkbox"
                      className="h-4 w-4 text-[var(--color-primary)] focus:ring-[var(--color-primary)] border-gray-300 rounded"
                      checked={filters.remote.includes(type)}
                      onChange={() => handleRemoteChange(type)}
                    />
                    <span className="ml-3 text-sm text-gray-600">{type}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Salary Range */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase mb-4">Salaire minimum</h3>
              <select className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] sm:text-sm rounded-md">
                <option>Tous les salaires</option>
                <option>Dès 30 000 €</option>
                <option>Dès 40 000 €</option>
                <option>Dès 50 000 €</option>
                <option>Dès 60 000 €</option>
              </select>
            </div>

            {/* Date Posted */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase mb-4">Date de publication</h3>
              <select className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] sm:text-sm rounded-md">
                <option>Toutes les dates</option>
                <option>Aujourd'hui</option>
                <option>3 derniers jours</option>
                <option>7 derniers jours</option>
                <option>14 derniers jours</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
