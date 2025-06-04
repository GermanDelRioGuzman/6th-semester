import type { Book } from '../types/book';
import { useState } from 'react';
import { getFavorites, toggleFavorite } from '../utils/favorites';

export default function ReviewForm({ book }: { book: Book }) {
  const [review, setReview] = useState(book.userReview || '');
  const [rating, setRating] = useState(book.userRating || 0);

  const handleSubmit = () => {
    const favorites = getFavorites();
    const updatedFavorites = favorites.map((b) =>
      b.id === book.id ? { ...b, userReview: review, userRating: rating } : b
    );
    localStorage.setItem('favorite_books', JSON.stringify(updatedFavorites));
    alert('Review saved!');
  };

  return (
    <div className="review-form">
      <textarea
        value={review}
        onChange={(e) => setReview(e.target.value)}
        placeholder="Write a review..."
        rows={4}
        cols={40}
      />
      <br />
      <label>
        Rating:
        <select value={rating} onChange={(e) => setRating(Number(e.target.value))}>
          <option value={0}>0</option>
          <option value={1}>⭐</option>
          <option value={2}>⭐⭐</option>
          <option value={3}>⭐⭐⭐</option>
          <option value={4}>⭐⭐⭐⭐</option>
          <option value={5}>⭐⭐⭐⭐⭐</option>
        </select>
      </label>
      <br />
      <button onClick={handleSubmit}>Save Review</button>
    </div>
  );
}
