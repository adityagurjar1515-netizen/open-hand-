'use client';

import { Suspense, useRef, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Environment, OrbitControls, PerspectiveCamera, Float } from '@react-three/drei';
import { EffectComposer, Bloom, ChromaticAberration, Vignette } from '@react-three/postprocessing';
import * as THREE from 'three';
import { Earth } from './Earth';
import { Stars } from './Stars';
import { ParticleField, OrbitalParticles } from './ParticleField';
import { useUIStore } from '@/store';
import gsap from 'gsap';

function CameraController() {
  const { camera } = useThree();
  const scrollProgress = useUIStore((state) => state.scrollProgress);

  useFrame(() => {
    const targetZ = 15 - scrollProgress * 10;
    const targetY = scrollProgress * 2;

    camera.position.z = THREE.MathUtils.lerp(camera.position.z, targetZ, 0.05);
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, targetY, 0.05);
    camera.lookAt(0, 0, 0);
  });

  return null;
}

function Nebula() {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.z = state.clock.elapsedTime * 0.02;
    }
  });

  return (
    <Float speed={0.5} rotationIntensity={0.2} floatIntensity={0.5}>
      <mesh ref={meshRef} position={[-8, 3, -15]} scale={4}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshStandardMaterial
          color="#8b5cf6"
          emissive="#4c1d95"
          emissiveIntensity={0.3}
          transparent
          opacity={0.15}
        />
      </mesh>
    </Float>
  );
}

function DataStreams() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.05;
    }
  });

  return (
    <group ref={groupRef}>
      {[...Array(5)].map((_, i) => (
        <OrbitalParticles
          key={i}
          radius={2.5 + i * 0.3}
          count={50}
          size={0.02}
          color={i % 2 === 0 ? '#06b6d4' : '#8b5cf6'}
        />
      ))}
    </group>
  );
}

function FloatingPanels() {
  return (
    <>
      <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.8}>
        <mesh position={[4, 2, -2]}>
          <boxGeometry args={[1.5, 1, 0.1]} />
          <meshStandardMaterial
            color="#06b6d4"
            emissive="#06b6d4"
            emissiveIntensity={0.2}
            metalness={0.9}
            roughness={0.1}
          />
        </mesh>
      </Float>
      <Float speed={2} rotationIntensity={0.4} floatIntensity={0.6}>
        <mesh position={[-4, -1, -3]}>
          <boxGeometry args={[1, 0.8, 0.1]} />
          <meshStandardMaterial
            color="#8b5cf6"
            emissive="#8b5cf6"
            emissiveIntensity={0.2}
            metalness={0.9}
            roughness={0.1}
          />
        </mesh>
      </Float>
      <Float speed={1.8} rotationIntensity={0.2} floatIntensity={0.7}>
        <mesh position={[3, -2, -4]}>
          <boxGeometry args={[0.8, 1.2, 0.1]} />
          <meshStandardMaterial
            color="#22d3ee"
            emissive="#22d3ee"
            emissiveIntensity={0.15}
            metalness={0.9}
            roughness={0.1}
          />
        </mesh>
      </Float>
    </>
  );
}

function Lighting() {
  return (
    <>
      <ambientLight intensity={0.2} />
      <directionalLight position={[10, 10, 5]} intensity={1} color="#ffffff" />
      <pointLight position={[-10, -10, -5]} intensity={0.5} color="#8b5cf6" />
      <pointLight position={[5, 5, 10]} intensity={0.3} color="#06b6d4" />
    </>
  );
}

function Effects() {
  return (
    <EffectComposer>
      <Bloom
        luminanceThreshold={0.2}
        luminanceSmoothing={0.9}
        intensity={0.8}
        radius={0.8}
      />
      <ChromaticAberration
        offset={[0.0005, 0.0005]}
        radialModulation={false}
        modulationOffset={0}
      />
      <Vignette eskil={false} offset={0.1} darkness={0.5} />
    </EffectComposer>
  );
}

function SceneContent() {
  return (
    <>
      <CameraController />
      <Lighting />
      <Stars count={8000} radius={100} depth={50} factor={4} fade speed={1} />
      <Nebula />
      <Earth scale={1.2} rotationSpeed={0.1} />
      <ParticleField count={2000} size={0.015} spread={15} color="#06b6d4" speed={0.3} direction="up" />
      <DataStreams />
      <FloatingPanels />
      <Effects />
    </>
  );
}

interface Scene3DProps {
  className?: string;
}

export function Scene3D({ className }: Scene3DProps) {
  const webglSupported = useUIStore((state) => state.webglSupported);

  useEffect(() => {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    useUIStore.getState().setWebglSupported(!!gl);
  }, []);

  if (!webglSupported) {
    return (
      <div className={`w-full h-full bg-gradient-to-b from-slate-950 to-slate-900 flex items-center justify-center ${className || ''}`}>
        <div className="text-center p-8">
          <h2 className="text-2xl font-bold text-white mb-4">WebGL Not Supported</h2>
          <p className="text-slate-400">Please use a modern browser to view the 3D experience.</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`w-full h-full ${className || ''}`}>
      <Canvas
        shadows
        dpr={[1, 2]}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
        }}
        camera={{ position: [0, 0, 15], fov: 60 }}
      >
        <color attach="background" args={['#030712']} />
        <fog attach="fog" args={['#030712', 20, 50]} />
        <Suspense fallback={null}>
          <SceneContent />
        </Suspense>
      </Canvas>
    </div>
  );
}
