/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { XIcon } from './icons';
import Spinner from './Spinner';

interface RefineModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRefine: (prompt: string) => void;
  isLoading: boolean;
}

const REFINE_SUGGESTIONS = [
  "faça o jeans parecer mais desgastado",
  "mude a cor da camisa para vermelho",
  "adicione um cinto de couro",
  "torne a iluminação mais dramática",
];

const RefineModal: React.FC<RefineModalProps> = ({ isOpen, onClose, onRefine, isLoading }) => {
  const [prompt, setPrompt] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (prompt.trim() && !isLoading) {
      onRefine(prompt.trim());
    }
  };
  
  return (
    <AnimatePresence>
        {isOpen && (
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
                className="relative bg-card rounded-2xl w-full max-w-lg flex flex-col shadow-xl border"
            >
                <div className="flex items-center justify-between p-4 border-b">
                <h2 className="text-2xl font-serif tracking-wider text-foreground">Editar Foto</h2>
                <button onClick={onClose} disabled={isLoading} className="p-1 rounded-full text-muted-foreground hover:bg-accent hover:text-foreground disabled:opacity-50">
                    <XIcon className="w-6 h-6" />
                </button>
                </div>
                <div className="p-6">
                    {isLoading ? (
                        <div className="flex flex-col items-center justify-center h-48">
                            <Spinner />
                            <p className="mt-4 text-muted-foreground font-serif">Editando sua imagem...</p>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label htmlFor="refine-prompt" className="block text-sm font-medium text-foreground mb-1">
                                Descreva a mudança que você quer fazer:
                                </label>
                                <textarea
                                    id="refine-prompt"
                                    value={prompt}
                                    onChange={(e) => setPrompt(e.target.value)}
                                    placeholder="Ex: Remova a pulseira, adicione um bolso na camisa..."
                                    rows={3}
                                    className="w-full px-3 py-2 border rounded-md bg-background focus:ring-2 focus:ring-ring focus:border-ring transition-shadow"
                                />
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {REFINE_SUGGESTIONS.map(suggestion => (
                                    <button
                                        key={suggestion}
                                        type="button"
                                        onClick={() => setPrompt(suggestion)}
                                        className="px-3 py-1 text-xs bg-secondary text-secondary-foreground rounded-full hover:bg-accent transition-colors"
                                    >
                                        {suggestion}
                                    </button>
                                ))}
                            </div>
                            <button type="submit" disabled={!prompt.trim() || isLoading} className="w-full py-3 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-primary/90 disabled:bg-muted disabled:text-muted-foreground transition-colors">
                            Aplicar Edição
                            </button>
                        </form>
                    )}
                </div>
            </motion.div>
            </div>
        )}
    </AnimatePresence>
  );
};

export default RefineModal;
