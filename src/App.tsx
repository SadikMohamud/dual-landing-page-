import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  Menu, 
  X, 
  ArrowUpRight, 
  Cpu, 
  Mail, 
  ChevronRight, 
  Layers2, 
  Code2, 
  Workflow,
  Maximize2,
  Info
} from 'lucide-react';





// Interfaces for our interactive elements
interface EffectData {
  id: string;
  num: string;
  title: string;
  path: string;
  tech: string;
  interaction: string;
  performance: string;
  description: string;
  url: string;
  codeSnippet: string;
}


interface McpNode {
  id: string;
  label: string;
  description: string;
  x: number;
  y: number;
  type: 'core' | 'compiler' | 'db' | 'search' | 'sandbox' | 'agent';
  status: 'active' | 'idle' | 'routing';
}

export default function ExcaliburLanding() {
  // --- CORE REQUIRED TECHNICAL STATES ---
  const [splitPercentage, setSplitPercentage] = useState<number>(50);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [aboutOpen, setAboutOpen] = useState<boolean>(false);
  const [activeHover, setActiveHover] = useState<'none' | 'sk' | 'forge'>('none');

  // --- MOBILE OPTIMIZATION STATES ---
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'grid' | 'dossier'>('grid');
  const [forgeTab, setForgeTab] = useState<'overview' | 'schema'>('overview');

  // --- ADDITIONAL RICH SYSTEM STATES ---
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [activeEffectId, setActiveEffectId] = useState<string>("2");
  const [expandedEffectId, setExpandedEffectId] = useState<string | null>(null);
  const [selectedNode, setSelectedNode] = useState<McpNode | null>(null);
  const [terminalLogs, setTerminalLogs] = useState<string[]>([
    "// EXCALIBUR COMPILER INIT_BOOTLOADER",
    "SYSTEM: 180 COGNITIVE SUB-AGENTS STANDING BY",
    "GATEWAY: MCP STACK COMPILED OK (PORT 8080)",
    "SANDBOX: CONTAINER READY // HEURISTIC MATRIX ON"
  ]);


  // About panel contact builder states
  const [estimatorBudget, setEstimatorBudget] = useState<string>('$50K - $100K');
  const [estimatorScope, setEstimatorScope] = useState<string>('Dual Identity Engine (Design + Dev)');
  const [estimatorTimeline, setEstimatorTimeline] = useState<string>('3 Months');

  const containerRef = useRef<HTMLDivElement>(null);
  const dragStartRef = useRef({ x: 0, time: 0 });

  // Monitor screen resize for mobile design adaptation
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // --- PORTFOLIO DATA (LEFT CANVASES - MOUSE EFFECTS GRID) ---
  const effectsList: EffectData[] = [
    {
      id: "2",
      num: "02",
      title: "SPLIT VIGNETTE",
      path: "C:\\Users\\Sadik Mohamud\\Desktop\\Awwwards Pack\\+17 Mouse Effect\\2",
      tech: "GSAP / Lenis / CSS Clip-Path",
      interaction: "Scroll Vignettes + Spring Dynamics",
      performance: "Interpolated quickTo (60fps)",
      description: "Spring-damped portrait vignettes linked to viewport coordinates with rotation lags and Lenis smooth scrolling.",
      url: "/effects/2/index.html",
      codeSnippet: `const setters = [...vignettes].map(el => ({
  x: gsap.quickTo(el, 'x', { duration: 0.5, ease: 'power3' }),
  y: gsap.quickTo(el, 'y', { duration: 0.5, ease: 'power3' }),
}))
window.addEventListener('mousemove', (e) => {
  setters.forEach(s => { s.x(e.clientX - ox); s.y(e.clientY - oy) })
})`
    },
    {
      id: "3",
      num: "03",
      title: "CIRCULAR REVEAL",
      path: "C:\\Users\\Sadik Mohamud\\Desktop\\Awwwards Pack\\+17 Mouse Effect\\3",
      tech: "CSS Mask / GSAP Animation",
      interaction: "Radial Mask Position + Hover Scale",
      performance: "Hardware Accelerated Clip path",
      description: "Circular radial clip-mask overlay drifting on vector coordinates to reveal hidden graphic copy underneath.",
      url: "/effects/3/index.html",
      codeSnippet: `gsap.to(mask, {
  webkitMaskSize: \`\${size}px\`,
  webkitMaskPosition: \`\${mouse.x - size / 2}px \${mouse.y - size / 2}px\`,
  duration: 0.18,
  ease: 'power2.out'
})`
    },
    {
      id: "4",
      num: "04",
      title: "3D SKULL WEBGPU",
      path: "C:\\Users\\Sadik Mohamud\\Desktop\\Awwwards Pack\\+17 Mouse Effect\\4",
      tech: "Three.js / WebGPU / TSL / GLB",
      interaction: "Mouse rotation matrix + fluid simulation",
      performance: "Direct WebGPU Pipeline execution",
      description: "WebGL2/WebGPU graphics rendering of a 3D skeleton model rotating with mouse movements combined with fluid distortion.",
      url: "/effects/4/index.html",
      codeSnippet: `import * as THREE from "three/webgpu";
this.mouseTrail.update(mouse.x, mouse.y);
this.fluidSim.update(this.renderer, this.mouseTrail.texture);
this.postProcessing.render();`
    },
    {
      id: "5",
      num: "05",
      title: "WEBGL FLUID",
      path: "C:\\Users\\Sadik Mohamud\\Desktop\\Awwwards Pack\\+17 Mouse Effect\\5",
      tech: "GLSL Shader / WebGL Fragment",
      interaction: "Velocity Splits + Navier-Stokes simulation",
      performance: "Full GPU shader computing (60fps)",
      description: "A fluid simulation shader driven by mouse coordinates and drag forces, revealing text masked dynamically.",
      url: "/effects/5/index.html",
      codeSnippet: `void main () {
  vec2 coord = vUv - u_dt * bilerp(u_velocity, vUv, u_texel).xy * u_texel;
  float text = texture2D(u_text_texture, vec2(vUv.x, 1. - vUv.y)).r;
  gl_FragColor = dissipation * bilerp(u_input_texture, coord, u_texel);
}`
    },
    {
      id: "7",
      num: "07",
      title: "RAINBOW BRUSH",
      path: "C:\\Users\\Sadik Mohamud\\Desktop\\Awwwards Pack\\+17 Mouse Effect\\7",
      tech: "HTML5 Canvas / 2D Context / CSS Blend",
      interaction: "Drag to paint + HSL hue rotation",
      performance: "Retina-aware scale factor (DPR 2.0)",
      description: "Rainbow paint brush trails drawn on mouse click and drag, using HSL color space cycling and width breathing.",
      url: "/effects/7/index.html",
      codeSnippet: `ctx.lineWidth = 90 + Math.sin(hue * (Math.PI / 180)) * 15;
ctx.strokeStyle = \`hsl(\${hue}, 100%, 50%)\`;
ctx.beginPath();
ctx.moveTo(lastX, lastY);
ctx.lineTo(x, y);
ctx.stroke();`
    },
    {
      id: "9",
      num: "09",
      title: "IMAGE TRAIL",
      path: "C:\\Users\\Sadik Mohamud\\Desktop\\Awwwards Pack\\+17 Mouse Effect\\9",
      tech: "GSAP / Image Preload / Lerp",
      interaction: "Sequence index + distance threshold",
      performance: "Preloaded image caching / Tweeners",
      description: "Chronological fade sequences of preloaded source images triggered when mouse movement exceeds velocity thresholds.",
      url: "/effects/9/index.html",
      codeSnippet: `if (distance > this.threshold) {
  this.showNextImage();
  this.imgPosition = this.imgPosition < this.imagesTotal - 1 ? this.imgPosition + 1 : 0;
  lastMousePos = { ...mousePos };
}`
    }
  ];

  // --- MCP NODE GRAPH DATA (RIGHT CANVASES) ---
  const mcpNodes: McpNode[] = [
    { id: "core", label: "FORGE CORE", type: "core", status: "active", x: 200, y: 180, description: "Central state router linking layout layers to Forge compiler nodes." },
    { id: "comp", label: "MCP COMPILER", type: "compiler", status: "routing", x: 420, y: 120, description: "Transforms client intents into specialized subagent executable pipelines." },
    { id: "db", label: "POSTGRES STATE", type: "db", status: "active", x: 340, y: 320, description: "Stores persistent local knowledge embeddings and workflow patterns." },
    { id: "search", label: "RETRIEVAL (BRAVE)", type: "search", status: "idle", x: 550, y: 220, description: "Real-time web search and index lookup for contextual supplementation." },
    { id: "box", label: "SANDBOX (DOCKER)", type: "sandbox", status: "idle", x: 650, y: 350, description: "Isolated execution environment for generating and testing code output." },
    { id: "agents", label: "180x AGENT SYSTEM", type: "agent", status: "active", x: 150, y: 380, description: "Orchestrates concurrent LLM agents to execute parallelized tasks." }
  ];

  // --- HANDLE DIVIDER DRAG & SWIPE MECHANICS ---
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    dragStartRef.current = { x: isMobile ? e.clientY : e.clientX, time: Date.now() };
    e.preventDefault();
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    dragStartRef.current = { x: isMobile ? e.touches[0].clientY : e.touches[0].clientX, time: Date.now() };
  };

  const handleMove = useCallback((clientX: number, clientY: number) => {
    if (!isDragging || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const position = isMobile 
      ? ((clientY - rect.top) / rect.height) * 100 
      : ((clientX - rect.left) / rect.width) * 100;
    // Constrain slider between 0% and 100%
    setSplitPercentage(Math.max(0, Math.min(100, position)));
  }, [isDragging, isMobile]);

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => handleMove(e.clientX, e.clientY);
    const onTouchMove = (e: TouchEvent) => handleMove(e.touches[0].clientX, e.touches[0].clientY);
    
    const onEnd = () => {
      if (!isDragging) return;
      setIsDragging(false);
      
      // Boundary Snapping Behavior (Takeover Effects)
      if (splitPercentage > 85) setSplitPercentage(100);
      else if (splitPercentage < 15) setSplitPercentage(0);
    };

    if (isDragging) {
      window.addEventListener('mousemove', onMouseMove);
      window.addEventListener('touchmove', onTouchMove);
      window.addEventListener('mouseup', onEnd);
      window.addEventListener('touchend', onEnd);
    }
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('mouseup', onEnd);
      window.removeEventListener('touchend', onEnd);
    };
  }, [isDragging, handleMove, splitPercentage]);

  // --- INTENTIONAL NAVIGATION ROUTING CLICK DELTA CHECK ---
  const handleCanvasClick = (target: 'sk' | 'forge') => {
    if (isDragging) return; // Prevent accidental triggers during swipe
    
    // Smooth Expansion Takeover Animation sequence before routing
    if (target === 'sk') {
      setSplitPercentage(100);
      setTimeout(() => alert('Routing seamlessly to /sk inner page portfolio context...'), 400);
    } else {
      setAboutOpen(true);
    }
  };

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

  // --- CURSOR TRACKING FOR PARALLAX/LIGHT-EFFECTS ---
  const handleContainerMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    setMousePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  // --- REAL-TIME AGENT LOG SIMULATOR ---
  useEffect(() => {
    const logPool = [
      "[COMPILE] PARSING AST FOR HIGH-FIDELITY LAYOUTS...",
      "[AGENT-42] EXECUTING SEARCH QUERY: 'SWISS EDITORIAL SYSTEM BRUTALISM'",
      "[SYSTEM] ROUTING TASK TO DOCKER CONTAINER #14",
      "[AGENT-108] PERFORMANCE METRIC CAPTURED: LCP 412MS",
      "[MCP-POSTGRES] RETRIEVED VECTOR EMBEDDINGS FOR DESIGN_TOKEN_GLOSSARY",
      "[SANDBOX] DEPLOYING LIVE FORGE INSTANCE AT http://localhost:4400/",
      "[COMPILER] SUCCESSFUL RE-COMPILATION IN 89MS",
      "[AGENT-92] TRACING VISUAL CURSOR VELOCITY VECTOR // HEURISTIC REGISTERED",
      "[COMPILER] MINIFYING PRODUCTION COMPILER SCHEMAS (-34KB)",
      "[MCP-BROWSER] SPINNING UP HEADLESS RENDER INSTANCE..."
    ];

    const interval = setInterval(() => {
      setTerminalLogs(prev => {
        const next = [...prev, logPool[Math.floor(Math.random() * logPool.length)]];
        if (next.length > 18) next.shift(); // Constrain length to fit UI
        return next;
      });
    }, 2000);

    return () => clearInterval(interval);
  }, []);





  return (
    <div 
      ref={containerRef} 
      onMouseMove={handleContainerMouseMove}
      className="relative w-screen h-screen overflow-hidden bg-black text-white font-sans select-none swiss-grid"
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
        SPLIT_RATIO: {splitPercentage.toFixed(2)}% +
      </div>

      {/* Main Header navigation */}
      <header className="absolute top-0 left-0 w-full p-6 md:p-10 flex justify-between items-center z-50 pointer-events-none">
        <div className="pointer-events-auto flex items-baseline space-x-3">
          <h1 
            className="text-xl md:text-3xl font-black tracking-tighter uppercase cursor-pointer hover:text-brand-cyan transition-colors font-display" 
            onClick={() => setSplitPercentage(50)}
          >
            EXCALIBUR.dev
          </h1>
          <span className="hidden md:inline font-mono text-[9px] tracking-widest text-neutral-500 bg-neutral-900 border border-neutral-800 px-2 py-0.5">// COMPILER ACTIVE // FOCUS: {activeHover.toUpperCase()}</span>
        </div>
        
        <div className="flex items-center space-x-4 text-xs md:text-sm font-mono tracking-widest uppercase pointer-events-auto">
          {/* Diagnostic Stats Overlay */}
          <div className="hidden lg:flex items-center space-x-6 mr-6 text-[10px] text-neutral-500">
            <div className="flex items-center space-x-1">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-emerald animate-pulse" />
              <span>STABILITY: 99.9%</span>
            </div>
            <div>FPS: 120.0</div>
            <div>CORES: 180 Active</div>
          </div>

          <button 
            onClick={() => setAboutOpen(!aboutOpen)} 
            className={`flex items-center space-x-2 border transition-all px-4 py-2 font-bold ${aboutOpen ? 'bg-white text-black border-white' : 'bg-neutral-950 text-white border-neutral-800 hover:border-white'}`}
          >
            {aboutOpen ? <X size={14} className="stroke-[2.5]" /> : <Menu size={14} className="stroke-[2.5]" />}
            <span>{aboutOpen ? 'CLOSE' : 'ABOUT'}</span>
          </button>
        </div>
      </header>

      {/* ────────────────────────────────────────────────────────
          DYNAMIC SWIPEABLE DOUBLE INTERACTIVE CANVAS LAYER STACK
          ──────────────────────────────────────────────────────── */}
      <div className="w-full h-full flex relative">
        
        {/* ========================================================
            LEFT SIDE: SK CANVAS WORLD (CLIP MASKED VIEWPORT)
            ======================================================== */}
        <div 
          style={isMobile ? {
            height: `${splitPercentage}%`,
            width: '100%',
            top: 0,
            left: 0
          } : {
            width: `${splitPercentage}%`,
            height: '100%',
            top: 0,
            left: 0
          }}
          onMouseEnter={() => setActiveHover('sk')}
          onMouseLeave={() => setActiveHover('none')}
          className="absolute overflow-hidden bg-zinc-950 transition-all duration-75 ease-out z-20 border-r border-transparent"
        >
          {/* Keep layout width constant at 100vw to ensure masking visual effect */}
          <div className="w-screen h-full relative flex flex-col md:flex-row bg-black">
            
            {/* Mobile Tab Bar Selector */}
            {isMobile && (
              <div className="flex border-b border-neutral-800 bg-black font-mono text-[10px] w-full z-30 pt-20">
                <button 
                  onClick={() => setActiveTab('grid')}
                  className={`flex-1 py-3 text-center border-r border-neutral-800 uppercase font-bold tracking-wider ${activeTab === 'grid' ? 'text-brand-red bg-neutral-950' : 'text-neutral-500'}`}
                >
                  [ GRID INDEX ]
                </button>
                <button 
                  onClick={() => setActiveTab('dossier')}
                  className={`flex-1 py-3 text-center uppercase font-bold tracking-wider ${activeTab === 'dossier' ? 'text-brand-red bg-neutral-950' : 'text-neutral-500'}`}
                >
                  [ DOSSIER EFFECT_{activeEffectId} ]
                </button>
              </div>
            )}

            {/* LEFT COLUMN: 6-SECTION GRID OF MOUSE EFFECTS */}
            <div className={`w-full md:w-[50vw] h-full relative flex flex-col border-r border-neutral-900 z-10 overflow-hidden ${isMobile && activeTab !== 'grid' ? 'hidden' : 'flex'}`}>
              {expandedEffectId ? (
                // Single Expanded View Mode
                <div className="w-full h-full relative">
                  {/* Expanded View Header Bar */}
                  <div className="absolute top-24 left-6 right-6 z-30 flex justify-between items-center bg-black/80 border border-neutral-800 p-3 backdrop-blur font-mono text-[10px]">
                    <div className="flex items-center space-x-2">
                      <span className="w-2 h-2 rounded-full bg-brand-red animate-pulse" />
                      <span className="text-white font-bold">EXPANDED INSTANCE: {effectsList.find(e => e.id === expandedEffectId)?.title}</span>
                    </div>
                    <button 
                      onClick={() => setExpandedEffectId(null)}
                      className="bg-white text-black font-black px-4 py-1.5 hover:bg-neutral-200 transition-colors uppercase cursor-pointer"
                    >
                      ← Back to Grid
                    </button>
                  </div>
                  
                  {/* The Iframe */}
                  <iframe 
                    src={effectsList.find(e => e.id === expandedEffectId)?.url} 
                    className="w-full h-full border-none block"
                    title="Fullscreen Mouse Effect"
                  />
                </div>
              ) : (
                // 6-Section Grid Mode
                <div className="w-full h-full grid grid-cols-2 grid-rows-3 bg-black">
                  {effectsList.map((eff) => {
                    const isActive = activeEffectId === eff.id;
                    return (
                      <div 
                        key={eff.id}
                        onMouseEnter={() => {
                          setActiveEffectId(eff.id);
                          setTerminalLogs(prev => {
                            const updated = [...prev, `[SK-STUDIO] HOVER_EFFECT // ACTIVE: ${eff.title}`];
                            if (updated.length > 18) updated.shift();
                            return updated;
                          });
                        }}
                        onClick={() => {
                          setActiveEffectId(eff.id);
                          setTerminalLogs(prev => {
                            const updated = [...prev, `[SK-STUDIO] HOVER_EFFECT // ACTIVE: ${eff.title}`];
                            if (updated.length > 18) updated.shift();
                            return updated;
                          });
                        }}
                        className={`relative group overflow-hidden border-b border-r border-neutral-900/60 transition-colors flex flex-col justify-between p-3 cursor-pointer ${isActive ? 'bg-neutral-950/80 border-neutral-700/80' : 'bg-black'}`}
                      >
                        {/* Cell Header Ticker */}
                        <div className="flex justify-between items-center font-mono text-[9px] text-neutral-500 z-10 relative">
                          <span className={`${isActive ? 'text-brand-red font-bold' : ''}`}>[{eff.num}] {eff.title}</span>
                          <span className="opacity-0 group-hover:opacity-100 transition-opacity text-[8px] text-neutral-600 font-normal">
                            ACTIVE INDEX
                          </span>
                        </div>

                        {/* Interactive Iframe background (pointer events only when hovered/active; disabled on mobile for performance) */}
                        <div className="absolute inset-x-0 bottom-0 top-6 z-0 pointer-events-none">
                          {!isMobile ? (
                            <iframe
                              src={eff.url}
                              className="w-full h-full border-none opacity-80 group-hover:opacity-100 transition-opacity"
                              title={eff.title}
                              scrolling="no"
                              style={{ pointerEvents: 'auto' }}
                            />
                          ) : (
                            <div className="w-full h-full bg-gradient-to-br from-neutral-950 to-neutral-900 flex items-center justify-center p-4">
                              <span className="font-mono text-[8px] text-neutral-700 tracking-wider">
                                [ SELECT TO INSPECT ]
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Tool buttons Overlay (Always shown on mobile, hover-only on desktop) */}
                        <div className={`flex justify-end space-x-2 z-10 relative self-end mt-auto ${isMobile ? 'opacity-100' : 'opacity-0 group-hover:opacity-100 transition-opacity'}`}>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setActiveEffectId(eff.id);
                              if (isMobile) {
                                setActiveTab('dossier');
                              } else {
                                setSplitPercentage(Math.max(splitPercentage, 65));
                              }
                            }}
                            className={`p-1 bg-black/85 border transition-all text-neutral-400 hover:text-white ${isActive ? 'border-brand-red' : 'border-neutral-800'}`}
                            title="Inspect Details"
                          >
                            <Info size={11} />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setExpandedEffectId(eff.id);
                            }}
                            className="p-1 bg-black/85 border border-neutral-800 hover:border-white transition-all text-neutral-400 hover:text-white"
                            title="Fullscreen Mode"
                          >
                            <Maximize2 size={11} />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* RIGHT COLUMN: SWISS EDITORIAL DETAIL PANEL FOR THE ACTIVE MOUSE EFFECT */}
            <div className={`w-full md:w-[50vw] h-full bg-zinc-950 flex flex-col justify-between p-6 md:p-10 z-10 overflow-y-auto border-r border-neutral-900 ${isMobile && activeTab !== 'dossier' ? 'hidden' : 'flex'}`}>
              
              {/* Detail Header */}
              <div className="w-full pt-4 md:pt-28 flex justify-between items-baseline border-b border-neutral-900 pb-4">
                <span className="text-[10px] font-mono tracking-widest text-neutral-500 block">/ TECHNICAL DOSSIER // EFFECT_{activeEffectId}</span>
                <span className="text-[10px] font-mono tracking-widest text-brand-red font-bold uppercase">
                  {effectsList.find(e => e.id === activeEffectId)?.tech.split('/')[0]}
                </span>
              </div>

              {/* Detail Hero Section */}
              <div className="my-auto py-8 space-y-6">
                <div>
                  <span className="font-mono text-[10px] text-neutral-500 block mb-1">EFFECT SPECIFICATION</span>
                  <h3 className="text-4xl md:text-6xl font-black uppercase tracking-tighter leading-none font-display text-white">
                    {effectsList.find(e => e.id === activeEffectId)?.title}
                  </h3>
                </div>

                <div className="space-y-4">
                  <div className="bg-black border border-neutral-900 p-4 font-mono text-[9px] text-neutral-400 leading-normal uppercase">
                    <span className="text-neutral-600 block text-[8px] mb-1">LOCAL DISK SOURCE FILEPATH</span>
                    <span className="text-white select-text">{effectsList.find(e => e.id === activeEffectId)?.path}</span>
                  </div>

                  <p className="font-mono text-xs tracking-wide text-neutral-400 leading-relaxed uppercase">
                    {effectsList.find(e => e.id === activeEffectId)?.description}
                  </p>
                </div>

                {/* Grid stats */}
                <div className="grid grid-cols-2 gap-4 border-t border-b border-neutral-900 py-4 font-mono text-[10px]">
                  <div>
                    <span className="text-neutral-600 block text-[9px] uppercase">INTERACTION CLASS</span>
                    <span className="text-neutral-300 font-bold uppercase">{effectsList.find(e => e.id === activeEffectId)?.interaction}</span>
                  </div>
                  <div>
                    <span className="text-neutral-600 block text-[9px] uppercase">RENDER PROCESSOR</span>
                    <span className="text-brand-red font-bold uppercase">{effectsList.find(e => e.id === activeEffectId)?.performance}</span>
                  </div>
                </div>

                {/* Core Code snippet */}
                <div className="space-y-2">
                  <span className="font-mono text-[10px] text-neutral-500 block uppercase">CORE CODE COMPUTATION</span>
                  <div className="bg-black border border-neutral-900 p-4 font-mono text-[9px] text-brand-red text-left rounded overflow-x-auto select-text">
                    <pre className="leading-tight">
                      <code>{effectsList.find(e => e.id === activeEffectId)?.codeSnippet}</code>
                    </pre>
                  </div>
                </div>
              </div>

              {/* Detail Footer */}
              <div className="flex justify-between items-center pt-4 border-t border-neutral-900 text-neutral-600 font-mono text-[9px] uppercase">
                <span>SYSTEM: EXCALIBUR_COMPILE</span>
                <span className="text-neutral-400 font-bold">STABLE V4.0.0</span>
              </div>

            </div>

          </div>
        </div>

        {/* ========================================================
            RIGHT SIDE: THE FORGE CANVAS WORLD
            ======================================================== */}
        <div 
          style={isMobile ? {
            top: `${splitPercentage}%`,
            height: `${100 - splitPercentage}%`,
            width: '100%',
            left: 0
          } : {
            left: `${splitPercentage}%`,
            width: `${100 - splitPercentage}%`,
            height: '100%',
            top: 0
          }}
          onMouseEnter={() => setActiveHover('forge')}
          onMouseLeave={() => setActiveHover('none')}
          className="absolute overflow-hidden bg-neutral-950 transition-all duration-75 ease-out z-20"
        >
          {/* Keep layout width constant at 100vw to ensure masking visual effect */}
          <div className="w-screen h-full absolute right-0 top-0 p-6 md:p-12 flex flex-col justify-between bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-cyan-950/20 via-zinc-950 to-black forge-grid">
            
            {/* Interactive Flashlight Glow following cursor */}
            <div 
              className="absolute inset-0 pointer-events-none transition-opacity duration-300 mix-blend-screen opacity-70"
              style={{
                background: isMobile
                  ? `radial-gradient(circle 220px at ${mousePosition.x}px ${mousePosition.y - (window.innerHeight * splitPercentage / 100)}px, rgba(34, 211, 238, 0.12) 0%, rgba(168, 85, 247, 0.03) 45%, transparent 100%)`
                  : `radial-gradient(circle 380px at ${mousePosition.x - (window.innerWidth * splitPercentage / 100)}px ${mousePosition.y}px, rgba(34, 211, 238, 0.12) 0%, rgba(168, 85, 247, 0.03) 45%, transparent 100%)`
              }}
            />

            {/* Mobile Tab Bar Selector for The Forge */}
            {isMobile && (
              <div className={`flex border-b border-neutral-900 bg-neutral-950/90 font-mono text-[10px] w-full z-30 pt-4 ${splitPercentage < 15 ? 'pt-20' : 'pt-4'}`}>
                <button 
                  onClick={() => setForgeTab('overview')}
                  className={`flex-1 py-3 text-center border-r border-neutral-900 uppercase font-bold tracking-wider ${forgeTab === 'overview' ? 'text-cyan-400 bg-black/40' : 'text-neutral-500'}`}
                >
                  [ FORGE CONSOLE ]
                </button>
                <button 
                  onClick={() => setForgeTab('schema')}
                  className={`flex-1 py-3 text-center uppercase font-bold tracking-wider ${forgeTab === 'schema' ? 'text-cyan-400 bg-black/40' : 'text-neutral-500'}`}
                >
                  [ MCP SCHEMA ]
                </button>
              </div>
            )}

            {/* Top margin label spacing (Swiss Editorial grid spacer) */}
            <div className="hidden md:flex w-full pt-20 md:pt-28 justify-between items-baseline z-10 pr-4 md:pr-12">
              <span className="text-[10px] font-mono tracking-widest text-cyan-400 block">// AGENTIC DEVELOPMENT AGENCY</span>
              <span className="text-[10px] font-mono tracking-widest text-neutral-500 uppercase hidden sm:block">SANDBOX: EXT_CONTAINER // AGENTS: 180</span>
            </div>

            {/* Main Interactive Grid split down the middle */}
            <div className="w-full h-full flex flex-col xl:flex-row items-center justify-between gap-6 z-10 my-auto pr-0 xl:pr-12">
              
              {/* Left Column (within Forge): Custom interactive MCP Node Network SVG */}
              <div className={`w-full xl:w-1/2 h-[260px] md:h-[350px] relative flex items-center justify-center bg-black/60 border border-neutral-900/80 p-4 rounded shadow-2xl overflow-hidden order-2 xl:order-1 mt-4 xl:mt-0 ${isMobile && forgeTab !== 'schema' ? 'hidden' : 'flex'}`}>
                <div className="absolute top-2 left-2 flex items-center space-x-1.5 font-mono text-[9px] text-neutral-400">
                  <Workflow size={10} className="text-cyan-400 animate-pulse" />
                  <span>INTERACTIVE COMPILER SCHEMA</span>
                </div>
                
                {/* Grid Scanline Overlay */}
                <div className="scanline" />

                {/* SVG Connections & Nodes */}
                <svg className="w-full h-full absolute inset-0 pointer-events-none" viewBox="0 0 800 500">
                  <defs>
                    <linearGradient id="cyan-to-purple" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.8" />
                      <stop offset="100%" stopColor="#a855f7" stopOpacity="0.2" />
                    </linearGradient>
                  </defs>
                  
                  {/* Dynamic connecting lines */}
                  {mcpNodes.map((node) => {
                    if (node.id === 'core') return null;
                    const coreNode = mcpNodes.find(n => n.id === 'core');
                    if (!coreNode) return null;
                    const isSelected = selectedNode?.id === node.id || selectedNode?.id === 'core';
                    
                    return (
                      <g key={`line-${node.id}`}>
                        <line
                          x1={coreNode.x}
                          y1={coreNode.y}
                          x2={node.x}
                          y2={node.y}
                          stroke={isSelected ? '#22d3ee' : '#334155'}
                          strokeWidth={isSelected ? 1.5 : 1}
                          opacity={isSelected ? 0.8 : 0.4}
                          className={node.status === 'active' || node.status === 'routing' ? 'animate-flow-line' : ''}
                        />
                      </g>
                    );
                  })}
                  
                  {/* Sub-connections */}
                  <line x1={420} y1={120} x2={550} y2={220} stroke="#1e293b" strokeWidth={1} />
                  <line x1={340} y1={320} x2={650} y2={350} stroke="#1e293b" strokeWidth={1} />
                </svg>

                {/* Overlay Interactive HTML Nodes (Absolute positions matching SVG layout) */}
                <div className="absolute inset-0">
                  {mcpNodes.map((node) => {
                    const isSelected = selectedNode?.id === node.id;
                    const statusColors = {
                      active: 'bg-brand-emerald shadow-[0_0_8px_#10b981]',
                      idle: 'bg-neutral-600',
                      routing: 'bg-cyan-400 shadow-[0_0_8px_#22d3ee] animate-pulse'
                    };
                    
                    return (
                      <button
                        key={node.id}
                        onMouseEnter={() => {
                          setSelectedNode(node);
                          setTerminalLogs(prev => {
                            const updated = [...prev, `[MCP-SYSTEM] HOVER_NODE // INSPECTING: ${node.label}`];
                            if (updated.length > 18) updated.shift();
                            return updated;
                          });
                        }}
                        onMouseLeave={() => setSelectedNode(null)}
                        className={`absolute flex flex-col items-center justify-center p-1.5 focus:outline-none transition-all group`}
                        style={{ 
                          left: `${(node.x / 800) * 100}%`, 
                          top: `${(node.y / 500) * 100}%`,
                          transform: 'translate(-50%, -50%)'
                        }}
                      >
                        {/* Ring indicator */}
                        <div className={`w-8 h-8 rounded-full border flex items-center justify-center transition-all ${isSelected ? 'border-cyan-400 scale-110 bg-cyan-950/45' : 'border-neutral-800 hover:border-neutral-500 bg-neutral-950/90'}`}>
                          <Cpu size={12} className={`transition-colors ${isSelected ? 'text-cyan-400' : 'text-neutral-400 group-hover:text-white'}`} />
                        </div>
                        
                        {/* Status badge */}
                        <span className={`w-1.5 h-1.5 rounded-full absolute -top-0.5 -right-0.5 ${statusColors[node.status]}`} />
                        
                        <span className="font-mono text-[8px] tracking-wider mt-1 text-neutral-400 group-hover:text-white bg-black/80 px-1 border border-neutral-900 select-none whitespace-nowrap">
                          {node.label}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* Node Tooltip Info overlay */}
                <div className="absolute bottom-2 right-2 left-2 bg-neutral-950/90 border border-neutral-900/95 p-2 font-mono text-[9px] text-neutral-400 min-h-[50px] flex flex-col justify-center">
                  {selectedNode ? (
                    <>
                      <div className="flex justify-between items-center text-cyan-400 font-bold">
                        <span>NODE: {selectedNode.label}</span>
                        <span>STATUS: {selectedNode.status.toUpperCase()}</span>
                      </div>
                      <p className="mt-1 text-white uppercase text-[8px]">{selectedNode.description}</p>
                    </>
                  ) : (
                    <div className="text-center text-neutral-600 py-1 uppercase tracking-wider">
                      Hover nodes to inspect Excalibur architecture modules
                    </div>
                  )}
                </div>
              </div>

              {/* Right Column (within Forge): Typographic copy block + terminal simulator */}
              <div className={`w-full xl:w-1/2 max-w-xl flex flex-col items-end text-right order-1 xl:order-2 ${isMobile && forgeTab !== 'overview' ? 'hidden' : 'flex'}`}>
                <div className="relative">
                  <h2 className="text-6xl sm:text-[5.5rem] md:text-[11rem] font-black tracking-tighter leading-[0.8] text-stroke-cyan select-none absolute -top-8 md:-top-16 right-0 z-0 opacity-20 font-display">
                    FORGE
                  </h2>
                  <h2 className="text-4xl sm:text-5xl md:text-[7rem] font-black tracking-tighter leading-[0.8] uppercase select-none text-neutral-100 relative z-10 font-display">
                    THE FORGE
                  </h2>
                </div>
                
                <p className="mt-4 sm:mt-6 text-xs sm:text-sm font-mono tracking-wide text-cyan-400/90 max-w-md uppercase leading-relaxed text-justify">
                  Orchestrating 180+ localized sub-agents via model context protocols. Compile designs directly into production-grade systems in real-time.
                </p>

                {/* Live Console Logs Container */}
                <div className="mt-4 sm:mt-6 w-full max-w-md bg-neutral-950 border border-cyan-950/40 p-4 font-mono text-[10px] text-cyan-400 text-left rounded shadow-inner relative overflow-hidden">
                  <div className="absolute top-1 right-2 flex items-center space-x-1 text-[8px] text-neutral-500">
                    <span className="w-1 h-1 rounded-full bg-cyan-400 animate-ping" />
                    <span>LIVE PIPELINE</span>
                  </div>
                  
                  <div className="h-[120px] overflow-y-auto space-y-0.5 select-text pr-2 scrollbar-thin">
                    {terminalLogs.map((log, index) => (
                      <div key={index} className="flex space-x-1.5">
                        <span className="text-cyan-900 select-none">{(index+1).toString().padStart(2, '0')}</span>
                        <span className={log.startsWith('//') ? 'text-neutral-500' : log.includes('SYSTEM') || log.includes('SUCCESS') ? 'text-green-400' : 'text-cyan-300'}>
                          {log}
                        </span>
                      </div>
                    ))}
                    <div className="flex items-center space-x-1 text-cyan-400">
                      <span>&gt;</span>
                      <span className="w-1.5 h-3 bg-cyan-400 animate-pulse" />
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap justify-end gap-4 mt-6 sm:mt-8">
                  <button 
                    onClick={() => handleCanvasClick('forge')}
                    className="group flex items-center space-x-2 border border-cyan-400 bg-cyan-950/10 text-cyan-400 px-6 py-3 text-xs font-mono tracking-widest font-bold uppercase hover:bg-cyan-400 hover:text-black transition-all shadow-[0_4px_20px_rgba(34,211,238,0.1)]"
                  >
                    <span>BOOK A CONSULTATION</span>
                    <Mail size={14} className="group-hover:translate-x-0.5 transition-transform" />
                  </button>
                </div>
              </div>

            </div>

            {/* Bottom Panel Metadata list */}
            <div className={`z-10 grid grid-cols-2 md:grid-cols-4 gap-4 border-t border-cyan-950/40 pt-6 mt-4 text-left pr-4 md:pr-12 ${isMobile ? 'hidden' : 'grid'}`}>
              <div className="font-mono text-[10px] uppercase">
                <span className="text-neutral-600 block text-[9px]">ENGINE SPEC</span>
                <span className="text-neutral-300 font-bold">MCP COMPILER-V4</span>
              </div>
              <div className="font-mono text-[10px] uppercase">
                <span className="text-neutral-600 block text-[9px]">ACTIVE AGENTS</span>
                <span className="text-neutral-300 font-bold">180 CONCURRENT</span>
              </div>
              <div className="font-mono text-[10px] uppercase">
                <span className="text-neutral-600 block text-[9px]">COMPILATION</span>
                <span className="text-neutral-300 font-bold">AGENTIC DEV AGENCY</span>
              </div>
              <div className="font-mono text-[10px] uppercase">
                <span className="text-neutral-600 block text-[9px]">LATENCY STACK</span>
                <span className="text-cyan-400 font-bold">4.2MS STREAM</span>
              </div>
            </div>

          </div>
        </div>

        {/* ────────────────────────────────────────────────────────
            THE INTERACTIVE SWIPER CENTER SLIDER DIVIDER HANDLE
            ──────────────────────────────────────────────────────── */}
        <div 
          style={isMobile ? {
            top: `calc(${splitPercentage}% - 1.5px)`,
            left: 0,
            width: '100%',
            height: '3px',
            cursor: 'ns-resize'
          } : {
            left: `calc(${splitPercentage}% - 1.5px)`,
            top: 0,
            height: '100%',
            width: '3px',
            cursor: 'ew-resize'
          }}
          onMouseDown={handleMouseDown}
          onTouchStart={handleTouchStart}
          className={`absolute z-40 bg-white flex items-center justify-center transition-all ${isDragging ? 'bg-cyan-400 shadow-[0_0_25px_rgba(34,211,238,0.8)]' : 'hover:bg-neutral-300'} ${isMobile ? (isDragging ? 'scale-y-150' : '') : (isDragging ? 'scale-x-150' : '')}`}
        >
          {/* Vertical Graduated Ticking Ruler (Shows visual alignment) */}
          <div className="absolute h-full inset-y-0 -left-6 flex flex-col justify-between py-24 pointer-events-none opacity-40 select-none hidden md:flex">
            {Array.from({ length: 20 }).map((_, i) => (
              <div key={`tick-l-${i}`} className="flex items-center space-x-1">
                <span className="font-mono text-[7px] text-neutral-500">{(splitPercentage / 100).toFixed(2)}</span>
                <div className="w-2.5 h-[1px] bg-neutral-500" />
              </div>
            ))}
          </div>

          <div className="absolute h-full inset-y-0 -right-6 flex flex-col justify-between py-24 pointer-events-none opacity-40 select-none hidden md:flex">
            {Array.from({ length: 20 }).map((_, i) => (
              <div key={`tick-r-${i}`} className="flex items-center space-x-1 justify-end">
                <div className="w-2.5 h-[1px] bg-neutral-500" />
                <span className="font-mono text-[7px] text-neutral-500">{(1 - splitPercentage / 100).toFixed(2)}</span>
              </div>
            ))}
          </div>

          {/* Grab Handle Slider controller */}
          <div className={`${isMobile ? 'w-16 h-8 flex-row space-x-1.5' : 'w-12 h-16 flex-col space-y-1.5'} bg-neutral-900 border flex justify-center items-center rounded shadow-2xl pointer-events-none transition-transform duration-150 ${isDragging ? 'scale-110 border-cyan-400' : 'border-neutral-800 hover:border-neutral-600'}`}>
            <div className={`${isMobile ? 'w-4 h-[1.5px]' : 'w-[1.5px] h-4'} bg-white opacity-40`} />
            <span className="font-mono text-[7px] text-neutral-300 font-bold select-none leading-none">
              {Math.round(splitPercentage)}
            </span>
            <div className={`${isMobile ? 'w-4 h-[1.5px]' : 'w-[1.5px] h-4'} bg-white opacity-40`} />
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
          <div className="flex flex-col border-l border-neutral-800 pl-6 md:pl-12">
            <span className="text-[9px] text-neutral-600 block">SYSTEM GATEWAY</span>
            <span className="text-neutral-400 font-bold flex items-center space-x-1">
              <span>THE_FORGE</span>
              <Code2 size={12} className="text-cyan-400 ml-1" />
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
                EXCALIBUR IS THE PORTAL TO SK STUDIO AND THE FORGE.
              </h3>
              
              <div className="h-1 bg-[linear-gradient(to_right,#ff3344_50%,#22d3ee_50%)] w-24 my-6" />

              <p className="font-mono text-sm tracking-wide text-neutral-400 leading-relaxed uppercase text-justify max-w-2xl">
                Excalibur.dev serves as the gateway to our two core spaces: SK Creative Studio (visual design grid) and The Forge (agentic development agency running at port 4400).
              </p>

              {/* Graphic Flow Layout */}
              <div className="mt-12 bg-neutral-900/40 border border-neutral-900 p-6 rounded-lg font-mono text-xs">
                <span className="text-[10px] text-neutral-600 block mb-4">// SCHEMATIC OVERVIEW</span>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center items-center">
                  <div className="border border-neutral-800 p-4 bg-neutral-950">
                    <span className="text-brand-red font-bold block mb-1">SK_STUDIO</span>
                    <span className="text-[9px] text-neutral-500">Creative Design Space</span>
                  </div>
                  <div className="text-neutral-500 text-lg font-bold">
                    <span>-- GATEWAY ROUTER --</span>
                  </div>
                  <div className="border border-neutral-800 p-4 bg-neutral-950">
                    <span className="text-cyan-400 font-bold block mb-1">THE_FORGE</span>
                    <span className="text-[9px] text-neutral-500">Agentic Development Agency</span>
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
                      'Dual Identity Engine (Design + Dev)', 
                      'Aesthetic Design Systems (SK Studio)', 
                      'Agentic Development Agency (The Forge)',
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
