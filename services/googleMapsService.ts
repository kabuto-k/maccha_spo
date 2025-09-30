import type { Cafe, Review } from '../types';

// --- Mock Data simulating Google Places API response ---

const mockCafesData = [
  {
    place_id: 'ChIJ7-p-6beMGGARe-8b1b5_3hI',
    name: 'Kagurazaka Saryo',
    vicinity: '5-9 Kagurazaka, Shinjuku City, Tokyo',
    geometry: { location: { lat: 35.7001, lng: 139.7351 } },
    rating: 4.4,
    price_level: 3,
    opening_hours: { open_now: true },
    website: 'https://www.saryo.jp/',
    user_ratings_total: 1200,
    // Custom data to fit the app's needs
    description: "A famous cafe in the charming Kagurazaka district, known for its exquisite Japanese desserts and serene atmosphere. Their matcha fondue is a must-try.",
    menu: [{ name: 'Matcha Latte', price: '¥850', description: 'Rich, ceremonial grade matcha paired with perfectly steamed milk.' }],
    photoUrl: 'https://picsum.photos/seed/kagurazaka/800/600',
    hours: '11:00 AM - 9:00 PM',
  },
  {
    place_id: 'ChIJRcQ-sPuLGGAR2k6agV5aZDY',
    name: 'Tsujiri Ginza',
    vicinity: 'Ginza Six B2F, 6-10-1 Ginza, Chuo City, Tokyo',
    geometry: { location: { lat: 35.6698, lng: 139.7648 } },
    rating: 4.3,
    price_level: 3,
    opening_hours: { open_now: false },
    website: 'https://www.tsujiri.jp/',
    user_ratings_total: 800,
    description: 'A prestigious Uji matcha specialist from Kyoto, offering a premium tea experience. Enjoy authentic, high-quality matcha sweets and drinks in the heart of Ginza.',
    menu: [{ name: 'Matcha Latte', price: '¥900' }, { name: 'O-koicha', price: '¥1200' }],
    photoUrl: 'https://picsum.photos/seed/tsujiri/800/600',
    hours: '10:30 AM - 8:30 PM',
  },
  {
    place_id: 'ChIJN1t_tDeuEmsRUsoyG83frY4',
    name: 'Blue Bottle Coffee - Shinjuku Cafe',
    vicinity: 'NEWoMan Shinjuku 1F, 4-1-6 Shinjuku, Shinjuku City',
    geometry: { location: { lat: 35.6897, lng: 139.7004 } },
    rating: 4.2,
    price_level: 2,
    opening_hours: { open_now: true },
    website: 'https://store.bluebottlecoffee.jp/pages/shinjuku',
    user_ratings_total: 1500,
    description: "A popular spot for specialty coffee lovers, known for its minimalist design and quality brews. Their matcha latte is also highly regarded.",
    menu: [{ name: 'Matcha Latte', price: '¥750', description: 'Premium Uji matcha with your choice of milk.' }],
    photoUrl: 'https://picsum.photos/seed/bluebottle/800/600',
    hours: '8:00 AM - 9:00 PM',
  },
   {
    place_id: 'ChIJjQ8y-uOMGGAR2k8Q4V5aZDA',
    name: 'Nana\'s Green Tea - Tokyo Skytree',
    vicinity: 'Tokyo Solamachi 4F, 1-1-2 Oshiage, Sumida City',
    geometry: { location: { lat: 35.7101, lng: 139.8107 } },
    rating: 4.1,
    price_level: 2,
    opening_hours: { open_now: true },
    website: 'https://www.nanasgreentea.com/',
    user_ratings_total: 950,
    description: "A modern Japanese tea house offering a wide variety of matcha-based drinks and desserts. A perfect place to relax with a view of the Skytree.",
    menu: [{ name: 'Matcha Latte', price: '¥680' }, {name: 'Matcha Shiratama Parfait', price: '¥1100'}],
    photoUrl: 'https://picsum.photos/seed/nanas/800/600',
    hours: '10:00 AM - 10:00 PM',
  },
];

const mockReviewsData: Record<string, any[]> = {
  'ChIJ7-p-6beMGGARe-8b1b5_3hI': [
    { author_name: 'Erika S.', rating: 5, text: 'The matcha fondue is heavenly! Best I have ever had. The latte was also very authentic and rich.', profile_photo_url: 'https://picsum.photos/seed/user1/100' },
    { author_name: 'Kenji M.', rating: 4, text: 'A bit of a wait, but totally worth it. The atmosphere is very traditional and calming. Great place for a date.', profile_photo_url: 'https://picsum.photos/seed/user2/100' },
  ],
  'ChIJRcQ-sPuLGGAR2k6agV5aZDY': [
    { author_name: 'Yuki T.', rating: 5, text: 'Truly premium matcha. You can taste the quality. The soft serve is also incredible.', profile_photo_url: 'https://picsum.photos/seed/user3/100' },
  ],
  'ChIJN1t_tDeuEmsRUsoyG83frY4': [
     { author_name: 'Alex P.', rating: 4, text: 'It\'s a coffee shop, but their matcha latte is surprisingly good. Very smooth. Great for a quick, quality drink near the station.', profile_photo_url: 'https://picsum.photos/seed/user4/100' },
     { author_name: 'Haruka N.', rating: 4, text: 'Clean, modern, and efficient. The coffee is the star, but I often come here for the matcha. It\'s not too sweet.', profile_photo_url: 'https://picsum.photos/seed/user5/100' },
  ]
};

// --- Service Functions ---

/**
 * Simulates a call to Google Places API to find cafes.
 * @param location - The location to search near (ignored in this mock).
 * @returns A promise that resolves to an array of cafes.
 */
export const findCafesNear = (location: string): Promise<Cafe[]> => {
  console.log(`Simulating search for cafes near: ${location}`);
  return new Promise((resolve) => {
    setTimeout(() => {
      const cafes: Cafe[] = mockCafesData.map(place => ({
        id: place.place_id,
        name: place.name,
        address: place.vicinity,
        lat: place.geometry.location.lat,
        lng: place.geometry.location.lng,
        rating: place.rating,
        priceRange: place.price_level,
        hours: place.hours,
        description: place.description,
        menu: place.menu,
        photoUrl: place.photoUrl,
        website: place.website,
        isOpenNow: place.opening_hours.open_now,
      }));
      resolve(cafes);
    }, 500); // Simulate network delay
  });
};

/**
 * Simulates a call to Google Places API to fetch reviews for a cafe.
 * @param placeId - The Google Place ID for the cafe.
 * @returns A promise that resolves to an array of reviews.
 */
export const fetchCafeReviews = (placeId: string): Promise<Review[]> => {
  console.log(`Simulating fetching reviews for placeId: ${placeId}`);
  return new Promise((resolve) => {
    setTimeout(() => {
      const apiReviews = mockReviewsData[placeId] || [];
      const reviews: Review[] = apiReviews.map(review => ({
        reviewerName: review.author_name,
        rating: review.rating,
        notes: review.text,
        photo: review.profile_photo_url,
      }));
      resolve(reviews);
    }, 300); // Simulate network delay
  });
};
