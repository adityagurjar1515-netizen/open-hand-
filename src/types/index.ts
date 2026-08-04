export interface Fact {
  id: string;
  title: string;
  shortExplanation: string;
  longExplanation: string;
  category: Category;
  difficulty: 'easy' | 'medium' | 'hard';
  interestingnessScore: number;
  confidenceScore: number;
  sources: Source[];
  publicationDate: Date;
  generatedAssets?: GeneratedAsset[];
  narration?: Narration;
  animationConfig?: AnimationConfig;
  slug: string;
  seoTitle?: string;
  seoDescription?: string;
  bookmarks?: number;
  views?: number;
  verified?: boolean;
}

export interface Source {
  id: string;
  title: string;
  publisher: string;
  date: Date;
  reference: string;
  evidenceSummary: string;
  url?: string;
  verified?: boolean;
}

export interface GeneratedAsset {
  id: string;
  type: 'image' | 'video' | '3d-model' | 'audio';
  url: string;
  alt?: string;
  metadata?: Record<string, unknown>;
}

export interface Narration {
  id: string;
  text: string;
  audioUrl: string;
  duration: number;
  sentences: NarrationSentence[];
}

export interface NarrationSentence {
  text: string;
  startTime: number;
  endTime: number;
}

export interface AnimationConfig {
  type: 'underwater' | 'space' | 'earth' | 'tech' | 'organic';
  cameraPath: CameraPath;
  hotspots: Hotspot[];
  timeline: TimelineEvent[];
}

export interface CameraPath {
  start: Position;
  end: Position;
  waypoints: Position[];
}

export interface Position {
  x: number;
  y: number;
  z: number;
}

export interface Hotspot {
  id: string;
  position: Position;
  title: string;
  content: string;
  visibleAt?: number;
}

export interface TimelineEvent {
  id: string;
  time: number;
  title: string;
  description: string;
}

export type Category =
  | 'science'
  | 'space'
  | 'history'
  | 'technology'
  | 'animals'
  | 'human-body'
  | 'ocean'
  | 'earth'
  | 'mystery'
  | 'engineering'
  | 'psychology'
  | 'inventions';

export interface CategoryInfo {
  id: Category;
  name: string;
  icon: string;
  color: string;
  description: string;
  factCount?: number;
}

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role: 'user' | 'admin';
  bookmarks: string[];
  quizResults: QuizResult[];
  createdAt: Date;
}

export interface QuizResult {
  id: string;
  factId: string;
  userAnswer: boolean;
  correct: boolean;
  timestamp: Date;
  score: number;
}

export interface SearchResult {
  facts: Fact[];
  totalCount: number;
  query: string;
  filters: SearchFilters;
}

export interface SearchFilters {
  category?: Category;
  difficulty?: 'easy' | 'medium' | 'hard';
  minConfidence?: number;
  dateRange?: {
    start: Date;
    end: Date;
  };
}

export interface AIJob {
  id: string;
  type: AIJobType;
  status: 'pending' | 'running' | 'completed' | 'failed';
  input: Record<string, unknown>;
  output?: Record<string, unknown>;
  error?: string;
  createdAt: Date;
  completedAt?: Date;
}

export type AIJobType =
  | 'topic_discovery'
  | 'research'
  | 'verification'
  | 'fact_generation'
  | 'visual_generation'
  | 'animation_generation'
  | 'narration_generation';

export interface AdminStats {
  totalFacts: number;
  verifiedFacts: number;
  pendingReview: number;
  publishedToday: number;
  aiGenerations: number;
  apiUsage: number;
  failedJobs: number;
  trendingTopics: TopicTrend[];
}

export interface TopicTrend {
  topic: string;
  count: number;
  category: Category;
}

export interface ScheduledJob {
  id: string;
  name: string;
  interval: string;
  lastRun?: Date;
  nextRun: Date;
  enabled: boolean;
  config: Record<string, unknown>;
}
