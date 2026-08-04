'use client';

import { useEffect, useState, useCallback, Suspense } from 'react';
import dynamic from 'next/dynamic';
import { useSearchParams, useRouter } from 'next/navigation';
import { Header, Hero, CategoriesSection, FactsSection, DailyDiscovery } from '@/components/layout';
import { sampleFacts, getRandomFact } from '@/lib/data';
import { useUIStore } from '@/store';
import type { Fact } from '@/types';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Dynamically import the 3D scene
const Scene3D = dynamic(
  () => import('@/components/3d/Scene3D').then((mod) => mod.Scene3D),
  {
    ssr: false,
    loading: () => (
      <div className="fixed inset-0 bg-slate-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-slate-400 text-sm">Loading 3D Experience...</p>
        </div>
      </div>
    ),
  }
);

function HomeContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [factOfMoment, setFactOfMoment] = useState<Fact | null>(null);
  const [dailyFact, setDailyFact] = useState<Fact>(sampleFacts[0]);
  const { setScrollProgress, setReducedMotion } = useUIStore();

  // Get fact of the moment based on current time
  useEffect(() => {
    const minuteIndex = new Date().getMinutes() % sampleFacts.length;
    setFactOfMoment(sampleFacts[minuteIndex]);
  }, []);

  // Get daily fact (same for the whole day)
  useEffect(() => {
    const today = new Date();
    const dayIndex = today.getDate() % sampleFacts.length;
    setDailyFact(sampleFacts[dayIndex]);
  }, []);

  // Set up scroll progress tracking
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const handleScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollY = window.scrollY;
      const progress = Math.min(scrollY / scrollHeight, 1);
      setScrollProgress(progress);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [setScrollProgress]);

  // Check for reduced motion preference
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mediaQuery.matches);

    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, [setReducedMotion]);

  // Handle random fact
  const handleRandomFact = useCallback(() => {
    const randomFact = getRandomFact();
    router.push(`/facts/${randomFact.slug}`);
  }, [router]);

  // Handle explore facts
  const handleExploreFacts = useCallback(() => {
    router.push('/facts');
  }, [router]);

  // Calculate next daily discovery time
  const getNextDiscoveryTime = () => {
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    return tomorrow;
  };

  return (
    <main className="relative">
      {/* 3D Background */}
      <div className="fixed inset-0 -z-10">
        <Scene3D />
      </div>

      {/* Header */}
      <Header />

      {/* Hero Section */}
      <Hero
        factOfMoment={factOfMoment ?? undefined}
        onRandomFact={handleRandomFact}
        onExploreFacts={handleExploreFacts}
        autoRefreshFacts={sampleFacts.slice(0, 5)}
      />

      {/* Categories Section */}
      <CategoriesSection />

      {/* Featured Facts */}
      <FactsSection
        title="Trending Facts"
        subtitle="Most popular facts this week"
        limit={6}
        variant="default"
      />

      {/* Daily Discovery */}
      <DailyDiscovery
        fact={dailyFact}
        nextDiscoveryTime={getNextDiscoveryTime()}
      />

      {/* All Facts Grid */}
      <FactsSection
        title="All Facts"
        subtitle="Browse our complete collection of fascinating facts"
        limit={9}
        variant="featured"
      />

      {/* Footer */}
      <footer className="relative py-16 border-t border-slate-800/50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-violet-500 flex items-center justify-center">
                <span className="text-lg">✨</span>
              </div>
              <div>
                <h3 className="font-bold text-white">FACTVERSE AI</h3>
                <p className="text-xs text-slate-500">Every Fact Comes Alive</p>
              </div>
            </div>

            <div className="flex items-center gap-8 text-sm text-slate-400">
              <a href="/about" className="hover:text-white transition-colors">About</a>
              <a href="/facts" className="hover:text-white transition-colors">Facts</a>
              <a href="/categories" className="hover:text-white transition-colors">Categories</a>
              <a href="/quiz" className="hover:text-white transition-colors">Quiz</a>
              <a href="/admin" className="hover:text-white transition-colors">Admin</a>
            </div>

            <p className="text-sm text-slate-500">
              © {new Date().getFullYear()} FACTVERSE AI. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
}

export default function Home() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-950 flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-slate-400 text-sm">Loading FACTVERSE AI...</p>
          </div>
        </div>
      }
    >
      <HomeContent />
    </Suspense>
  );
}
