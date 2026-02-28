'use client'

import { useState, useEffect } from 'react'
import Confetti from './Confetti'

interface StreakData {
  currentStreak: number
  longestStreak: number
  lastVisitDate: string
  totalDaysLearned: number
  achievements: string[]
}

const ACHIEVEMENTS = {
  first_lesson: { emoji: '📖', title: 'First Steps', description: 'Viewed your first lesson' },
  three_day_streak: { emoji: '🔥', title: 'Getting Warm', description: '3 day learning streak' },
  week_streak: { emoji: '⚡', title: 'On Fire', description: '7 day learning streak' },
  two_week_streak: { emoji: '🌟', title: 'Committed Learner', description: '14 day learning streak' },
  month_streak: { emoji: '👑', title: 'Learning Master', description: '30 day learning streak' },
  ten_days: { emoji: '🎯', title: 'Dedicated', description: '10 total days of learning' },
  fifty_days: { emoji: '💎', title: 'Diamond Learner', description: '50 total days of learning' },
}

export default function LearningStreak() {
  const [streakData, setStreakData] = useState<StreakData | null>(null)
  const [showConfetti, setShowConfetti] = useState(false)
  const [newAchievement, setNewAchievement] = useState<string | null>(null)
  const [isHovered, setIsHovered] = useState(false)

  useEffect(() => {
    const savedData = localStorage.getItem('learnhub-streak')
    const today = new Date().toDateString()
    
    if (savedData) {
      const data: StreakData = JSON.parse(savedData)
      const lastVisit = new Date(data.lastVisitDate).toDateString()
      const yesterday = new Date(Date.now() - 86400000).toDateString()
      
      let updatedData = { ...data }
      
      if (lastVisit === today) {
        // Already visited today
        setStreakData(data)
        return
      } else if (lastVisit === yesterday) {
        // Continuing streak
        updatedData = {
          ...data,
          currentStreak: data.currentStreak + 1,
          longestStreak: Math.max(data.longestStreak, data.currentStreak + 1),
          lastVisitDate: today,
          totalDaysLearned: data.totalDaysLearned + 1,
        }
        
        // Check for new achievements
        const newAchievements = [...data.achievements]
        if (updatedData.currentStreak >= 3 && !newAchievements.includes('three_day_streak')) {
          newAchievements.push('three_day_streak')
          setNewAchievement('three_day_streak')
          setShowConfetti(true)
        }
        if (updatedData.currentStreak >= 7 && !newAchievements.includes('week_streak')) {
          newAchievements.push('week_streak')
          setNewAchievement('week_streak')
          setShowConfetti(true)
        }
        if (updatedData.currentStreak >= 14 && !newAchievements.includes('two_week_streak')) {
          newAchievements.push('two_week_streak')
          setNewAchievement('two_week_streak')
          setShowConfetti(true)
        }
        if (updatedData.currentStreak >= 30 && !newAchievements.includes('month_streak')) {
          newAchievements.push('month_streak')
          setNewAchievement('month_streak')
          setShowConfetti(true)
        }
        if (updatedData.totalDaysLearned >= 10 && !newAchievements.includes('ten_days')) {
          newAchievements.push('ten_days')
        }
        if (updatedData.totalDaysLearned >= 50 && !newAchievements.includes('fifty_days')) {
          newAchievements.push('fifty_days')
          setNewAchievement('fifty_days')
          setShowConfetti(true)
        }
        
        updatedData.achievements = newAchievements
      } else {
        // Streak broken
        updatedData = {
          ...data,
          currentStreak: 1,
          lastVisitDate: today,
          totalDaysLearned: data.totalDaysLearned + 1,
        }
      }
      
      localStorage.setItem('learnhub-streak', JSON.stringify(updatedData))
      setStreakData(updatedData)
    } else {
      // First visit
      const newData: StreakData = {
        currentStreak: 1,
        longestStreak: 1,
        lastVisitDate: today,
        totalDaysLearned: 1,
        achievements: ['first_lesson'],
      }
      localStorage.setItem('learnhub-streak', JSON.stringify(newData))
      setStreakData(newData)
      setNewAchievement('first_lesson')
      setShowConfetti(true)
    }
  }, [])

  useEffect(() => {
    if (showConfetti) {
      const timer = setTimeout(() => setShowConfetti(false), 5000)
      return () => clearTimeout(timer)
    }
  }, [showConfetti])

  useEffect(() => {
    if (newAchievement) {
      const timer = setTimeout(() => setNewAchievement(null), 4000)
      return () => clearTimeout(timer)
    }
  }, [newAchievement])

  if (!streakData) return null

  const streakEmoji = streakData.currentStreak >= 30 ? '👑' : 
                      streakData.currentStreak >= 14 ? '🌟' : 
                      streakData.currentStreak >= 7 ? '⚡' : 
                      streakData.currentStreak >= 3 ? '🔥' : '✨'

  return (
    <>
      {showConfetti && <Confetti />}
      
      {/* New Achievement Toast */}
      {newAchievement && ACHIEVEMENTS[newAchievement as keyof typeof ACHIEVEMENTS] && (
        <div className="fixed top-4 right-4 z-50 animate-slide-in">
          <div className="bg-gradient-to-r from-primary-500 to-purple-500 text-white rounded-xl p-4 shadow-2xl flex items-center gap-3">
            <div className="text-3xl animate-bounce">
              {ACHIEVEMENTS[newAchievement as keyof typeof ACHIEVEMENTS].emoji}
            </div>
            <div>
              <div className="font-bold">Achievement Unlocked!</div>
              <div className="text-sm opacity-90">
                {ACHIEVEMENTS[newAchievement as keyof typeof ACHIEVEMENTS].title}
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Streak Badge */}
      <div 
        className="inline-flex items-center gap-3 bg-navy-900/80 backdrop-blur-sm border border-navy-700 rounded-full px-6 py-3 cursor-pointer transition-all duration-300 hover:border-primary-500/50 hover:shadow-lg hover:shadow-primary-500/10"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className={`text-2xl transition-transform duration-300 ${isHovered ? 'animate-wiggle' : ''}`}>
          {streakEmoji}
        </div>
        <div className="text-left">
          <div className="text-white font-bold text-lg leading-tight">
            {streakData.currentStreak} Day Streak
          </div>
          <div className="text-navy-400 text-xs">
            {streakData.totalDaysLearned} days total • Best: {streakData.longestStreak} days
          </div>
        </div>
        <div className="flex -space-x-1">
          {streakData.achievements.slice(0, 3).map((achievement, idx) => (
            <div 
              key={achievement} 
              className="w-6 h-6 bg-navy-800 rounded-full flex items-center justify-center text-xs border border-navy-600"
              style={{ zIndex: 3 - idx }}
            >
              {ACHIEVEMENTS[achievement as keyof typeof ACHIEVEMENTS]?.emoji || '🏆'}
            </div>
          ))}
          {streakData.achievements.length > 3 && (
            <div className="w-6 h-6 bg-navy-800 rounded-full flex items-center justify-center text-xs border border-navy-600 text-navy-400">
              +{streakData.achievements.length - 3}
            </div>
          )}
        </div>
      </div>
    </>
  )
}