import { NIMProvider, initializeNIM, getNIMProvider } from './nim';
import type { Fact, Source, AIJob, Category } from '@/types';
import { v4 as uuidv4 } from 'uuid';

const NIM_API_KEY = process.env.NIM_API_KEY || '';

let provider: NIMProvider | null = null;

function getProvider(): NIMProvider {
  if (!provider) {
    if (!NIM_API_KEY) {
      throw new Error('NIM_API_KEY is not configured');
    }
    provider = initializeNIM(NIM_API_KEY);
  }
  return provider;
}

export interface ResearchResult {
  topic: string;
  summary: string;
  keyPoints: string[];
  sources: Omit<Source, 'id'>[];
  confidence: number;
}

export interface FactGenerationResult {
  title: string;
  shortExplanation: string;
  longExplanation: string;
  category: Category;
  difficulty: 'easy' | 'medium' | 'hard';
  interestingnessScore: number;
  confidenceScore: number;
  sources: Omit<Source, 'id'>[];
}

export interface VerificationResult {
  verified: boolean;
  confidence: number;
  reasoning: string;
  conflictingSources?: string[];
}

export const aiServices = {
  async discoverTopics(category?: Category): Promise<string[]> {
    const categoryContext = category ? ` in the ${category} category` : '';
    
    const prompt = `Discover 5 interesting and lesser-known topics${categoryContext} that would make fascinating facts.
    
    Consider:
    - Unusual or counterintuitive information
    - Recent discoveries or developments
    - Surprising connections or comparisons
    - Common misconceptions
    
    Return a JSON array of topic names, each max 50 characters.
    
    Example: ["topic 1", "topic 2", "topic 3", "topic 4", "topic 5"]`;

    try {
      const result = await getProvider().structuredGenerate({
        prompt,
        schema: {
          type: 'array',
          items: { type: 'string' }
        },
        maxTokens: 512,
        temperature: 0.8,
      });
      return (result as unknown as string[]).slice(0, 5);
    } catch (error) {
      console.error('Topic discovery failed:', error);
      return [];
    }
  },

  async researchTopic(topic: string): Promise<ResearchResult> {
    const prompt = `Research the topic: "${topic}"
    
    Provide a comprehensive research summary with:
    1. A brief summary (2-3 sentences)
    2. 4-5 key points that would make interesting facts
    3. 2-3 source references (use real publisher names if possible)
    4. Confidence level (0-1) based on source availability
    
    Return JSON format:
    {
      "topic": "the topic name",
      "summary": "brief summary",
      "keyPoints": ["point 1", "point 2", ...],
      "sources": [
        {"title": "Source Title", "publisher": "Publisher Name", "date": "YYYY-MM-DD", "reference": "ref-id", "evidenceSummary": "what this source provides"}
      ],
      "confidence": 0.0-1.0
    }`;

    try {
      const result = await getProvider().structuredGenerate({
        prompt,
        schema: {
          topic: { type: 'string' },
          summary: { type: 'string' },
          keyPoints: { type: 'array', items: { type: 'string' } },
          sources: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                title: { type: 'string' },
                publisher: { type: 'string' },
                date: { type: 'string' },
                reference: { type: 'string' },
                evidenceSummary: { type: 'string' },
              }
            }
          },
          confidence: { type: 'number' },
        },
        maxTokens: 2048,
        temperature: 0.5,
      });
      return result as unknown as ResearchResult;
    } catch (error) {
      console.error('Research failed:', error);
      throw new Error('Failed to research topic');
    }
  },

  async generateFact(params: {
    topic: string;
    keyPoint: string;
    category: Category;
    sources: Omit<Source, 'id'>[];
  }): Promise<FactGenerationResult> {
    const sourcesText = params.sources
      .map((s, i) => `[${i + 1}] ${s.title} - ${s.publisher}: ${s.evidenceSummary}`)
      .join('\n');

    const prompt = `Generate an engaging fact based on this topic and key point:
    
    Topic: ${params.topic}
    Key Point: ${params.keyPoint}
    Category: ${params.category}
    
    Sources:
    ${sourcesText}
    
    Create a fact that:
    - Is educational and surprising
    - Uses the provided sources
    - Has a compelling title (max 80 characters)
    - Includes both a short explanation (50-150 chars) and detailed explanation (500-1000 chars)
    - Has appropriate difficulty level
    - Has an interestingness score (0-1) based on how surprising/useful the fact is
    - Has a confidence score based on source quality and verification

    Return JSON:
    {
      "title": "Compelling fact title",
      "shortExplanation": "Brief hook (50-150 chars)",
      "longExplanation": "Detailed explanation with context (500-1000 chars)",
      "category": "${params.category}",
      "difficulty": "easy|medium|hard",
      "interestingnessScore": 0.0-1.0,
      "confidenceScore": 0.0-1.0,
      "sources": ${JSON.stringify(params.sources)}
    }`;

    try {
      const result = await getProvider().structuredGenerate({
        prompt,
        schema: {
          title: { type: 'string' },
          shortExplanation: { type: 'string' },
          longExplanation: { type: 'string' },
          category: { type: 'string' },
          difficulty: { type: 'string', enum: ['easy', 'medium', 'hard'] },
          interestingnessScore: { type: 'number' },
          confidenceScore: { type: 'number' },
          sources: { type: 'array' },
        },
        maxTokens: 2048,
        temperature: 0.7,
      });
      return result as unknown as FactGenerationResult;
    } catch (error) {
      console.error('Fact generation failed:', error);
      throw new Error('Failed to generate fact');
    }
  },

  async verifyFact(params: {
    fact: Partial<Fact>;
    sources: Source[];
  }): Promise<VerificationResult> {
    const sourcesText = params.sources
      .map((s, i) => `[${i + 1}] ${s.title} (${s.publisher}): ${s.evidenceSummary}`)
      .join('\n');

    const prompt = `Verify this fact claim using the provided sources:
    
    Fact: ${params.fact.title}
    Short Explanation: ${params.fact.shortExplanation}
    
    Sources:
    ${sourcesText}
    
    Determine if the sources adequately support the fact claim. Consider:
    - Relevance of sources
    - Quality of evidence
    - Potential contradictions
    - Publication credibility
    
    Return JSON:
    {
      "verified": true/false,
      "confidence": 0.0-1.0,
      "reasoning": "Explanation of verification decision",
      "conflictingSources": ["any sources that contradict the claim"] (optional)
    }`;

    try {
      const result = await getProvider().structuredGenerate({
        prompt,
        schema: {
          verified: { type: 'boolean' },
          confidence: { type: 'number' },
          reasoning: { type: 'string' },
          conflictingSources: { type: 'array', items: { type: 'string' } },
        },
        maxTokens: 1024,
        temperature: 0.3,
      });
      return result as unknown as VerificationResult;
    } catch (error) {
      console.error('Verification failed:', error);
      throw new Error('Failed to verify fact');
    }
  },

  async generateNarration(fact: Partial<Fact>): Promise<{ text: string; sentences: Array<{ text: string; startTime: number; endTime: number }> }> {
    const prompt = `Create a narration script for this fact that would be engaging when spoken aloud.
    
    Fact Title: ${fact.title}
    Short Explanation: ${fact.shortExplanation}
    Long Explanation: ${fact.longExplanation}
    
    Write a natural, conversational narration (150-250 words) that:
    - Opens with a hook
    - Builds intrigue
    - Provides the key information
    - Ends with a memorable takeaway
    - Uses conversational language suitable for text-to-speech
    
    Return JSON:
    {
      "text": "The full narration text (150-250 words)",
      "sentences": [
        {"text": "Sentence 1", "startTime": 0, "endTime": 3},
        {"text": "Sentence 2", "startTime": 3, "endTime": 6}
      ]
    }
    
    Each sentence should be 2-4 seconds when spoken.`;

    try {
      const result = await getProvider().structuredGenerate({
        prompt,
        schema: {
          text: { type: 'string' },
          sentences: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                text: { type: 'string' },
                startTime: { type: 'number' },
                endTime: { type: 'number' },
              }
            }
          },
        },
        maxTokens: 2048,
        temperature: 0.7,
      });
      return result as unknown as { text: string; sentences: Array<{ text: string; startTime: number; endTime: number }> };
    } catch (error) {
      console.error('Narration generation failed:', error);
      throw new Error('Failed to generate narration');
    }
  },

  async searchFactsNaturalLanguage(query: string, facts: Fact[]): Promise<Fact[]> {
    if (!query.trim()) return facts.slice(0, 10);

    try {
      const queryEmbedding = await getProvider().getEmbeddings({ input: query });
      
      const scoredFacts = facts.map(fact => {
        const factText = `${fact.title} ${fact.shortExplanation} ${fact.category}`;
        return { fact, score: 0 };
      });

      return scoredFacts
        .sort((a, b) => b.score - a.score)
        .map(item => item.fact)
        .slice(0, 10);
    } catch (error) {
      console.error('Search failed, falling back to text search:', error);
      const lowerQuery = query.toLowerCase();
      return facts.filter(
        f => f.title.toLowerCase().includes(lowerQuery) ||
             f.shortExplanation.toLowerCase().includes(lowerQuery)
      ).slice(0, 10);
    }
  },

  async contentModeration(text: string): Promise<{ approved: boolean; reason?: string }> {
    const inappropriateKeywords = ['violence', 'hate', 'explicit'];
    
    for (const keyword of inappropriateKeywords) {
      if (text.toLowerCase().includes(keyword)) {
        return {
          approved: false,
          reason: `Content contains potentially inappropriate keyword: ${keyword}`
        };
      }
    }

    return { approved: true };
  },
};

export async function runFactGenerationPipeline(params: {
  category?: Category;
  topic?: string;
}): Promise<AIJob> {
  const jobId = uuidv4();
  
  const job: AIJob = {
    id: jobId,
    type: 'fact_generation',
    status: 'pending',
    input: params,
    createdAt: new Date(),
  };

  try {
    job.status = 'running';
    
    let topic = params.topic;
    if (!topic) {
      const topics = await aiServices.discoverTopics(params.category);
      topic = topics[Math.floor(Math.random() * topics.length)];
    }

    job.output = { topic };
    
    const research = await aiServices.researchTopic(topic);
    job.output = { ...job.output, research };

    const keyPoint = research.keyPoints[0];
    const factResult = await aiServices.generateFact({
      topic,
      keyPoint,
      category: params.category || 'science',
      sources: research.sources,
    });
    job.output = { ...job.output, fact: factResult };

    const verification = await aiServices.verifyFact({
      fact: factResult,
      sources: factResult.sources as Source[],
    });
    job.output = { ...job.output, verification };

    job.status = 'completed';
    job.completedAt = new Date();
  } catch (error) {
    job.status = 'failed';
    job.error = error instanceof Error ? error.message : 'Unknown error';
  }

  return job;
}
