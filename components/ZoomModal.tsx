/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { XIcon } from './icons';

interface ZoomModalProps {
  imageUrl: string;
  onClose: () => void;
}

const ZoomModal: React.FC<ZoomModalProps> = ({ imageUrl, onClose }) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      aria-modal="true"
      role="dialog"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ duration: 0.2, ease: 'easeOut' }}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full h-full max-w-4xl max-h-[90vh] flex items-center justify-center"
      >
        <img 
          src={imageUrl} 
          alt="Visualização ampliada do look" 
          className="max-w-full max-h-full object-contain"
        />
        <button 
          onClick={onClose}
          className="absolute top-2 right-2 p-2 bg-white/20 rounded-full text-white hover:bg-white/40 transition-colors"
          aria-label="Fechar visualização ampliada"
        >
          <XIcon className="w-6 h-6" />
        </button>
      </motion.div>
    </motion.div>
  );
};

export default ZoomModal;
