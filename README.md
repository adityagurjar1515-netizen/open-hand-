# FACTVERSE AI

**Every Fact Comes Alive.**

FACTVERSE AI is a production-ready AI-powered 3D animated facts platform where AI discovers interesting topics, researches them, verifies information, generates original fact stories, and presents them through cinematic 3D animations.

## Features

- 🌌 **Real 3D WebGL Scenes** - Three.js / React Three Fiber powered immersive experiences
- 🤖 **AI-Powered Content** - NVIDIA NIM integration for fact generation, research, and verification
- ✨ **Cinematic Animations** - GSAP, Framer Motion powered smooth animations
- 📚 **12 Knowledge Categories** - Science, Space, History, Technology, Animals, and more
- 🔍 **AI-Powered Search** - Natural language search with semantic understanding
- 📊 **Admin Dashboard** - Monitor AI jobs, statistics, and manage content
- 📱 **Responsive Design** - Works on desktop, tablet, and mobile
- 🎯 **Quiz Mode** - Test your knowledge with Fact or Fiction
- 🔗 **Source Verification** - Every fact has verified sources
- 🌊 **Smooth Scrolling** - Lenis powered buttery smooth scrolling

## Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS, Framer Motion
- **3D**: Three.js, React Three Fiber, Drei, Postprocessing
- **Animation**: GSAP, Framer Motion
- **AI**: NVIDIA NIM (Model Router architecture for extensibility)
- **State**: Zustand
- **Search**: Fuse.js

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:

```bash
npm install
```

3. Copy the environment variables:

```bash
cp .env.example .env.local
```

4. Add your NVIDIA NIM API key to `.env.local`:

```env
NIM_API_KEY=your_nvidia_nim_api_key_here
```

5. Start the development server:

```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000)

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `NIM_API_KEY` | NVIDIA NIM API key | Yes |
| `NIM_BASE_URL` | NVIDIA NIM base URL | No |
| `NIM_DEFAULT_MODEL` | Default model to use | No |
| `NEXT_PUBLIC_API_URL` | Backend API URL | No |
| `NEXT_PUBLIC_APP_URL` | App URL for metadata | No |

## Project Structure

```
factverse-ai/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── page.tsx           # Homepage
│   │   ├── facts/             # Facts pages
│   │   ├── categories/        # Categories page
│   │   ├── quiz/              # Quiz page
│   │   └── admin/             # Admin dashboard
│   ├── components/
│   │   ├── 3d/               # 3D components (Earth, Stars, Particles, Scene)
│   │   ├── ui/               # UI components (Button, FactCard)
│   │   ├── layout/           # Layout components (Header, Hero, etc.)
│   │   └── search/          # Search components
│   ├── services/
│   │   ├── nim.ts           # NVIDIA NIM provider
│   │   └── ai.ts            # AI services (research, verification, etc.)
│   ├── store/               # Zustand stores
│   ├── hooks/               # Custom React hooks
│   ├── lib/                 # Utilities and sample data
│   └── types/               # TypeScript types
├── public/
│   ├── models/             # 3D models
│   ├── textures/            # Textures
│   └── audio/               # Audio files
└── package.json
```

## NVIDIA NIM Integration

The project uses a modular AI provider architecture that allows easy addition of new AI providers:

```typescript
import { NIMProvider, initializeNIM } from '@/services/nim';

const provider = initializeNIM('your-api-key', 'mistralai/mixtral-8x7b-instruct-v0.1');
const result = await provider.generateFact({
  topic: 'Deep sea creatures',
  category: 'ocean'
});
```

### Supported NIM Features

- Text generation
- Structured generation (JSON)
- Embeddings
- Vision (where supported)
- Model routing

## AI Services

The platform includes several AI-powered services:

1. **Topic Discovery** - Discovers interesting topics to generate facts about
2. **Research Agent** - Gathers information and sources on a topic
3. **Verification Agent** - Verifies facts against sources
4. **Fact Writer Agent** - Generates engaging fact content
5. **Narration Agent** - Creates audio narration scripts

## Pages

- `/` - Homepage with 3D hero, categories, and featured facts
- `/facts` - Browse all facts with filtering and search
- `/facts/[slug]` - Immersive fact detail page
- `/categories` - All categories with featured facts
- `/quiz` - Fact or Fiction quiz
- `/admin` - Admin dashboard

## Performance

The project includes several performance optimizations:

- Dynamic imports for 3D components
- Lazy loading for images
- Reduced motion support
- Mobile performance mode
- WebGL fallback for unsupported devices

## Deployment

### Vercel (Recommended)

```bash
npm run build
vercel deploy
```

### Docker

```bash
docker build -t factverse-ai .
docker run -p 3000:3000 factverse-ai
```

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## License

MIT License - see LICENSE file for details

---

Built with ❤️ using Next.js, Three.js, and NVIDIA NIM
