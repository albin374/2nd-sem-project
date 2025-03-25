// src/pages/Profile.jsx
import React from 'react';
import { auth } from '../firebase';

const Profile = () => {
  const user = auth.currentUser;

  return (
    <div className="flex justify-center items-center h-screen">
      {user ? (
        <div className="bg-white p-6 rounded shadow-md w-96">
          <h2 className="text-2xl mb-4">Welcome, {user.email}!</h2>
          <p>Email: {user.email}</p>
        </div>
      ) : (
        <p>Please login to view your profile.</p>
      )}
    </div>
  );
};

export default Profile;
