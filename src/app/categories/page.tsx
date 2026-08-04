'use client';

import { Suspense } from 'react';
import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/Button';
import { FactCard } from '@/components/ui/FactCard';
import { categories, getFactsByCategory } from '@/lib/data';
import { getCategoryColor } from '@/lib/utils';

const Scene3D = dynamic(
  () => import('@/components/3d/Scene3D').then((mod) => mod.Scene3D),
  { ssr: false }
);

function CategoriesContent() {
  return (
    <main className="min-h-screen bg-slate-950 relative">
      <div className="fixed inset-0 -z-10 opacity-50">
        <Scene3D />
      </div>

      <Header />

      <div className="relative pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-6">
          {/* Page Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Explore <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-violet-400">Categories</span>
            </h1>
            <p className="text-lg text-slate-400 max-w-2xl mx-auto">
              Twelve unique portals to knowledge, each revealing fascinating insights from different domains
            </p>
          </motion.div>

          {/* Categories Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
            {categories.map((category, index) => {
              const facts = getFactsByCategory(category.id);
              return (
                <motion.div
                  key={category.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Link
                    href={`/facts?category=${category.id}`}
                    className="group block bg-gradient-to-br from-slate-900/90 to-slate-950/90 backdrop-blur-xl border border-slate-800/50 rounded-3xl p-8 hover:border-slate-700/50 transition-all duration-300"
                  >
                    {/* Icon */}
                    <div
                      className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${getCategoryColor(category.id)} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}
                    >
                      <span className="text-3xl">{getCategoryEmoji(category.id)}</span>
                    </div>

                    {/* Content */}
                    <h2 className="text-2xl font-bold text-white mb-2 group-hover:text-cyan-300 transition-colors">
                      {category.name}
                    </h2>
                    <p className="text-slate-400 mb-4">{category.description}</p>
                    
                    {/* Stats */}
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-500">
                        {facts.length} facts
                      </span>
                      <ArrowRight className="w-5 h-5 text-slate-600 group-hover:text-cyan-400 group-hover:translate-x-1 transition-all" />
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>

          {/* Featured Facts by Category */}
          {categories.slice(0, 3).map((category, index) => {
            const facts = getFactsByCategory(category.id);
            if (facts.length === 0) return null;
            
            return (
              <motion.section
                key={`${category.id}-facts`}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="mb-20"
              >
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-12 h-12 rounded-xl bg-gradient-to-br ${getCategoryColor(category.id)} flex items-center justify-center`}
                    >
                      <span className="text-2xl">{getCategoryEmoji(category.id)}</span>
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-white">{category.name} Facts</h2>
                      <p className="text-sm text-slate-500">{category.description}</p>
                    </div>
                  </div>
                  <Link href={`/facts?category=${category.id}`}>
                    <Button variant="outline" size="sm">
                      View All
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {facts.slice(0, 3).map((fact, factIndex) => (
                    <motion.div
                      key={fact.id}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: factIndex * 0.1 }}
                    >
                      <FactCard
                        fact={fact}
                        onOpen={() => { window.location.href = `/facts/${fact.slug}`; }}
                      />
                    </motion.div>
                  ))}
                </div>
              </motion.section>
            );
          })}
        </div>
      </div>
    </main>
  );
}

function getCategoryEmoji(categoryId: string): string {
  const emojis: Record<string, string> = {
    science: '🔬',
    space: '🚀',
    history: '📜',
    technology: '💻',
    animals: '🦁',
    'human-body': '🫀',
    ocean: '🌊',
    earth: '🌍',
    mystery: '🔮',
    engineering: '⚙️',
    psychology: '🧠',
    inventions: '💡',
  };
  return emojis[categoryId] || '📚';
}

export default function CategoriesPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-950 flex items-center justify-center"><div className="w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin" /></div>}>
      <CategoriesContent />
    </Suspense>
  );
}
