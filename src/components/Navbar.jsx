// src/components/Navbar.jsx
import React, { useState, useEffect } from 'react';
import { auth } from '../firebase'; // Firebase config
import { signOut } from 'firebase/auth';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      setUser(authUser);
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
  };

  return (
    <nav className="flex justify-between items-center bg-gray-900 text-white p-4">
      <Link to="/" className="text-2xl font-bold">⚡ EV Finder</Link>

      <div className="space-x-4">
        {user ? (
          <>
            <Link to="/profile" className="hover:text-green-400">View Profile</Link>
            <button onClick={handleLogout} className="hover:text-red-400">Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" className="hover:text-blue-400">Login</Link>
            <Link to="/signup" className="hover:text-yellow-400">Create Account</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
