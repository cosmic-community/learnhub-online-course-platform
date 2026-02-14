'use client'

import { useState, useEffect } from 'react'

interface Achievement {
  id: string
  title: string
  description: string
  icon: string
  unlocked: boolean
  progress?: number
  target?: number
}

interface LearningProgressProps {
  totalCourses: number
  totalLessons: number
  totalHours: number
}

export default function LearningProgress({ totalCourses, totalLessons, totalHours }: LearningProgressProps) {
  const [streak, setStreak] = useState(0)
  const [isVisible, setIsVisible] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)
  
  // Simulated user progress (in a real app, this would come from user data)
  const [userProgress] = useState({
    coursesStarted: Math.min(3, totalCourses),
    lessonsCompleted: Math.min(12, totalLessons),
    hoursLearned: Math.min(8, totalHours),
    daysActive: 7,
  })

  const achievements: Achievement[] = [
    {
      id: 'first-lesson',
      title: 'First Steps',
      description: 'Complete your first lesson',
      icon: '🎯',
      unlocked: userProgress.lessonsCompleted >= 1,
    },
    {
      id: 'streak-3',
      title: 'On Fire',
      description: '3-day learning streak',
      icon: '🔥',
      unlocked: userProgress.daysActive >= 3,
    },
    {
      id: 'lessons-10',
      title: 'Knowledge Seeker',
      description: 'Complete 10 lessons',
      icon: '📚',
      unlocked: userProgress.lessonsCompleted >= 10,
      progress: userProgress.lessonsCompleted,
      target: 10,
    },
    {
      id: 'explorer',
      title: 'Explorer',
      description: 'Start 3 different courses',
      icon: '🧭',
      unlocked: userProgress.coursesStarted >= 3,
      progress: userProgress.coursesStarted,
      target: 3,
    },
    {
      id: 'dedicated',
      title: 'Dedicated Learner',
      description: 'Learn for 5+ hours',
      icon: '⭐',
      unlocked: userProgress.hoursLearned >= 5,
      progress: userProgress.hoursLearned,
      target: 5,
    },
    {
      id: 'streak-7',
      title: 'Week Warrior',
      description: '7-day learning streak',
      icon: '👑',
      unlocked: userProgress.daysActive >= 7,
    },
  ]

  useEffect(() => {
    // Animate streak counter
    const targetStreak = userProgress.daysActive
    let current = 0
    const timer = setInterval(() => {
      if (current < targetStreak) {
        current++
        setStreak(current)
      } else {
        clearInterval(timer)
      }
    }, 100)

    // Trigger visibility for animations
    setTimeout(() => setIsVisible(true), 100)

    // Show confetti if user has achievements
    if (achievements.filter(a => a.unlocked).length >= 3) {
      setTimeout(() => setShowConfetti(true), 500)
      setTimeout(() => setShowConfetti(false), 3000)
    }

    return () => clearInterval(timer)
  }, [userProgress.daysActive])

  const progressPercentage = Math.round((userProgress.lessonsCompleted / totalLessons) * 100)

  return (
    <div className={`relative transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
      {/* Confetti Effect */}
      {showConfetti && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-confetti"
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 0.5}s`,
                animationDuration: `${2 + Math.random()}s`,
              }}
            >
              {['🎉', '✨', '🌟', '💫', '⭐'][Math.floor(Math.random() * 5)]}
            </div>
          ))}
        </div>
      )}

      <div className="card p-8 relative overflow-hidden">
        {/* Background Glow */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        
        <div className="relative">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-2xl font-bold text-white mb-1">Your Learning Journey</h3>
              <p className="text-navy-400">Track your progress and unlock achievements</p>
            </div>
            
            {/* Streak Counter */}
            <div className="flex items-center gap-3 bg-gradient-to-r from-orange-500/20 to-red-500/20 px-5 py-3 rounded-2xl border border-orange-500/30">
              <div className="relative">
                <span className="text-3xl animate-pulse">🔥</span>
                {streak >= 3 && (
                  <span className="absolute -top-1 -right-1 text-xs">✨</span>
                )}
              </div>
              <div>
                <div className="text-2xl font-bold text-white">{streak}</div>
                <div className="text-xs text-orange-300">Day Streak</div>
              </div>
            </div>
          </div>

          {/* Progress Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* Circular Progress */}
            <div className="flex items-center gap-4">
              <div className="relative w-20 h-20">
                <svg className="w-20 h-20 transform -rotate-90">
                  <circle
                    cx="40"
                    cy="40"
                    r="36"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="none"
                    className="text-navy-700"
                  />
                  <circle
                    cx="40"
                    cy="40"
                    r="36"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="none"
                    strokeLinecap="round"
                    className="text-primary-500 transition-all duration-1000 ease-out"
                    style={{
                      strokeDasharray: `${2 * Math.PI * 36}`,
                      strokeDashoffset: `${2 * Math.PI * 36 * (1 - progressPercentage / 100)}`,
                    }}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-lg font-bold text-white">{progressPercentage}%</span>
                </div>
              </div>
              <div>
                <div className="text-sm text-navy-400">Overall Progress</div>
                <div className="text-white font-semibold">{userProgress.lessonsCompleted} of {totalLessons} lessons</div>
              </div>
            </div>

            {/* Courses Started */}
            <div className="bg-navy-800/50 rounded-xl p-4 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center text-2xl">
                📚
              </div>
              <div>
                <div className="text-2xl font-bold text-white">{userProgress.coursesStarted}</div>
                <div className="text-sm text-navy-400">Courses in Progress</div>
              </div>
            </div>

            {/* Hours Learned */}
            <div className="bg-navy-800/50 rounded-xl p-4 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center text-2xl">
                ⏱️
              </div>
              <div>
                <div className="text-2xl font-bold text-white">{userProgress.hoursLearned}h</div>
                <div className="text-sm text-navy-400">Total Learning Time</div>
              </div>
            </div>
          </div>

          {/* Achievements */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <span>🏆</span> Achievements
              <span className="text-sm font-normal text-navy-400">
                ({achievements.filter(a => a.unlocked).length}/{achievements.length} unlocked)
              </span>
            </h4>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
              {achievements.map((achievement, index) => (
                <div
                  key={achievement.id}
                  className={`relative group transition-all duration-300 ${
                    achievement.unlocked 
                      ? 'bg-gradient-to-br from-primary-500/20 to-primary-600/10 border-primary-500/30' 
                      : 'bg-navy-800/30 border-navy-700/50'
                  } border rounded-xl p-4 text-center`}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  {/* Glow effect for unlocked */}
                  {achievement.unlocked && (
                    <div className="absolute inset-0 bg-primary-500/5 rounded-xl animate-pulse" />
                  )}
                  
                  <div className={`relative text-3xl mb-2 transition-transform duration-300 ${
                    achievement.unlocked ? 'animate-bounce-subtle' : 'grayscale opacity-50'
                  }`}>
                    {achievement.icon}
                  </div>
                  
                  <div className={`text-xs font-medium mb-1 ${
                    achievement.unlocked ? 'text-white' : 'text-navy-500'
                  }`}>
                    {achievement.title}
                  </div>
                  
                  {/* Progress bar for incomplete achievements */}
                  {!achievement.unlocked && achievement.progress !== undefined && achievement.target !== undefined && (
                    <div className="mt-2">
                      <div className="h-1 bg-navy-700 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-primary-500 transition-all duration-500"
                          style={{ width: `${(achievement.progress / achievement.target) * 100}%` }}
                        />
                      </div>
                      <div className="text-[10px] text-navy-500 mt-1">
                        {achievement.progress}/{achievement.target}
                      </div>
                    </div>
                  )}
                  
                  {/* Tooltip */}
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-navy-900 rounded-lg text-xs text-white opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10 border border-navy-700">
                    {achievement.description}
                    <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-navy-900" />
                  </div>
                  
                  {/* Unlocked badge */}
                  {achievement.unlocked && (
                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center text-white text-xs">
                      ✓
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Motivation Message */}
          <div className="mt-6 text-center">
            <p className="text-navy-400 text-sm">
              {streak >= 7 
                ? "🎉 Amazing! You're on a week-long streak! Keep the momentum going!"
                : streak >= 3 
                  ? "🔥 Great job! You're building a solid learning habit!"
                  : "💪 Start your learning streak today and unlock achievements!"}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}