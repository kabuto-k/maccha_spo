export interface MenuItem {
  name: string;
  price: string;
  description?: string;
}

export interface Cafe {
  id: string; // Corresponds to Google Place ID
  name: string;
  address: string;
  lat: number;
  lng: number;
  rating: number;
  priceRange: number; // 1 to 4
  hours: string;
  description: string;
  menu: MenuItem[];
  photoUrl: string;
  website?: string;
  distance?: number; // in kilometers
  isOpenNow?: boolean;
}

export interface Review {
  rating: number;
  notes: string;
  photo?: string; // base64 encoded image or URL
  reviewerName?: string;
}