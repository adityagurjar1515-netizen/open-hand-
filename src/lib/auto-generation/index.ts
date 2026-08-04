'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import type { Fact, Source } from '@/types';

// Categories for auto-generation
const CATEGORIES = [
  'space', 'ocean', 'history', 'science', 'technology',
  'animals', 'human-body', 'earth', 'mystery', 'engineering',
  'psychology', 'inventions'
];

// Topic seeds for each category
const TOPIC_SEEDS: Record<string, string[]> = {
  space: ['supernova', 'exoplanet', 'dark matter', 'black hole', 'asteroid', 'nebula', 'comet', 'meteor', 'satellite', 'space station'],
  ocean: ['deep sea creatures', 'coral reefs', 'ocean currents', 'whale migration', 'underwater volcanoes', 'sea trenches', 'marine biology'],
  history: ['ancient civilizations', 'world wars', 'historical monuments', 'famous inventions', 'explorers', 'empires', 'revolutions'],
  science: ['quantum physics', 'genetics', 'chemistry reactions', 'biology systems', 'astronomy discoveries', 'laboratory experiments'],
  technology: ['artificial intelligence', 'blockchain', 'robotics', 'cybersecurity', 'cloud computing', 'quantum computing'],
  animals: ['migration patterns', 'predator behavior', 'endangered species', 'animal communication', 'evolutionary adaptations'],
  'human-body': ['cell regeneration', 'brain functions', 'immune system', 'sensory systems', 'DNA mysteries', 'aging process'],
  earth: ['tectonic plates', 'climate zones', 'natural disasters', 'ecosystems', 'water cycle', 'atmospheric phenomena'],
  mystery: ['unexplained phenomena', 'lost civilizations', 'cryptids', 'ancient mysteries', 'space anomalies'],
  engineering: ['modern bridges', 'skyscrapers', 'renewable energy', 'transportation', 'structural engineering'],
  psychology: ['memory formation', 'consciousness', 'emotional intelligence', 'behavior patterns', 'neuroscience'],
  inventions: ['revolutionary patents', 'accidental discoveries', 'technological breakthroughs', 'medical innovations']
};

// Slugs for facts
const FACT_SLUGS = [
  'the-universe-is-13-8-billion-years-old',
  'neutron-stars-spin-700-times-per-second',
  'the-ocean-is-deeper-than-you-think',
  'the-great-pyramid-was-built-with-2-3-million-blocks',
  'a-giant-squids-eyes-are-as-large-as-basketballs',
  'the-sun-contains-99-86-of-the-solar-systems-mass',
  'honey-never-spoils',
  'bananas-are-technically-berries',
  'the-human-brain-uses-20-percent-of-energy',
  'there-are-more-stars-than-grains-of-sand',
  'octopuses-have-three-hearts',
  'the-moon-is-slowly-drifting-away',
  'sharks-existed-before-trees',
  'venus-rotates-slower-than-its-orbit',
  'the-average-person-walks-the-equivalent-of-five-times-around-the-world-in-a-lifetime'
];

// Generate a random fact
function generateRandomFact(existingSlugs: string[]): Fact {
  const category = CATEGORIES[Math.floor(Math.random() * CATEGORIES.length)];
  const topics = TOPIC_SEEDS[category] || TOPIC_SEEDS.science;
  const topic = topics[Math.floor(Math.random() * topics.length)];
  
  // Find unused slug
  let slug = FACT_SLUGS[Math.floor(Math.random() * FACT_SLUGS.length)];
  let attempts = 0;
  while (existingSlugs.includes(slug) && attempts < 50) {
    slug = `${topic.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`;
    attempts++;
  }
  
  const difficulties = ['beginner', 'intermediate', 'advanced'];
  const difficulty = difficulties[Math.floor(Math.random() * difficulties.length)];
  
  return {
    id: crypto.randomUUID(),
    title: generateTitle(category, topic),
    slug,
    shortExplanation: generateShortExplanation(category, topic),
    longExplanation: generateLongExplanation(category, topic),
    category,
    difficulty,
    confidenceScore: 0.85 + Math.random() * 0.14,
    interestingnessScore: 0.7 + Math.random() * 0.3,
    verified: Math.random() > 0.3,
    views: Math.floor(Math.random() * 1000),
    bookmarks: Math.floor(Math.random() * 100),
    sources: generateSources(),
    publicationDate: new Date(),
    updatedAt: new Date(),
    animationConfig: {
      type: category,
      duration: 30 + Math.floor(Math.random() * 60),
      timeline: generateTimeline()
    }
  };
}

function generateTitle(category: string, topic: string): string {
  const templates = [
    `${topic.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')} Is ${getAdjective()} Than You Think`,
    `The Hidden ${topic.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}`,
    `Why ${topic.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')} Will Blow Your Mind`,
    `${topic.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}: The Ultimate Guide`,
    `Scientists Discover Something ${getAdjective()} About ${topic.split(' ')[0].charAt(0).toUpperCase() + topic.split(' ')[0].slice(1)}`
  ];
  return templates[Math.floor(Math.random() * templates.length)];
}

function getAdjective(): string {
  const adjectives = ['Stranger', 'More Incredible', 'Deeper', 'More Fascinating', 'More Surprising', 'More Complex', 'More Mysterious', 'More Beautiful', 'More Terrifying', 'More Extraordinary'];
  return adjectives[Math.floor(Math.random() * adjectives.length)];
}

function generateShortExplanation(category: string, topic: string): string {
  const explanations: Record<string, string[]> = {
    space: [
      'The universe contains more than 200 billion galaxies, each with hundreds of billions of stars.',
      'A black hole can bend space-time so dramatically that light itself cannot escape.',
      'The largest known star would stretch beyond the orbit of Jupiter if placed at the center of our solar system.'
    ],
    ocean: [
      'The deep ocean is so vast that we have explored less than 5% of it.',
      'Certain deep-sea creatures can survive pressures that would instantly crush most life.',
      'The ocean contains enough gold to give every person on Earth billions of dollars.'
    ],
    science: [
      'Quantum particles can exist in two places at once until observed.',
      'Your body contains more bacterial cells than human cells.',
      'The speed of light is slow enough that we could travel to the edge of the observable universe in a human lifetime.'
    ],
    history: [
      'Ancient civilizations had technologies we still do not fully understand.',
      'History is written by the victors, leaving countless stories untold.',
      'Some ancient structures were built with precision that modern technology struggles to match.'
    ],
    default: [
      `The more we learn about ${topic}, the more mysterious our universe becomes.`,
      `Scientists are constantly discovering new aspects of ${topic} that challenge our understanding.`,
      `${topic.charAt(0).toUpperCase() + topic.slice(1)} holds secrets that researchers are only beginning to unravel.`
    ]
  };
  
  const categoryExplanations = explanations[category] || explanations.default;
  return categoryExplanations[Math.floor(Math.random() * categoryExplanations.length)];
}

function generateLongExplanation(category: string, topic: string): string {
  return `${generateShortExplanation(category, topic)}

This remarkable phenomenon showcases just how much there is to discover in our world. From the smallest quantum interactions to the largest cosmic structures, the universe never ceases to amaze us.

Researchers around the world are continuously studying these topics, uncovering new information that expands our understanding. Each discovery leads to more questions, proving that knowledge is an endless journey.

The implications of these findings extend far beyond academic curiosity. They shape our technology, our medicine, and our fundamental understanding of existence itself.

Future generations will look back on our current knowledge and marvel at what we didn't yet know, just as we marvel at what past generations couldn't have imagined.`;
}

function generateSources(): Source[] {
  const publishers = ['Nature', 'Science', 'National Geographic', 'NASA', 'NOAA', 'Smithsonian', 'Scientific American', 'Discover Magazine'];
  return [
    {
      id: crypto.randomUUID(),
      title: 'Peer-reviewed research study',
      publisher: publishers[Math.floor(Math.random() * publishers.length)],
      date: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000),
      url: 'https://example.com/research',
      evidenceSummary: 'Verified through multiple independent research studies and empirical evidence.'
    }
  ];
}

function generateTimeline() {
  return [
    { id: '1', time: 0, title: 'Discovery', description: 'Initial observation recorded' },
    { id: '2', time: 10, title: 'Research', description: 'Scientific analysis conducted' },
    { id: '3', time: 20, title: 'Verification', description: 'Results confirmed' },
    { id: '4', time: 30, title: 'Publication', description: 'Findings shared with world' }
  ];
}

// Auto-generation hook
export function useAutoGeneratedFacts(intervalMs: number = 60000, factsPerInterval: number = 3) {
  const [facts, setFacts] = useState<Fact[]>([]);
  const [newFactsCount, setNewFactsCount] = useState(0);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const [isGenerating, setIsGenerating] = useState(false);
  const existingSlugsRef = useRef<string[]>([]);
  
  // Initialize with some facts
  useEffect(() => {
    const initialFacts: Fact[] = [];
    for (let i = 0; i < 6; i++) {
      const fact = generateRandomFact(existingSlugsRef.current);
      existingSlugsRef.current.push(fact.slug);
      initialFacts.push(fact);
    }
    setFacts(initialFacts);
  }, []);
  
  // Auto-generate new facts at interval
  useEffect(() => {
    const interval = setInterval(() => {
      setIsGenerating(true);
      
      setTimeout(() => {
        const newFacts: Fact[] = [];
        for (let i = 0; i < factsPerInterval; i++) {
          const fact = generateRandomFact(existingSlugsRef.current);
          existingSlugsRef.current.push(fact.slug);
          newFacts.push(fact);
        }
        
        setFacts(prev => [...newFacts, ...prev].slice(0, 50)); // Keep max 50
        setNewFactsCount(prev => prev + factsPerInterval);
        setLastUpdate(new Date());
        setIsGenerating(false);
      }, 1500); // Simulate generation time
    }, intervalMs);
    
    return () => clearInterval(interval);
  }, [intervalMs, factsPerInterval]);
  
  const refreshNow = useCallback(() => {
    setIsGenerating(true);
    setTimeout(() => {
      const newFacts: Fact[] = [];
      for (let i = 0; i < factsPerInterval; i++) {
        const fact = generateRandomFact(existingSlugsRef.current);
        existingSlugsRef.current.push(fact.slug);
        newFacts.push(fact);
      }
      setFacts(prev => [...newFacts, ...prev].slice(0, 50));
      setNewFactsCount(prev => prev + factsPerInterval);
      setLastUpdate(new Date());
      setIsGenerating(false);
    }, 1500);
  }, [factsPerInterval]);
  
  return {
    facts,
    newFactsCount,
    lastUpdate,
    isGenerating,
    refreshNow,
    nextUpdateIn: intervalMs,
    timeSinceUpdate: Date.now() - lastUpdate.getTime()
  };
}

// Format time remaining
export function formatTimeRemaining(ms: number): string {
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}

// Default export
export default { useAutoGeneratedFacts, formatTimeRemaining };
