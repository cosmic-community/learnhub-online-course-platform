'use client'

import { useState, useEffect } from 'react'
import ConfettiExplosion from './ConfettiExplosion'

interface LearningStatsProps {
  totalCourses: number
  totalLessons: number
  totalHours: number
  totalInstructors: number
}

interface UserProgress {
  completedLessons: number
  currentStreak: number
  totalXP: number
  level: number
  badges: string[]
  lastVisit: string
}

const LEVEL_THRESHOLDS = [0, 100, 250, 500, 1000, 2000, 4000, 8000, 16000, 32000]
const XP_PER_VISIT = 10
const XP_PER_STREAK_DAY = 25

function getLevel(xp: number): number {
  for (let i = LEVEL_THRESHOLDS.length - 1; i >= 0; i--) {
    if (xp >= LEVEL_THRESHOLDS[i]) return i + 1
  }
  return 1
}

function getXPToNextLevel(xp: number, level: number): { current: number; needed: number } {
  const currentThreshold = LEVEL_THRESHOLDS[level - 1] || 0
  const nextThreshold = LEVEL_THRESHOLDS[level] || LEVEL_THRESHOLDS[LEVEL_THRESHOLDS.length - 1]
  return {
    current: xp - currentThreshold,
    needed: nextThreshold - currentThreshold
  }
}

export default function LearningStats({ 
  totalCourses, 
  totalLessons, 
  totalHours,
  totalInstructors 
}: LearningStatsProps) {
  const [progress, setProgress] = useState<UserProgress | null>(null)
  const [showConfetti, setShowConfetti] = useState(false)
  const [newBadge, setNewBadge] = useState<string | null>(null)
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    // Load progress from localStorage
    const savedProgress = localStorage.getItem('learnhub-progress')
    const today = new Date().toDateString()
    
    if (savedProgress) {
      const parsed: UserProgress = JSON.parse(savedProgress)
      const lastVisitDate = new Date(parsed.lastVisit).toDateString()
      
      // Check if this is a new day visit
      if (lastVisitDate !== today) {
        const yesterday = new Date()
        yesterday.setDate(yesterday.getDate() - 1)
        const wasYesterday = lastVisitDate === yesterday.toDateString()
        
        // Update streak
        const newStreak = wasYesterday ? parsed.currentStreak + 1 : 1
        const bonusXP = XP_PER_VISIT + (newStreak > 1 ? XP_PER_STREAK_DAY * Math.min(newStreak, 7) : 0)
        const newXP = parsed.totalXP + bonusXP
        const newLevel = getLevel(newXP)
        
        // Check for new badges
        const newBadges = [...parsed.badges]
        if (newStreak >= 7 && !newBadges.includes('🔥')) {
          newBadges.push('🔥')
          setNewBadge('🔥 Week Warrior!')
          setShowConfetti(true)
        }
        if (newStreak >= 30 && !newBadges.includes('💎')) {
          newBadges.push('💎')
          setNewBadge('💎 Monthly Master!')
          setShowConfetti(true)
        }
        if (newLevel > parsed.level) {
          setNewBadge(`🎉 Level ${newLevel} Reached!`)
          setShowConfetti(true)
        }
        
        const updatedProgress: UserProgress = {
          ...parsed,
          currentStreak: newStreak,
          totalXP: newXP,
          level: newLevel,
          badges: newBadges,
          lastVisit: today
        }
        
        setProgress(updatedProgress)
        localStorage.setItem('learnhub-progress', JSON.stringify(updatedProgress))
        setIsAnimating(true)
        setTimeout(() => setIsAnimating(false), 1000)
      } else {
        setProgress(parsed)
      }
    } else {
      // First time visitor
      const initialProgress: UserProgress = {
        completedLessons: 0,
        currentStreak: 1,
        totalXP: XP_PER_VISIT,
        level: 1,
        badges: ['🌟'],
        lastVisit: today
      }
      setProgress(initialProgress)
      localStorage.setItem('learnhub-progress', JSON.stringify(initialProgress))
      setNewBadge('🌟 Welcome to LearnHub!')
      setShowConfetti(true)
    }
  }, [])

  if (!progress) {
    return (
      <div className="card p-6 animate-pulse">
        <div className="h-24 bg-navy-800 rounded-lg" />
      </div>
    )
  }

  const xpProgress = getXPToNextLevel(progress.totalXP, progress.level)
  const progressPercentage = (xpProgress.current / xpProgress.needed) * 100

  return (
    <>
      {showConfetti && (
        <ConfettiExplosion onComplete={() => setShowConfetti(false)} />
      )}
      
      {newBadge && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 animate-badge-popup">
          <div className="bg-gradient-to-r from-primary-500 to-primary-600 text-white px-6 py-3 rounded-full shadow-lg shadow-primary-500/30 flex items-center gap-2">
            <span className="text-2xl">{newBadge.split(' ')[0]}</span>
            <span className="font-semibold">{newBadge.split(' ').slice(1).join(' ')}</span>
          </div>
        </div>
      )}
      
      <div className="card p-6 bg-gradient-to-r from-navy-900/80 to-navy-900/50 border-primary-500/20">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
          {/* Level & XP */}
          <div className="flex items-center gap-4">
            <div className={`relative ${isAnimating ? 'animate-pulse-scale' : ''}`}>
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-3xl font-bold text-white shadow-lg shadow-primary-500/30">
                {progress.level}
              </div>
              <div className="absolute -bottom-1 -right-1 bg-navy-800 rounded-full px-2 py-0.5 text-xs font-medium text-primary-400 border border-primary-500/30">
                LVL
              </div>
            </div>
            <div>
              <div className="text-white font-semibold text-lg mb-1">
                {progress.totalXP.toLocaleString()} XP
              </div>
              <div className="w-32 h-2 bg-navy-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-primary-400 to-primary-500 rounded-full transition-all duration-1000 ease-out"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
              <div className="text-navy-400 text-xs mt-1">
                {xpProgress.needed - xpProgress.current} XP to Level {progress.level + 1}
              </div>
            </div>
          </div>

          {/* Streak */}
          <div className="flex items-center gap-3 px-6 py-3 bg-navy-800/50 rounded-xl">
            <div className={`text-4xl ${progress.currentStreak >= 7 ? 'animate-fire' : ''}`}>
              🔥
            </div>
            <div>
              <div className="text-2xl font-bold text-white">
                {progress.currentStreak}
              </div>
              <div className="text-navy-400 text-sm">Day Streak</div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="flex items-center gap-6">
            <div className="text-center">
              <div className="text-xl font-bold text-white">{totalCourses}</div>
              <div className="text-navy-400 text-xs">Courses</div>
            </div>
            <div className="w-px h-8 bg-navy-700" />
            <div className="text-center">
              <div className="text-xl font-bold text-white">{totalLessons}</div>
              <div className="text-navy-400 text-xs">Lessons</div>
            </div>
            <div className="w-px h-8 bg-navy-700" />
            <div className="text-center">
              <div className="text-xl font-bold text-white">{totalHours}h</div>
              <div className="text-navy-400 text-xs">Content</div>
            </div>
          </div>

          {/* Badges */}
          <div className="flex items-center gap-2">
            {progress.badges.map((badge, index) => (
              <div 
                key={index}
                className="w-10 h-10 rounded-full bg-navy-800 flex items-center justify-center text-xl hover:scale-110 transition-transform cursor-default"
                title={getBadgeTitle(badge)}
              >
                {badge}
              </div>
            ))}
            <div className="w-10 h-10 rounded-full bg-navy-800/50 border-2 border-dashed border-navy-700 flex items-center justify-center text-navy-600 hover:border-primary-500/30 transition-colors cursor-default">
              ?
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

function getBadgeTitle(badge: string): string {
  const titles: Record<string, string> = {
    '🌟': 'First Steps - Welcome to LearnHub!',
    '🔥': 'Week Warrior - 7 day streak!',
    '💎': 'Monthly Master - 30 day streak!',
    '🏆': 'Course Champion - Completed a course!',
    '📚': 'Bookworm - Completed 5 courses!',
    '🎓': 'Graduate - Completed 10 courses!',
  }
  return titles[badge] || 'Mystery Badge'
}