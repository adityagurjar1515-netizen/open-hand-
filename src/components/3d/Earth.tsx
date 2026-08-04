'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface EarthProps {
  position?: [number, number, number];
  scale?: number;
  rotationSpeed?: number;
}

export function Earth({ position = [0, 0, 0], scale = 1, rotationSpeed = 0.1 }: EarthProps) {
  const earthRef = useRef<THREE.Mesh>(null);
  const cloudsRef = useRef<THREE.Mesh>(null);
  const atmosphereRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (earthRef.current) {
      earthRef.current.rotation.y += rotationSpeed * 0.01;
    }
    if (cloudsRef.current) {
      cloudsRef.current.rotation.y += rotationSpeed * 0.015;
    }
  });

  const earthTexture = useMemo(() => {
    const loader = new THREE.TextureLoader();
    return loader.load('https://unpkg.com/three-globe@2.31.1/example/img/earth-blue-marble.jpg');
  }, []);

  const bumpTexture = useMemo(() => {
    const loader = new THREE.TextureLoader();
    return loader.load('https://unpkg.com/three-globe@2.31.1/example/img/earth-topology.png');
  }, []);

  const cloudTexture = useMemo(() => {
    const loader = new THREE.TextureLoader();
    return loader.load('https://unpkg.com/three-globe@2.31.1/example/img/earth-clouds.png');
  }, []);

  const atmosphereTexture = useMemo(() => {
    const loader = new THREE.TextureLoader();
    return loader.load('https://unpkg.com/three-globe@2.31.1/example/img/earth-atmosphere.png');
  }, []);

  return (
    <group position={position} scale={scale}>
      {/* Earth core */}
      <mesh ref={earthRef}>
        <sphereGeometry args={[1, 64, 64]} />
        <meshStandardMaterial
          map={earthTexture}
          bumpMap={bumpTexture}
          bumpScale={0.03}
          metalness={0.1}
          roughness={0.7}
        />
      </mesh>

      {/* Cloud layer */}
      <mesh ref={cloudsRef}>
        <sphereGeometry args={[1.01, 64, 64]} />
        <meshStandardMaterial
          map={cloudTexture}
          transparent
          opacity={0.4}
          depthWrite={false}
        />
      </mesh>

      {/* Atmosphere glow */}
      <mesh ref={atmosphereRef} scale={1.15}>
        <sphereGeometry args={[1, 64, 64]} />
        <shaderMaterial
          vertexShader={`
            varying vec3 vNormal;
            void main() {
              vNormal = normalize(normalMatrix * normal);
              gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
          `}
          fragmentShader={`
            varying vec3 vNormal;
            void main() {
              float intensity = pow(0.7 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.0);
              gl_FragColor = vec4(0.3, 0.6, 1.0, 1.0) * intensity;
            }
          `}
          blending={THREE.AdditiveBlending}
          side={THREE.BackSide}
          transparent
        />
      </mesh>
    </group>
  );
}
