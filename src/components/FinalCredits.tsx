"use client";

import React, { useRef, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment } from "@react-three/drei";
import * as THREE from "three";

function MetallicKnot() {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  
  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += delta * (hovered ? 0.8 : 0.4);
      meshRef.current.rotation.y += delta * (hovered ? 1.0 : 0.5);
      
      const targetScale = hovered ? 1.1 : 1.0;
      meshRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1);
    }
  });

  return (
    <mesh 
      ref={meshRef} 
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      <torusKnotGeometry args={[1.2, 0.4, 256, 64]} />
      <meshStandardMaterial 
        color="#ffffff" 
        metalness={1} 
        roughness={0.1} 
        envMapIntensity={2.5} 
      />
    </mesh>
  );
}

export default function FinalCredits() {
  const [timeString, setTimeString] = useState("22:26:00");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeString(
        now.toLocaleTimeString("en-IN", {
          timeZone: "Asia/Kolkata",
          hour12: false,
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="h-screen w-full bg-[#050505] p-6 flex flex-col text-white font-sans select-none">
      {/* Main Box */}
      <div className="border border-white/20 w-full h-full flex flex-col relative overflow-hidden">
        
        {/* Header (Top Row) */}
        <div className="border-b border-white/20 p-6 md:p-8 flex items-center flex-shrink-0">
          <h2 className="text-[10vw] md:text-8xl font-black uppercase tracking-tighter leading-none">
            LET&apos;S CONNECT
          </h2>
        </div>

        {/* Middle Row (4 Columns) */}
        <div className="grid grid-cols-2 md:grid-cols-4 border-b border-white/20 flex-shrink-0">
          
          {/* Cell 1 (NAME) */}
          <div className="border-r border-white/20 flex flex-col border-b md:border-b-0">
            <div className="text-[10px] text-white/40 uppercase p-4 border-b border-white/10 tracking-[0.2em]">
              NAME -{">"}
            </div>
            <div className="text-xl font-bold p-6">
              ★ Pranjay Rathore
            </div>
          </div>

          {/* Cell 2 (EMAIL) */}
          <div className="md:border-r border-white/20 flex flex-col border-b md:border-b-0">
            <div className="text-[10px] text-white/40 uppercase p-4 border-b border-white/10 tracking-[0.2em]">
              EMAIL -{">"}
            </div>
            <a href="mailto:awer.mov@gmail.com" className="text-sm font-semibold p-6 block hover:text-white/50 transition-colors">
              awer.mov@gmail.com
            </a>
          </div>

          {/* Cell 3 (PHONE) */}
          <div className="border-r border-white/20 flex flex-col">
            <div className="text-[10px] text-white/40 uppercase p-4 border-b border-white/10 tracking-[0.2em]">
              PHONE -{">"}
            </div>
            <a href="tel:+919109300253" className="text-sm font-semibold p-6 block hover:text-white/50 transition-colors">
              +91 91093 00253
            </a>
          </div>

          {/* Cell 4 (LOCATION) */}
          <div className="flex flex-col">
            <div className="text-[10px] text-white/40 uppercase p-4 border-b border-white/10 tracking-[0.2em]">
              TARGET HUB -{">"}
            </div>
            <div className="p-6">
              <span className="text-sm font-semibold block">Bangalore, India</span>
              <span className="text-xs text-white/50 mt-1 block">Available for relocation / on-site</span>
            </div>
          </div>
        </div>

        {/* Bottom Row (2 Columns) */}
        <div className="grid grid-cols-1 md:grid-cols-2 flex-grow overflow-hidden relative">
          
          {/* Left Cell (SYSTEM STATUS & AVAILABILITY) */}
          <div className="border-b md:border-b-0 md:border-r border-white/20 flex flex-col justify-between p-0 z-10 bg-[#050505]">
            <div className="text-[10px] text-white/40 uppercase p-4 border-b border-white/20 tracking-[0.2em]">
              STATUS -{">"}
            </div>
            <div className="flex flex-col p-6 h-full">
              {/* Item 1 */}
              <div className="flex items-center">
                <div className="w-2 h-2 rounded-full bg-[#10b981] animate-pulse"></div>
                <div className="text-sm font-bold tracking-widest text-white ml-3">
                  OPEN FOR ROLES // Q3 2026
                </div>
              </div>
              
              {/* Item 2 */}
              <div className="mt-6">
                <div className="text-xs text-white/50 tracking-widest">
                  CURRENT ACADEMIC BASE -{">"} VIT BHOPAL, IN
                </div>
                <div className="text-xs text-white/50 tracking-widest mt-1">
                  IST // {timeString}
                </div>
              </div>

              {/* Item 3 */}
              <div className="text-[10px] text-white/30 tracking-[0.2em] uppercase mt-auto mb-4 border-t border-white/10 pt-4">
                FOCUS: AI DIRECTING, GENERATIVE VIDEO, CONTENT STRATEGY
              </div>
            </div>
          </div>

          {/* Right Cell (THE VISUAL CORE) */}
          <div className="relative flex items-center justify-end overflow-hidden p-8 z-0 bg-[#050505]">
            
            {/* The Animation */}
            <div className="absolute inset-0 w-full h-full">
              <Canvas camera={{ position: [0, 0, 10], fov: 45 }}>
                <ambientLight intensity={0.5} />
                <directionalLight position={[10, 10, 10]} intensity={2} color="#ffffff" />
                <directionalLight position={[-10, -10, -10]} intensity={1} color="#ffffff" />
                <Environment preset="city" />
                <MetallicKnot />
              </Canvas>
            </div>

            {/* The Text */}
            <div className="relative z-10 max-w-sm pointer-events-none mr-4">
              <p className="font-serif italic text-3xl md:text-5xl text-white leading-tight drop-shadow-[0_4px_20px_rgba(0,0,0,0.8)] text-right">
                leveraging the Attention Economy
              </p>
            </div>

            {/* Badge */}
            <div className="absolute bottom-6 right-6 z-10 pointer-events-none">
              <p className="text-[9px] uppercase tracking-widest text-white/40 bg-[#050505]/50 px-2 py-1 rounded backdrop-blur-sm">
                DESIGNED & CODED BY PRANJAY RATHORE // PRECISION PROMPTING
              </p>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
