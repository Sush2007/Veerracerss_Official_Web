"use client";

import React, { Suspense, useRef, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, useGLTF, Center, ContactShadows, Float } from "@react-three/drei";
import * as THREE from "three";
import { RotateCw, ZoomIn, Eye, Sparkles } from "lucide-react";

function CarModel({ autoRotate }: { autoRotate: boolean }) {
  const { scene } = useGLTF("/car-raw.glb");
  const modelRef = useRef<THREE.Group>(null);

  // Ensure all meshes have standard PBR properties and DoubleSide
  const clonedScene = React.useMemo(() => {
    const clone = scene.clone();
    
    clone.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        mesh.castShadow = true;
        mesh.receiveShadow = true;

        if (mesh.geometry) {
          mesh.geometry.computeVertexNormals();
        }
        
        if (mesh.material) {
          const mat = mesh.material as THREE.MeshStandardMaterial;
          mat.side = THREE.DoubleSide;
          mat.shadowSide = THREE.DoubleSide;
          mat.roughness = Math.max(0.2, mat.roughness ?? 0.4);
          mat.metalness = Math.min(0.85, mat.metalness ?? 0.5);
          mat.envMapIntensity = 1.4;
        }
      }
    });
    return clone;
  }, [scene]);

  useFrame((_, delta) => {
    if (autoRotate && modelRef.current) {
      modelRef.current.rotation.y += delta * 0.4;
    }
  });

  return (
    <group ref={modelRef}>
      {/* 
        SolidWorks export has Z as vertical (Height ~1.42m). 
        Rotating X by -Math.PI / 2 aligns it with Three.js Y-up.
        Rotating Y by -Math.PI / 4 sets an aggressive 3/4 front angle.
      */}
      <Center top>
        <primitive 
          object={clonedScene} 
          rotation={[-Math.PI / 2, 0, -Math.PI / 4]} 
          scale={1}
        />
      </Center>
    </group>
  );
}

function Loader() {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#0A0A0A]/90 z-20 backdrop-blur-md">
      <div className="w-16 h-16 border-2 border-white/10 border-t-racing-red rounded-full animate-spin mb-4"></div>
      <div className="flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-racing-red animate-pulse"></span>
        <span className="text-white font-mono text-xs tracking-[0.25em] uppercase">
          STREAMING 3D CAD MESH // AETHER
        </span>
      </div>
      <span className="text-white/40 text-[10px] font-mono mt-2">
        4.0 MB OPTIMIZED GEOMETRY
      </span>
    </div>
  );
}

export default function CarViewer3D() {
  const [autoRotate, setAutoRotate] = useState(true);
  const [mounted, setMounted] = useState(false);
  const controlsRef = useRef<any>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleResetView = () => {
    if (controlsRef.current) {
      controlsRef.current.reset();
    }
  };

  if (!mounted) {
    return (
      <div className="relative w-full h-[550px] md:h-[650px] bg-[#0A0A0A] border border-white/5 flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  return (
    <div className="relative w-full h-[550px] md:h-[650px] bg-[#0A0A0A] border border-white/10 overflow-hidden group select-none">
      {/* Background Telemetry Grid & Lighting Glow */}
      <div className="absolute inset-0 telemetry-grid opacity-15 pointer-events-none"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-racing-red/10 rounded-full blur-[140px] pointer-events-none"></div>

      {/* Top Bar HUD */}
      <div className="absolute top-4 left-4 right-4 z-10 flex items-center justify-between pointer-events-none">
        <div className="flex items-center gap-3 bg-black/70 backdrop-blur-md border border-white/10 px-4 py-2 pointer-events-auto">
          <span className="w-2 h-2 rounded-full bg-racing-red animate-pulse"></span>
          <span className="font-display font-black text-white text-xs tracking-wider uppercase">
            AETHER 2025 // 3D CAD TWIN
          </span>
          <span className="text-white/30 text-xs">|</span>
          <span className="text-[10px] font-mono text-white/60 tracking-widest uppercase">
            100% REAL SOLIDWORKS GEOMETRY
          </span>
        </div>

        {/* Controls Overlay */}
        <div className="flex items-center gap-2 pointer-events-auto">
          <button
            onClick={() => setAutoRotate(!autoRotate)}
            className={`px-3 py-1.5 text-[10px] font-sans font-bold tracking-wider uppercase border transition-all flex items-center gap-1.5 ${
              autoRotate
                ? "bg-racing-red text-white border-racing-red shadow-[0_0_15px_rgba(210,39,48,0.5)]"
                : "bg-black/60 text-white/60 border-white/10 hover:text-white hover:border-white/30"
            }`}
            title="Toggle 360 Turntable Spin"
          >
            <RotateCw className="w-3 h-3" />
            <span>{autoRotate ? "SPINNING" : "PAUSED"}</span>
          </button>

          <button
            onClick={handleResetView}
            className="px-3 py-1.5 text-[10px] font-sans font-bold tracking-wider uppercase bg-black/60 text-white/60 border border-white/10 hover:text-white hover:border-white/30 transition-all flex items-center gap-1.5"
            title="Reset Camera View"
          >
            <Eye className="w-3 h-3" />
            <span>RESET</span>
          </button>
        </div>
      </div>

      {/* Canvas 3D Viewport */}
      <Suspense fallback={<Loader />}>
        <Canvas
          shadows
          camera={{ position: [3.5, 2.0, 4.5], fov: 42 }}
          className="w-full h-full cursor-grab active:cursor-grabbing"
          gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        >
          {/* Studio Lights */}
          <ambientLight intensity={0.8} />
          <directionalLight
            position={[10, 15, 10]}
            intensity={1.8}
            castShadow
            shadow-mapSize={[2048, 2048]}
            shadow-camera-left={-5}
            shadow-camera-right={5}
            shadow-camera-top={5}
            shadow-camera-bottom={-5}
          />
          {/* Subtle Red Rim Light */}
          <directionalLight position={[-10, 8, -10]} intensity={1.2} color="#D22730" />
          <pointLight position={[0, -2, 0]} intensity={0.5} color="#D22730" />

          {/* 3D Car Model */}
          <CarModel autoRotate={autoRotate} />

          {/* Realistic Floor Contact Shadow */}
          <ContactShadows
            position={[0, 0, 0]}
            opacity={0.85}
            scale={10}
            blur={1.8}
            far={4}
            resolution={512}
            color="#000000"
          />

          {/* Orbit Camera Controls without zoom */}
          <OrbitControls
            ref={controlsRef}
            enablePan={false}
            enableZoom={false}
            maxPolarAngle={Math.PI / 2 - 0.05} // Keep camera above floor
            minPolarAngle={Math.PI / 6}
            dampingFactor={0.08}
          />
        </Canvas>
      </Suspense>

      {/* Bottom Hint Banner */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 pointer-events-none z-10 flex items-center gap-4 bg-black/70 backdrop-blur-md border border-white/10 px-5 py-2 text-[10px] font-mono tracking-widest uppercase text-white/50">
        <span className="flex items-center gap-1.5">
          <RotateCw className="w-3 h-3 text-racing-red" /> DRAG TO ROTATE 360°
        </span>
      </div>
    </div>
  );
}

// Preload the model
useGLTF.preload("/car-raw.glb");
