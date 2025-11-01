/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { XIcon } from './icons';
import Spinner from './Spinner';
import { translations } from '../lib/translations';

type Language = 'pt-br' | 'en';

interface RefineModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRefine: (prompt: string) => void;
  isLoading: boolean;
  language: Language;
}

const RefineModal: React.FC<RefineModalProps> = ({ isOpen, onClose, onRefine, isLoading, language }) => {
  const [prompt, setPrompt] = useState('');
  const t = translations[language];

  const REFINE_SUGGESTIONS = [
    t.refineSuggestion1,
    t.refineSuggestion2,
    t.refineSuggestion3,
    t.refineSuggestion4,
  ];

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (prompt.trim() && !isLoading) {
      onRefine(prompt.trim());
    }
  };
  
  return (
    <AnimatePresence>
        {isOpen && (
            <div
                onClick={onClose}
                className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                aria-modal="true"
                role="dialog"
            >
            <motion.div
                initial={{ scale: 0.95, y: 20, opacity: 0 }}
                animate={{ scale: 1, y: 0, opacity: 1 }}
                exit={{ scale: 0.95, y: 20, opacity: 0 }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
                onClick={(e) => e.stopPropagation()}
                className="relative bg-white rounded-2xl w-full max-w-lg flex flex-col shadow-xl"
            >
                <div className="flex items-center justify-between p-4 border-b">
                <h2 className="text-2xl font-serif tracking-wider text-gray-800">{t.editPhoto}</h2>
                <button onClick={onClose} disabled={isLoading} className="p-1 rounded-full text-gray-500 hover:bg-gray-100 hover:text-gray-800 disabled:opacity-50">
                    <XIcon className="w-6 h-6" />
                </button>
                </div>
                <div className="p-6">
                    {isLoading ? (
                        <div className="flex flex-col items-center justify-center h-48">
                            <Spinner />
                            <p className="mt-4 text-gray-600 font-serif">{t.editingYourImage}</p>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label htmlFor="refine-prompt" className="block text-sm font-medium text-gray-700 mb-1">
                                {t.describeChange}
                                </label>
                                <textarea
                                    id="refine-prompt"
                                    value={prompt}
                                    onChange={(e) => setPrompt(e.target.value)}
                                    placeholder={t.refinePlaceholder}
                                    rows={3}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-800 focus:border-gray-800 transition-shadow"
                                />
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {REFINE_SUGGESTIONS.map(suggestion => (
                                    <button
                                        key={suggestion}
                                        type="button"
                                        onClick={() => setPrompt(suggestion)}
                                        className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full hover:bg-gray-200 transition-colors"
                                    >
                                        {suggestion}
                                    </button>
                                ))}
                            </div>
                            <button type="submit" disabled={!prompt.trim() || isLoading} className="w-full py-3 bg-gray-900 text-white font-semibold rounded-md hover:bg-gray-700 disabled:bg-gray-300 transition-colors">
                            {t.applyEdit}
                            </button>
                        </form>
                    )}
                </div>
            </motion.div>
            </div>
        )}
    </AnimatePresence>
  );
};

export default RefineModal;
