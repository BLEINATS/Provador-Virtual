/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React from 'react';
import { ShirtIcon, MenuIcon, HomeIcon } from './icons';

interface HeaderProps {
    isDesktop: boolean;
    onMenuClick: () => void;
    onGoHome: () => void;
}

const Header: React.FC<HeaderProps> = ({ isDesktop, onMenuClick, onGoHome }) => {
  return (
    <header className="w-full py-4 px-4 md:px-8 bg-white/80 backdrop-blur-md sticky top-0 z-40 border-b border-gray-200/60">
      <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <ShirtIcon className="w-6 h-6 text-gray-700" />
            <h1 className="text-2xl font-serif tracking-widest text-gray-800">
                Provador Virtual
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <button 
                onClick={onGoHome} 
                className="p-2 text-gray-700 hover:bg-gray-200 rounded-md"
                aria-label="Voltar para a tela inicial"
            >
                <HomeIcon className="w-6 h-6" />
            </button>
            {!isDesktop && (
              <button 
                  onClick={onMenuClick} 
                  className="p-2 text-gray-700 hover:bg-gray-200 rounded-md"
                  aria-label="Abrir menu"
              >
                  <MenuIcon className="w-6 h-6" />
              </button>
            )}
          </div>
      </div>
    </header>
  );
};

export default Header;