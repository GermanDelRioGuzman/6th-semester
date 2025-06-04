import axios from 'axios';
import type { Book } from '../types/book';

const API_KEY = 'AIzaSyC6qs9MRjt7G32X-4_T_zqzkmGGqUaD6qw';
const BASE_URL = 'https://www.googleapis.com/books/v1/volumes';

export const fetchBooks = async (query: string): Promise<Book[]> => {
  const response = await axios.get(`${BASE_URL}?q=${query}&key=${API_KEY}`);
  return response.data.items || [];
};
