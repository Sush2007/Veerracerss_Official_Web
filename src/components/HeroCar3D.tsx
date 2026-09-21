"use client";

import React, { Suspense, useRef, useState, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, useGLTF, Center, ContactShadows, Environment } from "@react-three/drei";
import * as THREE from "three";

function HeroCarModel({ 
  isInteracting, 
  autoRotate,
  isMobile 
}: { 
  isInteracting: boolean; 
  autoRotate: boolean;
  isMobile: boolean;
}) {
  // Load original intact SolidWorks CAD model
  const { scene } = useGLTF("/car-raw.glb");
  const modelRef = useRef<THREE.Group>(null);

  // Upgrade and tune materials with DoubleSide so all CAD open-surfaces are 100% solid
  const clonedScene = React.useMemo(() => {
    const clone = scene.clone();
    
    clone.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        mesh.castShadow = true;
        mesh.receiveShadow = true;

        if (mesh.geometry) {
          // Recompute smooth vertex normals to eliminate jagged shading
          mesh.geometry.computeVertexNormals();
        }

        if (mesh.material) {
          // Clone material so we don't mutate shared instances
          const origMat = mesh.material as THREE.MeshStandardMaterial;
          const mat = origMat.clone();
          
          // CRITICAL: Set DoubleSide so non-watertight CAD sheets, tubes, and wings are solid from both sides
          mat.side = THREE.DoubleSide;
          mat.shadowSide = THREE.DoubleSide;

          const matName = (mat.name || "").toLowerCase();
          const color = mat.color;

          // 1. Chrome / Polished Steel / Aluminum (Suspension wishbones, pushrods, hubs, brake disks)
          if (
            matName.includes("chrome") || 
            matName.includes("steel") || 
            matName.includes("aluminum") ||
            matName.includes("metal")
          ) {
            mat.metalness = 0.95;
            mat.roughness = 0.12;
            mat.color = new THREE.Color("#CBD5E1"); // Shiny metallic silver
            mat.envMapIntensity = 2.2;
          }
          // 2. Tires & Rubber Components
          else if (matName.includes("rubber")) {
            mat.metalness = 0.05;
            mat.roughness = 0.90;
            mat.color = new THREE.Color("#18181B"); // Deep matte tire black
            mat.envMapIntensity = 0.4;
          }
          // 3. Signature VeerRacerss Racing Red (Aero wingtips, calipers, nose accents)
          else if (
            matName.includes("red") || 
            (color && color.r > 0.6 && color.g < 0.25 && color.b < 0.25)
          ) {
            mat.color = new THREE.Color("#D22730"); // Racing Red
            mat.metalness = 0.35;
            mat.roughness = 0.25;
            mat.envMapIntensity = 1.8;
          }
          // 4. Electric Green Highlights
          else if (
            matName.includes("green") || 
            (color && color.g > 0.6 && color.r < 0.3 && color.b < 0.3)
          ) {
            mat.color = new THREE.Color("#10B981"); // High-visibility Electric Green
            mat.metalness = 0.35;
            mat.roughness = 0.25;
            mat.envMapIntensity = 1.6;
          }
          // 5. Deep Carbon Fiber & Dark Chassis
          else if (
            matName.includes("black") || 
            (color && color.r < 0.15 && color.g < 0.15 && color.b < 0.15)
          ) {
            mat.color = new THREE.Color("#16161A"); // Glossy Carbon Finish
            mat.metalness = 0.60;
            mat.roughness = 0.28;
            mat.envMapIntensity = 1.6;
          }
          // 6. White / Silver Aerodynamic Body Panels
          else if (color && color.r > 0.7 && color.g > 0.7 && color.b > 0.7) {
            mat.color = new THREE.Color("#F1F5F9"); // Crisp white livery
            mat.metalness = 0.40;
            mat.roughness = 0.22;
            mat.envMapIntensity = 1.8;
          }
          // 7. General components fallback
          else {
            mat.metalness = Math.max(0.4, mat.metalness || 0.5);
            mat.roughness = Math.min(0.45, mat.roughness || 0.35);
            mat.envMapIntensity = 1.5;
          }

          mesh.material = mat;
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

  if (!mounted) {
    return (
      <div className="relative w-full h-[240px] min-[380px]:h-[270px] min-[440px]:h-[310px] sm:h-[390px] md:h-[480px] lg:h-[620px] xl:h-[680px] flex items-center justify-center">
        <HeroLoader />
      </div>
    );
  }

  return (
    <div 
      className="relative w-full h-[240px] min-[380px]:h-[270px] min-[440px]:h-[310px] sm:h-[390px] md:h-[480px] lg:h-[620px] xl:h-[680px] cursor-grab active:cursor-grabbing select-none touch-manipulation"
      onPointerDown={() => setIsInteracting(true)}
      onPointerUp={() => setTimeout(() => setIsInteracting(false), 2000)}
    >
      <Suspense fallback={<HeroLoader />}>
        <Canvas
          shadows
          camera={{ 
            position: isMobile ? [3.0, 1.25, 3.6] : [3.4, 1.4, 4.4], 
            fov: isMobile ? 42 : 38 
          }}
          className="w-full h-full"
          gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        >
          <CameraController isMobile={isMobile} />
          {/* HDR Environment Map for Metallic Reflections */}
          <Environment preset="city" />

          {/* Key Lights: Studio Setup */}
          <ambientLight intensity={0.75} />
          
          {/* Main Studio Key Light */}
          <directionalLight
            position={[8, 14, 8]}
            intensity={2.6}
            castShadow
            shadow-mapSize={[1024, 1024]}
          />
          
          {/* Front Nose & Wing Fill Light */}
          <directionalLight position={[0, 4, 8]} intensity={1.6} color="#F8FAFC" />

          {/* Underglow & Rim Light: VeerRacerss Racing Red */}
          <directionalLight position={[-8, 6, -8]} intensity={2.2} color="#D22730" />
          <pointLight position={[0, -1.0, 0]} intensity={1.5} color="#D22730" distance={6} />

          {/* Cool Cyan Separation Light on Rear Wing */}
          <directionalLight position={[-6, 8, 4]} intensity={1.2} color="#38BDF8" />

          {/* 3D Car Model centered at [0, 0, 0] */}
          <HeroCarModel isInteracting={isInteracting} autoRotate={autoRotate} isMobile={isMobile} />

          {/* Contact Ground Shadow aligned beneath tires */}
          <ContactShadows
            position={[0, -0.84, 0]}
            opacity={0.85}
            scale={isMobile ? 7.2 : 8.5}
            blur={2.0}
            far={3.5}
            resolution={512}
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
