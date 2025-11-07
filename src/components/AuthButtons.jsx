import React, { useState, useEffect } from 'react';
import { isUserSignedIn, signIn, signUp, signOut, getCurrentUser } from '../services/authService';

const AuthButtons = () => {
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const signedIn = isUserSignedIn();
      setIsSignedIn(signedIn);
      
      if (signedIn) {
        const userData = await getCurrentUser();
        setUser(userData);
      }
      
      setLoading(false);
    };
    
    checkAuth();
  }, []);

  const handleSignIn = async () => {
    setLoading(true);
    const success = await signIn();
    if (success) {
      setIsSignedIn(true);
      const userData = await getCurrentUser();
      setUser(userData);
    }
    setLoading(false);
  };

  const handleSignUp = async () => {
    setLoading(true);
    const success = await signUp();
    if (success) {
      setIsSignedIn(true);
      const userData = await getCurrentUser();
      setUser(userData);
    }
    setLoading(false);
  };

  const handleSignOut = async () => {
    setLoading(true);
    const success = await signOut();
    if (success) {
      setIsSignedIn(false);
      setUser(null);
      // Redirect to home and reload the page
      window.location.href = '/';
    }
    setLoading(false);
  };

  if (loading) {
    return <div className="flex items-center justify-center"><div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500"></div></div>;
  }

  return (
    <div className="flex items-center gap-4">
      {isSignedIn ? (
        <>
          <div className="text-sm text-gray-300">
            Welcome, {user?.username || 'User'}
          </div>
          <button
            onClick={handleSignOut}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors"
          >
            Logout
          </button>
        </>
      ) : (
        <div className="flex items-center space-x-2">
          <button
            onClick={handleSignIn}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
          >
            Login
          </button>
          <button
            onClick={handleSignUp}
            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md transition-colors"
          >
            Sign Up
          </button>
        </div>
      )}
    </div>
  );
};

export default AuthButtons;