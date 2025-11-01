/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { XIcon, DownloadIcon, KeyIcon } from './icons';
import Spinner from './Spinner';
import { translations } from '../lib/translations';

type Language = 'pt-br' | 'en';

// As a precaution, we're casting `window` to `any` to avoid potential TypeScript
// errors in environments where `window.aistudio` might not be defined.
declare const window: any;

interface AnimateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGenerate: (prompt: string) => void;
  isLoading: boolean;
  loadingMessage: string;
  generatedVideoUrl: string | null;
  currentOutfitImageUrl: string;
  language: Language;
}

const AnimateModal: React.FC<AnimateModalProps> = ({
  isOpen,
  onClose,
  onGenerate,
  isLoading,
  loadingMessage,
  generatedVideoUrl,
  currentOutfitImageUrl,
  language
}) => {
  const [prompt, setPrompt] = useState('');
  const [hasApiKey, setHasApiKey] = useState(false);
  const t = translations[language];

  const checkApiKey = useCallback(async () => {
    const keySelected = await window.aistudio.hasSelectedApiKey();
    setHasApiKey(keySelected);
  }, []);
  
  useEffect(() => {
    if (isOpen) {
        checkApiKey();
    }
  }, [isOpen, checkApiKey]);

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
    if (prompt.trim() && !isLoading && hasApiKey) {
      onGenerate(prompt.trim());
    }
  };
  
  const handleSelectKey = async () => {
    await window.aistudio.openSelectKey();
    checkApiKey();
  };

  const handleDownload = () => {
    if (!generatedVideoUrl) return;
    const link = document.createElement('a');
    link.href = generatedVideoUrl;
    link.download = `animated-look-${Date.now()}.mp4`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
          <h2 className="text-2xl font-serif tracking-wider text-gray-800">{t.animateLookTitle}</h2>
          <button onClick={onClose} disabled={isLoading} className="p-1 rounded-full text-gray-500 hover:bg-gray-100 hover:text-gray-800 disabled:opacity-50">
            <XIcon className="w-6 h-6" />
          </button>
        </div>
        
        <div className="p-6 overflow-y-auto">
            {isLoading ? (
                <div className="flex flex-col items-center justify-center h-64 text-center">
                    <Spinner />
                    <p className="mt-4 text-gray-600 font-serif text-lg">{loadingMessage}</p>
                    <p className="mt-2 text-sm text-gray-500">{t.generatingVideo}</p>
                </div>
            ) : generatedVideoUrl ? (
                <div className="space-y-4">
                     <video src={generatedVideoUrl} controls autoPlay loop className="w-full rounded-lg" />
                     <button onClick={handleDownload} className="w-full flex items-center justify-center gap-3 py-3 px-4 text-center bg-gray-900 text-white font-semibold rounded-lg hover:bg-gray-700 transition-colors">
                        <DownloadIcon className="w-5 h-5"/>
                        {t.downloadVideo}
                    </button>
                </div>
            ) : (
                <div className="flex flex-col md:flex-row gap-6">
                    <div className="md:w-1/3 flex-shrink-0">
                        <p className="text-sm font-medium text-gray-700 mb-2">{t.currentLookLabel}</p>
                        <img src={currentOutfitImageUrl} alt={t.currentLookLabel} className="rounded-lg w-full aspect-[2/3] object-cover bg-gray-100" />
                    </div>
                    <form onSubmit={handleSubmit} className="md:w-2/3 flex flex-col space-y-4">
                        <div>
                            <label htmlFor="animation-prompt" className="block text-sm font-medium text-gray-700 mb-1">
                                {t.describeMovement}
                            </label>
                            <textarea
                                id="animation-prompt"
                                value={prompt}
                                onChange={(e) => setPrompt(e.target.value)}
                                placeholder={t.animationPromptPlaceholder}
                                rows={3}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-800 focus:border-gray-800 transition-shadow"
                            />
                        </div>
                        <div className="flex-grow"></div>
                        {!hasApiKey ? (
                             <div className="flex flex-col gap-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-sm">
                                <p className="text-yellow-800">{t.apiKeyRequired} <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" rel="noopener noreferrer" className="underline">{t.learnMoreBilling}</a>.</p>
                                <button type="button" onClick={handleSelectKey} className="flex items-center justify-center gap-2 mt-2 px-4 py-2 bg-yellow-400 text-yellow-900 font-semibold rounded-md hover:bg-yellow-500 transition-colors">
                                    <KeyIcon className="w-5 h-5"/>
                                    {t.selectApiKey}
                                </button>
                             </div>
                        ) : (
                             <button type="submit" disabled={!prompt.trim() || isLoading} className="w-full py-3 bg-gray-900 text-white font-semibold rounded-md hover:bg-gray-700 disabled:bg-gray-300 transition-colors">
                                {t.generateVideo}
                            </button>
                        )}
                    </form>
                </div>
            )}
        </div>
      </motion.div>
    </div>
  );
};

export default AnimateModal;
