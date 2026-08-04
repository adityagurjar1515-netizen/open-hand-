import { create } from 'zustand';
import type { Fact, Category, SearchFilters, User, AIJob } from '@/types';

interface FactStore {
  facts: Fact[];
  currentFact: Fact | null;
  loading: boolean;
  error: string | null;
  filters: SearchFilters;
  setFacts: (facts: Fact[]) => void;
  setCurrentFact: (fact: Fact | null) => void;
  addFact: (fact: Fact) => void;
  updateFact: (id: string, updates: Partial<Fact>) => void;
  removeFact: (id: string) => void;
  setFilters: (filters: Partial<SearchFilters>) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useFactStore = create<FactStore>((set) => ({
  facts: [],
  currentFact: null,
  loading: false,
  error: null,
  filters: {},
  setFacts: (facts) => set({ facts }),
  setCurrentFact: (fact) => set({ currentFact: fact }),
  addFact: (fact) => set((state) => ({ facts: [...state.facts, fact] })),
  updateFact: (id, updates) =>
    set((state) => ({
      facts: state.facts.map((f) => (f.id === id ? { ...f, ...updates } : f)),
    })),
  removeFact: (id) =>
    set((state) => ({ facts: state.facts.filter((f) => f.id !== id) })),
  setFilters: (filters) =>
    set((state) => ({ filters: { ...state.filters, ...filters } })),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
}));

interface UIStore {
  isMenuOpen: boolean;
  isSearchOpen: boolean;
  isSourceDrawerOpen: boolean;
  activeCategory: Category | null;
  cameraPosition: { x: number; y: number; z: number };
  scrollProgress: number;
  reducedMotion: boolean;
  webglSupported: boolean;
  toggleMenu: () => void;
  toggleSearch: () => void;
  toggleSourceDrawer: () => void;
  setActiveCategory: (category: Category | null) => void;
  setCameraPosition: (position: { x: number; y: number; z: number }) => void;
  setScrollProgress: (progress: number) => void;
  setReducedMotion: (reduced: boolean) => void;
  setWebglSupported: (supported: boolean) => void;
}

export const useUIStore = create<UIStore>((set) => ({
  isMenuOpen: false,
  isSearchOpen: false,
  isSourceDrawerOpen: false,
  activeCategory: null,
  cameraPosition: { x: 0, y: 0, z: 10 },
  scrollProgress: 0,
  reducedMotion: false,
  webglSupported: true,
  toggleMenu: () => set((state) => ({ isMenuOpen: !state.isMenuOpen })),
  toggleSearch: () => set((state) => ({ isSearchOpen: !state.isSearchOpen })),
  toggleSourceDrawer: () =>
    set((state) => ({ isSourceDrawerOpen: !state.isSourceDrawerOpen })),
  setActiveCategory: (category) => set({ activeCategory: category }),
  setCameraPosition: (position) => set({ cameraPosition: position }),
  setScrollProgress: (progress) => set({ scrollProgress: progress }),
  setReducedMotion: (reduced) => set({ reducedMotion: reduced }),
  setWebglSupported: (supported) => set({ webglSupported: supported }),
}));

interface AuthStore {
  user: User | null;
  isAuthenticated: boolean;
  setUser: (user: User | null) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  isAuthenticated: false,
  setUser: (user) => set({ user, isAuthenticated: !!user }),
  logout: () => set({ user: null, isAuthenticated: false }),
}));

interface AdminStore {
  jobs: AIJob[];
  stats: {
    totalFacts: number;
    verifiedFacts: number;
    pendingReview: number;
    publishedToday: number;
    aiGenerations: number;
    apiUsage: number;
    failedJobs: number;
  };
  setJobs: (jobs: AIJob[]) => void;
  updateJob: (id: string, updates: Partial<AIJob>) => void;
  setStats: (stats: AdminStore['stats']) => void;
}

export const useAdminStore = create<AdminStore>((set) => ({
  jobs: [],
  stats: {
    totalFacts: 0,
    verifiedFacts: 0,
    pendingReview: 0,
    publishedToday: 0,
    aiGenerations: 0,
    apiUsage: 0,
    failedJobs: 0,
  },
  setJobs: (jobs) => set({ jobs }),
  updateJob: (id, updates) =>
    set((state) => ({
      jobs: state.jobs.map((j) => (j.id === id ? { ...j, ...updates } : j)),
    })),
  setStats: (stats) => set({ stats }),
}));

interface QuizStore {
  currentQuestion: number;
  score: number;
  answers: boolean[];
  isComplete: boolean;
  startQuiz: () => void;
  answerQuestion: (answer: boolean) => void;
  resetQuiz: () => void;
}

export const useQuizStore = create<QuizStore>((set) => ({
  currentQuestion: 0,
  score: 0,
  answers: [],
  isComplete: false,
  startQuiz: () =>
    set({ currentQuestion: 0, score: 0, answers: [], isComplete: false }),
  answerQuestion: (answer) =>
    set((state) => ({
      answers: [...state.answers, answer],
      currentQuestion: state.currentQuestion + 1,
      score: answer ? state.score + 1 : state.score,
    })),
  resetQuiz: () =>
    set({ currentQuestion: 0, score: 0, answers: [], isComplete: false }),
}));
