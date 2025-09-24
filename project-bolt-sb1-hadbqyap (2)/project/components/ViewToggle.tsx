'use client';

import { LayoutGrid, Map } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ViewToggleProps {
  view: 'grid' | 'map';
  onViewChange: (view: 'grid' | 'map') => void;
}

export function ViewToggle({ view, onViewChange }: ViewToggleProps) {
  return (
    <div className="flex border border-gray-300 rounded-md overflow-hidden">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onViewChange('grid')}
        className={cn(
          'rounded-none border-0',
          view === 'grid' 
            ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-100' 
            : 'hover:bg-gray-50'
        )}
      >
        <LayoutGrid className="h-4 w-4 mr-1" />
        Grid
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onViewChange('map')}
        className={cn(
          'rounded-none border-l border-gray-300',
          view === 'map' 
            ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-100' 
            : 'hover:bg-gray-50'
        )}
      >
        <Map className="h-4 w-4 mr-1" />
        Map
      </Button>
    </div>
  );
}