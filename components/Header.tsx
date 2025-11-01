/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React from 'react';
import { ShirtIcon, HomeIcon, CrownIcon, GlobeIcon } from './icons';
import { translations } from '../lib/translations';

interface HeaderProps {
    onGoHome: () => void;
    onOpenSubscription: () => void;
    activeModelName?: string;
    language: 'pt-br' | 'en';
    onLanguageChange: (lang: 'pt-br' | 'en') => void;
}

const Header: React.FC<HeaderProps> = ({ onGoHome, onOpenSubscription, activeModelName, language, onLanguageChange }) => {
  const t = translations[language];
  const toggleLanguage = () => {
    onLanguageChange(language === 'pt-br' ? 'en' : 'pt-br');
  };

  return (
    <header className="w-full py-4 px-4 md:px-8 bg-white/80 backdrop-blur-md sticky top-0 z-40 border-b border-gray-200/60">
      <div className="flex items-center justify-between">
          <button onClick={onGoHome} className="flex items-center gap-3 group">
            <ShirtIcon className="w-6 h-6 text-gray-700" />
            <h1 className="text-2xl font-serif tracking-widest text-gray-800 group-hover:text-gray-900 transition-colors">
                {t.virtualTryOn}
            </h1>
          </button>
          <div className="flex items-center gap-4">
             {activeModelName && <span className="hidden sm:block text-sm text-gray-500 font-medium">{t.modelLabel} <span className="font-semibold text-gray-800">{activeModelName}</span></span>}
             <div className="flex items-center gap-2">
                <button 
                    onClick={onOpenSubscription} 
                    className="p-2 text-gray-700 hover:bg-gray-200 rounded-md"
                    aria-label={t.viewPlans}
                >
                    <CrownIcon className="w-6 h-6" />
                </button>
                <button 
                    onClick={toggleLanguage} 
                    className="p-2 text-gray-700 hover:bg-gray-200 rounded-md"
                    aria-label={t.language}
                >
                    <GlobeIcon className="w-6 h-6" />
                </button>
                <button 
                    onClick={onGoHome} 
                    className="p-2 text-gray-700 hover:bg-gray-200 rounded-md"
                    aria-label={t.backToLibrary}
                >
                    <HomeIcon className="w-6 h-6" />
                </button>
              </div>
          </div>
      </div>
    </header>
  );
};

export default Header;