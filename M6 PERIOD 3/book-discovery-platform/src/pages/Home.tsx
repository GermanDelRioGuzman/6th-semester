import { useEffect, useState } from 'react';
import { fetchBooks } from '../services/booksApi';
import type { Book } from '../types/book';
import BookCard from '../components/BookCard';

export default function Home() {
  const [books, setBooks] = useState<Book[]>([]);

  useEffect(() => {
    fetchBooks('javascript').then(setBooks);
  }, []);

  return (
    <div className="grid">
      {books.map(book => (
        <BookCard key={book.id} book={book} />
      ))}
    </div>
  );
}
