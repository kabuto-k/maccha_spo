
import React from 'react';
import type { Cafe } from '../types';
import { PinIcon, CheckCircleIcon } from './Icons';

interface MapViewProps {
  cafes: Cafe[];
  onSelectCafe: (cafe: Cafe) => void;
  visited: string[];
}

const MapView: React.FC<MapViewProps> = ({ cafes, onSelectCafe, visited }) => {
    // Normalize coordinates to fit within a 0-100 range for positioning
    const lats = cafes.map(c => c.lat);
    const lngs = cafes.map(c => c.lng);
    const minLat = Math.min(...lats);
    const maxLat = Math.max(...lats);
    const minLng = Math.min(...lngs);
    const maxLng = Math.max(...lngs);

    const latRange = maxLat - minLat || 1;
    const lngRange = maxLng - minLng || 1;

    return (
        <div 
          className="relative w-full h-[60vh] md:h-[70vh] bg-cover bg-center rounded-2xl shadow-lg overflow-hidden" 
          style={{ backgroundImage: `url('https://picsum.photos/seed/mapbg/1600/1200')` }}
          aria-label="Simulated map of cafes"
        >
            <div className="absolute inset-0 bg-black/20 backdrop-blur-sm"></div>
            {cafes.map((cafe) => {
                const top = ((cafe.lat - minLat) / latRange) * 90 + 5; // % position with padding
                const left = ((cafe.lng - minLng) / lngRange) * 90 + 5; // % position with padding
                const isVisited = visited.includes(cafe.id);

                return (
                    <button
                        key={cafe.id}
                        onClick={() => onSelectCafe(cafe)}
                        className="absolute transform -translate-x-1/2 -translate-y-full focus:outline-none focus:ring-2 focus:ring-white rounded-full"
                        style={{ top: `${top}%`, left: `${left}%` }}
                        aria-label={`View details for ${cafe.name}`}
                    >
                        <div className="relative group">
                            <PinIcon className={`w-10 h-10 drop-shadow-lg transition-transform group-hover:scale-110 ${isVisited ? 'text-matcha-green-light' : 'text-matcha-green'}`} />
                            {isVisited && <CheckCircleIcon className="absolute -top-1 -right-1 w-5 h-5 text-white bg-matcha-green rounded-full" />}
                            <div className="absolute bottom-full mb-2 w-max max-w-xs px-3 py-2 text-sm font-medium text-white bg-matcha-brown rounded-lg shadow-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                                {cafe.name}
                                <div className="tooltip-arrow" data-popper-arrow></div>
                            </div>
                        </div>
                    </button>
                );
            })}
        </div>
    );
};

export default MapView;
