import { useEffect, useRef } from "react";

type WeatherCondition =
  | "Thunderstorm"
  | "Drizzle"
  | "Rain"
  | "Snow"
  | "Mist"
  | "Smoke"
  | "Haze"
  | "Fog"
  | "Clear"
  | "Clouds"
  | string;

interface WeatherBackgroundProps {
  condition: WeatherCondition;
}

function rand(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  color?: string;
  twinkleOffset?: number;
}

function createRainDrop(w: number, heavy = false): Particle {
  return {
    x: rand(0, w),
    y: rand(-300, 0),
    vx: heavy ? rand(-1, -0.3) : rand(-0.4, 0.4),
    vy: heavy ? rand(18, 28) : rand(10, 18),
    size: heavy ? rand(1.5, 2.5) : rand(1, 1.8),
    alpha: heavy ? rand(0.55, 0.85) : rand(0.35, 0.6),
    color: heavy ? "#7eb8f7" : "#b3d4ff",
  };
}

function createSnowflake(w: number): Particle {
  return {
    x: rand(0, w),
    y: rand(-80, 0),
    vx: rand(-0.8, 0.8),
    vy: rand(0.8, 2.8),
    size: rand(3, 7),
    alpha: rand(0.7, 1),
    color: "#eaf4ff",
  };
}

function createStar(w: number, h: number, i: number): Particle {
  return {
    x: rand(0, w),
    y: rand(0, h * 0.85),
    vx: 0,
    vy: 0,
    size: rand(0.8, 2.8),
    alpha: rand(0.5, 1),
    color: i % 5 === 0 ? "#ffe9a0" : "#ffffff",
    twinkleOffset: rand(0, Math.PI * 2),
  };
}

function createFogParticle(w: number, h: number): Particle {
  return {
    x: rand(-200, w + 200),
    y: rand(0, h),
    vx: rand(0.3, 0.7),
    vy: rand(-0.08, 0.08),
    size: rand(100, 200),
    alpha: rand(0.06, 0.14),
    color: "#c0d4e8",
  };
}

// Desenha gotas de chuva como traços inclinados caindo
function drawRain(
  ctx: CanvasRenderingContext2D,
  particles: Particle[],
  w: number,
  h: number,
  heavy = false
) {
  ctx.clearRect(0, 0, w, h);
  particles.forEach((p) => {
    ctx.globalAlpha = p.alpha;
    ctx.strokeStyle = p.color ?? "#b3d4ff";
    ctx.lineWidth = p.size;
    ctx.lineCap = "round";
    const len = heavy ? p.vy * 2.2 : p.vy * 1.6;
    ctx.beginPath();
    ctx.moveTo(p.x, p.y);
    ctx.lineTo(p.x + p.vx * 4, p.y + len);
    ctx.stroke();
    p.x += p.vx;
    p.y += p.vy;
    if (p.y > h + 20) {
      p.y = rand(-120, -10);
      p.x = rand(0, w);
    }
  });
  ctx.globalAlpha = 1;
}

// Desenha flocos de neve com brilho (glow) e movimento ondulado
function drawSnow(
  ctx: CanvasRenderingContext2D,
  particles: Particle[],
  w: number,
  h: number,
  tick: number
) {
  ctx.clearRect(0, 0, w, h);
  particles.forEach((p, i) => {
    ctx.globalAlpha = p.alpha;
    ctx.fillStyle = p.color ?? "#eaf4ff";
    ctx.shadowColor = "#ffffff";
    ctx.shadowBlur = 6;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;
    p.x += p.vx + Math.sin(tick * 0.018 + i * 0.4) * 0.5;
    p.y += p.vy;
    if (p.y > h + 10) {
      p.y = -10;
      p.x = rand(0, w);
    }
  });
  ctx.globalAlpha = 1;
}

// Desenha estrelas que piscam suavemente com efeito de pulso
function drawStars(
  ctx: CanvasRenderingContext2D,
  particles: Particle[],
  w: number,
  h: number,
  tick: number
) {
  ctx.clearRect(0, 0, w, h);
  particles.forEach((p) => {
    const offset = p.twinkleOffset ?? 0;
    const pulse = (Math.sin(tick * 0.04 + offset) + 1) / 2;
    const alpha = 0.3 + pulse * 0.7;
    const size = p.size * (0.7 + pulse * 0.5);
    ctx.globalAlpha = alpha;
    ctx.fillStyle = p.color ?? "#ffffff";
    ctx.shadowColor = p.color === "#ffe9a0" ? "#ffdd55" : "#aad4ff";
    ctx.shadowBlur = size * 4;
    ctx.beginPath();
    ctx.arc(p.x, p.y, size, 0, Math.PI * 2);
    ctx.fill();
  });
  ctx.shadowBlur = 0;
  ctx.globalAlpha = 1;
}

// Desenha névoa com bolhas de gradiente radial se movendo lentamente
function drawFog(
  ctx: CanvasRenderingContext2D,
  particles: Particle[],
  w: number,
  h: number
) {
  ctx.clearRect(0, 0, w, h);
  particles.forEach((p) => {
    const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size);
    gradient.addColorStop(0, `rgba(192,212,232,${p.alpha})`);
    gradient.addColorStop(1, "rgba(192,212,232,0)");
    ctx.fillStyle = gradient;
    ctx.globalAlpha = 1;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    ctx.fill();
    p.x += p.vx;
    p.y += p.vy;
    if (p.x > w + 250) p.x = -250;
  });
}

// Desenha chuva pesada + flashes de tela + raios com galhos a cada ~80 frames
function drawThunder(
  ctx: CanvasRenderingContext2D,
  particles: Particle[],
  w: number,
  h: number,
  tick: number
) {
  drawRain(ctx, particles, w, h, true);

  const triggerEvery = 80;
  const flashDuration = 5;

  if (tick % triggerEvery < flashDuration) {
    const phase = tick % triggerEvery;
    const flashAlpha = phase < 2 ? 0.22 : 0.1;
    ctx.fillStyle = `rgba(180,210,255,${flashAlpha})`;
    ctx.fillRect(0, 0, w, h);

    if (phase === 0) {
      const lx = rand(w * 0.15, w * 0.85);
      ctx.strokeStyle = "rgba(220,240,255,0.95)";
      ctx.lineWidth = 2.5;
      ctx.shadowColor = "#a0c8ff";
      ctx.shadowBlur = 30;
      ctx.beginPath();
      ctx.moveTo(lx, 0);
      let cy = 0;
      const segs = Math.floor(rand(5, 9));
      let cx = lx;
      for (let s = 0; s < segs; s++) {
        cy += rand(40, 80);
        cx += rand(-50, 50);
        ctx.lineTo(cx, cy);
      }
      ctx.stroke();

      // branch
      ctx.lineWidth = 1;
      ctx.shadowBlur = 15;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(cx + rand(30, 80), cy + rand(40, 100));
      ctx.stroke();
      ctx.shadowBlur = 0;
    }
  }
}

const PARTICLE_COUNT: Record<string, number> = {
  Rain: 220,
  Drizzle: 110,
  Snow: 150,
  Thunderstorm: 260,
  Clear: 100,
  Clouds: 28,
  Mist: 28,
  Fog: 28,
  Smoke: 22,
  Haze: 22,
};

export const WeatherBackground = ({ condition }: WeatherBackgroundProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    let tick = 0;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const w = () => canvas.width;
    const h = () => canvas.height;
    const count = PARTICLE_COUNT[condition] ?? 0;
    const heavy = condition === "Thunderstorm";

    let particles: Particle[] = [];

    if (condition === "Rain" || condition === "Drizzle" || condition === "Thunderstorm") {
      particles = Array.from({ length: count }, () => createRainDrop(w(), heavy));
    } else if (condition === "Snow") {
      particles = Array.from({ length: count }, () => createSnowflake(w()));
    } else if (["Mist", "Fog", "Smoke", "Haze", "Clouds"].includes(condition)) {
      particles = Array.from({ length: count }, () => createFogParticle(w(), h()));
    } else if (condition === "Clear") {
      particles = Array.from({ length: count }, (_, i) => createStar(w(), h(), i));
    }

    const loop = () => {
      if (condition === "Rain" || condition === "Drizzle") {
        drawRain(ctx, particles, w(), h());
      } else if (condition === "Snow") {
        drawSnow(ctx, particles, w(), h(), tick);
      } else if (condition === "Thunderstorm") {
        drawThunder(ctx, particles, w(), h(), tick);
      } else if (["Mist", "Fog", "Smoke", "Haze", "Clouds"].includes(condition)) {
        drawFog(ctx, particles, w(), h());
      } else if (condition === "Clear") {
        drawStars(ctx, particles, w(), h(), tick);
      } else {
        ctx.clearRect(0, 0, w(), h());
      }
      tick++;
      animationId = requestAnimationFrame(loop);
    };

    loop();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", resize);
    };
  }, [condition]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        pointerEvents: "none",
        zIndex: 0,
        opacity: 0.85,
      }}
      aria-hidden="true"
    />
  );
};
