'use client'

import { useState, useEffect } from 'react'

const MOTIVATIONAL_QUOTES = [
  { quote: "The expert in anything was once a beginner.", author: "Helen Hayes" },
  { quote: "Learning is not attained by chance, it must be sought for with ardor.", author: "Abigail Adams" },
  { quote: "The beautiful thing about learning is that nobody can take it away from you.", author: "B.B. King" },
  { quote: "Live as if you were to die tomorrow. Learn as if you were to live forever.", author: "Mahatma Gandhi" },
  { quote: "Education is the most powerful weapon which you can use to change the world.", author: "Nelson Mandela" },
  { quote: "The more that you read, the more things you will know.", author: "Dr. Seuss" },
  { quote: "An investment in knowledge pays the best interest.", author: "Benjamin Franklin" },
  { quote: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
  { quote: "Success is not final, failure is not fatal: it is the courage to continue that counts.", author: "Winston Churchill" },
  { quote: "The future belongs to those who believe in the beauty of their dreams.", author: "Eleanor Roosevelt" },
  { quote: "Tell me and I forget. Teach me and I remember. Involve me and I learn.", author: "Benjamin Franklin" },
  { quote: "It does not matter how slowly you go as long as you do not stop.", author: "Confucius" },
  { quote: "The best time to plant a tree was 20 years ago. The second best time is now.", author: "Chinese Proverb" },
  { quote: "Your limitation—it's only your imagination.", author: "Unknown" },
  { quote: "Dream it. Wish it. Do it.", author: "Unknown" },
]

const LEARNING_TIPS = [
  { icon: "🎯", tip: "Set specific learning goals for each session" },
  { icon: "⏰", tip: "Use the Pomodoro technique: 25 min focus, 5 min break" },
  { icon: "📝", tip: "Take notes by hand to improve retention" },
  { icon: "🔄", tip: "Review material within 24 hours for better memory" },
  { icon: "💬", tip: "Teach what you learn to solidify understanding" },
  { icon: "😴", tip: "Get enough sleep - your brain processes learning while you rest" },
  { icon: "🏃", tip: "Take short walks to boost creativity and focus" },
]

export default function DailyMotivation() {
  const [mounted, setMounted] = useState(false)
  const [quote, setQuote] = useState(MOTIVATIONAL_QUOTES[0])
  const [tip, setTip] = useState(LEARNING_TIPS[0])
  const [timeOfDay, setTimeOfDay] = useState('')

  useEffect(() => {
    setMounted(true)
    
    // Get consistent daily quote based on date
    const today = new Date()
    const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000)
    const quoteIndex = dayOfYear % MOTIVATIONAL_QUOTES.length
    const tipIndex = dayOfYear % LEARNING_TIPS.length
    
    const selectedQuote = MOTIVATIONAL_QUOTES[quoteIndex]
    const selectedTip = LEARNING_TIPS[tipIndex]
    
    if (selectedQuote) setQuote(selectedQuote)
    if (selectedTip) setTip(selectedTip)
    
    // Get time of day greeting
    const hour = today.getHours()
    if (hour < 12) setTimeOfDay('morning')
    else if (hour < 17) setTimeOfDay('afternoon')
    else setTimeOfDay('evening')
  }, [])

  if (!mounted) {
    return (
      <div className="card p-6 animate-pulse">
        <div className="h-32 bg-navy-800 rounded-lg"></div>
      </div>
    )
  }

  const getGreeting = () => {
    switch (timeOfDay) {
      case 'morning':
        return { text: 'Good morning!', emoji: '🌅', subtitle: 'Start your day with some learning' }
      case 'afternoon':
        return { text: 'Good afternoon!', emoji: '☀️', subtitle: 'Perfect time to level up your skills' }
      case 'evening':
        return { text: 'Good evening!', emoji: '🌙', subtitle: 'Wind down with some knowledge' }
      default:
        return { text: 'Hello!', emoji: '👋', subtitle: 'Ready to learn something new?' }
    }
  }

  const greeting = getGreeting()

  return (
    <div className="card p-6 flex flex-col">
      {/* Greeting */}
      <div className="flex items-center gap-3 mb-6">
        <span className="text-4xl">{greeting.emoji}</span>
        <div>
          <h3 className="text-xl font-bold text-white">{greeting.text}</h3>
          <p className="text-navy-400 text-sm">{greeting.subtitle}</p>
        </div>
      </div>

      {/* Daily Quote */}
      <div className="flex-1 bg-gradient-to-br from-primary-500/10 to-purple-500/10 rounded-xl p-5 border border-primary-500/20 mb-6">
        <div className="text-primary-400 text-3xl mb-3">"</div>
        <p className="text-white text-lg font-medium leading-relaxed mb-3">
          {quote?.quote}
        </p>
        <p className="text-navy-400 text-sm">— {quote?.author}</p>
      </div>

      {/* Learning Tip */}
      <div className="bg-navy-800/50 rounded-xl p-4 border border-navy-700">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xl">{tip?.icon}</span>
          <span className="text-sm font-semibold text-primary-400">💡 Daily Tip</span>
        </div>
        <p className="text-navy-200 text-sm">{tip?.tip}</p>
      </div>

      {/* Quick Stats */}
      <div className="mt-6 pt-4 border-t border-navy-800 flex justify-between">
        <div className="text-center">
          <div className="text-2xl">📅</div>
          <div className="text-xs text-navy-400 mt-1">{new Date().toLocaleDateString('en-US', { weekday: 'long' })}</div>
        </div>
        <div className="text-center">
          <div className="text-2xl">🎓</div>
          <div className="text-xs text-navy-400 mt-1">Keep Learning</div>
        </div>
        <div className="text-center">
          <div className="text-2xl">💪</div>
          <div className="text-xs text-navy-400 mt-1">You Got This</div>
        </div>
      </div>
    </div>
  )
}