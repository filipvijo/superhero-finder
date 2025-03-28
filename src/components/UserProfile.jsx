import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';

const UserProfile = () => {
  const { user, signInWithGoogle, logout } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    try {
      setLoading(true);
      await signInWithGoogle();
    } catch (error) {
      console.error('Error logging in:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      setLoading(true);
      await logout();
    } catch (error) {
      console.error('Error logging out:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed top-4 right-4 z-50">
      {user ? (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-4 bg-white rounded-lg shadow-lg p-2"
        >
          <img
            src={user.photoURL}
            alt={user.displayName}
            className="w-8 h-8 rounded-full"
          />
          <div className="hidden md:block">
            <p className="text-sm font-medium">{user.displayName}</p>
            <p className="text-xs text-gray-500">{user.email}</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleLogout}
            disabled={loading}
            className="px-3 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600 disabled:opacity-50"
          >
            {loading ? 'Loading...' : 'Logout'}
          </motion.button>
        </motion.div>
      ) : (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleLogin}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 bg-white text-gray-800 rounded-lg shadow-lg hover:bg-gray-50 disabled:opacity-50"
        >
          <img
            src="https://www.google.com/favicon.ico"
            alt="Google"
            className="w-4 h-4"
          />
          <span>{loading ? 'Loading...' : 'Sign in with Google'}</span>
        </motion.button>
      )}
    </div>
  );
};

export default UserProfile;
