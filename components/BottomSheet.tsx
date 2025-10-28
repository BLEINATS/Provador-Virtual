import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { XIcon } from './icons';

interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title: string;
}

const BottomSheet: React.FC<BottomSheetProps> = ({ isOpen, onClose, children, title }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            aria-hidden="true"
          />
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ duration: 0.4, ease: [0.32, 0.72, 0, 1] }}
            className="fixed bottom-0 left-0 right-0 h-[85vh] bg-card z-50 rounded-t-2xl shadow-2xl flex flex-col"
            role="dialog"
            aria-modal="true"
            aria-labelledby="bottom-sheet-title"
          >
            <div className="flex-shrink-0 p-4 border-b flex items-center justify-center relative">
                <div className="w-10 h-1.5 bg-muted rounded-full absolute top-2 left-1/2 -translate-x-1/2" />
                <h2 id="bottom-sheet-title" className="text-lg font-semibold text-foreground pt-2">{title}</h2>
                <button
                    onClick={onClose}
                    className="absolute top-1/2 -translate-y-1/2 right-4 p-2 text-muted-foreground hover:bg-accent rounded-full"
                    aria-label="Fechar"
                >
                    <XIcon className="w-5 h-5" />
                </button>
            </div>
            <div className="overflow-y-auto flex-grow p-4">
              {children}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default BottomSheet;
