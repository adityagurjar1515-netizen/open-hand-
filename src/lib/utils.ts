import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export function formatRelativeTime(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diff = now.getTime() - d.getTime();
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) return `${days}d ago`;
  if (hours > 0) return `${hours}h ago`;
  if (minutes > 0) return `${minutes}m ago`;
  return 'Just now';
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

export function truncate(text: string, length: number): string {
  if (text.length <= length) return text;
  return text.slice(0, length).trim() + '...';
}

export function getConfidenceColor(score: number): string {
  if (score >= 0.9) return 'text-green-400';
  if (score >= 0.7) return 'text-yellow-400';
  return 'text-red-400';
}

export function getDifficultyColor(difficulty: 'easy' | 'medium' | 'hard'): string {
  switch (difficulty) {
    case 'easy':
      return 'bg-green-500/20 text-green-400 border-green-500/50';
    case 'medium':
      return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50';
    case 'hard':
      return 'bg-red-500/20 text-red-400 border-red-500/50';
  }
}

export function getCategoryColor(category: string): string {
  const colors: Record<string, string> = {
    science: 'from-blue-500 to-cyan-500',
    space: 'from-purple-500 to-pink-500',
    history: 'from-amber-500 to-orange-500',
    technology: 'from-cyan-500 to-blue-500',
    animals: 'from-green-500 to-emerald-500',
    'human-body': 'from-red-500 to-rose-500',
    ocean: 'from-blue-600 to-teal-500',
    earth: 'from-green-600 to-emerald-500',
    mystery: 'from-violet-500 to-purple-500',
    engineering: 'from-gray-400 to-slate-500',
    psychology: 'from-pink-500 to-rose-500',
    inventions: 'from-yellow-500 to-amber-500',
  };
  return colors[category] || 'from-gray-500 to-slate-500';
}

export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;
  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

export function throttle<T extends (...args: unknown[]) => unknown>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle = false;
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}
