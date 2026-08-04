'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface ParticleFieldProps {
  count?: number;
  size?: number;
  spread?: number;
  color?: string;
  speed?: number;
  direction?: 'up' | 'down' | 'random';
}

export function ParticleField({
  count = 1000,
  size = 0.02,
  spread = 10,
  color = '#06b6d4',
  speed = 0.5,
  direction = 'up',
}: ParticleFieldProps) {
  const mesh = useRef<THREE.Points>(null);
  const initialPositions = useRef<Float32Array | null>(null);

  const [positions, velocities] = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const velocities = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      positions[i3] = (Math.random() - 0.5) * spread;
      positions[i3 + 1] = (Math.random() - 0.5) * spread;
      positions[i3 + 2] = (Math.random() - 0.5) * spread;
      velocities[i] = 0.5 + Math.random() * speed;
    }

    initialPositions.current = positions.slice();
    return [positions, velocities];
  }, [count, spread, speed]);

  useFrame((state) => {
    if (!mesh.current || !initialPositions.current) return;

    const positionAttribute = mesh.current.geometry.attributes.position;
    const time = state.clock.elapsedTime;

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      let y = initialPositions.current[i3 + 1];

      if (direction === 'up') {
        y += (time * velocities[i]) % spread;
        if (y > spread / 2) y = -spread / 2;
      } else if (direction === 'down') {
        y -= (time * velocities[i]) % spread;
        if (y < -spread / 2) y = spread / 2;
      } else {
        y += Math.sin(time * velocities[i]) * 0.5;
      }

      positionAttribute.array[i3 + 1] = y;
    }

    positionAttribute.needsUpdate = true;
  });

  return (
    <points ref={mesh}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={size}
        color={color}
        transparent
        opacity={0.6}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

interface OrbitalParticlesProps {
  radius?: number;
  count?: number;
  size?: number;
  color?: string;
}

export function OrbitalParticles({
  radius = 3,
  count = 100,
  size = 0.03,
  color = '#8b5cf6',
}: OrbitalParticlesProps) {
  const mesh = useRef<THREE.Points>(null);

  const positions = useMemo(() => {
    const positions = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      const r = radius + (Math.random() - 0.5) * 0.5;
      positions[i * 3] = Math.cos(angle) * r;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 0.3;
      positions[i * 3 + 2] = Math.sin(angle) * r;
    }

    return positions;
  }, [count, radius]);

  useFrame((state) => {
    if (mesh.current) {
      mesh.current.rotation.y = state.clock.elapsedTime * 0.1;
    }
  });

  return (
    <points ref={mesh}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={size}
        color={color}
        transparent
        opacity={0.8}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}
