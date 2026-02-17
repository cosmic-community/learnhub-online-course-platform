'use client'

import { useState, useEffect } from 'react'

interface LearningProgressProps {
  totalCourses: number
  totalLessons: number
  totalHours: number
}

const motivationalMessages = [
  "🚀 Ready to level up your skills?",
  "💡 Every expert was once a beginner!",
  "🎯 Your learning journey starts now!",
  "⭐ Great things happen to those who learn!",
  "🔥 You're capable of amazing things!",
  "🌟 Knowledge is your superpower!",
]

const achievements = [
  { id: 'explorer', icon: '🧭', name: 'Explorer', description: 'Browse your first course', unlocked: true },
  { id: 'curious', icon: '🔍', name: 'Curious Mind', description: 'View 3 different categories', unlocked: true },
  { id: 'dedicated', icon: '📚', name: 'Dedicated Learner', description: 'Complete your first lesson', unlocked: false },
  { id: 'achiever', icon: '🏆', name: 'High Achiever', description: 'Finish a complete course', unlocked: false },
]

export default function LearningProgress({ totalCourses, totalLessons, totalHours }: LearningProgressProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [currentMessage, setCurrentMessage] = useState(0)
  const [animatedCourses, setAnimatedCourses] = useState(0)
  const [animatedLessons, setAnimatedLessons] = useState(0)
  const [animatedHours, setAnimatedHours] = useState(0)
  const [showAchievements, setShowAchievements] = useState(false)

  // Animate numbers on mount
  useEffect(() => {
    setIsVisible(true)
    
    const duration = 2000
    const steps = 60
    const interval = duration / steps

    let step = 0
    const timer = setInterval(() => {
      step++
      const progress = step / steps
      const easeOut = 1 - Math.pow(1 - progress, 3)
      
      setAnimatedCourses(Math.round(totalCourses * easeOut))
      setAnimatedLessons(Math.round(totalLessons * easeOut))
      setAnimatedHours(Math.round(totalHours * easeOut))

      if (step >= steps) {
        clearInterval(timer)
      }
    }, interval)

    return () => clearInterval(timer)
  }, [totalCourses, totalLessons, totalHours])

  // Rotate motivational messages
  useEffect(() => {
    const messageTimer = setInterval(() => {
      setCurrentMessage((prev) => (prev + 1) % motivationalMessages.length)
    }, 4000)

    return () => clearInterval(messageTimer)
  }, [])

  return (
    <div 
      className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
    >
      <div className="card p-8 relative overflow-hidden">
        {/* Animated background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 via-transparent to-purple-500/5 animate-pulse" />
        
        <div className="relative">
          {/* Header with motivational message */}
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-white mb-2">Your Learning Dashboard</h3>
            <p 
              key={currentMessage}
              className="text-navy-300 animate-fade-in"
            >
              {motivationalMessages[currentMessage]}
            </p>
          </div>

          {/* Progress Rings */}
          <div className="grid grid-cols-3 gap-6 mb-8">
            <ProgressRing 
              value={animatedCourses} 
              max={50} 
              label="Courses" 
              color="primary"
              icon="📚"
            />
            <ProgressRing 
              value={animatedLessons} 
              max={200} 
              label="Lessons" 
              color="emerald"
              icon="📖"
            />
            <ProgressRing 
              value={animatedHours} 
              max={100} 
              label="Hours" 
              color="purple"
              icon="⏱️"
            />
          </div>

          {/* Achievements Section */}
          <div className="border-t border-navy-800 pt-6">
            <button
              onClick={() => setShowAchievements(!showAchievements)}
              className="w-full flex items-center justify-between text-left group"
            >
              <div className="flex items-center gap-2">
                <span className="text-lg">🏅</span>
                <span className="text-white font-semibold">Achievements</span>
                <span className="text-xs bg-primary-500/20 text-primary-400 px-2 py-0.5 rounded-full">
                  {achievements.filter(a => a.unlocked).length}/{achievements.length}
                </span>
              </div>
              <svg 
                className={`w-5 h-5 text-navy-400 transition-transform ${showAchievements ? 'rotate-180' : ''}`}
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {showAchievements && (
              <div className="grid grid-cols-2 gap-3 mt-4 animate-slide-down">
                {achievements.map((achievement) => (
                  <div 
                    key={achievement.id}
                    className={`p-3 rounded-lg border transition-all ${
                      achievement.unlocked 
                        ? 'bg-navy-800/50 border-primary-500/30 hover:border-primary-500/50' 
                        : 'bg-navy-900/50 border-navy-800 opacity-50'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xl">{achievement.icon}</span>
                      <span className={`text-sm font-medium ${achievement.unlocked ? 'text-white' : 'text-navy-500'}`}>
                        {achievement.name}
                      </span>
                    </div>
                    <p className="text-xs text-navy-400">{achievement.description}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quick Stats Bar */}
          <div className="mt-6 flex items-center justify-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <span className="text-navy-400">Platform Active</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-primary-400">🎓</span>
              <span className="text-navy-400">New courses weekly</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Progress Ring Component
interface ProgressRingProps {
  value: number
  max: number
  label: string
  color: 'primary' | 'emerald' | 'purple'
  icon: string
}

function ProgressRing({ value, max, label, color, icon }: ProgressRingProps) {
  const percentage = Math.min((value / max) * 100, 100)
  const circumference = 2 * Math.PI * 40
  const strokeDashoffset = circumference - (percentage / 100) * circumference

  const colorClasses = {
    primary: {
      stroke: 'stroke-primary-500',
      text: 'text-primary-400',
      glow: 'drop-shadow-[0_0_8px_rgba(59,130,246,0.5)]',
    },
    emerald: {
      stroke: 'stroke-emerald-500',
      text: 'text-emerald-400',
      glow: 'drop-shadow-[0_0_8px_rgba(16,185,129,0.5)]',
    },
    purple: {
      stroke: 'stroke-purple-500',
      text: 'text-purple-400',
      glow: 'drop-shadow-[0_0_8px_rgba(168,85,247,0.5)]',
    },
  }

  const colors = colorClasses[color]

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-24 h-24">
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
          {/* Background circle */}
          <circle
            cx="50"
            cy="50"
            r="40"
            fill="none"
            stroke="currentColor"
            strokeWidth="8"
            className="text-navy-800"
          />
          {/* Progress circle */}
          <circle
            cx="50"
            cy="50"
            r="40"
            fill="none"
            strokeWidth="8"
            strokeLinecap="round"
            className={`${colors.stroke} ${colors.glow} transition-all duration-1000`}
            style={{
              strokeDasharray: circumference,
              strokeDashoffset: strokeDashoffset,
            }}
          />
        </svg>
        {/* Center content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-lg mb-0.5">{icon}</span>
          <span className={`text-lg font-bold ${colors.text}`}>{value}</span>
        </div>
      </div>
      <span className="text-navy-400 text-sm mt-2">{label}</span>
    </div>
  )
}