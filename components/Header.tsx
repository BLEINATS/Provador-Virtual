/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React from 'react';
import { ShirtIcon, HomeIcon } from './icons';

interface HeaderProps {
    onGoHome: () => void;
}

const Header: React.FC<HeaderProps> = ({ onGoHome }) => {
  return (
    <header className="w-full py-3 px-4 md:px-6 bg-background/80 backdrop-blur-md sticky top-0 z-20 border-b">
      <div className="flex items-center justify-between max-w-[1600px] mx-auto">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-primary text-primary-foreground flex items-center justify-center rounded-md">
                <ShirtIcon className="w-5 h-5" />
            </div>
            <h1 className="text-xl font-serif tracking-widest text-foreground">
                Provador Virtual
            </h1>
          </div>
          <button 
              onClick={onGoHome} 
              className="p-2 text-muted-foreground hover:bg-accent hover:text-foreground rounded-md transition-colors"
              aria-label="Voltar para a tela inicial"
          >
              <HomeIcon className="w-6 h-6" />
          </button>
      </div>
    </header>
  );
};

export default Header;
