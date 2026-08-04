'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, TrendingUp, Flame, Clock } from 'lucide-react';
import { FactCard } from '@/components/ui/FactCard';
import { Button } from '@/components/ui/Button';
import { sampleFacts, getFactsByCategory } from '@/lib/data';
import type { Fact, Category } from '@/types';

interface FactsSectionProps {
  title?: string;
  subtitle?: string;
  facts?: Fact[];
  category?: Category;
  limit?: number;
  showViewAll?: boolean;
  variant?: 'default' | 'featured' | 'compact';
}

export function FactsSection({
  title = 'Discover Fascinating Facts',
  subtitle = 'Curated insights from across the universe of knowledge',
  facts,
  category,
  limit = 6,
  showViewAll = true,
  variant = 'default',
}: FactsSectionProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });

  const y = useTransform(scrollYProgress, [0, 1], [50, -50]);

  const displayFacts = facts || (category ? getFactsByCategory(category) : sampleFacts);
  const limitedFacts = displayFacts.slice(0, limit);

  return (
    <section ref={sectionRef} className="relative py-24">
      <motion.div style={{ y }} className="max-w-7xl mx-auto px-6">
        {/* Section header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-12">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex items-center gap-2 mb-3"
            >
              <TrendingUp className="w-5 h-5 text-cyan-500" />
              <span className="text-sm text-cyan-400 uppercase tracking-wider font-medium">
                Trending Now
              </span>
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-3xl md:text-4xl font-bold text-white mb-2"
            >
              {title}
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-slate-400"
            >
              {subtitle}
            </motion.p>
          </div>

          {showViewAll && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
            >
              <Link href="/facts">
                <Button variant="outline">
                  View All Facts
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
            </motion.div>
          )}
        </div>

        {/* Facts grid */}
        <div
          className={
            variant === 'featured'
              ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
              : variant === 'compact'
              ? 'flex gap-6 overflow-x-auto pb-4 snap-x snap-mandatory'
              : 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
          }
        >
          {limitedFacts.map((fact, index) => (
            <motion.div
              key={fact.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className={
                variant === 'compact'
                  ? 'snap-start flex-shrink-0 w-[320px]'
                  : ''
              }
            >
              <FactCard
                fact={fact}
                featured={index === 0 && variant === 'featured'}
                compact={variant === 'compact'}
                onOpen={() => {
                  window.location.href = `/facts/${fact.slug}`;
                }}
              />
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Background decoration */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-slate-800 to-transparent" />
        <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-slate-800 to-transparent" />
      </div>
    </section>
  );
}

interface DailyDiscoveryProps {
  fact: Fact;
  nextDiscoveryTime?: Date;
}

export function DailyDiscovery({ fact, nextDiscoveryTime }: DailyDiscoveryProps) {
  return (
    <section className="relative py-24 overflow-hidden">
      <div className="max-w-4xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="relative"
        >
          {/* Glow */}
          <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500/20 via-violet-500/20 to-cyan-500/20 rounded-3xl blur-xl" />

          {/* Card */}
          <div className="relative bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800/50 rounded-3xl overflow-hidden">
            {/* Header */}
            <div className="px-8 py-6 border-b border-slate-800/50 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-violet-500 flex items-center justify-center">
                  <Flame className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Daily Discovery</h3>
                  <p className="text-sm text-slate-500">New fact every day</p>
                </div>
              </div>

              {nextDiscoveryTime && (
                <div className="flex items-center gap-2 text-sm text-slate-400">
                  <Clock className="w-4 h-4" />
                  <span>
                    Next: {nextDiscoveryTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              )}
            </div>

            {/* Content */}
            <div className="p-8">
              <div className="flex items-start gap-4 mb-6">
                <div className="flex-1">
                  <span className="inline-block px-3 py-1 text-xs font-medium bg-cyan-500/10 text-cyan-400 rounded-full mb-4">
                    {fact.category.replace('-', ' ')}
                  </span>
                  <h4 className="text-2xl font-bold text-white mb-3">
                    {fact.title}
                  </h4>
                  <p className="text-slate-400 leading-relaxed">
                    {fact.shortExplanation}
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-4">
                <Link href={`/facts/${fact.slug}`} className="flex-1">
                  <Button className="w-full">
                    Read Full Story
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </Link>
                <Button variant="outline">
                  Share
                </Button>
              </div>
            </div>

            {/* Decorative gradient */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-cyan-500/10 to-violet-500/10 rounded-full blur-3xl" />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
