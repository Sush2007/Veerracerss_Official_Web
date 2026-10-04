"use client";

import React, { Suspense, useRef, useState, useEffect, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, useGLTF, Center, ContactShadows, Environment } from "@react-three/drei";
import * as THREE from "three";

// Shared, reusable material palette to drastically reduce draw calls and GPU state changes
const sharedMaterials = {
  chrome: new THREE.MeshStandardMaterial({
    color: new THREE.Color("#CBD5E1"),
    metalness: 0.95,
    roughness: 0.12,
    envMapIntensity: 2.0,
    side: THREE.DoubleSide,
  }),
  rubber: new THREE.MeshStandardMaterial({
    color: new THREE.Color("#18181B"),
    metalness: 0.05,
    roughness: 0.90,
    envMapIntensity: 0.4,
    side: THREE.DoubleSide,
  }),
  racingRed: new THREE.MeshStandardMaterial({
    color: new THREE.Color("#D22730"),
    metalness: 0.35,
    roughness: 0.25,
    envMapIntensity: 1.8,
    side: THREE.DoubleSide,
  }),
  electricGreen: new THREE.MeshStandardMaterial({
    color: new THREE.Color("#10B981"),
    metalness: 0.35,
    roughness: 0.25,
    envMapIntensity: 1.6,
    side: THREE.DoubleSide,
  }),
  carbon: new THREE.MeshStandardMaterial({
    color: new THREE.Color("#16161A"),
    metalness: 0.60,
    roughness: 0.28,
    envMapIntensity: 1.6,
    side: THREE.DoubleSide,
  }),
  whiteLivery: new THREE.MeshStandardMaterial({
    color: new THREE.Color("#F1F5F9"),
    metalness: 0.40,
    roughness: 0.22,
    envMapIntensity: 1.8,
    side: THREE.DoubleSide,
  }),
  defaultComponent: new THREE.MeshStandardMaterial({
    color: new THREE.Color("#27272A"),
    metalness: 0.45,
    roughness: 0.35,
    envMapIntensity: 1.5,
    side: THREE.DoubleSide,
  }),
};

function HeroCarModel({ 
  isInteracting, 
  autoRotate,
  isMobile 
}: { 
  isInteracting: boolean; 
  autoRotate: boolean;
  isMobile: boolean;
}) {
  // Load original intact SolidWorks CAD model with 100% full raw geometry
  const { scene } = useGLTF("/car-raw.glb");
  const modelRef = useRef<THREE.Group>(null);

  // Apply batched materials so 200+ meshes collapse into ~7 draw calls
  const clonedScene = useMemo(() => {
    const clone = scene.clone();
    
    clone.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;

        if (mesh.material) {
          const origMat = mesh.material as THREE.MeshStandardMaterial;
          const matName = (origMat.name || "").toLowerCase();
          const color = origMat.color;

          // 1. Chrome / Polished Steel / Aluminum
          if (
            matName.includes("chrome") || 
            matName.includes("steel") || 
            matName.includes("aluminum") ||
            matName.includes("metal")
          ) {
            mesh.material = sharedMaterials.chrome;
          }
          // 2. Tires & Rubber Components
          else if (matName.includes("rubber")) {
            mesh.material = sharedMaterials.rubber;
          }
          // 3. Signature VeerRacerss Racing Red
          else if (
            matName.includes("red") || 
            (color && color.r > 0.6 && color.g < 0.25 && color.b < 0.25)
          ) {
            mesh.material = sharedMaterials.racingRed;
          }
          // 4. Electric Green Highlights
          else if (
            matName.includes("green") || 
            (color && color.g > 0.6 && color.r < 0.3 && color.b < 0.3)
          ) {
            mesh.material = sharedMaterials.electricGreen;
          }
          // 5. Deep Carbon Fiber & Dark Chassis
          else if (
            matName.includes("black") || 
            (color && color.r < 0.15 && color.g < 0.15 && color.b < 0.15)
          ) {
            mesh.material = sharedMaterials.carbon;
          }
          // 6. White / Silver Aerodynamic Body Panels
          else if (color && color.r > 0.7 && color.g > 0.7 && color.b > 0.7) {
            mesh.material = sharedMaterials.whiteLivery;
          }
          // 7. General components fallback
          else {
            mesh.material = sharedMaterials.defaultComponent;
          }
        }
      }
    });
    return clone;
  }, [scene]);

  useFrame((_, delta) => {
    if (!isInteracting && autoRotate && modelRef.current) {
      // Smooth turntable rotation around vertical Y axis
      modelRef.current.rotation.y += delta * 0.35;
    }
  });

  return (
    <group ref={modelRef}>
      {/* 
        SolidWorks Z is vertical (Height ~1.42m). 
        Rotate X by -90 deg to align with Three.js Y-up.
        Rotate Y by -45 deg for bold 3/4 hero angle.
      */}
      <Center>
        <primitive 
          object={clonedScene} 
          rotation={[-Math.PI / 2, 0, -Math.PI / 3]} 
          scale={isMobile ? 1.08 : 1.18}
        />
      </Center>
    </group>
  );
}

function CameraController({ isMobile }: { isMobile: boolean }) {
  const { camera } = useThree();
  useEffect(() => {
    if (isMobile) {
      camera.position.set(3.0, 1.25, 3.6);
      if ('fov' in camera) {
        (camera as THREE.PerspectiveCamera).fov = 42;
        camera.updateProjectionMatrix();
      }
    } else {
      camera.position.set(3.4, 1.4, 4.4);
      if ('fov' in camera) {
        (camera as THREE.PerspectiveCamera).fov = 38;
        camera.updateProjectionMatrix();
      }
    }
  }, [isMobile, camera]);
  return null;
}

function HeroLoader() {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
      <div className="w-12 h-12 sm:w-14 sm:h-14 border-2 border-white/10 border-t-racing-red rounded-full animate-spin mb-3 sm:mb-4"></div>
      <span className="text-[10px] sm:text-[11px] font-mono tracking-[0.25em] uppercase text-white/60">
        RENDERING SOLIDWORKS DIGITAL TWIN...
      </span>
      <span className="text-white/30 text-[8px] sm:text-[9px] font-mono mt-1">APPLYING DOUBLE-SIDED AUTOMOTIVE SHADERS</span>
    </div>
  );
}

export default function HeroCar3D() {
  const [isInteracting, setIsInteracting] = useState(false);
  const [autoRotate] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isInView, setIsInView] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const controlsRef = useRef<any>(null);

  useEffect(() => {
    setMounted(true);
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Viewport Observer: Pause WebGL rendering loop when user scrolls past Hero section
  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
      },
      { rootMargin: "150px", threshold: 0 }
    );
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [mounted]);

  if (!mounted) {
    return (
      <div className="relative w-full h-[240px] min-[380px]:h-[270px] min-[440px]:h-[310px] sm:h-[390px] md:h-[480px] lg:h-[620px] xl:h-[680px] flex items-center justify-center">
        <HeroLoader />
      </div>
    );
  }

  return (
    <div 
      ref={containerRef}
      className="relative w-full h-[240px] min-[380px]:h-[270px] min-[440px]:h-[310px] sm:h-[390px] md:h-[480px] lg:h-[620px] xl:h-[680px] cursor-grab active:cursor-grabbing select-none touch-manipulation"
      onPointerDown={() => setIsInteracting(true)}
      onPointerUp={() => setTimeout(() => setIsInteracting(false), 2000)}
    >
      <Suspense fallback={<HeroLoader />}>
        <Canvas
          frameloop={isInView ? "always" : "never"}
          dpr={[1, isMobile ? 1.25 : 1.5]}
          camera={{ 
            position: isMobile ? [3.0, 1.25, 3.6] : [3.4, 1.4, 4.4], 
            fov: isMobile ? 42 : 38 
          }}
          className="w-full h-full"
          gl={{ 
            antialias: true, 
            alpha: true, 
            powerPreference: "high-performance",
            precision: isMobile ? "mediump" : "highp",
            stencil: false,
            depth: true
          }}
        >
          <CameraController isMobile={isMobile} />
          {/* HDR Environment Map for Metallic Reflections */}
          <Environment preset="city" />

          {/* Key Lights: Studio Setup */}
          <ambientLight intensity={0.75} />
          
          {/* Main Studio Key Light (Optimized without shadow map depth pass) */}
          <directionalLight position={[8, 14, 8]} intensity={2.6} />
          
          {/* Front Nose & Wing Fill Light */}
          <directionalLight position={[0, 4, 8]} intensity={1.6} color="#F8FAFC" />

          {/* Underglow & Rim Light: VeerRacerss Racing Red */}
          <directionalLight position={[-8, 6, -8]} intensity={2.2} color="#D22730" />
          <pointLight position={[0, -1.0, 0]} intensity={1.5} color="#D22730" distance={6} />

          {/* Cool Cyan Separation Light on Rear Wing */}
          <directionalLight position={[-6, 8, 4]} intensity={1.2} color="#38BDF8" />

          {/* 3D Car Model centered at [0, 0, 0] */}
          <HeroCarModel isInteracting={isInteracting} autoRotate={autoRotate} isMobile={isMobile} />

          {/* Contact Ground Shadow aligned beneath tires (Fast 256 resolution) */}
          <ContactShadows
            position={[0, -0.84, 0]}
            opacity={0.85}
            scale={isMobile ? 7.2 : 8.5}
            blur={2.2}
            far={3.5}
            resolution={256}
            color="#000000"
          />

          {/* Orbit Controls: ZOOM DISABLED */}
          <OrbitControls
            ref={controlsRef}
            target={[0, 0, 0]}
            enablePan={false}
            enableZoom={false}
            maxPolarAngle={Math.PI / 2 - 0.05}
            minPolarAngle={Math.PI / 8}
            dampingFactor={0.08}
            onStart={() => setIsInteracting(true)}
            onEnd={() => setTimeout(() => setIsInteracting(false), 2500)}
          />
        </Canvas>
      </Suspense>

      {/* Rotation Hint */}
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 pointer-events-none z-10 flex items-center gap-2 bg-black/60 backdrop-blur-md border border-white/10 px-3.5 py-1 text-[9px] font-mono tracking-widest uppercase text-white/50 whitespace-nowrap">
        <span className="w-1.5 h-1.5 rounded-full bg-racing-red animate-pulse"></span>
        <span>DRAG TO ROTATE 360°</span>
      </div>
    </div>
  );
}

useGLTF.preload("/car-raw.glb");

