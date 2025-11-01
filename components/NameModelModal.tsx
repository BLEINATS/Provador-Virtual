/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { XIcon } from './icons';
import { translations } from '../lib/translations';

interface NameModelModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (name: string) => void;
  language: 'pt-br' | 'en';
}

const NameModelModal: React.FC<NameModelModalProps> = ({ isOpen, onClose, onSubmit, language }) => {
  const [name, setName] = useState('');
  const t = translations[language];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onSubmit(name.trim());
      setName(''); // Reset name after submission
    }
  };
  
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ scale: 0.95, y: 20, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={{ scale: 0.95, y: 20, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="relative bg-white rounded-2xl w-full max-w-sm flex flex-col shadow-xl"
      >
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-2xl font-serif tracking-wider text-gray-800">{t.nameYourModel}</h2>
          <button onClick={onClose} className="p-1 rounded-full text-gray-500 hover:bg-gray-100">
            <XIcon className="w-6 h-6" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <p className="text-sm text-gray-600">{t.nameModelPrompt}</p>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={t.nameModelPlaceholder}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-800"
            required
            autoFocus
          />
          <button type="submit" className="w-full py-3 bg-gray-900 text-white font-semibold rounded-md hover:bg-gray-700 disabled:bg-gray-300">
            {t.saveModel}
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default NameModelModal;
