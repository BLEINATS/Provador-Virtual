/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { XIcon } from './icons';
import Spinner from './Spinner';
import { translations } from '../lib/translations';

type Language = 'pt-br' | 'en';

interface UrlImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (url: string, name: string) => void;
  isImporting: boolean;
  language: Language;
}

const UrlImportModal: React.FC<UrlImportModalProps> = ({ isOpen, onClose, onImport, isImporting, language }) => {
  const [imageUrl, setImageUrl] = useState('');
  const [productName, setProductName] = useState('');
  const [previewUrl, setPreviewUrl] = useState('');
  const [error, setError] = useState('');
  const t = translations[language];

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
        window.removeEventListener('keydown', handleKeyDown)
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!isOpen) {
      // Reset state when modal closes
      setImageUrl('');
      setProductName('');
      setPreviewUrl('');
      setError('');
    }
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!imageUrl.trim() || !productName.trim() || isImporting) return;
    onImport(imageUrl, productName);
  };
  
  if (!isOpen) return null;

  return (
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
          <h2 className="text-2xl font-serif tracking-wider text-gray-800">{t.importFromUrlTitle}</h2>
          <button onClick={onClose} disabled={isImporting} className="p-1 rounded-full text-gray-500 hover:bg-gray-100 hover:text-gray-800 disabled:opacity-50">
            <XIcon className="w-6 h-6" />
          </button>
        </div>
        
        <div className="p-6">
            {isImporting ? (
                <div className="flex flex-col items-center justify-center h-48">
                    <Spinner />
                    <p className="mt-4 text-gray-600 font-serif">{t.importingYourImage}</p>
                </div>
            ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                    <p className="text-sm text-gray-600">{t.importUrlSubtitle}</p>
                    
                    <div>
                        <label htmlFor="image-url" className="block text-sm font-medium text-gray-700 mb-1">
                            {t.imageUrlLabel}
                        </label>
                        <input
                            id="image-url"
                            type="url"
                            value={imageUrl}
                            onChange={(e) => setImageUrl(e.target.value)}
                            onBlur={() => setPreviewUrl(imageUrl)}
                            placeholder={t.imageUrlPlaceholder}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-800"
                            required
                        />
                    </div>

                    {previewUrl && (
                        <div className="flex flex-col sm:flex-row gap-4 items-start">
                             <div className="w-full sm:w-2/3">
                                <label htmlFor="product-name" className="block text-sm font-medium text-gray-700 mb-1">
                                    {t.productNameLabel}
                                </label>
                                <input
                                    id="product-name"
                                    type="text"
                                    value={productName}
                                    onChange={(e) => setProductName(e.target.value)}
                                    placeholder={t.productNamePlaceholder}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-800"
                                    required
                                    autoFocus
                                />
                            </div>
                            <div className="w-full sm:w-1/3">
                                <p className="text-sm font-medium text-gray-700 mb-1">{t.preview}</p>
                                <img 
                                    src={previewUrl} 
                                    alt={t.previewAlt} 
                                    className="w-full aspect-square object-cover rounded-md border bg-gray-100"
                                    onError={() => setError(t.errorImageLoad)}
                                />
                            </div>
                        </div>
                    )}

                    {error && <p className="text-red-500 text-sm">{error}</p>}
                    
                    <button type="submit" disabled={!productName.trim() || !imageUrl.trim() || !!error} className="w-full py-3 bg-gray-900 text-white font-semibold rounded-md hover:bg-gray-700 disabled:bg-gray-300 transition-colors">
                        {t.addToWardrobe}
                    </button>
                </form>
            )}
        </div>
      </motion.div>
    </div>
  );
};

export default UrlImportModal;
