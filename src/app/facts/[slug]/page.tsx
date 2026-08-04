'use client';

import { useState, useEffect, useRef, Suspense } from 'react';
import { useParams, useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import {
  ArrowLeft,
  ArrowRight,
  Bookmark,
  Share2,
  CheckCircle2,
  Clock,
  Eye,
  ExternalLink,
  Play,
  Pause,
  Volume2,
  VolumeX,
  ChevronDown,
  Box,
  Sparkles,
  RotateCcw,
  ZoomIn,
} from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/Button';
import { getFactBySlug, sampleFacts } from '@/lib/data';
import { cn, getDifficultyColor, formatDate } from '@/lib/utils';
import type { Fact } from '@/types';
import { InteractiveDiorama, ScrollDrivenScene, MicroAnimationTrigger } from '@/components/interactive';

const Scene3D = dynamic(
  () => import('@/components/3d/Scene3D').then((mod) => mod.Scene3D),
  { ssr: false }
);

const PerFactViz = dynamic(
  () => import('@/components/3d/PerFactVisualizer').then((mod) => mod.PerFactVisualizer),
  { ssr: false, loading: () => <div className="w-full h-80 bg-slate-900/50 animate-pulse rounded-2xl" /> }
);

function FactDetailContent() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;
  
  const [fact, setFact] = useState<Fact | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentSentence, setCurrentSentence] = useState(0);
  const [showSources, setShowSources] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [showDiorama, setShowDiorama] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeAnimation, setActiveAnimation] = useState<string | null>(null);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  });

  // Track scroll progress for scrollytelling
  useEffect(() => {
    const handleScroll = () => {
      if (!scrollRef.current) return;
      const rect = scrollRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      
      if (rect.top <= 0 && rect.bottom >= windowHeight) {
        const progress = Math.min(1, Math.max(0, -rect.top / (rect.height - windowHeight)));
        setScrollProgress(progress);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.8]);

  useEffect(() => {
    const foundFact = getFactBySlug(slug);
    if (foundFact) {
      setFact(foundFact);
    }
  }, [slug]);

  const handleNextFact = () => {
    const currentIndex = sampleFacts.findIndex((f) => f.slug === slug);
    const nextIndex = (currentIndex + 1) % sampleFacts.length;
    router.push(`/facts/${sampleFacts[nextIndex].slug}`);
  };

  const handlePrevFact = () => {
    const currentIndex = sampleFacts.findIndex((f) => f.slug === slug);
    const prevIndex = (currentIndex - 1 + sampleFacts.length) % sampleFacts.length;
    router.push(`/facts/${sampleFacts[prevIndex].slug}`);
  };

  const handleShare = async () => {
    if (navigator.share && fact) {
      await navigator.share({
        title: fact.title,
        text: fact.shortExplanation,
        url: window.location.href,
      });
    } else {
      await navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  if (!fact) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Fact not found</h1>
          <Link href="/facts">
            <Button>Back to Facts</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <main ref={containerRef} className="min-h-screen bg-slate-950 relative">
      {/* 3D Background */}
      <div className="fixed inset-0 -z-10">
        <Scene3D />
      </div>

      <Header />

      {/* Hero Section */}
      <motion.div style={{ opacity, scale }} className="relative pt-32 pb-20">
        <div className="max-w-4xl mx-auto px-6">
          {/* Breadcrumb */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="mb-8"
          >
            <Link
              href="/facts"
              className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Facts
            </Link>
          </motion.div>

          {/* Category & Difficulty */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-3 mb-6"
          >
            <span className="px-4 py-1.5 text-sm font-medium bg-gradient-to-r from-cyan-500/20 to-violet-500/20 text-cyan-400 rounded-full border border-cyan-500/30">
              {fact.category.replace('-', ' ')}
            </span>
            <span className={cn('px-4 py-1.5 text-sm font-medium rounded-full border', getDifficultyColor(fact.difficulty))}>
              {fact.difficulty}
            </span>
            {fact.verified && (
              <span className="flex items-center gap-1.5 px-4 py-1.5 text-sm font-medium text-green-400 bg-green-400/10 rounded-full border border-green-400/30">
                <CheckCircle2 className="w-4 h-4" />
                Verified
              </span>
            )}
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight"
          >
            {fact.title}
          </motion.h1>

          {/* Short Explanation */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl md:text-2xl text-cyan-400 mb-8"
          >
            {fact.shortExplanation}
          </motion.p>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-wrap items-center gap-6 text-sm text-slate-500 mb-8"
          >
            <span className="flex items-center gap-1.5">
              <Eye className="w-4 h-4" />
              {(fact.views || 0).toLocaleString()} views
            </span>
            <span className="flex items-center gap-1.5">
              <Bookmark className="w-4 h-4" />
              {(fact.bookmarks || 0).toLocaleString()} bookmarks
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="w-4 h-4" />
              {formatDate(fact.publicationDate)}
            </span>
            <span className="flex items-center gap-1.5">
              Confidence: {(fact.confidenceScore * 100).toFixed(0)}%
            </span>
          </motion.div>

          {/* Audio Controls */}
          {fact.narration && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mb-8"
            >
              <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-2xl p-4">
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-500 to-violet-500 flex items-center justify-center hover:opacity-90 transition-opacity"
                  >
                    {isPlaying ? (
                      <Pause className="w-5 h-5 text-white" />
                    ) : (
                      <Play className="w-5 h-5 text-white ml-0.5" />
                    )}
                  </button>
                  <div className="flex-1">
                    <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: '0%' }}
                        animate={{ width: isPlaying ? '100%' : '0%' }}
                        transition={{ duration: fact.narration.duration, ease: 'linear' }}
                        className="h-full bg-gradient-to-r from-cyan-500 to-violet-500"
                      />
                    </div>
                    <p className="text-sm text-slate-500 mt-2">
                      {fact.narration.duration} seconds
                    </p>
                  </div>
                  <button
                    onClick={() => setIsMuted(!isMuted)}
                    className="p-2 text-slate-400 hover:text-white transition-colors"
                  >
                    {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* Actions */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex flex-wrap gap-3"
          >
            <Button onClick={() => setIsBookmarked(!isBookmarked)} variant={isBookmarked ? 'default' : 'outline'}>
              <Bookmark className={cn('w-4 h-4 mr-2', isBookmarked && 'fill-current')} />
              {isBookmarked ? 'Bookmarked' : 'Bookmark'}
            </Button>
            <Button variant="outline" onClick={handleShare}>
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </Button>
            <Button 
              variant="outline" 
              onClick={() => setShowDiorama(true)}
              className="border-cyan-500/50 hover:bg-cyan-500/20"
            >
              <Box className="w-4 h-4 mr-2" />
              Explore 3D Diorama
            </Button>
          </motion.div>
        </div>
      </motion.div>

      {/* Unique 3D Animation for this Fact */}
      {fact && (
        <section className="relative py-10">
          <div className="max-w-4xl mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-6"
            >
              <h2 className="text-2xl font-bold text-white mb-2">Visual Explainer</h2>
              <p className="text-slate-400">Interactive 3D animation based on this fact</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="glass rounded-3xl p-4"
            >
              <PerFactViz
                factTitle={fact.title}
                factExplanation={fact.shortExplanation}
                category={fact.category}
                height="400px"
              />
            </motion.div>
          </div>
        </section>
      )}

      {/* Long Explanation Section */}
      <motion.section
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="relative py-20"
      >
        <div className="max-w-4xl mx-auto px-6">
          <div className="bg-gradient-to-br from-slate-900/90 to-slate-950/90 backdrop-blur-xl border border-slate-800/50 rounded-3xl p-8 md:p-12">
            <h2 className="text-2xl font-bold text-white mb-6">The Full Story</h2>
            <div className="prose prose-invert prose-lg max-w-none">
              <p className="text-slate-300 leading-relaxed whitespace-pre-wrap">
                {fact.longExplanation}
              </p>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Timeline Section */}
      {fact.animationConfig?.timeline && fact.animationConfig.timeline.length > 0 && (
        <motion.section
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative py-20"
        >
          <div className="max-w-4xl mx-auto px-6">
            <h2 className="text-2xl font-bold text-white mb-8 text-center">Timeline</h2>
            <div className="relative">
              <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-cyan-500 via-violet-500 to-cyan-500" />
              <div className="space-y-8">
                {fact.animationConfig.timeline.map((event, index) => (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className={cn(
                      'relative flex items-start gap-6',
                      index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                    )}
                  >
                    <div className={cn('flex-1', index % 2 === 0 ? 'md:text-right' : 'md:text-left')}>
                      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6">
                        <span className="inline-block px-3 py-1 text-xs font-medium text-cyan-400 bg-cyan-500/10 rounded-full mb-2">
                          {event.time}s
                        </span>
                        <h3 className="text-lg font-bold text-white mb-2">{event.title}</h3>
                        <p className="text-sm text-slate-400">{event.description}</p>
                      </div>
                    </div>
                    <div className="relative z-10 w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500 to-violet-500 flex items-center justify-center flex-shrink-0">
                      <span className="text-xs font-bold text-white">{index + 1}</span>
                    </div>
                    <div className="flex-1 hidden md:block" />
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </motion.section>
      )}

      {/* Sources Section */}
      <motion.section
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="relative py-20"
      >
        <div className="max-w-4xl mx-auto px-6">
          <button
            onClick={() => setShowSources(!showSources)}
            className="w-full bg-slate-900/80 backdrop-blur-xl border border-slate-800/50 rounded-2xl p-6 flex items-center justify-between hover:border-slate-700/50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-6 h-6 text-green-400" />
              <div className="text-left">
                <h2 className="text-xl font-bold text-white">Sources</h2>
                <p className="text-sm text-slate-400">{fact.sources.length} verified sources</p>
              </div>
            </div>
            <ChevronDown className={cn('w-5 h-5 text-slate-400 transition-transform', showSources && 'rotate-180')} />
          </button>

          {showSources && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mt-4 space-y-4"
            >
              {fact.sources.map((source, index) => (
                <motion.div
                  key={source.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-slate-900/60 border border-slate-800/50 rounded-xl p-6"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="font-bold text-white mb-1">{source.title}</h3>
                      <p className="text-sm text-slate-400 mb-2">
                        {source.publisher} • {formatDate(source.date)}
                      </p>
                      <p className="text-sm text-slate-300">{source.evidenceSummary}</p>
                    </div>
                    {source.url && (
                      <a
                        href={source.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 text-slate-400 hover:text-cyan-400 transition-colors flex-shrink-0"
                      >
                        <ExternalLink className="w-5 h-5" />
                      </a>
                    )}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </motion.section>

      {/* 3D Interactive Diorama Modal */}
      <AnimatePresence>
        {showDiorama && fact && (
          <InteractiveDiorama 
            fact={fact} 
            onClose={() => setShowDiorama(false)}
            scrollProgress={scrollProgress}
          />
        )}
      </AnimatePresence>

      {/* Scrollytelling Section */}
      <section ref={scrollRef} className="relative py-20">
        <div className="max-w-4xl mx-auto px-6 mb-8">
          <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
            <Sparkles className="w-6 h-6 text-cyan-400" />
            Interactive 3D Experience
          </h2>
          <p className="text-slate-400">Scroll down to explore this fact in 3D!</p>
        </div>
        <ScrollDrivenScene />
      </section>

      {/* Micro-Animation Trigger */}
      {fact && (
        <section className="py-10">
          <div className="max-w-4xl mx-auto px-6">
            <MicroAnimationTrigger 
              fact={fact} 
              onTrigger={(animation) => setActiveAnimation(animation)}
            />
          </div>
        </section>
      )}

      {/* Navigation */}
      <section className="relative py-20 border-t border-slate-800/50">
        <div className="max-w-4xl mx-auto px-6">
          <div className="flex items-center justify-between gap-4">
            <Button variant="ghost" onClick={handlePrevFact} className="flex-1 sm:flex-none">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Previous Fact
            </Button>
            <Link href="/facts" className="hidden sm:block">
              <Button variant="outline">All Facts</Button>
            </Link>
            <Button variant="ghost" onClick={handleNextFact} className="flex-1 sm:flex-none justify-end">
              Next Fact
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-slate-800/50">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <p className="text-sm text-slate-500">
            © {new Date().getFullYear()} FACTVERSE AI. All facts are verified and sourced.
          </p>
        </div>
      </footer>
    </main>
  );
}

export default function FactDetailPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-950 flex items-center justify-center"><div className="w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin" /></div>}>
      <FactDetailContent />
    </Suspense>
  );
}
