import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  query,
  where
} from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAUijM__hGiL6DQMZW-Gi93_lgEN8VP7M8",
  authDomain: "book-discovery-94bc3.firebaseapp.com",
  projectId: "book-discovery-94bc3",
  storageBucket: "book-discovery-94bc3.firebasestorage.app",
  messagingSenderId: "297247582429",
  appId: "1:297247582429:web:872341e014748d5fcdd334",
  measurementId: "G-KJVRQNWR3Z"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();

interface Review {
  id: string;
  user: string;
  review: string;
  bookId: string;
}

// ✅ Agregar una reseña
export const addReview = async (reviewData: Review) => {
  await addDoc(collection(db, "reviews"), reviewData);
};

// ✅ Obtener reseñas por ID de libro
export const getReviewsByBookId = async (bookId: string) => {
  const q = query(collection(db, "reviews"), where("bookId", "==", bookId));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => doc.data() as Review);
};



