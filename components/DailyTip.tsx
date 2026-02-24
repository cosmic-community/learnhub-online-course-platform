'use client'

import { useState } from 'react'
import Link from 'next/link'
import type { Lesson } from '@/types'

interface DailyTipProps {
  lesson: Lesson
}

export default function DailyTip({ lesson }: DailyTipProps) {
  const [copied, setCopied] = useState(false)
  const [liked, setLiked] = useState(false)

  const codeSnippet = lesson.metadata?.code_example?.slice(0, 300) || ''
  const description = lesson.metadata?.description || 'Check out this lesson!'
  
  // Extract a clean tip from the code
  const tipLines = codeSnippet.split('\n').filter(line => line.trim()).slice(0, 6)
  const displayCode = tipLines.join('\n')

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(codeSnippet)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const handleLike = () => {
    setLiked(!liked)
    // Could persist this to localStorage or CMS
    const likes = JSON.parse(localStorage.getItem('learnhub-likes') || '{}')
    likes[lesson.id] = !liked
    localStorage.setItem('learnhub-likes', JSON.stringify(likes))
  }

  return (
    <div className="card p-6 relative overflow-hidden">
      {/* Decorative gradient */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-primary-500/10 to-transparent rounded-bl-full" />
      
      <div className="relative">
        <div className="flex items-start justify-between mb-4">
          <div>
            <span className="inline-flex items-center gap-1.5 text-xs font-medium text-primary-400 mb-2">
              <span className="w-2 h-2 bg-primary-400 rounded-full animate-pulse" />
              Daily Coding Tip
            </span>
            <h3 className="text-lg font-semibold text-white">
              {lesson.metadata?.title || lesson.title}
            </h3>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleLike}
              className={`p-2 rounded-lg transition-all ${
                liked 
                  ? 'bg-red-500/20 text-red-400' 
                  : 'bg-navy-800 text-navy-400 hover:bg-navy-700'
              }`}
              title={liked ? 'Liked!' : 'Like this tip'}
            >
              {liked ? '❤️' : '🤍'}
            </button>
          </div>
        </div>
        
        <p className="text-navy-300 text-sm mb-4 line-clamp-2">
          {description}
        </p>
        
        {/* Code Preview */}
        <div className="relative group mb-4">
          <div className="bg-navy-800/80 rounded-lg p-4 font-mono text-sm overflow-hidden">
            <pre className="text-navy-200 overflow-x-auto">
              <code>{displayCode}...</code>
            </pre>
          </div>
          <button
            onClick={handleCopy}
            className="absolute top-2 right-2 px-2 py-1 text-xs bg-navy-700 text-navy-300 rounded opacity-0 group-hover:opacity-100 transition-opacity hover:bg-navy-600"
          >
            {copied ? '✓ Copied!' : 'Copy'}
          </button>
        </div>
        
        {/* Action Button */}
        <div className="flex items-center justify-between">
          <Link
            href={`/courses`}
            className="inline-flex items-center gap-2 text-primary-400 hover:text-primary-300 text-sm font-medium transition-colors"
          >
            <span>See full lesson</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
          
          <div className="flex items-center gap-2 text-xs text-navy-500">
            <span>⏱️ {lesson.metadata?.duration_minutes || 10} min</span>
          </div>
        </div>
      </div>
    </div>
  )
}