'use client'

import { useState, useEffect } from 'react'

interface StreakData {
  currentStreak: number
  longestStreak: number
  lastActiveDate: string
  totalLessonsCompleted: number
  todayLessonsCompleted: number
  dailyGoal: number
  achievements: string[]
}

const ACHIEVEMENTS = {
  first_lesson: { name: 'First Steps', emoji: '🎯', description: 'Complete your first lesson' },
  streak_3: { name: 'Getting Warm', emoji: '🔥', description: '3 day streak' },
  streak_7: { name: 'On Fire', emoji: '🔥🔥', description: '7 day streak' },
  streak_30: { name: 'Unstoppable', emoji: '🚀', description: '30 day streak' },
  lessons_10: { name: 'Dedicated Learner', emoji: '📚', description: 'Complete 10 lessons' },
  lessons_50: { name: 'Knowledge Seeker', emoji: '🧠', description: 'Complete 50 lessons' },
  goal_crusher: { name: 'Goal Crusher', emoji: '💪', description: 'Hit daily goal 5 times' },
}

const MOTIVATIONAL_MESSAGES = [
  "Every expert was once a beginner!",
  "You're building something amazing!",
  "Consistency beats intensity!",
  "Small steps lead to big changes!",
  "Your future self will thank you!",
  "Learning is a superpower!",
  "Progress, not perfection!",
]

export default function LearningStreak() {
  const [streakData, setStreakData] = useState<StreakData | null>(null)
  const [showConfetti, setShowConfetti] = useState(false)
  const [newAchievement, setNewAchievement] = useState<string | null>(null)
  const [motivationalMessage, setMotivationalMessage] = useState('')
  const [isExpanded, setIsExpanded] = useState(false)

  useEffect(() => {
    // Load streak data from localStorage
    const savedData = localStorage.getItem('learnhub_streak')
    const today = new Date().toISOString().split('T')[0]
    
    if (savedData) {
      const parsed: StreakData = JSON.parse(savedData)
      
      // Check if streak should continue or reset
      const lastDate = new Date(parsed.lastActiveDate)
      const todayDate = new Date(today)
      const diffDays = Math.floor((todayDate.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24))
      
      if (diffDays > 1) {
        // Streak broken
        parsed.currentStreak = 0
        parsed.todayLessonsCompleted = 0
      } else if (diffDays === 1) {
        // New day, reset today's count but keep streak
        parsed.todayLessonsCompleted = 0
      }
      
      setStreakData(parsed)
    } else {
      // Initialize new user
      const initialData: StreakData = {
        currentStreak: 0,
        longestStreak: 0,
        lastActiveDate: today,
        totalLessonsCompleted: 0,
        todayLessonsCompleted: 0,
        dailyGoal: 2,
        achievements: [],
      }
      setStreakData(initialData)
      localStorage.setItem('learnhub_streak', JSON.stringify(initialData))
    }

    // Set random motivational message
    setMotivationalMessage(MOTIVATIONAL_MESSAGES[Math.floor(Math.random() * MOTIVATIONAL_MESSAGES.length)])
  }, [])

  const simulateLearningSomeContent = () => {
    if (!streakData) return

    const today = new Date().toISOString().split('T')[0]
    const newData = { ...streakData }
    
    // Check if this is first activity today
    if (newData.lastActiveDate !== today) {
      newData.currentStreak += 1
      newData.lastActiveDate = today
      newData.todayLessonsCompleted = 0
    }
    
    newData.todayLessonsCompleted += 1
    newData.totalLessonsCompleted += 1
    
    // Update longest streak
    if (newData.currentStreak > newData.longestStreak) {
      newData.longestStreak = newData.currentStreak
    }

    // Check for new achievements
    const newAchievements: string[] = []
    
    if (newData.totalLessonsCompleted === 1 && !newData.achievements.includes('first_lesson')) {
      newAchievements.push('first_lesson')
    }
    if (newData.currentStreak >= 3 && !newData.achievements.includes('streak_3')) {
      newAchievements.push('streak_3')
    }
    if (newData.currentStreak >= 7 && !newData.achievements.includes('streak_7')) {
      newAchievements.push('streak_7')
    }
    if (newData.currentStreak >= 30 && !newData.achievements.includes('streak_30')) {
      newAchievements.push('streak_30')
    }
    if (newData.totalLessonsCompleted >= 10 && !newData.achievements.includes('lessons_10')) {
      newAchievements.push('lessons_10')
    }
    if (newData.totalLessonsCompleted >= 50 && !newData.achievements.includes('lessons_50')) {
      newAchievements.push('lessons_50')
    }

    // Goal crusher check
    if (newData.todayLessonsCompleted >= newData.dailyGoal && !newData.achievements.includes('goal_crusher')) {
      // This is simplified - in real app you'd track this more precisely
      const goalHits = Math.floor(newData.totalLessonsCompleted / newData.dailyGoal)
      if (goalHits >= 5) {
        newAchievements.push('goal_crusher')
      }
    }

    if (newAchievements.length > 0) {
      newData.achievements = [...newData.achievements, ...newAchievements]
      setNewAchievement(newAchievements[0])
      setShowConfetti(true)
      setTimeout(() => {
        setShowConfetti(false)
        setNewAchievement(null)
      }, 3000)
    } else if (newData.todayLessonsCompleted === newData.dailyGoal) {
      // Hit daily goal - celebrate!
      setShowConfetti(true)
      setTimeout(() => setShowConfetti(false), 2000)
    }

    setStreakData(newData)
    localStorage.setItem('learnhub_streak', JSON.stringify(newData))
  }

  if (!streakData) return null

  const goalProgress = Math.min((streakData.todayLessonsCompleted / streakData.dailyGoal) * 100, 100)
  const goalMet = streakData.todayLessonsCompleted >= streakData.dailyGoal

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
                animationDelay: `${Math.random() * 0.5}s`,
                backgroundColor: ['#10B981', '#3B82F6', '#8B5CF6', '#F59E0B', '#EF4444', '#EC4899'][Math.floor(Math.random() * 6)],
              }}
            />
          ))}
        </div>
      )}

      {/* Achievement Toast */}
      {newAchievement && ACHIEVEMENTS[newAchievement as keyof typeof ACHIEVEMENTS] && (
        <div className="fixed top-20 right-4 z-50 animate-slide-in">
          <div className="bg-gradient-to-r from-primary-500 to-primary-600 text-white px-6 py-4 rounded-xl shadow-2xl flex items-center gap-4">
            <span className="text-3xl">{ACHIEVEMENTS[newAchievement as keyof typeof ACHIEVEMENTS].emoji}</span>
            <div>
              <div className="text-sm opacity-80">Achievement Unlocked!</div>
              <div className="font-bold">{ACHIEVEMENTS[newAchievement as keyof typeof ACHIEVEMENTS].name}</div>
            </div>
          </div>
        </div>
      )}

      {/* Main Streak Widget */}
      <div className="card p-6 relative overflow-hidden">
        {/* Background glow effect */}
        {goalMet && (
          <div className="absolute inset-0 bg-gradient-to-br from-primary-500/10 to-transparent pointer-events-none" />
        )}
        
        <div className="relative">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <span className={`text-2xl ${streakData.currentStreak > 0 ? 'animate-pulse' : ''}`}>
                {streakData.currentStreak > 0 ? '🔥' : '✨'}
              </span>
              Your Learning Journey
            </h3>
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-navy-400 hover:text-white transition-colors"
            >
              {isExpanded ? '▲' : '▼'}
            </button>
          </div>

          {/* Streak Counter */}
          <div className="flex items-center gap-6 mb-6">
            <div className="text-center">
              <div className={`text-4xl font-bold ${streakData.currentStreak > 0 ? 'text-primary-400' : 'text-navy-400'}`}>
                {streakData.currentStreak}
              </div>
              <div className="text-navy-400 text-sm">Day Streak</div>
            </div>
            <div className="h-12 w-px bg-navy-700" />
            <div className="text-center">
              <div className="text-2xl font-bold text-white">{streakData.totalLessonsCompleted}</div>
              <div className="text-navy-400 text-sm">Lessons Completed</div>
            </div>
            <div className="h-12 w-px bg-navy-700" />
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-400">{streakData.longestStreak}</div>
              <div className="text-navy-400 text-sm">Best Streak</div>
            </div>
          </div>

          {/* Daily Goal Progress */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-navy-300 text-sm">Daily Goal: {streakData.todayLessonsCompleted}/{streakData.dailyGoal} lessons</span>
              {goalMet && <span className="text-green-400 text-sm font-medium">✓ Complete!</span>}
            </div>
            <div className="h-3 bg-navy-800 rounded-full overflow-hidden">
              <div 
                className={`h-full rounded-full transition-all duration-500 ${
                  goalMet 
                    ? 'bg-gradient-to-r from-green-500 to-green-400' 
                    : 'bg-gradient-to-r from-primary-600 to-primary-400'
                }`}
                style={{ width: `${goalProgress}%` }}
              />
            </div>
          </div>

          {/* Motivational Message */}
          <p className="text-navy-400 text-sm italic mb-4">"{motivationalMessage}"</p>

          {/* Demo Button */}
          <button
            onClick={simulateLearningSomeContent}
            className="btn-primary w-full text-sm"
          >
            + Complete a Lesson (Demo)
          </button>

          {/* Expanded Content - Achievements */}
          {isExpanded && (
            <div className="mt-6 pt-6 border-t border-navy-800">
              <h4 className="text-white font-medium mb-4">Achievements ({streakData.achievements.length}/{Object.keys(ACHIEVEMENTS).length})</h4>
              <div className="grid grid-cols-2 gap-3">
                {Object.entries(ACHIEVEMENTS).map(([key, achievement]) => {
                  const unlocked = streakData.achievements.includes(key)
                  return (
                    <div
                      key={key}
                      className={`p-3 rounded-lg border ${
                        unlocked 
                          ? 'bg-primary-500/10 border-primary-500/30' 
                          : 'bg-navy-800/50 border-navy-700 opacity-50'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className={`text-xl ${unlocked ? '' : 'grayscale'}`}>{achievement.emoji}</span>
                        <div>
                          <div className={`text-sm font-medium ${unlocked ? 'text-white' : 'text-navy-400'}`}>
                            {achievement.name}
                          </div>
                          <div className="text-xs text-navy-500">{achievement.description}</div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}