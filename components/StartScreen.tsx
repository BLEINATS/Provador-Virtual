/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UploadCloudIcon, PlusCircleIcon } from './icons';
import { Compare } from './ui/compare';
import { generateModelImage } from '../services/geminiService';
import Spinner from './Spinner';
import { getFriendlyErrorMessage } from '../lib/utils';
import NameModelModal from './NameModelModal';
import type { DigitalModel } from '../types';
import { translations } from '../lib/translations';

interface StartScreenProps {
  onModelFinalized: (details: { name: string; originalUrl: string; generatedUrl: string; }) => void;
  models: DigitalModel[];
  onSelectModel: (modelId: string) => void;
  language: 'pt-br' | 'en';
}

const StartScreen: React.FC<StartScreenProps> = ({ onModelFinalized, models, onSelectModel, language }) => {
  const [userImageUrl, setUserImageUrl] = useState<string | null>(null);
  const [generatedModelUrl, setGeneratedModelUrl] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [isCreating, setIsCreating] = useState(models.length === 0);
  const [isNameModalOpen, setIsNameModalOpen] = useState(false);
  const [originalImageUrlForFinalize, setOriginalImageUrlForFinalize] = useState<string | null>(null);
  const [generatedModelUrlForFinalize, setGeneratedModelUrlForFinalize] = useState<string | null>(null);

  const t = translations[language];

  const handleFileSelect = useCallback(async (file: File) => {
    if (!file.type.startsWith('image/')) {
        setError(t.errorFileGeneric);
        return;
    }

    const reader = new FileReader();
    reader.onload = async (e) => {
        const dataUrl = e.target?.result as string;
        setUserImageUrl(dataUrl);
        setOriginalImageUrlForFinalize(dataUrl);
        setIsGenerating(true);
        setGeneratedModelUrl(null);
        setError(null);
        try {
            const result = await generateModelImage(file);
            setGeneratedModelUrl(result);
        } catch (err) {
            setError(getFriendlyErrorMessage(err, t.errorModelCreation, language));
            setUserImageUrl(null);
            setOriginalImageUrlForFinalize(null);
        } finally {
            setIsGenerating(false);
        }
    };
    reader.readAsDataURL(file);
  }, [language, t]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelect(e.target.files[0]);
    }
  };

  const resetCreation = () => {
    setUserImageUrl(null);
    setGeneratedModelUrl(null);
    setIsGenerating(false);
    setError(null);
    setOriginalImageUrlForFinalize(null);
    setGeneratedModelUrlForFinalize(null);
    setIsCreating(models.length === 0);
  };

  const handleFinalizeClick = () => {
    if (generatedModelUrl) {
      setGeneratedModelUrlForFinalize(generatedModelUrl);
      setIsNameModalOpen(true);
    }
  };

  const handleNameSubmit = (name: string) => {
    if (originalImageUrlForFinalize && generatedModelUrlForFinalize) {
      onModelFinalized({ name, originalUrl: originalImageUrlForFinalize, generatedUrl: generatedModelUrlForFinalize });
      setIsNameModalOpen(false);
      resetCreation();
    }
  };

  const screenVariants = {
    initial: { opacity: 0, x: -20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 20 },
  };

  const CreatorView = (
    <AnimatePresence mode="wait">
      {!userImageUrl ? (
        <motion.div
          key="uploader"
          className="w-full max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-12"
          variants={screenVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={{ duration: 0.4, ease: "easeInOut" }}
        >
          <div className="lg:w-1/2 flex flex-col items-center lg:items-start text-center lg:text-left">
            <div className="max-w-lg">
              {models.length > 0 && (
                <button onClick={() => setIsCreating(false)} className="text-sm font-semibold text-gray-600 hover:text-gray-900 mb-4">{t.backToLibraryLink}</button>
              )}
              <h1 className="text-5xl md:text-6xl font-serif font-bold text-gray-900 leading-tight">
                {t.beYourOwnModel}
              </h1>
              <p className="mt-4 text-lg text-gray-600">
                {t.startScreenSubtitle}
              </p>
              <hr className="my-8 border-gray-200" />
              <div className="flex flex-col items-center lg:items-start w-full gap-3">
                <label htmlFor="image-upload-start" className="w-full relative flex items-center justify-center px-8 py-3 text-base font-semibold text-white bg-gray-900 rounded-md cursor-pointer group hover:bg-gray-700 transition-colors">
                  <UploadCloudIcon className="w-5 h-5 mr-3" />
                  {t.createMyModel}
                </label>
                <input id="image-upload-start" type="file" className="hidden" accept="image/png, image/jpeg, image/webp, image/avif, image/heic, image/heif" onChange={handleFileChange} />
                <p className="text-gray-500 text-sm">{t.startScreenInstructions}</p>
                <p className="text-gray-500 text-xs mt-1">{t.startScreenDisclaimer}</p>
                {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
              </div>
            </div>
          </div>
          <div className="w-full lg:w-1/2 flex flex-col items-center justify-center">
            <Compare
              firstImage="https://storage.googleapis.com/builder-next-prod.appspot.com/vto_demo_assets/before_1.jpeg"
              secondImage="https://storage.googleapis.com/builder-next-prod.appspot.com/vto_demo_assets/after_1.jpeg"
              slideMode="drag"
              className="w-full max-w-sm aspect-[2/3] rounded-2xl bg-gray-200"
            />
          </div>
        </motion.div>
      ) : (
        <motion.div
          key="compare"
          className="w-full max-w-6xl mx-auto h-full flex flex-col md:flex-row items-center justify-center gap-8 md:gap-12"
          variants={screenVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={{ duration: 0.4, ease: "easeInOut" }}
        >
          <div className="md:w-1/2 flex-shrink-0 flex flex-col items-center md:items-start">
            <div className="text-center md:text-left">
              <h1 className="text-4xl md:text-5xl font-serif font-bold text-gray-900 leading-tight">
                {t.yourDigitalModel}
              </h1>
              <p className="mt-2 text-md text-gray-600">
                {t.dragToSeeTransform}
              </p>
            </div>
            
            {isGenerating && (
              <div className="flex items-center gap-3 text-lg text-gray-700 font-serif mt-6">
                <Spinner />
                <span>{t.generatingYourModel}</span>
              </div>
            )}

            {error && 
              <div className="text-center md:text-left text-red-600 max-w-md mt-6">
                <p className="font-semibold">{t.generationFailed}</p>
                <p className="text-sm mb-4">{error}</p>
                <button onClick={resetCreation} className="text-sm font-semibold text-gray-700 hover:underline">{t.tryAgain}</button>
              </div>
            }
            
            <AnimatePresence>
              {generatedModelUrl && !isGenerating && !error && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.5 }}
                  className="flex flex-col sm:flex-row items-center gap-4 mt-8"
                >
                  <button 
                    onClick={resetCreation}
                    className="w-full sm:w-auto px-6 py-3 text-base font-semibold text-gray-700 bg-gray-200 rounded-md cursor-pointer hover:bg-gray-300 transition-colors"
                  >
                    {t.useDifferentPhoto}
                  </button>
                  <button 
                    onClick={handleFinalizeClick}
                    className="w-full sm:w-auto relative inline-flex items-center justify-center px-8 py-3 text-base font-semibold text-white bg-gray-900 rounded-md cursor-pointer group hover:bg-gray-700 transition-colors"
                  >
                    {t.saveAndContinue} &rarr;
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <div className="md:w-1/2 w-full flex items-center justify-center">
            <div 
              className={`relative rounded-[1.25rem] transition-all duration-700 ease-in-out ${isGenerating ? 'border border-gray-300 animate-pulse' : 'border border-transparent'}`}
            >
              <Compare
                firstImage={userImageUrl}
                secondImage={generatedModelUrl ?? userImageUrl}
                slideMode="drag"
                className="w-[280px] h-[420px] sm:w-[320px] sm:h-[480px] lg:w-[400px] lg:h-[600px] rounded-2xl bg-gray-200"
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  const LibraryView = (
     <motion.div 
        key="library"
        variants={screenVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        className="w-full max-w-5xl mx-auto text-center"
      >
        <h1 className="text-5xl md:text-6xl font-serif font-bold text-gray-900 leading-tight">{t.yourModels}</h1>
        <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            {t.selectOrCreateModel}
        </p>
        <div className="mt-12 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {models.map(model => (
                <motion.button 
                    key={model.id} 
                    onClick={() => onSelectModel(model.id)} 
                    className="group relative aspect-[2/3] rounded-xl overflow-hidden shadow-lg"
                    whileHover={{ scale: 1.05, y: -5 }}
                    transition={{ type: 'spring', stiffness: 300 }}
                >
                    <img src={model.generatedModelUrl} alt={model.name} className="w-full h-full object-cover"/>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-4">
                        <p className="text-white font-bold text-lg">{model.name}</p>
                    </div>
                </motion.button>
            ))}
             <motion.button 
                onClick={() => setIsCreating(true)} 
                className="group aspect-[2/3] rounded-xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center text-gray-500 hover:border-gray-500 hover:text-gray-700 transition-colors"
                whileHover={{ scale: 1.05, y: -5 }}
                transition={{ type: 'spring', stiffness: 300 }}
            >
                <PlusCircleIcon className="w-12 h-12 mb-2" />
                <span className="font-semibold">{t.createNewModel}</span>
            </motion.button>
        </div>
     </motion.div>
  );


  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 md:p-8 bg-gray-50">
      <AnimatePresence mode="wait">
        {isCreating ? CreatorView : LibraryView}
      </AnimatePresence>
      <NameModelModal
        isOpen={isNameModalOpen}
        onClose={() => setIsNameModalOpen(false)}
        onSubmit={handleNameSubmit}
        language={language}
      />
    </div>
  );
};

export default StartScreen;
