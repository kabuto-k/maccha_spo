import type { Review, Cafe } from '../types';

const FAVORITES_KEY = 'matcha_spotter_favorites';
const VISITED_KEY = 'matcha_spotter_visited';
const REVIEWS_KEY = 'matcha_spotter_reviews';
const CAFE_EDITS_KEY = 'matcha_spotter_cafe_edits';

// Favorites
export const getFavorites = (): string[] => {
  const favorites = localStorage.getItem(FAVORITES_KEY);
  return favorites ? JSON.parse(favorites) : [];
};

export const setFavorites = (favorites: string[]): void => {
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
};

// Visited
export const getVisited = (): string[] => {
  const visited = localStorage.getItem(VISITED_KEY);
  return visited ? JSON.parse(visited) : [];
};

export const setVisited = (visited: string[]): void => {
  localStorage.setItem(VISITED_KEY, JSON.stringify(visited));
};

// Reviews
export const getReviews = (): Record<string, Review> => {
  const reviews = localStorage.getItem(REVIEWS_KEY);
  return reviews ? JSON.parse(reviews) : {};
};

export const setReviews = (reviews: Record<string, Review>): void => {
  localStorage.setItem(REVIEWS_KEY, JSON.stringify(reviews));
};

// Cafe Edits
export const getCafeEdits = (): Record<string, Partial<Cafe>> => {
  const edits = localStorage.getItem(CAFE_EDITS_KEY);
  return edits ? JSON.parse(edits) : {};
};

export const setCafeEdits = (edits: Record<string, Partial<Cafe>>): void => {
  localStorage.setItem(CAFE_EDITS_KEY, JSON.stringify(edits));
};
