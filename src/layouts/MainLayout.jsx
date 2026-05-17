import { Outlet, useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { motion, AnimatePresence } from 'framer-motion';

export default function MainLayout() {
  const location = useLocation();
  
  return (
    <div className="min-h-screen bg-dark-bg flex flex-col">
      <Navbar />
      <AnimatePresence mode="wait">
        <motion.main 
          key={location.pathname}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
          className="flex-1 pt-20"
        >
          <Outlet />
        </motion.main>
      </AnimatePresence>
    </div>
  );
}
