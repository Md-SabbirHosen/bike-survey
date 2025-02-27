import { motion } from 'framer-motion';
import { Bike } from 'lucide-react';

export default function Header() {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-6 rounded-lg shadow-lg mb-8"
    >
      <div className="flex items-center justify-center gap-3 mb-4">
        <Bike size={32} />
        <h1 className="text-2xl md:text-3xl font-bold">Two-Wheeler Motorbike Survey</h1>
      </div>
      <p className="text-center text-blue-100">
        Help us understand your preferences and improve our services
      </p>
    </motion.div>
  );
}