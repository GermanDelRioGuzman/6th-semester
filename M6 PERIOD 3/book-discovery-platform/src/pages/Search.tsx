import { useState } from 'react';
import { fetchBooks } from '../services/booksApi';
import type { Book } from '../types/book';
import BookCard from '../components/BookCard';
import BookDetails from '../components/BookDetails';
import './Search.css';

export default function Search() {
  const [query, setQuery] = useState('');
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedBook, setSelectedBook] = useState<Book | null>(null); // Nuevo estado

  const handleSearch = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSelectedBook(null); // Limpiar selección anterior

    try {
      const results = await fetchBooks(query);
      setBooks(results);
    } catch (err) {
      setError('Error fetching books. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="search-container">
      <h2>Search for Books</h2>
      <form onSubmit={handleSearch} className="search-form">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Enter book title, author, or keyword"
        />
        <button type="submit">Search</button>
      </form>

      {loading && <p>Loading...</p>}
      {error && <p className="error">{error}</p>}

      {selectedBook ? (
        <BookDetails book={selectedBook} />
      ) : (
        <div className="search-results">
          {books.map((book) => (
            <div key={book.id} onClick={() => setSelectedBook(book)}>
              <BookCard book={book} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
