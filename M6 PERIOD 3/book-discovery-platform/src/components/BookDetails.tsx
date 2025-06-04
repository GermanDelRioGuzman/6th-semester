import type { Book } from '../types/book';
import { useEffect, useState } from 'react';
import { isFavorite, toggleFavorite } from '../utils/favorites';
import { addReview, getReviewsByBookId } from '../services/firebase';
import { auth } from '../services/firebase';
import './BookDetails.css';
import { useSavedItems } from '../components/SavedItemsContext';


interface Props {
  book: Book;
}

interface Review {
  id: string;
  user: string;
  review: string;
  bookId: string;
}

export default function BookDetails({ book }: Props) {
  const [favorite, setFavorite] = useState(false);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [newReview, setNewReview] = useState('');
  const { isSaved, addItem } = useSavedItems();
  const isQueued = isSaved("queuedBooks", book.id);
  const handleQueue = () => addItem("queuedBooks", book.id);
  const isInWishlist = isSaved("wishlistBooks", book.id);
  const handleAddToWishlist = () => addItem("wishlistBooks", book.id);

  const isInReadList = isSaved("readBooks", book.id);
  const handleAddToRead = () => addItem("readBooks", book.id);

  useEffect(() => {
    setFavorite(isFavorite(book.id));
    fetchReviews();
  }, [book.id]);

  const fetchReviews = async () => {
    const result = await getReviewsByBookId(book.id);
    setReviews(result);
  };

  const handleToggle = () => {
    toggleFavorite(book);
    setFavorite(!favorite);
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    const user = auth.currentUser;
    if (!user) {
      alert("You must be logged in to submit a review.");
      return;
    }

    const reviewData: Review = {
      id: crypto.randomUUID(),
      user: user.displayName || user.email || "Anonymous",
      review: newReview,
      bookId: book.id,
    };

    await addReview(reviewData);
    setNewReview('');
    fetchReviews(); // Refresh the list
  };

  const renderStars = (rating?: number) => {
    if (!rating) return null;
    return <div className="stars">{'★'.repeat(rating)}{'☆'.repeat(5 - rating)}</div>;
  };

  return (
    <div className="book-details">
      <div className="image-section">
        {book.volumeInfo.imageLinks?.thumbnail && (
          <img
            src={book.volumeInfo.imageLinks.thumbnail.replace('http:', 'https:')}
            alt={book.volumeInfo.title}
          />
        )}
      </div>

      <div className="info-section">
        <h2>{book.volumeInfo.title}</h2>
        {book.volumeInfo.authors && <p><strong>Author(s):</strong> {book.volumeInfo.authors.join(', ')}</p>}

        {renderStars(book.userRating)}
        {book.userReview && <p className="review">"{book.userReview}"</p>}

        {book.volumeInfo.description && (
          <div className="description">
            <h4>Description:</h4>
            <p>{book.volumeInfo.description}</p>
          </div>
        )}

        <button onClick={handleToggle}>
          {favorite ? '★ Remove from Favorites' : '☆ Add to Favorites'}
        </button>

        <div className="review-section">
          <h4>Leave a Review</h4>
          <form onSubmit={handleSubmitReview}>
            <textarea
              value={newReview}
              onChange={(e) => setNewReview(e.target.value)}
              rows={3}
              placeholder="Write your review here..."
              required
            />
            <button type="submit">Submit</button>
          </form>

          <div className="reviews-list">
            <h4>Reviews</h4>
            {reviews.length > 0 ? (
              <ul>
                {reviews.map((r) => (
                  <li key={r.id}>
                    <strong>{r.user}:</strong> {r.review}
                  </li>
                ))}
              </ul>
            ) : (
              <p>No reviews yet.</p>
            )}
          </div>

          <div>
            <button onClick={handleAddToRead} disabled={isInReadList}>
              {isInReadList ? "✓ Already Read" : "Mark as Read"}
            </button>

            <button onClick={handleQueue} disabled={isQueued}>
              {isQueued ? "✓ In Queue" : "+ Add to Queue"}
            </button>

            <button onClick={handleAddToWishlist} disabled={isInWishlist}>
              {isInWishlist ? "✓ In Wishlist" : "♡ Add to Wishlist"}
            </button>

          </div>
        </div>
      </div>
    </div>
  );
}
