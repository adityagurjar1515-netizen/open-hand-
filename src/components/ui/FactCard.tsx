'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Bookmark, Share2, ExternalLink, CheckCircle2, Clock, Eye } from 'lucide-react';
import { cn, getDifficultyColor, getCategoryColor } from '@/lib/utils';
import type { Fact } from '@/types';

interface FactCardProps {
  fact: Fact;
  onOpen?: () => void;
  onBookmark?: () => void;
  onShare?: () => void;
  featured?: boolean;
  compact?: boolean;
}

export function FactCard({
  fact,
  onOpen,
  onBookmark,
  onShare,
  featured = false,
  compact = false,
}: FactCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 300, damping: 30 });
  const mouseYSpring = useSpring(y, { stiffness: 300, damping: 30 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ['7.5deg', '-7.5deg']);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ['-7.5deg', '7.5deg']);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
    setIsHovered(false);
  };

  return (
    <motion.div
      ref={cardRef}
      style={{
        rotateX,
        rotateY,
        transformStyle: 'preserve-3d',
      }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      className={cn(
        'relative cursor-pointer',
        featured && 'col-span-2 row-span-2',
        compact && 'max-w-sm'
      )}
    >
      <div
        className={cn(
          'relative bg-gradient-to-br from-slate-900/90 to-slate-950/90 backdrop-blur-xl border border-slate-800/50 rounded-2xl overflow-hidden',
          'before:absolute before:inset-0 before:bg-gradient-to-br before:from-cyan-500/5 before:to-violet-500/5 before:opacity-0 before:transition-opacity',
          'hover:before:opacity-100',
          featured ? 'p-8' : 'p-6'
        )}
        style={{ transform: 'translateZ(50px)' }}
      >
        {/* Glow effect */}
        <div
          className={cn(
            'absolute -inset-px rounded-2xl bg-gradient-to-r from-cyan-500/20 via-transparent to-violet-500/20 opacity-0 transition-opacity duration-500 blur-sm',
            isHovered && 'opacity-100'
          )}
        />

        {/* Category badge */}
        <div className="flex items-center gap-3 mb-4">
          <span
            className={cn(
              'px-3 py-1 text-xs font-medium rounded-full bg-gradient-to-r capitalize',
              getCategoryColor(fact.category)
            )}
          >
            {fact.category.replace('-', ' ')}
          </span>
          <span className={cn('px-3 py-1 text-xs font-medium rounded-full border', getDifficultyColor(fact.difficulty))}>
            {fact.difficulty}
          </span>
          {fact.verified && (
            <span className="flex items-center gap-1 px-3 py-1 text-xs font-medium text-green-400 bg-green-400/10 rounded-full">
              <CheckCircle2 className="w-3 h-3" />
              Verified
            </span>
          )}
        </div>

        {/* Title */}
        <h3 className={cn('font-bold text-white mb-3', featured ? 'text-3xl' : 'text-xl')}>
          {fact.title}
        </h3>

        {/* Short explanation */}
        <p className={cn('text-slate-400 mb-6', featured ? 'text-lg' : 'text-sm')}>
          {fact.shortExplanation}
        </p>

        {/* Stats */}
        <div className="flex items-center gap-4 text-xs text-slate-500 mb-4">
          <span className="flex items-center gap-1">
            <Eye className="w-3 h-3" />
            {fact.views?.toLocaleString() || 0}
          </span>
          <span className="flex items-center gap-1">
            <Bookmark className="w-3 h-3" />
            {fact.bookmarks?.toLocaleString() || 0}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {new Date(fact.publicationDate).toLocaleDateString()}
          </span>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={(e) => {
              e.stopPropagation();
              onOpen?.();
            }}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-cyan-500/20 text-cyan-400 rounded-xl font-medium text-sm hover:bg-cyan-500/30 transition-colors"
          >
            <ExternalLink className="w-4 h-4" />
            Explore
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={(e) => {
              e.stopPropagation();
              onBookmark?.();
            }}
            className="p-2 bg-slate-800/50 text-slate-400 rounded-xl hover:bg-slate-800 hover:text-cyan-400 transition-colors"
          >
            <Bookmark className="w-4 h-4" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={(e) => {
              e.stopPropagation();
              onShare?.();
            }}
            className="p-2 bg-slate-800/50 text-slate-400 rounded-xl hover:bg-slate-800 hover:text-cyan-400 transition-colors"
          >
            <Share2 className="w-4 h-4" />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
