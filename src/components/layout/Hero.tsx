'use client';

import { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Shuffle, Sparkles, Clock, CheckCircle2, RefreshCw, Zap, Brain, Globe } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import type { Fact } from '@/types';

interface HeroProps {
  factOfMoment?: Fact;
  onRandomFact?: () => void;
  onExploreFacts?: () => void;
  autoRefreshFacts?: Fact[];
}

export function Hero({ factOfMoment, onRandomFact, onExploreFacts, autoRefreshFacts = [] }: HeroProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [currentFactIndex, setCurrentFactIndex] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [countdown, setCountdown] = useState(30);
  const [displayedFact, setDisplayedFact] = useState<Fact | null>(null);

  // Auto-refresh facts every 30 seconds
  useEffect(() => {
    if (autoRefreshFacts.length === 0) return;
    
    const interval = setInterval(() => {
      setCurrentFactIndex((prev) => (prev + 1) % autoRefreshFacts.length);
    }, 30000);

    return () => clearInterval(interval);
  }, [autoRefreshFacts.length]);

  // Update displayed fact when index changes
  useEffect(() => {
    if (autoRefreshFacts.length > 0) {
      setDisplayedFact(autoRefreshFacts[currentFactIndex]);
    } else if (factOfMoment) {
      setDisplayedFact(factOfMoment);
    }
  }, [currentFactIndex, autoRefreshFacts, factOfMoment]);

  // Countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => (prev <= 1 ? 30 : prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (countdown === 30) {
      setCurrentFactIndex((prev) => (prev + 1) % (autoRefreshFacts.length || 1));
    }
  }, [countdown, autoRefreshFacts.length]);

  const handleRefresh = useCallback(() => {
    setIsRefreshing(true);
    setCurrentFactIndex((prev) => (prev + 1) % (autoRefreshFacts.length || 1));
    setCountdown(30);
    setTimeout(() => setIsRefreshing(false), 1000);
  }, [autoRefreshFacts.length]);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-gradient animate-gradient bg-300%">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-cyan-900/40 via-slate-950 to-slate-950" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-violet-900/40 via-slate-950 to-slate-950" />
      </div>

      {/* Floating glass panels - visionOS style */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-64 h-40 rounded-3xl backdrop-blur-xl border border-white/10"
            style={{
              left: `${15 + (i % 3) * 30}%`,
              top: `${10 + Math.floor(i / 3) * 40}%`,
              background: 'rgba(255, 255, 255, 0.03)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
            }}
            animate={{
              y: [0, -20, 0],
              rotate: [0, 2, 0],
              scale: [1, 1.02, 1],
            }}
            transition={{
              duration: 4 + i,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: i * 0.5,
            }}
          />
        ))}
      </div>

      {/* Content overlay */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-32 text-center">
        {/* AI Status Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-3 px-5 py-2.5 mb-8 rounded-full bg-gradient-to-r from-cyan-500/20 via-violet-500/20 to-cyan-500/20 border border-cyan-500/30 backdrop-blur-xl"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
          >
            <Brain className="w-5 h-5 text-cyan-400" />
          </motion.div>
          <span className="text-sm text-cyan-400 font-medium">AI-Powered • Auto-Refreshing</span>
          <motion.div
            className="w-2 h-2 rounded-full bg-green-400"
            animate={{ scale: [1, 1.5, 1], opacity: [1, 0.5, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </motion.div>

        {/* Main headline */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 30 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold mb-6 tracking-tight"
        >
          <span className="text-white">EVERY </span>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-violet-400 to-cyan-400 animate-text">
            FACT
          </span>
          <br />
          <span className="text-white">COMES ALIVE</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 30 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-lg sm:text-xl md:text-2xl text-slate-400 max-w-2xl mx-auto mb-12"
        >
          Discover the strange, fascinating and unbelievable facts hiding inside our universe
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 30 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
        >
          <Link href="/facts">
            <Button size="lg" onClick={onExploreFacts} className="group bg-gradient-to-r from-cyan-500 to-violet-500 hover:from-cyan-400 hover:to-violet-400 shadow-lg shadow-cyan-500/25">
              <Zap className="mr-2 w-5 h-5" />
              Explore Facts
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
          <Button
            size="lg"
            variant="outline"
            onClick={onRandomFact}
            className="group border-cyan-500/50 hover:bg-cyan-500/10"
          >
            <Shuffle className="mr-2 w-5 h-5" />
            Random Fact
          </Button>
        </motion.div>

        {/* Auto-Refreshing Fact Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={displayedFact?.id || 'default'}
            initial={{ opacity: 0, y: 40, scale: 0.95, rotateX: -10 }}
            animate={{ opacity: 1, y: 0, scale: 1, rotateX: 0 }}
            exit={{ opacity: 0, y: -40, scale: 0.95, rotateX: 10 }}
            transition={{ duration: 0.5, type: 'spring', stiffness: 100 }}
            className="max-w-2xl mx-auto"
          >
            <div className="relative group">
              {/* Glassmorphism card */}
              <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500/50 via-violet-500/50 to-cyan-500/50 rounded-3xl blur-xl opacity-30 group-hover:opacity-50 transition-opacity" />
              <div className="relative bg-slate-900/80 backdrop-blur-2xl border border-white/10 rounded-3xl p-8 text-left overflow-hidden">
                {/* Inner glow */}
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-transparent to-violet-500/5 rounded-3xl" />
                
                {/* Header */}
                <div className="flex items-center justify-between mb-6 relative z-10">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-cyan-500 to-violet-500 flex items-center justify-center shadow-lg shadow-cyan-500/25">
                      <Globe className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-cyan-400" />
                        <span className="text-sm font-medium text-cyan-400">
                          Auto-Refreshing Fact
                        </span>
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        {/* Countdown ring */}
                        <svg className="w-5 h-5 -rotate-90" viewBox="0 0 24 24">
                          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none" className="text-slate-700" />
                          <motion.circle
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="2"
                            fill="none"
                            className="text-cyan-400"
                            strokeDasharray={62.83}
                            strokeDashoffset={62.83 * (1 - countdown / 30)}
                            strokeLinecap="round"
                          />
                        </svg>
                        <span className="text-xs text-slate-500">Next update in {countdown}s</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Refresh button */}
                  <motion.button
                    onClick={handleRefresh}
                    disabled={isRefreshing}
                    className="p-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <motion.div
                      animate={{ rotate: isRefreshing ? 360 : 0 }}
                      transition={{ duration: 1, repeat: isRefreshing ? Infinity : 0, ease: 'linear' }}
                    >
                      <RefreshCw className="w-5 h-5 text-slate-400" />
                    </motion.div>
                  </motion.button>
                </div>

                {/* Category badge */}
                <div className="mb-4 relative z-10">
                  <span className="inline-flex items-center px-4 py-1.5 rounded-full bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/30 text-amber-400 text-xs font-medium capitalize">
                    {displayedFact?.category || 'general'}
                  </span>
                  {displayedFact?.verified && (
                    <span className="inline-flex items-center gap-1 ml-2 px-4 py-1.5 rounded-full bg-green-500/20 border border-green-500/30 text-green-400 text-xs font-medium">
                      <CheckCircle2 className="w-3 h-3" />
                      Verified
                    </span>
                  )}
                </div>

                {/* Title */}
                <motion.h3
                  key={displayedFact?.id}
                  className="text-2xl font-bold text-white mb-4 relative z-10"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  {displayedFact?.title || 'Loading fascinating fact...'}
                </motion.h3>

                {/* Explanation */}
                <motion.p
                  key={`${displayedFact?.id}-text`}
                  className="text-slate-400 mb-6 leading-relaxed relative z-10"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  {displayedFact?.shortExplanation || 'Discover something amazing about our universe...'}
                </motion.p>

                {/* Actions */}
                <div className="flex items-center gap-3 relative z-10">
                  <Link href={`/facts/${displayedFact?.slug || 'default'}`} className="flex-1">
                    <Button className="w-full bg-gradient-to-r from-cyan-500 to-violet-500 hover:from-cyan-400 hover:to-violet-400">
                      Read Full Story
                      <ArrowRight className="ml-2 w-4 h-4" />
                    </Button>
                  </Link>
                  <Button
                    variant="outline"
                    onClick={handleRefresh}
                    className="border-cyan-500/30 hover:bg-cyan-500/10"
                  >
                    <Shuffle className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 30 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex items-center justify-center gap-8 mt-12"
        >
          {[
            { label: 'Facts', value: '500+' },
            { label: 'Categories', value: '12' },
            { label: 'AI Generated', value: 'Daily' },
          ].map((stat, i) => (
            <div key={i} className="text-center">
              <div className="text-2xl font-bold text-white">{stat.value}</div>
              <div className="text-xs text-slate-500 uppercase tracking-wider">{stat.label}</div>
            </div>
          ))}
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: isVisible ? 1 : 0 }}
          transition={{ duration: 1, delay: 1 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <div className="flex flex-col items-center gap-2 text-slate-500">
            <span className="text-xs uppercase tracking-widest">Scroll to explore</span>
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-6 h-10 border-2 border-slate-600 rounded-full flex justify-center pt-2"
            >
              <motion.div
                animate={{ y: [0, 12, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="w-1.5 h-1.5 bg-slate-500 rounded-full"
              />
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-slate-950 pointer-events-none" />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-violet-500/50 to-transparent" />
    </section>
  );
}
