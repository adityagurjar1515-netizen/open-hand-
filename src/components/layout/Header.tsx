'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Menu, X, Search, BookOpen, Sparkles, Zap } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { SearchModal } from '@/components/search/SearchModal';
import { useUIStore } from '@/store';
import { categories } from '@/lib/data';
import type { Fact } from '@/types';

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [selectedFact, setSelectedFact] = useState<Fact | null>(null);
  const { isMenuOpen: storeMenuOpen } = useUIStore();

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-40 px-6 py-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between backdrop-blur-xl bg-slate-950/50 border border-slate-800/50 rounded-2xl px-6 py-3">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3">
              <motion.div
                whileHover={{ rotate: 180 }}
                transition={{ duration: 0.5 }}
                className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-violet-500 flex items-center justify-center"
              >
                <Sparkles className="w-5 h-5 text-white" />
              </motion.div>
              <div>
                <h1 className="text-xl font-bold text-white tracking-tight">
                  FACTVERSE<span className="text-cyan-500">AI</span>
                </h1>
                <p className="text-xs text-slate-500 -mt-0.5">Every Fact Comes Alive</p>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-1">
              {[
                { href: '/', label: 'Home', icon: Zap },
                { href: '/facts', label: 'Explore', icon: BookOpen },
                { href: '/categories', label: 'Categories', icon: BookOpen },
                { href: '/quiz', label: 'Quiz', icon: BookOpen },
              ].map(({ href, label, icon: Icon }) => (
                <Link
                  key={href}
                  href={href}
                  className="px-4 py-2 text-sm text-slate-400 hover:text-white transition-colors flex items-center gap-2"
                >
                  <Icon className="w-4 h-4" />
                  {label}
                </Link>
              ))}
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsSearchOpen(true)}
                className="hidden sm:flex"
              >
                <Search className="w-4 h-4 mr-2" />
                Search
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsSearchOpen(true)}
                className="sm:hidden"
              >
                <Search className="w-5 h-5" />
              </Button>
              <Link href="/admin" className="hidden md:block">
                <Button variant="outline" size="sm">
                  Admin
                </Button>
              </Link>
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="md:hidden p-2 text-slate-400 hover:text-white transition-colors"
              >
                {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="md:hidden mt-2 backdrop-blur-xl bg-slate-950/90 border border-slate-800/50 rounded-2xl p-4"
            >
              <nav className="space-y-1">
                {[
                  { href: '/', label: 'Home' },
                  { href: '/facts', label: 'Explore Facts' },
                  { href: '/categories', label: 'Categories' },
                  { href: '/quiz', label: 'Fact or Fiction' },
                  { href: '/admin', label: 'Admin Dashboard' },
                ].map(({ href, label }) => (
                  <Link
                    key={href}
                    href={href}
                    onClick={() => setIsMenuOpen(false)}
                    className="block px-4 py-3 text-slate-400 hover:text-white hover:bg-slate-800/50 rounded-xl transition-colors"
                  >
                    {label}
                  </Link>
                ))}
              </nav>

              {/* Categories */}
              <div className="mt-4 pt-4 border-t border-slate-800">
                <p className="px-4 text-xs text-slate-500 uppercase tracking-wider mb-2">
                  Categories
                </p>
                <div className="flex flex-wrap gap-2 px-4">
                  {categories.slice(0, 6).map((cat) => (
                    <Link
                      key={cat.id}
                      href={`/facts?category=${cat.id}`}
                      onClick={() => setIsMenuOpen(false)}
                      className="px-3 py-1.5 text-xs bg-slate-800/50 text-slate-400 rounded-full hover:bg-slate-800 hover:text-white transition-colors"
                    >
                      {cat.name}
                    </Link>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </header>

      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelectFact={(fact) => setSelectedFact(fact)}
      />
    </>
  );
}
