import React, { useState } from 'react';
import type { Cafe, Review } from '../types';
import { StarIcon, HeartIcon, CheckCircleIcon, UploadIcon, LoadingIcon, ExternalLinkIcon, ShareIcon, EditIcon } from './Icons';

interface CafeDetailModalProps {
  cafe: Cafe;
  onClose: () => void;
  onAddReview: (cafeId: string, review: Review) => void;
  onEditCafe: (cafeId: string, edits: Partial<Pick<Cafe, 'name' | 'address' | 'hours' | 'description' | 'website'>>) => void;
  review?: Review;
  isFavorite: boolean;
  isVisited: boolean;
  onToggleFavorite: (cafeId: string) => void;
  onToggleVisited: (cafeId: string) => void;
  publicReviews: Review[];
  areReviewsLoading: boolean;
}

const RatingStars: React.FC<{ rating: number, className?: string }> = ({ rating, className="" }) => (
    <div className={`flex items-center ${className}`}>
        {[1, 2, 3, 4, 5].map((star) => (
            <StarIcon key={star} className={`w-5 h-5 ${star <= rating ? 'text-yellow-400' : 'text-gray-300'}`} />
        ))}
    </div>
);


const RatingInput: React.FC<{ rating: number; setRating: (rating: number) => void }> = ({ rating, setRating }) => (
    <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => (
            <button key={star} type="button" onClick={() => setRating(star)}>
                <StarIcon className={`w-8 h-8 cursor-pointer ${star <= rating ? 'text-yellow-400' : 'text-gray-300'}`} />
            </button>
        ))}
    </div>
);

const CafeDetailModal: React.FC<CafeDetailModalProps> = ({ cafe, onClose, onAddReview, onEditCafe, review, isFavorite, isVisited, onToggleFavorite, onToggleVisited, publicReviews, areReviewsLoading }) => {
  const [activeTab, setActiveTab] = useState<'details' | 'menu' | 'community' | 'my-review' | 'edit'>('details');
  
  // State for review form
  const [currentRating, setCurrentRating] = useState(review?.rating || 0);
  const [notes, setNotes] = useState(review?.notes || '');
  const [photo, setPhoto] = useState<string | undefined>(review?.photo);
  
  // State for edit form
  const [editFormState, setEditFormState] = useState({
    name: cafe.name,
    address: cafe.address,
    hours: cafe.hours,
    description: cafe.description,
    website: cafe.website || '',
  });

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onloadend = () => {
            setPhoto(reader.result as string);
        };
        reader.readAsDataURL(file);
    }
  };

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentRating > 0) {
      onAddReview(cafe.id, { rating: currentRating, notes, photo });
    }
  };

  const handleShare = async () => {
    const shareData = {
        title: cafe.name,
        text: `Check out this cafe: ${cafe.name}\nAddress: ${cafe.address}`,
        url: cafe.website,
    };

    if (navigator.share) {
        try {
            await navigator.share(shareData);
        } catch (err) {
            console.error('Share failed:', err);
        }
    } else {
        const shareText = `Cafe: ${shareData.title}\nAddress: ${cafe.address}${cafe.website ? `\nWebsite: ${cafe.website}` : ''}`;
        alert(`Share this cafe:\n\n${shareText}`);
    }
  };
  
  const handleEditFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditFormState(prevState => ({ ...prevState, [name]: value }));
  };

  const handleSubmitEdit = (e: React.FormEvent) => {
    e.preventDefault();
    onEditCafe(cafe.id, editFormState);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-matcha-cream rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>
        <div className="relative">
          <img src={cafe.photoUrl} alt={cafe.name} className="w-full h-64 object-cover rounded-t-2xl" />
          <button onClick={onClose} className="absolute top-4 right-4 bg-white/70 text-matcha-brown rounded-full w-8 h-8 flex items-center justify-center font-bold text-xl hover:bg-white">&times;</button>
          <div className="absolute bottom-0 left-0 bg-gradient-to-t from-black/70 to-transparent w-full p-6 text-white">
            <h2 className="text-3xl font-bold">{cafe.name}</h2>
            <p className="text-sm">{cafe.address}</p>
          </div>
        </div>
        
        <div className="p-6 flex-grow overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-4">
                    <div className="flex items-center bg-yellow-100 text-yellow-600 px-3 py-1 rounded-full">
                        <StarIcon className="w-5 h-5 mr-1" />
                        <span className="font-bold">{cafe.rating.toFixed(1)}</span>
                    </div>
                    <span className="text-matcha-green font-bold text-lg">{'$'.repeat(cafe.priceRange)}</span>
                </div>
                <div className="flex items-center gap-4">
                    <button onClick={() => onToggleVisited(cafe.id)} className="flex items-center gap-2 text-sm font-semibold text-matcha-brown hover:text-matcha-green transition-colors">
                        <CheckCircleIcon className={`w-6 h-6 ${isVisited ? 'text-matcha-green' : 'text-gray-300'}`} />
                        {isVisited ? 'Visited' : 'Mark as Visited'}
                    </button>
                    <button onClick={() => onToggleFavorite(cafe.id)} className="flex items-center gap-2 text-sm font-semibold text-matcha-brown hover:text-red-500 transition-colors">
                       <HeartIcon className={`w-6 h-6 ${isFavorite ? 'text-red-500' : 'text-gray-300'}`} />
                       {isFavorite ? 'Favorite' : 'Add to Favorites'}
                    </button>
                    <button onClick={handleShare} className="flex items-center gap-2 text-sm font-semibold text-matcha-brown hover:text-matcha-green transition-colors" aria-label={`Share ${cafe.name}`}>
                       <ShareIcon className="w-5 h-5" />
                       Share
                    </button>
                </div>
            </div>

            <div className="border-b border-matcha-green-light mb-4">
                <nav className="-mb-px flex space-x-6">
                    <button onClick={() => setActiveTab('details')} className={`py-3 px-1 border-b-2 font-semibold text-sm ${activeTab === 'details' ? 'border-matcha-green text-matcha-green' : 'border-transparent text-gray-500 hover:text-matcha-brown'}`}>Details</button>
                    <button onClick={() => setActiveTab('menu')} className={`py-3 px-1 border-b-2 font-semibold text-sm ${activeTab === 'menu' ? 'border-matcha-green text-matcha-green' : 'border-transparent text-gray-500 hover:text-matcha-brown'}`}>Menu</button>
                    <button onClick={() => setActiveTab('community')} className={`py-3 px-1 border-b-2 font-semibold text-sm ${activeTab === 'community' ? 'border-matcha-green text-matcha-green' : 'border-transparent text-gray-500 hover:text-matcha-brown'}`}>Community Reviews</button>
                    <button onClick={() => setActiveTab('my-review')} className={`py-3 px-1 border-b-2 font-semibold text-sm ${activeTab === 'my-review' ? 'border-matcha-green text-matcha-green' : 'border-transparent text-gray-500 hover:text-matcha-brown'}`}>{review ? 'Your Review' : 'Add Review'}</button>
                    <button onClick={() => setActiveTab('edit')} className={`py-3 px-1 border-b-2 font-semibold text-sm ${activeTab === 'edit' ? 'border-matcha-green text-matcha-green' : 'border-transparent text-gray-500 hover:text-matcha-brown'}`}>Edit Cafe</button>
                </nav>
            </div>
            
            <div className="prose max-w-none">
              {activeTab === 'details' && (
                <div className="space-y-3">
                  <p className="text-base leading-relaxed">{cafe.description}</p>
                  <p><strong>Hours:</strong> {cafe.hours}</p>
                  {cafe.distance !== undefined && (
                      <p><strong>Distance:</strong> Approximately {cafe.distance.toFixed(1)} km away</p>
                  )}
                  {cafe.website && (
                    <div className="flex items-center gap-2">
                        <strong>Website:</strong>
                        <a href={cafe.website} target="_blank" rel="noopener noreferrer" className="text-matcha-green hover:underline flex items-center gap-1">
                            <span>Visit Website</span>
                            <ExternalLinkIcon className="w-4 h-4" />
                        </a>
                    </div>
                  )}
                </div>
              )}
              {activeTab === 'menu' && (
                <ul className="space-y-2">
                  {cafe.menu.map(item => (
                    <li key={item.name} className="flex justify-between items-baseline p-2 rounded-lg even:bg-matcha-green/5">
                      <span className="font-semibold">{item.name}</span>
                      <span className="font-mono">{item.price}</span>
                    </li>
                  ))}
                </ul>
              )}
              {activeTab === 'community' && (
                  <div>
                      {areReviewsLoading ? (
                          <div className="flex justify-center items-center py-8">
                              <LoadingIcon />
                              <span className="ml-3">Loading reviews...</span>
                          </div>
                      ) : publicReviews.length > 0 ? (
                          <ul className="space-y-6">
                              {publicReviews.map((pubReview, index) => (
                                  <li key={index} className="flex items-start gap-4">
                                      {pubReview.photo && <img src={pubReview.photo} alt={`Review by ${pubReview.reviewerName}`} className="w-16 h-16 rounded-full object-cover shadow-sm" />}
                                      <div className="flex-1">
                                          <div className="flex items-center justify-between">
                                              <h5 className="font-bold">{pubReview.reviewerName}</h5>
                                              <RatingStars rating={pubReview.rating} />
                                          </div>
                                          <p className="text-sm text-gray-700 mt-1">{pubReview.notes}</p>
                                      </div>
                                  </li>
                              ))}
                          </ul>
                      ) : (
                          <p className="text-center text-gray-500 py-8">No community reviews available yet.</p>
                      )}
                  </div>
              )}
              {activeTab === 'my-review' && (
                <form onSubmit={handleSubmitReview}>
                  <h4 className="text-lg font-semibold mb-2">Your Rating & Notes</h4>
                  <RatingInput rating={currentRating} setRating={setCurrentRating} />
                  <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={5} className="w-full mt-4 p-3 border border-matcha-green-light rounded-lg focus:ring-2 focus:ring-matcha-green focus:outline-none" placeholder="What did you order? How was it?"></textarea>
                  
                  <div className="mt-4">
                    {photo ? (
                        <div className="relative w-48">
                            <img src={photo} alt="Review preview" className="w-full h-auto rounded-lg shadow-md" />
                            <button 
                                type="button" 
                                onClick={() => setPhoto(undefined)}
                                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center font-bold text-sm hover:bg-red-600"
                                aria-label="Remove photo"
                            >
                                &times;
                            </button>
                        </div>
                    ) : (
                        <>
                            <input 
                                type="file" 
                                id="photo-upload" 
                                className="hidden" 
                                accept="image/*" 
                                onChange={handlePhotoUpload} 
                            />
                            <label 
                                htmlFor="photo-upload"
                                className="cursor-pointer inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-matcha-brown bg-white hover:bg-gray-50 transition-colors"
                            >
                                <UploadIcon className="w-5 h-5 mr-2 text-gray-500" />
                                Add a Photo
                            </label>
                        </>
                    )}
                  </div>
                  
                  <button type="submit" className="mt-6 w-full bg-matcha-green text-white font-bold py-3 px-4 rounded-lg hover:bg-matcha-green-light transition-colors disabled:bg-gray-300" disabled={currentRating === 0}>Save Review</button>
                </form>
              )}
              {activeTab === 'edit' && (
                <form onSubmit={handleSubmitEdit} className="space-y-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">Cafe Name</label>
                    <input type="text" name="name" id="name" value={editFormState.name} onChange={handleEditFormChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-matcha-green focus:border-matcha-green sm:text-sm" />
                  </div>
                   <div>
                    <label htmlFor="address" className="block text-sm font-medium text-gray-700">Address</label>
                    <input type="text" name="address" id="address" value={editFormState.address} onChange={handleEditFormChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-matcha-green focus:border-matcha-green sm:text-sm" />
                  </div>
                   <div>
                    <label htmlFor="hours" className="block text-sm font-medium text-gray-700">Hours (e.g., 9:00 AM - 6:00 PM)</label>
                    <input type="text" name="hours" id="hours" value={editFormState.hours} onChange={handleEditFormChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-matcha-green focus:border-matcha-green sm:text-sm" />
                  </div>
                   <div>
                    <label htmlFor="website" className="block text-sm font-medium text-gray-700">Website URL</label>
                    <input type="url" name="website" id="website" value={editFormState.website} onChange={handleEditFormChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-matcha-green focus:border-matcha-green sm:text-sm" />
                  </div>
                  <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
                    <textarea name="description" id="description" value={editFormState.description} onChange={handleEditFormChange} rows={4} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-matcha-green focus:border-matcha-green sm:text-sm"></textarea>
                  </div>
                  <button type="submit" className="w-full bg-matcha-green text-white font-bold py-3 px-4 rounded-lg hover:bg-matcha-green-light transition-colors">Save Changes</button>
                </form>
              )}
            </div>
        </div>
      </div>
    </div>
  );
};

export default CafeDetailModal;