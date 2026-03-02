'use client'

import { useState, useEffect } from 'react'

interface StreakData {
  currentStreak: number
  longestStreak: number
  lastVisit: string
  totalVisits: number
  achievements: string[]
}

const ACHIEVEMENT_THRESHOLDS = [
  { days: 1, id: 'first_visit', title: '🎉 First Steps!', description: 'Welcome to your learning journey!' },
  { days: 3, id: 'getting_started', title: '🔥 Getting Warmed Up!', description: '3 day streak - you\'re building momentum!' },
  { days: 7, id: 'week_warrior', title: '⚡ Week Warrior!', description: '7 days strong - incredible dedication!' },
  { days: 14, id: 'two_week_titan', title: '🏆 Two Week Titan!', description: '14 days - you\'re unstoppable!' },
  { days: 30, id: 'monthly_master', title: '👑 Monthly Master!', description: '30 days - you\'re a learning legend!' },
]

export default function LearningStreak() {
  const [streakData, setStreakData] = useState<StreakData | null>(null)
  const [showWidget, setShowWidget] = useState(false)
  const [newAchievement, setNewAchievement] = useState<typeof ACHIEVEMENT_THRESHOLDS[0] | null>(null)
  const [showConfetti, setShowConfetti] = useState(false)

  useEffect(() => {
    const initStreak = () => {
      const stored = localStorage.getItem('learnhub-streak')
      const today = new Date().toDateString()
      
      let data: StreakData = stored ? JSON.parse(stored) : {
        currentStreak: 0,
        longestStreak: 0,
        lastVisit: '',
        totalVisits: 0,
        achievements: []
      }

      const lastVisitDate = data.lastVisit ? new Date(data.lastVisit).toDateString() : ''
      const yesterday = new Date(Date.now() - 86400000).toDateString()

      if (lastVisitDate !== today) {
        data.totalVisits += 1
        
        if (lastVisitDate === yesterday) {
          // Continuing streak
          data.currentStreak += 1
        } else if (lastVisitDate === '') {
          // First visit ever
          data.currentStreak = 1
        } else {
          // Streak broken
          data.currentStreak = 1
        }

        data.lastVisit = today
        data.longestStreak = Math.max(data.longestStreak, data.currentStreak)

        // Check for new achievements
        for (const achievement of ACHIEVEMENT_THRESHOLDS) {
          if (data.currentStreak >= achievement.days && !data.achievements.includes(achievement.id)) {
            data.achievements.push(achievement.id)
            setNewAchievement(achievement)
            setShowConfetti(true)
            setTimeout(() => setShowConfetti(false), 3000)
            setTimeout(() => setNewAchievement(null), 5000)
            break
          }
        }

        localStorage.setItem('learnhub-streak', JSON.stringify(data))
      }

      setStreakData(data)
      
      // Show widget after a delay
      setTimeout(() => setShowWidget(true), 500)
    }

    initStreak()
  }, [])

  if (!streakData || !showWidget) return null

  const streakEmoji = streakData.currentStreak >= 7 ? '🔥' : streakData.currentStreak >= 3 ? '⚡' : '✨'

  return (
    <>
      {/* Confetti Effect */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-[100] overflow-hidden">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-confetti"
              style={{
                left: `${Math.random() * 100}%`,
                top: '-10px',
                animationDelay: `${Math.random() * 0.5}s`,
                animationDuration: `${2 + Math.random() * 2}s`,
              }}
            >
              <span style={{ 
                fontSize: '20px',
                color: ['#ff6b6b', '#feca57', '#48dbfb', '#ff9ff3', '#54a0ff', '#5f27cd'][Math.floor(Math.random() * 6)]
              }}>
                {['🎉', '⭐', '🎊', '✨', '💫', '🌟'][Math.floor(Math.random() * 6)]}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Achievement Toast */}
      {newAchievement && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[90] animate-slideDown">
          <div className="bg-gradient-to-r from-primary-500 to-primary-600 text-white px-6 py-4 rounded-2xl shadow-2xl shadow-primary-500/30 flex items-center gap-4 min-w-[300px]">
            <span className="text-4xl">{newAchievement.title.split(' ')[0]}</span>
            <div>
              <div className="font-bold text-lg">{newAchievement.title}</div>
              <div className="text-primary-100 text-sm">{newAchievement.description}</div>
            </div>
          </div>
        </div>
      )}

      {/* Streak Widget */}
      <div className="fixed top-24 right-5 z-40 animate-fadeInRight">
        <div className="bg-navy-900/90 backdrop-blur-md border border-navy-700 rounded-2xl p-4 shadow-xl shadow-navy-950/50 min-w-[160px]">
          <div className="flex items-center gap-3 mb-3">
            <div className="text-3xl">{streakEmoji}</div>
            <div>
              <div className="text-2xl font-bold text-white">{streakData.currentStreak}</div>
              <div className="text-xs text-navy-400">day streak</div>
            </div>
          </div>
          
          <div className="space-y-2 pt-3 border-t border-navy-700">
            <div className="flex justify-between text-sm">
              <span className="text-navy-400">Best streak</span>
              <span className="text-white font-medium">{streakData.longestStreak} days</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-navy-400">Total visits</span>
              <span className="text-white font-medium">{streakData.totalVisits}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-navy-400">Achievements</span>
              <span className="text-primary-400 font-medium">{streakData.achievements.length}/{ACHIEVEMENT_THRESHOLDS.length}</span>
            </div>
          </div>

          {/* Achievement Progress */}
          <div className="mt-3 pt-3 border-t border-navy-700">
            <div className="flex gap-1">
              {ACHIEVEMENT_THRESHOLDS.map((achievement) => (
                <div
                  key={achievement.id}
                  className={`flex-1 h-2 rounded-full transition-all ${
                    streakData.achievements.includes(achievement.id)
                      ? 'bg-primary-500'
                      : 'bg-navy-700'
                  }`}
                  title={achievement.title}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}