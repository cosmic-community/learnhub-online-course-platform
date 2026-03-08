'use client'

import { useState, useEffect } from 'react'

interface Achievement {
  id: string
  title: string
  description: string
  icon: string
  unlocked: boolean
  unlockedAt?: string
}

interface LearningStats {
  streak: number
  totalLessons: number
  totalMinutes: number
  coursesStarted: number
  coursesCompleted: number
  lastActiveDate: string
}

const DEFAULT_STATS: LearningStats = {
  streak: 0,
  totalLessons: 0,
  totalMinutes: 0,
  coursesStarted: 0,
  coursesCompleted: 0,
  lastActiveDate: ''
}

const ACHIEVEMENTS: Achievement[] = [
  { id: 'first-lesson', title: 'First Steps', description: 'Complete your first lesson', icon: '🎯', unlocked: false },
  { id: 'streak-3', title: 'Getting Warmed Up', description: 'Maintain a 3-day streak', icon: '🔥', unlocked: false },
  { id: 'streak-7', title: 'Week Warrior', description: 'Maintain a 7-day streak', icon: '⚡', unlocked: false },
  { id: 'streak-30', title: 'Dedicated Learner', description: 'Maintain a 30-day streak', icon: '🏆', unlocked: false },
  { id: 'lessons-10', title: 'Knowledge Seeker', description: 'Complete 10 lessons', icon: '📚', unlocked: false },
  { id: 'lessons-50', title: 'Scholar', description: 'Complete 50 lessons', icon: '🎓', unlocked: false },
  { id: 'course-complete', title: 'Course Champion', description: 'Complete your first course', icon: '🌟', unlocked: false },
  { id: 'early-bird', title: 'Early Bird', description: 'Learn before 8 AM', icon: '🌅', unlocked: false },
  { id: 'night-owl', title: 'Night Owl', description: 'Learn after 10 PM', icon: '🦉', unlocked: false },
]

const DAILY_TIPS = [
  { tip: "Consistency beats intensity. Even 15 minutes daily compounds over time.", author: "James Clear" },
  { tip: "The expert in anything was once a beginner.", author: "Helen Hayes" },
  { tip: "Learning is not attained by chance, it must be sought with ardor.", author: "Abigail Adams" },
  { tip: "The beautiful thing about learning is nobody can take it away from you.", author: "B.B. King" },
  { tip: "Education is the passport to the future, for tomorrow belongs to those who prepare today.", author: "Malcolm X" },
  { tip: "Live as if you were to die tomorrow. Learn as if you were to live forever.", author: "Mahatma Gandhi" },
  { tip: "The capacity to learn is a gift; the ability to learn is a skill; the willingness to learn is a choice.", author: "Brian Herbert" },
]

function ProgressRing({ progress, size = 120, strokeWidth = 8 }: { progress: number; size?: number; strokeWidth?: number }) {
  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const offset = circumference - (progress / 100) * circumference

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg className="transform -rotate-90" width={size} height={size}>
        {/* Background circle */}
        <circle
          className="text-navy-800"
          strokeWidth={strokeWidth}
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
        {/* Progress circle */}
        <circle
          className="text-primary-500 transition-all duration-1000 ease-out"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
          style={{
            filter: 'drop-shadow(0 0 6px rgba(99, 102, 241, 0.5))'
          }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center">
          <span className="text-2xl font-bold text-white">{Math.round(progress)}%</span>
          <span className="block text-xs text-navy-400">Progress</span>
        </div>
      </div>
    </div>
  )
}

function StreakFire({ streak }: { streak: number }) {
  const flames = streak >= 7 ? 3 : streak >= 3 ? 2 : 1
  
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: flames }).map((_, i) => (
        <span 
          key={i} 
          className="text-2xl animate-pulse"
          style={{ 
            animationDelay: `${i * 0.2}s`,
            filter: 'drop-shadow(0 0 8px rgba(251, 146, 60, 0.6))'
          }}
        >
          🔥
        </span>
      ))}
    </div>
  )
}

function AchievementBadge({ achievement, showTooltip = true }: { achievement: Achievement; showTooltip?: boolean }) {
  const [isHovered, setIsHovered] = useState(false)
  
  return (
    <div 
      className="relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div 
        className={`w-12 h-12 rounded-full flex items-center justify-center text-xl transition-all duration-300 ${
          achievement.unlocked 
            ? 'bg-gradient-to-br from-primary-500 to-primary-700 shadow-lg shadow-primary-500/30 scale-100' 
            : 'bg-navy-800 opacity-40 grayscale scale-90'
        }`}
      >
        {achievement.icon}
      </div>
      
      {/* Tooltip */}
      {showTooltip && isHovered && (
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 z-50">
          <div className="bg-navy-800 border border-navy-700 rounded-lg p-3 shadow-xl min-w-[160px]">
            <div className="text-sm font-semibold text-white">{achievement.title}</div>
            <div className="text-xs text-navy-400 mt-1">{achievement.description}</div>
            {achievement.unlocked && achievement.unlockedAt && (
              <div className="text-xs text-primary-400 mt-2">
                ✓ Unlocked {new Date(achievement.unlockedAt).toLocaleDateString()}
              </div>
            )}
          </div>
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-navy-800" />
        </div>
      )}
    </div>
  )
}

export default function LearningProgress() {
  const [stats, setStats] = useState<LearningStats>(DEFAULT_STATS)
  const [achievements, setAchievements] = useState<Achievement[]>(ACHIEVEMENTS)
  const [dailyTip, setDailyTip] = useState(DAILY_TIPS[0])
  const [isExpanded, setIsExpanded] = useState(false)
  const [showCelebration, setShowCelebration] = useState(false)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Load stats from localStorage
    const savedStats = localStorage.getItem('learnhub-stats')
    const savedAchievements = localStorage.getItem('learnhub-achievements')
    
    if (savedStats) {
      const parsed = JSON.parse(savedStats) as LearningStats
      setStats(parsed)
      
      // Check if it's a new day and update streak
      const today = new Date().toDateString()
      const lastActive = new Date(parsed.lastActiveDate).toDateString()
      const yesterday = new Date(Date.now() - 86400000).toDateString()
      
      if (lastActive !== today) {
        const newStreak = lastActive === yesterday ? parsed.streak + 1 : 1
        const updatedStats = { ...parsed, streak: newStreak, lastActiveDate: new Date().toISOString() }
        setStats(updatedStats)
        localStorage.setItem('learnhub-stats', JSON.stringify(updatedStats))
        
        // Check for streak achievements
        if (newStreak === 3 || newStreak === 7 || newStreak === 30) {
          setShowCelebration(true)
          setTimeout(() => setShowCelebration(false), 3000)
        }
      }
    } else {
      // Initialize with demo data for first-time visitors
      const demoStats: LearningStats = {
        streak: 5,
        totalLessons: 12,
        totalMinutes: 180,
        coursesStarted: 3,
        coursesCompleted: 1,
        lastActiveDate: new Date().toISOString()
      }
      setStats(demoStats)
      localStorage.setItem('learnhub-stats', JSON.stringify(demoStats))
    }
    
    if (savedAchievements) {
      setAchievements(JSON.parse(savedAchievements))
    } else {
      // Unlock some demo achievements
      const demoAchievements = ACHIEVEMENTS.map(a => ({
        ...a,
        unlocked: ['first-lesson', 'streak-3', 'lessons-10'].includes(a.id),
        unlockedAt: ['first-lesson', 'streak-3', 'lessons-10'].includes(a.id) 
          ? new Date(Date.now() - Math.random() * 7 * 86400000).toISOString() 
          : undefined
      }))
      setAchievements(demoAchievements)
      localStorage.setItem('learnhub-achievements', JSON.stringify(demoAchievements))
    }

    // Set daily tip based on day
    const dayIndex = new Date().getDay()
    setDailyTip(DAILY_TIPS[dayIndex % DAILY_TIPS.length])

    // Check dismissed state
    const isDismissed = localStorage.getItem('learnhub-progress-dismissed')
    if (!isDismissed) {
      const timer = setTimeout(() => setIsVisible(true), 2000)
      return () => clearTimeout(timer)
    }
  }, [])

  const handleDismiss = () => {
    setIsVisible(false)
    localStorage.setItem('learnhub-progress-dismissed', 'true')
  }

  const totalProgress = Math.min((stats.totalLessons / 50) * 100, 100)
  const unlockedCount = achievements.filter(a => a.unlocked).length

  if (!isVisible) return null

  return (
    <>
      {/* Celebration overlay */}
      {showCelebration && (
        <div className="fixed inset-0 pointer-events-none z-[60] flex items-center justify-center">
          <div className="text-6xl animate-bounce">🎉</div>
          <div className="absolute text-4xl animate-ping">✨</div>
        </div>
      )}

      {/* Main widget */}
      <div 
        className={`fixed bottom-24 left-5 z-50 transition-all duration-500 ${
          isExpanded ? 'w-80' : 'w-auto'
        }`}
      >
        <div className="bg-navy-900/95 backdrop-blur-sm border border-navy-700 rounded-2xl shadow-2xl overflow-hidden">
          {/* Minimized view */}
          {!isExpanded && (
            <button
              onClick={() => setIsExpanded(true)}
              className="flex items-center gap-3 p-4 hover:bg-navy-800/50 transition-colors w-full"
            >
              <StreakFire streak={stats.streak} />
              <div className="text-left">
                <div className="text-lg font-bold text-white">{stats.streak} day streak!</div>
                <div className="text-xs text-navy-400">Click to see progress</div>
              </div>
            </button>
          )}

          {/* Expanded view */}
          {isExpanded && (
            <div className="p-5">
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-white">Your Progress</h3>
                <div className="flex gap-2">
                  <button
                    onClick={() => setIsExpanded(false)}
                    className="text-navy-400 hover:text-white transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  <button
                    onClick={handleDismiss}
                    className="text-navy-400 hover:text-white transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Streak section */}
              <div className="bg-gradient-to-r from-orange-500/20 to-red-500/20 rounded-xl p-4 mb-4 border border-orange-500/30">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <StreakFire streak={stats.streak} />
                      <span className="text-2xl font-bold text-white">{stats.streak}</span>
                    </div>
                    <div className="text-sm text-orange-300">Day Learning Streak</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-navy-300">Keep it going!</div>
                    <div className="text-xs text-navy-400">
                      {stats.streak >= 7 ? '🏆 Amazing!' : stats.streak >= 3 ? '⚡ Great progress!' : '💪 You got this!'}
                    </div>
                  </div>
                </div>
              </div>

              {/* Progress ring & stats */}
              <div className="flex items-center gap-4 mb-4">
                <ProgressRing progress={totalProgress} size={100} strokeWidth={6} />
                <div className="flex-1 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-navy-400">Lessons</span>
                    <span className="text-white font-medium">{stats.totalLessons}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-navy-400">Minutes</span>
                    <span className="text-white font-medium">{stats.totalMinutes}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-navy-400">Courses</span>
                    <span className="text-white font-medium">{stats.coursesCompleted}/{stats.coursesStarted}</span>
                  </div>
                </div>
              </div>

              {/* Achievements */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium text-white">Achievements</span>
                  <span className="text-xs text-navy-400">{unlockedCount}/{achievements.length} unlocked</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {achievements.map(achievement => (
                    <AchievementBadge key={achievement.id} achievement={achievement} />
                  ))}
                </div>
              </div>

              {/* Daily tip */}
              <div className="bg-navy-800/50 rounded-xl p-4 border border-navy-700">
                <div className="flex items-start gap-2">
                  <span className="text-xl">💡</span>
                  <div>
                    <p className="text-sm text-navy-200 italic">"{dailyTip.tip}"</p>
                    <p className="text-xs text-navy-400 mt-1">— {dailyTip.author}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}