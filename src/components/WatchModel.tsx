import { useEffect, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { ContactShadows, Environment, OrbitControls, RoundedBox, Text } from '@react-three/drei';
import * as THREE from 'three';

const STEEL = '#8A929A';
const GOLD = '#B89A5E';
const DIAL = '#0F2A26';
type WatchPartKey = 'bezel' | 'crystal' | 'hands' | 'case';

function SteelMaterial({ color = STEEL, roughness = 0.42, opacity = 1 }: { color?: string; roughness?: number; opacity?: number }) {
  return <meshPhysicalMaterial color={color} metalness={0.86} roughness={roughness} anisotropy={0.5} envMapIntensity={0.42} clearcoat={0.18} clearcoatRoughness={0.36} transparent={opacity < 1} opacity={opacity} />;
}


function WatchParts({ reducedMotion = false, activePart }: { reducedMotion?: boolean; activePart?: WatchPartKey }) {
  const group = useRef<THREE.Group>(null);
  const bezel = useRef<THREE.Group>(null);
  const caseLayer = useRef<THREE.Group>(null);
  const crystal = useRef<THREE.Mesh>(null);
  const dial = useRef<THREE.Mesh>(null);
  const hands = useRef<THREE.Group>(null);
  const markers = useRef<THREE.Group>(null);
  const explode = useRef(0);
  const dim = (part: WatchPartKey) => activePart && activePart !== part ? 0.3 : 1;

  useEffect(() => {
    const update = () => {
      const section = document.getElementById('anatomy');
      if (!section) return;
      const rect = section.getBoundingClientRect();
      const progress = THREE.MathUtils.clamp((window.innerHeight - rect.top) / (rect.height + window.innerHeight), 0, 1);
      const amount = progress < 0.25 ? 0 : progress < 0.7 ? (progress - 0.25) / 0.45 : Math.max(0, (1 - progress) / 0.3);
      explode.current = THREE.MathUtils.clamp(amount, 0, 1);
    };
    window.addEventListener('scroll', update, { passive: true });
    update();
    return () => window.removeEventListener('scroll', update);
  }, []);

  useFrame((state) => {
    const e = THREE.MathUtils.clamp(explode.current, 0, 1);
    if (group.current) group.current.position.y = reducedMotion ? 0 : Math.sin(state.clock.elapsedTime * 0.65) * 0.025;
    if (bezel.current) bezel.current.position.z = 0.245 + e * 0.88 + (activePart === "bezel" ? 0.18 : 0);
    if (caseLayer.current) caseLayer.current.position.z = -e * 0.42 + (activePart === "case" ? -0.16 : 0);
    if (crystal.current) crystal.current.position.z = 0.32 + e * 1.15 + (activePart === "crystal" ? 0.24 : 0);
    if (dial.current) dial.current.position.z = 0.125 + e * 0.28;
    if (hands.current) hands.current.position.z = 0.205 + e * 0.36 + (activePart === "hands" ? 0.14 : 0);
    if (markers.current) markers.current.position.z = 0.18 + e * 0.30 + (activePart === "hands" ? 0.14 : 0);
  });

  return (
    <group ref={group} rotation={[0.12, -0.32, -0.08]} scale={1.18}>
      {/* Three-piece articulated bracelet with individually modelled steel links. */}
      {[-1, 1].map((side) => (
        <group key={side} position={[0, 0, -0.025]}>
          {Array.from({ length: 7 }, (_, i) => {
            const y = side * (0.84 + i * 0.235);
            return (
              <group key={i} position={[0, y, 0]} rotation={[0, 0, side * i * 0.012]}>
                {[-1, 0, 1].map((column) => (
                  <mesh key={column} position={[column * 0.32, 0, column === 0 ? 0.012 : 0]}>
                    <RoundedBox args={[0.30, 0.218, column === 0 ? 0.105 : 0.09]} radius={0.035} smoothness={4} />
                    <SteelMaterial color={column === 0 ? '#68747B' : '#46515A'} roughness={column === 0 ? 0.36 : 0.48} opacity={0.96} />
                  </mesh>
                ))}
              </group>
            );
          })}
        </group>
      ))}

      {/* Case shell moves rearward as its own exploded layer. */}
      <group ref={caseLayer}>
      {/* Case back and substantial stainless-steel case. Cylinders are rotated so the dial faces forward. */}
      <mesh position={[0, 0, -0.115]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[1.025, 1.025, 0.19, 96]} />
        <SteelMaterial color="#68747e" roughness={0.31} opacity={dim('case')} />
      </mesh>
      <mesh position={[0, 0, -0.005]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[1.055, 1.055, 0.22, 96]} />
        <SteelMaterial color={activePart === "case" ? "#B89A5E" : "#8A929A"} roughness={0.3} opacity={dim('case')} />
      </mesh>

      {/* Lugs that visually connect the case to the bracelet */}
      {[-1, 1].map((side) => [-1, 1].map((x) => (
        <mesh key={`${side}-${x}`} position={[x * 0.56, side * 0.98, -0.025]} rotation={[0, 0, side * x * -0.12]}>
          <RoundedBox args={[0.32, 0.48, 0.16]} radius={0.055} smoothness={4} />
          <SteelMaterial color={activePart === "case" ? "#B89A5E" : "#8A929A"} roughness={0.3} opacity={dim('case')} />
        </mesh>
      )))}

      </group>

      {/* Bezel is a polished gold ring only: no solid disc sits over the dial. */}
      <group ref={bezel} position={[0, 0, 0.245]}>
        <mesh position={[0, 0, 0.045]}>
          <torusGeometry args={[0.965, 0.068, 16, 120]} />
          <meshPhysicalMaterial color={activePart === "bezel" ? "#D4B66F" : GOLD} metalness={1} roughness={0.18} envMapIntensity={0.8} clearcoat={1} clearcoatRoughness={0.12} transparent={dim('bezel') < 1} opacity={dim('bezel')} />
        </mesh>
        <mesh position={[0, 0, 0.036]}>
          <torusGeometry args={[0.875, 0.012, 8, 120]} />
          <meshStandardMaterial color="#B89A5E" metalness={0.85} roughness={0.24} transparent={dim('bezel') < 1} opacity={dim('bezel')} />
        </mesh>
        {Array.from({ length: 60 }, (_, i) => {
          const a = (i / 60) * Math.PI * 2;
          const major = i % 5 === 0;
          return (
            <mesh key={i} position={[Math.sin(a) * 0.91, Math.cos(a) * 0.91, 0.055]} rotation={[0, 0, -a]}>
              <boxGeometry args={[major ? 0.018 : 0.009, major ? 0.05 : 0.026, 0.008]} />
              <meshStandardMaterial color={major ? '#E8DFC8' : '#B89A5E'} metalness={0.7} roughness={0.3} transparent={dim('bezel') < 1} opacity={dim('bezel')} />
            </mesh>
          );
        })}
        <mesh position={[0, 0.91, 0.062]} rotation={[0, 0, Math.PI]}>
          <coneGeometry args={[0.045, 0.075, 3]} />
          <meshStandardMaterial color="#E8DFC8" metalness={0.3} roughness={0.4} transparent={dim('bezel') < 1} opacity={dim('bezel')} />
        </mesh>
      </group>

      {/* Glossy black dial */}
      <mesh ref={dial} position={[0, 0, 0.125]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.865, 0.865, 0.035, 96]} />
        <meshStandardMaterial color={DIAL} metalness={0.2} roughness={0.55} transparent={Boolean(activePart && activePart !== "hands")} opacity={dim("hands")} />
      </mesh>
      {/* Full-size crystal sits above the indices and hands, and separates as its own layer. */}
      <mesh ref={crystal} position={[0, 0, 0.32]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.88, 0.88, 0.018, 96]} />
        <meshPhysicalMaterial color="#E8DFC8" transparent opacity={activePart === "crystal" ? 0.2 : activePart ? 0.045 : 0.12} roughness={0.05} metalness={0} clearcoat={1} ior={1.5} envMapIntensity={0.8} depthWrite={false} />
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
                  <meshStandardMaterial color="#E8DFC8" emissive="#9f946c" emissiveIntensity={0.15} transparent={activePart && activePart !== "hands"} opacity={dim("hands")} />
                </mesh>
              ) : (
                <mesh rotation={[0, 0, -a]}>
                  <boxGeometry args={[w, h, 0.035]} />
                  <meshStandardMaterial color="#E8DFC8" emissive="#9f946c" emissiveIntensity={0.15} metalness={0.3} roughness={0.4} transparent={activePart && activePart !== "hands"} opacity={dim("hands")} />
                </mesh>
              )}
              {special && <mesh position={[0, 0, -0.008]}><boxGeometry args={[w + 0.035, h + 0.035, 0.018]} /><meshStandardMaterial color="#9eaa9e" metalness={0.55} roughness={0.3} /></mesh>}
            </group>
          );
        })}
      </group>

      {/* Keep the dial free of invented manufacturer lettering. */}

      {/* Flush date aperture, kept free of manufacturer-specific magnifier styling. */}
      <mesh position={[0.53, 0.02, 0.211]}>
        <boxGeometry args={[0.19, 0.205, 0.028]} />
        <meshStandardMaterial color="#e5e3d8" roughness={0.34} />
      </mesh>
      <Text position={[0.53, 0.02, 0.231]} fontSize={0.11} color="#1b2224" anchorX="center" anchorY="middle">09</Text>

      {/* Three central hands and pinion */}
      <group ref={hands} position={[0, 0, 0.205]}>
        {/* Luminous hour hand with a geometric counterweight. */}
        <group rotation={[0, 0, -0.72]}>
          <mesh position={[0, 0.16, 0.025]}>
            <boxGeometry args={[0.07, 0.32, 0.025]} />
            <meshStandardMaterial color="#E6D8B0" metalness={0.8} roughness={0.25} transparent={activePart && activePart !== "hands"} opacity={dim("hands")} />
          </mesh>
        </group>
        {/* Minute hand */}
        <group rotation={[0, 0, 0.22]}>
          <mesh position={[0, 0.23, 0.048]}>
            <boxGeometry args={[0.038, 0.48, 0.024]} />
            <meshStandardMaterial color="#E6D8B0" metalness={0.8} roughness={0.25} transparent={activePart && activePart !== "hands"} opacity={dim("hands")} />
          </mesh>
        </group>
        {/* Seconds hand */}
        <group rotation={[0, 0, -0.2]}>
          <mesh position={[0, 0, 0.065]}>
            <boxGeometry args={[0.014, 0.72, 0.014]} />
            <meshStandardMaterial color="#B89A5E" metalness={0.8} roughness={0.25} transparent={activePart && activePart !== "hands"} opacity={dim("hands")} />
          </mesh>
        </group>
        <mesh position={[0, 0, 0.078]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.055, 0.055, 0.035, 32]} />
          <meshStandardMaterial color={GOLD} metalness={0.8} roughness={0.25} transparent={activePart && activePart !== "hands"} opacity={dim("hands")} />
        </mesh>
        <mesh position={[0, 0, 0.102]}>
          <sphereGeometry args={[0.034, 24, 16]} />
          <meshPhysicalMaterial color="#E8DFC8" metalness={0.7} roughness={0.22} clearcoat={0.8} transparent={activePart && activePart !== "hands"} opacity={dim("hands")} />
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
      <Canvas fallback={<div className="watch-fallback"><strong>MECHANICAL STUDY</strong><span>Three-dimensional preview is unavailable in this browser.</span></div>} camera={{ position: [2.4, 1.75, 8.5], fov: 30 }} dpr={[1, 1.5]} gl={{ toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 0.9, outputColorSpace: THREE.SRGBColorSpace }}>
        <color attach="background" args={['#080B10']} />
        <hemisphereLight args={["#d9dfdf", "#1b211d", 0.15]} />
        <directionalLight position={[-3, 4, 5]} intensity={1.55} color="#FFF3E0" />
        <directionalLight position={[4, 1, 3]} intensity={0.5} color="#9DB4FF" />
        <directionalLight position={[3, 3, -4]} intensity={1.1} color="#C9A45C" />
        <directionalLight position={[0, -4, 2]} intensity={0.3} color="#3A4A5C" />
        <WatchParts reducedMotion={reducedMotion} activePart={activePart} />
        <ContactShadows position={[0, -2.15, 0]} opacity={0.35} scale={5.2} blur={2.2} far={4} />
        <Environment preset="studio" environmentIntensity={0.8} />
        <OrbitControls enablePan={false} enableDamping={!reducedMotion} dampingFactor={0.08} minDistance={5.5} maxDistance={10} minPolarAngle={0.45} maxPolarAngle={2.5} />
      </Canvas>
      {showHint && <span className="drag-hint">SCROLL TO SEPARATE LAYERS · DRAG TO INSPECT</span>}
    </div>
  );
}
