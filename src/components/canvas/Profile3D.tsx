'use client';

import { useRef, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useTexture, Environment, ContactShadows, Text } from '@react-three/drei';
import * as THREE from 'three';

function LanyardCard() {
  const groupRef = useRef<THREE.Group>(null);
  const cardRef = useRef<THREE.Group>(null);
  const texture = useTexture('/images/Profil.png');
  
  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.getElapsedTime();
    
    // Natural pendulum swinging (gravity effect)
    const swingX = Math.sin(t * 1.2) * 0.1;
    const swingZ = Math.cos(t * 0.9) * 0.05;
    
    // Interactive mouse pull (subtle)
    const targetX = (state.pointer.x * Math.PI) / 6;
    const targetY = (state.pointer.y * Math.PI) / 10;
    
    // Smooth interpolation for the main lanyard swing
    groupRef.current.rotation.z += (swingX - targetX - groupRef.current.rotation.z) * 0.05;
    groupRef.current.rotation.x += (swingZ + targetY - groupRef.current.rotation.x) * 0.05;
    
    // Slight secondary twist for the card itself
    if (cardRef.current) {
      cardRef.current.rotation.y = Math.sin(t * 1.5) * 0.05;
    }
  });

  return (
    // Pivot point at the top
    <group position={[0, 4, 0]} ref={groupRef}>
      
      {/* Lanyard String */}
      <mesh position={[0, -2, 0]}>
        <cylinderGeometry args={[0.015, 0.015, 4, 8]} />
        <meshStandardMaterial color="#10b981" />
      </mesh>

      {/* Metal Clip connection */}
      <mesh position={[0, -4.05, 0]}>
        <boxGeometry args={[0.3, 0.15, 0.06]} />
        <meshStandardMaterial color="#a3a3a3" metalness={0.8} roughness={0.2} />
      </mesh>
      
      {/* The ID Card */}
      <group position={[0, -6, 0]} ref={cardRef}>
        {/* Card Background / Base */}
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[2.8, 3.8, 0.02]} />
          <meshPhysicalMaterial 
            color="#ffffff" 
            roughness={0.2} 
            metalness={0.1} 
            clearcoat={0.5}
            clearcoatRoughness={0.2}
          />
        </mesh>
        
        {/* Card Header (Green Color Block) */}
        <mesh position={[0, 1.4, 0.015]}>
          <planeGeometry args={[2.8, 1.0]} />
          <meshBasicMaterial color="#10b981" />
        </mesh>
        
        <Text 
          position={[0, 1.4, 0.02]} 
          fontSize={0.22} 
          color="#ffffff" 
          fontWeight="bold"
          letterSpacing={0.1}
          anchorY="middle"
        >
          SOFTWARE ENGINEER
        </Text>

        {/* Profile Picture */}
        <mesh position={[0, -0.1, 0.015]}>
          <planeGeometry args={[1.6, 1.6]} />
          <meshPhysicalMaterial map={texture} roughness={0.4} />
        </mesh>
        
        {/* Picture Frame border */}
        <mesh position={[0, -0.1, 0.01]}>
          <planeGeometry args={[1.66, 1.66]} />
          <meshBasicMaterial color="#e5e5e5" />
        </mesh>

        {/* Card Details */}
        <Text 
          position={[0, -1.2, 0.02]} 
          fontSize={0.22} 
          color="#171717" 
          fontWeight="bold"
          anchorY="middle"
        >
          NOVAL ABDILLAH
        </Text>
        <Text 
          position={[0, -1.5, 0.02]} 
          fontSize={0.13} 
          color="#10b981"
          fontWeight="medium"
          letterSpacing={0.05}
          anchorY="middle"
        >
          VIBECODER & PROMPTER
        </Text>
      </group>
    </group>
  );
}

// Simple fallback
function Loader() {
  return (
    <mesh position={[0, -2, 0]}>
      <boxGeometry args={[2.8, 3.8, 0.02]} />
      <meshBasicMaterial color="#10b981" wireframe />
    </mesh>
  );
}

export default function Profile3D() {
  return (
    <div className="w-full h-[500px] relative">
      {/* Camera is centered vertically on the card's position (y = -2) */}
      <Canvas camera={{ position: [0, -2, 6.5], fov: 45 }}>
        <ambientLight intensity={0.6} />
        <spotLight position={[5, 10, 5]} angle={0.2} penumbra={1} intensity={1.5} />
        <pointLight position={[-5, -5, -5]} intensity={0.5} color="#10b981" />
        
        <Suspense fallback={<Loader />}>
          <LanyardCard />
        </Suspense>
        
        <ContactShadows 
          position={[0, -4.5, 0]} 
          opacity={0.4} 
          scale={15} 
          blur={2.5} 
          far={6} 
          color="#10b981" 
        />
        <Environment preset="city" />
      </Canvas>
    </div>
  );
}

