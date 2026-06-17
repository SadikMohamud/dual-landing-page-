import React, { useState, useEffect, useRef } from 'react';
import { 
  Menu, 
  X, 
  ArrowUpRight, 
  Mail, 
  ChevronRight, 
  Layers2
} from 'lucide-react';

// Interfaces for our interactive elements
interface Project {
  id: string;
  num: string;
  title: string;
  subtitle: string;
  description: string;
  image: string;
  metadata: {
    ratio: string;
    focal: string;
    stock: string;
    speed: string;
  };
}

export default function ExcaliburLanding() {
  // --- CORE REQUIRED STATES ---
  const [aboutOpen, setAboutOpen] = useState<boolean>(false);
  const [activeProjectIndex, setActiveProjectIndex] = useState<number>(0);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isMobile, setIsMobile] = useState<boolean>(false);

  // About panel contact builder states
  const [estimatorBudget, setEstimatorBudget] = useState<string>('$50K - $100K');
  const [estimatorScope, setEstimatorScope] = useState<string>('Tactile Editorial Typography & Layouts');
  const [estimatorTimeline, setEstimatorTimeline] = useState<string>('3 Months');

  const containerRef = useRef<HTMLDivElement>(null);

  // --- SUBTLE INTERACTIVE CURSOR REFS & STATE ---
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const mousePos = useRef({ x: -100, y: -100 });
  const ringPos = useRef({ x: -100, y: -100 });
  const [isHovered, setIsHovered] = useState<boolean>(false);

  // --- PORTFOLIO DATA (LEFT CANVASES) ---
  const projects: Project[] = [
    {
      id: "proj-1",
      num: "01",
      title: "ARCHIVAL SYNERGY",
      subtitle: "CREATIVE DIRECTION // FASHION SYSTEM",
      description: "A radical high-contrast design system built for luxury fashion architecture, linking tactile editorial typography with smooth liquid motion mechanics.",
      image: "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&q=80&w=1200",
      metadata: {
        ratio: "16:9 NATIVE",
        focal: "85MM F/1.2",
        stock: "TRI-X 400",
        speed: "60 FPS"
      }
    },
    {
      id: "proj-2",
      num: "02",
      title: "KINETIC SHADERS",
      subtitle: "GENESIS SHADER PIPELINE",
      description: "Custom WebGL interfaces rendering procedural particle dynamics that react fluidly to the velocity vectors of user interaction.",
      image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=1200",
      metadata: {
        ratio: "2.39:1 CINEMA",
        focal: "35MM F/1.4",
        stock: "EKTAR 100",
        speed: "120 FPS"
      }
    },
    {
      id: "proj-3",
      num: "03",
      title: "RAW METROPOLIS",
      subtitle: "BRUTALIST ARCHITECTURAL GRAPH",
      description: "Typographic layouts modeled after modernist architecture, utilizing heavy sans-serif grid patterns to command screen visual attention.",
      image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=1200",
      metadata: {
        ratio: "4:3 SQUARE",
        focal: "24MM F/2.8",
        stock: "PAN F 50",
        speed: "90 FPS"
      }
    }
  ];

  // Monitor screen resize for mobile design adaptation
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // --- MAILTO CLIENT TRIGGER WITH CONFIG DATA ---
  const handleHireUsClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const subject = `Excalibur Inquiry - Project Assembly Request`;
    const body = `Hi Excalibur.dev,

We are looking to initialize a project with the following configuration:
- ESTIMATED BUDGET: ${estimatorBudget}
- PROPOSED SCOPE: ${estimatorScope}
- TARGET TIMELINE: ${estimatorTimeline}

Looking forward to building.

Best regards,`;
    
    window.location.href = `mailto:snurmdev@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  // --- SUBTLE LERP CURSOR ANIMATION LOOP ---
  useEffect(() => {
    if (isMobile) return;

    let animationFrameId: number;

    const handleMouseMove = (e: MouseEvent) => {
      mousePos.current.x = e.clientX;
      mousePos.current.y = e.clientY;
      
      // Instantly position core dot
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0) translate3d(-50%, -50%, 0)`;
      }
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target) return;
      
      // Expand outer circle over interactive elements
      if (
        target.tagName === 'BUTTON' || 
        target.tagName === 'A' || 
        target.closest('button') || 
        target.closest('a') ||
        target.getAttribute('role') === 'button' ||
        target.classList.contains('cursor-pointer')
      ) {
        setIsHovered(true);
      } else {
        setIsHovered(false);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseover', handleMouseOver);

    const updateRing = () => {
      const ease = 0.15; // Smooth lerp delay interpolation factor
      
      ringPos.current.x += (mousePos.current.x - ringPos.current.x) * ease;
      ringPos.current.y += (mousePos.current.y - ringPos.current.y) * ease;
      
      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ringPos.current.x}px, ${ringPos.current.y}px, 0) translate3d(-50%, -50%, 0)`;
      }

      animationFrameId = requestAnimationFrame(updateRing);
    };

    animationFrameId = requestAnimationFrame(updateRing);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseover', handleMouseOver);
      cancelAnimationFrame(animationFrameId);
    };
  }, [isMobile]);

  // --- CURSOR TRACKING FOR PARALLAX/LIGHT-EFFECTS ---
  const handleContainerMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setMousePosition({ x, y });
  };

  // Helper variables for coordinates/distances relative to center
  const leftCenterDeltaX = mousePosition.x - (window.innerWidth / 2);
  const leftCenterDeltaY = mousePosition.y - (window.innerHeight / 2);

  return (
    <div 
      ref={containerRef} 
      onMouseMove={handleContainerMouseMove}
      className="relative w-screen h-screen overflow-hidden bg-black text-white font-sans select-none swiss-grid md:cursor-none"
    >
      
      {/* ────────────────────────────────────────────────────────
          GLOBAL VIEWPORT PERIMETER FRAMING (SWISS LAYOUT MARGINS)
          ──────────────────────────────────────────────────────── */}
      
      {/* Corner Crop Marks / Crosshairs (Brutalist Swiss Print Style) */}
      <div className="hidden md:flex absolute top-4 left-4 z-50 pointer-events-none text-neutral-600 font-mono text-[9px] items-center space-x-2">
        <span>+</span><span>[51.5074° N, 0.1278° W]</span>
      </div>
      <div className="hidden md:flex absolute top-4 right-4 z-50 pointer-events-none text-neutral-600 font-mono text-[9px] items-center space-x-2">
        <span>[SYS_CLK: {new Date().toLocaleTimeString('en-US', {hour12: false})}]</span><span>+</span>
      </div>
      <div className="hidden md:block absolute bottom-4 left-4 z-50 pointer-events-none text-neutral-600 font-mono text-[9px]">
        + EXCALIBUR.DEV // ALPHA-V4
      </div>
      <div className="hidden md:block absolute bottom-4 right-4 z-50 pointer-events-none text-neutral-600 font-mono text-[9px]">
        FOCUS: CREATIVE_STUDIO +
      </div>

      {/* Main Header navigation */}
      <header className="absolute top-0 left-0 w-full p-6 md:p-10 flex justify-between items-center z-50 pointer-events-none">
        <div className="pointer-events-auto flex items-baseline space-x-3">
          <h1 
            className="text-xl md:text-3xl font-black tracking-tighter uppercase cursor-pointer hover:text-brand-cyan transition-colors font-display" 
            onClick={() => setActiveProjectIndex(0)}
          >
            EXCALIBUR.dev
          </h1>
          <span className="hidden md:inline font-mono text-[9px] tracking-widest text-neutral-500 bg-neutral-900 border border-neutral-800 px-2 py-0.5">// CREATIVE STUDIO</span>
        </div>
        
        <div className="flex items-center space-x-4 text-xs md:text-sm font-mono tracking-widest uppercase pointer-events-auto">
          <button 
            onClick={() => setAboutOpen(!aboutOpen)} 
            className={`flex items-center space-x-2 border transition-all px-4 py-2 font-bold ${aboutOpen ? 'bg-white text-black border-white' : 'bg-neutral-950 text-white border-neutral-800 hover:border-white'}`}
          >
            {aboutOpen ? <X size={14} className="stroke-[2.5]" /> : <Menu size={14} className="stroke-[2.5]" />}
            <span>{aboutOpen ? 'CLOSE' : 'ABOUT'}</span>
          </button>
        </div>
      </header>

      {/* ========================================================
          SK STUDIO MAIN CANVAS VIEWPORT (100% WIDTH)
          ======================================================== */}
      <div 
        className="w-full h-full relative p-6 md:p-12 flex flex-col justify-between bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-neutral-900 via-zinc-950 to-black overflow-hidden"
      >
        
        {/* Background Image Parallax Overlay */}
        <div 
          className="absolute inset-0 opacity-[0.22] bg-cover bg-center mix-blend-luminosity pointer-events-none transition-transform duration-300 ease-out scale-[1.08]" 
          style={{ 
            backgroundImage: `url("${projects[activeProjectIndex].image}")`,
            transform: isMobile ? 'none' : `translate(${leftCenterDeltaX * 0.02}px, ${leftCenterDeltaY * 0.02}px) scale(1.1)`
          }} 
        />

        {/* Custom Subtle Interactive Cursor */}
        {!isMobile && (
          <>
            <div 
              ref={dotRef}
              className="fixed top-0 left-0 w-1.5 h-1.5 bg-white rounded-full pointer-events-none z-50 mix-blend-difference transition-transform duration-75 ease-out"
              style={{ transform: 'translate3d(-100px, -100px, 0) translate3d(-50%, -50%, 0)' }}
            />
            <div 
              ref={ringRef}
              className={`fixed top-0 left-0 w-7 h-7 border rounded-full pointer-events-none z-50 transition-all duration-300 ease-out mix-blend-difference ${
                isHovered 
                  ? 'bg-white border-white scale-[1.6]' 
                  : 'border-white/30 bg-transparent scale-100'
              }`}
              style={{ transform: 'translate3d(-100px, -100px, 0) translate3d(-50%, -50%, 0)' }}
            />
          </>
        )}

        {/* Aesthetic Grid Ticker Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(255,51,68,0.02)_1px,transparent_1px)] bg-[size:100%_16px] pointer-events-none" />
        
        {/* Top margin label spacing (Swiss Editorial grid spacer) */}
        <div className="w-full pt-20 md:pt-28 flex justify-between items-baseline z-10">
          <span className="text-[10px] font-mono tracking-widest text-neutral-400 block">// CREATIVE STUDIO INTERACTIVE CANVAS</span>
          <span className="text-[10px] font-mono tracking-widest text-neutral-500 uppercase hidden sm:block">SYSTEM: SK_CORE // ARCH: SHADER</span>
        </div>

        {/* Hero Typographic Block */}
        <div className="max-w-2xl ml-4 md:ml-12 z-10 my-auto flex flex-col justify-center select-none">
          <div className="relative">
            {/* Outlined display text behind */}
            <h2 className="text-7xl sm:text-[7rem] md:text-[14rem] font-black tracking-tighter leading-[0.8] text-stroke-white select-none absolute -top-8 md:-top-16 left-0 z-0 opacity-40 font-display">
              STUDIO
            </h2>
            
            <h2 className="text-5xl sm:text-6xl md:text-[9.5rem] font-black tracking-tighter leading-[0.8] uppercase select-none relative z-10 font-display text-white">
              SK<span className="text-brand-red font-light font-sans text-2xl sm:text-3xl md:text-5xl align-super ml-1">{projects[activeProjectIndex].num}</span>
            </h2>
          </div>

          {/* Dynamic Project Tabs switcher (Swiss style inline borders) */}
          <div className="flex space-x-1 mt-6 border-b border-neutral-800 pb-3 max-w-md">
            {projects.map((proj, idx) => (
              <button 
                key={proj.id}
                onClick={() => setActiveProjectIndex(idx)}
                className={`font-mono text-xs px-3 py-1.5 transition-all flex items-center space-x-1 ${activeProjectIndex === idx ? 'bg-white text-black font-bold' : 'text-neutral-500 hover:text-white hover:bg-neutral-900 border border-transparent'}`}
              >
                <span>[{proj.num}]</span>
                <span className="text-[10px]">{proj.title.split(' ')[0]}</span>
              </button>
            ))}
          </div>

          <div className="mt-6 max-w-md">
            <span className="text-[10px] font-mono tracking-widest text-brand-red font-bold block mb-1 uppercase">
              {projects[activeProjectIndex].subtitle}
            </span>
            <p className="text-xs sm:text-sm font-mono tracking-wide text-neutral-300 uppercase leading-relaxed text-justify">
              {projects[activeProjectIndex].description}
            </p>
          </div>

          <div className="flex flex-wrap gap-4 mt-8">
            <button 
              onClick={() => {
                alert('Routing seamlessly to SK Creative Studio inner context portfolio...');
              }}
              className="group flex items-center space-x-2 border border-white bg-white text-black px-6 py-3.5 text-xs font-mono tracking-widest font-bold uppercase hover:bg-black hover:text-white transition-all shadow-[0_4px_20px_rgba(255,255,255,0.08)]"
            >
              <span>ENTER STUDIO PORTFOLIO</span>
              <ArrowUpRight size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </button>
          </div>
        </div>

        {/* Bottom Panel Metadata list */}
        <div className="z-10 grid grid-cols-2 md:grid-cols-4 gap-4 border-t border-neutral-800/80 pt-6 mt-4 pb-20 md:pb-0">
          <div className="font-mono text-[10px] uppercase">
            <span className="text-neutral-600 block text-[9px]">ASPECT RATIO</span>
            <span className="text-neutral-300 font-bold">{projects[activeProjectIndex].metadata.ratio}</span>
          </div>
          <div className="font-mono text-[10px] uppercase">
            <span className="text-neutral-600 block text-[9px]">OPTICS // APERTURE</span>
            <span className="text-neutral-300 font-bold">{projects[activeProjectIndex].metadata.focal}</span>
          </div>
          <div className="font-mono text-[10px] uppercase">
            <span className="text-neutral-600 block text-[9px]">FILMSTOCK EMULATION</span>
            <span className="text-neutral-300 font-bold">{projects[activeProjectIndex].metadata.stock}</span>
          </div>
          <div className="font-mono text-[10px] uppercase">
            <span className="text-neutral-600 block text-[9px]">VECTOR REFRESH</span>
            <span className="text-brand-red font-bold">{projects[activeProjectIndex].metadata.speed}</span>
          </div>
        </div>

      </div>

      {/* ────────────────────────────────────────────────────────
          FIXED PERIMETER FOOTER UTIL BACKPLANE
          ──────────────────────────────────────────────────────── */}
      <footer className="absolute bottom-0 left-0 w-full p-4 md:p-10 flex justify-between items-end z-50 pointer-events-none">
        
        {/* Creator / Team badges */}
        <div className="hidden sm:flex space-x-6 md:space-x-12 text-xs md:text-sm font-mono tracking-widest text-neutral-500 pointer-events-auto bg-black/40 backdrop-blur-sm p-3 border border-neutral-900">
          <div className="flex flex-col">
            <span className="text-[9px] text-neutral-600 block">CREATIVE LAB</span>
            <span className="text-white font-bold flex items-center space-x-1">
              <span>SK_STUDIO</span>
              <Layers2 size={12} className="text-brand-red ml-1" />
            </span>
          </div>
        </div>
        
        {/* Core Quick CTA */}
        <div className="pointer-events-auto w-full sm:w-auto flex justify-end">
          <button 
            onClick={() => setAboutOpen(true)}
            className="w-full sm:w-auto justify-center group bg-white text-black font-mono text-xs md:text-sm font-black tracking-widest uppercase px-6 py-4 flex items-center space-x-2 hover:bg-black hover:text-white hover:border hover:border-white transition-all shadow-[0_4px_30px_rgba(255,255,255,0.15)]"
          >
            <span>ESTIMATE PROJECT</span>
            <ArrowUpRight size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </button>
        </div>
      </footer>

      {/* ────────────────────────────────────────────────────────
          SWISS EDITORIAL ABOUT DRAWER OVERLAY PANEL
          ──────────────────────────────────────────────────────── */}
      <div 
        className={`absolute inset-0 bg-neutral-950 border-t-2 border-neutral-800 z-40 transition-all duration-500 ease-in-out px-6 py-20 md:p-24 lg:p-32 overflow-y-auto ${aboutOpen ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'}`}
      >
        <div className="max-w-7xl mx-auto pt-10">
          
          {/* Header element inside drawer */}
          <div className="flex justify-between items-baseline border-b border-neutral-900 pb-6 mb-12">
            <span className="font-mono text-xs text-neutral-500 tracking-widest">// STUDIO DOSSIER V4.0</span>
            <button 
              onClick={() => setAboutOpen(false)} 
              className="font-mono text-xs text-neutral-400 hover:text-white border border-neutral-800 hover:border-white px-3 py-1 flex items-center space-x-1"
            >
              <X size={12} />
              <span>EXIT INDEX</span>
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-20">
            
            {/* Left Column: Mission statement */}
            <div className="lg:col-span-2 space-y-6">
              <span className="text-xs font-mono tracking-widest text-brand-red font-bold block">/ STUDIO OVERVIEW</span>
              <h3 className="text-4xl md:text-7xl font-black uppercase tracking-tighter leading-[0.9] font-display max-w-3xl text-neutral-100">
                EXCALIBUR CREATIVE STUDIO PORTAL
              </h3>
              
              <div className="h-1 bg-[linear-gradient(to_right,#ff3344_50%,#22d3ee_50%)] w-24 my-6" />

              <p className="font-mono text-sm tracking-wide text-neutral-400 leading-relaxed uppercase text-justify max-w-2xl">
                Excalibur.dev is a visual design and creative production lab. We operate at the intersection of cinematic design grids, tactile editorial typography, and high-performance visual motion systems. No layouts. No templates. No boilerplate minimal structures.
              </p>

              {/* Schematic Overview */}
              <div className="mt-12 bg-neutral-900/40 border border-neutral-900 p-6 rounded-lg font-mono text-xs">
                <span className="text-[10px] text-neutral-600 block mb-4">// SCHEMATIC OVERVIEW</span>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-center items-center">
                  <div className="border border-neutral-800 p-4 bg-neutral-950">
                    <span className="text-brand-red font-bold block mb-1">SK_STUDIO</span>
                    <span className="text-[9px] text-neutral-500">Visual Layout Engine</span>
                  </div>
                  <div className="border border-neutral-800 p-4 bg-neutral-950">
                    <span className="text-white font-bold block mb-1">EXCALIBUR_GATEWAY</span>
                    <span className="text-[9px] text-neutral-500">Gateway Domain Context</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Contact form / Estimator Builder */}
            <div className="space-y-8">
              <span className="text-xs font-mono tracking-widest text-cyan-400 font-bold block">/ PROJECT ASSEMBLER</span>
              
              <div className="bg-neutral-900 border border-neutral-800 p-6 rounded space-y-6">
                
                {/* Budget Selection block */}
                <div>
                  <label className="block font-mono text-[9px] text-neutral-500 mb-2 uppercase">ESTIMATED INVESTMENT BUDGET</label>
                  <div className="grid grid-cols-2 gap-2">
                    {['$50K - $100K', '$100K - $250K', '$250K+', 'T&M Rate Card'].map((opt) => (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => setEstimatorBudget(opt)}
                        className={`font-mono text-[10px] py-2 border transition-all text-center ${estimatorBudget === opt ? 'bg-white text-black font-bold border-white' : 'border-neutral-800 hover:border-neutral-600 text-neutral-400'}`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Scope Selection block */}
                <div>
                  <label className="block font-mono text-[9px] text-neutral-500 mb-2 uppercase">PROPOSED SCOPE OF INTERACTION</label>
                  <div className="space-y-2">
                    {[
                      'Tactile Editorial Typography & Layouts', 
                      'Aesthetic Design Systems (SK Studio)', 
                      'High-Performance Web Motion Systems',
                      'Custom High-Fidelity Consulting'
                    ].map((opt) => (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => setEstimatorScope(opt)}
                        className={`w-full text-left font-mono text-[10px] px-3 py-2 border transition-all flex justify-between items-center ${estimatorScope === opt ? 'bg-white text-black font-bold border-white' : 'border-neutral-800 hover:border-neutral-600 text-neutral-400'}`}
                      >
                        <span>{opt}</span>
                        {estimatorScope === opt && <ChevronRight size={10} />}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Timeline Selection block */}
                <div>
                  <label className="block font-mono text-[9px] text-neutral-500 mb-2 uppercase">TARGET RELEASE TIMELINE</label>
                  <div className="grid grid-cols-3 gap-2">
                    {['1 - 2 Months', '3 Months', '6 Months+'].map((opt) => (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => setEstimatorTimeline(opt)}
                        className={`font-mono text-[10px] py-2 border transition-all text-center ${estimatorTimeline === opt ? 'bg-white text-black font-bold border-white' : 'border-neutral-800 hover:border-neutral-600 text-neutral-400'}`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Dispatch Button */}
                <button
                  onClick={handleHireUsClick}
                  className="w-full bg-brand-cyan text-black font-mono font-black py-4 px-4 text-xs tracking-widest uppercase hover:bg-white transition-colors flex items-center justify-center space-x-2"
                >
                  <Mail size={14} />
                  <span>TRANSMIT COMPILATION</span>
                </button>

                <p className="font-mono text-[8px] text-neutral-500 leading-normal text-center uppercase">
                  Clicking compiles the custom settings and launches your native mail client direct connection to: snurmdev@gmail.com
                </p>

              </div>
            </div>

          </div>
        </div>
      </div>

    </div>
  );
}
