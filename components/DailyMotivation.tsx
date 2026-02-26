'use client'

import { useState, useEffect } from 'react'

const motivationalQuotes = [
  { quote: "The beautiful thing about learning is that nobody can take it away from you.", author: "B.B. King" },
  { quote: "Education is the most powerful weapon which you can use to change the world.", author: "Nelson Mandela" },
  { quote: "The more that you read, the more things you will know. The more that you learn, the more places you'll go.", author: "Dr. Seuss" },
  { quote: "Live as if you were to die tomorrow. Learn as if you were to live forever.", author: "Mahatma Gandhi" },
  { quote: "Anyone who stops learning is old, whether at twenty or eighty.", author: "Henry Ford" },
  { quote: "The expert in anything was once a beginner.", author: "Helen Hayes" },
  { quote: "Learning never exhausts the mind.", author: "Leonardo da Vinci" },
  { quote: "Tell me and I forget. Teach me and I remember. Involve me and I learn.", author: "Benjamin Franklin" },
  { quote: "The capacity to learn is a gift; the ability to learn is a skill; the willingness to learn is a choice.", author: "Brian Herbert" },
  { quote: "Every accomplishment starts with the decision to try.", author: "John F. Kennedy" },
  { quote: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
  { quote: "Success is not final, failure is not fatal: it is the courage to continue that counts.", author: "Winston Churchill" },
]

const learningTips = [
  { tip: "Take short breaks", icon: "☕", description: "Study in 25-minute focused sessions" },
  { tip: "Practice actively", icon: "💪", description: "Apply what you learn immediately" },
  { tip: "Stay curious", icon: "🔍", description: "Ask questions and explore deeper" },
  { tip: "Review regularly", icon: "📝", description: "Spaced repetition helps retention" },
  { tip: "Teach others", icon: "🎓", description: "Explaining helps solidify knowledge" },
  { tip: "Sleep well", icon: "😴", description: "Rest is crucial for memory" },
]

export default function DailyMotivation() {
  const [quote, setQuote] = useState(motivationalQuotes[0])
  const [tip, setTip] = useState(learningTips[0])
  const [isVisible, setIsVisible] = useState(false)
  const [showTip, setShowTip] = useState(true)

  useEffect(() => {
    // Get daily quote based on day of year
    const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000)
    setQuote(motivationalQuotes[dayOfYear % motivationalQuotes.length] || motivationalQuotes[0])
    setTip(learningTips[dayOfYear % learningTips.length] || learningTips[0])
    
    setTimeout(() => setIsVisible(true), 100)
    
    // Toggle between quote and tip every 10 seconds
    const interval = setInterval(() => {
      setShowTip(prev => !prev)
    }, 10000)
    
    return () => clearInterval(interval)
  }, [])

  return (
    <div className={`card p-6 relative overflow-hidden transition-all duration-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
      {/* Decorative gradient */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary-500/20 to-purple-500/20 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
      
      <div className="relative">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{showTip ? '💡' : '✨'}</span>
            <h3 className="text-lg font-semibold text-white">
              {showTip ? "Today's Learning Tip" : 'Daily Inspiration'}
            </h3>
          </div>
          <div className="flex gap-1">
            <button 
              onClick={() => setShowTip(false)}
              className={`w-2 h-2 rounded-full transition-colors ${!showTip ? 'bg-primary-500' : 'bg-navy-600 hover:bg-navy-500'}`}
              aria-label="Show quote"
            />
            <button 
              onClick={() => setShowTip(true)}
              className={`w-2 h-2 rounded-full transition-colors ${showTip ? 'bg-primary-500' : 'bg-navy-600 hover:bg-navy-500'}`}
              aria-label="Show tip"
            />
          </div>
        </div>

        <div className="min-h-[120px] flex items-center">
          {showTip ? (
            <div className="animate-fade-in">
              <div className="flex items-start gap-4">
                <div className="text-4xl p-3 bg-navy-800/50 rounded-xl">
                  {tip?.icon}
                </div>
                <div>
                  <h4 className="text-xl font-semibold text-white mb-1">{tip?.tip}</h4>
                  <p className="text-navy-300">{tip?.description}</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="animate-fade-in">
              <blockquote className="text-lg text-navy-200 italic mb-3 leading-relaxed">
                &ldquo;{quote?.quote}&rdquo;
              </blockquote>
              <cite className="text-primary-400 text-sm not-italic">
                — {quote?.author}
              </cite>
            </div>
          )}
        </div>

        {/* Quick action buttons */}
        <div className="flex gap-2 mt-4 pt-4 border-t border-navy-700">
          <button 
            className="flex-1 py-2 px-3 bg-navy-800/50 hover:bg-navy-700/50 rounded-lg text-sm text-navy-300 hover:text-white transition-colors flex items-center justify-center gap-2"
            onClick={() => window.location.href = '/courses'}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            Start Learning
          </button>
          <button 
            className="py-2 px-3 bg-navy-800/50 hover:bg-navy-700/50 rounded-lg text-sm text-navy-300 hover:text-white transition-colors"
            onClick={() => setShowTip(!showTip)}
          >
            {showTip ? '📖' : '💡'}
          </button>
        </div>
      </div>
    </div>
  )
}