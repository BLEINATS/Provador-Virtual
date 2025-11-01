/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React, { useState } from 'react';
import type { WardrobeItem } from '../types';
import { UploadCloudIcon, CheckCircleIcon, LinkIcon, GlobeIcon } from './icons';
import { AnimatePresence, motion } from 'framer-motion';
import { urlToFile } from '../lib/utils';
import { translations } from '../lib/translations';

type Language = 'pt-br' | 'en';

interface WardrobePanelProps {
  onApplySelection: (garmentFiles: File[], garmentInfos: WardrobeItem[]) => void;
  wornGarmentIds: string[];
  isLoading: boolean;
  wardrobe: WardrobeItem[];
  onUpload: (garmentFile: File, garmentInfo: WardrobeItem) => void;
  onOpenEcommerceModal: () => void;
  onOpenUrlImportModal: () => void;
  language: Language;
}

const WardrobePanel: React.FC<WardrobePanelProps> = ({ onApplySelection, wornGarmentIds, isLoading, wardrobe, onUpload, onOpenEcommerceModal, onOpenUrlImportModal, language }) => {
    const [error, setError] = useState<string | null>(null);
    const [selectedItems, setSelectedItems] = useState<WardrobeItem[]>([]);
    const t = translations[language];

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
            const filesAndInfos = await Promise.all(selectedItems.map(async item => {
                const file = await urlToFile(item.url, item.name);
                return { file, info: item };
            }));
            const files = filesAndInfos.map(f => f.file);
            const infos = filesAndInfos.map(f => f.info);
            onApplySelection(files, infos);
            setSelectedItems([]);
        } catch (err) {
            const detailedError = t.errorWardrobeItem;
            setError(detailedError);
            console.error(`[Error] Failed to load and convert wardrobe item.`, err);
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            if (!file.type.startsWith('image/')) {
                setError(t.errorFileGeneric);
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
    <div className="pt-6 border-t border-gray-400/50 flex flex-col flex-grow">
        <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-serif tracking-wider text-gray-800">{t.products}</h2>
            <div className="flex items-center gap-2 flex-wrap justify-end">
                <button onClick={onOpenEcommerceModal} title={t.importFromEcommerce} className={`flex items-center gap-2 px-3 py-1.5 text-sm font-semibold border-2 border-dashed rounded-md text-gray-500 transition-colors ${isLoading ? 'cursor-not-allowed bg-gray-100' : 'hover:border-gray-600 hover:text-gray-700 cursor-pointer'}`}>
                    <LinkIcon className="w-4 h-4" />
                </button>
                 <button onClick={onOpenUrlImportModal} title={t.importFromUrl} className={`flex items-center gap-2 px-3 py-1.5 text-sm font-semibold border-2 border-dashed rounded-md text-gray-500 transition-colors ${isLoading ? 'cursor-not-allowed bg-gray-100' : 'hover:border-gray-600 hover:text-gray-700 cursor-pointer'}`}>
                    <GlobeIcon className="w-4 h-4" />
                </button>
                <label htmlFor="custom-garment-upload" title={t.addNewProduct} className={`flex items-center gap-2 px-3 py-1.5 text-sm font-semibold border-2 border-dashed rounded-md text-gray-500 transition-colors ${isLoading ? 'cursor-not-allowed bg-gray-100' : 'hover:border-gray-600 hover:text-gray-700 cursor-pointer'}`}>
                    <UploadCloudIcon className="w-4 h-4"/>
                    <input id="custom-garment-upload" type="file" className="hidden" accept="image/png, image/jpeg, image/webp, image/avif, image/heic, image/heif" onChange={handleFileChange} disabled={isLoading}/>
                </label>
            </div>
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
                className={`relative aspect-square border rounded-lg overflow-hidden transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-800 group disabled:opacity-60 disabled:cursor-not-allowed ${isSelected ? 'border-blue-500 border-2' : 'border-gray-200'}`}
                aria-label={`${t.selectItem} ${item.name}`}
                >
                <img src={item.url} alt={item.name} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <p className="text-white text-xs font-bold text-center p-1">{item.name}</p>
                </div>
                {(isWorn || isSelected) && (
                    <div className={`absolute top-1 right-1 w-5 h-5 rounded-full flex items-center justify-center ${isWorn ? 'bg-gray-800' : 'bg-blue-500'}`}>
                        <CheckCircleIcon className="w-4 h-4 text-white" />
                    </div>
                )}
                </button>
            );
            })}
        </div>
        
        <AnimatePresence>
            {selectedItems.length > 0 && (
                <motion.div
                    initial={{ y: "100%", opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: "100%", opacity: 0 }}
                    transition={{ type: "spring", stiffness: 400, damping: 40 }}
                    className="pt-4 mt-auto"
                >
                    <button
                        onClick={handleApplyClick}
                        disabled={isLoading}
                        className="w-full text-center bg-gray-900 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200 ease-in-out hover:bg-gray-700 active:scale-95 text-base disabled:bg-gray-400 disabled:cursor-wait"
                    >
                        {t.wearItems} ({selectedItems.length})
                    </button>
                </motion.div>
            )}
        </AnimatePresence>
        
        {wardrobe.length === 0 && (
             <p className="text-center text-sm text-gray-500 mt-4">{t.wardrobeEmpty}</p>
        )}
        {error && <p className="text-red-500 text-sm mt-4">{error}</p>}
    </div>
  );
};

export default WardrobePanel;