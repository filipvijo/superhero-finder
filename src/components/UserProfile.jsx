import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { useTranslation } from 'react-i18next';

const UserProfile = () => {
  const { user, logout } = useAuth();
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();

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

  if (!user) return null;

  return (
    <div className="fixed top-4 right-4 z-50">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-4 bg-white rounded-lg shadow-lg p-2"
      >
        <div className="hidden md:block">
          <p className="text-sm font-medium">{user.email}</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleLogout}
          disabled={loading}
          className="px-3 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600 disabled:opacity-50"
        >
          {loading ? t('loading') : t('logout')}
        </motion.button>
      </motion.div>
    </div>
  );
};

export default UserProfile;
