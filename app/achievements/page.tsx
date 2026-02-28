'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface StreakData {
  currentStreak: number
  longestStreak: number
  lastVisitDate: string
  totalDaysLearned: number
  achievements: string[]
}

const ALL_ACHIEVEMENTS = {
  first_lesson: { 
    emoji: '📖', 
    title: 'First Steps', 
    description: 'Viewed your first lesson',
    requirement: 'Visit the platform for the first time'
  },
  three_day_streak: { 
    emoji: '🔥', 
    title: 'Getting Warm', 
    description: '3 day learning streak',
    requirement: 'Learn for 3 consecutive days'
  },
  week_streak: { 
    emoji: '⚡', 
    title: 'On Fire', 
    description: '7 day learning streak',
    requirement: 'Learn for 7 consecutive days'
  },
  two_week_streak: { 
    emoji: '🌟', 
    title: 'Committed Learner', 
    description: '14 day learning streak',
    requirement: 'Learn for 14 consecutive days'
  },
  month_streak: { 
    emoji: '👑', 
    title: 'Learning Master', 
    description: '30 day learning streak',
    requirement: 'Learn for 30 consecutive days'
  },
  ten_days: { 
    emoji: '🎯', 
    title: 'Dedicated', 
    description: '10 total days of learning',
    requirement: 'Learn for 10 days total'
  },
  fifty_days: { 
    emoji: '💎', 
    title: 'Diamond Learner', 
    description: '50 total days of learning',
    requirement: 'Learn for 50 days total'
  },
}

export default function AchievementsPage() {
  const [streakData, setStreakData] = useState<StreakData | null>(null)
  
  useEffect(() => {
    const savedData = localStorage.getItem('learnhub-streak')
    if (savedData) {
      setStreakData(JSON.parse(savedData))
    }
  }, [])

  const unlockedCount = streakData?.achievements.length || 0
  const totalCount = Object.keys(ALL_ACHIEVEMENTS).length
  const progressPercent = (unlockedCount / totalCount) * 100

  return (
    <div className="py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="text-6xl mb-4">🏆</div>
          <h1 className="text-4xl font-bold text-white mb-4">Achievements</h1>
          <p className="text-xl text-navy-300 mb-8">
            Track your progress and unlock rewards as you learn
          </p>
          
          {/* Progress Bar */}
          <div className="max-w-md mx-auto">
            <div className="flex justify-between text-sm text-navy-400 mb-2">
              <span>{unlockedCount} of {totalCount} unlocked</span>
              <span>{Math.round(progressPercent)}%</span>
            </div>
            <div className="h-3 bg-navy-800 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-primary-500 to-purple-500 transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        {streakData && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
            <div className="card p-4 text-center">
              <div className="text-3xl mb-1">🔥</div>
              <div className="text-2xl font-bold text-white">{streakData.currentStreak}</div>
              <div className="text-navy-400 text-sm">Current Streak</div>
            </div>
            <div className="card p-4 text-center">
              <div className="text-3xl mb-1">⭐</div>
              <div className="text-2xl font-bold text-white">{streakData.longestStreak}</div>
              <div className="text-navy-400 text-sm">Best Streak</div>
            </div>
            <div className="card p-4 text-center">
              <div className="text-3xl mb-1">📅</div>
              <div className="text-2xl font-bold text-white">{streakData.totalDaysLearned}</div>
              <div className="text-navy-400 text-sm">Total Days</div>
            </div>
            <div className="card p-4 text-center">
              <div className="text-3xl mb-1">🏅</div>
              <div className="text-2xl font-bold text-white">{unlockedCount}</div>
              <div className="text-navy-400 text-sm">Achievements</div>
            </div>
          </div>
        )}

        {/* Achievements Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.entries(ALL_ACHIEVEMENTS).map(([key, achievement]) => {
            const isUnlocked = streakData?.achievements.includes(key)
            return (
              <div 
                key={key}
                className={`card p-6 flex items-start gap-4 transition-all duration-300 ${
                  isUnlocked 
                    ? 'border-primary-500/30 bg-primary-500/5' 
                    : 'opacity-60 grayscale'
                }`}
              >
                <div className={`text-4xl ${isUnlocked ? '' : 'filter grayscale'}`}>
                  {achievement.emoji}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-lg font-semibold text-white">{achievement.title}</h3>
                    {isUnlocked && (
                      <span className="text-xs bg-primary-500/20 text-primary-400 px-2 py-0.5 rounded-full">
                        Unlocked
                      </span>
                    )}
                  </div>
                  <p className="text-navy-300 text-sm mb-2">{achievement.description}</p>
                  <p className="text-navy-500 text-xs">{achievement.requirement}</p>
                </div>
              </div>
            )
          })}
        </div>

        {/* CTA */}
        <div className="mt-12 text-center">
          <p className="text-navy-400 mb-4">Keep learning to unlock more achievements!</p>
          <Link href="/courses" className="btn-primary">
            Browse Courses
          </Link>
        </div>
      </div>
    </div>
  )
}