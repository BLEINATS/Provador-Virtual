/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React, { useState } from 'react';
import { ArrowRightIcon } from './icons';

interface PosePanelProps {
  onPoseSelect: (poseInstruction: string) => void;
  isLoading: boolean;
}

const POSE_SUGGESTIONS = [
    "Pose de catálogo, vista frontal",
    "Mostrando detalhes da roupa, close-up",
    "Pose casual, mãos nos bolsos",
    "Andando, captura de movimento",
];

const PosePanel: React.FC<PosePanelProps> = ({ onPoseSelect, isLoading }) => {
  const [inputValue, setInputValue] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim() && !isLoading) {
      onPoseSelect(inputValue.trim());
      setInputValue('');
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    if (!isLoading) {
        onPoseSelect(suggestion);
    }
  };

  return (
    <div className="mt-auto pt-6 border-t">
      <h2 className="text-lg font-serif tracking-wider text-foreground mb-3">Personalizar Pose</h2>
      <form onSubmit={handleSubmit} className="flex gap-2 mb-3">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Descreva a pose..."
          disabled={isLoading}
          className="w-full px-3 py-2 border rounded-md bg-background focus:ring-2 focus:ring-ring focus:border-ring transition-shadow disabled:bg-muted"
        />
        <button type="submit" disabled={!inputValue.trim() || isLoading} className="p-2.5 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 disabled:bg-muted disabled:text-muted-foreground transition-colors">
          <ArrowRightIcon className="w-5 h-5" />
        </button>
      </form>
      <div className="flex flex-wrap gap-2">
        {POSE_SUGGESTIONS.map((pose) => (
          <button
            key={pose}
            onClick={() => handleSuggestionClick(pose)}
            disabled={isLoading}
            className="px-3 py-1 text-xs bg-secondary text-secondary-foreground rounded-full hover:bg-accent transition-colors disabled:opacity-50"
          >
            {pose}
          </button>
        ))}
      </div>
    </div>
  );
};

export default PosePanel;
