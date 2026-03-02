'use client'

import { useState, useEffect } from 'react'

interface Tip {
  tip: string
  icon: string
}

interface DailyTipProps {
  tips: Tip[]
}

export default function DailyTip({ tips }: DailyTipProps) {
  const [currentTip, setCurrentTip] = useState<Tip | null>(null)
  const [isAnimating, setIsAnimating] = useState(false)
  const [savedTips, setSavedTips] = useState<string[]>([])
  const [showSaved, setShowSaved] = useState(false)

  useEffect(() => {
    // Get tip index based on day of year for consistency
    const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000)
    const tipIndex = dayOfYear % tips.length
    setCurrentTip(tips[tipIndex])

    // Load saved tips
    const saved = localStorage.getItem('learnhub-saved-tips')
    if (saved) {
      setSavedTips(JSON.parse(saved))
    }
  }, [tips])

  const getNewTip = () => {
    setIsAnimating(true)
    setTimeout(() => {
      const randomIndex = Math.floor(Math.random() * tips.length)
      setCurrentTip(tips[randomIndex])
      setIsAnimating(false)
    }, 300)
  }

  const saveTip = () => {
    if (currentTip && !savedTips.includes(currentTip.tip)) {
      const newSaved = [...savedTips, currentTip.tip]
      setSavedTips(newSaved)
      localStorage.setItem('learnhub-saved-tips', JSON.stringify(newSaved))
    }
  }

  const isSaved = currentTip ? savedTips.includes(currentTip.tip) : false

  if (!currentTip) {
    return (
      <div className="card p-6 animate-pulse">
        <div className="h-6 bg-navy-700 rounded w-1/3 mb-4"></div>
        <div className="h-16 bg-navy-700 rounded"></div>
      </div>
    )
  }

  return (
    <div className="card p-6">
      <div className="flex items-start justify-between mb-4">
        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
          💡 Tip of the Day
        </h3>
        <div className="flex items-center gap-2">
          <button
            onClick={saveTip}
            className={`p-2 rounded-lg transition-colors ${
              isSaved 
                ? 'bg-yellow-500/20 text-yellow-400' 
                : 'bg-navy-700 text-navy-400 hover:text-white hover:bg-navy-600'
            }`}
            title={isSaved ? 'Saved!' : 'Save this tip'}
          >
            {isSaved ? '⭐' : '☆'}
          </button>
          <button
            onClick={() => setShowSaved(!showSaved)}
            className="p-2 bg-navy-700 text-navy-400 hover:text-white hover:bg-navy-600 rounded-lg transition-colors relative"
            title="View saved tips"
          >
            📚
            {savedTips.length > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-primary-500 text-white text-xs rounded-full flex items-center justify-center">
                {savedTips.length}
              </span>
            )}
          </button>
        </div>
      </div>

      {showSaved ? (
        <div className="space-y-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-navy-400">Your Saved Tips ({savedTips.length})</span>
            <button
              onClick={() => setShowSaved(false)}
              className="text-xs text-primary-400 hover:text-primary-300"
            >
              Back to today&apos;s tip
            </button>
          </div>
          {savedTips.length === 0 ? (
            <p className="text-navy-400 text-sm">No saved tips yet. Click ☆ to save tips you like!</p>
          ) : (
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {savedTips.map((tip, index) => (
                <div key={index} className="bg-navy-800/50 rounded-lg p-3 text-sm text-navy-200">
                  {tip}
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <>
          <div 
            className={`transition-all duration-300 ${
              isAnimating ? 'opacity-0 transform scale-95' : 'opacity-100 transform scale-100'
            }`}
          >
            <div className="flex items-start gap-4">
              <span className="text-4xl">{currentTip.icon}</span>
              <p className="text-navy-200 leading-relaxed">{currentTip.tip}</p>
            </div>
          </div>

          <button
            onClick={getNewTip}
            disabled={isAnimating}
            className="mt-6 w-full py-2 bg-navy-700 hover:bg-navy-600 text-navy-300 hover:text-white rounded-lg transition-colors text-sm font-medium disabled:opacity-50 flex items-center justify-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Get Another Tip
          </button>
        </>
      )}
    </div>
  )
}