import { useState, useEffect, useRef } from 'react';
import './App.css'; // if needed, but we use index.css

type State = 'closed' | 'opening' | 'open' | 'closing';

function Confetti({ active }: { active: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!active) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles: any[] = [];
    const colors = ['#f5c842', '#e84545', '#45e884', '#4584e8', '#e845c4'];

    for (let i = 0; i < 60; i++) {
      particles.push({
        x: canvas.width / 2,
        y: canvas.height / 2,
        vx: (Math.random() - 0.5) * 20,
        vy: (Math.random() - 1) * 25 - 5,
        size: Math.random() * 8 + 4,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 10
      });
    }

    let animationFrame: number;
    const startTime = performance.now();

    const render = (time: number) => {
      if (time - startTime > 3500) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        return;
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.5; // Gravity
        p.rotation += p.rotationSpeed;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
        ctx.restore();
      });

      animationFrame = requestAnimationFrame(render);
    };

    animationFrame = requestAnimationFrame(render);

    return () => cancelAnimationFrame(animationFrame);
  }, [active]);

  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-[100] transition-opacity duration-1000" style={{ opacity: active ? 1 : 0 }} />;
}

export default function App() {
  const [state, setState] = useState<State>('closed');

  const handleBoxClick = () => {
    if (state === 'closed') {
      setState('opening');
      setTimeout(() => setState('open'), 1000);
    }
  };

  const handlePaperClick = () => {
    if (state === 'open') {
      setState('closing');
      setTimeout(() => setState('closed'), 1000);
    }
  };

  const stars = useRef(Array.from({ length: 50 }).map(() => ({
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 100}%`,
    size: `${Math.random() * 3 + 1}px`,
    delay: `${Math.random() * 5}s`,
    duration: `${Math.random() * 3 + 2}s`
  }))).current;

  const isLidOpen = state === 'opening' || state === 'open';

  return (
    <div className="relative w-full h-[100dvh] flex flex-col items-center justify-center font-[Lora] overflow-hidden">
      {/* Stars Background */}
      {stars.map((s, i) => (
        <div key={i} className="star z-0" style={{
          left: s.left, top: s.top, width: s.size, height: s.size,
          '--delay': s.delay, '--duration': s.duration
        } as any} />
      ))}

      <Confetti active={isLidOpen} />

      {/* Main Title */}
      <h1 className="absolute top-12 md:top-16 z-0 text-3xl md:text-5xl font-bold text-[#f5c842] drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] text-center font-[Playfair Display] px-4 pointer-events-none">
        ¡FELIZ CUMPLEAÑOS MAMI!
      </h1>

      {/* Main 3D Scene */}
      <div
        className="relative perspective-[1200px] flex items-center justify-center z-10 box-float mt-16"
        style={{ width: '80vw', maxWidth: '400px', height: '400px' }}
      >

        {/* Paper Letter */}
        <div
          onClick={handlePaperClick}
          className={`absolute z-30 w-[80vw] max-w-[320px] bg-[#fdf6e3] text-black p-6 md:p-8 rounded shadow-[0_20px_50px_rgba(0,0,0,0.5)] origin-bottom transition-all duration-[1200ms] ease-[cubic-bezier(0.34,1.56,0.64,1)] ${state === 'open' ? 'cursor-pointer' : 'pointer-events-none'}`}
          style={{
            transform: state === 'open' ? 'translateY(-20px) rotateX(0deg) scale(1)' : 'translateY(120px) rotateX(-90deg) scale(0)',
            opacity: state === 'open' ? 1 : 0,
            fontFamily: "'Playfair Display', serif"
          }}
        >
          <h2 className="text-2xl font-bold mb-4 text-[#e84545] text-center">¡Feliz Cumpleaños!</h2>
          <div className="text-base md:text-lg leading-relaxed text-center space-y-4">
            {/* TODO: escribe tu mensaje aquí */}
            <p>Mami,</p>
            <p>Hoy, te hago esta tarjeta para desearte un muy feliz cumpleaños! Eres la mejor mamá del mundo y me siento MUY afortunado de tenerte a mi lado. Gracias por todo el apoyo y el aliento que me das a diario, sin eso, no seria la persona que soy hoy.</p>
            <p>Te amo muchisimo! ❤️</p>
            <p className="mt-6 font-[Lora] font-bold text-right text-sm text-[#e84545]">Con cariño,<br />Nico</p>
          </div>
        </div>

        {/* Box */}
        <div
          onClick={handleBoxClick}
          className={`relative w-40 h-40 transition-transform duration-500 ease-in-out ${state === 'closed' ? 'cursor-pointer hover:scale-105' : ''}`}
          style={{
            transformStyle: 'preserve-3d',
            transform: 'rotateX(-25deg) rotateY(-40deg)',
            zIndex: state === 'open' ? 20 : 40
          }}
        >
          {/* Box Back */}
          <div className="absolute inset-0 bg-[#d4aa22] border-2 border-[#b88f11]" style={{ transform: 'translateZ(-80px) rotateY(180deg)' }}></div>
          {/* Box Bottom */}
          <div className="absolute inset-0 bg-[#cca21f] border-2 border-[#b88f11]" style={{ transform: 'translateY(80px) rotateX(-90deg)' }}></div>
          {/* Box Left */}
          <div className="absolute inset-0 bg-[#cca21f] border-2 border-[#b88f11]" style={{ transform: 'translateX(-80px) rotateY(-90deg)' }}></div>
          {/* Box Right */}
          <div className="absolute inset-0 bg-[#e5bb33] border-2 border-[#b88f11]" style={{ transform: 'translateX(80px) rotateY(90deg)' }}>
            {/* Vertical Ribbon */}
            <div className="absolute left-1/2 -ml-3 w-6 h-full bg-[#e84545]"></div>
          </div>
          {/* Box Front */}
          <div className="absolute inset-0 bg-[#f5c842] border-2 border-[#d4aa22]" style={{ transform: 'translateZ(80px)' }}>
            {/* Vertical Ribbon */}
            <div className="absolute left-1/2 -ml-3 w-6 h-full bg-[#e84545]"></div>
          </div>

          {/* Lid */}
          <div
            className="absolute inset-0 origin-top transition-transform duration-[1000ms] ease-in-out z-50 transform-style-3d"
            style={{
              transformStyle: 'preserve-3d',
              transform: isLidOpen ? 'translateZ(-80px) rotateX(210deg)' : 'translateZ(-80px) rotateX(90deg)',
            }}
          >
            {/* Lid Outer Base */}
            <div className="absolute w-[180px] h-[180px] -left-[10px] -top-[10px] bg-[#f5c842] border-2 border-[#d4aa22] shadow-xl">
              {/* Ribbons */}
              <div className="absolute left-1/2 -ml-[12px] w-6 h-full bg-[#e84545]"></div>
              <div className="absolute top-1/2 -mt-[12px] h-6 w-full bg-[#e84545]"></div>
            </div>

            {/* Bow */}
            <div className="absolute top-1/2 left-1/2" style={{ transform: 'translate(-50%, -50%) translateZ(10px)' }}>
              <div className="relative w-16 h-16 transform rotate-45 border-4 border-[#e84545] rounded-full shadow-lg"></div>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-[#e84545] rounded-full"></div>
            </div>

            {/* Small Tag */}
            <div
              className={`absolute top-1/4 right-0 w-28 bg-white text-black p-2 rounded shadow-md transform rotate-12 transition-opacity duration-300 ${isLidOpen ? 'opacity-0' : 'opacity-100'}`}
              style={{ transform: 'translateZ(12px) rotate(12deg)' }}
            >
              <p className="text-[10px] font-bold text-center leading-tight">Para Mamá 💛<br />— de Nico</p>
            </div>
          </div>
        </div>

      </div>

      {/* Footer Text */}
      <div className="absolute bottom-12 z-50 text-center text-white/90 drop-shadow-md transition-opacity duration-300 pointer-events-none">
        {state === 'closed' && <p className="animate-pulse text-sm md:text-base">Toca la caja para abrir tu regalo 🎁</p>}
        {state === 'open' && <p className="animate-pulse text-sm md:text-base">Toca el papel para guardarlo</p>}
      </div>

    </div>
  );
}

/*
 =======================
  PASOS PARA DESPLEGAR A GITHUB PAGES:
 =======================

 1. Abre la terminal en tu proyecto y asegúrate de estar en la rama principal.
 2. En `vite.config.ts`, cambia `base: '/nombre-del-repo/'` por el nombre de tu repo.
 3. En `package.json`, asegúrate de tener este script:
    "predeploy": "npm run build",
    "deploy": "gh-pages -d dist"
 4. Sube tu proyecto a GitHub:
    git init
    git add .
    git commit -m "Initial commit"
    git branch -M main
    git remote add origin https://github.com/<tu-usuario>/<nombre-del-repo>.git
    git push -u origin main
 5. Corre en tu terminal:
    npm run deploy
 6. Ve a Configuración (Settings) en tu repo de GitHub -> Pages y asegúrate de que esté habilitado en la rama gh-pages.
    ¡Listo! En unos minutos tu tarjeta estará en línea.
*/
