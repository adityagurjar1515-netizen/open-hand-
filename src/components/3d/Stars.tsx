'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface StarsProps {
  count?: number;
  radius?: number;
  depth?: number;
  factor?: number;
  saturation?: number;
  fade?: boolean;
  speed?: number;
}

export function Stars({
  count = 5000,
  radius = 100,
  depth = 50,
  factor = 4,
  saturation = 0,
  fade = true,
  speed = 1,
}: StarsProps) {
  const mesh = useRef<THREE.Points>(null);

  const [positions, colors, sizes] = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const sizes = new Float32Array(count);

    const color = new THREE.Color();
    const hollowColor = new THREE.Color();

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      const r = radius + Math.random() * radius * 2;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const depthVariation = Math.random() * depth;

      positions[i3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i3 + 2] = r * Math.cos(phi) + depthVariation;

      const colorChoice = Math.random();
      if (colorChoice < 0.7) {
        color.setHSL(0.6, saturation, 0.9 + Math.random() * 0.1);
      } else if (colorChoice < 0.85) {
        color.setHSL(0.1, saturation, 0.8 + Math.random() * 0.2);
      } else {
        color.setHSL(0.3, saturation, 0.7 + Math.random() * 0.3);
      }

      colors[i3] = color.r;
      colors[i3 + 1] = color.g;
      colors[i3 + 2] = color.b;

      sizes[i] = Math.random() * factor + 0.5;
    }

    return [positions, colors, sizes];
  }, [count, radius, depth, factor, saturation]);

  useFrame((state) => {
    if (mesh.current) {
      mesh.current.rotation.y += speed * 0.0001;
      mesh.current.rotation.x += speed * 0.00005;
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
        <bufferAttribute
          attach="attributes-color"
          count={count}
          array={colors}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-size"
          count={count}
          array={sizes}
          itemSize={1}
        />
      </bufferGeometry>
      <shaderMaterial
        vertexShader={`
          attribute float size;
          attribute vec3 color;
          varying vec3 vColor;
          varying float vAlpha;
          uniform float uTime;
          
          void main() {
            vColor = color;
            vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
            gl_PointSize = size * (300.0 / -mvPosition.z);
            gl_Position = projectionMatrix * mvPosition;
            
            vAlpha = 1.0;
            if (size > 2.0) {
              vAlpha = 0.5 + 0.5 * sin(uTime * 2.0 + position.x);
            }
          }
        `}
        fragmentShader={`
          varying vec3 vColor;
          varying float vAlpha;
          
          void main() {
            float d = length(gl_PointCoord - vec2(0.5));
            if (d > 0.5) discard;
            
            float alpha = smoothstep(0.5, 0.0, d);
            gl_FragColor = vec4(vColor, alpha * vAlpha);
          }
        `}
        transparent
        depthWrite={false}
        vertexColors
      />
    </points>
  );
}
