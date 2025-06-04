import type { Book } from '../types/book';

const FAVORITES_KEY = 'favorite_books';

export const getFavorites = (): Book[] => {
  const favs = localStorage.getItem(FAVORITES_KEY);
  return favs ? JSON.parse(favs) : [];
};

export const isFavorite = (id: string): boolean => {
  return getFavorites().some((b) => b.id === id);
};

export const toggleFavorite = (book: Book): void => {
  const favorites = getFavorites();
  const exists = favorites.find((b) => b.id === book.id);
  const updated = exists
    ? favorites.filter((b) => b.id !== book.id)
    : [...favorites, book];
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(updated));
};
