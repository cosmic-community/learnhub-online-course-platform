'use client'

import { useState, useEffect } from 'react'

interface StreakData {
  currentStreak: number
  longestStreak: number
  lastVisit: string
  totalDaysLearned: number
  achievements: string[]
}

const ACHIEVEMENTS = [
  { days: 1, emoji: '🌱', title: 'First Steps', description: 'Started your learning journey!' },
  { days: 3, emoji: '🔥', title: 'On Fire', description: '3 day streak!' },
  { days: 7, emoji: '⭐', title: 'Week Warrior', description: '7 day streak!' },
  { days: 14, emoji: '🏆', title: 'Dedicated Learner', description: '2 week streak!' },
  { days: 30, emoji: '💎', title: 'Monthly Master', description: '30 day streak!' },
  { days: 100, emoji: '🚀', title: 'Centurion', description: '100 day streak!' },
]

export default function LearningStreak() {
  const [streakData, setStreakData] = useState<StreakData | null>(null)
  const [showCelebration, setShowCelebration] = useState(false)
  const [newAchievement, setNewAchievement] = useState<typeof ACHIEVEMENTS[0] | null>(null)
  const [isExpanded, setIsExpanded] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem('learnhub-streak')
    const today = new Date().toDateString()
    
    if (stored) {
      const data: StreakData = JSON.parse(stored)
      const lastVisitDate = new Date(data.lastVisit).toDateString()
      const yesterday = new Date()
      yesterday.setDate(yesterday.getDate() - 1)
      const yesterdayString = yesterday.toDateString()
      
      if (lastVisitDate === today) {
        // Already visited today
        setStreakData(data)
      } else if (lastVisitDate === yesterdayString) {
        // Continuing streak
        const newStreak = data.currentStreak + 1
        const newData: StreakData = {
          ...data,
          currentStreak: newStreak,
          longestStreak: Math.max(data.longestStreak, newStreak),
          lastVisit: today,
          totalDaysLearned: data.totalDaysLearned + 1,
        }
        
        // Check for new achievements
        const unlockedAchievement = ACHIEVEMENTS.find(
          a => a.days === newStreak && !data.achievements.includes(a.title)
        )
        if (unlockedAchievement) {
          newData.achievements = [...data.achievements, unlockedAchievement.title]
          setNewAchievement(unlockedAchievement)
          setShowCelebration(true)
          setTimeout(() => {
            setShowCelebration(false)
            setNewAchievement(null)
          }, 4000)
        }
        
        localStorage.setItem('learnhub-streak', JSON.stringify(newData))
        setStreakData(newData)
      } else {
        // Streak broken, start new
        const newData: StreakData = {
          currentStreak: 1,
          longestStreak: data.longestStreak,
          lastVisit: today,
          totalDaysLearned: data.totalDaysLearned + 1,
          achievements: data.achievements,
        }
        localStorage.setItem('learnhub-streak', JSON.stringify(newData))
        setStreakData(newData)
      }
    } else {
      // First visit ever
      const newData: StreakData = {
        currentStreak: 1,
        longestStreak: 1,
        lastVisit: today,
        totalDaysLearned: 1,
        achievements: ['First Steps'],
      }
      localStorage.setItem('learnhub-streak', JSON.stringify(newData))
      setStreakData(newData)
      setNewAchievement(ACHIEVEMENTS[0])
      setShowCelebration(true)
      setTimeout(() => {
        setShowCelebration(false)
        setNewAchievement(null)
      }, 4000)
    }
  }, [])

  if (!streakData) return null

  const nextAchievement = ACHIEVEMENTS.find(a => a.days > streakData.currentStreak)
  const daysUntilNext = nextAchievement ? nextAchievement.days - streakData.currentStreak : 0

  return (
    <>
      {/* Celebration Overlay */}
      {showCelebration && newAchievement && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy-950/80 backdrop-blur-sm animate-fade-in">
          <div className="text-center animate-bounce-in">
            <div className="text-8xl mb-4 animate-pulse">{newAchievement.emoji}</div>
            <h2 className="text-3xl font-bold text-white mb-2">Achievement Unlocked!</h2>
            <p className="text-xl text-primary-400 font-semibold mb-1">{newAchievement.title}</p>
            <p className="text-navy-300">{newAchievement.description}</p>
            <div className="mt-6 flex justify-center gap-2">
              {[...Array(12)].map((_, i) => (
                <span
                  key={i}
                  className="animate-confetti"
                  style={{
                    animationDelay: `${i * 0.1}s`,
                    fontSize: '1.5rem',
                  }}
                >
                  {['🎉', '✨', '🌟', '💫', '🎊'][i % 5]}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Streak Widget */}
      <div className="fixed bottom-24 right-6 z-40">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="group relative bg-gradient-to-br from-primary-500 to-primary-600 p-4 rounded-full shadow-lg shadow-primary-500/30 hover:shadow-primary-500/50 transition-all duration-300 hover:scale-110"
        >
          <span className="text-2xl">🔥</span>
          <span className="absolute -top-1 -right-1 bg-white text-navy-950 text-xs font-bold px-2 py-0.5 rounded-full">
            {streakData.currentStreak}
          </span>
        </button>

        {isExpanded && (
          <div className="absolute bottom-16 right-0 w-72 bg-navy-900 border border-navy-700 rounded-2xl shadow-2xl overflow-hidden animate-slide-up">
            <div className="bg-gradient-to-br from-primary-500/20 to-navy-900 p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-white font-semibold">Your Learning Streak</h3>
                <button
                  onClick={() => setIsExpanded(false)}
                  className="text-navy-400 hover:text-white"
                >
                  ✕
                </button>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="text-5xl">🔥</div>
                <div>
                  <div className="text-4xl font-bold text-white">{streakData.currentStreak}</div>
                  <div className="text-navy-400 text-sm">day streak</div>
                </div>
              </div>
            </div>

            <div className="p-4 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-navy-800/50 rounded-lg p-3 text-center">
                  <div className="text-2xl font-bold text-white">{streakData.longestStreak}</div>
                  <div className="text-navy-400 text-xs">Best Streak</div>
                </div>
                <div className="bg-navy-800/50 rounded-lg p-3 text-center">
                  <div className="text-2xl font-bold text-white">{streakData.totalDaysLearned}</div>
                  <div className="text-navy-400 text-xs">Total Days</div>
                </div>
              </div>

              {nextAchievement && (
                <div className="bg-navy-800/50 rounded-lg p-3">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl opacity-50">{nextAchievement.emoji}</span>
                    <div className="flex-1">
                      <div className="text-sm text-navy-300">Next: {nextAchievement.title}</div>
                      <div className="h-2 bg-navy-700 rounded-full mt-1 overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-primary-500 to-primary-400 rounded-full transition-all duration-500"
                          style={{ 
                            width: `${(streakData.currentStreak / nextAchievement.days) * 100}%` 
                          }}
                        />
                      </div>
                      <div className="text-xs text-navy-500 mt-1">{daysUntilNext} days to go</div>
                    </div>
                  </div>
                </div>
              )}

              <div>
                <div className="text-sm text-navy-400 mb-2">Achievements</div>
                <div className="flex flex-wrap gap-2">
                  {ACHIEVEMENTS.map((achievement) => (
                    <div
                      key={achievement.title}
                      className={`text-xl transition-all ${
                        streakData.achievements.includes(achievement.title)
                          ? 'opacity-100 hover:scale-125 cursor-pointer'
                          : 'opacity-30 grayscale'
                      }`}
                      title={streakData.achievements.includes(achievement.title) 
                        ? `${achievement.title}: ${achievement.description}`
                        : `Locked: Reach ${achievement.days} day streak`
                      }
                    >
                      {achievement.emoji}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  )
}