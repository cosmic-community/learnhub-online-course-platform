'use client'

import { useEffect, useState } from 'react'
import type { Achievement } from '@/lib/progress'

interface AchievementToastProps {
  achievement: Achievement
  onClose: () => void
}

export default function AchievementToast({ achievement, onClose }: AchievementToastProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [isLeaving, setIsLeaving] = useState(false)
  
  useEffect(() => {
    // Trigger entrance animation
    requestAnimationFrame(() => {
      setIsVisible(true)
    })
    
    // Auto dismiss after 5 seconds
    const timer = setTimeout(() => {
      setIsLeaving(true)
      setTimeout(onClose, 300)
    }, 5000)
    
    return () => clearTimeout(timer)
  }, [onClose])
  
  return (
    <div
      className={`fixed top-4 right-4 z-[100] transition-all duration-300 ${
        isVisible && !isLeaving
          ? 'opacity-100 translate-x-0'
          : 'opacity-0 translate-x-full'
      }`}
    >
      <div className="bg-gradient-to-r from-primary-500/20 to-primary-600/20 backdrop-blur-lg border border-primary-500/50 rounded-2xl p-4 shadow-2xl shadow-primary-500/20 max-w-sm">
        <div className="flex items-start gap-4">
          {/* Icon with celebration animation */}
          <div className="relative">
            <div className="w-14 h-14 rounded-xl bg-primary-500/30 flex items-center justify-center text-3xl animate-bounce">
              {achievement.icon}
            </div>
            {/* Sparkles */}
            <div className="absolute -top-1 -right-1 text-yellow-400 animate-ping">✨</div>
          </div>
          
          <div className="flex-1">
            <div className="text-xs text-primary-400 font-semibold uppercase tracking-wider mb-1">
              🎉 Achievement Unlocked!
            </div>
            <h4 className="font-bold text-white text-lg">
              {achievement.title}
            </h4>
            <p className="text-navy-300 text-sm mt-1">
              {achievement.description}
            </p>
          </div>
          
          <button
            onClick={() => {
              setIsLeaving(true)
              setTimeout(onClose, 300)
            }}
            className="text-navy-400 hover:text-white transition-colors"
          >
            ✕
          </button>
        </div>
      </div>
    </div>
  )
}