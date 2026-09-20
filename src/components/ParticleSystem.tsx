import { useEffect, useRef } from 'react';
import { Particle } from '../utils/riftTransfer';

interface ParticleSystemProps {
  particles: Particle[];
  width: number;
  height: number;
  className?: string;
}

export default function ParticleSystem({ particles, width, height, className = '' }: ParticleSystemProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const particlesRef = useRef<Particle[]>(particles);

  useEffect(() => {
    particlesRef.current = particles;
  }, [particles]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      particlesRef.current.forEach((particle) => {
        if (particle.opacity <= 0) return;

        // Draw particle with liquid glass effect
        ctx.save();
        ctx.globalAlpha = particle.opacity;

        // Create radial gradient for glass-like appearance
        const gradient = ctx.createRadialGradient(
          particle.x, particle.y, 0,
          particle.x, particle.y, particle.size
        );
        
        gradient.addColorStop(0, particle.color);
        gradient.addColorStop(0.5, `${particle.color}80`);
        gradient.addColorStop(1, 'transparent');

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fill();

        // Add subtle bloom effect
        ctx.shadowBlur = particle.size * 2;
        ctx.shadowColor = particle.color;
        ctx.fill();

        ctx.restore();
      });

      animationRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [width, height]);

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      className={`pointer-events-none ${className}`}
      style={{ position: 'absolute', top: 0, left: 0 }}
    />
  );
}

// Particle physics utilities
export function createParticle(
  x: number,
  y: number,
  targetX: number,
  targetY: number,
  color: string = '#663af3'
): Particle {
  const angle = Math.atan2(targetY - y, targetX - x);
  const speed = 0.5 + Math.random() * 1.5;
  
  return {
    id: Math.random(),
    x,
    y,
    vx: Math.cos(angle) * speed + (Math.random() - 0.5) * 0.5,
    vy: Math.sin(angle) * speed + (Math.random() - 0.5) * 0.5,
    size: 1 + Math.random() * 2,
    opacity: 0.6 + Math.random() * 0.4,
    life: 0,
    maxLife: 60 + Math.random() * 40,
    color,
  };
}

export function updateParticle(particle: Particle, targetX?: number, targetY?: number): Particle {
  const newParticle = { ...particle };
  
  // Apply attraction to target if provided
  if (targetX !== undefined && targetY !== undefined) {
    const dx = targetX - particle.x;
    const dy = targetY - particle.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    if (distance > 0) {
      const force = 0.02 / Math.max(distance * 0.01, 1);
      newParticle.vx += (dx / distance) * force;
      newParticle.vy += (dy / distance) * force;
    }
  }

  // Apply damping
  newParticle.vx *= 0.98;
  newParticle.vy *= 0.98;

  // Update position
  newParticle.x += newParticle.vx;
  newParticle.y += newParticle.vy;

  // Update life
  newParticle.life++;

  // Fade out near end of life
  if (newParticle.life > newParticle.maxLife * 0.7) {
    newParticle.opacity *= 0.95;
  }

  return newParticle;
}

export function isParticleAlive(particle: Particle): boolean {
  return particle.life < particle.maxLife && particle.opacity > 0.01;
}
