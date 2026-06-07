'use client';

import { useRef, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Stars, Float } from '@react-three/drei';
import * as THREE from 'three';

// Animated 3D shape that responds to mouse
function AnimatedTechShape() {
  const groupRef = useRef<THREE.Group>(null);
  const meshRef = useRef<THREE.Mesh>(null);
  const wireframeRef = useRef<THREE.Mesh>(null);
  const { viewport } = useThree();
  const mouse = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useFrame(({ clock }) => {
    if (!groupRef.current || !meshRef.current || !wireframeRef.current) return;
    const t = clock.getElapsedTime();
    
    // Rotate the whole group
    groupRef.current.rotation.y = t * 0.2;
    groupRef.current.rotation.x = t * 0.1;
    
    // Rotate inner mesh in opposite direction
    meshRef.current.rotation.y = -t * 0.1;
    wireframeRef.current.rotation.y = -t * 0.1;

    // Parallax from mouse
    groupRef.current.position.x = THREE.MathUtils.lerp(
      groupRef.current.position.x,
      mouse.current.x * 0.8,
      0.05
    );
    groupRef.current.position.y = THREE.MathUtils.lerp(
      groupRef.current.position.y,
      mouse.current.y * 0.5,
      0.05
    );
  });

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={2}>
      <group ref={groupRef}>
        {/* Core Icosahedron */}
        <mesh ref={meshRef}>
          <icosahedronGeometry args={[1.2, 1]} />
          <meshPhysicalMaterial
            color="#22c55e"
            metalness={0.5}
            roughness={0.2}
            clearcoat={1.0}
            clearcoatRoughness={0.1}
            emissive="#16a34a"
            emissiveIntensity={0.5}
            transparent
            opacity={0.8}
          />
        </mesh>
        
        {/* Outer wireframe */}
        <mesh ref={wireframeRef} scale={1.2}>
          <icosahedronGeometry args={[1.2, 1]} />
          <meshBasicMaterial
            color="#4ade80"
            wireframe
            transparent
            opacity={0.3}
          />
        </mesh>
        
        {/* Inner core */}
        <mesh scale={0.5}>
          <octahedronGeometry args={[1, 0]} />
          <meshStandardMaterial
            color="#ffffff"
            emissive="#ffffff"
            emissiveIntensity={0.8}
          />
        </mesh>
      </group>
    </Float>
  );
}

// Particle system
function Particles() {
  const pointsRef = useRef<THREE.Points>(null);

  useFrame(({ clock }) => {
    if (!pointsRef.current) return;
    pointsRef.current.rotation.y = clock.getElapsedTime() * 0.05;
  });

  const count = 1500;
  const positions = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 25;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 25;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 25;
  }

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial size={0.04} color="#4ade80" transparent opacity={0.8} sizeAttenuation={true} />
    </points>
  );
}

export default function Canvas3D() {
  return (
    <Canvas
      camera={{ position: [0, 0, 6], fov: 60 }}
      style={{ background: '#09090b' }}
    >
      <ambientLight intensity={0.8} />
      <pointLight position={[10, 10, 10]} intensity={2} color="#ffffff" />
      <pointLight position={[-10, -10, -10]} intensity={1} color="#22c55e" />
      <directionalLight position={[0, 5, 5]} intensity={1.5} color="#4ade80" />

      <AnimatedTechShape />
      <Particles />

      <Stars
        radius={100}
        depth={50}
        count={5000}
        factor={4}
        saturation={1}
        fade
        speed={1}
      />
    </Canvas>
  );
}
