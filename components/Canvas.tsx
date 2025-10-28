/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React, { useState, useRef, MouseEvent } from 'react';
import MagnifyingGlass from './MagnifyingGlass';
import { ZoomInIcon, DownloadIcon, Wand2Icon, LayersIcon } from './icons';
import { cn } from '../lib/utils';

interface CanvasProps {
  imageUrl: string | null;
  onZoom: () => void;
  onRefine: () => void;
  onChangeBackground: () => void;
  isDesktop: boolean;
}

const Canvas: React.FC<CanvasProps> = ({ imageUrl, onZoom, onRefine, onChangeBackground, isDesktop }) => {
  const [magnifierPosition, setMagnifierPosition] = useState({ x: 0, y: 0 });
  const [isMagnifierVisible, setIsMagnifierVisible] = useState(false);
  const imageRef = useRef<HTMLImageElement>(null);

  const handleMouseMove = (e: MouseEvent<HTMLImageElement>) => {
    if (!imageRef.current || !isDesktop) return;
    const rect = imageRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setMagnifierPosition({ x, y });
  };

  const handleDownload = () => {
    if (!imageUrl) return;
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = `provador-virtual-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  return (
    <div className="relative w-full h-full flex items-center justify-center p-4 md:p-8 pt-44 lg:pt-8">
      {imageUrl ? (
        <div className="relative shadow-2xl rounded-2xl overflow-hidden group">
          <img
            ref={imageRef}
            src={imageUrl}
            alt="Look atual"
            className="max-w-full max-h-[calc(100vh-280px)] lg:max-h-[calc(100vh-150px)] object-contain"
            onMouseEnter={() => isDesktop && setIsMagnifierVisible(true)}
            onMouseLeave={() => setIsMagnifierVisible(false)}
            onMouseMove={handleMouseMove}
            onClick={onZoom}
          />
          {isDesktop && (
            <MagnifyingGlass
              src={imageUrl}
              position={magnifierPosition}
              visible={isMagnifierVisible}
            />
          )}
          <div className={cn(
              "absolute flex items-center gap-2 bg-background/80 backdrop-blur-md p-2 rounded-full shadow-lg",
              isDesktop ? "bottom-4 left-1/2 -translate-x-1/2" : "bottom-4 right-4 flex-col"
          )}>
              <button onClick={onZoom} className="p-2.5 rounded-full text-foreground hover:bg-accent transition-colors" aria-label="Zoom">
                  <ZoomInIcon className="w-6 h-6" />
              </button>
              <button onClick={handleDownload} className="p-2.5 rounded-full text-foreground hover:bg-accent transition-colors" aria-label="Baixar imagem">
                  <DownloadIcon className="w-6 h-6" />
              </button>
               <button onClick={onRefine} className="p-2.5 rounded-full text-foreground hover:bg-accent transition-colors" aria-label="Refinar imagem">
                  <Wand2Icon className="w-6 h-6" />
              </button>
               <button onClick={onChangeBackground} className="p-2.5 rounded-full text-foreground hover:bg-accent transition-colors" aria-label="Mudar fundo">
                  <LayersIcon className="w-6 h-6" />
              </button>
          </div>
        </div>
      ) : (
        <div className="w-full h-[600px] bg-muted rounded-2xl flex items-center justify-center">
            <p className="text-muted-foreground font-serif">Seu modelo aparecerá aqui.</p>
        </div>
      )}
    </div>
  );
};

export default Canvas;
