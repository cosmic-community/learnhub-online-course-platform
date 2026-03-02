'use client'

import { useState, useEffect } from 'react'

interface StreakData {
  currentStreak: number
  longestStreak: number
  totalVisits: number
  lastVisit: string
  achievements: string[]
}

const ACHIEVEMENTS = [
  { id: 'first_visit', name: 'Welcome Aboard!', emoji: '👋', requirement: 1 },
  { id: 'streak_3', name: 'Getting Started', emoji: '🌱', requirement: 3 },
  { id: 'streak_7', name: 'Week Warrior', emoji: '⚡', requirement: 7 },
  { id: 'streak_14', name: 'Dedicated Learner', emoji: '📚', requirement: 14 },
  { id: 'streak_30', name: 'Monthly Master', emoji: '🏆', requirement: 30 },
  { id: 'visits_10', name: 'Regular Visitor', emoji: '🎯', requirement: 10 },
  { id: 'visits_50', name: 'Knowledge Seeker', emoji: '🔥', requirement: 50 },
  { id: 'visits_100', name: 'Learning Legend', emoji: '👑', requirement: 100 },
]

const DAILY_TIPS = [
  "💡 Consistency beats intensity. Even 15 minutes of daily learning compounds into expertise!",
  "🎯 Focus on understanding concepts deeply rather than rushing through content.",
  "📝 Take notes while learning - it increases retention by up to 34%!",
  "🔄 Review yesterday's lesson before starting a new one for better retention.",
  "☕ Take short breaks every 25-30 minutes to maintain focus and energy.",
  "🤝 Teaching others what you learn is one of the best ways to solidify knowledge.",
  "🎮 Treat your learning journey like a game - celebrate small wins!",
  "🌟 Your brain builds new neural pathways with each lesson. Keep growing!",
  "📊 Track your progress to stay motivated and see how far you've come.",
  "🚀 The best time to start learning was yesterday. The next best time is now!",
]

export default function LearningStreak() {
  const [streakData, setStreakData] = useState<StreakData | null>(null)
  const [showCelebration, setShowCelebration] = useState(false)
  const [newAchievement, setNewAchievement] = useState<typeof ACHIEVEMENTS[0] | null>(null)
  const [dailyTip, setDailyTip] = useState('')
  const [isExpanded, setIsExpanded] = useState(false)

  useEffect(() => {
    const today = new Date().toDateString()
    const tipIndex = new Date().getDate() % DAILY_TIPS.length
    setDailyTip(DAILY_TIPS[tipIndex] ?? DAILY_TIPS[0])

    // Load existing data
    const stored = localStorage.getItem('learnhub-streak')
    let data: StreakData = stored ? JSON.parse(stored) : {
      currentStreak: 0,
      longestStreak: 0,
      totalVisits: 0,
      lastVisit: '',
      achievements: [],
    }

    // Check if this is a new day
    const lastVisit = data.lastVisit ? new Date(data.lastVisit).toDateString() : null
    
    if (lastVisit !== today) {
      data.totalVisits += 1
      
      // Calculate streak
      if (lastVisit) {
        const lastDate = new Date(data.lastVisit)
        const todayDate = new Date()
        const diffTime = Math.abs(todayDate.getTime() - lastDate.getTime())
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
        
        if (diffDays === 1) {
          // Consecutive day - increase streak
          data.currentStreak += 1
        } else if (diffDays > 1) {
          // Streak broken
          data.currentStreak = 1
        }
      } else {
        // First visit
        data.currentStreak = 1
      }
      
      // Update longest streak
      if (data.currentStreak > data.longestStreak) {
        data.longestStreak = data.currentStreak
      }
      
      data.lastVisit = new Date().toISOString()
      
      // Check for new achievements
      const checkAchievements = () => {
        // Streak achievements
        ACHIEVEMENTS.forEach(achievement => {
          if (!data.achievements.includes(achievement.id)) {
            if (
              (achievement.id.startsWith('streak_') && data.currentStreak >= achievement.requirement) ||
              (achievement.id.startsWith('visits_') && data.totalVisits >= achievement.requirement) ||
              (achievement.id === 'first_visit' && data.totalVisits >= 1)
            ) {
              data.achievements.push(achievement.id)
              setNewAchievement(achievement)
              setShowCelebration(true)
            }
          }
        })
      }
      
      checkAchievements()
      
      // Save updated data
      localStorage.setItem('learnhub-streak', JSON.stringify(data))
    }
    
    setStreakData(data)
  }, [])

  const closeCelebration = () => {
    setShowCelebration(false)
    setNewAchievement(null)
  }

  if (!streakData) return null

  const earnedAchievements = ACHIEVEMENTS.filter(a => streakData.achievements.includes(a.id))

  return (
    <>
      {/* Celebration Modal */}
      {showCelebration && newAchievement && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/80 backdrop-blur-sm animate-fade-in">
          <div className="relative bg-navy-900 border border-navy-700 rounded-2xl p-8 max-w-md w-full text-center animate-bounce-in">
            {/* Confetti effect */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              {[...Array(20)].map((_, i) => (
                <div
                  key={i}
                  className="absolute animate-confetti"
                  style={{
                    left: `${Math.random() * 100}%`,
                    animationDelay: `${Math.random() * 0.5}s`,
                    backgroundColor: ['#29ABE2', '#FFD700', '#FF6B6B', '#4ECDC4', '#A855F7'][i % 5],
                    width: '10px',
                    height: '10px',
                    borderRadius: '2px',
                  }}
                />
              ))}
            </div>
            
            <div className="relative z-10">
              <div className="text-7xl mb-4 animate-wiggle">{newAchievement.emoji}</div>
              <h3 className="text-2xl font-bold text-white mb-2">Achievement Unlocked!</h3>
              <p className="text-xl text-primary-400 font-semibold mb-4">{newAchievement.name}</p>
              <p className="text-navy-300 mb-6">
                Keep up the amazing work! Your dedication to learning is inspiring.
              </p>
              <button
                onClick={closeCelebration}
                className="btn-primary"
              >
                Continue Learning 🚀
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Streak Widget */}
      <div className="card p-6 relative overflow-hidden">
        {/* Animated background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 via-transparent to-yellow-500/5 animate-gradient" />
        
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <span className="text-2xl">🔥</span>
              Your Learning Journey
            </h3>
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-navy-400 hover:text-white transition-colors text-sm"
            >
              {isExpanded ? 'Show Less' : 'Show More'}
            </button>
          </div>

          {/* Main Stats */}
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary-400 animate-pulse-slow">
                {streakData.currentStreak}
              </div>
              <div className="text-xs text-navy-400">Day Streak</div>
            </div>
            <div className="text-center border-x border-navy-700">
              <div className="text-3xl font-bold text-yellow-400">
                {streakData.longestStreak}
              </div>
              <div className="text-xs text-navy-400">Best Streak</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-400">
                {streakData.totalVisits}
              </div>
              <div className="text-xs text-navy-400">Total Visits</div>
            </div>
          </div>

          {/* Streak Progress Bar */}
          <div className="mb-4">
            <div className="flex justify-between text-xs text-navy-400 mb-1">
              <span>Progress to next milestone</span>
              <span>{streakData.currentStreak}/7 days</span>
            </div>
            <div className="h-2 bg-navy-800 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-primary-500 to-primary-400 rounded-full transition-all duration-500 animate-shimmer"
                style={{ width: `${Math.min((streakData.currentStreak / 7) * 100, 100)}%` }}
              />
            </div>
          </div>

          {/* Daily Tip */}
          <div className="bg-navy-800/50 rounded-lg p-3 mb-4">
            <p className="text-sm text-navy-200">{dailyTip}</p>
          </div>

          {/* Expanded Content */}
          {isExpanded && (
            <div className="animate-slide-down">
              <div className="border-t border-navy-700 pt-4 mt-2">
                <h4 className="text-sm font-medium text-white mb-3">Your Achievements</h4>
                <div className="grid grid-cols-4 gap-2">
                  {ACHIEVEMENTS.map(achievement => {
                    const earned = streakData.achievements.includes(achievement.id)
                    return (
                      <div
                        key={achievement.id}
                        className={`text-center p-2 rounded-lg transition-all ${
                          earned 
                            ? 'bg-primary-500/10 border border-primary-500/30' 
                            : 'bg-navy-800/50 opacity-40'
                        }`}
                        title={earned ? achievement.name : `Locked: ${achievement.name}`}
                      >
                        <div className={`text-2xl ${earned ? '' : 'grayscale'}`}>
                          {achievement.emoji}
                        </div>
                        <div className="text-[10px] text-navy-300 mt-1 truncate">
                          {earned ? achievement.name : '???'}
                        </div>
                      </div>
                    )
                  })}
                </div>
                <p className="text-xs text-navy-500 mt-3 text-center">
                  {earnedAchievements.length}/{ACHIEVEMENTS.length} achievements unlocked
                </p>
              </div>
            </div>
          )}

          {/* Motivational Message */}
          <div className="text-center mt-2">
            {streakData.currentStreak >= 7 ? (
              <span className="text-xs text-yellow-400">🌟 You&apos;re on fire! Amazing dedication!</span>
            ) : streakData.currentStreak >= 3 ? (
              <span className="text-xs text-green-400">💪 Great momentum! Keep it up!</span>
            ) : (
              <span className="text-xs text-navy-400">🚀 Start building your streak today!</span>
            )}
          </div>
        </div>
      </div>
    </>
  )
}