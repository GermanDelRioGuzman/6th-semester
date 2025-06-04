import { useEffect, useState } from 'react';
import { getFavorites } from '../utils/favorites';
import type { Book } from '../types/book';
import BookCard from '../components/BookCard';

export default function Dashboard() {
  const [favorites, setFavorites] = useState<Book[]>([]);
  const [filtered, setFiltered] = useState<Book[]>([]);
  const [authorFilter, setAuthorFilter] = useState('');
  const [ratingFilter, setRatingFilter] = useState(0);

  useEffect(() => {
    const favs = getFavorites();
    setFavorites(favs);
    setFiltered(favs);
  }, []);

  useEffect(() => {
    const result = favorites.filter((book) => {
      const authorMatch = authorFilter === '' || (book.volumeInfo.authors || []).some(a =>
        a.toLowerCase().includes(authorFilter.toLowerCase())
      );
      const ratingMatch = ratingFilter === 0 || book.userRating === ratingFilter;
      return authorMatch && ratingMatch;
    });
    setFiltered(result);
  }, [authorFilter, ratingFilter, favorites]);

  return (
    <div>
      <h2 style={{ textAlign: 'center' }}>Your Favorite Books</h2>

      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        <input
          type="text"
          placeholder="Filter by author..."
          value={authorFilter}
          onChange={(e) => setAuthorFilter(e.target.value)}
          style={{ marginRight: '10px', padding: '6px' }}
        />

        <select
          value={ratingFilter}
          onChange={(e) => setRatingFilter(Number(e.target.value))}
          style={{ padding: '6px' }}
        >
          <option value={0}>All Ratings</option>
          <option value={1}>⭐ 1</option>
          <option value={2}>⭐⭐ 2</option>
          <option value={3}>⭐⭐⭐ 3</option>
          <option value={4}>⭐⭐⭐⭐ 4</option>
          <option value={5}>⭐⭐⭐⭐⭐ 5</option>
        </select>
      </div>

      <div className="grid">
        {filtered.length > 0 ? (
          filtered.map((book) => (
            <BookCard key={book.id} book={book} />
          ))
        ) : (
          <p style={{ textAlign: 'center' }}>No books found with those filters.</p>
        )}
      </div>
    </div>
  );
}
