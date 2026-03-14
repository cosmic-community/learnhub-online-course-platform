'use client'

import { useState, useEffect } from 'react'

interface StreakData {
  currentStreak: number
  longestStreak: number
  totalDaysLearned: number
  lastVisitDate: string
  achievements: string[]
  coursesStarted: number
  lessonsCompleted: number
}

const ACHIEVEMENTS = {
  first_visit: { icon: '🌟', title: 'First Steps', description: 'Started your learning journey' },
  streak_3: { icon: '🔥', title: 'On Fire', description: '3-day learning streak' },
  streak_7: { icon: '⚡', title: 'Unstoppable', description: '7-day learning streak' },
  streak_14: { icon: '💪', title: 'Dedicated Learner', description: '14-day learning streak' },
  streak_30: { icon: '🏆', title: 'Learning Champion', description: '30-day learning streak' },
  explorer: { icon: '🧭', title: 'Explorer', description: 'Visited 5 different courses' },
  night_owl: { icon: '🦉', title: 'Night Owl', description: 'Learning after midnight' },
  early_bird: { icon: '🐦', title: 'Early Bird', description: 'Learning before 7 AM' },
  weekend_warrior: { icon: '⚔️', title: 'Weekend Warrior', description: 'Learning on weekends' },
}

const MOTIVATIONAL_MESSAGES = [
  "Every expert was once a beginner. Keep going! 🚀",
  "Your future self will thank you for learning today! 💡",
  "Small steps lead to big achievements. You're doing great! ⭐",
  "Knowledge is power. You're getting stronger! 💪",
  "Consistency beats intensity. Keep showing up! 🎯",
  "Today's learning is tomorrow's success! 🌟",
  "You're building skills that will last a lifetime! 🏗️",
]

function getTimeBasedGreeting(): string {
  const hour = new Date().getHours()
  if (hour < 6) return "Burning the midnight oil? 🌙"
  if (hour < 12) return "Good morning, early learner! ☀️"
  if (hour < 17) return "Productive afternoon! 🌤️"
  if (hour < 21) return "Evening study session! 🌆"
  return "Night owl mode activated! 🦉"
}

function getRandomMessage(): string {
  return MOTIVATIONAL_MESSAGES[Math.floor(Math.random() * MOTIVATIONAL_MESSAGES.length)]
}

export default function LearningStreakWidget() {
  const [streakData, setStreakData] = useState<StreakData | null>(null)
  const [isExpanded, setIsExpanded] = useState(false)
  const [newAchievement, setNewAchievement] = useState<string | null>(null)
  const [showConfetti, setShowConfetti] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem('learnhub-streak-data')
    const today = new Date().toDateString()
    
    let data: StreakData = stored ? JSON.parse(stored) : {
      currentStreak: 0,
      longestStreak: 0,
      totalDaysLearned: 0,
      lastVisitDate: '',
      achievements: [],
      coursesStarted: 0,
      lessonsCompleted: 0,
    }

    const lastVisit = data.lastVisitDate
    const yesterday = new Date(Date.now() - 86400000).toDateString()
    
    // Update streak logic
    if (lastVisit !== today) {
      if (lastVisit === yesterday) {
        // Continuing streak
        data.currentStreak += 1
      } else if (lastVisit === '') {
        // First visit ever
        data.currentStreak = 1
        if (!data.achievements.includes('first_visit')) {
          data.achievements.push('first_visit')
          setNewAchievement('first_visit')
          setShowConfetti(true)
        }
      } else {
        // Streak broken, but still a learning day
        data.currentStreak = 1
      }
      
      data.totalDaysLearned += 1
      data.lastVisitDate = today
      
      // Update longest streak
      if (data.currentStreak > data.longestStreak) {
        data.longestStreak = data.currentStreak
      }
      
      // Check for streak achievements
      const streakAchievements: [number, string][] = [
        [3, 'streak_3'],
        [7, 'streak_7'],
        [14, 'streak_14'],
        [30, 'streak_30'],
      ]
      
      for (const [days, achievement] of streakAchievements) {
        if (data.currentStreak >= days && !data.achievements.includes(achievement)) {
          data.achievements.push(achievement)
          setNewAchievement(achievement)
          setShowConfetti(true)
        }
      }
      
      // Check for time-based achievements
      const hour = new Date().getHours()
      if (hour >= 0 && hour < 5 && !data.achievements.includes('night_owl')) {
        data.achievements.push('night_owl')
        setNewAchievement('night_owl')
      }
      if (hour >= 5 && hour < 7 && !data.achievements.includes('early_bird')) {
        data.achievements.push('early_bird')
        setNewAchievement('early_bird')
      }
      
      // Check for weekend achievement
      const dayOfWeek = new Date().getDay()
      if ((dayOfWeek === 0 || dayOfWeek === 6) && !data.achievements.includes('weekend_warrior')) {
        data.achievements.push('weekend_warrior')
        setNewAchievement('weekend_warrior')
      }
      
      localStorage.setItem('learnhub-streak-data', JSON.stringify(data))
    }
    
    setStreakData(data)
    
    // Clear confetti after animation
    if (showConfetti) {
      setTimeout(() => setShowConfetti(false), 3000)
    }
  }, [showConfetti])

  // Clear new achievement notification after delay
  useEffect(() => {
    if (newAchievement) {
      const timer = setTimeout(() => setNewAchievement(null), 5000)
      return () => clearTimeout(timer)
    }
  }, [newAchievement])

  if (!streakData) return null

  const streakEmoji = streakData.currentStreak >= 7 ? '🔥' : streakData.currentStreak >= 3 ? '✨' : '💫'

  return (
    <>
      {/* Confetti Effect */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-confetti"
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                backgroundColor: ['#f97316', '#22c55e', '#3b82f6', '#eab308', '#ec4899'][Math.floor(Math.random() * 5)],
                width: '10px',
                height: '10px',
                borderRadius: Math.random() > 0.5 ? '50%' : '0',
              }}
            />
          ))}
        </div>
      )}

      {/* Achievement Toast */}
      {newAchievement && ACHIEVEMENTS[newAchievement as keyof typeof ACHIEVEMENTS] && (
        <div className="fixed top-4 right-4 z-50 animate-slide-in">
          <div className="bg-gradient-to-r from-primary-500 to-primary-600 rounded-2xl p-4 shadow-2xl shadow-primary-500/30 max-w-sm">
            <div className="flex items-center gap-3">
              <span className="text-4xl">{ACHIEVEMENTS[newAchievement as keyof typeof ACHIEVEMENTS].icon}</span>
              <div>
                <div className="text-white font-bold">Achievement Unlocked!</div>
                <div className="text-primary-100 font-semibold">
                  {ACHIEVEMENTS[newAchievement as keyof typeof ACHIEVEMENTS].title}
                </div>
                <div className="text-primary-200 text-sm">
                  {ACHIEVEMENTS[newAchievement as keyof typeof ACHIEVEMENTS].description}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Widget */}
      <div className="fixed bottom-24 right-5 z-40">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="relative bg-gradient-to-br from-navy-800 to-navy-900 rounded-full p-4 shadow-lg shadow-navy-950/50 border border-navy-700 hover:border-primary-500/50 transition-all duration-300 group"
        >
          <div className="flex items-center gap-2">
            <span className="text-2xl">{streakEmoji}</span>
            <span className="text-white font-bold text-lg">{streakData.currentStreak}</span>
          </div>
          {streakData.currentStreak > 0 && (
            <div className="absolute -top-1 -right-1 bg-primary-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold animate-pulse">
              {streakData.currentStreak}
            </div>
          )}
        </button>

        {/* Expanded Panel */}
        {isExpanded && (
          <div className="absolute bottom-16 right-0 w-80 bg-navy-900/95 backdrop-blur-xl rounded-2xl border border-navy-700 shadow-2xl shadow-navy-950/50 overflow-hidden animate-scale-in">
            {/* Header */}
            <div className="bg-gradient-to-r from-primary-500/20 to-primary-600/10 p-4 border-b border-navy-700">
              <div className="text-navy-300 text-sm">{getTimeBasedGreeting()}</div>
              <div className="text-white font-bold text-lg mt-1">{getRandomMessage()}</div>
            </div>

            {/* Stats Grid */}
            <div className="p-4 grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary-400">{streakData.currentStreak}</div>
                <div className="text-navy-400 text-xs">Current Streak</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-400">{streakData.longestStreak}</div>
                <div className="text-navy-400 text-xs">Best Streak</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-yellow-400">{streakData.totalDaysLearned}</div>
                <div className="text-navy-400 text-xs">Total Days</div>
              </div>
            </div>

            {/* Streak Progress Bar */}
            <div className="px-4 pb-4">
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="text-navy-400">Progress to next milestone</span>
                <span className="text-primary-400 font-medium">
                  {streakData.currentStreak < 3 ? `${streakData.currentStreak}/3 days` :
                   streakData.currentStreak < 7 ? `${streakData.currentStreak}/7 days` :
                   streakData.currentStreak < 14 ? `${streakData.currentStreak}/14 days` :
                   streakData.currentStreak < 30 ? `${streakData.currentStreak}/30 days` :
                   '🏆 Champion!'}
                </span>
              </div>
              <div className="h-2 bg-navy-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-primary-500 to-primary-400 rounded-full transition-all duration-500"
                  style={{ 
                    width: `${Math.min(100, (streakData.currentStreak / (
                      streakData.currentStreak < 3 ? 3 :
                      streakData.currentStreak < 7 ? 7 :
                      streakData.currentStreak < 14 ? 14 : 30
                    )) * 100)}%` 
                  }}
                />
              </div>
            </div>

            {/* Achievements */}
            <div className="border-t border-navy-700 p-4">
              <div className="text-white font-semibold mb-3 flex items-center gap-2">
                <span>🏆</span> Achievements ({streakData.achievements.length}/{Object.keys(ACHIEVEMENTS).length})
              </div>
              <div className="grid grid-cols-5 gap-2">
                {Object.entries(ACHIEVEMENTS).map(([key, achievement]) => {
                  const isUnlocked = streakData.achievements.includes(key)
                  return (
                    <div
                      key={key}
                      className={`relative group cursor-pointer ${isUnlocked ? '' : 'grayscale opacity-40'}`}
                      title={`${achievement.title}: ${achievement.description}`}
                    >
                      <div className={`text-2xl text-center p-2 rounded-lg ${isUnlocked ? 'bg-navy-800' : 'bg-navy-800/50'}`}>
                        {achievement.icon}
                      </div>
                      {/* Tooltip */}
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-navy-700 rounded text-xs text-white whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                        {achievement.title}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Footer CTA */}
            <div className="bg-navy-800/50 p-3 text-center">
              <div className="text-navy-400 text-xs">
                Keep learning to unlock more achievements! 🚀
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  )
}