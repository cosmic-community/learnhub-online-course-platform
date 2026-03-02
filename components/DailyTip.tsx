'use client'

import { useState, useEffect } from 'react'

interface Tip {
  text: string
  author: string
  category: string
  emoji: string
}

const tips: Tip[] = [
  {
    text: "Write code as if the person who will maintain it is a violent psychopath who knows where you live.",
    author: "John Woods",
    category: "Clean Code",
    emoji: "🧹"
  },
  {
    text: "The best error message is the one that never shows up.",
    author: "Thomas Fuchs",
    category: "UX",
    emoji: "✨"
  },
  {
    text: "First, solve the problem. Then, write the code.",
    author: "John Johnson",
    category: "Problem Solving",
    emoji: "🧠"
  },
  {
    text: "Code is like humor. When you have to explain it, it's bad.",
    author: "Cory House",
    category: "Readability",
    emoji: "📖"
  },
  {
    text: "Make it work, make it right, make it fast – in that order.",
    author: "Kent Beck",
    category: "Development",
    emoji: "🚀"
  },
  {
    text: "Simplicity is the soul of efficiency.",
    author: "Austin Freeman",
    category: "Architecture",
    emoji: "💎"
  },
  {
    text: "Any fool can write code that a computer can understand. Good programmers write code that humans can understand.",
    author: "Martin Fowler",
    category: "Clean Code",
    emoji: "🎯"
  },
  {
    text: "The function of good software is to make the complex appear to be simple.",
    author: "Grady Booch",
    category: "Design",
    emoji: "🎨"
  },
  {
    text: "Programs must be written for people to read, and only incidentally for machines to execute.",
    author: "Harold Abelson",
    category: "Readability",
    emoji: "👁️"
  },
  {
    text: "Testing leads to failure, and failure leads to understanding.",
    author: "Burt Rutan",
    category: "Testing",
    emoji: "🧪"
  },
  {
    text: "The only way to go fast is to go well.",
    author: "Robert C. Martin",
    category: "Best Practices",
    emoji: "⚡"
  },
  {
    text: "Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.",
    author: "Brian Kernighan",
    category: "Debugging",
    emoji: "🔍"
  },
  {
    text: "It's not a bug – it's an undocumented feature.",
    author: "Anonymous",
    category: "Humor",
    emoji: "😄"
  },
  {
    text: "The most important property of a program is whether it accomplishes the intention of its user.",
    author: "C.A.R. Hoare",
    category: "User Focus",
    emoji: "🎯"
  },
  {
    text: "In programming, the hard part isn't solving problems, but deciding what problems to solve.",
    author: "Paul Graham",
    category: "Problem Solving",
    emoji: "🤔"
  },
  {
    text: "One of my most productive days was throwing away 1000 lines of code.",
    author: "Ken Thompson",
    category: "Refactoring",
    emoji: "🗑️"
  },
  {
    text: "Learning to code is learning to create and innovate.",
    author: "Enda Kenny",
    category: "Learning",
    emoji: "🌱"
  },
  {
    text: "Every great developer you know got there by solving problems they were unqualified to solve until they actually did it.",
    author: "Patrick McKenzie",
    category: "Growth",
    emoji: "📈"
  },
  {
    text: "The computer was born to solve problems that did not exist before.",
    author: "Bill Gates",
    category: "Innovation",
    emoji: "💡"
  },
  {
    text: "Don't comment bad code – rewrite it.",
    author: "Brian Kernighan",
    category: "Clean Code",
    emoji: "✏️"
  },
  {
    text: "Perfection is achieved not when there is nothing more to add, but when there is nothing left to take away.",
    author: "Antoine de Saint-Exupéry",
    category: "Simplicity",
    emoji: "💫"
  }
]

function getDailyTip(): Tip {
  // Use the day of the year to select a tip (so it changes daily but stays consistent throughout the day)
  const now = new Date()
  const start = new Date(now.getFullYear(), 0, 0)
  const diff = now.getTime() - start.getTime()
  const oneDay = 1000 * 60 * 60 * 24
  const dayOfYear = Math.floor(diff / oneDay)
  
  return tips[dayOfYear % tips.length]
}

export default function DailyTip() {
  const [tip, setTip] = useState<Tip | null>(null)
  const [isVisible, setIsVisible] = useState(false)
  const [isCopied, setIsCopied] = useState(false)

  useEffect(() => {
    setTip(getDailyTip())
    // Animate in after mount
    setTimeout(() => setIsVisible(true), 100)
  }, [])

  const handleCopy = async () => {
    if (!tip) return
    
    try {
      await navigator.clipboard.writeText(`"${tip.text}" — ${tip.author}`)
      setIsCopied(true)
      setTimeout(() => setIsCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const handleShare = async () => {
    if (!tip) return
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Daily Coding Tip from LearnHub',
          text: `"${tip.text}" — ${tip.author}`,
          url: window.location.href,
        })
      } catch (err) {
        // User cancelled or share failed
      }
    } else {
      handleCopy()
    }
  }

  if (!tip) {
    return (
      <div className="card p-6 animate-pulse">
        <div className="h-4 bg-navy-800 rounded w-1/3 mb-4" />
        <div className="h-20 bg-navy-800 rounded" />
      </div>
    )
  }

  return (
    <div 
      className={`card p-6 transition-all duration-500 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      }`}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
          <span className="text-2xl">{tip.emoji}</span>
          Daily Coding Tip
        </h3>
        <span className="text-xs text-navy-400 bg-navy-800 px-3 py-1 rounded-full">
          {tip.category}
        </span>
      </div>
      
      <blockquote className="relative">
        <div className="absolute -top-2 -left-1 text-4xl text-primary-500/30">"</div>
        <p className="text-navy-200 text-base leading-relaxed pl-4 italic">
          {tip.text}
        </p>
        <div className="absolute -bottom-4 right-0 text-4xl text-primary-500/30">"</div>
      </blockquote>
      
      <div className="mt-6 flex items-center justify-between">
        <p className="text-sm text-navy-400">
          — <span className="text-primary-400">{tip.author}</span>
        </p>
        
        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            className="p-2 text-navy-400 hover:text-white hover:bg-navy-800 rounded-lg transition-colors"
            title="Copy quote"
          >
            {isCopied ? (
              <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            )}
          </button>
          <button
            onClick={handleShare}
            className="p-2 text-navy-400 hover:text-white hover:bg-navy-800 rounded-lg transition-colors"
            title="Share quote"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
            </svg>
          </button>
        </div>
      </div>
      
      <div className="mt-4 pt-4 border-t border-navy-800">
        <p className="text-xs text-navy-500 flex items-center gap-1">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          New tip every day at midnight
        </p>
      </div>
    </div>
  )
}