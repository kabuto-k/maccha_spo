import React from 'react';
import type { Cafe } from '../types';
import { StarIcon, HeartIcon, CheckCircleIcon, DistanceIcon } from './Icons';

interface CafeListProps {
  cafes: Cafe[];
  onSelectCafe: (cafe: Cafe) => void;
  visited: string[];
  favorites: string[];
  toggleFavorite: (cafeId: string) => void;
}

const CafeList: React.FC<CafeListProps> = ({ cafes, onSelectCafe, visited, favorites, toggleFavorite }) => {
  if (cafes.length === 0) {
    return <div className="text-center py-10 text-matcha-gray">No cafes found. Try a different location!</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {cafes.map(cafe => (
        <div key={cafe.id} className="bg-white rounded-2xl shadow-lg overflow-hidden transform hover:-translate-y-1 transition-transform duration-300 flex flex-col">
          <div className="relative">
            <img src={cafe.photoUrl} alt={cafe.name} className="w-full h-48 object-cover cursor-pointer" onClick={() => onSelectCafe(cafe)} />
            {visited.includes(cafe.id) && (
              <div className="absolute top-3 left-3 bg-matcha-green text-white text-xs font-bold px-2 py-1 rounded-full flex items-center">
                <CheckCircleIcon className="w-4 h-4 mr-1"/> VISITED
              </div>
            )}
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleFavorite(cafe.id);
              }}
              className="absolute top-3 right-3 bg-white/80 p-2 rounded-full text-matcha-brown hover:text-red-500 transition-colors"
              aria-label={favorites.includes(cafe.id) ? 'Remove from favorites' : 'Add to favorites'}
            >
              <HeartIcon className={`w-6 h-6 ${favorites.includes(cafe.id) ? 'text-red-500' : 'text-gray-400'}`} />
            </button>
          </div>
          <div className="p-5 flex-grow flex flex-col">
            <h3 className="text-xl font-bold text-matcha-brown mb-2 truncate cursor-pointer" onClick={() => onSelectCafe(cafe)}>{cafe.name}</h3>
            <p className="text-sm text-matcha-gray flex-grow">{cafe.address}</p>
            <div className="flex justify-between items-center mt-4">
              <div className="flex items-center">
                <StarIcon className="w-5 h-5 text-yellow-400 mr-1" />
                <span className="font-semibold">{cafe.rating.toFixed(1)}</span>
                {cafe.distance !== undefined && (
                    <span className="ml-3 flex items-center text-sm text-matcha-gray">
                      <DistanceIcon className="w-4 h-4 mr-1" />
                      {cafe.distance.toFixed(1)} km
                    </span>
                )}
              </div>
              <span className="text-matcha-green font-bold text-lg">{'$'.repeat(cafe.priceRange)}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CafeList;