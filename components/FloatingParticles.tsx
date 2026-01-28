'use client'

import { useEffect, useRef } from 'react'

export default function FloatingParticles() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const particleCount = 20
    const particles: HTMLDivElement[] = []

    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement('div')
      particle.className = 'absolute rounded-full pointer-events-none'
      
      // Random size
      const size = Math.random() * 4 + 2
      particle.style.width = `${size}px`
      particle.style.height = `${size}px`
      
      // Random position
      particle.style.left = `${Math.random() * 100}%`
      particle.style.top = `${Math.random() * 100}%`
      
      // Random color (primary or white with varying opacity)
      const isPrimary = Math.random() > 0.5
      particle.style.backgroundColor = isPrimary 
        ? `rgba(20, 184, 166, ${Math.random() * 0.3 + 0.1})` 
        : `rgba(255, 255, 255, ${Math.random() * 0.1 + 0.05})`
      
      // Animation
      particle.style.animation = `float ${Math.random() * 10 + 10}s ease-in-out infinite`
      particle.style.animationDelay = `${Math.random() * 5}s`
      
      container.appendChild(particle)
      particles.push(particle)
    }

    return () => {
      particles.forEach(p => p.remove())
    }
  }, [])

  return (
    <>
      <style jsx global>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0) translateX(0) scale(1);
            opacity: 0.3;
          }
          25% {
            transform: translateY(-20px) translateX(10px) scale(1.1);
            opacity: 0.6;
          }
          50% {
            transform: translateY(-10px) translateX(-10px) scale(0.9);
            opacity: 0.4;
          }
          75% {
            transform: translateY(-30px) translateX(5px) scale(1.05);
            opacity: 0.5;
          }
        }
      `}</style>
      <div 
        ref={containerRef}
        className="absolute inset-0 overflow-hidden pointer-events-none"
        aria-hidden="true"
      />
    </>
  )
}