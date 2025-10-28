/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import StartScreen from './components/StartScreen';
import Header from './components/Header';
import Footer from './components/Footer';
import Canvas from './components/Canvas';
import OutfitStack from './components/OutfitStack';
import WardrobePanel from './components/WardrobePanel';
import PosePanel from './components/PosePanel';
import FavoritesPanel from './components/FavoritesPanel';
import LoadingOverlay from './components/LoadingOverlay';
import ZoomModal from './components/ZoomModal';
import BackgroundModal from './components/BackgroundModal';
import RefineModal from './components/RefineModal';
import BottomNav from './components/BottomNav';
import BottomSheet from './components/BottomSheet';
import { dressModel } from './services/geminiService';
import { urlToFile, getFriendlyErrorMessage } from './lib/utils';
import type { OutfitLayer, SavedOutfit, WardrobeItem } from './types';
import { defaultWardrobe } from './wardrobe';
import { useMediaQuery } from './hooks/useMediaQuery';

const App: React.FC = () => {
    const [modelUrl, setModelUrl] = useState<string | null>(null);
    const [outfitHistory, setOutfitHistory] = useState<OutfitLayer[]>([]);
    const [currentPose, setCurrentPose] = useState<string>('de pé, virado para a frente, expressão neutra');
    const [isLoading, setIsLoading] = useState(false);
    const [loadingMessage, setLoadingMessage] = useState('');
    const [wardrobe, setWardrobe] = useState<WardrobeItem[]>(defaultWardrobe);
    const [savedOutfits, setSavedOutfits] = useState<SavedOutfit[]>([]);
    const [isCurrentOutfitSaved, setIsCurrentOutfitSaved] = useState(false);
    
    // Modal states
    const [isZoomModalOpen, setIsZoomModalOpen] = useState(false);
    const [isBackgroundModalOpen, setIsBackgroundModalOpen] = useState(false);
    const [isRefineModalOpen, setIsRefineModalOpen] = useState(false);
    
    // Mobile-specific state
    const [activeSheet, setActiveSheet] = useState<string | null>(null);

    const isDesktop = useMediaQuery('(min-width: 1024px)');
    
    useEffect(() => {
        // Close sheet if screen resizes to desktop
        if(isDesktop) {
            setActiveSheet(null);
        }
    }, [isDesktop]);

    const currentOutfitImage = useMemo(() => {
        if (outfitHistory.length === 0) return null;
        const lastLayer = outfitHistory[outfitHistory.length - 1];
        return lastLayer.poseImages[currentPose] || lastLayer.poseImages['default'] || null;
    }, [outfitHistory, currentPose]);
    
    const allWornGarmentIds = useMemo(() => {
      return outfitHistory.flatMap(layer => layer.garments.map(g => g.id));
    }, [outfitHistory]);

    const handleModelFinalized = (url: string) => {
        setModelUrl(url);
        setOutfitHistory([{ garments: [], poseImages: { 'default': url } }]);
    };

    const generateOutfit = useCallback(async (
      newGarments: WardrobeItem[],
      pose: string,
      backgroundFile?: File,
      backgroundPrompt?: string,
      refinementPrompt?: string
    ) => {
        setIsLoading(true);
        try {
            const baseLayer = outfitHistory[0];
            const baseModelUrl = baseLayer.poseImages['default'];
            if (!baseModelUrl) throw new Error("Base model image not found.");

            const baseModelFile = await urlToFile(baseModelUrl, 'model.png');
            
            const garmentFiles: File[] = [];
            const allGarmentsInHistory = outfitHistory.slice(1).flatMap(l => l.garments);
            const allGarmentsToWear = [...allGarmentsInHistory, ...newGarments];

            for (const garment of allGarmentsToWear) {
                const file = await urlToFile(garment.url, `${garment.id}.png`);
                garmentFiles.push(file);
            }
            
            const newImageUrl = await dressModel(baseModelFile, garmentFiles, pose, backgroundFile, backgroundPrompt, refinementPrompt);
            
            const lastLayer = outfitHistory[outfitHistory.length - 1];
            
            if (refinementPrompt) {
                const updatedHistory = [...outfitHistory];
                const updatedLayer = { ...lastLayer };
                updatedLayer.poseImages = { ...updatedLayer.poseImages, [pose]: newImageUrl, 'default': newImageUrl };
                updatedHistory[updatedHistory.length - 1] = updatedLayer;
                setOutfitHistory(updatedHistory);
            } else {
                const newLayer: OutfitLayer = {
                    garments: newGarments,
                    poseImages: { [pose]: newImageUrl, 'default': newImageUrl },
                };
                setOutfitHistory(prev => [...prev, newLayer]);
            }
            setIsCurrentOutfitSaved(false);
        } catch (err) {
            alert(getFriendlyErrorMessage(err, 'Falha ao gerar o look'));
        } finally {
            setIsLoading(false);
            setLoadingMessage('');
            setIsRefineModalOpen(false);
            setIsBackgroundModalOpen(false);
        }
    }, [outfitHistory]);

    const handlePoseSelect = useCallback(async (poseInstruction: string) => {
        setLoadingMessage('Mudando a pose do modelo...');
        setCurrentPose(poseInstruction);
        const lastLayer = outfitHistory[outfitHistory.length - 1];
        if (lastLayer.poseImages[poseInstruction]) {
            setActiveSheet(null);
            return;
        }; 
        setActiveSheet(null);
        await generateOutfit([], poseInstruction);
    }, [outfitHistory, generateOutfit]);

    const handleApplySelection = useCallback(async (garmentInfos: WardrobeItem[]) => {
        setLoadingMessage('Vestindo os novos itens...');
        setActiveSheet(null);
        await generateOutfit(garmentInfos, currentPose);
    }, [currentPose, generateOutfit]);

    const handleUploadToWardrobe = (garmentFile: File, garmentInfo: WardrobeItem) => {
        setWardrobe(prev => [garmentInfo, ...prev]);
        handleApplySelection([garmentInfo]);
    };

    const handleRemoveLastGarment = () => {
        if (outfitHistory.length > 1) {
            setOutfitHistory(outfitHistory.slice(0, -1));
            setIsCurrentOutfitSaved(false);
        }
    };

    const handleSaveOutfit = () => {
        if (!currentOutfitImage || isCurrentOutfitSaved) return;
        const newSavedOutfit: SavedOutfit = {
            id: `saved-${Date.now()}`,
            imageUrl: currentOutfitImage,
            layers: [...outfitHistory],
        };
        setSavedOutfits(prev => [newSavedOutfit, ...prev]);
        setIsCurrentOutfitSaved(true);
    };

    const handleLoadOutfit = (outfit: SavedOutfit) => {
        setOutfitHistory(outfit.layers);
        const lastLayer = outfit.layers[outfit.layers.length-1];
        const lastPose = Object.keys(lastLayer.poseImages).find(p => p !== 'default') || 'de pé, virado para a frente, expressão neutra';
        setCurrentPose(lastPose);
        setIsCurrentOutfitSaved(true);
        setActiveSheet(null);
    };
    
    const handleDeleteOutfit = (id: string) => {
        setSavedOutfits(prev => prev.filter(o => o.id !== id));
    };
    
    const handleBackgroundGenerate = (prompt: string, files?: File[]) => {
        setLoadingMessage('Mudando o fundo...');
        generateOutfit([], currentPose, files?.[0], prompt);
    };
    
    const handleRefine = (prompt: string) => {
        setLoadingMessage('Refinando a imagem...');
        generateOutfit([], currentPose, undefined, undefined, prompt);
    };

    const handleGoHome = () => {
        setModelUrl(null); 
        setOutfitHistory([]);
        setCurrentPose('de pé, virado para a frente, expressão neutra');
        setWardrobe(defaultWardrobe);
        setSavedOutfits([]);
        setIsCurrentOutfitSaved(false);
        setIsZoomModalOpen(false);
        setIsBackgroundModalOpen(false);
        setIsRefineModalOpen(false);
        setActiveSheet(null);
    };
    
    const handleSheetChange = (sheet: string) => {
        if (activeSheet === sheet) {
            setActiveSheet(null);
        } else {
            setActiveSheet(sheet);
        }
    };

    if (!modelUrl) {
        return <StartScreen onModelFinalized={handleModelFinalized} />;
    }

    const sheetTitles: { [key: string]: string } = {
        wardrobe: 'Produtos',
        favorites: 'Looks Favoritos',
        pose: 'Personalizar Pose'
    };

    return (
        <div className="min-h-screen bg-background text-foreground flex flex-col">
            <Header onGoHome={handleGoHome} />
            <main className="flex-grow w-full max-w-[1600px] mx-auto flex flex-col lg:flex-row">
                <div className="relative flex-grow flex items-center justify-center lg:order-2 pb-16 lg:pb-0">
                    <Canvas
                        imageUrl={currentOutfitImage}
                        onZoom={() => setIsZoomModalOpen(true)}
                        onRefine={() => setIsRefineModalOpen(true)}
                        onChangeBackground={() => setIsBackgroundModalOpen(true)}
                        isDesktop={isDesktop}
                    />
                    {isLoading && <LoadingOverlay message={loadingMessage} />}
                </div>
                
                {isDesktop && (
                    <aside className="w-full lg:w-[380px] lg:order-1 bg-card/80 backdrop-blur-md border-r p-6 flex-shrink-0 flex flex-col gap-6">
                        <OutfitStack
                            outfitHistory={outfitHistory}
                            onRemoveLastGarment={handleRemoveLastGarment}
                            onSaveOutfit={handleSaveOutfit}
                            isCurrentOutfitSaved={isCurrentOutfitSaved}
                        />
                        <WardrobePanel
                            onApplySelection={handleApplySelection}
                            wornGarmentIds={allWornGarmentIds}
                            isLoading={isLoading}
                            wardrobe={wardrobe}
                            onUpload={handleUploadToWardrobe}
                        />
                        <FavoritesPanel savedOutfits={savedOutfits} onLoadOutfit={handleLoadOutfit} onDeleteOutfit={handleDeleteOutfit}/>
                        <PosePanel onPoseSelect={handlePoseSelect} isLoading={isLoading} />
                    </aside>
                )}
            </main>
            <Footer isOnDressingScreen />
            
            {!isDesktop && (
                <>
                    <div className="fixed top-16 left-0 right-0 p-4 z-10 bg-background">
                        <OutfitStack
                            outfitHistory={outfitHistory}
                            onRemoveLastGarment={handleRemoveLastGarment}
                            onSaveOutfit={handleSaveOutfit}
                            isCurrentOutfitSaved={isCurrentOutfitSaved}
                        />
                    </div>
                    <BottomNav activeSheet={activeSheet} onSheetChange={handleSheetChange} />
                    <BottomSheet isOpen={!!activeSheet} onClose={() => setActiveSheet(null)} title={activeSheet ? sheetTitles[activeSheet] : ''}>
                        {activeSheet === 'wardrobe' &&  <WardrobePanel onApplySelection={handleApplySelection} wornGarmentIds={allWornGarmentIds} isLoading={isLoading} wardrobe={wardrobe} onUpload={handleUploadToWardrobe}/>}
                        {activeSheet === 'favorites' && <FavoritesPanel savedOutfits={savedOutfits} onLoadOutfit={handleLoadOutfit} onDeleteOutfit={handleDeleteOutfit}/>}
                        {activeSheet === 'pose' && <PosePanel onPoseSelect={handlePoseSelect} isLoading={isLoading} />}
                    </BottomSheet>
                </>
            )}

            <AnimatePresence>
                {isZoomModalOpen && currentOutfitImage && (
                    <ZoomModal imageUrl={currentOutfitImage} onClose={() => setIsZoomModalOpen(false)} />
                )}
                {isBackgroundModalOpen && (
                    <BackgroundModal
                        isOpen={isBackgroundModalOpen}
                        onClose={() => setIsBackgroundModalOpen(false)}
                        onGenerate={handleBackgroundGenerate}
                        isLoading={isLoading && loadingMessage === 'Mudando o fundo...'}
                    />
                )}
                 {isRefineModalOpen && (
                    <RefineModal
                        isOpen={isRefineModalOpen}
                        onClose={() => setIsRefineModalOpen(false)}
                        onRefine={handleRefine}
                        isLoading={isLoading && loadingMessage === 'Refinando a imagem...'}
                    />
                 )}
            </AnimatePresence>
        </div>
    );
};

export default App;
