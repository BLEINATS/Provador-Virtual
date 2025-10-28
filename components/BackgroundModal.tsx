/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { XIcon, UploadCloudIcon } from './icons';
import { BackgroundOption, defaultBackgrounds } from '../backgrounds';
import { urlToFile } from '../lib/utils';
import Spinner from './Spinner';

interface BackgroundModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGenerate: (prompt: string, files?: File[]) => void;
  isLoading: boolean;
}

const BackgroundModal: React.FC<BackgroundModalProps> = ({ isOpen, onClose, onGenerate, isLoading }) => {
  const [customPrompt, setCustomPrompt] = useState('');
  const [customFile, setCustomFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const handlePresetClick = async (option: BackgroundOption) => {
    if (isLoading) return;
    setError(null);
    if (option.prompt) {
      onGenerate(option.prompt);
    } else if (option.imageUrl) {
      try {
        const file = await urlToFile(option.imageUrl, `${option.id}.jpg`);
        onGenerate(`Usar a imagem fornecida como fundo`, [file]);
      } catch (err) {
        console.error("Falha ao converter URL para arquivo", err);
        setError("Não foi possível carregar a imagem de fundo predefinida. Tente novamente.");
      }
    }
  };

  const handleCustomPromptSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading || !customPrompt.trim()) return;
    setError(null);
    onGenerate(customPrompt.trim());
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setError("Por favor, selecione um arquivo de imagem.");
        setCustomFile(null);
        return;
      }
      setError(null);
      setCustomFile(file);
    }
  };
  
  const handleCustomFileSubmit = () => {
    if (isLoading || !customFile) return;
    setError(null);
    onGenerate("Usar a imagem enviada como fundo", [customFile]);
  }

  if (!isOpen) return null;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      aria-modal="true"
      role="dialog"
    >
      <motion.div
        initial={{ scale: 0.95, y: 20, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={{ scale: 0.95, y: 20, opacity: 0 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        onClick={(e) => e.stopPropagation()}
        className="relative bg-card rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-xl border"
      >
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-2xl font-serif tracking-wider text-foreground">Mudar Fundo</h2>
          <button onClick={onClose} disabled={isLoading} className="p-1 rounded-full text-muted-foreground hover:bg-accent hover:text-foreground disabled:opacity-50">
            <XIcon className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center h-64">
                <Spinner />
                <p className="mt-4 text-muted-foreground font-serif">Gerando novo fundo...</p>
            </div>
          ) : (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-3">Opções Predefinidas</h3>
                <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
                  {defaultBackgrounds.map(option => (
                    <button key={option.id} onClick={() => handlePresetClick(option)} className="flex flex-col items-center gap-2 group">
                      <img src={option.thumbnailUrl} alt={option.name} className="w-full aspect-square object-cover rounded-lg border-2 border-transparent group-hover:border-primary transition-all"/>
                      <span className="text-xs text-center text-muted-foreground font-medium">{option.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold text-foreground mb-3">Personalizar com Texto</h3>
                <form onSubmit={handleCustomPromptSubmit} className="flex gap-2">
                  <input
                    type="text"
                    value={customPrompt}
                    onChange={(e) => setCustomPrompt(e.target.value)}
                    placeholder="Ex: uma rua de Paris, uma praia ao pôr do sol..."
                    className="w-full px-3 py-2 border rounded-md bg-background focus:ring-2 focus:ring-ring focus:border-ring transition-shadow"
                  />
                  <button type="submit" disabled={!customPrompt.trim()} className="px-4 py-2 bg-primary text-primary-foreground font-semibold rounded-md hover:bg-primary/90 disabled:bg-muted disabled:text-muted-foreground transition-colors">
                    Gerar
                  </button>
                </form>
              </div>

              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold text-foreground mb-3">Personalizar com Imagem</h3>
                <div className="flex items-center gap-4">
                  <label htmlFor="bg-upload" className="flex-grow flex items-center gap-3 px-4 py-3 border-2 border-dashed rounded-lg text-muted-foreground hover:border-foreground/50 hover:text-foreground cursor-pointer transition-colors">
                    <UploadCloudIcon className="w-6 h-6 flex-shrink-0" />
                    <div className="text-sm">
                      <p className="font-semibold">{customFile ? 'Arquivo selecionado:' : 'Clique para enviar'}</p>
                      <p className="truncate text-xs">{customFile ? customFile.name : 'PNG, JPG, etc.'}</p>
                    </div>
                  </label>
                  <input id="bg-upload" type="file" className="hidden" accept="image/*" onChange={handleFileChange}/>
                   <button onClick={handleCustomFileSubmit} disabled={!customFile} className="px-4 py-2 bg-primary text-primary-foreground font-semibold rounded-md hover:bg-primary/90 disabled:bg-muted disabled:text-muted-foreground transition-colors">
                    Gerar
                  </button>
                </div>
              </div>

              {error && <p className="text-destructive text-sm mt-4 text-center">{error}</p>}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default BackgroundModal;
