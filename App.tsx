/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import StartScreen from './components/StartScreen';
import Header from './components/Header';
import Footer from './components/Footer';
import Canvas from './components/Canvas';
import OutfitStack from './components/OutfitStack';
import WardrobePanel from './components/WardrobeModal';
import PosePanel from './components/PosePanel';
import FavoritesPanel from './components/FavoritesPanel';
import LoadingOverlay from './components/LoadingOverlay';
import ZoomModal from './components/ZoomModal';
import BackgroundModal from './components/BackgroundModal';
import RefineModal from './components/RefineModal';
import { dressModel } from './services/geminiService';
import { urlToFile, getFriendlyErrorMessage } from './lib/utils';
import type { OutfitLayer, SavedOutfit, WardrobeItem } from './types';
import { defaultWardrobe } from './wardrobe';
import { useMediaQuery } from './hooks/useMediaQuery';
import { XIcon } from './components/icons';

interface SidePanelContentProps {
  outfitHistory: OutfitLayer[];
  onRemoveLastGarment: () => void;
  onSaveOutfit: () => void;
  isCurrentOutfitSaved: boolean;
  isDesktop: boolean;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onApplySelection: (garmentFiles: File[], garmentInfos: WardrobeItem[]) => void;
  allWornGarmentIds: string[];
  isLoading: boolean;
  wardrobe: WardrobeItem[];
  onUpload: (garmentFile: File, garmentInfo: WardrobeItem) => void;
  savedOutfits: SavedOutfit[];
  onLoadOutfit: (outfit: SavedOutfit) => void;
  onDeleteOutfit: (id: string) => void;
  onPoseSelect: (poseInstruction: string) => void;
}

const SidePanelContent: React.FC<SidePanelContentProps> = ({
  outfitHistory,
  onRemoveLastGarment,
  onSaveOutfit,
  isCurrentOutfitSaved,
  isDesktop,
  activeTab,
  setActiveTab,
  onApplySelection,
  allWornGarmentIds,
  isLoading,
  wardrobe,
  onUpload,
  savedOutfits,
  onLoadOutfit,
  onDeleteOutfit,
  onPoseSelect
}) => {
    return (
      <div className="flex flex-col h-full">
            <OutfitStack
                outfitHistory={outfitHistory}
                onRemoveLastGarment={onRemoveLastGarment}
                onSaveOutfit={onSaveOutfit}
                isCurrentOutfitSaved={isCurrentOutfitSaved}
            />
            <div className="flex-grow flex flex-col mt-6">
              {isDesktop ? (
                <>
                  <WardrobePanel
                    onApplySelection={onApplySelection}
                    wornGarmentIds={allWornGarmentIds}
                    isLoading={isLoading}
                    wardrobe={wardrobe}
                    onUpload={onUpload}
                  />
                  <FavoritesPanel savedOutfits={savedOutfits} onLoadOutfit={onLoadOutfit} onDeleteOutfit={onDeleteOutfit}/>
                  <PosePanel onPoseSelect={onPoseSelect} isLoading={isLoading} />
                </>
              ) : (
                <div className="flex-grow flex flex-col">
                   <div className="border-b border-gray-200">
                        <nav className="-mb-px flex space-x-6" aria-label="Tabs">
                            <button onClick={() => setActiveTab('wardrobe')} className={`${activeTab === 'wardrobe' ? 'border-gray-800 text-gray-900' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-3 px-1 border-b-2 font-semibold text-sm`}>Produtos</button>
                            <button onClick={() => setActiveTab('favorites')} className={`${activeTab === 'favorites' ? 'border-gray-800 text-gray-900' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-3 px-1 border-b-2 font-semibold text-sm`}>Favoritos</button>
                            <button onClick={() => setActiveTab('pose')} className={`${activeTab === 'pose' ? 'border-gray-800 text-gray-900' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-3 px-1 border-b-2 font-semibold text-sm`}>Pose</button>
                        </nav>
                    </div>
                    <div className="flex-grow pt-4">
                        {activeTab === 'wardrobe' &&  <WardrobePanel onApplySelection={onApplySelection} wornGarmentIds={allWornGarmentIds} isLoading={isLoading} wardrobe={wardrobe} onUpload={onUpload}/>}
                        {activeTab === 'favorites' && <FavoritesPanel savedOutfits={savedOutfits} onLoadOutfit={onLoadOutfit} onDeleteOutfit={onDeleteOutfit}/>}
                        {activeTab === 'pose' && <PosePanel onPoseSelect={onPoseSelect} isLoading={isLoading} />}
                    </div>
                </div>
              )}
            </div>
        </div>
    );
};


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
    const [isMobilePanelOpen, setIsMobilePanelOpen] = useState(false);

    const isDesktop = useMediaQuery('(min-width: 1024px)');
    const [activeTab, setActiveTab] = useState('wardrobe');
    
    useEffect(() => {
        // Close mobile panel if screen resizes to desktop
        if(isDesktop) {
            setIsMobilePanelOpen(false);
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
            // Create a collection of all garments worn in history, plus any new ones
            const allGarmentsInHistory = outfitHistory.slice(1).flatMap(l => l.garments);
            const allGarmentsToWear = [...allGarmentsInHistory, ...newGarments];

            for (const garment of allGarmentsToWear) {
                const file = await urlToFile(garment.url, `${garment.id}.png`);
                garmentFiles.push(file);
            }
            
            const newImageUrl = await dressModel(baseModelFile, garmentFiles, pose, backgroundFile, backgroundPrompt, refinementPrompt);
            
            const lastLayer = outfitHistory[outfitHistory.length - 1];
            
            // If refining, update the last layer. Otherwise, add a new layer.
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
        if (lastLayer.poseImages[poseInstruction]) return; // Already generated
        await generateOutfit([], poseInstruction);
    }, [outfitHistory, generateOutfit]);

    const handleApplySelection = useCallback(async (garmentFiles: File[], garmentInfos: WardrobeItem[]) => {
        setLoadingMessage('Vestindo os novos itens...');
        setIsMobilePanelOpen(false);
        await generateOutfit(garmentInfos, currentPose);
    }, [currentPose, generateOutfit]);

    const handleUploadToWardrobe = (garmentFile: File, garmentInfo: WardrobeItem) => {
        setWardrobe(prev => [garmentInfo, ...prev]);
        handleApplySelection([garmentFile], [garmentInfo]);
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
        // Find the most recent pose from the loaded outfit, or default.
        const lastLayer = outfit.layers[outfit.layers.length-1];
        const lastPose = Object.keys(lastLayer.poseImages).find(p => p !== 'default') || 'de pé, virado para a frente, expressão neutra';
        setCurrentPose(lastPose);
        setIsCurrentOutfitSaved(true);
        setIsMobilePanelOpen(false);
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
        // This will trigger the StartScreen to render
        setModelUrl(null); 
        
        // Reset all related states for a clean session
        setOutfitHistory([]);
        setCurrentPose('de pé, virado para a frente, expressão neutra');
        setWardrobe(defaultWardrobe);
        setSavedOutfits([]);
        setIsCurrentOutfitSaved(false);
        
        // Close any open modals or panels
        setIsZoomModalOpen(false);
        setIsBackgroundModalOpen(false);
        setIsRefineModalOpen(false);
        setIsMobilePanelOpen(false);
        setActiveTab('wardrobe');
    };

    if (!modelUrl) {
        return <StartScreen onModelFinalized={handleModelFinalized} />;
    }

    const panelContent = (
      <SidePanelContent
        outfitHistory={outfitHistory}
        onRemoveLastGarment={handleRemoveLastGarment}
        onSaveOutfit={handleSaveOutfit}
        isCurrentOutfitSaved={isCurrentOutfitSaved}
        isDesktop={isDesktop}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onApplySelection={handleApplySelection}
        allWornGarmentIds={allWornGarmentIds}
        isLoading={isLoading}
        wardrobe={wardrobe}
        onUpload={handleUploadToWardrobe}
        savedOutfits={savedOutfits}
        onLoadOutfit={handleLoadOutfit}
        onDeleteOutfit={handleDeleteOutfit}
        onPoseSelect={handlePoseSelect}
      />
    );

    return (
        <div className="min-h-screen bg-gray-50 text-gray-900 flex flex-col">
            <Header isDesktop={isDesktop} onMenuClick={() => setIsMobilePanelOpen(true)} onGoHome={handleGoHome} />
            <main className="flex-grow w-full max-w-[1600px] mx-auto flex flex-col lg:flex-row">
                <div className="relative flex-grow flex items-center justify-center lg:order-2">
                    <Canvas
                        imageUrl={currentOutfitImage}
                        onZoom={() => setIsZoomModalOpen(true)}
                        onRefine={() => setIsRefineModalOpen(true)}
                        onChangeBackground={() => setIsBackgroundModalOpen(true)}
                    />
                    {isLoading && <LoadingOverlay message={loadingMessage} />}
                </div>
                {isDesktop && (
                    <aside className="w-full lg:w-[380px] lg:order-1 bg-white/80 backdrop-blur-md border-r border-gray-200/60 p-6 flex-shrink-0 flex flex-col">
                        {panelContent}
                    </aside>
                )}
            </main>
            <Footer isOnDressingScreen />
            
            <AnimatePresence>
              {!isDesktop && isMobilePanelOpen && (
                 <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsMobilePanelOpen(false)}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
                    />
                    <motion.div
                        initial={{ x: "-100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "-100%" }}
                        transition={{ duration: 0.3, ease: 'easeOut' }}
                        className="fixed top-0 left-0 bottom-0 w-[320px] bg-white z-50 shadow-2xl p-6 flex flex-col"
                    >
                      <button 
                        onClick={() => setIsMobilePanelOpen(false)}
                        className="absolute top-4 right-4 p-2 text-gray-500 hover:bg-gray-100 rounded-full"
                        aria-label="Fechar menu"
                      >
                          <XIcon className="w-6 h-6"/>
                      </button>
                      <div className="overflow-y-auto h-full mt-8">
                         {panelContent}
                      </div>
                    </motion.div>
                 </>
              )}
            </AnimatePresence>

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