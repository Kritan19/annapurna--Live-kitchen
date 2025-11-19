
import React, { useMemo, useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Text, CatmullRomLine, Float, Environment } from '@react-three/drei';
import * as THREE from 'three';
import { GuestFlag, subscribeToFlags, getInitialFlags } from '../services/supabaseMock';

// 5 Elements Colors: Blue (Sky), White (Air), Red (Fire), Green (Water), Yellow (Earth)
const FLAG_COLORS = ['#0078BF', '#F5F6F5', '#E31D2B', '#009B4C', '#FDCE12'];

const FlagShaderMaterial = {
  uniforms: {
    uTime: { value: 0 },
    uColor: { value: new THREE.Color('#E31D2B') },
    uWindStrength: { value: 0.2 },
  },
  vertexShader: `
    varying vec2 vUv;
    uniform float uTime;
    uniform float uWindStrength;
    
    void main() {
      vUv = uv;
      vec3 pos = position;
      
      // Wind effect: pinned at top (y=0 in local space approx), moves more at bottom
      float wave = sin(uv.x * 10.0 + uTime * 3.0) * sin(uv.y * 5.0 + uTime * 2.0);
      
      // Pin the top edge (assuming uv.y goes 0 to 1, or adjust based on geometry)
      float pin = 1.0 - uv.y; 
      
      pos.z += wave * uWindStrength * pin;
      
      gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
    }
  `,
  fragmentShader: `
    varying vec2 vUv;
    uniform vec3 uColor;
    
    void main() {
      // Add some fabric texture noise
      float noise = sin(vUv.x * 50.0) * sin(vUv.y * 50.0) * 0.05;
      gl_FragColor = vec4(uColor + noise, 1.0);
    }
  `
};

const SingleFlag = ({ position, rotation, color, name, index }: { position: THREE.Vector3, rotation: [number, number, number], color: string, name: string, index: number }) => {
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  
  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = state.clock.getElapsedTime() + index; // Offset phase
    }
  });

  const shaderArgs = useMemo(() => ({
    uniforms: {
      uTime: { value: 0 },
      uColor: { value: new THREE.Color(color) },
      uWindStrength: { value: 0.3 },
    },
    vertexShader: FlagShaderMaterial.vertexShader,
    fragmentShader: FlagShaderMaterial.fragmentShader,
    side: THREE.DoubleSide
  }), [color]);

  return (
    <group position={position} rotation={rotation}>
      {/* The Flag Mesh */}
      <mesh position={[0, -0.4, 0]}>
        <planeGeometry args={[0.6, 0.8, 10, 10]} />
        <shaderMaterial ref={materialRef} args={[shaderArgs]} />
      </mesh>
      
      {/* Name on Flag */}
      <Text
        position={[0, -0.4, 0.05]}
        rotation={[0, 0, -Math.PI / 2]}
        fontSize={0.15}
        color="rgba(0,0,0,0.7)"
        anchorX="center"
        anchorY="middle"
        maxWidth={0.7}
      >
        {name}
      </Text>
      
      {/* String Segment (visual connector) */}
      <mesh position={[0.35, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
         <cylinderGeometry args={[0.01, 0.01, 0.1, 8]} />
         <meshStandardMaterial color="#aaa" />
      </mesh>
    </group>
  );
};

const FlagString = () => {
  const [flags, setFlags] = useState<GuestFlag[]>([]);

  useEffect(() => {
    getInitialFlags().then(setFlags);
    const unsubscribe = subscribeToFlags((newFlag) => {
      setFlags(prev => [newFlag, ...prev].slice(0, 20)); // Keep last 20
    });
    return unsubscribe;
  }, []);

  // Create a curve for the rope
  const points = useMemo(() => {
    const pts = [];
    for (let i = 0; i < 10; i++) {
      pts.push(new THREE.Vector3((i - 5) * 1.5, Math.sin(i) * 0.5 + 2, Math.cos(i) * 2 - 5));
    }
    return pts;
  }, []);

  const curve = useMemo(() => new THREE.CatmullRomCurve3(points), [points]);

  return (
    <group>
      <CatmullRomLine points={points} color="#F5F6F5" lineWidth={1} dashed={false} />
      
      {flags.map((flag, i) => {
        const t = (i + 1) / (flags.length + 2);
        const pos = curve.getPoint(t);
        const tangent = curve.getTangent(t);
        // Calculate rotation based on tangent to align with rope
        const angle = Math.atan2(tangent.y, tangent.x);
        
        return (
          <SingleFlag 
            key={flag.id || i}
            index={i}
            position={pos}
            rotation={[0, 0, angle]} // Simplified rotation alignment
            color={FLAG_COLORS[flag.colorIdx % 5]}
            name={flag.name}
          />
        );
      })}
    </group>
  );
};

const PrayerFlags: React.FC = () => {
  return (
    <section className="h-[60vh] bg-gradient-to-b from-[#0B0F1A] to-[#1a0505] relative overflow-hidden border-t border-white/10">
      <div className="absolute top-10 left-0 right-0 text-center z-10 pointer-events-none">
        <h2 className="text-4xl font-serif text-everestSnow drop-shadow-lg">The Guestbook of the Wind</h2>
        <p className="text-gheeGold text-sm tracking-[0.2em] mt-2 uppercase">Every reservation raises a flag</p>
      </div>
      
      <Canvas camera={{ position: [0, 0, 8], fov: 45 }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 5, 5]} intensity={1} />
        <Environment preset="night" />
        <Float speed={1} rotationIntensity={0.2} floatIntensity={0.5}>
            <FlagString />
        </Float>
        <fog attach="fog" args={['#0B0F1A', 5, 20]} />
      </Canvas>
      
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-[#1a0505] to-transparent pointer-events-none" />
    </section>
  );
};

export default PrayerFlags;
