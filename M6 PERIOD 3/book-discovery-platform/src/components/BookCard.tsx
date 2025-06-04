import type { Book } from '../types/book';

import { useEffect, useState } from 'react';
import { isFavorite, toggleFavorite } from '../utils/favorites';

import './BookCard.css'; // Assuming you have a CSS file for styling

export default function BookCard({ book }: { book: Book }) {
  const { title, authors, imageLinks } = book.volumeInfo;
  const [favorite, setFavorite] = useState(false);

  useEffect(() => {
    setFavorite(isFavorite(book.id));
  }, [book.id]);

  const handleFavoriteClick = () => {
    toggleFavorite(book);
    setFavorite((prev) => !prev);
  };

  const renderStars = (rating?: number) => {
    if (!rating || rating === 0) return null;
    return (
      <div className="stars">
        {'★'.repeat(rating)}{'☆'.repeat(5 - rating)}
      </div>
    );
  };

  return (
    <div className="book-card">
      {imageLinks?.thumbnail && <img src={imageLinks.thumbnail} alt={title} />}
      <h3>{title}</h3>
      <p>{authors?.join(', ')}</p>

      {/* Mostrar estrellas si tiene calificación */}
      {renderStars(book.userRating)}

      {/* Mostrar reseña si existe */}
      {book.userReview && (
        <p className="review">"{book.userReview}"</p>
      )}

      <button onClick={handleFavoriteClick}>
        {favorite ? '★ Remove Favorite' : '☆ Add to Favorites'}
      </button>
    </div>
  );
}
