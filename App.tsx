import React, { useState, useEffect, useCallback } from 'react';
import type { Cafe, Review } from './types';
import { findCafesNear, fetchCafeReviews } from './services/googleMapsService';
import { getFavorites, getReviews, getVisited, setFavorites, setReviews, setVisited, getCafeEdits, setCafeEdits } from './services/storageService';
import Header from './components/Header';
import MapView from './components/MapView';
import CafeList from './components/CafeList';
import CafeDetailModal from './components/CafeDetailModal';
import SearchBar from './components/SearchBar';
import { LoadingIcon } from './components/Icons';

const getDistanceFromLatLonInKm = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371; // Radius of the earth in km
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in km
};

export default function App() {
  const [cafes, setCafes] = useState<Cafe[]>([]);
  const [filteredCafes, setFilteredCafes] = useState<Cafe[]>([]);
  const [selectedCafe, setSelectedCafe] = useState<Cafe | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [view, setView] = useState<'map' | 'list'>('map');

  const [favorites, setFavoritesState] = useState<string[]>([]);
  const [visited, setVisitedState] = useState<string[]>([]);
  const [reviews, setReviewsState] = useState<Record<string, Review>>({});
  const [cafeEdits, setCafeEditsState] = useState<Record<string, Partial<Cafe>>>({});
  
  const [filters, setFilters] = useState({ price: 'all', rating: 0, open: false });
  const [searchTerm, setSearchTerm] = useState<string>('Tokyo Station');
  const [sortOrder, setSortOrder] = useState<string>('default');

  const [publicReviews, setPublicReviews] = useState<Review[]>([]);
  const [areReviewsLoading, setAreReviewsLoading] = useState(false);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);

  useEffect(() => {
    setFavoritesState(getFavorites());
    setVisitedState(getVisited());
    setReviewsState(getReviews());
    setCafeEditsState(getCafeEdits());

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (err) => {
          console.error("Geolocation error:", err);
        }
      );
    }
  }, []);

  useEffect(() => {
    if (selectedCafe) {
      const loadReviews = async () => {
        setAreReviewsLoading(true);
        setPublicReviews([]); // Clear old reviews
        try {
          // Use selectedCafe.id which corresponds to place_id
          const fetchedReviews = await fetchCafeReviews(selectedCafe.id);
          setPublicReviews(fetchedReviews);
        } catch (e) {
          console.error("Failed to fetch reviews", e);
          setError("Could not load reviews for this cafe.");
        } finally {
          setAreReviewsLoading(false);
        }
      };
      loadReviews();
    }
  }, [selectedCafe]);

  const handleSearch = useCallback(async (location: string) => {
    setIsLoading(true);
    setError(null);
    try {
      // Now uses the Google Maps service
      const results = await findCafesNear(location);
      const localEdits = getCafeEdits();

      const cafesWithEdits = results.map((cafe) => {
        const edits = localEdits[cafe.id];
        return { ...cafe, ...edits };
      });

      setCafes(cafesWithEdits);
    } catch (err) {
      setError('Failed to fetch cafe data. Please check your API key and try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  useEffect(() => {
    handleSearch(searchTerm);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    let currentCafes: Cafe[] = [...cafes];

    // Calculate distances if user location is available
    if (userLocation) {
        currentCafes = currentCafes.map(cafe => ({
            ...cafe,
            distance: getDistanceFromLatLonInKm(userLocation.lat, userLocation.lng, cafe.lat, cafe.lng),
        }));
    }

    // Filtering
    if (filters.price !== 'all') {
      currentCafes = currentCafes.filter(c => c.priceRange === parseInt(filters.price, 10));
    }
    if (filters.rating > 0) {
      currentCafes = currentCafes.filter(c => c.rating >= filters.rating);
    }
    if (filters.open) {
      // Simplified check using data from Google Maps API
      currentCafes = currentCafes.filter(cafe => cafe.isOpenNow);
    }

    // Sorting
    if (sortOrder === 'rating') {
        currentCafes.sort((a, b) => b.rating - a.rating);
    } else if (sortOrder === 'price') {
        currentCafes.sort((a, b) => a.priceRange - b.priceRange);
    } else if (sortOrder === 'distance' && userLocation) {
        currentCafes.sort((a, b) => (a.distance ?? Infinity) - (b.distance ?? Infinity));
    }

    setFilteredCafes(currentCafes);
  }, [cafes, filters, sortOrder, userLocation]);

  const toggleFavorite = (cafeId: string) => {
    const newFavorites = favorites.includes(cafeId)
      ? favorites.filter(id => id !== cafeId)
      : [...favorites, cafeId];
    setFavoritesState(newFavorites);
    setFavorites(newFavorites);
  };

  const toggleVisited = (cafeId: string) => {
    const newVisited = visited.includes(cafeId)
      ? visited.filter(id => id !== cafeId)
      : [...visited, cafeId];
    setVisitedState(newVisited);
    setVisited(newVisited);
  };

  const addReview = (cafeId: string, review: Review) => {
    const newReviews = { ...reviews, [cafeId]: review };
    setReviewsState(newReviews);
    setReviews(newReviews);
    // Mark as visited when a review is added
    if (!visited.includes(cafeId)) {
        toggleVisited(cafeId);
    }
    setSelectedCafe(null); // Close modal after review
  };

  const handleEditCafe = (cafeId: string, edits: Partial<Cafe>) => {
    const newEdits = { ...cafeEdits[cafeId], ...edits };
    const newCafeEdits = { ...cafeEdits, [cafeId]: newEdits };
    
    setCafeEditsState(newCafeEdits);
    setCafeEdits(newCafeEdits);

    setCafes(prevCafes => 
      prevCafes.map(cafe => 
        cafe.id === cafeId ? { ...cafe, ...edits } : cafe
      )
    );
    setSelectedCafe(null); // Close modal after edit
  };

  return (
    <div className="bg-matcha-cream min-h-screen font-sans text-matcha-brown">
      <Header />
      <main className="p-4 md:p-6 lg:p-8">
        <SearchBar
          onSearch={handleSearch}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          filters={filters}
          setFilters={setFilters}
          sortOrder={sortOrder}
          setSortOrder={setSortOrder}
        />

        <div className="flex justify-center my-4">
            <div className="bg-white rounded-full p-1 shadow-md">
                <button onClick={() => setView('map')} className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${view === 'map' ? 'bg-matcha-green text-white' : 'text-matcha-brown'}`}>Map View</button>
                <button onClick={() => setView('list')} className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${view === 'list' ? 'bg-matcha-green text-white' : 'text-matcha-brown'}`}>List View</button>
            </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-96">
            <LoadingIcon />
            <span className="ml-4 text-lg">Finding the best Matcha Lattes...</span>
          </div>
        ) : error ? (
          <div className="text-center text-red-600 bg-red-100 p-4 rounded-lg">{error}</div>
        ) : (
          <div className="mt-4">
            {view === 'map' ? (
              <MapView cafes={filteredCafes} onSelectCafe={setSelectedCafe} visited={visited} />
            ) : (
              <CafeList cafes={filteredCafes} onSelectCafe={setSelectedCafe} visited={visited} favorites={favorites} toggleFavorite={toggleFavorite} />
            )}
          </div>
        )}
      </main>

      {selectedCafe && (
        <CafeDetailModal
          cafe={selectedCafe}
          onClose={() => setSelectedCafe(null)}
          onAddReview={addReview}
          onEditCafe={handleEditCafe}
          review={reviews[selectedCafe.id]}
          isFavorite={favorites.includes(selectedCafe.id)}
          isVisited={visited.includes(selectedCafe.id)}
          onToggleFavorite={toggleFavorite}
          onToggleVisited={toggleVisited}
          publicReviews={publicReviews}
          areReviewsLoading={areReviewsLoading}
        />
      )}
    </div>
  );
}