'use client';

import { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Environment, Float, Sparkles, Stars, Html } from '@react-three/drei';
import * as THREE from 'three';

interface FactScene3DProps {
  category?: string;
  animationSpeed?: number;
}

// Animated Earth
function AnimatedEarth({ rotation }: { rotation: number }) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.002 * rotation;
    }
  });

  return (
    <group>
      {/* Earth */}
      <mesh ref={meshRef}>
        <sphereGeometry args={[3, 64, 64]} />
        <meshStandardMaterial color="#1e90ff" roughness={0.8} />
      </mesh>
      {/* Atmosphere */}
      <mesh scale={1.1}>
        <sphereGeometry args={[3, 64, 64]} />
        <meshStandardMaterial color="#87ceeb" transparent opacity={0.2} side={THREE.BackSide} />
      </mesh>
      {/* Clouds */}
      <mesh rotation={[0, rotation * 0.5, 0]}>
        <sphereGeometry args={[3.05, 64, 64]} />
        <meshStandardMaterial color="#ffffff" transparent opacity={0.3} />
      </mesh>
    </group>
  );
}

// Spinning Neutron Star
function NeutronStar({ spinSpeed = 1 }: { spinSpeed?: number }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const beamRef = useRef<THREE.Mesh>(null);

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.05 * spinSpeed;
      meshRef.current.rotation.x += 0.02 * spinSpeed;
    }
    if (beamRef.current) {
      beamRef.current.rotation.y += 0.03 * spinSpeed;
    }
  });

  return (
    <group>
      {/* Core */}
      <mesh ref={meshRef}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshStandardMaterial 
          color="#00ffff" 
          emissive="#00ffff" 
          emissiveIntensity={2 * spinSpeed}
        />
      </mesh>
      {/* Beam */}
      <mesh ref={beamRef} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.05, 0.05, 15, 8]} />
        <meshStandardMaterial 
          color="#ff00ff" 
          emissive="#ff00ff" 
          emissiveIntensity={1.5 * spinSpeed}
          transparent 
          opacity={0.7} 
        />
      </mesh>
      {/* Particles */}
      <Sparkles 
        count={500} 
        scale={15} 
        size={3} 
        speed={spinSpeed * 2} 
        color="#00ffff" 
      />
    </group>
  );
}

// Great Pyramid
function GreatPyramid({ progress = 1 }: { progress?: number }) {
  const layers = 8;
  const builtLayers = Math.floor(progress * layers);

  return (
    <group position={[0, -3, 0]}>
      {[...Array(layers)].map((_, i) => (
        <mesh
          key={i}
          position={[0, i * 1.5, 0]}
          scale={i < builtLayers ? 1 : i === builtLayers ? progress * layers - builtLayers : 0}
        >
          <boxGeometry args={[12 - i * 1.5, 1.5, 12 - i * 1.5]} />
          <meshStandardMaterial
            color={`hsl(40, 40%, ${60 - i * 5}%)`}
            roughness={0.9}
          />
        </mesh>
      ))}
    </group>
  );
}

// Blue Whale
function BlueWhale({ swimSpeed = 1 }: { swimSpeed?: number }) {
  const meshRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.position.x = Math.sin(state.clock.elapsedTime * 0.3 * swimSpeed) * 3;
      meshRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.2 * swimSpeed) * 0.5;
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.1 * swimSpeed) * 0.2;
    }
  });

  return (
    <group ref={meshRef} scale={0.5}>
      {/* Body */}
      <mesh>
        <capsuleGeometry args={[1.5, 8, 16, 32]} />
        <meshStandardMaterial color="#1e3a5f" roughness={0.7} />
      </mesh>
      {/* Tail */}
      <mesh position={[0, 0, -6]} rotation={[0, 0, Math.PI / 4]}>
        <coneGeometry args={[1.5, 3, 16]} />
        <meshStandardMaterial color="#1e3a5f" />
      </mesh>
      {/* Head */}
      <mesh position={[0, 0, 5]}>
        <sphereGeometry args={[2, 32, 32]} />
        <meshStandardMaterial color="#1e3a5f" />
      </mesh>
      {/* Bubbles */}
      <Sparkles count={50} scale={5} size={0.5} speed={swimSpeed} color="#87ceeb" />
    </group>
  );
}

// Giant Squid
function GiantSquid({ spinSpeed = 1 }: { spinSpeed?: number }) {
  const meshRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.01 * spinSpeed;
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.5) * 0.2;
      meshRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.5;
    }
  });

  return (
    <group ref={meshRef}>
      {/* Body */}
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[1.2, 32, 32]} />
        <meshStandardMaterial color="#8B0000" emissive="#400000" />
      </mesh>
      {/* Tentacles */}
      {[...Array(8)].map((_, i) => (
        <mesh
          key={i}
          position={[
            Math.cos((i / 8) * Math.PI * 2) * 0.6,
            -0.5,
            Math.sin((i / 8) * Math.PI * 2) * 0.6,
          ]}
          rotation={[Math.PI * 0.2, (i / 8) * Math.PI * 2, 0]}
        >
          <cylinderGeometry args={[0.08, 0.04, 2.5, 8]} />
          <meshStandardMaterial color="#660000" />
        </mesh>
      ))}
      {/* Eyes */}
      {[1, -1].map((x) => (
        <mesh key={x} position={[x * 1, 0.3, 1]}>
          <sphereGeometry args={[0.3, 16, 16]} />
          <meshStandardMaterial 
            color="#FFD700" 
            emissive="#FFA500" 
            emissiveIntensity={1.5} 
          />
        </mesh>
      ))}
    </group>
  );
}

// Camera Controller
function CameraController({ category }: { category: string }) {
  const { camera } = useThree();
  
  const positions: Record<string, [number, number, number]> = {
    space: [0, 2, 12],
    ocean: [0, 3, 15],
    history: [15, 10, 20],
    animals: [0, 2, 15],
    science: [0, 2, 10],
    technology: [0, 3, 12],
    default: [0, 2, 15],
  };

  useEffect(() => {
    const pos = positions[category] || positions.default;
    camera.position.set(...pos);
  }, [category, camera]);

  return (
    <OrbitControls 
      enableZoom 
      enablePan 
      enableRotate 
      autoRotate 
      autoRotateSpeed={0.5}
    />
  );
}

// Main Scene Component
export function FactScene3D({ category = 'space', animationSpeed = 1 }: FactScene3DProps) {
  const [factObjects, setFactObjects] = useState<{ type: string; position: [number, number, number] }[]>([]);

  // Generate scene based on category
  useEffect(() => {
    const objectsByCategory: Record<string, typeof factObjects> = {
      space: [
        { type: 'earth', position: [0, 0, 0] },
        { type: 'neutron', position: [-5, 2, -5] },
      ],
      ocean: [
        { type: 'whale', position: [0, 0, 0] },
        { type: 'squid', position: [-4, 1, -3] },
      ],
      history: [
        { type: 'pyramid', position: [0, 0, 0] },
      ],
      animals: [
        { type: 'whale', position: [0, 0, 0] },
        { type: 'squid', position: [-5, 1, -5] },
      ],
      science: [
        { type: 'neutron', position: [0, 0, 0] },
      ],
      default: [
        { type: 'earth', position: [0, 0, 0] },
      ],
    };

    setFactObjects(objectsByCategory[category] || objectsByCategory.default);
  }, [category]);

  return (
    <div className="w-full h-full min-h-[400px] rounded-2xl overflow-hidden">
      <Canvas camera={{ position: [0, 2, 15], fov: 60 }}>
        <color attach="background" args={['#0a0a1a']} />
        
        {/* Lighting */}
        <ambientLight intensity={0.3} />
        <pointLight position={[10, 10, 10]} intensity={1} color="#ffffff" />
        <pointLight position={[-10, -10, -10]} intensity={0.5} color="#4466ff" />
        <spotLight position={[0, 10, 0]} intensity={0.5} color="#00ffff" />
        
        {/* Stars Background */}
        <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
        
        {/* Scene Objects */}
        <Float speed={1} rotationIntensity={0.2} floatIntensity={0.3}>
          {factObjects.map((obj, i) => (
            <group key={i} position={obj.position}>
              {obj.type === 'earth' && <AnimatedEarth rotation={animationSpeed} />}
              {obj.type === 'neutron' && <NeutronStar spinSpeed={animationSpeed} />}
              {obj.type === 'pyramid' && <GreatPyramid progress={animationSpeed} />}
              {obj.type === 'whale' && <BlueWhale swimSpeed={animationSpeed} />}
              {obj.type === 'squid' && <GiantSquid spinSpeed={animationSpeed} />}
            </group>
          ))}
        </Float>
        
        {/* Floating Particles */}
        <Sparkles count={200} scale={30} size={1} speed={0.2} color="#00ffff" />
        
        {/* Environment */}
        <fog attach="fog" args={['#0a0a1a', 15, 60]} />
        
        {/* Camera Controls */}
        <CameraController category={category} />
      </Canvas>
    </div>
  );
}

export default FactScene3D;
