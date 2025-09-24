'use client';

import { useState } from 'react';
import { Search, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface SearchBarProps {
  featured?: boolean;
  onSearch?: (query: string) => void;
}

export function SearchBar({ featured = false, onSearch }: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const popularSearches = [
    'Toronto condos',
    'Vancouver waterfront',
    'Montreal lofts',
    'Calgary family homes',
    'Ottawa rentals',
  ];

  const handleSearch = () => {
    if (query.trim()) {
      onSearch?.(query);
      setShowSuggestions(false);
    }
  };

  const handleInputChange = (value: string) => {
    setQuery(value);
    if (value.length > 2) {
      const filtered = popularSearches.filter(search =>
        search.toLowerCase().includes(value.toLowerCase())
      );
      setSuggestions(filtered);
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  };

  return (
    <div className="relative">
      <div className={cn(
        'flex items-center gap-2 p-2 rounded-full shadow-lg transition-all duration-300',
        featured 
          ? 'bg-white/95 backdrop-blur-sm max-w-2xl mx-auto' 
          : 'bg-white border border-gray-200 max-w-md'
      )}>
        <div className="relative flex-1 flex items-center">
          <MapPin className="absolute left-3 h-5 w-5 text-gray-400" />
          <Input
            type="text"
            placeholder="Search by city, neighborhood, or property type..."
            value={query}
            onChange={(e) => handleInputChange(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            className={cn(
              'pl-10 pr-4 border-none shadow-none focus-visible:ring-0',
              featured ? 'text-lg h-12' : 'h-10'
            )}
          />
        </div>
        
        <Button 
          onClick={handleSearch}
          size={featured ? 'lg' : 'default'}
          className="rounded-full px-6"
        >
          <Search className="h-4 w-4 mr-2" />
          Search
        </Button>
      </div>

      {/* Suggestions Dropdown */}
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
          {suggestions.map((suggestion, index) => (
            <button
              key={index}
              className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors first:rounded-t-lg last:rounded-b-lg"
              onClick={() => {
                setQuery(suggestion);
                setShowSuggestions(false);
                onSearch?.(suggestion);
              }}
            >
              <div className="flex items-center gap-2">
                <Search className="h-4 w-4 text-gray-400" />
                <span>{suggestion}</span>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}