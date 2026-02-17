'use client'

import { useState, useEffect } from 'react'

interface Achievement {
  id: string
  icon: string
  title: string
  description: string
  unlocked: boolean
}

const motivationalQuotes = [
  { quote: "The expert in anything was once a beginner.", author: "Helen Hayes" },
  { quote: "Learning never exhausts the mind.", author: "Leonardo da Vinci" },
  { quote: "The beautiful thing about learning is that no one can take it away from you.", author: "B.B. King" },
  { quote: "Education is not preparation for life; education is life itself.", author: "John Dewey" },
  { quote: "The more that you read, the more things you will know.", author: "Dr. Seuss" },
  { quote: "Live as if you were to die tomorrow. Learn as if you were to live forever.", author: "Mahatma Gandhi" },
  { quote: "An investment in knowledge pays the best interest.", author: "Benjamin Franklin" },
  { quote: "The capacity to learn is a gift; the ability to learn is a skill; the willingness to learn is a choice.", author: "Brian Herbert" },
]

const achievements: Achievement[] = [
  { id: 'first-visit', icon: '🌟', title: 'First Steps', description: 'Visited LearnHub for the first time', unlocked: true },
  { id: 'explorer', icon: '🔍', title: 'Explorer', description: 'Browsed multiple courses', unlocked: true },
  { id: 'curious', icon: '🧠', title: 'Curious Mind', description: 'Read a course description', unlocked: true },
  { id: 'dedicated', icon: '🔥', title: 'Dedicated Learner', description: 'Maintain a learning streak', unlocked: false },
  { id: 'night-owl', icon: '🦉', title: 'Night Owl', description: 'Learning after midnight', unlocked: false },
  { id: 'early-bird', icon: '🐦', title: 'Early Bird', description: 'Learning before 7 AM', unlocked: false },
]

function getGreeting(): { greeting: string; emoji: string; period: string } {
  const hour = new Date().getHours()
  
  if (hour >= 5 && hour < 12) {
    return { greeting: 'Good morning', emoji: '☀️', period: 'morning' }
  } else if (hour >= 12 && hour < 17) {
    return { greeting: 'Good afternoon', emoji: '🌤️', period: 'afternoon' }
  } else if (hour >= 17 && hour < 21) {
    return { greeting: 'Good evening', emoji: '🌅', period: 'evening' }
  } else {
    return { greeting: 'Hello, night learner', emoji: '🌙', period: 'night' }
  }
}

export default function LearningProgressTracker() {
  const [isExpanded, setIsExpanded] = useState(false)
  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0)
  const [streak, setStreak] = useState(1)
  const [isAnimating, setIsAnimating] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [userAchievements, setUserAchievements] = useState<Achievement[]>(achievements)
  const { greeting, emoji, period } = getGreeting()

  useEffect(() => {
    setMounted(true)
    
    // Load streak from localStorage
    const savedStreak = localStorage.getItem('learnhub-streak')
    const lastVisit = localStorage.getItem('learnhub-last-visit')
    const today = new Date().toDateString()
    
    if (lastVisit) {
      const lastDate = new Date(lastVisit)
      const daysDiff = Math.floor((new Date().getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24))
      
      if (daysDiff === 1) {
        // Consecutive day - increase streak
        const newStreak = (parseInt(savedStreak || '1') || 1) + 1
        setStreak(newStreak)
        localStorage.setItem('learnhub-streak', newStreak.toString())
      } else if (daysDiff > 1) {
        // Streak broken - reset
        setStreak(1)
        localStorage.setItem('learnhub-streak', '1')
      } else {
        // Same day
        setStreak(parseInt(savedStreak || '1') || 1)
      }
    }
    
    localStorage.setItem('learnhub-last-visit', today)
    
    // Update achievements based on time
    const hour = new Date().getHours()
    setUserAchievements(prev => prev.map(a => {
      if (a.id === 'night-owl' && (hour >= 0 && hour < 5)) {
        return { ...a, unlocked: true }
      }
      if (a.id === 'early-bird' && (hour >= 5 && hour < 7)) {
        return { ...a, unlocked: true }
      }
      if (a.id === 'dedicated' && streak >= 3) {
        return { ...a, unlocked: true }
      }
      return a
    }))
    
    // Rotate quotes
    const quoteInterval = setInterval(() => {
      setIsAnimating(true)
      setTimeout(() => {
        setCurrentQuoteIndex(prev => (prev + 1) % motivationalQuotes.length)
        setIsAnimating(false)
      }, 300)
    }, 8000)
    
    return () => clearInterval(quoteInterval)
  }, [streak])

  if (!mounted) return null

  const currentQuote = motivationalQuotes[currentQuoteIndex]
  const unlockedCount = userAchievements.filter(a => a.unlocked).length

  return (
    <div className="relative">
      {/* Floating Toggle Button */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className={`
          fixed bottom-24 right-6 z-40
          w-14 h-14 rounded-full
          bg-gradient-to-br from-primary-500 to-primary-600
          shadow-lg shadow-primary-500/30
          flex items-center justify-center
          transition-all duration-300 ease-out
          hover:scale-110 hover:shadow-xl hover:shadow-primary-500/40
          ${isExpanded ? 'rotate-45' : 'animate-pulse'}
        `}
        aria-label="Toggle learning tracker"
      >
        <span className="text-2xl">{isExpanded ? '✕' : '🎯'}</span>
      </button>

      {/* Expanded Panel */}
      <div
        className={`
          fixed bottom-40 right-6 z-40
          w-80 max-w-[calc(100vw-3rem)]
          bg-navy-900/95 backdrop-blur-xl
          border border-navy-700/50
          rounded-2xl
          shadow-2xl shadow-black/20
          transition-all duration-500 ease-out
          ${isExpanded 
            ? 'opacity-100 translate-y-0 pointer-events-auto' 
            : 'opacity-0 translate-y-4 pointer-events-none'
          }
        `}
      >
        {/* Header with Greeting */}
        <div className="p-5 border-b border-navy-800/50">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-3xl animate-bounce">{emoji}</span>
            <div>
              <h3 className="text-white font-semibold">{greeting}!</h3>
              <p className="text-navy-400 text-sm">Ready to learn something new?</p>
            </div>
          </div>
        </div>

        {/* Streak Counter */}
        <div className="p-5 border-b border-navy-800/50">
          <div className="flex items-center justify-between mb-3">
            <span className="text-navy-400 text-sm font-medium">Learning Streak</span>
            <div className="flex items-center gap-2">
              <span className="text-2xl">🔥</span>
              <span className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-500">
                {streak}
              </span>
              <span className="text-navy-400 text-sm">days</span>
            </div>
          </div>
          
          {/* Streak Progress Bar */}
          <div className="relative h-2 bg-navy-800 rounded-full overflow-hidden">
            <div 
              className="absolute inset-y-0 left-0 bg-gradient-to-r from-orange-500 to-red-500 rounded-full transition-all duration-1000"
              style={{ width: `${Math.min(streak * 10, 100)}%` }}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
          </div>
          
          {streak >= 7 && (
            <p className="mt-2 text-xs text-primary-400 flex items-center gap-1">
              <span>🏆</span> Amazing! You're on fire!
            </p>
          )}
        </div>

        {/* Motivational Quote */}
        <div className="p-5 border-b border-navy-800/50">
          <div className="flex items-start gap-2 mb-2">
            <span className="text-primary-400">💡</span>
            <span className="text-navy-400 text-xs font-medium uppercase tracking-wide">Daily Inspiration</span>
          </div>
          <div className={`transition-all duration-300 ${isAnimating ? 'opacity-0 translate-y-2' : 'opacity-100 translate-y-0'}`}>
            <p className="text-navy-200 text-sm italic leading-relaxed">
              "{currentQuote?.quote}"
            </p>
            <p className="text-navy-500 text-xs mt-2">— {currentQuote?.author}</p>
          </div>
        </div>

        {/* Achievements */}
        <div className="p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-navy-400 text-sm font-medium">Achievements</span>
            <span className="text-xs text-primary-400">{unlockedCount}/{userAchievements.length}</span>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {userAchievements.map((achievement) => (
              <div
                key={achievement.id}
                className={`
                  group relative
                  w-10 h-10 rounded-lg
                  flex items-center justify-center
                  transition-all duration-300
                  ${achievement.unlocked 
                    ? 'bg-navy-800 hover:bg-navy-700 cursor-pointer hover:scale-110' 
                    : 'bg-navy-800/50 opacity-40 grayscale'
                  }
                `}
                title={achievement.unlocked ? `${achievement.title}: ${achievement.description}` : 'Locked'}
              >
                <span className={`text-xl ${achievement.unlocked ? '' : 'blur-[2px]'}`}>
                  {achievement.icon}
                </span>
                
                {/* Tooltip */}
                {achievement.unlocked && (
                  <div className="
                    absolute bottom-full left-1/2 -translate-x-1/2 mb-2
                    px-3 py-2 rounded-lg
                    bg-navy-950 border border-navy-700
                    text-xs text-center
                    opacity-0 group-hover:opacity-100
                    transition-opacity duration-200
                    pointer-events-none
                    whitespace-nowrap
                    z-50
                  ">
                    <div className="font-semibold text-white">{achievement.title}</div>
                    <div className="text-navy-400">{achievement.description}</div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Footer CTA */}
        <div className="p-4 bg-gradient-to-r from-primary-500/10 to-primary-600/10 border-t border-primary-500/20">
          <a 
            href="/courses"
            className="block text-center text-sm font-medium text-primary-400 hover:text-primary-300 transition-colors"
          >
            Start Learning Now →
          </a>
        </div>
      </div>
    </div>
  )
}