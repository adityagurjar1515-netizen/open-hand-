'use client';

import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Stars, Sparkles } from '@react-three/drei';
import * as THREE from 'three';

function getFactAnimation(factTitle: string, factExplanation: string) {
  const text = (factTitle + ' ' + factExplanation).toLowerCase();
  if (text.includes('neutron') || text.includes('pulsar')) return { type: 'neutron-star', speed: 10 };
  if (text.includes('black hole')) return { type: 'black-hole', speed: 1 };
  if (text.includes('dna') || text.includes('genetic')) return { type: 'dna', speed: 1 };
  if (text.includes('heart') || text.includes('blood')) return { type: 'heart', speed: 3 };
  if (text.includes('brain') || text.includes('neuron')) return { type: 'brain', speed: 1 };
  if (text.includes('pyramid') || text.includes('giza')) return { type: 'pyramid', speed: 1 };
  if (text.includes('atom') || text.includes('quantum')) return { type: 'atom', speed: 2 };
  if (text.includes('rocket') || text.includes('launch')) return { type: 'rocket', speed: 3 };
  if (text.includes('lightning') || text.includes('electric')) return { type: 'lightning', speed: 5 };
  if (text.includes('volcano') || text.includes('lava')) return { type: 'volcano', speed: 2 };
  if (text.includes('galaxy') || text.includes('milky way')) return { type: 'galaxy', speed: 0.3 };
  if (text.includes('dinosaur') || text.includes('trex')) return { type: 'dinosaur', speed: 0.5 };
  if (text.includes('elephant')) return { type: 'elephant', speed: 0.5 };
  if (text.includes('coral') || text.includes('reef')) return { type: 'coral', speed: 0.3 };
  if (text.includes('glacier') || text.includes('iceberg')) return { type: 'glacier', speed: 0.5 };
  if (text.includes('planet') || text.includes('solar system')) return { type: 'solar-system', speed: 1 };
  return { type: 'default', speed: 1 };
}

function NeutronStar({ speed }: { speed: number }) {
  const core = useRef<THREE.Mesh>(null);
  const beam = useRef<THREE.Mesh>(null);
  useFrame(() => {
    if (core.current) core.current.rotation.y += 0.05 * speed;
    if (beam.current) beam.current.rotation.y += 0.08 * speed;
  });
  return (
    <group>
      <mesh ref={core}><sphereGeometry args={[1, 32, 32]} /><meshStandardMaterial color="#00ffff" emissive="#00ffff" emissiveIntensity={3} /></mesh>
      <mesh ref={beam} rotation={[Math.PI / 2, 0, 0]}><cylinderGeometry args={[0.05, 0.05, 15, 8]} /><meshStandardMaterial color="#ff00ff" emissive="#ff00ff" emissiveIntensity={2} transparent opacity={0.8} /></mesh>
      <mesh rotation={[0, 0, Math.PI / 2]}><cylinderGeometry args={[0.05, 0.05, 15, 8]} /><meshStandardMaterial color="#ff00ff" emissive="#ff00ff" emissiveIntensity={2} transparent opacity={0.8} /></mesh>
      <Sparkles count={500} scale={15} size={3} speed={speed} color="#00ffff" />
      <pointLight color="#00ffff" intensity={5} distance={15} />
    </group>
  );
}

function BlackHole({ speed }: { speed: number }) {
  const disc = useRef<THREE.Mesh>(null);
  useFrame(() => { if (disc.current) disc.current.rotation.z += 0.01 * speed; });
  return (
    <group>
      <mesh><sphereGeometry args={[2, 32, 32]} /><meshStandardMaterial color="#000000" /></mesh>
      <mesh ref={disc} rotation={[Math.PI / 4, 0, 0]}><torusGeometry args={[4, 0.5, 16, 64]} /><meshStandardMaterial color="#ff6600" emissive="#ff3300" emissiveIntensity={2} /></mesh>
      <Sparkles count={200} scale={20} size={2} speed={speed * 0.5} color="#ff6600" />
    </group>
  );
}

function DNAHelix({ speed }: { speed: number }) {
  const group = useRef<THREE.Group>(null);
  useFrame(() => { if (group.current) group.current.rotation.y += 0.01 * speed; });
  return (
    <group ref={group}>
      {[...Array(20)].map((_, i) => (
        <group key={i}>
          <mesh position={[Math.sin(i * 0.5) * 2, i * 0.5 - 5, 0]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.1, 0.1, 3, 8]} /><meshStandardMaterial color="#44ff44" emissive="#00ff00" emissiveIntensity={0.5} />
          </mesh>
          <mesh position={[Math.sin(i * 0.5) * -2, i * 0.5 - 5, 0]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.1, 0.1, 3, 8]} /><meshStandardMaterial color="#ff4444" emissive="#ff0000" emissiveIntensity={0.5} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

function BeatingHeart({ speed }: { speed: number }) {
  const heart = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => { if (heart.current) heart.current.scale.setScalar(1 + Math.sin(clock.elapsedTime * speed * 3) * 0.2); });
  return (
    <group>
      <mesh ref={heart}><sphereGeometry args={[2, 32, 32]} /><meshStandardMaterial color="#ff2222" emissive="#ff0000" emissiveIntensity={1} /></mesh>
      <pointLight color="#ff0000" intensity={5} distance={10} />
      <Sparkles count={100} scale={10} size={1} speed={speed} color="#ff4444" />
    </group>
  );
}

function ThinkingBrain({ speed }: { speed: number }) {
  const brain = useRef<THREE.Group>(null);
  useFrame(({ clock }) => { if (brain.current) { brain.current.rotation.y = Math.sin(clock.elapsedTime * speed) * 0.3; brain.current.scale.setScalar(1 + Math.sin(clock.elapsedTime * speed * 2) * 0.05); } });
  return (
    <group ref={brain}>
      <mesh><sphereGeometry args={[2, 32, 32]} /><meshStandardMaterial color="#ffaaaa" roughness={0.8} /></mesh>
      {[...Array(30)].map((_, i) => (
        <mesh key={i} position={[Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5]}>
          <sphereGeometry args={[0.15, 8, 8]} /><meshStandardMaterial color="#ff8888" emissive="#ff4444" emissiveIntensity={Math.random()} />
        </mesh>
      ))}
      <Sparkles count={100} scale={10} size={1} speed={speed} color="#ff44ff" />
    </group>
  );
}

function BuildingPyramid({ speed }: { speed: number }) {
  return (
    <group position={[0, -3, 0]}>
      {[...Array(10)].map((_, i) => (
        <mesh key={i} position={[0, i - 4.5, 0]}>
          <boxGeometry args={[14 - i, 1, 14 - i]} />
          <meshStandardMaterial color={`hsl(40, ${30 + i * 3}%, ${60 - i * 2}%)`} />
        </mesh>
      ))}
    </group>
  );
}

function OrbitingAtom({ speed }: { speed: number }) {
  const electrons = useRef<THREE.Group>(null);
  useFrame(() => { if (electrons.current) electrons.current.rotation.y += 0.02 * speed; });
  return (
    <group>
      <mesh><sphereGeometry args={[0.5, 32, 32]} /><meshStandardMaterial color="#ff4444" emissive="#ff0000" emissiveIntensity={1} /></mesh>
      <group ref={electrons}>
        {[0, 1, 2].map(i => (
          <group key={i} rotation={[i * Math.PI / 3, 0, i * Math.PI / 2]}>
            <mesh><torusGeometry args={[2, 0.05, 8, 32]} /><meshStandardMaterial color="#4444ff" /></mesh>
            {[0, 1, 2].map(j => (
              <mesh key={j} position={[Math.cos(j * 2) * 2, Math.sin(j * 2) * 2, 0]}>
                <sphereGeometry args={[0.15, 16, 16]} /><meshStandardMaterial color="#44ff44" emissive="#00ff00" emissiveIntensity={1} />
              </mesh>
            ))}
          </group>
        ))}
      </group>
      <Sparkles count={50} scale={5} size={0.5} speed={speed} color="#4444ff" />
    </group>
  );
}

function LaunchingRocket({ speed }: { speed: number }) {
  const rocket = useRef<THREE.Group>(null);
  const flame = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    if (rocket.current) { rocket.current.position.y = Math.sin(clock.elapsedTime * speed * 0.5) * 2; rocket.current.rotation.z = Math.sin(clock.elapsedTime * speed) * 0.1; }
    if (flame.current) flame.current.scale.y = 1 + Math.sin(clock.elapsedTime * 10) * 0.3;
  });
  return (
    <group ref={rocket}>
      <mesh position={[0, 0, 0]}><coneGeometry args={[0.8, 3, 16]} /><meshStandardMaterial color="#ffffff" /></mesh>
      <mesh position={[0, -1.5, 0]}><cylinderGeometry args={[0.6, 0.8, 1, 16]} /><meshStandardMaterial color="#ff4444" /></mesh>
      <mesh position={[0, -2.5, 0]} ref={flame}><coneGeometry args={[0.5, 2, 16]} /><meshStandardMaterial color="#ffaa00" emissive="#ff6600" emissiveIntensity={2} /></mesh>
      <pointLight color="#ff6600" intensity={5} distance={8} />
      <Sparkles count={100} scale={5} size={1} speed={speed} color="#ff6600" />
    </group>
  );
}

function Lightning({ speed }: { speed: number }) {
  const bolt = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => { if (bolt.current) bolt.current.visible = Math.sin(clock.elapsedTime * speed * 10) > 0; });
  return (
    <group>
      <mesh ref={bolt} visible={false}><cylinderGeometry args={[0.1, 0.2, 5, 8]} /><meshStandardMaterial color="#ffff00" emissive="#ffff00" emissiveIntensity={3} /></mesh>
      <Sparkles count={200} scale={15} size={2} speed={speed} color="#ffff00" />
      <pointLight color="#ffff00" intensity={10} distance={15} />
    </group>
  );
}

function EruptingVolcano({ speed }: { speed: number }) {
  const lava = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => { if (lava.current) { lava.current.position.y = 3 + Math.sin(clock.elapsedTime * speed * 3) * 0.5; lava.current.scale.setScalar(0.5 + Math.sin(clock.elapsedTime * speed * 5) * 0.2); } });
  return (
    <group>
      <mesh position={[0, -1, 0]}><coneGeometry args={[3, 4, 16]} /><meshStandardMaterial color="#444444" /></mesh>
      <mesh ref={lava} position={[0, 3, 0]}><sphereGeometry args={[0.8, 16, 16]} /><meshStandardMaterial color="#ff4400" emissive="#ff0000" emissiveIntensity={2} /></mesh>
      <Sparkles count={300} scale={10} size={2} speed={speed} color="#ff4400" />
      <pointLight color="#ff4400" intensity={5} distance={10} />
    </group>
  );
}

function SpinningGalaxy({ speed }: { speed: number }) {
  const galaxy = useRef<THREE.Group>(null);
  useFrame(() => { if (galaxy.current) galaxy.current.rotation.z += 0.001 * speed; });
  return (
    <group ref={galaxy}>
      {[...Array(50)].map((_, i) => {
        const angle = (i / 50) * Math.PI * 10;
        const radius = 1 + (i / 50) * 5;
        return (
          <mesh key={i} position={[Math.cos(angle) * radius, Math.sin(angle) * radius * 0.3, 0]}>
            <sphereGeometry args={[0.1 + Math.random() * 0.1, 8, 8]} />
            <meshStandardMaterial color={i % 3 === 0 ? '#ffaaaa' : i % 3 === 1 ? '#aaaaff' : '#ffffaa'} emissive={i % 3 === 0 ? '#ff0000' : i % 3 === 1 ? '#0000ff' : '#ffff00'} emissiveIntensity={0.5} />
          </mesh>
        );
      })}
    </group>
  );
}

function WalkingDinosaur({ speed }: { speed: number }) {
  const dino = useRef<THREE.Group>(null);
  useFrame(({ clock }) => { if (dino.current) { dino.current.position.x = Math.sin(clock.elapsedTime * speed * 0.3) * 3; dino.current.rotation.y = Math.sin(clock.elapsedTime * speed * 0.3) > 0 ? 0 : Math.PI; } });
  return (
    <group ref={dino} scale={0.3}>
      <mesh position={[0, 2, 0]}><boxGeometry args={[2, 1.5, 1]} /><meshStandardMaterial color="#44aa44" /></mesh>
      <mesh position={[1.5, 2, 0]}><boxGeometry args={[2, 1, 1]} /><meshStandardMaterial color="#44aa44" /></mesh>
      <mesh position={[3, 3, 0]}><coneGeometry args={[0.5, 1, 8]} /><meshStandardMaterial color="#44aa44" /></mesh>
      <mesh position={[-0.5, 0.5, 0]}><boxGeometry args={[0.5, 1.5, 0.5]} /><meshStandardMaterial color="#44aa44" /></mesh>
      <mesh position={[0.5, 0.5, 0]}><boxGeometry args={[0.5, 1.5, 0.5]} /><meshStandardMaterial color="#44aa44" /></mesh>
    </group>
  );
}

function GiantElephant({ speed }: { speed: number }) {
  const elephant = useRef<THREE.Group>(null);
  useFrame(({ clock }) => { if (elephant.current) { elephant.current.position.x = Math.sin(clock.elapsedTime * speed * 0.2) * 0.5; elephant.current.scale.setScalar(1 + Math.sin(clock.elapsedTime * speed * 0.5) * 0.05); } });
  return (
    <group ref={elephant} scale={0.5}>
      <mesh position={[0, 1.5, 0]}><sphereGeometry args={[2, 32, 32]} /><meshStandardMaterial color="#888888" /></mesh>
      <mesh position={[0, 0.5, 2.5]}><sphereGeometry args={[1.2, 32, 32]} /><meshStandardMaterial color="#888888" /></mesh>
      <mesh position={[0, -0.5, 4]} rotation={[0.3, 0, 0]}><cylinderGeometry args={[0.4, 0.5, 3, 16]} /><meshStandardMaterial color="#888888" /></mesh>
      <mesh position={[-2, 2, 0]} rotation={[0, 0, -0.2]}><cylinderGeometry args={[0.3, 0.4, 3, 16]} /><meshStandardMaterial color="#888888" /></mesh>
      <mesh position={[2, 2, 0]} rotation={[0, 0, 0.2]}><cylinderGeometry args={[0.3, 0.4, 3, 16]} /><meshStandardMaterial color="#888888" /></mesh>
    </group>
  );
}

function GrowingCoral({ speed }: { speed: number }) {
  const coral = useRef<THREE.Group>(null);
  useFrame(({ clock }) => { if (coral.current) coral.current.scale.setScalar(0.5 + Math.sin(clock.elapsedTime * speed * 0.3) * 0.2); });
  return (
    <group ref={coral}>
      {[...Array(12)].map((_, i) => (
        <mesh key={i} position={[Math.cos(i * 0.5) * 1.5, Math.random() * 2 - 1, Math.sin(i * 0.5) * 1.5]} rotation={[Math.random() * 0.5, Math.random() * Math.PI, Math.random() * 0.5]}>
          <coneGeometry args={[0.3, 2 + Math.random(), 8]} /><meshStandardMaterial color={i % 2 === 0 ? '#ff6666' : '#ff9966'} />
        </mesh>
      ))}
      <Sparkles count={50} scale={5} size={0.3} speed={speed} color="#00aaff" />
    </group>
  );
}

function MeltingGlacier({ speed }: { speed: number }) {
  const ice = useRef<THREE.Group>(null);
  useFrame(() => { if (ice.current) ice.current.rotation.y += 0.002 * speed; });
  return (
    <group ref={ice}>
      <mesh position={[0, 0, 0]}><dodecahedronGeometry args={[2, 0]} /><meshStandardMaterial color="#aaddff" emissive="#88ccff" emissiveIntensity={0.3} /></mesh>
      <mesh position={[2, -1, 0]}><dodecahedronGeometry args={[1, 0]} /><meshStandardMaterial color="#88bbdd" emissive="#66aaee" emissiveIntensity={0.3} /></mesh>
      <Sparkles count={100} scale={10} size={0.5} speed={speed} color="#ffffff" />
    </group>
  );
}

function SolarSystemScene({ speed }: { speed: number }) {
  const sun = useRef<THREE.Mesh>(null);
  useFrame(() => { if (sun.current) sun.current.rotation.y += 0.001 * speed; });
  return (
    <group>
      <mesh ref={sun}><sphereGeometry args={[3, 64, 64]} /><meshStandardMaterial color="#ffaa00" emissive="#ff6600" emissiveIntensity={2} /></mesh>
      <pointLight color="#ffaa00" intensity={5} distance={50} />
      {[6, 10, 14, 18].map((r, i) => (
        <mesh key={i} position={[r, 0, 0]}><sphereGeometry args={[0.5, 32, 32]} /><meshStandardMaterial color={['#888', '#ff6644', '#4488ff', '#ddaa66'][i]} /></mesh>
      ))}
      <Sparkles count={500} scale={80} size={1} speed={0.1} color="#ffffff" />
    </group>
  );
}

function DefaultScene({ speed }: { speed: number }) {
  return <SolarSystemScene speed={speed} />;
}

interface Props {
  factTitle?: string;
  factExplanation?: string;
  category?: string;
  className?: string;
  height?: string;
}

export function PerFactVisualizer({ factTitle = '', factExplanation = '', category = 'space', className = '', height = '400px' }: Props) {
  const animation = getFactAnimation(factTitle, factExplanation);
  
  const renderAnimation = () => {
    switch (animation.type) {
      case 'neutron-star': return <NeutronStar speed={animation.speed} />;
      case 'black-hole': return <BlackHole speed={animation.speed} />;
      case 'dna': return <DNAHelix speed={animation.speed} />;
      case 'heart': return <BeatingHeart speed={animation.speed} />;
      case 'brain': return <ThinkingBrain speed={animation.speed} />;
      case 'pyramid': return <BuildingPyramid speed={animation.speed} />;
      case 'atom': return <OrbitingAtom speed={animation.speed} />;
      case 'rocket': return <LaunchingRocket speed={animation.speed} />;
      case 'lightning': return <Lightning speed={animation.speed} />;
      case 'volcano': return <EruptingVolcano speed={animation.speed} />;
      case 'galaxy': return <SpinningGalaxy speed={animation.speed} />;
      case 'dinosaur': return <WalkingDinosaur speed={animation.speed} />;
      case 'elephant': return <GiantElephant speed={animation.speed} />;
      case 'coral': return <GrowingCoral speed={animation.speed} />;
      case 'glacier': return <MeltingGlacier speed={animation.speed} />;
      case 'solar-system': return <SolarSystemScene speed={animation.speed} />;
      default: return <DefaultScene speed={animation.speed} />;
    }
  };
  
  const colors: Record<string, string[]> = {
    'neutron-star': ['#000011', '#00ffff'], 'black-hole': ['#000000', '#ff6600'], 'dna': ['#0a0a1a', '#44ff44'],
    'heart': ['#1a0a0a', '#ff4444'], 'brain': ['#1a0a0a', '#ff44ff'], 'pyramid': ['#1a1000', '#ffaa44'],
    'atom': ['#0a0a1a', '#4444ff'], 'rocket': ['#0a1a1a', '#ffffff'], 'lightning': ['#1a1a00', '#ffff00'],
    'volcano': ['#1a0a0a', '#ff4400'], 'galaxy': ['#000011', '#ffaaaa'], 'dinosaur': ['#0a1f0a', '#44aa44'],
    'elephant': ['#0a1f0a', '#888888'], 'coral': ['#001133', '#ff6666'], 'glacier': ['#001a33', '#aaddff'],
    default: ['#0a0a1a', '#aa44ff'],
  };
  
  const [bg, light] = colors[animation.type] || colors.default;
  
  return (
    <div className={`rounded-2xl overflow-hidden ${className}`} style={{ height }}>
      <Canvas camera={{ position: [0, 0, 15], fov: 60 }}>
        <color attach="background" args={[bg]} />
        <ambientLight intensity={0.3} />
        <pointLight position={[10, 10, 10]} intensity={1} color={light} />
        <pointLight position={[-10, -10, -10]} intensity={0.5} color={light} />
        <fog attach="fog" args={[bg, 10, 40]} />
        <Stars radius={80} depth={50} count={2000} factor={4} saturation={0} fade speed={0.5} />
        {renderAnimation()}
        <OrbitControls enableZoom enablePan enableRotate autoRotate autoRotateSpeed={0.5} />
      </Canvas>
    </div>
  );
}

export default PerFactVisualizer;
