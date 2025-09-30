import React from 'react';
import { SearchIcon } from './Icons';

interface SearchBarProps {
  onSearch: (location: string) => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  filters: { price: string; rating: number; open: boolean };
  setFilters: (filters: { price: string; rating: number; open: boolean }) => void;
  sortOrder: string;
  setSortOrder: (order: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch, searchTerm, setSearchTerm, filters, setFilters, sortOrder, setSortOrder }) => {
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if(searchTerm.trim()) {
      onSearch(searchTerm.trim());
    }
  };

  return (
    <div className="bg-white p-4 rounded-xl shadow-md sticky top-4 z-10">
      <form onSubmit={handleSearchSubmit} className="flex flex-col md:flex-row items-center gap-4">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="e.g., Shibuya, Tokyo"
          aria-label="Search by location"
          className="flex-grow w-full md:w-auto px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-matcha-green focus:outline-none"
        />
        <button type="submit" className="w-full md:w-auto bg-matcha-green text-white font-bold py-2 px-6 rounded-lg hover:bg-matcha-green-light transition-colors flex items-center justify-center gap-2">
          <SearchIcon className="w-5 h-5" />
          <span>Search</span>
        </button>
      </form>
      <div className="mt-4 flex flex-wrap items-center gap-4 text-sm">
        <span className="font-semibold">Filter by:</span>
        <div className="flex items-center gap-4">
            <select
                value={filters.price}
                onChange={(e) => setFilters({ ...filters, price: e.target.value })}
                className="px-3 py-1 border border-gray-300 rounded-md bg-white focus:ring-1 focus:ring-matcha-green focus:outline-none"
            >
                <option value="all">Price</option>
                <option value="1">$</option>
                <option value="2">$$</option>
                <option value="3">$$$</option>
                <option value="4">$$$$</option>
            </select>
            <select
                value={filters.rating}
                onChange={(e) => setFilters({ ...filters, rating: parseInt(e.target.value, 10) })}
                className="px-3 py-1 border border-gray-300 rounded-md bg-white focus:ring-1 focus:ring-matcha-green focus:outline-none"
            >
                <option value="0">Rating</option>
                <option value="4">4+ Stars</option>
                <option value="3">3+ Stars</option>
                <option value="2">2+ Stars</option>
            </select>
            <label className="flex items-center gap-2 cursor-pointer">
                <input
                    type="checkbox"
                    checked={filters.open}
                    onChange={(e) => setFilters({ ...filters, open: e.target.checked })}
                    className="h-4 w-4 rounded border-gray-300 text-matcha-green focus:ring-matcha-green"
                />
                Open Now
            </label>
        </div>
        <div className="flex items-center gap-2 md:ml-auto">
            <span className="font-semibold">Sort by:</span>
            <select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
                className="px-3 py-1 border border-gray-300 rounded-md bg-white focus:ring-1 focus:ring-matcha-green focus:outline-none"
                >
                <option value="default">Default</option>
                <option value="rating">Rating (High to Low)</option>
                <option value="price">Price (Low to High)</option>
                <option value="distance">Distance (Nearest First)</option>
            </select>
        </div>
      </div>
    </div>
  );
};

export default SearchBar;