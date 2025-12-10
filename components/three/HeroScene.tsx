"use client";

import { useRef, useMemo, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Sparkles } from "@react-three/drei";
import * as THREE from "three";

// Floating geometric shape with amber glow
function FloatingPrism() {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.3) * 0.2;
      meshRef.current.rotation.y += 0.003;
      meshRef.current.rotation.z = Math.cos(state.clock.elapsedTime * 0.2) * 0.1;
    }
  });

  return (
    <Float speed={1.5} rotationIntensity={0.3} floatIntensity={1}>
      <mesh ref={meshRef} scale={2}>
        <icosahedronGeometry args={[1, 0]} />
        <meshPhysicalMaterial
          color="#f59e0b"
          metalness={0.2}
          roughness={0.1}
          transparent
          opacity={0.85}
          emissive="#f59e0b"
          emissiveIntensity={0.15}
        />
      </mesh>
    </Float>
  );
}

// Orbiting rings around the prism
function OrbitalRings() {
  const ring1Ref = useRef<THREE.Mesh>(null);
  const ring2Ref = useRef<THREE.Mesh>(null);
  const ring3Ref = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (ring1Ref.current) {
      ring1Ref.current.rotation.x = t * 0.2;
      ring1Ref.current.rotation.y = t * 0.15;
    }
    if (ring2Ref.current) {
      ring2Ref.current.rotation.x = -t * 0.15;
      ring2Ref.current.rotation.z = t * 0.2;
    }
    if (ring3Ref.current) {
      ring3Ref.current.rotation.y = t * 0.18;
      ring3Ref.current.rotation.z = -t * 0.1;
    }
  });

  return (
    <group>
      <mesh ref={ring1Ref}>
        <torusGeometry args={[3, 0.015, 16, 100]} />
        <meshStandardMaterial
          color="#f59e0b"
          emissive="#f59e0b"
          emissiveIntensity={0.6}
        />
      </mesh>
      <mesh ref={ring2Ref}>
        <torusGeometry args={[3.5, 0.01, 16, 100]} />
        <meshStandardMaterial
          color="#fbbf24"
          emissive="#fbbf24"
          emissiveIntensity={0.4}
        />
      </mesh>
      <mesh ref={ring3Ref}>
        <torusGeometry args={[4, 0.008, 16, 100]} />
        <meshStandardMaterial
          color="#fcd34d"
          emissive="#fcd34d"
          emissiveIntensity={0.3}
        />
      </mesh>
    </group>
  );
}

// Floating particles
function ParticleCloud() {
  const count = 300;
  const pointsRef = useRef<THREE.Points>(null);

  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = 5 + Math.random() * 8;
      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = r * Math.cos(phi);
    }
    return pos;
  }, []);

  useFrame((state) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y = state.clock.elapsedTime * 0.015;
      pointsRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.03) * 0.05;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.04}
        color="#f59e0b"
        transparent
        opacity={0.7}
        sizeAttenuation
      />
    </points>
  );
}

// Main scene composition
function Scene() {
  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.4} />
      <directionalLight position={[5, 5, 5]} intensity={1} color="#fff5e6" />
      <directionalLight position={[-5, -5, -5]} intensity={0.3} color="#f59e0b" />
      <pointLight position={[0, 0, 3]} intensity={1.5} color="#f59e0b" distance={10} />

      {/* 3D Elements */}
      <FloatingPrism />
      <OrbitalRings />
      <ParticleCloud />

      {/* Sparkles from drei */}
      <Sparkles
        count={50}
        scale={12}
        size={1.5}
        speed={0.3}
        opacity={0.4}
        color="#f59e0b"
      />
    </>
  );
}

// Loading fallback
function Loader() {
  return null;
}

export function HeroScene({ className }: { className?: string }) {
  return (
    <div className={className}>
      <Canvas
        camera={{ position: [0, 0, 8], fov: 50 }}
        dpr={[1, 1.5]}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
          failIfMajorPerformanceCaveat: false,
        }}
        style={{ background: "transparent" }}
      >
        <Suspense fallback={<Loader />}>
          <Scene />
        </Suspense>
      </Canvas>
    </div>
  );
}

export default HeroScene;
