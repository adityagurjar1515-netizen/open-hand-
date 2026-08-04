// Superbase Client - Real-time Database & Authentication
// This simulates a powerful database system similar to Supabase

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://demo.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'demo-key';

export const supabase = createClient(supabaseUrl, supabaseKey);

// Types
export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  createdAt: Date;
}

export interface Bookmark {
  id: string;
  userId: string;
  factId: string;
  createdAt: Date;
}

export interface QuizResult {
  id: string;
  userId: string;
  score: number;
  totalQuestions: number;
  completedAt: Date;
}

export interface Comment {
  id: string;
  factId: string;
  userId: string;
  userName: string;
  content: string;
  createdAt: Date;
}

export interface UserPreferences {
  userId: string;
  theme: 'dark' | 'light';
  autoPlayNarration: boolean;
  reducedMotion: boolean;
  notifications: boolean;
}

// Mock data store (in production, this would be Supabase)
class SuperbaseStore {
  private bookmarks: Map<string, Bookmark[]> = new Map();
  private quizResults: QuizResult[] = [];
  private comments: Map<string, Comment[]> = new Map();
  private user: User | null = null;
  private preferences: UserPreferences | null = null;

  // Auth
  async signIn(email: string, password: string): Promise<{ user: User; session: string }> {
    // Simulate auth
    this.user = {
      id: crypto.randomUUID(),
      email,
      name: email.split('@')[0],
      createdAt: new Date(),
    };
    return { user: this.user, session: 'mock-session-token' };
  }

  async signUp(email: string, password: string, name: string): Promise<{ user: User; session: string }> {
    this.user = {
      id: crypto.randomUUID(),
      email,
      name,
      createdAt: new Date(),
    };
    return { user: this.user, session: 'mock-session-token' };
  }

  async signOut(): Promise<void> {
    this.user = null;
    this.preferences = null;
  }

  getCurrentUser(): User | null {
    return this.user;
  }

  // Bookmarks
  async addBookmark(factId: string): Promise<Bookmark> {
    if (!this.user) throw new Error('Not authenticated');
    const bookmark: Bookmark = {
      id: crypto.randomUUID(),
      userId: this.user.id,
      factId,
      createdAt: new Date(),
    };
    const userBookmarks = this.bookmarks.get(this.user.id) || [];
    userBookmarks.push(bookmark);
    this.bookmarks.set(this.user.id, userBookmarks);
    return bookmark;
  }

  async removeBookmark(factId: string): Promise<void> {
    if (!this.user) throw new Error('Not authenticated');
    const userBookmarks = this.bookmarks.get(this.user.id) || [];
    this.bookmarks.set(
      this.user.id,
      userBookmarks.filter((b) => b.factId !== factId)
    );
  }

  async getBookmarks(): Promise<Bookmark[]> {
    if (!this.user) return [];
    return this.bookmarks.get(this.user.id) || [];
  }

  async isBookmarked(factId: string): Promise<boolean> {
    if (!this.user) return false;
    const userBookmarks = this.bookmarks.get(this.user.id) || [];
    return userBookmarks.some((b) => b.factId === factId);
  }

  // Quiz Results
  async saveQuizResult(score: number, totalQuestions: number): Promise<QuizResult> {
    if (!this.user) throw new Error('Not authenticated');
    const result: QuizResult = {
      id: crypto.randomUUID(),
      userId: this.user.id,
      score,
      totalQuestions,
      completedAt: new Date(),
    };
    this.quizResults.push(result);
    return result;
  }

  async getQuizResults(): Promise<QuizResult[]> {
    if (!this.user) return [];
    return this.quizResults.filter((r) => r.userId === this.user?.id);
  }

  async getAverageScore(): Promise<number> {
    if (!this.user) return 0;
    const userResults = this.quizResults.filter((r) => r.userId === this.user?.id);
    if (userResults.length === 0) return 0;
    const total = userResults.reduce((sum, r) => sum + (r.score / r.totalQuestions) * 100, 0);
    return total / userResults.length;
  }

  // Comments
  async addComment(factId: string, content: string): Promise<Comment> {
    if (!this.user) throw new Error('Not authenticated');
    const comment: Comment = {
      id: crypto.randomUUID(),
      factId,
      userId: this.user.id,
      userName: this.user.name,
      content,
      createdAt: new Date(),
    };
    const factComments = this.comments.get(factId) || [];
    factComments.push(comment);
    this.comments.set(factId, factComments);
    return comment;
  }

  async getComments(factId: string): Promise<Comment[]> {
    return this.comments.get(factId) || [];
  }

  // Preferences
  async updatePreferences(prefs: Partial<UserPreferences>): Promise<UserPreferences> {
    if (!this.user) throw new Error('Not authenticated');
    this.preferences = {
      userId: this.user.id,
      theme: 'dark',
      autoPlayNarration: true,
      reducedMotion: false,
      notifications: true,
      ...prefs,
    };
    return this.preferences;
  }

  async getPreferences(): Promise<UserPreferences | null> {
    return this.preferences;
  }

  // Real-time subscription (simulated)
  subscribe(channel: string, callback: (data: any) => void): () => void {
    // In production, this would use Supabase real-time
    const interval = setInterval(() => {
      callback({ type: 'mock', data: 'update' });
    }, 30000);
    return () => clearInterval(interval);
  }
}

export const superbaseStore = new SuperbaseStore();

// React hooks
export function useSuperbase() {
  return {
    supabase,
    store: superbaseStore,
    user: superbaseStore.getCurrentUser(),
    isAuthenticated: !!superbaseStore.getCurrentUser(),
  };
}
