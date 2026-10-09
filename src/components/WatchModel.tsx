import { useEffect, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { ContactShadows, Environment, OrbitControls, Sparkles } from '@react-three/drei';
import * as THREE from 'three';

function WatchParts() {
  const group = useRef<THREE.Group>(null);
  const bezel = useRef<THREE.Mesh>(null);
  const crystal = useRef<THREE.Mesh>(null);
  const dial = useRef<THREE.Mesh>(null);
  const hands = useRef<THREE.Group>(null);
  const [explode, setExplode] = useState(0);

  useEffect(() => {
    const update = () => {
      const section = document.getElementById('anatomy');
      if (!section) return;
      const rect = section.getBoundingClientRect();
      const progress = THREE.MathUtils.clamp((window.innerHeight - rect.top) / (rect.height + window.innerHeight), 0, 1);
      setExplode(progress < 0.28 ? 0 : progress < 0.72 ? (progress - 0.28) / 0.44 : (1 - progress) / 0.28);
    };
    window.addEventListener('scroll', update, { passive: true });
    update();
    return () => window.removeEventListener('scroll', update);
  }, []);

  useFrame((state, delta) => {
    if (group.current) {
      group.current.rotation.y += delta * 0.12;
      group.current.position.y = Math.sin(state.clock.elapsedTime * 0.7) * 0.045;
    }
    const e = Math.max(0, Math.min(1, explode));
    if (bezel.current) bezel.current.position.z = 0.18 + e * 0.85;
    if (crystal.current) crystal.current.position.z = 0.31 + e * 1.4;
    if (dial.current) dial.current.position.z = 0.05 + e * 0.25;
    if (hands.current) hands.current.position.z = 0.12 + e * 0.65;
  });

  return (
    <group ref={group} rotation={[0.2, -0.45, -0.08]} scale={1.12}>
      {/* bracelet links */}
      {[-1, 1].map((side) => (
        <group key={side} position={[0, side * 1.15, -0.02]} rotation={[side * -0.08, 0, 0]}>
          {Array.from({ length: 7 }, (_, i) => (
            <mesh key={i} position={[0, side * i * 0.22, 0]}>
              <boxGeometry args={[0.72 - Math.abs(i - 3) * 0.035, 0.205, 0.15]} />
              <meshStandardMaterial color={i % 2 ? '#aab3bd' : '#d8dde2'} metalness={0.92} roughness={0.22} />
            </mesh>
          ))}
        </group>
      ))}
      {/* steel case and back */}
      <mesh position={[0, 0, -0.1]}>
        <cylinderGeometry args={[1.04, 1.04, 0.25, 96]} />
        <meshStandardMaterial color="#727f8b" metalness={0.95} roughness={0.24} />
      </mesh>
      <mesh position={[0, 0, 0.02]}>
        <cylinderGeometry args={[1.01, 1.01, 0.18, 96]} />
        <meshStandardMaterial color="#c0c8d0" metalness={0.96} roughness={0.18} />
      </mesh>
      {/* dial */}
      <mesh ref={dial} position={[0, 0, 0.05]}>
        <cylinderGeometry args={[0.87, 0.87, 0.045, 96]} />
        <meshStandardMaterial color="#0b1b28" metalness={0.32} roughness={0.26} />
      </mesh>
      {/* hour indices */}
      {Array.from({ length: 12 }, (_, i) => {
        const a = (i / 12) * Math.PI * 2;
        return <mesh key={i} position={[Math.sin(a) * 0.72, Math.cos(a) * 0.72, 0.09]} rotation={[0, 0, -a]}>
          <boxGeometry args={[0.055, i % 3 === 0 ? 0.15 : 0.09, 0.025]} />
          <meshStandardMaterial color="#e7d7a5" emissive="#8e7c4a" emissiveIntensity={0.15} metalness={0.5} roughness={0.25} />
        </mesh>;
      })}
      {/* hands */}
      <group ref={hands} position={[0, 0, 0.12]}>
        <mesh position={[0, 0.2, 0.04]} rotation={[0, 0, -0.18]}>
          <boxGeometry args={[0.045, 0.47, 0.025]} />
          <meshStandardMaterial color="#f1eee5" metalness={0.7} roughness={0.2} />
        </mesh>
        <mesh position={[0.19, -0.01, 0.06]} rotation={[0, 0, -1.1]}>
          <boxGeometry args={[0.03, 0.65, 0.022]} />
          <meshStandardMaterial color="#e7d7a5" metalness={0.8} roughness={0.2} />
        </mesh>
        <mesh position={[0, 0, 0.085]}>
          <cylinderGeometry args={[0.06, 0.06, 0.04, 24]} />
          <meshStandardMaterial color="#e0c987" metalness={0.85} roughness={0.18} />
        </mesh>
      </group>
      {/* crystal */}
      <mesh ref={crystal} position={[0, 0, 0.31]}>
        <cylinderGeometry args={[0.92, 0.92, 0.035, 96]} />
        <meshPhysicalMaterial color="#b8d9e8" transparent opacity={0.16} roughness={0.06} metalness={0.15} transmission={0.45} thickness={0.1} />
      </mesh>
      {/* bezel */}
      <mesh ref={bezel} position={[0, 0, 0.18]}>
        <torusGeometry args={[0.96, 0.095, 16, 96]} />
        <meshStandardMaterial color="#d4dbe0" metalness={0.98} roughness={0.2} />
      </mesh>
      {/* crown */}
      <mesh position={[1.08, 0, -0.015]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.13, 0.13, 0.22, 32]} />
        <meshStandardMaterial color="#aeb7c0" metalness={0.95} roughness={0.23} />
      </mesh>
      <mesh position={[0, 0, 0.105]}>
        <cylinderGeometry args={[0.025, 0.025, 0.03, 24]} />
        <meshStandardMaterial color="#e5d3a1" metalness={0.9} roughness={0.18} />
      </mesh>
    </group>
  );
}

export default function WatchModel() {
  return (
    <div className="watch-canvas">
      <Canvas camera={{ position: [3.7, 3.2, 5.3], fov: 36 }} dpr={[1, 1.75]}>
        <color attach="background" args={['#0a0d11']} />
        <ambientLight intensity={1.15} />
        <spotLight position={[4, 5, 5]} intensity={55} angle={0.35} penumbra={0.8} />
        <pointLight position={[-4, -2, 3]} intensity={20} color="#8abbd9" />
        <WatchParts />
        <Sparkles count={38} scale={5.5} size={1.2} speed={0.2} opacity={0.28} color="#a5c7d9" />
        <ContactShadows position={[0, -2.25, 0]} opacity={0.45} scale={6} blur={2.5} far={4} />
        <Environment preset="studio" />
        <OrbitControls enablePan={false} minDistance={3.5} maxDistance={9} minPolarAngle={0.4} maxPolarAngle={2.6} />
      </Canvas>
      <span className="drag-hint">DRAG TO ROTATE · SCROLL TO EXPLORE</span>
    </div>
  );
}