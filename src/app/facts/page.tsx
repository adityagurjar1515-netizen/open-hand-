'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';
import { Search, Grid, List, X } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { FactCard } from '@/components/ui/FactCard';
import { Button } from '@/components/ui/Button';
import { sampleFacts, categories, getFactsByCategory } from '@/lib/data';
import type { Fact, Category } from '@/types';

const Scene3D = dynamic(
  () => import('@/components/3d/Scene3D').then((mod) => mod.Scene3D),
  { ssr: false }
);

function FactsContent() {
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get('category') as Category | null;
  
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(categoryParam);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'recent' | 'popular' | 'interesting'>('recent');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [filteredFacts, setFilteredFacts] = useState<Fact[]>(sampleFacts);

  useEffect(() => {
    let facts = selectedCategory ? getFactsByCategory(selectedCategory) : sampleFacts;

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      facts = facts.filter(
        (f) =>
          f.title.toLowerCase().includes(query) ||
          f.shortExplanation.toLowerCase().includes(query)
      );
    }

    switch (sortBy) {
      case 'popular':
        facts = [...facts].sort((a, b) => (b.views || 0) - (a.views || 0));
        break;
      case 'interesting':
        facts = [...facts].sort((a, b) => b.interestingnessScore - a.interestingnessScore);
        break;
      default:
        facts = [...facts].sort(
          (a, b) => new Date(b.publicationDate).getTime() - new Date(a.publicationDate).getTime()
        );
    }

    setFilteredFacts(facts);
  }, [selectedCategory, searchQuery, sortBy]);

  const clearFilters = () => {
    setSelectedCategory(null);
    setSearchQuery('');
    setSortBy('recent');
  };

  return (
    <main className="min-h-screen bg-slate-950 relative">
      <div className="fixed inset-0 -z-10 opacity-50">
        <Scene3D />
      </div>

      <Header />

      <div className="relative pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Explore <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-violet-400">Facts</span>
            </h1>
            <p className="text-lg text-slate-400 max-w-2xl mx-auto">
              Discover fascinating facts across science, space, history, and more
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-8"
          >
            <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
              <div className="relative w-full md:w-80">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search facts..."
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-900/80 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 transition-colors"
                />
              </div>

              <div className="flex items-center gap-3 w-full md:w-auto">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                  className="px-4 py-2.5 bg-slate-900/80 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-cyan-500/50 transition-colors cursor-pointer"
                >
                  <option value="recent">Most Recent</option>
                  <option value="popular">Most Popular</option>
                  <option value="interesting">Most Interesting</option>
                </select>

                <div className="flex items-center border border-slate-800 rounded-xl overflow-hidden">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2.5 ${viewMode === 'grid' ? 'bg-cyan-500/20 text-cyan-400' : 'bg-slate-900/80 text-slate-500 hover:text-white'} transition-colors`}
                  >
                    <Grid className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2.5 ${viewMode === 'list' ? 'bg-cyan-500/20 text-cyan-400' : 'bg-slate-900/80 text-slate-500 hover:text-white'} transition-colors`}
                  >
                    <List className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mt-4">
              <button
                onClick={() => setSelectedCategory(null)}
                className={`px-4 py-2 text-sm rounded-full transition-all ${
                  selectedCategory === null
                    ? 'bg-cyan-500 text-white'
                    : 'bg-slate-900/80 text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                All
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-4 py-2 text-sm rounded-full transition-all ${
                    selectedCategory === cat.id
                      ? 'bg-cyan-500 text-white'
                      : 'bg-slate-900/80 text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </motion.div>

          {(selectedCategory || searchQuery) && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mb-6 flex items-center gap-2"
            >
              <span className="text-sm text-slate-500">Active filters:</span>
              {selectedCategory && (
                <span className="inline-flex items-center gap-1 px-3 py-1 text-sm bg-cyan-500/10 text-cyan-400 rounded-full">
                  {categories.find((c) => c.id === selectedCategory)?.name}
                  <X className="w-3 h-3 cursor-pointer hover:text-white" onClick={() => setSelectedCategory(null)} />
                </span>
              )}
              {searchQuery && (
                <span className="inline-flex items-center gap-1 px-3 py-1 text-sm bg-cyan-500/10 text-cyan-400 rounded-full">
                  &quot;{searchQuery}&quot;
                  <X className="w-3 h-3 cursor-pointer hover:text-white" onClick={() => setSearchQuery('')} />
                </span>
              )}
              <button onClick={clearFilters} className="text-sm text-slate-500 hover:text-white transition-colors ml-2">
                Clear all
              </button>
            </motion.div>
          )}

          <p className="text-sm text-slate-500 mb-6">
            Showing {filteredFacts.length} {filteredFacts.length === 1 ? 'fact' : 'facts'}
          </p>

          {filteredFacts.length > 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'flex flex-col gap-4'}
            >
              {filteredFacts.map((fact, index) => (
                <motion.div
                  key={fact.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <FactCard fact={fact} compact={viewMode === 'list'} onOpen={() => { window.location.href = `/facts/${fact.slug}`; }} />
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <div className="text-center py-20">
              <p className="text-xl text-slate-400 mb-4">No facts found</p>
              <p className="text-slate-500 mb-6">Try adjusting your filters or search query</p>
              <Button onClick={clearFilters}>Clear Filters</Button>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

export default function FactsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-950 flex items-center justify-center"><div className="w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin" /></div>}>
      <FactsContent />
    </Suspense>
  );
}
