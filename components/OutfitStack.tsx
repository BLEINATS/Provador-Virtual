/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React from 'react';
import { OutfitLayer } from '../types';
import { Trash2Icon, HeartIcon } from './icons';

interface OutfitStackProps {
  outfitHistory: OutfitLayer[];
  onRemoveLastGarment: () => void;
  onSaveOutfit: () => void;
  isCurrentOutfitSaved: boolean;
}

const OutfitStack: React.FC<OutfitStackProps> = ({ outfitHistory, onRemoveLastGarment, onSaveOutfit, isCurrentOutfitSaved }) => {
  const canSave = outfitHistory.length > 1 && outfitHistory[outfitHistory.length -1].garments.length > 0;

  return (
    <div className="flex flex-col">
      <div className="flex justify-between items-center border-b border-gray-400/50 pb-2 mb-3">
        <h2 className="text-xl font-serif tracking-wider text-gray-800">Look Atual</h2>
        {canSave && (
           <button
            onClick={onSaveOutfit}
            disabled={isCurrentOutfitSaved}
            className="flex items-center gap-2 text-sm font-semibold text-gray-700 hover:text-gray-900 disabled:text-pink-600 disabled:cursor-not-allowed transition-colors"
            aria-label={isCurrentOutfitSaved ? 'Look salvo' : 'Salvar look'}
           >
            <HeartIcon className={`w-5 h-5 transition-all ${isCurrentOutfitSaved ? 'fill-current text-pink-500' : ''}`} />
            {isCurrentOutfitSaved ? 'Salvo' : 'Salvar'}
           </button>
        )}
      </div>
      <div className="space-y-2">
        {outfitHistory.map((layer, index) => {
          const garmentNames = layer.garments.map(g => g.name).join(', ');
          return (
            <div
              key={layer.garments.map(g => g.id).join('-') || 'base'}
              className="flex items-center justify-between bg-white/50 p-2 rounded-lg animate-fade-in border border-gray-200/80"
            >
              <div className="flex items-center overflow-hidden gap-3">
                  <span className="flex-shrink-0 flex items-center justify-center w-6 h-6 text-xs font-bold text-gray-600 bg-gray-200 rounded-full">
                    {index + 1}
                  </span>
                  <div className="flex items-center gap-2 overflow-hidden">
                    {layer.garments.length > 0 ? (
                      <>
                        <div className="flex flex-shrink-0 -space-x-4">
                          {layer.garments.slice(0, 3).map(garment => (
                              <img key={garment.id} src={garment.url} alt={garment.name} className="w-12 h-12 object-cover rounded-md border-2 border-white bg-gray-100" />
                          ))}
                        </div>
                        <span className="font-semibold text-gray-800 truncate" title={garmentNames}>
                          {garmentNames}
                        </span>
                      </>
                    ) : (
                      <span className="font-semibold text-gray-800">Modelo Base</span>
                    )}
                  </div>
              </div>
              {index > 0 && index === outfitHistory.length - 1 && (
                 <button
                  onClick={onRemoveLastGarment}
                  className="flex-shrink-0 text-gray-500 hover:text-red-600 transition-colors p-2 rounded-md hover:bg-red-50"
                  aria-label={`Remover ${garmentNames}`}
                >
                  <Trash2Icon className="w-5 h-5" />
                </button>
              )}
            </div>
          )
        })}
        {outfitHistory.length === 1 && outfitHistory[0].garments.length === 0 && (
            <p className="text-center text-sm text-gray-500 pt-4">Seus itens vestidos aparecerão aqui. Selecione um item do guarda-roupa abaixo.</p>
        )}
      </div>
    </div>
  );
};

export default OutfitStack;
