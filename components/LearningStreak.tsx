'use client'

import { useState, useEffect } from 'react'

interface StreakData {
  currentStreak: number
  longestStreak: number
  totalMinutesLearned: number
  coursesStarted: number
  lessonsCompleted: number
  lastActiveDate: string | null
}

const ACHIEVEMENTS = [
  { id: 'first-visit', name: 'First Steps', description: 'Visit LearnHub for the first time', icon: '🎯', requirement: 1, type: 'visits' },
  { id: 'streak-3', name: 'Getting Warm', description: 'Maintain a 3-day learning streak', icon: '🔥', requirement: 3, type: 'streak' },
  { id: 'streak-7', name: 'On Fire!', description: 'Maintain a 7-day learning streak', icon: '⚡', requirement: 7, type: 'streak' },
  { id: 'streak-30', name: 'Unstoppable', description: 'Maintain a 30-day learning streak', icon: '🏆', requirement: 30, type: 'streak' },
  { id: 'explorer', name: 'Explorer', description: 'Browse 5 different courses', icon: '🧭', requirement: 5, type: 'coursesViewed' },
  { id: 'dedicated', name: 'Dedicated Learner', description: 'Spend 60+ minutes learning', icon: '📚', requirement: 60, type: 'minutes' },
]

export default function LearningStreak() {
  const [streakData, setStreakData] = useState<StreakData>({
    currentStreak: 0,
    longestStreak: 0,
    totalMinutesLearned: 0,
    coursesStarted: 0,
    lessonsCompleted: 0,
    lastActiveDate: null,
  })
  const [showAchievement, setShowAchievement] = useState<string | null>(null)
  const [unlockedAchievements, setUnlockedAchievements] = useState<string[]>([])
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    // Load data from localStorage
    const savedData = localStorage.getItem('learnhub-progress')
    const savedAchievements = localStorage.getItem('learnhub-achievements')
    
    let data: StreakData = savedData ? JSON.parse(savedData) : {
      currentStreak: 0,
      longestStreak: 0,
      totalMinutesLearned: 0,
      coursesStarted: 0,
      lessonsCompleted: 0,
      lastActiveDate: null,
    }

    const achievements: string[] = savedAchievements ? JSON.parse(savedAchievements) : []
    
    // Check if user visited today
    const today = new Date().toDateString()
    const lastActive = data.lastActiveDate
    
    if (lastActive !== today) {
      const yesterday = new Date()
      yesterday.setDate(yesterday.getDate() - 1)
      
      if (lastActive === yesterday.toDateString()) {
        // Continued streak
        data.currentStreak += 1
        if (data.currentStreak > data.longestStreak) {
          data.longestStreak = data.currentStreak
        }
        setIsAnimating(true)
        setTimeout(() => setIsAnimating(false), 1000)
      } else if (lastActive !== null) {
        // Streak broken
        data.currentStreak = 1
      } else {
        // First visit
        data.currentStreak = 1
      }
      
      data.lastActiveDate = today
      data.totalMinutesLearned += Math.floor(Math.random() * 15) + 5 // Simulate learning time
      
      localStorage.setItem('learnhub-progress', JSON.stringify(data))
    }

    setStreakData(data)
    setUnlockedAchievements(achievements)

    // Check for new achievements
    const newAchievements: string[] = []
    
    ACHIEVEMENTS.forEach(achievement => {
      if (achievements.includes(achievement.id)) return
      
      let unlocked = false
      
      switch (achievement.type) {
        case 'visits':
          unlocked = true // First visit achievement
          break
        case 'streak':
          unlocked = data.currentStreak >= achievement.requirement
          break
        case 'minutes':
          unlocked = data.totalMinutesLearned >= achievement.requirement
          break
        case 'coursesViewed':
          unlocked = data.coursesStarted >= achievement.requirement
          break
      }
      
      if (unlocked) {
        newAchievements.push(achievement.id)
      }
    })

    if (newAchievements.length > 0) {
      const allAchievements = [...achievements, ...newAchievements]
      localStorage.setItem('learnhub-achievements', JSON.stringify(allAchievements))
      setUnlockedAchievements(allAchievements)
      
      // Show achievement notification
      setTimeout(() => {
        setShowAchievement(newAchievements[0] ?? null)
        setTimeout(() => setShowAchievement(null), 4000)
      }, 1000)
    }
  }, [])

  const getFlameIntensity = () => {
    if (streakData.currentStreak >= 30) return 'text-orange-400 animate-pulse'
    if (streakData.currentStreak >= 7) return 'text-orange-500'
    if (streakData.currentStreak >= 3) return 'text-yellow-500'
    return 'text-navy-400'
  }

  const currentAchievement = ACHIEVEMENTS.find(a => a.id === showAchievement)

  return (
    <div className="relative">
      {/* Achievement Popup */}
      {showAchievement && currentAchievement && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-50 animate-bounce">
          <div className="bg-gradient-to-r from-primary-600 to-primary-500 text-white px-6 py-4 rounded-2xl shadow-2xl shadow-primary-500/40 flex items-center gap-4">
            <span className="text-4xl">{currentAchievement.icon}</span>
            <div>
              <div className="text-sm opacity-90">Achievement Unlocked!</div>
              <div className="font-bold text-lg">{currentAchievement.name}</div>
            </div>
          </div>
        </div>
      )}

      <div className="card p-6 bg-gradient-to-br from-navy-900/80 to-navy-900/40">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            <span className="text-2xl">📊</span>
            Your Learning Journey
          </h3>
          <div className={`flex items-center gap-2 px-4 py-2 rounded-full bg-navy-800/50 ${isAnimating ? 'animate-pulse ring-2 ring-orange-500' : ''}`}>
            <span className={`text-2xl ${getFlameIntensity()}`}>🔥</span>
            <span className="font-bold text-white">{streakData.currentStreak}</span>
            <span className="text-navy-400 text-sm">day streak</span>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-navy-800/30 rounded-xl p-4 text-center">
            <div className="text-3xl font-bold text-white mb-1">{streakData.currentStreak}</div>
            <div className="text-navy-400 text-sm">Current Streak</div>
          </div>
          <div className="bg-navy-800/30 rounded-xl p-4 text-center">
            <div className="text-3xl font-bold text-primary-400 mb-1">{streakData.longestStreak}</div>
            <div className="text-navy-400 text-sm">Best Streak</div>
          </div>
          <div className="bg-navy-800/30 rounded-xl p-4 text-center">
            <div className="text-3xl font-bold text-white mb-1">{streakData.totalMinutesLearned}</div>
            <div className="text-navy-400 text-sm">Minutes Learned</div>
          </div>
          <div className="bg-navy-800/30 rounded-xl p-4 text-center">
            <div className="text-3xl font-bold text-white mb-1">{unlockedAchievements.length}</div>
            <div className="text-navy-400 text-sm">Achievements</div>
          </div>
        </div>

        {/* Achievements Row */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-medium text-navy-300">Achievements</h4>
            <span className="text-xs text-navy-500">{unlockedAchievements.length}/{ACHIEVEMENTS.length} unlocked</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {ACHIEVEMENTS.map((achievement) => {
              const isUnlocked = unlockedAchievements.includes(achievement.id)
              return (
                <div
                  key={achievement.id}
                  className={`group relative w-10 h-10 rounded-xl flex items-center justify-center text-xl transition-all duration-300 ${
                    isUnlocked
                      ? 'bg-gradient-to-br from-primary-500/20 to-primary-600/20 border border-primary-500/30 cursor-default'
                      : 'bg-navy-800/30 border border-navy-700/50 grayscale opacity-50'
                  }`}
                  title={`${achievement.name}: ${achievement.description}`}
                >
                  <span className={isUnlocked ? '' : 'opacity-40'}>{achievement.icon}</span>
                  
                  {/* Tooltip */}
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-navy-800 rounded-lg text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 border border-navy-700">
                    <div className="font-semibold text-white">{achievement.name}</div>
                    <div className="text-navy-400">{achievement.description}</div>
                    {!isUnlocked && (
                      <div className="text-primary-400 mt-1">🔒 Locked</div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Motivational Message */}
        <div className="mt-6 pt-4 border-t border-navy-700/50">
          <p className="text-sm text-navy-300 text-center">
            {streakData.currentStreak === 0 && "Start your learning journey today! 🚀"}
            {streakData.currentStreak === 1 && "Great start! Come back tomorrow to build your streak! 💪"}
            {streakData.currentStreak >= 2 && streakData.currentStreak < 7 && `${7 - streakData.currentStreak} more days until your next achievement! Keep going! 🔥`}
            {streakData.currentStreak >= 7 && streakData.currentStreak < 30 && "You're on fire! Keep the momentum going! ⚡"}
            {streakData.currentStreak >= 30 && "Incredible dedication! You're a true champion! 🏆"}
          </p>
        </div>
      </div>
    </div>
  )
}