'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, Sparkles, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { aiServices } from '@/services/ai';
import { sampleFacts } from '@/lib/data';
import type { Fact } from '@/types';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectFact: (fact: Fact) => void;
}

export function SearchModal({ isOpen, onClose, onSelectFact }: SearchModalProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Fact[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => Math.min(prev + 1, results.length - 1));
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) => Math.max(prev - 1, 0));
      }
      if (e.key === 'Enter' && results[selectedIndex]) {
        onSelectFact(results[selectedIndex]);
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [results, selectedIndex, onSelectFact, onClose]);

  const handleSearch = async () => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    setIsLoading(true);
    try {
      const searchResults = await aiServices.searchFactsNaturalLanguage(query, sampleFacts);
      setResults(searchResults);
      setSelectedIndex(0);
    } catch (error) {
      console.error('Search failed:', error);
      const lowerQuery = query.toLowerCase();
      setResults(
        sampleFacts.filter(
          (f) =>
            f.title.toLowerCase().includes(lowerQuery) ||
            f.shortExplanation.toLowerCase().includes(lowerQuery)
        )
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      if (query.trim()) {
        handleSearch();
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [query]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            className="fixed top-[15%] left-1/2 -translate-x-1/2 w-full max-w-2xl z-50 px-4"
          >
            <div className="bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl shadow-cyan-500/10">
              {/* Search input */}
              <div className="flex items-center gap-4 p-4 border-b border-slate-800">
                <Search className="w-6 h-6 text-cyan-500 flex-shrink-0" />
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Tell me something fascinating about..."
                  className="flex-1 bg-transparent text-white text-lg placeholder-slate-500 focus:outline-none"
                />
                {query && (
                  <button
                    onClick={() => setQuery('')}
                    className="p-1 text-slate-500 hover:text-white transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>

              {/* AI suggestion */}
              {query && (
                <div className="px-4 py-2 bg-cyan-500/5 border-b border-slate-800/50 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-cyan-500" />
                  <span className="text-sm text-cyan-400">
                    AI-powered search active
                  </span>
                </div>
              )}

              {/* Results */}
              <div className="max-h-96 overflow-y-auto">
                {isLoading ? (
                  <div className="p-8 text-center">
                    <div className="w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto" />
                    <p className="text-slate-400 mt-4">Searching...</p>
                  </div>
                ) : results.length > 0 ? (
                  <ul className="divide-y divide-slate-800/50">
                    {results.map((fact, index) => (
                      <li key={fact.id}>
                        <motion.button
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                          onClick={() => {
                            onSelectFact(fact);
                            onClose();
                          }}
                          className={`w-full p-4 text-left transition-colors ${
                            index === selectedIndex
                              ? 'bg-cyan-500/10'
                              : 'hover:bg-slate-800/50'
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <div className="flex-1">
                              <h4 className="text-white font-medium mb-1">
                                {fact.title}
                              </h4>
                              <p className="text-sm text-slate-400 line-clamp-1">
                                {fact.shortExplanation}
                              </p>
                              <span className="inline-block mt-2 text-xs px-2 py-0.5 bg-slate-800 text-slate-400 rounded">
                                {fact.category.replace('-', ' ')}
                              </span>
                            </div>
                            <ArrowRight
                              className={`w-5 h-5 text-slate-600 flex-shrink-0 transition-colors ${
                                index === selectedIndex
                                  ? 'text-cyan-500'
                                  : ''
                              }`}
                            />
                          </div>
                        </motion.button>
                      </li>
                    ))}
                  </ul>
                ) : query ? (
                  <div className="p-8 text-center">
                    <p className="text-slate-400">No facts found for "{query}"</p>
                    <p className="text-sm text-slate-500 mt-2">
                      Try a different search term
                    </p>
                  </div>
                ) : (
                  <div className="p-8 text-center">
                    <p className="text-slate-400">
                      Ask anything about science, space, history...
                    </p>
                    <div className="flex flex-wrap gap-2 justify-center mt-4">
                      {['Tell me about space', 'Amazing animal facts', 'Ocean mysteries'].map(
                        (suggestion) => (
                          <button
                            key={suggestion}
                            onClick={() => setQuery(suggestion)}
                            className="px-3 py-1.5 text-sm bg-slate-800 text-slate-400 rounded-full hover:bg-slate-700 hover:text-white transition-colors"
                          >
                            {suggestion}
                          </button>
                        )
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="px-4 py-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-500">
                <div className="flex items-center gap-4">
                  <span>
                    <kbd className="px-1.5 py-0.5 bg-slate-800 rounded">↑↓</kbd> to navigate
                  </span>
                  <span>
                    <kbd className="px-1.5 py-0.5 bg-slate-800 rounded">↵</kbd> to select
                  </span>
                </div>
                <button
                  onClick={onClose}
                  className="hover:text-white transition-colors"
                >
                  <kbd className="px-1.5 py-0.5 bg-slate-800 rounded">esc</kbd> to close
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
