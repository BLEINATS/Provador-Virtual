/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React, { useState, useMemo, useCallback } from 'react';
import { GoogleGenAI } from "@google/genai";
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
import ChatPanel from './components/ChatPanel';
import SubscriptionModal from './components/SubscriptionModal';
import EcommerceModal from './components/EcommerceModal';
import ShareModal from './components/ShareModal';
import AnimateModal from './components/AnimateModal';
import UrlImportModal from './components/UrlImportModal';
import { dressModel } from './services/geminiService';
import { urlToFile, getFriendlyErrorMessage, blobToBase64 } from './lib/utils';
import type { OutfitLayer, SavedOutfit, WardrobeItem, DigitalModel } from './types';
import { defaultWardrobe } from './wardrobe';
import { useMediaQuery } from './hooks/useMediaQuery';
import { ChevronUpIcon, HeartIcon, MessageSquareIcon, ShirtIcon, Wand2Icon } from './components/icons';
import { translations } from './lib/translations';

type Language = 'pt-br' | 'en';

interface PanelProps {
  outfitHistory: OutfitLayer[];
  onRemoveLastGarment: () => void;
  onSaveOutfit: () => void;
  isCurrentOutfitSaved: boolean;
  onApplySelection: (garmentFiles: File[], garmentInfos: WardrobeItem[]) => void;
  wornGarmentIds: string[];
  isLoading: boolean;
  wardrobe: WardrobeItem[];
  onUpload: (garmentFile: File, garmentInfo: WardrobeItem) => void;
  savedOutfits: SavedOutfit[];
  onLoadOutfit: (outfit: SavedOutfit) => void;
  onDeleteOutfit: (id: string) => void;
  onPoseSelect: (poseInstruction: string) => void;
  onOpenEcommerceModal: () => void;
  onOpenUrlImportModal: () => void;
  language: Language;
}

interface ModelSession {
    outfitHistory: OutfitLayer[];
    currentPose: string;
    savedOutfits: SavedOutfit[];
    isCurrentOutfitSaved: boolean;
}

const DesktopPanelContent: React.FC<PanelProps> = ({
  outfitHistory,
  onRemoveLastGarment,
  onSaveOutfit,
  isCurrentOutfitSaved,
  onApplySelection,
  wornGarmentIds,
  isLoading,
  wardrobe,
  onUpload,
  savedOutfits,
  onLoadOutfit,
  onDeleteOutfit,
  onPoseSelect,
  onOpenEcommerceModal,
  onOpenUrlImportModal,
  language
}) => {
    return (
      <div className="flex flex-col h-full">
            <OutfitStack
                outfitHistory={outfitHistory}
                onRemoveLastGarment={onRemoveLastGarment}
                onSaveOutfit={onSaveOutfit}
                isCurrentOutfitSaved={isCurrentOutfitSaved}
                language={language}
            />
            <div className="flex-grow flex flex-col mt-6">
              <WardrobePanel
                onApplySelection={onApplySelection}
                wornGarmentIds={wornGarmentIds}
                isLoading={isLoading}
                wardrobe={wardrobe}
                onUpload={onUpload}
                onOpenEcommerceModal={onOpenEcommerceModal}
                onOpenUrlImportModal={onOpenUrlImportModal}
                language={language}
              />
              <FavoritesPanel savedOutfits={savedOutfits} onLoadOutfit={onLoadOutfit} onDeleteOutfit={onDeleteOutfit} language={language}/>
              <PosePanel onPoseSelect={onPoseSelect} isLoading={isLoading} language={language}/>
            </div>
        </div>
    );
};


const App: React.FC = () => {
    // Language state
    const [language, setLanguage] = useState<Language>('pt-br');
    const t = translations[language];

    // Model management state
    const [models, setModels] = useState<DigitalModel[]>([]);
    const [activeModelId, setActiveModelId] = useState<string | null>(null);
    const [modelSessions, setModelSessions] = useState<Record<string, ModelSession>>({});
    
    // Active session state
    const [outfitHistory, setOutfitHistory] = useState<OutfitLayer[]>([]);
    const [currentPose, setCurrentPose] = useState<string>('de pé, virado para a frente, expressão neutra');
    const [savedOutfits, setSavedOutfits] = useState<SavedOutfit[]>([]);
    const [isCurrentOutfitSaved, setIsCurrentOutfitSaved] = useState(false);
    
    // Global state
    const [isLoading, setIsLoading] = useState(false);
    const [loadingMessage, setLoadingMessage] = useState('');
    const [wardrobe, setWardrobe] = useState<WardrobeItem[]>(defaultWardrobe);
    const [generatedVideoUrl, setGeneratedVideoUrl] = useState<string | null>(null);
    
    // Modal states
    const [isZoomModalOpen, setIsZoomModalOpen] = useState(false);
    const [isBackgroundModalOpen, setIsBackgroundModalOpen] = useState(false);
    const [isRefineModalOpen, setIsRefineModalOpen] = useState(false);
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [isSubscriptionModalOpen, setIsSubscriptionModalOpen] = useState(false);
    const [isEcommerceModalOpen, setIsEcommerceModalOpen] = useState(false);
    const [isShareModalOpen, setIsShareModalOpen] = useState(false);
    const [isUrlImportModalOpen, setIsUrlImportModalOpen] = useState(false);
    const [isAnimateModalOpen, setIsAnimateModalOpen] = useState(false);

    const isDesktop = useMediaQuery('(min-width: 1024px)');
    const [activeTab, setActiveTab] = useState('wardrobe');
    const [isMobilePanelOpen, setIsMobilePanelOpen] = useState(true);
    
    const activeModel = useMemo(() => {
        return models.find(m => m.id === activeModelId) || null;
    }, [models, activeModelId]);

    const currentOutfitImage = useMemo(() => {
        if (outfitHistory.length === 0) return null;
        const lastLayer = outfitHistory[outfitHistory.length - 1];
        return lastLayer.poseImages[currentPose] || lastLayer.poseImages['default'] || null;
    }, [outfitHistory, currentPose]);
    
    const allWornGarmentIds = useMemo(() => {
      return outfitHistory.flatMap(layer => layer.garments.map(g => g.id));
    }, [outfitHistory]);

    const handleModelFinalized = (details: { name: string; originalUrl: string; generatedUrl: string; }) => {
        const newModel: DigitalModel = {
            id: `model-${Date.now()}`,
            name: details.name,
            originalImageUrl: details.originalUrl,
            generatedModelUrl: details.generatedUrl,
        };

        const newModelId = newModel.id;
        setModels(prev => [...prev, newModel]);

        const initialHistory: OutfitLayer[] = [{ garments: [], poseImages: { 'default': details.generatedUrl } }];
        const initialPose = 'de pé, virado para a frente, expressão neutra';
        const initialSavedOutfits: SavedOutfit[] = [];
        
        setModelSessions(prev => ({
            ...prev,
            [newModelId]: {
                outfitHistory: initialHistory,
                currentPose: initialPose,
                savedOutfits: initialSavedOutfits,
                isCurrentOutfitSaved: false,
            }
        }));

        setOutfitHistory(initialHistory);
        setCurrentPose(initialPose);
        setSavedOutfits(initialSavedOutfits);
        setIsCurrentOutfitSaved(false);
        setActiveModelId(newModelId);
    };
    
    const handleSelectModel = (modelId: string) => {
        const session = modelSessions[modelId];
        if (session) {
            setOutfitHistory(session.outfitHistory);
            setCurrentPose(session.currentPose);
            setSavedOutfits(session.savedOutfits);
            setIsCurrentOutfitSaved(session.isCurrentOutfitSaved);
        }
        setActiveModelId(modelId);
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
            alert(getFriendlyErrorMessage(err, t.errorOutfitGeneration, language));
        } finally {
            setIsLoading(false);
            setLoadingMessage('');
            setIsRefineModalOpen(false);
            setIsBackgroundModalOpen(false);
        }
    }, [outfitHistory, language, t]);

    const handlePoseSelect = useCallback(async (poseInstruction: string) => {
        setLoadingMessage('Changing model pose...');
        setCurrentPose(poseInstruction);
        const lastLayer = outfitHistory[outfitHistory.length - 1];
        if (lastLayer.poseImages[poseInstruction]) return; // Already generated
        await generateOutfit([], poseInstruction);
    }, [outfitHistory, generateOutfit]);

    const handleApplySelection = useCallback(async (garmentFiles: File[], garmentInfos: WardrobeItem[]) => {
        setLoadingMessage('Dressing new items...');
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
        const lastLayer = outfit.layers[outfit.layers.length-1];
        const lastPose = Object.keys(lastLayer.poseImages).find(p => p !== 'default') || 'de pé, virado para a frente, expressão neutra';
        setCurrentPose(lastPose);
        setIsCurrentOutfitSaved(true);
    };
    
    const handleDeleteOutfit = (id: string) => {
        setSavedOutfits(prev => prev.filter(o => o.id !== id));
    };
    
    const handleBackgroundGenerate = (prompt: string, files?: File[]) => {
        setLoadingMessage('Changing background...');
        generateOutfit([], currentPose, files?.[0], prompt);
    };
    
    const handleRefine = (prompt: string) => {
        setLoadingMessage('Refining image...');
        generateOutfit([], currentPose, undefined, undefined, prompt);
    };

    const handleAnimateOutfit = async (prompt: string) => {
        if (!currentOutfitImage) return;
        setIsLoading(true);
        setGeneratedVideoUrl(null);
        
        const loadingMessages = [
            'Preparing the scene...',
            'Animating the model...',
            'Rendering the final video...',
            'Applying final touches...',
            'This might take a few minutes...'
        ];
        let messageIndex = 0;
        setLoadingMessage(loadingMessages[messageIndex]);
        const messageInterval = setInterval(() => {
            messageIndex = (messageIndex + 1) % loadingMessages.length;
            setLoadingMessage(loadingMessages[messageIndex]);
        }, 5000);

        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            const imageFile = await urlToFile(currentOutfitImage, 'start-image.png');
            const base64Image = await blobToBase64(imageFile);

            let operation = await ai.models.generateVideos({
                model: 'veo-3.1-fast-generate-preview',
                prompt,
                image: {
                    imageBytes: base64Image,
                    mimeType: imageFile.type,
                },
                config: {
                    numberOfVideos: 1,
                    resolution: '720p',
                    aspectRatio: '9:16'
                }
            });

            while (!operation.done) {
                await new Promise(resolve => setTimeout(resolve, 10000));
                operation = await ai.operations.getVideosOperation({ operation: operation });
            }

            const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
            if (downloadLink) {
                const videoResponse = await fetch(`${downloadLink}&key=${process.env.API_KEY}`);
                const videoBlob = await videoResponse.blob();
                const videoUrl = URL.createObjectURL(videoBlob);
                setGeneratedVideoUrl(videoUrl);
            } else {
                throw new Error("Video download link not found in response.");
            }

        } catch (err) {
            alert(getFriendlyErrorMessage(err, t.errorVideoGeneration, language));
            setIsAnimateModalOpen(false);
        } finally {
            clearInterval(messageInterval);
            setIsLoading(false);
            setLoadingMessage('');
        }
    };

    const handleImportFromUrl = async (url: string, name: string) => {
        if (isLoading) return;
        setIsLoading(true);
        setLoadingMessage('Importing product from URL...');
        try {
            const filename = `${name.replace(/\s+/g, '-')}-${Date.now()}.png`;
            const file = await urlToFile(url, filename);
            const newGarmentInfo: WardrobeItem = {
                id: `url-${Date.now()}`,
                name: name,
                url: URL.createObjectURL(file), 
            };
            handleUploadToWardrobe(file, newGarmentInfo);
            setIsUrlImportModalOpen(false);
        } catch (err) {
            alert(getFriendlyErrorMessage(err, t.errorUrlImport, language));
            setIsLoading(false);
            setLoadingMessage('');
        }
    };

    const handleGoHome = () => {
        if (activeModelId) {
             setModelSessions(prev => ({
                ...prev,
                [activeModelId]: { outfitHistory, currentPose, savedOutfits, isCurrentOutfitSaved }
            }));
            setOutfitHistory([]);
            setCurrentPose('de pé, virado para a frente, expressão neutra');
            setSavedOutfits([]);
            setIsCurrentOutfitSaved(false);
        }
        setActiveModelId(null);
        setWardrobe(defaultWardrobe);
        setIsZoomModalOpen(false);
        setIsBackgroundModalOpen(false);
        setIsRefineModalOpen(false);
        setIsSubscriptionModalOpen(false);
        setIsEcommerceModalOpen(false);
        setIsShareModalOpen(false);
        setIsUrlImportModalOpen(false);
        setIsAnimateModalOpen(false);
        setActiveTab('wardrobe');
    };

    const handleMobileTabClick = (tabId: string) => {
        if (activeTab === tabId) {
            setIsMobilePanelOpen(prev => !prev);
        } else {
            setActiveTab(tabId);
            setIsMobilePanelOpen(true);
        }
    };

    if (!activeModelId) {
        return <StartScreen onModelFinalized={handleModelFinalized} models={models} onSelectModel={handleSelectModel} language={language} />;
    }
    
    const panelProps: PanelProps = {
        outfitHistory,
        onRemoveLastGarment: handleRemoveLastGarment,
        onSaveOutfit: handleSaveOutfit,
        isCurrentOutfitSaved,
        onApplySelection: handleApplySelection,
        wornGarmentIds: allWornGarmentIds,
        isLoading,
        wardrobe,
        onUpload: handleUploadToWardrobe,
        savedOutfits,
        onLoadOutfit: handleLoadOutfit,
        onDeleteOutfit: handleDeleteOutfit,
        onPoseSelect: handlePoseSelect,
        onOpenEcommerceModal: () => setIsEcommerceModalOpen(true),
        onOpenUrlImportModal: () => setIsUrlImportModalOpen(true),
        language,
    };

    const mobileTabContent = {
        wardrobe: (
            <div className="flex flex-col h-full">
                <OutfitStack {...panelProps} />
                <WardrobePanel {...panelProps} />
            </div>
        ),
        favorites: <FavoritesPanel {...panelProps} />,
        pose: <PosePanel {...panelProps} />,
        chat: <ChatPanel isMobile language={language}/>,
    };

    return (
        <div className="min-h-screen bg-gray-50 text-gray-900 flex flex-col">
            <Header onGoHome={handleGoHome} onOpenSubscription={() => setIsSubscriptionModalOpen(true)} activeModelName={activeModel?.name} language={language} onLanguageChange={setLanguage}/>
            <main className="flex-grow w-full max-w-[1600px] mx-auto flex flex-col lg:flex-row pb-32 lg:pb-0">
                <div className="relative flex-grow flex items-center justify-center lg:order-2">
                    <Canvas
                        imageUrl={currentOutfitImage}
                        onZoom={() => setIsZoomModalOpen(true)}
                        onRefine={() => setIsRefineModalOpen(true)}
                        onChangeBackground={() => setIsBackgroundModalOpen(true)}
                        onShare={() => setIsShareModalOpen(true)}
                        onAnimate={() => {
                            setGeneratedVideoUrl(null);
                            setIsAnimateModalOpen(true)
                        }}
                        language={language}
                    />
                    {isLoading && <LoadingOverlay message={loadingMessage || t.loadingMessageDefault} />}
                </div>
                {isDesktop && (
                    <aside className="w-full lg:w-[380px] lg:order-1 bg-white/80 backdrop-blur-md border-r border-gray-200/60 p-6 flex-shrink-0 flex flex-col">
                        <DesktopPanelContent {...panelProps} />
                    </aside>
                )}
            </main>
            <Footer isOnDressingScreen language={language}/>
            
            {/* Desktop Chat */}
            {isDesktop && (
                <>
                    <AnimatePresence>
                        {isChatOpen && <ChatPanel onClose={() => setIsChatOpen(false)} language={language}/>}
                    </AnimatePresence>
                    {!isChatOpen && (
                        <motion.button
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0, opacity: 0 }}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setIsChatOpen(true)}
                            className="fixed bottom-6 right-6 bg-gray-900 text-white rounded-full p-4 shadow-lg z-30"
                            aria-label={t.aiAssistant}
                        >
                            <MessageSquareIcon className="w-6 h-6" />
                        </motion.button>
                    )}
                </>
            )}

            {/* Mobile Bottom Navigation UI */}
            {!isDesktop && (
                 <div className="fixed bottom-0 left-0 right-0 z-30 flex flex-col">
                    <motion.div 
                        className="bg-white border-t border-gray-200 rounded-t-2xl shadow-[-4px_0_20px_rgba(0,0,0,0.1)] overflow-hidden"
                        initial={false}
                        animate={{ height: isMobilePanelOpen ? '45vh' : '0' }}
                        transition={{ type: "spring", stiffness: 400, damping: 40 }}
                    >
                       <div className="p-4 h-full overflow-y-auto" aria-hidden={!isMobilePanelOpen}>
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={activeTab}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    transition={{ duration: 0.2 }}
                                    className="h-full flex flex-col"
                                >
                                    {mobileTabContent[activeTab as keyof typeof mobileTabContent]}
                                </motion.div>
                            </AnimatePresence>
                       </div>
                    </motion.div>
                    <nav className="bg-gray-100/70 backdrop-blur-md border-t border-gray-200 flex justify-around items-center h-16">
                        {[
                            { id: 'wardrobe', label: t.mobileNavProducts, icon: ShirtIcon },
                            { id: 'favorites', label: t.mobileNavFavorites, icon: HeartIcon },
                            { id: 'pose', label: t.mobileNavPose, icon: Wand2Icon },
                            { id: 'chat', label: t.mobileNavAssistant, icon: MessageSquareIcon },
                        ].map(({id, label, icon: Icon}) => (
                             <button 
                                key={id}
                                onClick={() => handleMobileTabClick(id)} 
                                className={`flex flex-col items-center justify-center gap-1 w-full h-full transition-colors ${activeTab === id ? 'text-gray-900' : 'text-gray-500 hover:text-gray-800'}`}
                             >
                                <Icon className="w-6 h-6"/>
                                <div className="flex items-center gap-0.5">
                                    <span className="text-xs font-semibold">{label}</span>
                                    {activeTab === id && (
                                        <ChevronUpIcon className={`w-3 h-3 text-gray-600 transition-transform duration-300 ${isMobilePanelOpen ? '' : 'rotate-180'}`} />
                                    )}
                                </div>
                            </button>
                        ))}
                    </nav>
                </div>
            )}

            <AnimatePresence>
                {isZoomModalOpen && currentOutfitImage && (
                    <ZoomModal imageUrl={currentOutfitImage} onClose={() => setIsZoomModalOpen(false)} language={language} />
                )}
                {isBackgroundModalOpen && (
                    <BackgroundModal
                        isOpen={isBackgroundModalOpen}
                        onClose={() => setIsBackgroundModalOpen(false)}
                        onGenerate={handleBackgroundGenerate}
                        isLoading={isLoading && loadingMessage.includes('background')}
                        language={language}
                    />
                )}
                 {isRefineModalOpen && (
                    <RefineModal
                        isOpen={isRefineModalOpen}
                        onClose={() => setIsRefineModalOpen(false)}
                        onRefine={handleRefine}
                        isLoading={isLoading && loadingMessage.includes('Refining')}
                        language={language}
                    />
                 )}
                 {isSubscriptionModalOpen && (
                    <SubscriptionModal
                        isOpen={isSubscriptionModalOpen}
                        onClose={() => setIsSubscriptionModalOpen(false)}
                        language={language}
                    />
                 )}
                 {isEcommerceModalOpen && (
                    <EcommerceModal
                        isOpen={isEcommerceModalOpen}
                        onClose={() => setIsEcommerceModalOpen(false)}
                        language={language}
                    />
                 )}
                 {isShareModalOpen && currentOutfitImage && (
                    <ShareModal
                        isOpen={isShareModalOpen}
                        onClose={() => setIsShareModalOpen(false)}
                        imageUrl={currentOutfitImage}
                        language={language}
                    />
                 )}
                 {isUrlImportModalOpen && (
                    <UrlImportModal
                        isOpen={isUrlImportModalOpen}
                        onClose={() => setIsUrlImportModalOpen(false)}
                        onImport={handleImportFromUrl}
                        isImporting={isLoading && loadingMessage.includes('Importing')}
                        language={language}
                    />
                 )}
                 {isAnimateModalOpen && currentOutfitImage && (
                    <AnimateModal
                        isOpen={isAnimateModalOpen}
                        onClose={() => setIsAnimateModalOpen(false)}
                        onGenerate={handleAnimateOutfit}
                        isLoading={isLoading && loadingMessage.includes('...')}
                        loadingMessage={loadingMessage}
                        generatedVideoUrl={generatedVideoUrl}
                        currentOutfitImageUrl={currentOutfitImage}
                        language={language}
                    />
                 )}
            </AnimatePresence>
        </div>
    );
};

export default App;
