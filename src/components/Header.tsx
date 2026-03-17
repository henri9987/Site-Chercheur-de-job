import React from 'react';
import { Search, MapPin, Briefcase } from 'lucide-react';

interface Category {
  id: string;
  name: string;
  gid: string;
}

interface HeaderProps {
  keyword: string;
  setKeyword: (val: string) => void;
  location: string;
  setLocation: (val: string) => void;
  onSearch: () => void;
  categories: Category[];
  activeCategoryId: string;
  onCategoryChange: (id: string) => void;
}

export default function Header({ 
  keyword, 
  setKeyword, 
  location, 
  setLocation, 
  onSearch,
  categories,
  activeCategoryId,
  onCategoryChange
}: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Briefcase className="h-8 w-8 text-[var(--color-primary)]" />
            <span className="ml-2 text-xl font-bold text-gray-900">HelloJob</span>
          </div>
          <nav className="hidden md:flex space-x-8">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => onCategoryChange(cat.id)}
                className={`font-medium transition-colors ${
                  activeCategoryId === cat.id 
                    ? 'text-[var(--color-primary)] border-b-2 border-[var(--color-primary)]' 
                    : 'text-gray-500 hover:text-[var(--color-primary)]'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </nav>
          <div className="flex items-center space-x-4">
            <button className="text-gray-500 hover:text-gray-900 font-medium">Connexion</button>
            <button className="bg-[var(--color-primary)] text-white px-4 py-2 rounded-lg font-medium hover:bg-[var(--color-primary-hover)] transition-colors">
              Créer un CV
            </button>
          </div>
        </div>
        
        {/* Mobile Categories */}
        <div className="md:hidden flex overflow-x-auto py-2 space-x-4 no-scrollbar border-t border-gray-100">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => onCategoryChange(cat.id)}
              className={`whitespace-nowrap px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                activeCategoryId === cat.id 
                  ? 'bg-[var(--color-primary)] text-white' 
                  : 'text-gray-500 bg-gray-100 hover:bg-gray-200'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
        
        {/* Search Bar */}
        <div className="py-4 pb-6">
          <div className="flex flex-col md:flex-row gap-2 max-w-4xl mx-auto">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] sm:text-sm"
                placeholder="Métier, mot-clé, entreprise..."
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && onSearch()}
              />
            </div>
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MapPin className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] sm:text-sm"
                placeholder="Ville, département, région..."
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && onSearch()}
              />
            </div>
            <button 
              onClick={onSearch}
              className="w-full md:w-auto bg-[var(--color-primary)] text-white px-8 py-3 rounded-lg font-medium hover:bg-[var(--color-primary-hover)] transition-colors"
            >
              Rechercher
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
