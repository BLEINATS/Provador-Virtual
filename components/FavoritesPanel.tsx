/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React from 'react';
import { SavedOutfit } from '../types';
import { Trash2Icon } from './icons';
import { motion, AnimatePresence } from 'framer-motion';

interface FavoritesPanelProps {
  savedOutfits: SavedOutfit[];
  onLoadOutfit: (outfit: SavedOutfit) => void;
  onDeleteOutfit: (id: string) => void;
}

const FavoritesPanel: React.FC<FavoritesPanelProps> = ({ savedOutfits, onLoadOutfit, onDeleteOutfit }) => {
  return (
    <div className="flex flex-col h-full pt-6 border-t">
       <h2 className="text-lg font-serif tracking-wider text-foreground mb-3">Looks Salvos</h2>
      <AnimatePresence>
        {savedOutfits.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex-grow flex flex-col items-center justify-center text-center p-4 bg-muted rounded-lg"
          >
            <p className="text-muted-foreground">Seus looks salvos aparecerão aqui.</p>
            <p className="text-sm text-muted-foreground/70 mt-1">Clique no ícone de coração para salvar um look.</p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {savedOutfits.map((outfit) => (
              <motion.div
                key={outfit.id}
                layout
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.3 }}
                className="relative group aspect-[3/4] border rounded-lg overflow-hidden"
              >
                <img
                  src={outfit.imageUrl}
                  alt="Look salvo"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-2">
                   <div className="flex items-center justify-center gap-2">
                        <button
                            onClick={() => onLoadOutfit(outfit)}
                            className="w-full text-center bg-white/90 text-black text-sm font-semibold py-1.5 px-2 rounded-md transition-colors duration-200 ease-in-out hover:bg-white backdrop-blur-sm"
                        >
                            Vestir
                        </button>
                        <button
                            onClick={() => onDeleteOutfit(outfit.id)}
                            className="p-2 text-white bg-black/50 rounded-md hover:bg-destructive transition-colors"
                            aria-label="Excluir look"
                        >
                            <Trash2Icon className="w-4 h-4" />
                        </button>
                   </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FavoritesPanel;
