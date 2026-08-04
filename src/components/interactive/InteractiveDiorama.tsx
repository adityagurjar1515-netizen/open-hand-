'use client';

import { useRef, useState, useEffect, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Html, Environment, Float, Sparkles, useTexture } from '@react-three/drei';
import * as THREE from 'three';
import { motion, AnimatePresence } from 'framer-motion';
import { X, RotateCcw, ZoomIn, Info, ChevronRight, ChevronLeft } from 'lucide-react';
import type { Fact } from '@/types';

// Diorama scenes configuration
const DIORAMA_SCENES = {
  ocean: {
    name: 'Deep Sea World',
    description: 'Explore the mysteries of the ocean depths',
    background: '#001d3d',
    objects: ['whale', 'squid', 'jellyfish', 'coral'],
    cameraPosition: [0, 5, 15] as [number, number, number],
  },
  space: {
    name: 'Space Exploration',
    description: 'Discover the wonders of our universe',
    background: '#000000',
    objects: ['earth', 'rocket', 'asteroid', 'nebula'],
    cameraPosition: [0, 2, 20] as [number, number, number],
  },
  history: {
    name: 'Ancient World',
    description: 'Journey through historical marvels',
    background: '#1a0f00',
    objects: ['pyramid', 'sphinx', 'column', 'torch'],
    cameraPosition: [0, 10, 25] as [number, number, number],
  },
  animals: {
    name: 'Animal Kingdom',
    description: 'Meet the creatures of our world',
    background: '#0a1f0a',
    objects: ['elephant', 'dino', 'bird', 'tree'],
    cameraPosition: [0, 5, 20] as [number, number, number],
  },
};

// 3D Object Components
function OceanFloor() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -5, 0]} receiveShadow>
      <planeGeometry args={[100, 100]} />
      <meshStandardMaterial color="#001133" roughness={0.9} />
    </mesh>
  );
}

function GiantSquid() {
  const meshRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.2;
      meshRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.5 - 2;
    }
  });

  return (
    <group ref={meshRef}>
      {/* Body */}
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[1.5, 32, 32]} />
        <meshStandardMaterial color="#8B0000" emissive="#400000" />
      </mesh>
      {/* Tentacles */}
      {[...Array(8)].map((_, i) => (
        <mesh
          key={i}
          position={[
            Math.cos((i / 8) * Math.PI * 2) * 0.8,
            -1,
            Math.sin((i / 8) * Math.PI * 2) * 0.8,
          ]}
          rotation={[Math.PI * 0.3, (i / 8) * Math.PI * 2, 0]}
        >
          <cylinderGeometry args={[0.1, 0.05, 3, 8]} />
          <meshStandardMaterial color="#660000" />
        </mesh>
      ))}
      {/* Eyes */}
      {[1, -1].map((x) => (
        <mesh key={x} position={[x * 1.2, 0.5, 1]}>
          <sphereGeometry args={[0.4, 16, 16]} />
          <meshStandardMaterial color="#FFD700" emissive="#FFA500" emissiveIntensity={hovered ? 2 : 0.5} />
        </mesh>
      ))}
      {/* Interactive glow */}
      {hovered && (
        <pointLight position={[0, 0, 2]} color="#FF6600" intensity={2} distance={5} />
      )}
    </group>
  );
}

function BlueWhale() {
  const meshRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.position.x = Math.sin(state.clock.elapsedTime * 0.2) * 2;
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.1) * 0.1;
    }
  });

  return (
    <group ref={meshRef} scale={0.3}>
      {/* Body */}
      <mesh position={[0, 0, 0]}>
        <capsuleGeometry args={[2, 12, 16, 32]} />
        <meshStandardMaterial color="#1e3a5f" roughness={0.7} />
      </mesh>
      {/* Tail */}
      <mesh position={[0, 0, -8]} rotation={[0, 0, Math.PI / 4]}>
        <coneGeometry args={[2, 4, 16]} />
        <meshStandardMaterial color="#1e3a5f" />
      </mesh>
      {/* Head */}
      <mesh position={[0, 0, 7]}>
        <sphereGeometry args={[2.5, 32, 32]} />
        <meshStandardMaterial color="#1e3a5f" />
      </mesh>
      {/* Fins */}
      <mesh position={[2, -1, 2]} rotation={[0, 0, -Math.PI / 4]}>
        <boxGeometry args={[0.5, 3, 4]} />
        <meshStandardMaterial color="#2d4a6f" />
      </mesh>
      <mesh position={[-2, -1, 2]} rotation={[0, 0, Math.PI / 4]}>
        <boxGeometry args={[0.5, 3, 4]} />
        <meshStandardMaterial color="#2d4a6f" />
      </mesh>
    </group>
  );
}

function Jupiter() {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.002;
    }
  });

  return (
    <group>
      <mesh ref={meshRef}>
        <sphereGeometry args={[5, 64, 64]} />
        <meshStandardMaterial color="#c88b3a" roughness={0.8} />
      </mesh>
      {/* Great Red Spot */}
      <mesh position={[2, 1, 4.5]} rotation={[0, 0, 0]}>
        <sphereGeometry args={[1, 16, 16]} />
        <meshStandardMaterial color="#cd5c5c" />
      </mesh>
      {/* Orbit ring */}
      <mesh rotation={[Math.PI / 3, 0, 0]}>
        <torusGeometry args={[8, 0.02, 16, 100]} />
        <meshStandardMaterial color="#ffffff" transparent opacity={0.3} />
      </mesh>
    </group>
  );
}

function GreatPyramid({ progress = 1 }: { progress?: number }) {
  const layers = 10;
  const builtLayers = Math.floor(progress * layers);

  return (
    <group position={[0, 0, 0]}>
      {[...Array(layers)].map((_, i) => (
        <mesh
          key={i}
          position={[
            0,
            i * 1.5 - 7.5 + (i === builtLayers - 1 ? (progress * layers - builtLayers) * 1.5 : 0),
            0,
          ]}
          scale={i < builtLayers ? 1 : i === builtLayers ? progress * layers - builtLayers : 0}
        >
          <boxGeometry args={[20 - i * 2, 1.5, 20 - i * 2]} />
          <meshStandardMaterial
            color={`hsl(${40 + i * 2}, 30%, ${60 - i * 3}%)`}
            roughness={0.9}
          />
        </mesh>
      ))}
      {/* Ground */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -8, 0]}>
        <planeGeometry args={[50, 50]} />
        <meshStandardMaterial color="#c4a35a" />
      </mesh>
    </group>
  );
}

function NeutronStar({ spinSpeed = 1 }: { spinSpeed?: number }) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.05 * spinSpeed;
    }
  });

  return (
    <group>
      {/* Star core */}
      <mesh ref={meshRef}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshStandardMaterial
          color="#00ffff"
          emissive="#00ffff"
          emissiveIntensity={2 * spinSpeed}
        />
      </mesh>
      {/* Beam */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.1, 0.1, 10, 8]} />
        <meshStandardMaterial
          color="#ff00ff"
          emissive="#ff00ff"
          emissiveIntensity={1.5 * spinSpeed}
          transparent
          opacity={0.7}
        />
      </mesh>
      {/* Particles */}
      <Sparkles count={200} scale={10} size={2} speed={spinSpeed * 0.5} color="#00ffff" />
    </group>
  );
}

function SizeComparisonStage() {
  const [object1, setObject1] = useState<string | null>(null);
  const [object2, setObject2] = useState<string | null>(null);
  const [dragging, setDragging] = useState<string | null>(null);

  const objects = [
    { id: 'blue-whale', name: 'Blue Whale', scale: 3, color: '#1e3a5f' },
    { id: 'boeing-737', name: 'Boeing 737', scale: 1, color: '#ffffff' },
    { id: 't-rex', name: 'T-Rex', scale: 0.8, color: '#556b2f' },
    { id: 'human', name: 'Human', scale: 0.2, color: '#deb887' },
    { id: 'elephant', name: 'Elephant', scale: 0.6, color: '#808080' },
    { id: 'football-field', name: 'Football Field', scale: 4, color: '#228b22' },
  ];

  return (
    <div className="relative w-full h-full">
      <Canvas>
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        <Environment preset="city" />
        
        {/* Stage floor */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]}>
          <planeGeometry args={[30, 30]} />
          <meshStandardMaterial color="#1a1a2e" />
        </mesh>

        {/* Placed objects */}
        {object1 && (
          <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
            <mesh position={[-3, 1, 0]}>
              <boxGeometry args={[1 * (objects.find(o => o.id === object1)?.scale || 1), 1, 1]} />
              <meshStandardMaterial color={objects.find(o => o.id === object1)?.color} />
            </mesh>
          </Float>
        )}
        {object2 && (
          <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
            <mesh position={[3, 1, 0]}>
              <boxGeometry args={[1 * (objects.find(o => o.id === object2)?.scale || 1), 1, 1]} />
              <meshStandardMaterial color={objects.find(o => o.id === object2)?.color} />
            </mesh>
          </Float>
        )}
      </Canvas>

      {/* Object palette */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 p-4 glass rounded-2xl">
        {objects.map((obj) => (
          <button
            key={obj.id}
            onClick={() => {
              if (!object1) setObject1(obj.id);
              else if (!object2) setObject2(obj.id);
            }}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              object1 === obj.id || object2 === obj.id
                ? 'bg-cyan-500 text-white'
                : 'bg-white/10 text-white hover:bg-white/20'
            }`}
            style={{ borderLeft: `4px solid ${obj.color}` }}
          >
            {obj.name}
          </button>
        ))}
        <button
          onClick={() => { setObject1(null); setObject2(null); }}
          className="px-4 py-2 rounded-xl text-sm font-medium bg-red-500/20 text-red-400 hover:bg-red-500/30"
        >
          Clear
        </button>
      </div>
    </div>
  );
}

interface DioramaProps {
  fact: Fact;
  onClose: () => void;
  scrollProgress?: number;
}

function DioramaScene({ type, scrollProgress = 1 }: { type: string; scrollProgress?: number }) {
  const { camera } = useThree();

  useEffect(() => {
    const scene = DIORAMA_SCENES[type as keyof typeof DIORAMA_SCENES];
    if (scene) {
      camera.position.set(...scene.cameraPosition);
    }
  }, [type, camera]);

  return (
    <>
      <ambientLight intensity={0.3} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      <pointLight position={[-10, -10, -10]} intensity={0.5} color="#4466ff" />
      
      <fog attach="fog" args={['#000011', 10, 50]} />

      {type === 'ocean' && (
        <>
          <OceanFloor />
          <GiantSquid />
          <BlueWhale />
          <Sparkles count={500} scale={30} size={1} speed={0.3} color="#00ffff" />
        </>
      )}

      {type === 'space' && (
        <>
          <Jupiter />
          <NeutronStar spinSpeed={scrollProgress > 0.5 ? 10 : 1} />
          <Sparkles count={1000} scale={100} size={0.5} speed={0.1} color="#ffffff" />
        </>
      )}

      {type === 'history' && (
        <GreatPyramid progress={scrollProgress} />
      )}

      {type === 'animals' && (
        <>
          <BlueWhale />
          <GiantSquid />
          <Sparkles count={200} scale={20} size={0.5} speed={0.2} color="#00ff00" />
        </>
      )}
    </>
  );
}

export function InteractiveDiorama({ fact, onClose, scrollProgress = 1 }: DioramaProps) {
  const [currentScene, setCurrentScene] = useState<string>('ocean');
  const [activeFact, setActiveFact] = useState<{ text: string; position: [number, number, number] } | null>(null);
  const [showComparison, setShowComparison] = useState(false);

  // Determine scene type from fact category
  useEffect(() => {
    const categorySceneMap: Record<string, string> = {
      ocean: 'ocean',
      space: 'space',
      history: 'history',
      animals: 'animals',
    };
    setCurrentScene(categorySceneMap[fact.category] || 'space');
  }, [fact.category]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/90 backdrop-blur-xl"
    >
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-10 p-6 flex justify-between items-start">
        <div className="glass rounded-2xl p-4 max-w-md">
          <h2 className="text-2xl font-bold text-white mb-2">{fact.title}</h2>
          <p className="text-slate-400 text-sm">{fact.shortExplanation}</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setShowComparison(!showComparison)}
            className="glass p-3 rounded-xl hover:bg-white/20 transition-colors"
            title="Size Comparison"
          >
            <Info className="w-5 h-5 text-cyan-400" />
          </button>
          <button
            onClick={onClose}
            className="glass p-3 rounded-xl hover:bg-white/20 transition-colors"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>
      </div>

      {/* Size Comparison Modal */}
      <AnimatePresence>
        {showComparison && (
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            className="absolute bottom-0 left-0 right-0 h-2/3 z-20"
          >
            <div className="glass-strong h-full rounded-t-3xl p-6">
              <h3 className="text-xl font-bold text-white mb-4">Size Comparison Engine</h3>
              <p className="text-slate-400 mb-4">Select objects to compare their sizes</p>
              <SizeComparisonStage />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 3D Canvas */}
      <Canvas camera={{ position: [0, 5, 15], fov: 60 }}>
        <DioramaScene type={currentScene} scrollProgress={scrollProgress} />
        <OrbitControls enableZoom enablePan enableRotate />
      </Canvas>

      {/* Scroll Progress */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10">
        <div className="glass rounded-full px-6 py-3 flex items-center gap-4">
          <span className="text-sm text-slate-400">Scroll Progress</span>
          <div className="w-32 h-2 bg-slate-700 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-cyan-500 to-violet-500"
              style={{ width: `${scrollProgress * 100}%` }}
            />
          </div>
          <span className="text-sm text-cyan-400">{Math.round(scrollProgress * 100)}%</span>
        </div>
      </div>

      {/* Scene Navigation */}
      <div className="absolute right-6 top-1/2 -translate-y-1/2 z-10 flex flex-col gap-2">
        {Object.entries(DIORAMA_SCENES).map(([key, scene]) => (
          <button
            key={key}
            onClick={() => setCurrentScene(key)}
            className={`glass p-3 rounded-xl transition-all ${
              currentScene === key ? 'bg-cyan-500/30 border-cyan-500' : 'hover:bg-white/10'
            }`}
            title={scene.name}
          >
            <span className="text-xs text-white">{scene.name}</span>
          </button>
        ))}
      </div>

      {/* Interactive Fact Annotations */}
      {activeFact && (
        <Html position={activeFact.position} className="pointer-events-none">
          <div className="glass p-3 rounded-xl max-w-xs animate-pulse">
            <p className="text-white text-sm">{activeFact.text}</p>
          </div>
        </Html>
      )}

      {/* Instructions */}
      <div className="absolute bottom-6 right-6 z-10">
        <div className="glass rounded-xl p-4 text-sm text-slate-400 space-y-2">
          <p>🖱️ Drag to rotate</p>
          <p>🔍 Scroll to zoom</p>
          <p>👆 Right-click to pan</p>
        </div>
      </div>
    </motion.div>
  );
}

export function ScrollDrivenScene() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeFact, setActiveFact] = useState<{ title: string; text: string; progress: number } | null>(null);

  // Scroll fact data for each stage
  const scrollFacts = [
    { title: 'Ancient Egypt', text: 'The Great Pyramid was built with 2.3 million limestone blocks', progress: 0.2 },
    { title: 'Construction', text: 'It took approximately 20 years to complete', progress: 0.4 },
    { title: 'Height', text: 'Originally 146.6 meters, it was the tallest man-made structure for 3,800 years', progress: 0.6 },
    { title: 'Workers', text: 'An estimated 20,000-30,000 workers were involved in its construction', progress: 0.8 },
    { title: 'Legacy', text: 'The only surviving Wonder of the Ancient World', progress: 1.0 },
  ];

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      
      if (rect.top <= 0 && rect.bottom >= windowHeight) {
        const progress = Math.min(1, Math.max(0, -rect.top / (rect.height - windowHeight)));
        setScrollProgress(progress);

        // Update active fact based on progress
        const currentFact = scrollFacts.find((f) => progress <= f.progress);
        if (currentFact) {
          setActiveFact(currentFact);
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div ref={containerRef} className="relative min-h-[400vh]">
      {/* Sticky 3D Scene */}
      <div className="sticky top-0 h-screen">
        <Canvas camera={{ position: [20, 15, 20], fov: 50 }}>
          <ambientLight intensity={0.4} />
          <directionalLight position={[10, 10, 5]} intensity={1} />
          <color attach="background" args={['#1a0f00']} />
          <fog attach="fog" args={['#1a0f00', 20, 80]} />
          
          <GreatPyramid progress={scrollProgress} />
        </Canvas>

        {/* Floating Fact Cards */}
        <AnimatePresence mode="wait">
          {activeFact && (
            <motion.div
              key={activeFact.title}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              className="absolute right-10 top-1/2 -translate-y-1/2"
            >
              <div className="glass-strong rounded-2xl p-6 max-w-sm">
                <h3 className="text-xl font-bold text-white mb-2">{activeFact.title}</h3>
                <p className="text-slate-300">{activeFact.text}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Progress Indicator */}
        <div className="absolute left-10 top-1/2 -translate-y-1/2 flex flex-col gap-3">
          {scrollFacts.map((fact, i) => (
            <motion.div
              key={i}
              className={`w-3 h-3 rounded-full transition-all ${
                scrollProgress >= fact.progress
                  ? 'bg-cyan-400 scale-125'
                  : 'bg-slate-600'
              }`}
              animate={{
                scale: scrollProgress >= fact.progress ? 1.5 : 1,
              }}
            />
          ))}
        </div>
      </div>

      {/* Scroll Sections */}
      <div className="absolute inset-0 pointer-events-none">
        {scrollFacts.map((fact, i) => (
          <div
            key={i}
            className="h-screen flex items-center justify-center"
            style={{ opacity: scrollProgress >= fact.progress && scrollProgress <= (scrollFacts[i + 1]?.progress || 1) ? 1 : 0 }}
          >
            <div className="glass rounded-2xl p-8 text-center max-w-lg">
              <h2 className="text-3xl font-bold text-white mb-4">{fact.title}</h2>
              <p className="text-xl text-slate-300">{fact.text}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function MicroAnimationTrigger({ fact, onTrigger }: { fact: Fact; onTrigger: (animation: string) => void }) {
  const animationMap: Record<string, string[]> = {
    'neutron': ['spin', 'particles', 'glow'],
    'whale': ['swim', 'bubble'],
    'pyramid': ['build', 'shimmer'],
    'squid': ['tentacles', 'glow-eyes'],
    'space': ['rotate', 'stars'],
  };

  const keywords = Object.keys(animationMap);
  const matchedKeyword = keywords.find(k => 
    fact.title.toLowerCase().includes(k) || fact.shortExplanation.toLowerCase().includes(k)
  );

  return (
    <div className="glass rounded-xl p-4">
      <h4 className="text-sm font-medium text-white mb-2">Available Animations</h4>
      <div className="flex flex-wrap gap-2">
        {(matchedKeyword ? animationMap[matchedKeyword] : ['pulse', 'glow']).map((anim) => (
          <button
            key={anim}
            onClick={() => onTrigger(anim)}
            className="px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-400 text-xs hover:bg-cyan-500/30 transition-colors"
          >
            {anim}
          </button>
        ))}
      </div>
    </div>
  );
}

export default {
  InteractiveDiorama,
  ScrollDrivenScene,
  MicroAnimationTrigger,
  SizeComparisonStage,
};
