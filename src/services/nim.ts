import type { Fact, Source } from '@/types';

export interface NIMConfig {
  apiKey: string;
  baseUrl?: string;
  model?: string;
}

export interface GenerationParams {
  prompt: string;
  maxTokens?: number;
  temperature?: number;
  topP?: number;
  stop?: string[];
}

export interface StructuredGenerationParams extends GenerationParams {
  schema: Record<string, unknown>;
}

export interface EmbeddingParams {
  input: string | string[];
  model?: string;
}

export interface VisionParams {
  imageUrl: string;
  prompt: string;
  model?: string;
}

export abstract class AIProvider {
  abstract generate(params: GenerationParams): Promise<string>;
  abstract structuredGenerate(params: StructuredGenerationParams): Promise<Record<string, unknown>>;
  abstract getEmbeddings(params: EmbeddingParams): Promise<number[]>;
  abstract generateFact(params: { topic: string; category: string }): Promise<Partial<Fact>>;
  abstract verifyClaim(params: { claim: string; sources: Source[] }): Promise<{ verified: boolean; confidence: number }>;
}

export class NIMProvider implements AIProvider {
  private apiKey: string;
  private baseUrl: string;
  private defaultModel: string;

  constructor(config: NIMConfig) {
    this.apiKey = config.apiKey;
    this.baseUrl = config.baseUrl || 'https://integrate.api.nvidia.com/v1';
    this.defaultModel = config.model || 'mistralai/mixtral-8x7b-instruct-v0.1';
  }

  private async request<T>(endpoint: string, body: Record<string, unknown>): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error(`NIM API Error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  async generate(params: GenerationParams): Promise<string> {
    const response = await this.request<{ choices: Array<{ message: { content: string } }> }>(
      '/completions',
      {
        model: this.defaultModel,
        prompt: params.prompt,
        max_tokens: params.maxTokens || 1024,
        temperature: params.temperature || 0.7,
        top_p: params.topP || 0.9,
        stop: params.stop,
      }
    );

    return response.choices[0]?.message?.content || '';
  }

  async structuredGenerate(params: StructuredGenerationParams): Promise<Record<string, unknown>> {
    const response = await this.request<{ choices: Array<{ message: { content: string } }> }>(
      '/completions',
      {
        model: this.defaultModel,
        prompt: `${params.prompt}\n\nProvide your response in valid JSON format matching this schema: ${JSON.stringify(params.schema)}`,
        max_tokens: params.maxTokens || 2048,
        temperature: params.temperature || 0.3,
        stop: ['```', '```json'],
      }
    );

    const content = response.choices[0]?.message?.content || '';
    try {
      const jsonMatch = content.match(/```(?:json)?\s*([\s\S]*?)\s*```/) || [null, content];
      return JSON.parse(jsonMatch[1] || content);
    } catch {
      throw new Error('Failed to parse structured response from NIM');
    }
  }

  async getEmbeddings(params: EmbeddingParams): Promise<number[]> {
    const response = await this.request<{ embeddings: number[][] }>(
      '/embeddings',
      {
        input: params.input,
        model: params.model || 'nvolveqa_40k',
      }
    );

    return response.embeddings[0] || [];
  }

  async generateFact(params: { topic: string; category: string }): Promise<Partial<Fact>> {
    const prompt = `Generate an interesting fact about "${params.topic}" in the category "${params.category}".
    
    Return a JSON object with the following structure:
    {
      "title": "The title of the fact (max 100 chars)",
      "shortExplanation": "A brief explanation (max 200 chars)",
      "longExplanation": "A detailed explanation (500-1000 chars)",
      "interestingnessScore": 0.0-1.0,
      "difficulty": "easy" or "medium" or "hard"
    }

    Make sure the fact is verified, interesting, and educational.`;

    const result = await this.structuredGenerate({
      prompt,
      schema: {
        title: { type: 'string' },
        shortExplanation: { type: 'string' },
        longExplanation: { type: 'string' },
        interestingnessScore: { type: 'number' },
        difficulty: { type: 'string', enum: ['easy', 'medium', 'hard'] },
      },
      maxTokens: 2048,
      temperature: 0.7,
    });

    return result as Partial<Fact>;
  }

  async verifyClaim(params: { claim: string; sources: Source[] }): Promise<{ verified: boolean; confidence: number }> {
    const sourcesText = params.sources
      .map((s) => `- ${s.title} (${s.publisher}): ${s.evidenceSummary}`)
      .join('\n');

    const prompt = `Claim to verify: "${params.claim}"
    
    Sources:
    ${sourcesText}
    
    Based on the provided sources, determine if the claim is verified. Return a JSON object:
    {
      "verified": true/false,
      "confidence": 0.0-1.0,
      "reasoning": "Brief explanation"
    }`;

    const result = await this.structuredGenerate({
      prompt,
      schema: {
        verified: { type: 'boolean' },
        confidence: { type: 'number' },
        reasoning: { type: 'string' },
      },
      maxTokens: 512,
      temperature: 0.3,
    });

    return {
      verified: (result as { verified: boolean }).verified,
      confidence: (result as { confidence: number }).confidence,
    };
  }
}

export class ModelRouter {
  private providers: Map<string, AIProvider> = new Map();
  private defaultProvider?: string;

  addProvider(name: string, provider: AIProvider, setAsDefault = false): void {
    this.providers.set(name, provider);
    if (setAsDefault || this.providers.size === 1) {
      this.defaultProvider = name;
    }
  }

  removeProvider(name: string): void {
    this.providers.delete(name);
    if (this.defaultProvider === name) {
      this.defaultProvider = this.providers.keys().next().value;
    }
  }

  getProvider(name?: string): AIProvider | undefined {
    if (name && this.providers.has(name)) {
      return this.providers.get(name);
    }
    if (this.defaultProvider) {
      return this.providers.get(this.defaultProvider);
    }
    return undefined;
  }

  async generate(providerName: string | undefined, params: GenerationParams): Promise<string> {
    const provider = this.getProvider(providerName);
    if (!provider) {
      throw new Error(`No AI provider available`);
    }
    return provider.generate(params);
  }
}

let nimProvider: NIMProvider | null = null;
let modelRouter: ModelRouter | null = null;

export function initializeNIM(apiKey: string, model?: string): NIMProvider {
  nimProvider = new NIMProvider({ apiKey, model });
  return nimProvider;
}

export function getNIMProvider(): NIMProvider | null {
  return nimProvider;
}

export function initializeModelRouter(): ModelRouter {
  modelRouter = new ModelRouter();
  return modelRouter;
}

export function getModelRouter(): ModelRouter | null {
  return modelRouter;
}
