import React, { useEffect, useRef } from 'react';
import { TimerMode } from '../types';

interface ParticlesBackgroundProps {
  mode: TimerMode;
}

export const ParticlesBackground: React.FC<ParticlesBackgroundProps> = ({ mode }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let particles: Particle[] = [];
    // Reduced particle count for minimalism
    const particleCount = 35;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    class Particle {
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      opacity: number;
      growth: number;

      constructor() {
        this.x = Math.random() * (canvas?.width || window.innerWidth);
        this.y = Math.random() * (canvas?.height || window.innerHeight);
        this.size = Math.random() * 2 + 0.5; // Smaller, finer particles
        this.speedX = Math.random() * 0.2 - 0.1; // Extremely slow drift
        this.speedY = Math.random() * 0.2 - 0.1; 
        this.opacity = Math.random() * 0.15 + 0.05; // Very subtle transparency
        this.growth = Math.random() * 0.01 - 0.005; 
      }

      update() {
        if (!canvas) return;
        this.x += this.speedX;
        this.y += this.speedY;
        this.size += this.growth;

        if (this.size > 3 || this.size < 0.5) this.growth *= -1;

        if (this.x > canvas.width) this.x = 0;
        else if (this.x < 0) this.x = canvas.width;
        
        if (this.y > canvas.height) this.y = 0;
        else if (this.y < 0) this.y = canvas.height;
      }

      draw() {
        if (!ctx) return;
        
        // Neutral Stone color for all modes to maintain minimalism
        // Stone-400 (168, 162, 158)
        const r = 168; 
        const g = 162; 
        const b = 158;

        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${this.opacity})`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    const init = () => {
      particles = [];
      resizeCanvas();
      for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
      }
    };

    const animate = () => {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        p.update();
        p.draw();
      });
      animationFrameId = requestAnimationFrame(animate);
    };

    init();
    window.addEventListener('resize', resizeCanvas);
    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      className="absolute inset-0 pointer-events-none z-0"
      style={{ mixBlendMode: 'multiply' }} 
    />
  );
};