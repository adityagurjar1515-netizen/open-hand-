'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { categories, getFactsByCategory } from '@/lib/data';
import { getCategoryColor } from '@/lib/utils';

export function CategoriesSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });

  const y = useTransform(scrollYProgress, [0, 1], [100, -100]);

  return (
    <section ref={sectionRef} className="relative py-32 overflow-hidden">
      <motion.div style={{ y }} className="max-w-7xl mx-auto px-6">
        {/* Section header */}
        <div className="text-center mb-16">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-block px-4 py-1.5 text-sm text-cyan-400 bg-cyan-500/10 rounded-full mb-4"
          >
            Explore by Category
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-bold text-white mb-4"
          >
            Journey Through Knowledge
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-lg text-slate-400 max-w-2xl mx-auto"
          >
            Twelve unique categories, each a portal to fascinating discoveries
          </motion.p>
        </div>

        {/* Categories grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {categories.map((category, index) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
            >
              <Link
                href={`/facts?category=${category.id}`}
                className="group relative block p-6 rounded-2xl bg-gradient-to-br from-slate-900/80 to-slate-950/80 border border-slate-800/50 overflow-hidden transition-all duration-300 hover:border-slate-700/50 hover:scale-[1.02]"
              >
                {/* Glow effect */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${getCategoryColor(
                    category.id
                  )} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}
                />

                {/* Icon */}
                <div
                  className={`w-12 h-12 rounded-xl bg-gradient-to-br ${getCategoryColor(
                    category.id
                  )} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}
                >
                  <span className="text-2xl">{getCategoryEmoji(category.id)}</span>
                </div>

                {/* Content */}
                <h3 className="text-lg font-bold text-white mb-1 group-hover:text-cyan-300 transition-colors">
                  {category.name}
                </h3>
                <p className="text-xs text-slate-500 mb-3 line-clamp-2">
                  {category.description}
                </p>

                {/* Fact count */}
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-600">
                    {getFactsByCategory(category.id).length} facts
                  </span>
                  <ArrowRight className="w-4 h-4 text-slate-600 group-hover:text-cyan-400 group-hover:translate-x-1 transition-all" />
                </div>

                {/* Border glow */}
                <div
                  className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${getCategoryColor(
                    category.id
                  )} opacity-0 group-hover:opacity-20 transition-opacity duration-500 blur-sm -z-10`}
                />
              </Link>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Background decoration */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-violet-500/5 rounded-full blur-3xl" />
      </div>
    </section>
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
