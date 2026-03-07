'use client'

import { useState, useEffect } from 'react'

interface Badge {
  id: string
  name: string
  icon: string
  description: string
  unlocked: boolean
}

const DAILY_TIPS = [
  { tip: "The best time to start learning was yesterday. The second best time is now.", author: "Chinese Proverb" },
  { tip: "Code is like humor. When you have to explain it, it's bad.", author: "Cory House" },
  { tip: "First, solve the problem. Then, write the code.", author: "John Johnson" },
  { tip: "Make it work, make it right, make it fast.", author: "Kent Beck" },
  { tip: "Simplicity is the soul of efficiency.", author: "Austin Freeman" },
  { tip: "Any fool can write code that a computer can understand. Good programmers write code that humans can understand.", author: "Martin Fowler" },
  { tip: "The only way to learn a new programming language is by writing programs in it.", author: "Dennis Ritchie" },
  { tip: "Experience is the name everyone gives to their mistakes.", author: "Oscar Wilde" },
]

const BADGES: Badge[] = [
  { id: 'explorer', name: 'Explorer', icon: '🧭', description: 'Visited the platform', unlocked: true },
  { id: 'curious', name: 'Curious Mind', icon: '🔍', description: 'Browsed 3+ courses', unlocked: false },
  { id: 'dedicated', name: 'Dedicated', icon: '🔥', description: '3-day learning streak', unlocked: false },
  { id: 'scholar', name: 'Scholar', icon: '📚', description: 'Explored all categories', unlocked: false },
]

export default function LearningJourney() {
  const [streak, setStreak] = useState(1)
  const [badges, setBadges] = useState<Badge[]>(BADGES)
  const [dailyTip, setDailyTip] = useState(DAILY_TIPS[0])
  const [showTip, setShowTip] = useState(false)
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number }>>([])
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    
    // Load streak from localStorage
    const lastVisit = localStorage.getItem('learnhub-last-visit')
    const savedStreak = localStorage.getItem('learnhub-streak')
    const today = new Date().toDateString()
    
    if (lastVisit) {
      const lastDate = new Date(lastVisit)
      const yesterday = new Date()
      yesterday.setDate(yesterday.getDate() - 1)
      
      if (lastDate.toDateString() === yesterday.toDateString()) {
        // Visited yesterday, increment streak
        const newStreak = (parseInt(savedStreak || '1') || 1) + 1
        setStreak(newStreak)
        localStorage.setItem('learnhub-streak', newStreak.toString())
      } else if (lastDate.toDateString() !== today) {
        // Streak broken, reset to 1
        setStreak(1)
        localStorage.setItem('learnhub-streak', '1')
      } else {
        // Already visited today
        setStreak(parseInt(savedStreak || '1') || 1)
      }
    }
    
    localStorage.setItem('learnhub-last-visit', today)
    
    // Update badges based on streak
    if (streak >= 3) {
      setBadges(prev => prev.map(b => 
        b.id === 'dedicated' ? { ...b, unlocked: true } : b
      ))
    }
    
    // Set random daily tip
    const tipIndex = new Date().getDate() % DAILY_TIPS.length
    setDailyTip(DAILY_TIPS[tipIndex] || DAILY_TIPS[0])
    
    // Show tip after delay
    const tipTimer = setTimeout(() => setShowTip(true), 2000)
    
    return () => clearTimeout(tipTimer)
  }, [streak])

  // Particle effect on badge hover
  const createParticles = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const newParticles = Array.from({ length: 5 }, (_, i) => ({
      id: Date.now() + i,
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    }))
    setParticles(prev => [...prev, ...newParticles])
    
    setTimeout(() => {
      setParticles(prev => prev.filter(p => !newParticles.find(np => np.id === p.id)))
    }, 1000)
  }

  if (!mounted) return null

  return (
    <div className="relative">
      {/* Main Widget */}
      <div className="card p-6 relative overflow-hidden">
        {/* Animated gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 via-transparent to-purple-500/5 animate-pulse" />
        
        <div className="relative z-10">
          {/* Header with streak */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                <span className="text-2xl">🚀</span>
                Your Learning Journey
              </h3>
              <p className="text-navy-400 text-sm">Keep learning, keep growing!</p>
            </div>
            
            {/* Streak Counter */}
            <div className="flex items-center gap-2 bg-gradient-to-r from-orange-500/20 to-red-500/20 px-4 py-2 rounded-xl border border-orange-500/30">
              <span className="text-2xl animate-bounce">🔥</span>
              <div className="text-right">
                <div className="text-xl font-bold text-orange-400">{streak}</div>
                <div className="text-xs text-orange-300/70">day streak</div>
              </div>
            </div>
          </div>
          
          {/* Badges Section */}
          <div className="mb-6">
            <p className="text-sm text-navy-400 mb-3">Your Badges</p>
            <div className="flex gap-3 flex-wrap">
              {badges.map((badge) => (
                <div
                  key={badge.id}
                  className={`relative group cursor-pointer transition-all duration-300 ${
                    badge.unlocked 
                      ? 'opacity-100 hover:scale-110' 
                      : 'opacity-40 grayscale'
                  }`}
                  onMouseEnter={badge.unlocked ? createParticles : undefined}
                  title={badge.description}
                >
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${
                    badge.unlocked 
                      ? 'bg-gradient-to-br from-primary-500/20 to-purple-500/20 border border-primary-500/30 shadow-lg shadow-primary-500/20' 
                      : 'bg-navy-800/50 border border-navy-700'
                  }`}>
                    {badge.icon}
                  </div>
                  
                  {/* Tooltip */}
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-navy-800 rounded-lg text-xs text-white opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-20 pointer-events-none">
                    <div className="font-semibold">{badge.name}</div>
                    <div className="text-navy-400">{badge.description}</div>
                    <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-navy-800" />
                  </div>
                  
                  {/* Particles */}
                  {particles.map(p => (
                    <span
                      key={p.id}
                      className="absolute w-1 h-1 bg-primary-400 rounded-full animate-ping"
                      style={{ left: p.x, top: p.y }}
                    />
                  ))}
                </div>
              ))}
              
              {/* More badges hint */}
              <div className="w-12 h-12 rounded-xl bg-navy-800/30 border border-dashed border-navy-700 flex items-center justify-center text-navy-500 text-lg">
                +{4 - badges.filter(b => b.unlocked).length}
              </div>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="mb-4">
            <div className="flex justify-between text-xs text-navy-400 mb-1">
              <span>Journey Progress</span>
              <span>{Math.round((badges.filter(b => b.unlocked).length / badges.length) * 100)}%</span>
            </div>
            <div className="h-2 bg-navy-800 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-primary-500 to-purple-500 rounded-full transition-all duration-1000 ease-out"
                style={{ width: `${(badges.filter(b => b.unlocked).length / badges.length) * 100}%` }}
              />
            </div>
          </div>
          
          {/* Encouragement Message */}
          <p className="text-center text-sm text-navy-300">
            {streak >= 3 
              ? "🎉 Amazing dedication! You're on fire!" 
              : streak >= 2 
                ? "💪 Great job coming back! Keep it up!" 
                : "👋 Welcome! Start exploring to unlock badges!"}
          </p>
        </div>
      </div>
      
      {/* Floating Daily Tip */}
      {showTip && (
        <div className="mt-4 card p-4 bg-gradient-to-r from-navy-900/80 to-navy-800/80 border-primary-500/20 animate-fadeIn">
          <div className="flex items-start gap-3">
            <span className="text-2xl">💡</span>
            <div className="flex-1">
              <p className="text-sm text-navy-200 italic mb-1">"{dailyTip.tip}"</p>
              <p className="text-xs text-primary-400">— {dailyTip.author}</p>
            </div>
            <button 
              onClick={() => setShowTip(false)}
              className="text-navy-500 hover:text-navy-300 transition-colors"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  )
}