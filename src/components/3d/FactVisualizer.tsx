'use client';

import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Stars, Sparkles } from '@react-three/drei';
import * as THREE from 'three';
import type { Fact } from '@/types';

// Scene configs for each category
const SCENES: Record<string, { bg: string; light: string; fog: string }> = {
  space: { bg: '#000011', light: '#ffffff', fog: '#000022' },
  ocean: { bg: '#001133', light: '#00aaff', fog: '#001144' },
  history: { bg: '#1a1000', light: '#ffaa44', fog: '#221100' },
  science: { bg: '#0a0a1a', light: '#aa44ff', fog: '#110022' },
  technology: { bg: '#0a1a1a', light: '#00ffff', fog: '#002222' },
  animals: { bg: '#0a1f0a', light: '#44ff44', fog: '#0a1a0a' },
  'human-body': { bg: '#1a0a0a', light: '#ff4444', fog: '#220011' },
  earth: { bg: '#001a11', light: '#44ffaa', fog: '#001122' },
  mystery: { bg: '#0a0011', light: '#aa44ff', fog: '#110022' },
  engineering: { bg: '#1a1a00', light: '#ffff44', fog: '#222200' },
  psychology: { bg: '#110a1a', light: '#aa44ff', fog: '#110022' },
  inventions: { bg: '#1a0a1a', light: '#ff44ff', fog: '#220022' },
};

// 3D Components
function Sun() {
  const ref = useRef<THREE.Mesh>(null);
  useFrame(() => { if (ref.current) ref.current.rotation.y += 0.001; });
  return (
    <group>
      <mesh ref={ref}>
        <sphereGeometry args={[3, 64, 64]} />
        <meshStandardMaterial color="#ffaa00" emissive="#ff6600" emissiveIntensity={2} />
      </mesh>
      <pointLight color="#ffaa00" intensity={5} distance={50} />
    </group>
  );
}

function Planet({ r, c, orbit }: { r: number; c: string; orbit: number }) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    if (ref.current) {
      ref.current.position.x = Math.cos(clock.elapsedTime * orbit) * r;
      ref.current.position.z = Math.sin(clock.elapsedTime * orbit) * r;
      ref.current.rotation.y += 0.01;
    }
  });
  return <mesh ref={ref}><sphereGeometry args={[0.5, 32, 32]} /><meshStandardMaterial color={c} /></mesh>;
}

function SolarSystem() {
  return (
    <group>
      <Sun />
      <Planet r={6} c="#888" orbit={2} />
      <Planet r={10} c="#ff6644" orbit={1} />
      <Planet r={14} c="#4488ff" orbit={0.5} />
      <Planet r={18} c="#ddaa66" orbit={0.3} />
      <Sparkles count={500} scale={100} size={1} speed={0.1} color="#fff" />
    </group>
  );
}

function Whale() {
  const ref = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    if (ref.current) {
      ref.current.position.x = Math.sin(clock.elapsedTime * 0.3) * 5;
      ref.current.position.y = Math.sin(clock.elapsedTime * 0.2) * 0.5;
    }
  });
  return (
    <group ref={ref} scale={0.4}>
      <mesh rotation={[0, 0, Math.PI / 2]}><capsuleGeometry args={[1.5, 8, 16, 32]} /><meshStandardMaterial color="#1e3a5f" /></mesh>
      <mesh position={[0, 0, -5]} rotation={[0, 0, Math.PI / 4]}><coneGeometry args={[1.5, 3, 16]} /><meshStandardMaterial color="#1e3a5f" /></mesh>
    </group>
  );
}

function OceanScene() {
  return (
    <group>
      <Whale />
      <Whale />
      <Sparkles count={200} scale={20} size={0.5} speed={0.2} color="#00aaff" />
    </group>
  );
}

function Pyramid({ p = 1 }: { p?: number }) {
  const layers = 10;
  const built = Math.floor(p * layers);
  return (
    <group position={[0, -2, 0]}>
      {[...Array(layers)].map((_, i) => (
        <mesh key={i} position={[0, i - 4.5, 0]}>
          <boxGeometry args={[12 - i, 1, 12 - i]} />
          <meshStandardMaterial color={`hsl(40, ${30 + i * 2}%, ${55 - i * 2}%)`} />
        </mesh>
      ))}
    </group>
  );
}

function HistoryScene() {
  return (
    <group>
      <Pyramid p={1} />
      <Sparkles count={100} scale={20} size={0.5} speed={0.1} color="#ffaa44" />
    </group>
  );
}

function Atom() {
  const ref = useRef<THREE.Group>(null);
  useFrame(() => { if (ref.current) ref.current.rotation.y += 0.02; });
  return (
    <group>
      <mesh><sphereGeometry args={[0.5, 32, 32]} /><meshStandardMaterial color="#ff4444" emissive="#ff0000" emissiveIntensity={0.5} /></mesh>
      <group ref={ref}>
        {[0, 1, 2].map(i => (
          <mesh key={i} rotation={[i * Math.PI / 3, 0, i * Math.PI / 2]}>
            <torusGeometry args={[2, 0.05, 8, 32]} /><meshStandardMaterial color="#4444ff" />
          </mesh>
        ))}
      </group>
    </group>
  );
}

function ScienceScene() {
  return (
    <group>
      <Atom />
      <Atom position={[4, 0, 0]} />
      <Sparkles count={300} scale={20} size={1} speed={0.3} color="#aa44ff" />
    </group>
  );
}

function Heart() {
  const ref = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => { if (ref.current) ref.current.scale.setScalar(1 + Math.sin(clock.elapsedTime * 3) * 0.1); });
  return (
    <group>
      <mesh ref={ref}><sphereGeometry args={[1.5, 32, 32]} /><meshStandardMaterial color="#ff3333" emissive="#ff0000" emissiveIntensity={0.3} /></mesh>
      <pointLight color="#ff0000" intensity={2} distance={5} />
    </group>
  );
}

function Brain() {
  const ref = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => { if (ref.current) ref.current.rotation.y = Math.sin(clock.elapsedTime * 0.5) * 0.1; });
  return <mesh ref={ref}><sphereGeometry args={[1.5, 32, 32]} /><meshStandardMaterial color="#ffaaaa" roughness={0.8} /></mesh>;
}

function DNA() {
  const ref = useRef<THREE.Group>(null);
  useFrame(() => { if (ref.current) ref.current.rotation.y += 0.01; });
  return (
    <group ref={ref} scale={0.5}>
      {[...Array(15)].map((_, i) => (
        <group key={i}>
          <mesh position={[Math.sin(i * 0.5) * 1.5, i * 0.5 - 4, 0]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.1, 0.1, 3, 8]} /><meshStandardMaterial color="#44ff44" />
          </mesh>
          <mesh position={[Math.sin(i * 0.5) * -1.5, i * 0.5 - 4, 0]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.1, 0.1, 3, 8]} /><meshStandardMaterial color="#ff4444" />
          </mesh>
        </group>
      ))}
    </group>
  );
}

function HumanBodyScene() {
  return (
    <group>
      <Heart position={[0, 2, 0]} />
      <Brain position={[0, 0, 0]} />
      <DNA position={[0, -3, 0]} />
      <Sparkles count={100} scale={10} size={0.5} speed={0.5} color="#ff4444" />
    </group>
  );
}

function Globe() {
  const ref = useRef<THREE.Mesh>(null);
  useFrame(() => { if (ref.current) ref.current.rotation.y += 0.002; });
  return (
    <group>
      <mesh ref={ref}><sphereGeometry args={[3, 64, 64]} /><meshStandardMaterial color="#2266aa" /></mesh>
      <mesh scale={3.1}><sphereGeometry args={[3, 32, 32]} /><meshStandardMaterial color="#fff" transparent opacity={0.1} side={THREE.BackSide} /></mesh>
    </group>
  );
}

function EarthScene() {
  return (
    <group>
      <Globe />
      <Sparkles count={100} scale={15} size={0.3} speed={0.1} color="#88ccff" />
    </group>
  );
}

function Elephant() {
  const ref = useRef<THREE.Group>(null);
  useFrame(({ clock }) => { if (ref.current) ref.current.position.x = Math.sin(clock.elapsedTime * 0.2) * 0.5; });
  return (
    <group ref={ref} scale={0.3}>
      <mesh position={[0, 1, 0]}><sphereGeometry args={[1.5, 32, 32]} /><meshStandardMaterial color="#888" /></mesh>
      <mesh position={[0, 0.5, 2]}><sphereGeometry args={[1, 32, 32]} /><meshStandardMaterial color="#888" /></mesh>
    </group>
  );
}

function AnimalsScene() {
  return (
    <group>
      <Elephant />
      <Elephant position={[5, 0, 3]} />
      <Sparkles count={100} scale={15} size={0.3} speed={0.2} color="#44ff44" />
    </group>
  );
}

function Portal() {
  const ref = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => { if (ref.current) { ref.current.rotation.z += 0.02; ref.current.scale.setScalar(1 + Math.sin(clock.elapsedTime * 2) * 0.1); } });
  return (
    <group>
      <mesh ref={ref} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[2, 0.3, 16, 32]} />
        <meshStandardMaterial color="#aa44ff" emissive="#ff44ff" emissiveIntensity={1} />
      </mesh>
      <pointLight color="#ff44ff" intensity={5} distance={10} />
    </group>
  );
}

function MysteryScene() {
  return (
    <group>
      <Portal />
      <Sparkles count={500} scale={20} size={2} speed={0.5} color="#aa44ff" />
    </group>
  );
}

function Gear() {
  const ref = useRef<THREE.Group>(null);
  useFrame(() => { if (ref.current) ref.current.rotation.z += 0.02; });
  return (
    <group ref={ref}>
      <mesh><torusGeometry args={[1, 0.2, 8, 16]} /><meshStandardMaterial color="#ffaa00" /></mesh>
      {[...Array(8)].map((_, i) => (
        <mesh key={i} position={[Math.cos(i * Math.PI / 4) * 1.2, Math.sin(i * Math.PI / 4) * 1.2, 0]}>
          <boxGeometry args={[0.3, 0.6, 0.2]} /><meshStandardMaterial color="#ffaa00" />
        </mesh>
      ))}
    </group>
  );
}

function EngineeringScene() {
  return (
    <group>
      <Gear position={[0, 2, 0]} />
      <Gear position={[3, 0, 0]} />
      <Sparkles count={100} scale={15} size={0.5} speed={0.3} color="#ffff44" />
    </group>
  );
}

function Lightbulb() {
  const ref = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => { if (ref.current) ref.current.material.emissiveIntensity = 0.5 + Math.sin(clock.elapsedTime * 3) * 0.5; });
  return (
    <group>
      <mesh position={[0, 0.5, 0]} ref={ref}>
        <sphereGeometry args={[0.8, 32, 32]} />
        <meshStandardMaterial color="#ffff88" emissive="#ffff00" emissiveIntensity={0.5} transparent opacity={0.8} />
      </mesh>
      <mesh position={[0, -0.5, 0]}><cylinderGeometry args={[0.3, 0.3, 0.8, 16]} /><meshStandardMaterial color="#888" /></mesh>
      <pointLight color="#ffff00" intensity={3} distance={8} />
    </group>
  );
}

function Rocket() {
  const ref = useRef<THREE.Group>(null);
  useFrame(({ clock }) => { if (ref.current) ref.current.position.y = Math.sin(clock.elapsedTime * 0.5) * 0.5; });
  return (
    <group ref={ref} rotation={[Math.PI / 6, 0, 0]}>
      <mesh><coneGeometry args={[0.8, 3, 16]} /><meshStandardMaterial color="#fff" /></mesh>
      <mesh position={[0, -1, 0]}><cylinderGeometry args={[0.6, 0.8, 1, 16]} /><meshStandardMaterial color="#f44" /></mesh>
      <Sparkles count={50} scale={3} size={0.5} speed={1} color="#ff6644" />
    </group>
  );
}

function InventionsScene() {
  return (
    <group>
      <Lightbulb position={[0, 3, 0]} />
      <Rocket position={[0, -1, 0]} />
      <Sparkles count={200} scale={20} size={1} speed={0.5} color="#ffff00" />
    </group>
  );
}

function Neuron() {
  const ref = useRef<THREE.Group>(null);
  useFrame(({ clock }) => { if (ref.current) ref.current.position.y = Math.sin(clock.elapsedTime * 0.5) * 0.5; });
  return (
    <group ref={ref}>
      <mesh><sphereGeometry args={[0.5, 16, 16]} /><meshStandardMaterial color="#f8f" emissive="#f4f" emissiveIntensity={0.5} /></mesh>
      {[...Array(5)].map((_, i) => (
        <mesh key={i} position={[Math.cos(i) * 1.5, Math.sin(i) * 1.5, 0]} rotation={[0, 0, i]}>
          <cylinderGeometry args={[0.05, 0.05, 1.5, 8]} /><meshStandardMaterial color="#f4f" transparent opacity={0.5} />
        </mesh>
      ))}
    </group>
  );
}

function PsychologyScene() {
  return (
    <group>
      <Neuron position={[0, 2, 0]} />
      <Neuron position={[-3, 0, 0]} />
      <Neuron position={[3, 0, 0]} />
      <Sparkles count={200} scale={15} size={1} speed={0.5} color="#f4f" />
    </group>
  );
}

function Circuit() {
  return (
    <group>
      <mesh><boxGeometry args={[6, 4, 0.2]} /><meshStandardMaterial color="#030" /></mesh>
      {[...Array(20)].map((_, i) => (
        <mesh key={i} position={[(i % 5) - 2, Math.floor(i / 5) - 0.5, 0.15]}>
          <boxGeometry args={[0.3, 0.1, 0.1]} /><meshStandardMaterial color="#0f0" emissive="#0f0" emissiveIntensity={0.5} />
        </mesh>
      ))}
    </group>
  );
}

function TechScene() {
  return (
    <group>
      <Circuit />
      <Sparkles count={200} scale={15} size={0.5} speed={0.5} color="#0ff" />
    </group>
  );
}

function getScene(category: string) {
  const cat = category?.toLowerCase().replace(/\s+/g, '-') || 'space';
  switch (cat) {
    case 'space': return <SolarSystem />;
    case 'ocean': return <OceanScene />;
    case 'history': return <HistoryScene />;
    case 'science': return <ScienceScene />;
    case 'technology': return <TechScene />;
    case 'animals': return <AnimalsScene />;
    case 'human-body': return <HumanBodyScene />;
    case 'earth': return <EarthScene />;
    case 'mystery': return <MysteryScene />;
    case 'engineering': return <EngineeringScene />;
    case 'psychology': return <PsychologyScene />;
    case 'inventions': return <InventionsScene />;
    default: return <SolarSystem />;
  }
}

interface Props {
  fact?: Fact;
  category?: string;
  className?: string;
  height?: string;
}

export function FactVisualizer({ fact, category, className = '', height = '400px' }: Props) {
  const cat = category || fact?.category || 'space';
  const cfg = SCENES[cat.toLowerCase()] || SCENES.space;
  
  return (
    <div className={`rounded-2xl overflow-hidden ${className}`} style={{ height }}>
      <Canvas camera={{ position: [0, 0, 15], fov: 60 }}>
        <color attach="background" args={[cfg.bg]} />
        <ambientLight intensity={0.3} />
        <pointLight position={[10, 10, 10]} intensity={1} color={cfg.light} />
        <pointLight position={[-10, -10, -10]} intensity={0.5} color={cfg.light} />
        <fog attach="fog" args={[cfg.fog, 10, 50]} />
        <Stars radius={100} depth={50} count={3000} factor={4} saturation={0} fade speed={1} />
        {getScene(cat)}
        <OrbitControls enableZoom enablePan enableRotate autoRotate autoRotateSpeed={0.5} />
      </Canvas>
    </div>
  );
}

export default FactVisualizer;
