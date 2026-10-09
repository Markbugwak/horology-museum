import { useEffect, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { ContactShadows, Environment, OrbitControls, RoundedBox, Text } from '@react-three/drei';
import * as THREE from 'three';

const STEEL = '#8A929A';
const GOLD = '#B89A5E';
const DIAL = '#0F2A26';
const BEZEL = '#0A1B18';
type WatchPartKey = 'bezel' | 'crystal' | 'dial' | 'case';

function SteelMaterial({ color = STEEL, roughness = 0.38 }: { color?: string; roughness?: number }) {
  return <meshPhysicalMaterial color={color} metalness={1} roughness={roughness} clearcoat={0.18} clearcoatRoughness={0.34} />;
}

function WatchParts({ reducedMotion = false, activePart }: { reducedMotion?: boolean; activePart?: WatchPartKey }) {
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
    if (group.current) group.current.position.y = reducedMotion ? 0 : Math.sin(state.clock.elapsedTime * 0.65) * 0.025;
    if (bezel.current) bezel.current.position.z = 0.245 + e * 0.98 + (activePart === "bezel" ? 0.16 : 0);
    if (crystal.current) crystal.current.position.z = 0.32 + e * 1.28 + (activePart === "crystal" ? 0.22 : 0);
    if (dial.current) dial.current.position.z = 0.125 + e * 0.3 + (activePart === "dial" ? 0.12 : 0);
    if (hands.current) hands.current.position.z = 0.205 + e * 0.52 + (activePart === "dial" ? 0.13 : 0);
    if (markers.current) markers.current.position.z = 0.18 + e * 0.36 + (activePart === "dial" ? 0.13 : 0);
  });

  return (
    <group ref={group} rotation={[0.12, -0.32, -0.08]} scale={1.18}>
      {/* Three-piece Oyster-style bracelet: individual links, brushed outer links and polished centre links */}
      {[-1, 1].map((side) => (
        <group key={side} position={[0, 0, -0.025]}>
          {Array.from({ length: 7 }, (_, i) => {
            const y = side * (0.84 + i * 0.235);
            return (
              <group key={i} position={[0, y, 0]}>
                {[-1, 0, 1].map((column) => (
                  <mesh key={column} position={[column * 0.235, 0, column === 0 ? 0.012 : 0]}>
                    <RoundedBox args={[column === 0 ? 0.22 : 0.215, 0.218, column === 0 ? 0.115 : 0.095]} radius={0.025} smoothness={3} />
                    <SteelMaterial color={column === 0 ? '#7C848C' : '#68727B'} roughness={column === 0 ? 0.38 : 0.44} />
                  </mesh>
                ))}
                <mesh position={[0, side * 0.105, -0.005]}>
                  <boxGeometry args={[0.69, 0.018, 0.105]} />
                  <SteelMaterial color="#3E444A" roughness={0.48} />
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
        <SteelMaterial color={activePart === "case" ? "#B89A5E" : "#8A929A"} roughness={0.3} />
      </mesh>

      {/* Lugs that visually connect the case to the bracelet */}
      {[-1, 1].map((side) => [-1, 1].map((x) => (
        <mesh key={`${side}-${x}`} position={[x * 0.56, side * 0.98, -0.025]} rotation={[0, 0, side * x * -0.12]}>
          <RoundedBox args={[0.32, 0.48, 0.16]} radius={0.055} smoothness={4} />
          <SteelMaterial color={activePart === "case" ? "#B89A5E" : "#8A929A"} roughness={0.3} />
        </mesh>
      )))}

      {/* Dark dive bezel with minute graduations and the signature triangle at 12 */}
      <group ref={bezel} position={[0, 0, 0.245]}>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[1.025, 1.025, 0.13, 96]} />
          <SteelMaterial color={activePart === "bezel" ? "#B89A5E" : "#9AA2A9"} roughness={0.22} />
        </mesh>
        <mesh position={[0, 0, 0.078]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.985, 0.985, 0.045, 96]} />
          <meshPhysicalMaterial color={BEZEL} metalness={0.05} roughness={0.25} clearcoat={1} clearcoatRoughness={0.12} />
        </mesh>
        <mesh position={[0, 0, 0.105]}>
          <torusGeometry args={[0.925, 0.045, 12, 96]} />
          <meshPhysicalMaterial color={activePart === "bezel" ? "#B89A5E" : "#59635E"} metalness={0.8} roughness={0.24} clearcoat={0.5} />
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
        <meshStandardMaterial color={activePart === "dial" ? "#25483E" : DIAL} metalness={0.2} roughness={0.55} />
      </mesh>
      {/* Full-size crystal sits above the indices and hands, and separates as its own layer. */}
      <mesh ref={crystal} position={[0, 0, 0.32]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.88, 0.88, 0.018, 96]} />
        <meshPhysicalMaterial color="#E8DFC8" transparent opacity={activePart === "crystal" ? 0.28 : 0.12} roughness={0.05} clearcoat={1} ior={1.5} depthWrite={false} />
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
      <Text position={[0, 0.42, 0.205]} fontSize={0.105} color="#e6e8df" anchorX="center" anchorY="middle" letterSpacing={0.08} fontWeight={700}>HOROLOGY</Text>
      <Text position={[0, 0.30, 0.205]} fontSize={0.044} color="#cbd1c9" anchorX="center" anchorY="middle" letterSpacing={0.03}>MECHANICAL STUDY</Text>
      <Text position={[0, -0.37, 0.205]} fontSize={0.052} color="#d4d8d0" anchorX="center" anchorY="middle" letterSpacing={0.02}>DIVER</Text>
      <Text position={[0, -0.46, 0.205]} fontSize={0.032} color="#aeb9b0" anchorX="center" anchorY="middle">AUTOMATIC</Text>

      {/* Date window and raised cyclops magnifier at 3 o'clock */}
      <mesh position={[0.53, 0.02, 0.211]}>
        <boxGeometry args={[0.19, 0.205, 0.028]} />
        <meshStandardMaterial color="#e5e3d8" roughness={0.34} />
      </mesh>
      <Text position={[0.53, 0.02, 0.231]} fontSize={0.11} color="#1b2224" anchorX="center" anchorY="middle">09</Text>
      <mesh position={[0.53, 0.02, 0.265]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.145, 0.145, 0.018, 48]} />
        <meshPhysicalMaterial color="#d7e5e9" transparent opacity={0.28} roughness={0.06} transmission={0.5} />
      </mesh>

      {/* Three central hands and pinion */}
      <group ref={hands} position={[0, 0, 0.205]}>
        {/* Mercedes-style hour hand */}
        <group rotation={[0, 0, -0.72]}>
          <mesh position={[0, 0.16, 0.025]}>
            <boxGeometry args={[0.07, 0.32, 0.025]} />
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
        <group rotation={[0, 0, 0.22]}>
          <mesh position={[0, 0.23, 0.048]}>
            <boxGeometry args={[0.038, 0.48, 0.024]} />
            <meshStandardMaterial color="#E6D8B0" metalness={0.8} roughness={0.25} />
          </mesh>
        </group>
        {/* Seconds hand */}
        <group rotation={[0, 0, -0.2]}>
          <mesh position={[0, 0, 0.065]}>
            <boxGeometry args={[0.014, 0.72, 0.014]} />
            <meshStandardMaterial color="#B89A5E" metalness={0.8} roughness={0.25} />
          </mesh>
        </group>
        <mesh position={[0, 0, 0.078]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.055, 0.055, 0.035, 32]} />
          <meshStandardMaterial color={GOLD} metalness={0.8} roughness={0.25} />
        </mesh>
        <mesh position={[0, 0, 0.102]}>
          <sphereGeometry args={[0.034, 24, 16]} />
          <meshPhysicalMaterial color="#E8DFC8" metalness={0.7} roughness={0.22} clearcoat={0.8} />
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

export default function WatchModel({ activePart, showHint = true }: { activePart?: WatchPartKey; showHint?: boolean }) {
  const [reducedMotion, setReducedMotion] = useState(false);
  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);
  return (
    <div className="watch-canvas" role="img" aria-label="Interactive three-dimensional conceptual dive watch with a brushed steel bracelet, rotating bezel, luminous indices, contrasting hour and minute hands, and a gold seconds hand">
      <Canvas fallback={<div className="watch-fallback"><strong>MECHANICAL STUDY</strong><span>Three-dimensional preview is unavailable in this browser.</span></div>} camera={{ position: [2.8, 2.0, 8.75], fov: 34 }} dpr={[1, 1.5]} gl={{ toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 0.9, outputColorSpace: THREE.SRGBColorSpace }}>
        <color attach="background" args={['#080B10']} />
        <ambientLight intensity={0.15} />
        <directionalLight position={[-3, 4, 5]} intensity={2.2} color="#FFF3E0" />
        <directionalLight position={[4, 1, 3]} intensity={0.5} color="#9DB4FF" />
        <directionalLight position={[3, 3, -4]} intensity={1.1} color="#C9A45C" />
        <directionalLight position={[0, -4, 2]} intensity={0.3} color="#3A4A5C" />
        <WatchParts reducedMotion={reducedMotion} activePart={activePart} />
        <ContactShadows position={[0, -2.15, 0]} opacity={0.35} scale={5.2} blur={2.2} far={4} />
        <Environment preset="studio" environmentIntensity={0.8} />
        <OrbitControls enablePan={false} enableDamping={!reducedMotion} dampingFactor={0.08} minDistance={5.5} maxDistance={10} minPolarAngle={0.45} maxPolarAngle={2.5} />
      </Canvas>
      {showHint && <span className="drag-hint">DRAG TO ROTATE · SCROLL THE PAGE TO EXPLORE</span>}
    </div>
  );
}
