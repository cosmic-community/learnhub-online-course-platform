'use client'

import { useState, useEffect } from 'react'

interface StreakData {
  currentStreak: number
  longestStreak: number
  lastVisit: string
  totalVisits: number
}

const motivationalQuotes = [
  { text: "The expert in anything was once a beginner.", author: "Helen Hayes" },
  { text: "Learning is not attained by chance, it must be sought for with ardor.", author: "Abigail Adams" },
  { text: "The beautiful thing about learning is that nobody can take it away from you.", author: "B.B. King" },
  { text: "Live as if you were to die tomorrow. Learn as if you were to live forever.", author: "Mahatma Gandhi" },
  { text: "Education is the passport to the future.", author: "Malcolm X" },
  { text: "The capacity to learn is a gift; the ability to learn is a skill; the willingness to learn is a choice.", author: "Brian Herbert" },
  { text: "An investment in knowledge pays the best interest.", author: "Benjamin Franklin" },
  { text: "The more that you read, the more things you will know.", author: "Dr. Seuss" },
]

const achievements = [
  { id: 'first_visit', name: 'First Steps', icon: '👋', description: 'Welcome to LearnHub!' },
  { id: 'streak_3', name: 'Getting Started', icon: '🔥', description: '3-day learning streak!' },
  { id: 'streak_7', name: 'Week Warrior', icon: '⚡', description: '7-day learning streak!' },
  { id: 'streak_30', name: 'Monthly Master', icon: '🏆', description: '30-day learning streak!' },
  { id: 'visits_10', name: 'Regular Learner', icon: '📚', description: '10 total visits!' },
  { id: 'visits_50', name: 'Dedicated Student', icon: '🎓', description: '50 total visits!' },
]

export default function LearningStreak() {
  const [streakData, setStreakData] = useState<StreakData | null>(null)
  const [dailyQuote, setDailyQuote] = useState(motivationalQuotes[0])
  const [showAchievement, setShowAchievement] = useState<typeof achievements[0] | null>(null)
  const [isVisible, setIsVisible] = useState(false)
  const [unlockedAchievements, setUnlockedAchievements] = useState<string[]>([])

  useEffect(() => {
    // Get daily quote based on day of year
    const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000)
    setDailyQuote(motivationalQuotes[dayOfYear % motivationalQuotes.length])

    // Load and update streak data
    const stored = localStorage.getItem('learnhub-streak')
    const storedAchievements = localStorage.getItem('learnhub-achievements')
    const today = new Date().toDateString()
    
    let data: StreakData
    let existingAchievements: string[] = storedAchievements ? JSON.parse(storedAchievements) : []

    if (stored) {
      data = JSON.parse(stored)
      const lastVisitDate = new Date(data.lastVisit).toDateString()
      const yesterday = new Date(Date.now() - 86400000).toDateString()

      if (lastVisitDate === today) {
        // Already visited today, keep current streak
      } else if (lastVisitDate === yesterday) {
        // Visited yesterday, increment streak
        data.currentStreak += 1
        data.totalVisits += 1
        if (data.currentStreak > data.longestStreak) {
          data.longestStreak = data.currentStreak
        }
      } else {
        // Streak broken, reset to 1
        data.currentStreak = 1
        data.totalVisits += 1
      }
      data.lastVisit = today
    } else {
      // First visit
      data = {
        currentStreak: 1,
        longestStreak: 1,
        lastVisit: today,
        totalVisits: 1,
      }
      existingAchievements = ['first_visit']
    }

    // Check for new achievements
    const newAchievements: string[] = []
    
    if (!existingAchievements.includes('first_visit')) {
      newAchievements.push('first_visit')
    }
    if (data.currentStreak >= 3 && !existingAchievements.includes('streak_3')) {
      newAchievements.push('streak_3')
    }
    if (data.currentStreak >= 7 && !existingAchievements.includes('streak_7')) {
      newAchievements.push('streak_7')
    }
    if (data.currentStreak >= 30 && !existingAchievements.includes('streak_30')) {
      newAchievements.push('streak_30')
    }
    if (data.totalVisits >= 10 && !existingAchievements.includes('visits_10')) {
      newAchievements.push('visits_10')
    }
    if (data.totalVisits >= 50 && !existingAchievements.includes('visits_50')) {
      newAchievements.push('visits_50')
    }

    const allAchievements = [...existingAchievements, ...newAchievements]
    
    // Save data
    localStorage.setItem('learnhub-streak', JSON.stringify(data))
    localStorage.setItem('learnhub-achievements', JSON.stringify(allAchievements))
    
    setStreakData(data)
    setUnlockedAchievements(allAchievements)

    // Show achievement notification if new
    if (newAchievements.length > 0) {
      const achievementToShow = achievements.find(a => a.id === newAchievements[0])
      if (achievementToShow) {
        setTimeout(() => {
          setShowAchievement(achievementToShow)
          setTimeout(() => setShowAchievement(null), 4000)
        }, 1500)
      }
    }

    // Animate in
    setTimeout(() => setIsVisible(true), 300)
  }, [])

  if (!streakData) return null

  return (
    <>
      {/* Achievement Notification */}
      {showAchievement && (
        <div className="fixed top-24 right-4 z-50 animate-slide-in-right">
          <div className="bg-gradient-to-r from-primary-500 to-primary-600 text-white px-6 py-4 rounded-2xl shadow-2xl shadow-primary-500/30 flex items-center gap-4">
            <div className="text-4xl animate-bounce-slow">{showAchievement.icon}</div>
            <div>
              <div className="text-sm font-medium opacity-90">Achievement Unlocked!</div>
              <div className="font-bold text-lg">{showAchievement.name}</div>
              <div className="text-sm opacity-80">{showAchievement.description}</div>
            </div>
          </div>
        </div>
      )}

      {/* Main Component */}
      <div 
        className={`transition-all duration-700 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}
      >
        <div className="card p-6 bg-gradient-to-br from-navy-900/80 to-navy-900/40">
          {/* Streak Display */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center text-3xl animate-pulse-slow">
                  🔥
                </div>
                {streakData.currentStreak >= 7 && (
                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-yellow-400 rounded-full flex items-center justify-center text-xs">
                    ⭐
                  </div>
                )}
              </div>
              <div>
                <div className="text-3xl font-bold text-white">
                  {streakData.currentStreak} day{streakData.currentStreak !== 1 ? 's' : ''}
                </div>
                <div className="text-navy-400 text-sm">Current learning streak</div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-navy-400 text-sm">Best streak</div>
              <div className="text-xl font-semibold text-white">{streakData.longestStreak} days</div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mb-6">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-navy-400">Progress to next milestone</span>
              <span className="text-primary-400 font-medium">
                {streakData.currentStreak < 7 
                  ? `${7 - streakData.currentStreak} days to Week Warrior`
                  : streakData.currentStreak < 30
                  ? `${30 - streakData.currentStreak} days to Monthly Master`
                  : 'You\'re a champion! 🏆'}
              </span>
            </div>
            <div className="h-2 bg-navy-800 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-primary-500 to-primary-400 rounded-full transition-all duration-1000 ease-out"
                style={{ 
                  width: `${Math.min(100, (streakData.currentStreak / (streakData.currentStreak < 7 ? 7 : 30)) * 100)}%` 
                }}
              />
            </div>
          </div>

          {/* Achievements */}
          <div className="mb-6">
            <div className="text-sm text-navy-400 mb-3">Your Achievements</div>
            <div className="flex flex-wrap gap-2">
              {achievements.map((achievement) => {
                const isUnlocked = unlockedAchievements.includes(achievement.id)
                return (
                  <div
                    key={achievement.id}
                    className={`group relative px-3 py-2 rounded-lg flex items-center gap-2 transition-all duration-300 ${
                      isUnlocked 
                        ? 'bg-navy-800 hover:bg-navy-700' 
                        : 'bg-navy-900 opacity-40'
                    }`}
                    title={achievement.description}
                  >
                    <span className={`text-xl ${!isUnlocked && 'grayscale'}`}>
                      {achievement.icon}
                    </span>
                    <span className={`text-sm font-medium ${isUnlocked ? 'text-white' : 'text-navy-500'}`}>
                      {achievement.name}
                    </span>
                    {isUnlocked && (
                      <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-navy-700 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                        {achievement.description}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>

          {/* Daily Quote */}
          <div className="border-t border-navy-800 pt-4">
            <div className="text-sm text-navy-400 mb-2">💡 Daily Inspiration</div>
            <blockquote className="text-navy-200 italic">
              "{dailyQuote.text}"
            </blockquote>
            <cite className="text-primary-400 text-sm not-italic">— {dailyQuote.author}</cite>
          </div>
        </div>
      </div>
    </>
  )
}