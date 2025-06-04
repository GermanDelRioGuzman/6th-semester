import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { doc, getDoc, setDoc, updateDoc, arrayUnion } from "firebase/firestore";
import { auth, db } from "../services/firebase";

interface SavedItemsContextType {
  saved: Record<string, string[]>; // { readBooks: [...], queuedGames: [...], etc. }
  addItem: (listName: string, itemId: string) => Promise<void>;
  isSaved: (listName: string, itemId: string) => boolean;
}

const SavedItemsContext = createContext<SavedItemsContextType | null>(null);

export const SavedItemsProvider = ({ children }: { children: ReactNode }) => {
  const [saved, setSaved] = useState<Record<string, string[]>>({});

  useEffect(() => {
    const fetchSaved = async () => {
      const user = auth.currentUser;
      if (user) {
        const ref = doc(db, "users", user.uid);
        const snap = await getDoc(ref);
        if (snap.exists()) setSaved(snap.data() as Record<string, string[]>);
        else await setDoc(ref, {}); // crea el doc si no existe
      }
    };
    fetchSaved();
  }, []);

  const addItem = async (listName: string, itemId: string) => {
    const user = auth.currentUser;
    if (!user) return;

    const ref = doc(db, "users", user.uid);
    await updateDoc(ref, {
      [listName]: arrayUnion(itemId),
    });

    setSaved((prev) => ({
      ...prev,
      [listName]: [...(prev[listName] || []), itemId],
    }));
  };

  const isSaved = (listName: string, itemId: string) => {
    return saved[listName]?.includes(itemId);
  };

  return (
    <SavedItemsContext.Provider value={{ saved, addItem, isSaved }}>
      {children}
    </SavedItemsContext.Provider>
  );
};

export const useSavedItems = () => {
  const context = useContext(SavedItemsContext);
  if (!context) throw new Error("useSavedItems must be used within SavedItemsProvider");
  return context;
};
