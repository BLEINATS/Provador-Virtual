/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React, { useState, useRef, MouseEvent } from 'react';
import MagnifyingGlass from './MagnifyingGlass';
import { ZoomInIcon, DownloadIcon, Wand2Icon, LayersIcon } from './icons';

interface CanvasProps {
  imageUrl: string | null;
  onZoom: () => void;
  onRefine: () => void;
  onChangeBackground: () => void;
}

// FIX: Implement Canvas component for displaying the model and interactive toolbar
const Canvas: React.FC<CanvasProps> = ({ imageUrl, onZoom, onRefine, onChangeBackground }) => {
  const [magnifierPosition, setMagnifierPosition] = useState({ x: 0, y: 0 });
  const [isMagnifierVisible, setIsMagnifierVisible] = useState(false);
  const imageRef = useRef<HTMLImageElement>(null);

  const handleMouseMove = (e: MouseEvent<HTMLImageElement>) => {
    if (!imageRef.current) return;
    const rect = imageRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setMagnifierPosition({ x, y });
  };

  const handleDownload = () => {
    if (!imageUrl) return;
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = `virtual-try-on-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  return (
    <div className="relative w-full h-full flex items-center justify-center p-4 md:p-8">
      {imageUrl ? (
        <div className="relative shadow-2xl rounded-2xl overflow-hidden group">
          <img
            ref={imageRef}
            src={imageUrl}
            alt="Current outfit"
            className="max-w-full max-h-[calc(100vh-200px)] object-contain cursor-zoom-in"
            onMouseEnter={() => setIsMagnifierVisible(true)}
            onMouseLeave={() => setIsMagnifierVisible(false)}
            onMouseMove={handleMouseMove}
            onClick={onZoom}
          />
          <MagnifyingGlass
            src={imageUrl}
            position={magnifierPosition}
            visible={isMagnifierVisible}
          />
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-white/80 backdrop-blur-md p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <button onClick={onZoom} className="p-2.5 rounded-full text-gray-700 hover:bg-gray-200 transition-colors" aria-label="Zoom in">
                  <ZoomInIcon className="w-6 h-6" />
              </button>
              <button onClick={handleDownload} className="p-2.5 rounded-full text-gray-700 hover:bg-gray-200 transition-colors" aria-label="Download image">
                  <DownloadIcon className="w-6 h-6" />
              </button>
               <button onClick={onRefine} className="p-2.5 rounded-full text-gray-700 hover:bg-gray-200 transition-colors" aria-label="Refine image">
                  <Wand2Icon className="w-6 h-6" />
              </button>
               <button onClick={onChangeBackground} className="p-2.5 rounded-full text-gray-700 hover:bg-gray-200 transition-colors" aria-label="Change background">
                  <LayersIcon className="w-6 h-6" />
              </button>
          </div>
        </div>
      ) : (
        <div className="w-full h-[600px] bg-gray-200 rounded-2xl flex items-center justify-center">
            <p className="text-gray-500 font-serif">Seu modelo aparecerá aqui.</p>
        </div>
      )}
    </div>
  );
};

export default Canvas;
