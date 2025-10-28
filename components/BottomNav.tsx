import React from 'react';
import { PackageIcon, HeartIcon, SparklesIcon } from './icons';
import { cn } from '../lib/utils';

interface BottomNavProps {
  activeSheet: string | null;
  onSheetChange: (sheet: string) => void;
}

const navItems = [
  { id: 'wardrobe', label: 'Produtos', icon: PackageIcon },
  { id: 'favorites', label: 'Favoritos', icon: HeartIcon },
  { id: 'pose', label: 'Pose', icon: SparklesIcon },
];

const BottomNav: React.FC<BottomNavProps> = ({ activeSheet, onSheetChange }) => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur-lg border-t z-30 h-16">
      <div className="mx-auto flex justify-around max-w-md h-full">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onSheetChange(item.id)}
            className={cn(
              "flex flex-col items-center justify-center gap-1 w-full text-muted-foreground transition-colors duration-200",
              activeSheet === item.id ? "text-primary" : "hover:text-foreground"
            )}
          >
            <item.icon className="w-6 h-6" />
            <span className="text-xs font-medium">{item.label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
};

export default BottomNav;
