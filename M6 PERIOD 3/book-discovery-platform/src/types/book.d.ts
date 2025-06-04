// src/types/book.d.ts
export interface Book {
  id: string;
  volumeInfo: {
    title: string;
    authors?: string[];
    imageLinks?: {
      thumbnail?: string;
    };
    description?: string;
  };
  userReview?: string;
  userRating?: number;
}
