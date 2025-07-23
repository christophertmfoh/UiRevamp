import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, X } from 'lucide-react';

// This component injects global styles for the new "studio" aesthetic.
export const GlobalStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Lora:wght@600&family=Inter:wght@400;500;600&display=swap');
    
    body {
      font-family: 'Inter', sans-serif; /* Clean sans-serif for UI */
      background-color: #1E1E1E; /* Dominant color (60%) */
    }

    .font-title {
      font-family: 'Lora', serif; /* Literary serif for titles */
    }
    .dragging {
        opacity: 0.5;
        background: #2a2a2a;
    }
    .drag-over {
      border-top: 2px solid #3B82F6; /* blue-500 */
    }
    .drag-over-top {
        border-top: 2px solid #3B82F6;
    }
    .drag-over-bottom {
        border-bottom: 2px solid #3B82F6;
    }
    .animate-fade-in {
        animation: a-fade-in 0.3s ease-out forwards;
    }
    @keyframes a-fade-in {
        from { opacity: 0; }
        to { opacity: 1; }
    }
  `}</style>
);

interface ToolPlaceholderProps {
    name: string;
    onBack?: () => void;
    backLabel?: string;
}

export const ToolPlaceholder: React.FC<ToolPlaceholderProps> = ({ name, onBack, backLabel }) => (
    <div className="flex-1 flex flex-col p-8 overflow-y-auto">
        {onBack && (
            <header className="mb-6 flex-shrink-0">
                <button onClick={onBack} className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
                    <ArrowLeft size={16} /> {backLabel || 'Back'}
                </button>
            </header>
        )}
        <div className="h-full flex-grow flex items-center justify-center bg-black/20 border-2 border-dashed border-gray-700 rounded-xl">
            <p className="text-gray-500 text-2xl font-title">{name} - Coming Soon</p>
        </div>
    </div>
);

export const MultiSelectTagInput = ({ label, placeholder, tags, setTags, suggestions, maxTags }: { label: string, placeholder: string, tags: string[], setTags: (tags: string[]) => void, suggestions: string[], maxTags?: number }) => {
    const [inputValue, setInputValue] = useState('');
    const [showSuggestions, setShowSuggestions] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const inputId = `tag-input-${label.replace(/\s+/g, '-')}`;
    const suggestionsId = `tag-suggestions-${label.replace(/\s+/g, '-')}`;

    const isMaxed = maxTags ? tags.length >= maxTags : false;

    const filteredSuggestions = suggestions.filter(
        suggestion => suggestion.toLowerCase().includes(inputValue.toLowerCase()) && !tags.includes(suggestion)
    );

    const addTag = (tag: string) => {
        const trimmedTag = tag.trim();
        if (trimmedTag && !tags.includes(trimmedTag) && !isMaxed) {
            setTags([...tags, trimmedTag]);
        }
        setInputValue('');
        setShowSuggestions(false);
    };

    const removeTag = (tagToRemove: string) => {
        setTags(tags.filter(tag => tag !== tagToRemove));
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            addTag(inputValue);
        } else if (e.key === 'Backspace' && inputValue === '') {
            removeTag(tags[tags.length - 1]);
        }
    };
    
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setShowSuggestions(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const inputPlaceholder = isMaxed ? `Maximum of ${maxTags} reached` : (tags.length === 0 ? placeholder : '');

    return (
        <div ref={containerRef} className="relative">
            <label htmlFor={inputId} className="text-sm font-semibold text-gray-400 mb-1.5 block">{label}</label>
            <div className={`w-full bg-[#2D2D2D] border border-gray-700/50 rounded-lg p-2 flex flex-wrap items-center gap-2 focus-within:ring-2 focus-within:ring-blue-500 ${isMaxed ? 'bg-gray-800/50' : ''}`}>
                {tags.map(tag => (
                    <span key={tag} className="bg-blue-600/50 text-blue-100 px-2 py-1 text-sm rounded-md flex items-center gap-1.5 animate-fade-in">
                        {tag}
                        <button onClick={() => removeTag(tag)} className="text-blue-200 hover:text-white" aria-label={`Remove ${tag}`}>
                            <X size={14} />
                        </button>
                    </span>
                ))}
                <input
                    id={inputId}
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    onFocus={() => setShowSuggestions(true)}
                    placeholder={inputPlaceholder}
                    className="flex-grow bg-transparent outline-none text-gray-200 disabled:cursor-not-allowed"
                    disabled={isMaxed}
                    role="combobox"
                    aria-expanded={showSuggestions && !isMaxed && filteredSuggestions.length > 0}
                    aria-controls={suggestionsId}
                />
            </div>
            {showSuggestions && !isMaxed && filteredSuggestions.length > 0 && (
                <ul id={suggestionsId} role="listbox" className="absolute z-30 w-full max-h-48 mt-1 bg-[#3a3a3a] border border-gray-600 rounded-md shadow-lg overflow-y-auto">
                    {filteredSuggestions.map(suggestion => (
                        <li key={suggestion} onClick={() => addTag(suggestion)} role="option" aria-selected="false" className="px-4 py-2 text-gray-200 hover:bg-blue-600/50 cursor-pointer">
                            {suggestion}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};