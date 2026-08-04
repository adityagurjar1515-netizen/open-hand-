import type { Fact, SearchResult, AdminStats, AIJob, Category } from '@/types';
import { sampleFacts, getRandomFact, getFactsByCategory, getFactBySlug, searchFacts } from './data';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

async function fetchApi<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new ApiError(response.status, `API Error: ${response.statusText}`);
    }

    return response.json();
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError(0, 'Network error');
  }
}

export const api = {
  facts: {
    getAll: async (category?: Category): Promise<Fact[]> => {
      if (category) {
        return getFactsByCategory(category);
      }
      return sampleFacts;
    },

    getById: async (id: string): Promise<Fact | null> => {
      return sampleFacts.find((f) => f.id === id) || null;
    },

    getBySlug: async (slug: string): Promise<Fact | null> => {
      return getFactBySlug(slug) || null;
    },

    getRandom: async (): Promise<Fact> => {
      return getRandomFact();
    },

    search: async (query: string): Promise<SearchResult> => {
      const facts = searchFacts(query);
      return {
        facts,
        totalCount: facts.length,
        query,
        filters: {},
      };
    },

    getFeatured: async (): Promise<Fact> => {
      return sampleFacts[0];
    },

    getFactOfMoment: async (): Promise<Fact> => {
      const index = new Date().getMinutes() % sampleFacts.length;
      return sampleFacts[index];
    },
  },

  admin: {
    getStats: async (): Promise<AdminStats> => {
      return {
        totalFacts: sampleFacts.length,
        verifiedFacts: sampleFacts.filter((f) => f.verified).length,
        pendingReview: 3,
        publishedToday: 2,
        aiGenerations: 156,
        apiUsage: 4523,
        failedJobs: 2,
        trendingTopics: [
          { topic: 'Ocean depth', count: 125, category: 'ocean' },
          { topic: 'Space exploration', count: 98, category: 'space' },
          { topic: 'Human biology', count: 87, category: 'human-body' },
        ],
      };
    },

    getJobs: async (): Promise<AIJob[]> => {
      return [
        {
          id: '1',
          type: 'fact_generation',
          status: 'running',
          input: { category: 'science' },
          createdAt: new Date(),
        },
        {
          id: '2',
          type: 'verification',
          status: 'completed',
          input: { factId: '7' },
          output: { verified: true },
          createdAt: new Date(Date.now() - 3600000),
          completedAt: new Date(Date.now() - 3500000),
        },
        {
          id: '3',
          type: 'research',
          status: 'pending',
          input: { topic: 'Quantum entanglement' },
          createdAt: new Date(),
        },
      ];
    },

    approveFact: async (id: string): Promise<Fact> => {
      const fact = sampleFacts.find((f) => f.id === id);
      if (!fact) throw new Error('Fact not found');
      return { ...fact, verified: true };
    },

    rejectFact: async (id: string): Promise<void> => {
      console.log('Rejecting fact:', id);
    },

    regenerateFact: async (id: string): Promise<AIJob> => {
      return {
        id: `regen-${Date.now()}`,
        type: 'fact_generation',
        status: 'pending',
        input: { factId: id },
        createdAt: new Date(),
      };
    },
  },

  quiz: {
    getQuestions: async (count: number = 5): Promise<Fact[]> => {
      const shuffled = [...sampleFacts].sort(() => Math.random() - 0.5);
      return shuffled.slice(0, count);
    },

    submitAnswer: async (
      factId: string,
      userAnswer: boolean
    ): Promise<{ correct: boolean; explanation: string }> => {
      const fact = sampleFacts.find((f) => f.id === factId);
      if (!fact) throw new Error('Fact not found');
      return {
        correct: userAnswer === true,
        explanation: fact.longExplanation,
      };
    },
  },
};

export { ApiError };
