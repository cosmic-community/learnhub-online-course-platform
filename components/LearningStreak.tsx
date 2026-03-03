'use client'

import { useState, useEffect } from 'react'

interface StreakData {
  currentStreak: number
  longestStreak: number
  lastVisit: string
  totalVisits: number
  coursesViewed: number
  lessonsCompleted: number
  achievements: string[]
}

const ACHIEVEMENTS = {
  first_visit: { icon: '🌟', title: 'First Steps', description: 'Welcome to LearnHub!' },
  streak_3: { icon: '🔥', title: 'On Fire', description: '3-day learning streak!' },
  streak_7: { icon: '💪', title: 'Dedicated Learner', description: '7-day learning streak!' },
  streak_30: { icon: '🏆', title: 'Learning Champion', description: '30-day learning streak!' },
  explorer: { icon: '🧭', title: 'Explorer', description: 'Visited 5 courses' },
  bookworm: { icon: '📚', title: 'Bookworm', description: 'Completed 10 lessons' },
}

export default function LearningStreak() {
  const [streakData, setStreakData] = useState<StreakData | null>(null)
  const [showConfetti, setShowConfetti] = useState(false)
  const [newAchievement, setNewAchievement] = useState<string | null>(null)
  const [isExpanded, setIsExpanded] = useState(false)

  useEffect(() => {
    const today = new Date().toDateString()
    const stored = localStorage.getItem('learnhub-streak')
    
    let data: StreakData = stored ? JSON.parse(stored) : {
      currentStreak: 0,
      longestStreak: 0,
      lastVisit: '',
      totalVisits: 0,
      coursesViewed: 0,
      lessonsCompleted: 0,
      achievements: [],
    }

    const lastVisitDate = data.lastVisit ? new Date(data.lastVisit).toDateString() : ''
    const yesterday = new Date(Date.now() - 86400000).toDateString()

    if (lastVisitDate !== today) {
      data.totalVisits += 1
      
      if (lastVisitDate === yesterday) {
        data.currentStreak += 1
      } else if (lastVisitDate !== today) {
        data.currentStreak = 1
      }
      
      data.longestStreak = Math.max(data.longestStreak, data.currentStreak)
      data.lastVisit = today

      // Check for new achievements
      const newAchievements: string[] = []
      
      if (!data.achievements.includes('first_visit')) {
        data.achievements.push('first_visit')
        newAchievements.push('first_visit')
      }
      
      if (data.currentStreak >= 3 && !data.achievements.includes('streak_3')) {
        data.achievements.push('streak_3')
        newAchievements.push('streak_3')
      }
      
      if (data.currentStreak >= 7 && !data.achievements.includes('streak_7')) {
        data.achievements.push('streak_7')
        newAchievements.push('streak_7')
      }
      
      if (data.currentStreak >= 30 && !data.achievements.includes('streak_30')) {
        data.achievements.push('streak_30')
        newAchievements.push('streak_30')
      }

      if (newAchievements.length > 0) {
        setShowConfetti(true)
        setNewAchievement(newAchievements[newAchievements.length - 1])
        setTimeout(() => {
          setShowConfetti(false)
          setNewAchievement(null)
        }, 4000)
      }

      localStorage.setItem('learnhub-streak', JSON.stringify(data))
    }

    setStreakData(data)
  }, [])

  if (!streakData) return null

  return (
    <>
      {/* Confetti Animation */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-confetti"
              style={{
                left: `${Math.random() * 100}%`,
                top: '-10px',
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${2 + Math.random() * 2}s`,
              }}
            >
              <span className="text-2xl">
                {['🎉', '✨', '🌟', '💫', '🎊', '⭐'][Math.floor(Math.random() * 6)]}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Achievement Popup */}
      {newAchievement && ACHIEVEMENTS[newAchievement as keyof typeof ACHIEVEMENTS] && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 animate-bounce-in">
          <div className="bg-gradient-to-r from-primary-500 to-primary-600 text-white px-8 py-4 rounded-2xl shadow-2xl flex items-center gap-4">
            <span className="text-4xl">{ACHIEVEMENTS[newAchievement as keyof typeof ACHIEVEMENTS].icon}</span>
            <div>
              <div className="font-bold text-lg">Achievement Unlocked!</div>
              <div className="text-primary-100">{ACHIEVEMENTS[newAchievement as keyof typeof ACHIEVEMENTS].title}</div>
            </div>
          </div>
        </div>
      )}

      {/* Streak Widget */}
      <div className="fixed bottom-24 right-5 z-40">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="relative group"
        >
          <div className={`
            bg-gradient-to-br from-orange-500 to-red-500 
            text-white rounded-full w-16 h-16 
            flex items-center justify-center
            shadow-lg shadow-orange-500/30
            hover:shadow-orange-500/50 
            transition-all duration-300
            hover:scale-110
            ${streakData.currentStreak > 0 ? 'animate-pulse-slow' : ''}
          `}>
            <div className="text-center">
              <div className="text-2xl">🔥</div>
              <div className="text-xs font-bold -mt-1">{streakData.currentStreak}</div>
            </div>
          </div>
          
          {/* Streak ring */}
          {streakData.currentStreak > 0 && (
            <div className="absolute inset-0 rounded-full border-2 border-orange-400 animate-ping opacity-30" />
          )}
        </button>

        {/* Expanded Panel */}
        {isExpanded && (
          <div className="absolute bottom-20 right-0 w-72 bg-navy-900 border border-navy-700 rounded-2xl shadow-2xl overflow-hidden animate-slide-up">
            <div className="bg-gradient-to-r from-orange-500 to-red-500 p-4 text-white">
              <div className="flex items-center gap-3">
                <span className="text-4xl">🔥</span>
                <div>
                  <div className="text-3xl font-bold">{streakData.currentStreak} day{streakData.currentStreak !== 1 ? 's' : ''}</div>
                  <div className="text-orange-100 text-sm">Current Streak</div>
                </div>
              </div>
            </div>
            
            <div className="p-4 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-navy-800 rounded-lg p-3 text-center">
                  <div className="text-2xl font-bold text-white">{streakData.longestStreak}</div>
                  <div className="text-xs text-navy-400">Best Streak</div>
                </div>
                <div className="bg-navy-800 rounded-lg p-3 text-center">
                  <div className="text-2xl font-bold text-white">{streakData.totalVisits}</div>
                  <div className="text-xs text-navy-400">Total Visits</div>
                </div>
              </div>
              
              {/* Achievements */}
              <div>
                <div className="text-sm font-medium text-navy-300 mb-2">Achievements</div>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(ACHIEVEMENTS).map(([key, achievement]) => (
                    <div
                      key={key}
                      className={`
                        w-10 h-10 rounded-lg flex items-center justify-center text-xl
                        transition-all duration-300
                        ${streakData.achievements.includes(key) 
                          ? 'bg-primary-500/20 scale-100' 
                          : 'bg-navy-800 grayscale opacity-30'
                        }
                      `}
                      title={streakData.achievements.includes(key) ? achievement.title : '???'}
                    >
                      {achievement.icon}
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="text-center pt-2 border-t border-navy-700">
                <p className="text-xs text-navy-400">
                  Keep learning to unlock more achievements! 🚀
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  )
}