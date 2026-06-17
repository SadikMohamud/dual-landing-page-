import React, { useState, useEffect, useRef } from 'react';
import * as THREE from 'three';
import { 
  Menu, 
  X, 
  ArrowUpRight, 
  Mail, 
  ChevronRight, 
  Layers2
} from 'lucide-react';

const vertexShaderSource = `
void main() {
  gl_Position = vec4(position, 1.0);
}
`;

const fragmentShaderSource = `
uniform vec2 uResolution;
uniform sampler2D uMap;
uniform vec2 uPointer;
uniform float uDt;
uniform float uSpeed;
uniform float uTime;

vec4 permute(vec4 x){return mod(x*x*34.+x,289.);}
float snoise(vec3 v){
  const vec2 C = 1./vec2(6,3);
  const vec4 D = vec4(0,.5,1,2);
  vec3 i  = floor(v + dot(v, C.yyy));
  vec3 x0 = v - i + dot(i, C.xxx);
  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1. - g;
  vec3 i1 = min( g.xyz, l.zxy );
  vec3 i2 = max( g.xyz, l.zxy );
  vec3 x1 = x0 - i1 + C.x;
  vec3 x2 = x0 - i2 + C.y;
  vec3 x3 = x0 - D.yyy;
  i = mod(i,289.);
  vec4 p = permute( permute( permute(
	  i.z + vec4(0., i1.z, i2.z, 1.))
	+ i.y + vec4(0., i1.y, i2.y, 1.))
	+ i.x + vec4(0., i1.x, i2.x, 1.));
  vec3 ns = .142857142857 * D.wyz - D.xzx;
  vec4 j = p - 49. * floor(p * ns.z * ns.z);
  vec4 x_ = floor(j * ns.z);
  vec4 x = x_ * ns.x + ns.yyyy;
  vec4 y = floor(j - 7. * x_ ) *ns.x + ns.yyyy;
  vec4 h = 1. - abs(x) - abs(y);
  vec4 b0 = vec4( x.xy, y.xy );
  vec4 b1 = vec4( x.zw, y.zw );
  vec4 sh = -step(h, vec4(0));
  vec4 a0 = b0.xzyw + (floor(b0)*2.+ 1.).xzyw*sh.xxyy ;
  vec4 a1 = b1.xzyw + (floor(b1)*2.+ 1.).xzyw*sh.zzww ;
  vec3 p0 = vec3(a0.xy,h.x);
  vec3 p1 = vec3(a0.zw,h.y);
  vec3 p2 = vec3(a1.xy,h.z);
  vec3 p3 = vec3(a1.zw,h.w);
  vec4 norm = inversesqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
  p0 *= norm.x;
  p1 *= norm.y;
  p2 *= norm.z;
  p3 *= norm.w;
  vec4 m = max(.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.);
  return .5 + 12. * dot( m * m * m, vec4( dot(p0,x0), dot(p1,x1),dot(p2,x2), dot(p3,x3) ) );
}

vec3 snoiseVec3( vec3 x ){
  return vec3(  snoise(vec3( x )*2.-1.),
								snoise(vec3( x.y - 19.1 , x.z + 33.4 , x.x + 47.2 ))*2.-1.,
								snoise(vec3( x.z + 74.2 , x.x - 124.5 , x.y + 99.4 )*2.-1.)*2.-1.
	);
}

vec3 curlNoise( vec3 p ){
  const float e = .1;
  vec3 dx = vec3( e   , 0.0 , 0.0 );
  vec3 dy = vec3( 0.0 , e   , 0.0 );
  vec3 dz = vec3( 0.0 , 0.0 , e   );

  vec3 p_x0 = snoiseVec3( p - dx );
  vec3 p_x1 = snoiseVec3( p + dx );
  vec3 p_y0 = snoiseVec3( p - dy );
  vec3 p_y1 = snoiseVec3( p + dy );
  vec3 p_z0 = snoiseVec3( p - dz );
  vec3 p_z1 = snoiseVec3( p + dz );

  float x = p_y1.z - p_y0.z - p_z1.y + p_z0.y;
  float y = p_z1.x - p_z0.x - p_x1.z + p_x0.z;
  float z = p_x1.y - p_x0.y - p_y1.x + p_y0.x;

  const float divisor = 1.0 / ( 2.0 * e );
  return normalize( vec3( x , y , z ) * divisor );
}

void main() {
  vec2 uv = gl_FragCoord.xy / uResolution;

  vec2 uv2 = uv + curlNoise(vec3(uv * 4. + uTime * 0.1, uTime * 0.1)).xy * uDt * 0.3;
  uv += curlNoise(vec3(uv * 2. + uTime * 0.1, uTime * 0.1)).xy * uDt * 0.15;

  vec3 mapColor = texture2D(uMap, uv).rgb;
  vec3 mapColor2 = texture2D(uMap, uv2).rgb;

  uv -= 0.5;
  uv *= 2.0;
  uv.x *= uResolution.x / uResolution.y;
  vec2 pointer = uPointer;
  pointer.x *= uResolution.x / uResolution.y;

  float d = distance(uv, pointer);

  vec3 color = mix(mapColor, mapColor2, 0.5);
  color *= 1. - uDt * 2.0;
  float speed = clamp(uSpeed * 2.0, 0.075, 0.25);
  float t = smoothstep(speed, 0., d);
  float t2 = smoothstep(speed, 0., d);
  float t3 = smoothstep(speed, 0., d);
  t2 = pow(t2, 10.0);
  t3 = pow(t3, 4.0);
  float scale = speed * 5.0;
  t *= scale;
  t2 *= scale;
  t3 *= scale;

  // Color interpolation: Custom Excalibur Brand Colors (Cyan/Red/White)
  color = mix(color, vec3(1.0, 0.2, 0.267), t);       // Excalibur Red (rgb(255, 51, 68))
  color = mix(color, vec3(0.133, 0.827, 0.933), t3);  // Excalibur Cyan (rgb(34, 211, 238))
  color = mix(color, vec3(1.0), t2);                  // White Core

  color = clamp(color, 0.0, 1.0);

  gl_FragColor = vec4(color, 1.0);
}
`;

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

  // --- CANVAS INTERACTIVE CURSOR REFS ---
  const canvasRef = useRef<HTMLCanvasElement>(null);

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

  // --- WEBGL SHADER FEEDBACK SMOKY TRAIL LOOP ---
  useEffect(() => {
    if (isMobile) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const sizes = {
      width: window.innerWidth,
      height: window.innerHeight,
    };

    // Scene
    const scene = new THREE.Scene();

    // Camera
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

    // Renderer
    const renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      antialias: false,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(sizes.width, sizes.height, false);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Fullscreen Triangle Geometry
    const bgGeometry = new THREE.BufferGeometry();
    bgGeometry.setAttribute(
      'position',
      new THREE.BufferAttribute(
        new Float32Array([-1, -1, 0, 3, -1, 0, -1, 3, 0]),
        3
      )
    );
    bgGeometry.setAttribute(
      'uv',
      new THREE.BufferAttribute(new Float32Array([0, 0, 2, 0, 0, 2]), 2)
    );

    // Render Targets for double buffering
    let rtWidth = Math.floor(sizes.width * 0.25);
    let rtHeight = Math.floor(sizes.height * 0.25);
    
    let rt1 = new THREE.WebGLRenderTarget(rtWidth, rtHeight, {
      type: THREE.HalfFloatType,
      minFilter: THREE.LinearFilter,
      magFilter: THREE.LinearFilter,
      depthBuffer: false,
      stencilBuffer: false,
    });
    let rt2 = rt1.clone();

    let inputRT = rt1;
    let outputRT = rt2;

    // Trail shader material
    const trailMaterial = new THREE.ShaderMaterial({
      vertexShader: vertexShaderSource,
      fragmentShader: fragmentShaderSource,
      uniforms: {
        uResolution: new THREE.Uniform(new THREE.Vector2(rtWidth, rtHeight)),
        uMap: new THREE.Uniform(null),
        uPointer: new THREE.Uniform(new THREE.Vector2(0, 0)),
        uDt: new THREE.Uniform(0.0),
        uSpeed: new THREE.Uniform(0.0),
        uTime: new THREE.Uniform(0.0),
      },
      depthWrite: false,
      depthTest: false,
    });

    const trailMesh = new THREE.Mesh(bgGeometry, trailMaterial);
    const sceneTrail = new THREE.Scene();
    sceneTrail.add(trailMesh);

    // Output shader material (to render on screen with alpha cutout)
    const bgMaterial = new THREE.ShaderMaterial({
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform sampler2D uTrailMap;
        varying vec2 vUv;
        void main() {
          vec3 color = texture2D(uTrailMap, vUv).rgb;
          // Set alpha to 0 for black background so web content behind it is visible
          float alpha = smoothstep(0.01, 0.15, length(color));
          gl_FragColor = vec4(color, alpha);
        }
      `,
      uniforms: {
        uTrailMap: new THREE.Uniform(null),
      },
      depthWrite: false,
      depthTest: false,
      transparent: true,
    });

    const bgMesh = new THREE.Mesh(bgGeometry, bgMaterial);
    scene.add(bgMesh);

    // Track pointer coordinates
    const pointer = new THREE.Vector2(0, 0);
    let pointerMoved = false;

    const handlePointerMove = (e: MouseEvent) => {
      pointerMoved = true;
      // Map screen space to WebGL coordinate space [-1, 1]
      pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };

    window.addEventListener('mousemove', handlePointerMove);

    // Loop variables
    const clock = new THREE.Clock();
    let time = 0;
    let animationFrameId: number;

    const tick = () => {
      const dt = Math.min(clock.getDelta(), 0.1);
      time += dt;

      trailMaterial.uniforms.uTime.value = time;
      const prevPointer = trailMaterial.uniforms.uPointer.value;

      // Handle idle movement if pointer hasn't moved
      if (!pointerMoved) {
        pointer.x = 0.5 * Math.cos(time * 0.5) * Math.sin(time * 0.8);
        pointer.y = 0.3 * Math.cos(time * 0.6);
      }

      // Calculate pointer speed
      const dist = Math.sqrt((pointer.x - prevPointer.x) ** 2 + (pointer.y - prevPointer.y) ** 2);
      trailMaterial.uniforms.uSpeed.value = THREE.MathUtils.lerp(
        trailMaterial.uniforms.uSpeed.value,
        dist,
        dt * 3.0
      );

      // Lerp pointer position
      trailMaterial.uniforms.uPointer.value.lerp(pointer, dt * 15.0);
      trailMaterial.uniforms.uDt.value = dt;

      // 1. Render trail material to output Render Target
      renderer.setRenderTarget(outputRT);
      renderer.render(sceneTrail, camera);

      // 2. Render output to screen
      renderer.setRenderTarget(null);
      bgMaterial.uniforms.uTrailMap.value = outputRT.texture;
      trailMaterial.uniforms.uMap.value = outputRT.texture;
      
      renderer.render(scene, camera);

      // 3. Swap targets
      const temp = inputRT;
      inputRT = outputRT;
      outputRT = temp;

      animationFrameId = requestAnimationFrame(tick);
    };

    animationFrameId = requestAnimationFrame(tick);

    // Handle Resize
    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      if (sizes.width === width && sizes.height === height) return;

      sizes.width = width;
      sizes.height = height;

      renderer.setSize(width, height, false);
      
      const newWidth = Math.floor(width * 0.25);
      const newHeight = Math.floor(height * 0.25);
      rt1.setSize(newWidth, newHeight);
      rt2.setSize(newWidth, newHeight);
      
      trailMaterial.uniforms.uResolution.value.set(newWidth, newHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('mousemove', handlePointerMove);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      
      // Clean up WebGL resources
      bgGeometry.dispose();
      trailMaterial.dispose();
      bgMaterial.dispose();
      rt1.dispose();
      rt2.dispose();
      renderer.dispose();
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

        {/* Interactive WebGL Shader Smoky Cursor Trail */}
        {!isMobile && (
          <canvas 
            ref={canvasRef} 
            className="absolute inset-0 pointer-events-none z-30 w-full h-full" 
          />
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
