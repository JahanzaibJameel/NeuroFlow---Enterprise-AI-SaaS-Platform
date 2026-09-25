'use client';

import { useRef, memo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Sphere, Points } from '@react-three/drei';
import * as THREE from 'three';

const AnimatedSphere = memo(() => {
  const sphereRef = useRef<THREE.Mesh>(null);

  useFrame((state: { clock: { elapsedTime: number } }) => {
    if (sphereRef.current) {
      sphereRef.current.rotation.y = state.clock.elapsedTime * 0.2;
      sphereRef.current.rotation.x =
        Math.sin(state.clock.elapsedTime * 0.1) * 0.1;
    }
  });

  return (
    <Sphere ref={sphereRef} args={[1, 64, 64]} scale={2}>
      <meshStandardMaterial
        color="#3b82f6"
        wireframe
        transparent
        opacity={0.3}
      />
    </Sphere>
  );
});

AnimatedSphere.displayName = 'AnimatedSphere';

const Particles = memo(() => {
  const pointsRef = useRef<THREE.Points>(null);

  // Generate random particles
  const positions = new Float32Array(500 * 3);
  for (let i = 0; i < 500 * 3; i++) {
    positions[i] = (Math.random() - 0.5) * 10;
  }

  useFrame((state: { clock: { elapsedTime: number } }) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y = state.clock.elapsedTime * 0.05;
    }
  });

  return (
    <Points
      ref={pointsRef}
      positions={positions}
      stride={3}
      frustumCulled={false}
    >
      <pointsMaterial
        color="#8b5cf6"
        size={0.05}
        transparent
        opacity={0.8}
        sizeAttenuation={true}
      />
    </Points>
  );
});

Particles.displayName = 'Particles';

export default function BrainScene() {
  return (
    <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
      {/* Lighting */}
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} />
      <pointLight position={[-10, -10, -5]} intensity={0.5} color="#8b5cf6" />

      {/* 3D Objects */}
      <AnimatedSphere />
      <Particles />

      {/* Controls */}
      <OrbitControls
        enableZoom={true}
        enablePan={false}
        autoRotate
        autoRotateSpeed={0.5}
        minDistance={3}
        maxDistance={10}
      />
    </Canvas>
  );
}
