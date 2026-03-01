'use client'

import { useState, useEffect, useCallback } from 'react'

interface StreakData {
  currentStreak: number
  lastVisitDate: string
  longestStreak: number
  totalVisits: number
}

const MOTIVATIONAL_MESSAGES: Record<number, string> = {
  1: "Great start! Keep coming back! 🌱",
  3: "3 days strong! You're building momentum! 💪",
  7: "One week streak! You're dedicated! 🌟",
  14: "Two weeks! You're unstoppable! 🔥",
  30: "A whole month! Learning legend! 👑",
  50: "50 days! You're inspiring! 🚀",
  100: "100 DAYS! Absolute champion! 🏆",
}

function getMotivationalMessage(streak: number): string {
  const milestones = Object.keys(MOTIVATIONAL_MESSAGES)
    .map(Number)
    .sort((a, b) => b - a)
  
  for (const milestone of milestones) {
    if (streak >= milestone) {
      return MOTIVATIONAL_MESSAGES[milestone] ?? "Keep learning! 📚"
    }
  }
  return "Welcome to your learning journey! 📚"
}

function Confetti() {
  const [particles, setParticles] = useState<Array<{
    id: number
    x: number
    color: string
    delay: number
    duration: number
  }>>([])

  useEffect(() => {
    const colors = ['#f59e0b', '#ef4444', '#10b981', '#3b82f6', '#8b5cf6', '#ec4899']
    const newParticles = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      color: colors[Math.floor(Math.random() * colors.length)] ?? '#f59e0b',
      delay: Math.random() * 0.5,
      duration: 2 + Math.random() * 2,
    }))
    setParticles(newParticles)
  }, [])

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute w-3 h-3 rounded-full animate-confetti"
          style={{
            left: `${particle.x}%`,
            backgroundColor: particle.color,
            animationDelay: `${particle.delay}s`,
            animationDuration: `${particle.duration}s`,
          }}
        />
      ))}
    </div>
  )
}

export default function LearningStreak() {
  const [streakData, setStreakData] = useState<StreakData | null>(null)
  const [showConfetti, setShowConfetti] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const [justReachedMilestone, setJustReachedMilestone] = useState(false)

  const checkAndUpdateStreak = useCallback(() => {
    const stored = localStorage.getItem('learnhub-streak')
    const today = new Date().toISOString().split('T')[0]
    
    if (!today) return
    
    let data: StreakData = stored ? JSON.parse(stored) : {
      currentStreak: 0,
      lastVisitDate: '',
      longestStreak: 0,
      totalVisits: 0,
    }
    
    if (data.lastVisitDate === today) {
      // Already visited today
      setStreakData(data)
      return
    }
    
    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)
    const yesterdayStr = yesterday.toISOString().split('T')[0]
    
    const previousStreak = data.currentStreak
    
    if (data.lastVisitDate === yesterdayStr) {
      // Consecutive day!
      data.currentStreak += 1
    } else if (data.lastVisitDate === '') {
      // First visit ever
      data.currentStreak = 1
    } else {
      // Streak broken, start fresh
      data.currentStreak = 1
    }
    
    data.lastVisitDate = today
    data.totalVisits += 1
    data.longestStreak = Math.max(data.longestStreak, data.currentStreak)
    
    localStorage.setItem('learnhub-streak', JSON.stringify(data))
    setStreakData(data)
    
    // Check if we just hit a milestone
    const milestones = [3, 7, 14, 30, 50, 100]
    const hitMilestone = milestones.some(m => data.currentStreak === m && previousStreak < m)
    
    if (hitMilestone || data.currentStreak === 1 && previousStreak === 0) {
      setShowConfetti(true)
      setJustReachedMilestone(hitMilestone)
      setTimeout(() => setShowConfetti(false), 4000)
    }
  }, [])

  useEffect(() => {
    checkAndUpdateStreak()
  }, [checkAndUpdateStreak])

  if (!streakData) return null

  const message = getMotivationalMessage(streakData.currentStreak)
  const isHighStreak = streakData.currentStreak >= 7

  return (
    <>
      {showConfetti && <Confetti />}
      
      <div 
        className={`fixed bottom-24 right-5 z-40 transition-all duration-300 ${
          isExpanded ? 'w-72' : 'w-auto'
        }`}
      >
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className={`relative flex items-center gap-2 px-4 py-3 rounded-2xl shadow-lg transition-all duration-300 hover:scale-105 ${
            isHighStreak 
              ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white' 
              : 'bg-navy-800 border border-navy-700 text-white'
          }`}
        >
          {/* Fire animation for high streaks */}
          {isHighStreak && (
            <span className="absolute -top-2 -left-2 text-2xl animate-bounce">🔥</span>
          )}
          
          <span className="text-2xl">{streakData.currentStreak > 0 ? '🔥' : '✨'}</span>
          <span className="font-bold text-lg">{streakData.currentStreak}</span>
          <span className="text-sm opacity-80">day{streakData.currentStreak !== 1 ? 's' : ''}</span>
          
          {justReachedMilestone && showConfetti && (
            <span className="absolute -top-3 -right-3 text-xl animate-pulse">🎉</span>
          )}
        </button>
        
        {isExpanded && (
          <div className="mt-2 p-4 bg-navy-900 border border-navy-700 rounded-xl shadow-xl animate-fadeIn">
            <div className="text-center mb-3">
              <p className="text-sm text-navy-300 mb-1">Learning Streak</p>
              <p className="text-3xl font-bold text-white flex items-center justify-center gap-2">
                <span className={isHighStreak ? 'animate-pulse' : ''}>{streakData.currentStreak > 0 ? '🔥' : '✨'}</span>
                {streakData.currentStreak} 
                <span className="text-lg font-normal text-navy-400">day{streakData.currentStreak !== 1 ? 's' : ''}</span>
              </p>
            </div>
            
            <p className="text-sm text-center text-primary-400 mb-4 font-medium">
              {message}
            </p>
            
            <div className="grid grid-cols-2 gap-2 text-center">
              <div className="bg-navy-800/50 rounded-lg p-2">
                <p className="text-xs text-navy-400">Best Streak</p>
                <p className="text-lg font-semibold text-white">{streakData.longestStreak}🏆</p>
              </div>
              <div className="bg-navy-800/50 rounded-lg p-2">
                <p className="text-xs text-navy-400">Total Visits</p>
                <p className="text-lg font-semibold text-white">{streakData.totalVisits}📚</p>
              </div>
            </div>
            
            {streakData.currentStreak >= 7 && (
              <div className="mt-3 text-center">
                <span className="inline-block px-3 py-1 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-full text-xs text-yellow-400 font-medium">
                  ⭐ Super Learner Status!
                </span>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  )
}