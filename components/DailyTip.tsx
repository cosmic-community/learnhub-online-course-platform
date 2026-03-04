'use client'

import { useState, useEffect } from 'react'

const tips = [
  {
    icon: '🎯',
    title: 'Set Clear Goals',
    content: 'Start each learning session with a specific goal in mind. Whether it\'s completing a lesson or building a feature, clarity drives progress.',
    category: 'Productivity'
  },
  {
    icon: '🧠',
    title: 'Practice Active Recall',
    content: 'After watching a lesson, close it and try to explain the concept out loud. This strengthens memory retention by up to 50%!',
    category: 'Learning'
  },
  {
    icon: '⏰',
    title: 'Use the Pomodoro Technique',
    content: 'Study for 25 minutes, then take a 5-minute break. After 4 sessions, take a longer 15-30 minute break. Your brain will thank you!',
    category: 'Time Management'
  },
  {
    icon: '💻',
    title: 'Code Along, Don\'t Just Watch',
    content: 'Type the code yourself instead of just watching. Muscle memory is real for programmers, and hands-on practice accelerates learning.',
    category: 'Coding'
  },
  {
    icon: '📝',
    title: 'Take Smart Notes',
    content: 'Write notes in your own words, not verbatim. Add examples and questions. Your future self will appreciate the context!',
    category: 'Study Skills'
  },
  {
    icon: '🔄',
    title: 'Review Regularly',
    content: 'Spaced repetition is key! Review what you learned yesterday, last week, and last month. Build a sustainable review schedule.',
    category: 'Retention'
  },
  {
    icon: '🤝',
    title: 'Teach What You Learn',
    content: 'Explaining concepts to others (or even rubber ducks) reveals gaps in your understanding and solidifies your knowledge.',
    category: 'Mastery'
  },
  {
    icon: '🎨',
    title: 'Build Real Projects',
    content: 'Apply new skills to personal projects immediately. Nothing beats learning by doing, and you\'ll have a portfolio to show!',
    category: 'Practice'
  }
]

export default function DailyTip() {
  const [currentTip, setCurrentTip] = useState(0)
  const [isLiked, setIsLiked] = useState(false)
  const [likeCount, setLikeCount] = useState(0)

  useEffect(() => {
    // Get a consistent tip based on the current day
    const today = new Date()
    const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000)
    setCurrentTip(dayOfYear % tips.length)
    
    // Simulate a like count (in real app, this would come from backend)
    setLikeCount(Math.floor(Math.random() * 50) + 100)
    
    // Check if user already liked today's tip
    const likedTips = JSON.parse(localStorage.getItem('likedTips') || '[]')
    setIsLiked(likedTips.includes(dayOfYear))
  }, [])

  const handleLike = () => {
    const today = new Date()
    const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000)
    
    const likedTips = JSON.parse(localStorage.getItem('likedTips') || '[]')
    
    if (!isLiked) {
      likedTips.push(dayOfYear)
      localStorage.setItem('likedTips', JSON.stringify(likedTips))
      setLikeCount(prev => prev + 1)
      setIsLiked(true)
    }
  }

  const handleNextTip = () => {
    setCurrentTip(prev => (prev + 1) % tips.length)
    setIsLiked(false)
  }

  const tip = tips[currentTip]

  return (
    <section className="py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="card p-8 relative overflow-hidden group">
          {/* Animated gradient background */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary-500/10 via-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          
          {/* Decorative elements */}
          <div className="absolute top-4 right-4 text-6xl opacity-10 group-hover:opacity-20 transition-opacity">
            {tip.icon}
          </div>
          
          <div className="relative">
            <div className="flex items-center gap-3 mb-4">
              <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary-500/20 text-primary-400 text-sm font-medium">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-primary-500"></span>
                </span>
                Daily Learning Tip
              </span>
              <span className="text-navy-500 text-sm">#{tip.category}</span>
            </div>
            
            <div className="flex items-start gap-4">
              <div className="text-4xl flex-shrink-0 transform group-hover:scale-110 transition-transform duration-300">
                {tip.icon}
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-primary-400 transition-colors">
                  {tip.title}
                </h3>
                <p className="text-navy-300 leading-relaxed">
                  {tip.content}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between mt-6 pt-4 border-t border-navy-800">
              <div className="flex items-center gap-4">
                <button
                  onClick={handleLike}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                    isLiked 
                      ? 'bg-red-500/20 text-red-400' 
                      : 'bg-navy-800 text-navy-400 hover:bg-navy-700 hover:text-white'
                  }`}
                >
                  <span className={`text-lg ${isLiked ? 'animate-bounce-once' : ''}`}>
                    {isLiked ? '❤️' : '🤍'}
                  </span>
                  <span className="text-sm font-medium">{likeCount}</span>
                </button>
                
                <button
                  onClick={() => {
                    if (navigator.share) {
                      navigator.share({
                        title: tip.title,
                        text: tip.content,
                        url: window.location.href,
                      })
                    }
                  }}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-navy-800 text-navy-400 hover:bg-navy-700 hover:text-white transition-all duration-200"
                >
                  <span>🔗</span>
                  <span className="text-sm font-medium">Share</span>
                </button>
              </div>
              
              <button
                onClick={handleNextTip}
                className="flex items-center gap-2 text-primary-400 hover:text-primary-300 transition-colors group/next"
              >
                <span className="text-sm font-medium">Next tip</span>
                <span className="transform transition-transform group-hover/next:translate-x-1">→</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}