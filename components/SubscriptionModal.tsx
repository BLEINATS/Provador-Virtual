/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { XIcon, CheckIcon } from './icons';
import { translations } from '../lib/translations';

type Language = 'pt-br' | 'en';

interface SubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
}

const PlanFeature: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <li className="flex items-center gap-3">
        <CheckIcon className="w-5 h-5 text-gray-800 flex-shrink-0" />
        <span className="text-gray-600">{children}</span>
    </li>
);

const SubscriptionModal: React.FC<SubscriptionModalProps> = ({ isOpen, onClose, language }) => {
  const t = translations[language];
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

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
        className="relative bg-gray-50 rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-xl"
      >
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-2xl font-serif tracking-wider text-gray-800">{t.ourPlans}</h2>
          <button onClick={onClose} className="p-1 rounded-full text-gray-500 hover:bg-gray-100 hover:text-gray-800">
            <XIcon className="w-6 h-6" />
          </button>
        </div>

        <div className="p-8 overflow-y-auto">
            <div className="text-center mb-8">
                <h3 className="text-4xl font-serif font-bold text-gray-900">{t.chooseYourPlan}</h3>
                <p className="mt-2 text-gray-600 max-w-2xl mx-auto">{t.plansSubtitle}</p>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Plano Iniciante */}
                <div className="border border-gray-200 bg-white rounded-lg p-6 flex flex-col">
                    <h4 className="text-2xl font-serif text-gray-800">{t.starterPlan}</h4>
                    <p className="mt-4 text-4xl font-bold">{t.starterPrice}</p>
                    <p className="text-sm text-gray-500 mt-1">{t.starterDesc}</p>
                    <ul className="space-y-3 mt-6 text-sm flex-grow">
                        <PlanFeature>{t.starterFeature1}</PlanFeature>
                        <PlanFeature>{t.starterFeature2}</PlanFeature>
                        <PlanFeature>{t.starterFeature3}</PlanFeature>
                    </ul>
                    <button onClick={onClose} className="w-full mt-8 py-3 px-4 text-center bg-white text-gray-900 font-semibold rounded-lg border border-gray-300 hover:bg-gray-100 transition-colors">
                        {t.continueFree}
                    </button>
                </div>

                {/* Plano Criador (Mais Popular) */}
                <div className="border-2 border-gray-900 bg-white rounded-lg p-6 flex flex-col relative">
                    <div className="absolute top-0 -translate-y-1/2 left-1/2 -translate-x-1/2">
                        <span className="bg-gray-900 text-white text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full">
                            {t.mostPopular}
                        </span>
                    </div>
                    <h4 className="text-2xl font-serif text-gray-800">{t.creatorPlan}</h4>
                    <p className="mt-4 text-4xl font-bold">{t.creatorPrice}<span className="text-lg font-medium text-gray-500">{t.creatorPriceSuffix}</span></p>
                    <p className="text-sm text-gray-500 mt-1">{t.creatorDesc}</p>
                    <ul className="space-y-3 mt-6 text-sm flex-grow">
                        <PlanFeature>{t.creatorFeature1}</PlanFeature>
                        <PlanFeature>{t.creatorFeature2}</PlanFeature>
                        <PlanFeature>{t.creatorFeature3}</PlanFeature>
                        <PlanFeature>{t.creatorFeature4}</PlanFeature>
                        <PlanFeature>{t.creatorFeature5}</PlanFeature>
                    </ul>
                    <button onClick={onClose} className="w-full mt-8 py-3 px-4 text-center bg-gray-900 text-white font-semibold rounded-lg hover:bg-gray-700 transition-colors">
                        {t.chooseCreatorPlan}
                    </button>
                </div>

                {/* Plano Loja Pro */}
                <div className="border border-gray-200 bg-white rounded-lg p-6 flex flex-col">
                    <h4 className="text-2xl font-serif text-gray-800">{t.proPlan}</h4>
                    <p className="mt-4 text-4xl font-bold">{t.proPrice}<span className="text-lg font-medium text-gray-500">{t.creatorPriceSuffix}</span></p>
                    <p className="text-sm text-gray-500 mt-1">{t.proDesc}</p>
                    <ul className="space-y-3 mt-6 text-sm flex-grow">
                        <PlanFeature>{t.proFeature1}</PlanFeature>
                        <PlanFeature>{t.proFeature2}</PlanFeature>
                        <PlanFeature>{t.proFeature3}</PlanFeature>
                        <PlanFeature>{t.proFeature4}</PlanFeature>
                        <PlanFeature>{t.proFeature5}</PlanFeature>
                    </ul>
                    <button onClick={onClose} className="w-full mt-8 py-3 px-4 text-center bg-white text-gray-900 font-semibold rounded-lg border border-gray-300 hover:bg-gray-100 transition-colors">
                        {t.chooseProPlan}
                    </button>
                </div>
            </div>
        </div>
      </motion.div>
    </div>
  );
};

export default SubscriptionModal;
