/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { XIcon, ShopifyIcon, WooCommerceIcon } from './icons';
import { translations } from '../lib/translations';

type Language = 'pt-br' | 'en';

interface EcommerceModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
}

const EcommerceModal: React.FC<EcommerceModalProps> = ({ isOpen, onClose, language }) => {
  const t = translations[language];

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const handleConnect = (platform: string) => {
    // In a real app, this would trigger the OAuth flow or API connection.
    // For this demo, we'll just show an alert and close the modal.
    alert(`${t.connectingTo} ${platform}... (${t.demoFunctionality})`);
    onClose();
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
        className="relative bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-xl"
      >
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-2xl font-serif tracking-wider text-gray-800">{t.importProductCatalog}</h2>
          <button onClick={onClose} className="p-1 rounded-full text-gray-500 hover:bg-gray-100 hover:text-gray-800">
            <XIcon className="w-6 h-6" />
          </button>
        </div>

        <div className="p-8 overflow-y-auto space-y-6">
            <p className="text-center text-gray-600">{t.importSubtitle}</p>
            
            {/* Shopify Connector */}
            <div className="border rounded-lg p-6 space-y-4">
                <div className="flex items-center gap-4">
                    <ShopifyIcon className="w-10 h-10 text-green-600" />
                    <div>
                        <h3 className="text-xl font-bold text-gray-800">Shopify</h3>
                        <p className="text-sm text-gray-500">{t.shopifyDesc}</p>
                    </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-2">
                    <input
                        type="text"
                        placeholder={t.shopifyPlaceholder}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-800 focus:border-gray-800 transition-shadow"
                    />
                    <button onClick={() => handleConnect('Shopify')} className="flex-shrink-0 px-5 py-2 bg-gray-900 text-white font-semibold rounded-md hover:bg-gray-700 transition-colors">
                        {t.connect}
                    </button>
                </div>
            </div>

            {/* WooCommerce Connector */}
            <div className="border rounded-lg p-6 space-y-4">
                <div className="flex items-center gap-4">
                    <WooCommerceIcon className="w-10 h-10 text-purple-600" />
                    <div>
                        <h3 className="text-xl font-bold text-gray-800">WooCommerce</h3>
                        <p className="text-sm text-gray-500">{t.wooCommerceDesc}</p>
                    </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-2">
                    <input
                        type="text"
                        placeholder={t.wooCommercePlaceholder}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-800 focus:border-gray-800 transition-shadow"
                    />
                    <button onClick={() => handleConnect('WooCommerce')} className="flex-shrink-0 px-5 py-2 bg-gray-900 text-white font-semibold rounded-md hover:bg-gray-700 transition-colors">
                        {t.connect}
                    </button>
                </div>
            </div>
        </div>
      </motion.div>
    </div>
  );
};

export default EcommerceModal;
