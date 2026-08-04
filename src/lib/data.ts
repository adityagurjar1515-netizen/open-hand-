import type { Fact, CategoryInfo, Category } from '@/types';

export const categories: CategoryInfo[] = [
  { id: 'science', name: 'Science', icon: 'flask', color: '#3b82f6', description: 'Discover the laws of nature' },
  { id: 'space', name: 'Space', icon: 'rocket', color: '#a855f7', description: 'Explore the cosmos' },
  { id: 'history', name: 'History', icon: 'landmark', color: '#f59e0b', description: 'Journey through time' },
  { id: 'technology', name: 'Technology', icon: 'cpu', color: '#06b6d4', description: 'Innovation and progress' },
  { id: 'animals', name: 'Animals', icon: 'paw-print', color: '#22c55e', description: 'The animal kingdom' },
  { id: 'human-body', name: 'Human Body', icon: 'heart-pulse', color: '#ef4444', description: 'Inside us' },
  { id: 'ocean', name: 'Ocean', icon: 'waves', color: '#0ea5e9', description: 'The deep blue' },
  { id: 'earth', name: 'Earth', icon: 'globe', color: '#10b981', description: 'Our planet' },
  { id: 'mystery', name: 'Mystery', icon: 'help-circle', color: '#8b5cf6', description: 'Unexplained phenomena' },
  { id: 'engineering', name: 'Engineering', icon: 'gears', color: '#64748b', description: 'Built to amaze' },
  { id: 'psychology', name: 'Psychology', icon: 'brain', color: '#ec4899', description: 'The human mind' },
  { id: 'inventions', name: 'Inventions', icon: 'lightbulb', color: '#eab308', description: 'Great discoveries' },
];

export const sampleFacts: Fact[] = [
  {
    id: '1',
    title: 'The Ocean Is Deeper Than You Think',
    shortExplanation: 'The deepest point in the ocean is almost 11 kilometers down, where pressure would crush a human instantly.',
    longExplanation: `The Mariana Trench contains the deepest point on Earth, called the Challenger Deep, which descends to approximately 10,935 meters (35,876 feet) below sea level. At this depth, the pressure is over 1,000 times atmospheric pressure at the surface. To put this in perspective, if you were to place Mount Everest into the trench, its peak would still be over a mile below the water's surface. Only three humans have ever reached the bottom of the Challenger Deep, in expeditions using specialized submersibles designed to withstand the immense pressure. The journey takes about 4 hours to descend, and the entire trip takes 8-10 hours round trip. Despite the extreme conditions, scientists have discovered strange organisms living in these depths, adapted to survive in complete darkness under crushing pressure.`,
    category: 'ocean',
    difficulty: 'medium',
    interestingnessScore: 0.95,
    confidenceScore: 0.98,
    slug: 'ocean-deeper-than-you-think',
    publicationDate: new Date('2024-03-15'),
    sources: [
      {
        id: 's1',
        title: 'NOAA Ocean Exploration',
        publisher: 'National Oceanic and Atmospheric Administration',
        date: new Date('2024-01-15'),
        reference: 'NOAA-2024-MARIANA',
        evidenceSummary: 'Verified bathymetric measurements from multiple expeditions',
        verified: true,
      },
      {
        id: 's2',
        title: 'Five Deeps Expedition',
        publisher: 'OceanGate',
        date: new Date('2023-08-20'),
        reference: 'OCEANGATE-2023',
        evidenceSummary: 'Direct submersible measurements and video documentation',
        verified: true,
      },
    ],
    verified: true,
    views: 125000,
    bookmarks: 8500,
    animationConfig: {
      type: 'underwater',
      cameraPath: {
        start: { x: 0, y: 5, z: 15 },
        end: { x: 0, y: -10, z: 5 },
        waypoints: [
          { x: 2, y: 3, z: 10 },
          { x: -2, y: 0, z: 8 },
          { x: 1, y: -5, z: 6 },
        ],
      },
      hotspots: [],
      timeline: [
        { id: 't1', time: 0, title: 'Surface', description: 'We begin at the ocean surface' },
        { id: 't2', time: 3, title: 'Mesopelagic Zone', description: 'The twilight zone begins' },
        { id: 't3', time: 6, title: 'Abyssal Plain', description: 'The deep ocean floor' },
        { id: 't4', time: 10, title: 'Challenger Deep', description: 'The deepest point on Earth' },
      ],
    },
    narration: {
      id: 'n1',
      text: 'The ocean is deeper than you think. The deepest point in the ocean is almost 11 kilometers down, where pressure would crush a human instantly.',
      audioUrl: '/audio/ocean-deep.mp3',
      duration: 45,
      sentences: [
        { text: 'The ocean is deeper than you think.', startTime: 0, endTime: 3 },
        { text: 'The deepest point in the ocean is almost 11 kilometers down.', startTime: 3, endTime: 7 },
        { text: 'Where pressure would crush a human instantly.', startTime: 7, endTime: 10 },
      ],
    },
  },
  {
    id: '2',
    title: 'Light Takes 8 Minutes to Reach Earth',
    shortExplanation: 'The sun is so far away that even though light travels at 299,792 kilometers per second, it still takes about 8 minutes to reach us.',
    longExplanation: `The Sun is approximately 149.6 million kilometers (93 million miles) away from Earth. Light, despite traveling at the fastest speed possible in the universe—299,792 kilometers per second (or about 670 million miles per hour)—requires about 8 minutes and 20 seconds to make this journey. This means that when you look at the Sun, you're actually seeing it as it appeared 8 minutes ago, not as it exists in the present moment. This delay becomes even more dramatic when observing distant stars and galaxies. The nearest star system to us, Alpha Centauri, is so far away that its light takes over 4 years to reach us. When we observe distant galaxies with powerful telescopes, we're seeing them as they existed millions or even billions of years ago, providing a window into the cosmic past.`,
    category: 'space',
    difficulty: 'easy',
    interestingnessScore: 0.88,
    confidenceScore: 0.99,
    slug: 'light-takes-8-minutes',
    publicationDate: new Date('2024-03-10'),
    sources: [
      {
        id: 's3',
        title: 'Astronomical Constants Publication',
        publisher: 'International Astronomical Union',
        date: new Date('2023-06-01'),
        reference: 'IAU-2012',
        evidenceSummary: 'Precise measurements of astronomical unit and speed of light',
        verified: true,
      },
    ],
    verified: true,
    views: 98000,
    bookmarks: 6200,
    animationConfig: {
      type: 'space',
      cameraPath: {
        start: { x: 0, y: 0, z: 20 },
        end: { x: 0, y: 0, z: 5 },
        waypoints: [{ x: 5, y: 2, z: 15 }],
      },
      hotspots: [],
      timeline: [],
    },
  },
  {
    id: '3',
    title: 'Your Brain Uses 20% of Your Body Energy',
    shortExplanation: 'Despite making up only 2% of body weight, your brain consumes about 20% of your daily energy intake.',
    longExplanation: `The human brain, while representing only about 2% of our total body weight, consumes approximately 20% of our daily energy intake. This makes it extraordinarily energy-expensive relative to its size. The brain's high energy consumption is primarily due to its billions of neurons, each maintaining electrical potential and constantly communicating through synapses. Even during sleep, the brain remains highly active, consuming only slightly less energy than when awake. This energy is primarily used to maintain neural signaling through action potentials and synaptic transmission. Research has shown that mental tasks do increase brain energy consumption, though the increase is modest compared to the brain's baseline metabolic rate. This explains why complex cognitive functions may have evolved relatively late in human history, as the metabolic cost of supporting such an energetically expensive organ is substantial.`,
    category: 'human-body',
    difficulty: 'medium',
    interestingnessScore: 0.82,
    confidenceScore: 0.95,
    slug: 'brain-uses-20-percent-energy',
    publicationDate: new Date('2024-03-08'),
    sources: [
      {
        id: 's4',
        title: 'National Academy of Sciences',
        publisher: 'PNAS Journal',
        date: new Date('2023-04-12'),
        reference: 'PNAS-2023-ENERGY',
        evidenceSummary: 'Neuroimaging studies measuring cerebral glucose metabolism',
        verified: true,
      },
    ],
    verified: true,
    views: 76000,
    bookmarks: 5400,
  },
  {
    id: '4',
    title: 'Octopuses Have Three Hearts and Blue Blood',
    shortExplanation: 'These intelligent cephalopods have a unique circulatory system with three hearts and copper-based blood that turns blue when oxygenated.',
    longExplanation: `Octopuses possess one of the most unique circulatory systems in the animal kingdom. They have three hearts: two branchial hearts that pump blood to the gills where it's oxygenated, and one systemic heart that pumps the oxygenated blood throughout the body. Unlike humans who have iron-based hemoglobin in their blood, octopuses have copper-based hemocyanin. When hemocyanin binds with oxygen, it turns the blood blue, giving octopus blood its distinctive appearance. This copper-based system is actually more efficient than hemoglobin at transporting oxygen in cold, low-oxygen environments like the deep ocean, which is where many octopus species live. The systemic heart actually stops beating when the octopus swims, which is why they prefer to crawl—swimming is simply too exhausting for their unique physiology. This remarkable adaptation showcases how evolution has shaped life to thrive in diverse environments.`,
    category: 'animals',
    difficulty: 'easy',
    interestingnessScore: 0.91,
    confidenceScore: 0.97,
    slug: 'octopus-three-hearts-blue-blood',
    publicationDate: new Date('2024-03-05'),
    sources: [
      {
        id: 's5',
        title: 'Marine Biology Research Institute',
        publisher: 'Journal of Experimental Biology',
        date: new Date('2023-09-20'),
        reference: 'JEB-2023-OCTO',
        evidenceSummary: 'Physiological studies of octopus cardiovascular systems',
        verified: true,
      },
    ],
    verified: true,
    views: 142000,
    bookmarks: 11200,
  },
  {
    id: '5',
    title: 'The Eiffel Tower Can Grow 15cm in Summer',
    shortExplanation: 'The iron lattice structure expands when heated, making the Eiffel Tower up to 15 centimeters taller during hot summer days.',
    longExplanation: `The Eiffel Tower, that iconic symbol of Paris, is made of iron and stands at approximately 330 meters tall. However, this height is not constant. During summer months when temperatures can soar above 35°C (95°F), the iron structure expands due to thermal expansion. This causes the tower to grow by up to 15 centimeters (6 inches). Conversely, during winter, the tower contracts and can be up to 15 centimeters shorter than its summer height. This phenomenon is not unique to the Eiffel Tower—all metal structures expand and contract with temperature changes. What makes the Eiffel Tower notable is its lattice design, which maximizes the surface area exposed to temperature changes. The tower's creator, Gustave Eiffel, designed the structure with expansion joints and elevators that can adjust to these changes. In extreme heat, you can sometimes hear the tower creaking as the iron expands.`,
    category: 'engineering',
    difficulty: 'easy',
    interestingnessScore: 0.79,
    confidenceScore: 0.94,
    slug: 'eiffel-tower-grows-summer',
    publicationDate: new Date('2024-03-01'),
    sources: [
      {
        id: 's6',
        title: 'Historical Engineering Records',
        publisher: 'SETE (Société d'Exploitation de la Tour Eiffel)',
        date: new Date('2023-05-10'),
        reference: 'SETE-2023',
        evidenceSummary: 'Official maintenance records and thermal measurements',
        verified: true,
      },
    ],
    verified: true,
    views: 89000,
    bookmarks: 4800,
  },
  {
    id: '6',
    title: 'A Day on Venus Is Longer Than Its Year',
    shortExplanation: 'Venus rotates so slowly on its axis that one Venusian day (243 Earth days) is longer than one Venusian year (225 Earth days).',
    longExplanation: `Venus presents one of the most bizarre rotational dynamics in our solar system. The planet takes approximately 243 Earth days to complete one rotation on its axis, yet it only takes about 225 Earth days to orbit the Sun. This means that a single day on Venus is longer than its entire year. To make things even stranger, Venus rotates backwards compared to most other planets—meaning the Sun rises in the west and sets in the east on Venus. This unusual rotation is thought to be the result of a massive collision with another celestial body early in Venus's history, which reversed its rotational direction. The thick atmosphere of Venus, which is about 90 times denser than Earth's, may also have influenced its rotation over billions of years through tidal interactions. The extreme greenhouse effect on Venus, with surface temperatures of around 465°C (869°F), makes it the hottest planet in our solar system despite not being the closest to the Sun.`,
    category: 'space',
    difficulty: 'hard',
    interestingnessScore: 0.93,
    confidenceScore: 0.96,
    slug: 'venus-day-longer-than-year',
    publicationDate: new Date('2024-02-28'),
    sources: [
      {
        id: 's7',
        title: 'NASA Planetary Science Division',
        publisher: 'JPL Solar System Dynamics',
        date: new Date('2024-01-05'),
        reference: 'NASA-JPL-VENUS',
        evidenceSummary: 'Radar observations from multiple spacecraft missions',
        verified: true,
      },
    ],
    verified: true,
    views: 67000,
    bookmarks: 3900,
  },
  {
    id: '7',
    title: 'Honey Never Spoils',
    shortExplanation: 'Archaeologists have found 3,000-year-old honey in Egyptian tombs that was still perfectly edible due to its unique chemical properties.',
    longExplanation: `Honey is one of the few foods that literally never spoils. Archaeologists have discovered pots of honey in ancient Egyptian tombs that are over 3,000 years old and still perfectly edible. The reason for this remarkable longevity lies in honey's unique composition and properties. First, honey has extremely low moisture content—typically less than 18%. Second, it's highly acidic with a pH between 3 and 4.5, which creates an inhospitable environment for bacteria and microorganisms. Third, honey contains small amounts of hydrogen peroxide, produced by bees through an enzyme called glucose oxidase. When honey is diluted with water, this enzyme becomes active and produces hydrogen peroxide, which kills bacteria. Additionally, bees add formic acid and other compounds during honey production that further inhibit microbial growth. The bees themselves contribute to honey's preservation by adding special enzymes that break down any foreign substances. Perhaps most remarkably, honey absorbs moisture from the air, creating an environment too dry for most microorganisms to survive.`,
    category: 'science',
    difficulty: 'medium',
    interestingnessScore: 0.87,
    confidenceScore: 0.98,
    slug: 'honey-never-spoils',
    publicationDate: new Date('2024-02-25'),
    sources: [
      {
        id: 's8',
        title: 'Archaeological Science Journal',
        publisher: 'University of Bristol',
        date: new Date('2023-07-15'),
        reference: 'ARCHSCI-2023',
        evidenceSummary: 'Chemical analysis of ancient honey samples from archaeological sites',
        verified: true,
      },
    ],
    verified: true,
    views: 156000,
    bookmarks: 9800,
  },
  {
    id: '8',
    title: 'The Great Wall of China Is Not Visible from Space',
    shortExplanation: 'Despite popular belief, the Great Wall of China is too narrow to be seen from space with the naked eye.',
    longExplanation: `The popular myth that the Great Wall of China is visible from space has been debunked by astronauts themselves. Chinese astronaut Yang Liwei, who spent 21 hours in space in 2003, reported that he could not see the Great Wall with the naked eye. NASA astronauts have confirmed this finding, explaining that while the wall is indeed the longest human-made structure at about 21,196 kilometers (13,171 miles), it's only about 6-10 meters wide—far too narrow to be distinguished from the surrounding landscape at orbital distances. To see such a thin structure from space would require a resolution far beyond normal human vision. Interestingly, some other human structures are actually more visible from space, such as airports, highways, and large cities. The myth likely originated from a 19th-century travel guide that made exaggerated claims about the wall's visibility. In 2004, a Chinese astronaut finally photographed the wall using a camera with a telephoto lens from the International Space Station, proving that while it exists, it's virtually invisible to unaided human vision.`,
    category: 'history',
    difficulty: 'easy',
    interestingnessScore: 0.85,
    confidenceScore: 0.97,
    slug: 'great-wall-not-visible-from-space',
    publicationDate: new Date('2024-02-20'),
    sources: [
      {
        id: 's9',
        title: 'NASA Earth Observatory',
        publisher: 'National Aeronautics and Space Administration',
        date: new Date('2023-11-12'),
        reference: 'NASA-EO-2023',
        evidenceSummary: 'Satellite imagery and astronaut testimony',
        verified: true,
      },
    ],
    verified: true,
    views: 203000,
    bookmarks: 14500,
  },
];

export function getFactsByCategory(category: Category): Fact[] {
  return sampleFacts.filter((fact) => fact.category === category);
}

export function getFactBySlug(slug: string): Fact | undefined {
  return sampleFacts.find((fact) => fact.slug === slug);
}

export function getRandomFact(): Fact {
  return sampleFacts[Math.floor(Math.random() * sampleFacts.length)];
}

export function searchFacts(query: string): Fact[] {
  const lowerQuery = query.toLowerCase();
  return sampleFacts.filter(
    (fact) =>
      fact.title.toLowerCase().includes(lowerQuery) ||
      fact.shortExplanation.toLowerCase().includes(lowerQuery) ||
      fact.longExplanation.toLowerCase().includes(lowerQuery)
  );
}
