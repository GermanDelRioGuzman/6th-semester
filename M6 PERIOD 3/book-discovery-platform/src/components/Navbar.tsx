import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import './Navbar.css';

export default function Navbar() {
  const navigate = useNavigate();
  const [user, setUser] = useState<{ name: string } | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
    setShowConfirm(false);
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <Link to="/">Home</Link>
      <Link to="/search">Search</Link>
      <Link to="/dashboard">Dashboard</Link>
      <Link to="/profile">Profile</Link>

      <div style={{ marginLeft: 'auto', display: 'flex', gap: '10px', alignItems: 'center' }}>
        
          <>
            <span>Welcome,</span>
            <button onClick={() => setShowConfirm(true)}>Logout</button>
          </>
        
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        
      </div>

      {/* Confirm logout modal */}
      {showConfirm && (
        <div className="modal-overlay">
          <div className="modal">
            <p>Are you sure you want to log out?</p>
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
              <button onClick={handleLogout}>Yes</button>
              <button onClick={() => setShowConfirm(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
