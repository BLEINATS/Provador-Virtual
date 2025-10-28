/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UploadCloudIcon } from './icons';
import { Compare } from './ui/compare';
import { generateModelImage } from '../services/geminiService';
import Spinner from './Spinner';
import { getFriendlyErrorMessage } from '../lib/utils';
import Footer from './Footer';

interface StartScreenProps {
  onModelFinalized: (modelUrl: string) => void;
}

const StartScreen: React.FC<StartScreenProps> = ({ onModelFinalized }) => {
  const [userImageUrl, setUserImageUrl] = useState<string | null>(null);
  const [generatedModelUrl, setGeneratedModelUrl] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileSelect = useCallback(async (file: File) => {
    if (!file.type.startsWith('image/')) {
        setError('Por favor, selecione um arquivo de imagem.');
        return;
    }

    const reader = new FileReader();
    reader.onload = async (e) => {
        const dataUrl = e.target?.result as string;
        setUserImageUrl(dataUrl);
        setIsGenerating(true);
        setGeneratedModelUrl(null);
        setError(null);
        try {
            const result = await generateModelImage(file);
            setGeneratedModelUrl(result);
        } catch (err) {
            setError(getFriendlyErrorMessage(err, 'Falha ao criar o modelo'));
            setUserImageUrl(null);
        } finally {
            setIsGenerating(false);
        }
    };
    reader.readAsDataURL(file);
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelect(e.target.files[0]);
    }
  };

  const reset = () => {
    setUserImageUrl(null);
    setGeneratedModelUrl(null);
    setIsGenerating(false);
    setError(null);
  };

  const screenVariants = {
    initial: { opacity: 0, x: -20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 20 },
  };

  if (!userImageUrl) {
    return (
        <div className="min-h-screen w-full flex flex-col">
            <main className="flex-grow flex items-center justify-center p-4">
                <motion.div
                    key="uploader"
                    className="w-full max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-16"
                    variants={screenVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    transition={{ duration: 0.4, ease: "easeInOut" }}
                >
                    <div className="lg:w-1/2 flex flex-col items-center lg:items-start text-center lg:text-left">
                        <div className="max-w-lg">
                            <h1 className="text-5xl md:text-6xl font-serif font-bold text-foreground leading-tight">
                                Seja a Modelo da Sua Própria Marca.
                            </h1>
                            <p className="mt-4 text-lg text-muted-foreground">
                                Passe o mouse sobre a imagem para ver o antes e depois. Envie uma foto sua e use as roupas da sua loja para criar looks incríveis.
                            </p>
                            <hr className="my-8 border-border" />
                            <div className="flex flex-col items-center lg:items-start w-full gap-3">
                                <label htmlFor="image-upload-start" className="w-full relative flex items-center justify-center px-8 py-3 text-base font-semibold text-primary-foreground bg-primary rounded-lg cursor-pointer group hover:bg-primary/90 transition-colors">
                                    <UploadCloudIcon className="w-5 h-5 mr-3" />
                                    Criar Minha Modelo
                                </label>
                                <input id="image-upload-start" type="file" className="hidden" accept="image/png, image/jpeg, image/webp, image/avif, image/heic, image/heif" onChange={handleFileChange} />
                                <p className="text-muted-foreground text-sm">Use uma foto nítida e de corpo inteiro para melhores resultados.</p>
                                {error && <p className="text-destructive text-sm mt-2">{error}</p>}
                            </div>
                        </div>
                    </div>
                    <div className="w-full lg:w-1/2 flex flex-col items-center justify-center">
                        <div className="w-full max-w-sm">
                            <Compare
                                firstImage="https://storage.googleapis.com/gemini-95-icons/vto-start-woman-before.png"
                                secondImage="https://storage.googleapis.com/gemini-95-icons/vto-start-woman-after.png"
                                slideMode="hover"
                                className="w-full aspect-[2/3] rounded-2xl shadow-lg"
                            />
                        </div>
                    </div>
                </motion.div>
            </main>
            <Footer />
        </div>
    );
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4">
        <AnimatePresence mode="wait">
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
                <h1 className="text-4xl md:text-5xl font-serif font-bold text-foreground leading-tight">
                    Sua Modelo Digital
                </h1>
                <p className="mt-2 text-md text-muted-foreground">
                    Arraste o controle deslizante para ver a transformação.
                </p>
                </div>
                
                {isGenerating && (
                <div className="flex items-center gap-3 text-lg text-foreground font-serif mt-6">
                    <Spinner />
                    <span>Gerando sua modelo...</span>
                </div>
                )}

                {error && 
                <div className="text-center md:text-left text-destructive max-w-md mt-6">
                    <p className="font-semibold">A Geração Falhou</p>
                    <p className="text-sm mb-4">{error}</p>
                    <button onClick={reset} className="text-sm font-semibold text-foreground hover:underline">Tentar Novamente</button>
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
                        onClick={reset}
                        className="w-full sm:w-auto px-6 py-3 text-base font-semibold text-primary bg-secondary rounded-lg cursor-pointer hover:bg-accent transition-colors"
                    >
                        Usar Outra Foto
                    </button>
                    <button 
                        onClick={() => onModelFinalized(generatedModelUrl)}
                        className="w-full sm:w-auto relative inline-flex items-center justify-center px-8 py-3 text-base font-semibold text-primary-foreground bg-primary rounded-lg cursor-pointer group hover:bg-primary/90 transition-colors"
                    >
                        Começar a Criar Looks &rarr;
                    </button>
                    </motion.div>
                )}
                </AnimatePresence>
            </div>
            <div className="md:w-1/2 w-full flex items-center justify-center">
                <div 
                className={`relative w-full max-w-xs sm:max-w-sm lg:max-w-md aspect-[2/3] rounded-2xl bg-muted shadow-lg transition-all duration-700 ease-in-out ${isGenerating ? 'border border-border animate-pulse' : 'border-transparent'}`}
                >
                <Compare
                    firstImage={userImageUrl}
                    secondImage={generatedModelUrl ?? userImageUrl}
                    slideMode="drag"
                    className="w-full h-full rounded-2xl"
                />
                </div>
            </div>
            </motion.div>
        </AnimatePresence>
        <Footer />
    </div>
  );
};

export default StartScreen;
