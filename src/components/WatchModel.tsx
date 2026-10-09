import { useEffect, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { ContactShadows, Environment, OrbitControls, Sparkles, Text } from '@react-three/drei';
import * as THREE from 'three';

const STEEL = '#b9c2ca';
const POLISHED = '#e4e8eb';
const GOLD = '#e7d6a1';
const DIAL = '#07151b';
const BEZEL = '#102e2b';

function SteelMaterial({ color = STEEL, roughness = 0.24 }: { color?: string; roughness?: number }) {
  return <meshStandardMaterial color={color} metalness={0.94} roughness={roughness} />;
}

function WatchParts() {
  const group = useRef<THREE.Group>(null);
  const bezel = useRef<THREE.Group>(null);
  const crystal = useRef<THREE.Mesh>(null);
  const dial = useRef<THREE.Mesh>(null);
  const hands = useRef<THREE.Group>(null);
  const markers = useRef<THREE.Group>(null);
  const [explode, setExplode] = useState(0);

  useEffect(() => {
    const update = () => {
      const section = document.getElementById('anatomy');
      if (!section) return;
      const rect = section.getBoundingClientRect();
      const progress = THREE.MathUtils.clamp((window.innerHeight - rect.top) / (rect.height + window.innerHeight), 0, 1);
      const amount = progress < 0.25 ? 0 : progress < 0.7 ? (progress - 0.25) / 0.45 : Math.max(0, (1 - progress) / 0.3);
      setExplode(THREE.MathUtils.clamp(amount, 0, 1));
    };
    window.addEventListener('scroll', update, { passive: true });
    update();
    return () => window.removeEventListener('scroll', update);
  }, []);

  useFrame((state) => {
    const e = THREE.MathUtils.clamp(explode, 0, 1);
    if (group.current) group.current.position.y = Math.sin(state.clock.elapsedTime * 0.65) * 0.035;
    if (bezel.current) bezel.current.position.z = 0.245 + e * 0.72;
    if (crystal.current) crystal.current.position.z = 0.32 + e * 1.08;
    if (dial.current) dial.current.position.z = 0.125 + e * 0.2;
    if (hands.current) hands.current.position.z = 0.205 + e * 0.46;
    if (markers.current) markers.current.position.z = 0.18 + e * 0.32;
  });

  return (
    <group ref={group} rotation={[0.12, -0.32, -0.08]} scale={1.08}>
      {/* Three-piece Oyster-style bracelet: individual links, brushed outer links and polished centre links */}
      {[-1, 1].map((side) => (
        <group key={side} position={[0, side * 1.02, -0.025]}>
          {Array.from({ length: 7 }, (_, i) => {
            const y = side * (0.84 + i * 0.235);
            return (
              <group key={i} position={[0, y, 0]}>
                {[-1, 0, 1].map((column) => (
                  <mesh key={column} position={[column * 0.235, 0, column === 0 ? 0.012 : 0]}>
                    <boxGeometry args={[column === 0 ? 0.22 : 0.215, 0.218, column === 0 ? 0.115 : 0.095]} />
                    <SteelMaterial color={column === 0 ? '#dce1e5' : '#9da8b1'} roughness={column === 0 ? 0.17 : 0.3} />
                  </mesh>
                ))}
                <mesh position={[0, side * 0.105, -0.005]}>
                  <boxGeometry args={[0.69, 0.018, 0.105]} />
                  <SteelMaterial color="#737f88" roughness={0.32} />
                </mesh>
              </group>
            );
          })}
        </group>
      ))}

      {/* Case back and substantial stainless-steel case. Cylinders are rotated so the dial faces forward. */}
      <mesh position={[0, 0, -0.115]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[1.025, 1.025, 0.19, 96]} />
        <SteelMaterial color="#68747e" roughness={0.31} />
      </mesh>
      <mesh position={[0, 0, -0.005]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[1.055, 1.055, 0.22, 96]} />
        <SteelMaterial color="#c1c9d0" roughness={0.2} />
      </mesh>

      {/* Lugs that visually connect the case to the bracelet */}
      {[-1, 1].map((side) => [-1, 1].map((x) => (
        <mesh key={`${side}-${x}`} position={[x * 0.56, side * 0.98, -0.025]} rotation={[0, 0, side * x * -0.12]}>
          <boxGeometry args={[0.32, 0.48, 0.16]} />
          <SteelMaterial color="#aab4bd" roughness={0.22} />
        </mesh>
      )))}

      {/* Dark dive bezel with minute graduations and the signature triangle at 12 */}
      <group ref={bezel} position={[0, 0, 0.245]}>
        <mesh>
          <cylinderGeometry args={[1.025, 1.025, 0.13, 96]} />
          <SteelMaterial color="#7b858d" roughness={0.2} />
        </mesh>
        <mesh position={[0, 0, 0.078]}>
          <cylinderGeometry args={[0.985, 0.985, 0.045, 96]} />
          <meshStandardMaterial color={BEZEL} metalness={0.55} roughness={0.24} />
        </mesh>
        <mesh position={[0, 0, 0.105]}>
          <torusGeometry args={[0.925, 0.045, 12, 96]} />
          <meshStandardMaterial color="#82918a" metalness={0.72} roughness={0.22} />
        </mesh>
        {Array.from({ length: 60 }, (_, i) => {
          const a = (i / 60) * Math.PI * 2;
          const major = i % 5 === 0;
          return (
            <mesh key={i} position={[Math.sin(a) * 0.86, Math.cos(a) * 0.86, 0.112]} rotation={[0, 0, -a]}>
              <boxGeometry args={[major ? 0.027 : 0.014, major ? 0.095 : 0.045, 0.012]} />
              <meshStandardMaterial color={major ? '#e1e5d8' : '#aab7ae'} metalness={0.25} roughness={0.35} />
            </mesh>
          );
        })}
        <mesh position={[0, 0.77, 0.12]} rotation={[0, 0, Math.PI]}>
          <coneGeometry args={[0.09, 0.14, 3]} />
          <meshStandardMaterial color="#e4e8d8" metalness={0.2} roughness={0.35} />
        </mesh>
        <mesh position={[0, 0.77, 0.13]}>
          <sphereGeometry args={[0.035, 20, 20]} />
          <meshStandardMaterial color="#f0e8b8" emissive="#c5b477" emissiveIntensity={0.25} />
        </mesh>
      </group>

      {/* Glossy black dial */}
      <mesh ref={dial} position={[0, 0, 0.125]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.865, 0.865, 0.035, 96]} />
        <meshStandardMaterial color={DIAL} metalness={0.22} roughness={0.2} />
      </mesh>

      {/* Luminous applied hour markers */}
      <group ref={markers} position={[0, 0, 0.18]}>
        {Array.from({ length: 12 }, (_, i) => {
          const a = (i / 12) * Math.PI * 2;
          const special = i === 0 || i === 3 || i === 6 || i === 9;
          const w = i === 3 || i === 9 ? 0.075 : 0.09;
          const h = i === 0 ? 0.16 : i === 3 || i === 6 || i === 9 ? 0.12 : 0.09;
          return (
            <group key={i} position={[Math.sin(a) * 0.69, Math.cos(a) * 0.69, 0]}>
              {i === 0 ? (
                <mesh rotation={[0, 0, Math.PI]}>
                  <coneGeometry args={[0.072, 0.16, 3]} />
                  <meshStandardMaterial color="#e9e2c5" emissive="#9f946c" emissiveIntensity={0.16} />
                </mesh>
              ) : (
                <mesh rotation={[0, 0, -a]}>
                  <boxGeometry args={[w, h, 0.035]} />
                  <meshStandardMaterial color="#e9e2c5" emissive="#9f946c" emissiveIntensity={0.13} metalness={0.15} roughness={0.25} />
                </mesh>
              )}
              {special && <mesh position={[0, 0, -0.008]}><boxGeometry args={[w + 0.035, h + 0.035, 0.018]} /><meshStandardMaterial color="#9eaa9e" metalness={0.55} roughness={0.3} /></mesh>}
            </group>
          );
        })}
      </group>

      {/* Dial lettering, kept subtle like a real instrument dial */}
      <Text position={[0, 0.42, 0.205]} fontSize={0.105} color="#e6e8df" anchorX="center" anchorY="middle" letterSpacing={0.08} fontWeight={700}>ROLEX</Text>
      <Text position={[0, 0.30, 0.205]} fontSize={0.044} color="#cbd1c9" anchorX="center" anchorY="middle" letterSpacing={0.03}>OYSTER PERPETUAL</Text>
      <Text position={[0, -0.37, 0.205]} fontSize={0.052} color="#d4d8d0" anchorX="center" anchorY="middle" letterSpacing={0.02}>SUBMARINER</Text>
      <Text position={[0, -0.46, 0.205]} fontSize={0.032} color="#aeb9b0" anchorX="center" anchorY="middle">1000 ft = 300 m</Text>

      {/* Date window and raised cyclops magnifier at 3 o'clock */}
      <mesh position={[0.53, 0.02, 0.211]}>
        <boxGeometry args={[0.19, 0.205, 0.028]} />
        <meshStandardMaterial color="#e5e3d8" roughness={0.34} />
      </mesh>
      <Text position={[0.53, 0.02, 0.231]} fontSize={0.11} color="#1b2224" anchorX="center" anchorY="middle">09</Text>
      <mesh position={[0.53, 0.02, 0.265]}>
        <cylinderGeometry args={[0.145, 0.145, 0.018, 48]} />
        <meshPhysicalMaterial color="#d7e5e9" transparent opacity={0.28} roughness={0.06} transmission={0.5} />
      </mesh>

      {/* Three central hands and pinion */}
      <group ref={hands} position={[0, 0, 0.205]}>
        {/* Mercedes-style hour hand */}
        <group rotation={[0, 0, -0.72]}>
          <mesh position={[0, 0.19, 0.025]}>
            <boxGeometry args={[0.065, 0.34, 0.025]} />
            <meshStandardMaterial color="#e5e9df" metalness={0.72} roughness={0.2} />
          </mesh>
          <mesh position={[0, 0.29, 0.042]}>
            <torusGeometry args={[0.048, 0.014, 8, 24]} />
            <meshStandardMaterial color="#e5e9df" metalness={0.72} roughness={0.2} />
          </mesh>
          <mesh position={[0, 0.29, 0.039]}>
            <circleGeometry args={[0.034, 24]} />
            <meshStandardMaterial color="#10221d" />
          </mesh>
        </group>
        {/* Minute hand */}
        <mesh position={[0, 0.28, 0.048]} rotation={[0, 0, 0.2]}>
          <boxGeometry args={[0.035, 0.52, 0.022]} />
          <meshStandardMaterial color="#f0eee4" metalness={0.7} roughness={0.18} />
        </mesh>
        {/* Seconds hand */}
        <mesh position={[0.02, -0.015, 0.065]} rotation={[0, 0, -0.18]}>
          <boxGeometry args={[0.012, 0.69, 0.012]} />
          <meshStandardMaterial color="#d4c18b" metalness={0.8} roughness={0.18} />
        </mesh>
        <mesh position={[0, 0, 0.078]}>
          <cylinderGeometry args={[0.055, 0.055, 0.035, 32]} />
          <meshStandardMaterial color={GOLD} metalness={0.88} roughness={0.18} />
        </mesh>
      </group>

      {/* Screw-down crown and protective shoulders at 3 o'clock */}
      {[-1, 1].map((side) => (
        <mesh key={side} position={[1.02, side * 0.19, -0.005]} rotation={[0, 0, side * 0.2]}>
          <boxGeometry args={[0.22, 0.17, 0.2]} />
          <SteelMaterial color="#8d99a2" roughness={0.25} />
        </mesh>
      ))}
      <mesh position={[1.15, 0, -0.005]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.13, 0.13, 0.23, 32]} />
        <SteelMaterial color="#c4ccd2" roughness={0.22} />
      </mesh>
      <mesh position={[1.275, 0, -0.005]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.105, 0.105, 0.06, 32]} />
        <meshStandardMaterial color="#7f8a92" metalness={0.92} roughness={0.32} />
      </mesh>
      {Array.from({ length: 8 }, (_, i) => (
        <mesh key={i} position={[1.282, Math.sin((i / 8) * Math.PI * 2) * 0.082, Math.cos((i / 8) * Math.PI * 2) * 0.082]} rotation={[Math.PI / 2, 0, 0]}>
          <boxGeometry args={[0.024, 0.018, 0.025]} />
          <SteelMaterial color="#5e6971" roughness={0.3} />
        </mesh>
      ))}
    </group>
  );
}

export default function WatchModel() {
  return (
    <div className="watch-canvas">
      <Canvas camera={{ position: [3.15, 2.7, 5.8], fov: 34 }} dpr={[1, 1.75]}>
        <color attach="background" args={['#0a0d11']} />
        <ambientLight intensity={1.0} />
        <spotLight position={[3.5, 5, 6]} intensity={68} angle={0.42} penumbra={0.85} />
        <pointLight position={[-4, -1, 3]} intensity={22} color="#8abbd9" />
        <pointLight position={[0, 3, -3]} intensity={12} color="#d7dfeb" />
        <WatchParts />
        <Sparkles count={28} scale={5} size={1} speed={0.18} opacity={0.2} color="#a5c7d9" />
        <ContactShadows position={[0, -2.35, 0]} opacity={0.42} scale={6} blur={2.5} far={4} />
        <Environment preset="studio" />
        <OrbitControls enablePan={false} minDistance={3.6} maxDistance={8} minPolarAngle={0.45} maxPolarAngle={2.5} />
      </Canvas>
      <span className="drag-hint">DRAG TO ROTATE · SCROLL TO EXPLORE</span>
    </div>
  );
}
