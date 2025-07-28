import React, { useEffect, useState } from 'react'

export function FloatingOrbs() {
  const [orbs, setOrbs] = useState<Array<{
    id: string;
    x: number;
    y: number;
    size: number;
    speed: number;
    direction: number;
    opacity: number;
    hue: number;
  }>>([]);

  useEffect(() => {
    // Generate random orbs
    const newOrbs = Array.from({ length: 6 }, (_, i) => ({
      id: `orb-${i}`,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: 100 + Math.random() * 200,
      speed: 0.2 + Math.random() * 0.5,
      direction: Math.random() * Math.PI * 2,
      opacity: 0.03 + Math.random() * 0.07,
      hue: 200 + Math.random() * 160 // Blue to purple range
    }));
    setOrbs(newOrbs);

    // Animate orbs
    const interval = setInterval(() => {
      setOrbs(prevOrbs => prevOrbs.map(orb => {
        let newX = orb.x + Math.cos(orb.direction) * orb.speed;
        let newY = orb.y + Math.sin(orb.direction) * orb.speed;
        let newDirection = orb.direction;

        // Bounce off walls
        if (newX <= 0 || newX >= 100) {
          newDirection = Math.PI - orb.direction;
          newX = Math.max(0, Math.min(100, newX));
        }
        if (newY <= 0 || newY >= 100) {
          newDirection = -orb.direction;
          newY = Math.max(0, Math.min(100, newY));
        }

        return {
          ...orb,
          x: newX,
          y: newY,
          direction: newDirection,
          hue: (orb.hue + 0.1) % 360 // Slowly shift colors
        };
      }));
    }, 50);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      {orbs.map(orb => (
        <div
          key={orb.id}
          className="absolute rounded-full transition-all duration-1000 ease-in-out"
          style={{
            left: `${orb.x}%`,
            top: `${orb.y}%`,
            width: `${orb.size}px`,
            height: `${orb.size}px`,
            background: `radial-gradient(circle, hsl(${orb.hue}, 70%, 60%, ${orb.opacity}) 0%, transparent 70%)`,
            filter: 'blur(40px)',
            transform: 'translate(-50%, -50%)',
            animation: `float-up ${20 + Math.random() * 10}s ease-in-out infinite alternate`
          }}
        />
      ))}


    </div>
  )
}