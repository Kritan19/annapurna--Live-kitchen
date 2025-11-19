
import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Points, PointMaterial } from '@react-three/drei';

const Steam = ({ position = [0, 0, 0], intensity = 1 }: { position?: [number, number, number], intensity?: number }) => {
  const count = 100 * intensity;
  const ref = useRef<THREE.Points>(null);
  
  const [positions, speeds, opacities] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const spd = new Float32Array(count);
    const opa = new Float32Array(count);
    
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 0.5; // x
      pos[i * 3 + 1] = Math.random() * 2;       // y
      pos[i * 3 + 2] = (Math.random() - 0.5) * 0.5; // z
      spd[i] = 0.005 + Math.random() * 0.01;
      opa[i] = Math.random();
    }
    return [pos, spd, opa];
  }, [count]);

  useFrame((state) => {
    if (!ref.current) return;
    const positionsAttr = ref.current.geometry.attributes.position as THREE.BufferAttribute;
    const positionsArray = positionsAttr.array as Float32Array;

    for (let i = 0; i < count; i++) {
      // Move up
      positionsArray[i * 3 + 1] += speeds[i];
      
      // Wiggle
      positionsArray[i * 3] += Math.sin(state.clock.elapsedTime * 2 + i) * 0.002;

      // Reset if too high
      if (positionsArray[i * 3 + 1] > 2.5) {
        positionsArray[i * 3 + 1] = 0;
        positionsArray[i * 3] = (Math.random() - 0.5) * 0.5;
        positionsArray[i * 3 + 2] = (Math.random() - 0.5) * 0.5;
      }
    }
    positionsAttr.needsUpdate = true;
  });

  return (
    <Points ref={ref} positions={positions} stride={3} position={new THREE.Vector3(...position)}>
      <PointMaterial
        transparent
        color="#aaaaaa"
        size={0.1}
        sizeAttenuation={true}
        depthWrite={false}
        opacity={0.4}
        blending={THREE.AdditiveBlending}
      />
    </Points>
  );
};

export default Steam;
