import { BrowserRouter, Outlet } from 'react-router-dom';
import Navbar from './components/Navbar';
import { SavedItemsProvider } from './components/SavedItemsContext';






export default function App() {
  return (
    <SavedItemsProvider>
      <Navbar />
      <Outlet />
    </SavedItemsProvider>
  );
}
