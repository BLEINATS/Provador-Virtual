/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React, { useState } from 'react';
import { ArrowRightIcon } from './icons';
import { translations } from '../lib/translations';

type Language = 'pt-br' | 'en';

interface PosePanelProps {
  onPoseSelect: (poseInstruction: string) => void;
  isLoading: boolean;
  language: Language;
}

const PosePanel: React.FC<PosePanelProps> = ({ onPoseSelect, isLoading, language }) => {
  const [inputValue, setInputValue] = useState('');
  const t = translations[language];

  const POSE_SUGGESTIONS = [
    t.poseSuggestion1,
    t.poseSuggestion2,
    t.poseSuggestion3,
    t.poseSuggestion4,
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim() && !isLoading) {
      onPoseSelect(inputValue.trim());
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInputValue(suggestion);
    if (!isLoading) {
        onPoseSelect(suggestion);
    }
  };

  return (
    <div className="mt-auto pt-6 border-t">
      <h2 className="text-xl font-serif tracking-wider text-gray-800 mb-3">{t.customizePose}</h2>
      <form onSubmit={handleSubmit} className="flex gap-2 mb-3">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder={t.describePose}
          disabled={isLoading}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-800 focus:border-gray-800 transition-shadow disabled:bg-gray-100"
        />
        <button type="submit" disabled={!inputValue.trim() || isLoading} className="p-2 bg-gray-900 text-white rounded-md hover:bg-gray-700 disabled:bg-gray-300 transition-colors">
          <ArrowRightIcon className="w-5 h-5" />
        </button>
      </form>
      <div className="flex flex-wrap gap-2">
        {POSE_SUGGESTIONS.map((pose) => (
          <button
            key={pose}
            onClick={() => handleSuggestionClick(pose)}
            disabled={isLoading}
            className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full hover:bg-gray-200 transition-colors disabled:opacity-50"
          >
            {pose}
          </button>
        ))}
      </div>
    </div>
  );
};

export default PosePanel;
