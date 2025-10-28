/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React, { useState } from 'react';
import type { WardrobeItem } from '../types';
import { UploadCloudIcon, CheckCircleIcon } from './icons';
import { AnimatePresence, motion } from 'framer-motion';
import { urlToFile } from '../lib/utils';

interface WardrobePanelProps {
  onApplySelection: (garmentInfos: WardrobeItem[]) => void;
  wornGarmentIds: string[];
  isLoading: boolean;
  wardrobe: WardrobeItem[];
  onUpload: (garmentFile: File, garmentInfo: WardrobeItem) => void;
}

const WardrobePanel: React.FC<WardrobePanelProps> = ({ onApplySelection, wornGarmentIds, isLoading, wardrobe, onUpload }) => {
    const [error, setError] = useState<string | null>(null);
    const [selectedItems, setSelectedItems] = useState<WardrobeItem[]>([]);

    const handleItemToggle = (item: WardrobeItem) => {
        if (wornGarmentIds.includes(item.id)) return;
        setSelectedItems(prev => {
            const isSelected = prev.some(selected => selected.id === item.id);
            if (isSelected) {
                return prev.filter(selected => selected.id !== item.id);
            } else {
                return [...prev, item];
            }
        });
    };

    const handleApplyClick = async () => {
        if (isLoading || selectedItems.length === 0) return;
        setError(null);
        try {
            onApplySelection(selectedItems);
            setSelectedItems([]);
        } catch (err) {
            const detailedError = `Falha ao carregar o item do guarda-roupa.`;
            setError(detailedError);
            console.error(`[Error] Failed to load and convert wardrobe item.`, err);
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            if (!file.type.startsWith('image/')) {
                setError('Por favor, selecione um arquivo de imagem.');
                return;
            }
            const customGarmentInfo: WardrobeItem = {
                id: `custom-${Date.now()}`,
                name: file.name,
                url: URL.createObjectURL(file),
            };
            onUpload(file, customGarmentInfo);
        }
    };

  return (
    <div className="border-t pt-6 flex flex-col flex-grow">
        <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-serif tracking-wider text-foreground">Produtos</h2>
            <label htmlFor="custom-garment-upload" className={`flex items-center gap-2 px-3 py-1.5 text-sm font-semibold border-2 border-dashed rounded-lg text-muted-foreground transition-colors ${isLoading ? 'cursor-not-allowed bg-muted' : 'hover:border-foreground/50 hover:text-foreground cursor-pointer'}`}>
                <UploadCloudIcon className="w-4 h-4"/>
                <span>Adicionar Novo</span>
                <input id="custom-garment-upload" type="file" className="hidden" accept="image/png, image/jpeg, image/webp, image/avif, image/heic, image/heif" onChange={handleFileChange} disabled={isLoading}/>
            </label>
        </div>
        <div className="grid grid-cols-3 gap-3 flex-grow">
            {wardrobe.map((item) => {
            const isWorn = wornGarmentIds.includes(item.id);
            const isSelected = selectedItems.some(s => s.id === item.id);
            return (
                <button
                key={item.id}
                onClick={() => handleItemToggle(item)}
                disabled={isLoading || isWorn}
                className={`relative aspect-square border rounded-lg overflow-hidden transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary group disabled:opacity-50 disabled:cursor-not-allowed ${isSelected ? 'ring-2 ring-primary ring-offset-2' : 'border-border'}`}
                aria-label={`Selecionar ${item.name}`}
                >
                <img src={item.url} alt={item.name} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center p-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <p className="text-white text-xs font-bold text-center">{item.name}</p>
                </div>
                {(isWorn || isSelected) && (
                    <div className={`absolute top-1.5 right-1.5 w-5 h-5 rounded-full flex items-center justify-center border-2 border-background ${isWorn ? 'bg-foreground' : 'bg-primary'}`}>
                        <CheckCircleIcon className="w-4 h-4 text-background" />
                    </div>
                )}
                </button>
            );
            })}
        </div>
        
        <AnimatePresence>
            {selectedItems.length > 0 && (
                <motion.div
                    initial={{ y: "110%", opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: "110%", opacity: 0 }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    className="pt-4 mt-auto"
                >
                    <button
                        onClick={handleApplyClick}
                        disabled={isLoading}
                        className="w-full text-center bg-primary text-primary-foreground font-semibold py-3 px-4 rounded-lg transition-colors duration-200 ease-in-out hover:bg-primary/90 active:scale-95 text-base disabled:bg-muted disabled:text-muted-foreground disabled:cursor-wait"
                    >
                        Vestir Itens ({selectedItems.length})
                    </button>
                </motion.div>
            )}
        </AnimatePresence>
        
        {wardrobe.length === 0 && (
             <p className="text-center text-sm text-muted-foreground mt-4">Os produtos da sua loja aparecerão aqui.</p>
        )}
        {error && <p className="text-destructive text-sm mt-4">{error}</p>}
    </div>
  );
};

export default WardrobePanel;
