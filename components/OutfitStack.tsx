/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React from 'react';
import { OutfitLayer } from '../types';
import { Trash2Icon, HeartIcon } from './icons';
import { cn } from '../lib/utils';

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
      <div className="flex justify-between items-center border-b pb-2 mb-3">
        <h2 className="text-lg font-serif tracking-wider text-foreground">Look Atual</h2>
        {canSave && (
           <button
            onClick={onSaveOutfit}
            disabled={isCurrentOutfitSaved}
            className="flex items-center gap-1.5 text-sm font-semibold text-muted-foreground hover:text-foreground disabled:text-pink-600 disabled:cursor-not-allowed transition-colors"
            aria-label={isCurrentOutfitSaved ? 'Look salvo' : 'Salvar look'}
           >
            <HeartIcon className={cn('w-5 h-5 transition-all', isCurrentOutfitSaved ? 'fill-current text-pink-500' : 'fill-transparent')} />
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
              className="flex items-center justify-between bg-card p-2 rounded-lg border"
            >
              <div className="flex items-center overflow-hidden gap-3">
                  <span className="flex-shrink-0 flex items-center justify-center w-6 h-6 text-xs font-bold text-muted-foreground bg-muted rounded-full">
                    {index + 1}
                  </span>
                  <div className="flex items-center gap-2 overflow-hidden">
                    {layer.garments.length > 0 ? (
                      <>
                        <div className="flex flex-shrink-0 -space-x-4">
                          {layer.garments.slice(0, 3).map(garment => (
                              <img key={garment.id} src={garment.url} alt={garment.name} className="w-10 h-10 object-cover rounded-md border-2 border-background bg-muted" />
                          ))}
                        </div>
                        <span className="font-semibold text-foreground truncate" title={garmentNames}>
                          {garmentNames}
                        </span>
                      </>
                    ) : (
                      <span className="font-semibold text-foreground">Modelo Base</span>
                    )}
                  </div>
              </div>
              {index > 0 && index === outfitHistory.length - 1 && (
                 <button
                  onClick={onRemoveLastGarment}
                  className="flex-shrink-0 text-muted-foreground hover:text-destructive transition-colors p-2 rounded-md hover:bg-destructive/10"
                  aria-label={`Remover ${garmentNames}`}
                >
                  <Trash2Icon className="w-5 h-5" />
                </button>
              )}
            </div>
          )
        })}
        {outfitHistory.length === 1 && outfitHistory[0].garments.length === 0 && (
            <div className="text-center text-sm text-muted-foreground py-4">
              <p>Seus itens vestidos aparecerão aqui.</p>
              <p className="text-xs">Selecione um item em "Produtos".</p>
            </div>
        )}
      </div>
    </div>
  );
};

export default OutfitStack;
