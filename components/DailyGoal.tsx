'use client'

import { useState, useEffect } from 'react'

interface GoalData {
  dailyGoal: number
  todayProgress: number
  lastUpdateDate: string
}

const GOAL_KEY = 'learnhub_daily_goal'

function getGoalData(): GoalData {
  if (typeof window === 'undefined') {
    return { dailyGoal: 2, todayProgress: 0, lastUpdateDate: '' }
  }
  
  const stored = localStorage.getItem(GOAL_KEY)
  if (stored) {
    try {
      const data = JSON.parse(stored)
      const today = new Date().toISOString().split('T')[0]
      
      // Reset progress if it's a new day
      if (data.lastUpdateDate !== today) {
        data.todayProgress = 0
        data.lastUpdateDate = today
      }
      
      return data
    } catch {
      // Invalid data
    }
  }
  
  return {
    dailyGoal: 2,
    todayProgress: 0,
    lastUpdateDate: new Date().toISOString().split('T')[0],
  }
}

export function useDailyGoal() {
  const [goalData, setGoalData] = useState<GoalData>(getGoalData)
  
  useEffect(() => {
    setGoalData(getGoalData())
  }, [])
  
  const incrementProgress = () => {
    const data = getGoalData()
    data.todayProgress += 1
    data.lastUpdateDate = new Date().toISOString().split('T')[0]
    localStorage.setItem(GOAL_KEY, JSON.stringify(data))
    setGoalData({ ...data })
    
    return data.todayProgress >= data.dailyGoal
  }
  
  const setDailyGoal = (goal: number) => {
    const data = getGoalData()
    data.dailyGoal = goal
    localStorage.setItem(GOAL_KEY, JSON.stringify(data))
    setGoalData({ ...data })
  }
  
  return { goalData, incrementProgress, setDailyGoal }
}

export default function DailyGoal() {
  const { goalData, setDailyGoal } = useDailyGoal()
  const [mounted, setMounted] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  
  useEffect(() => {
    setMounted(true)
  }, [])
  
  if (!mounted) {
    return (
      <div className="card p-6 animate-pulse">
        <div className="h-16 bg-navy-800 rounded"></div>
      </div>
    )
  }
  
  const progress = Math.min((goalData.todayProgress / goalData.dailyGoal) * 100, 100)
  const isComplete = goalData.todayProgress >= goalData.dailyGoal
  
  return (
    <div className="card p-6 relative overflow-hidden">
      {/* Celebration overlay when complete */}
      {isComplete && (
        <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 to-primary-500/10 pointer-events-none" />
      )}
      
      <div className="relative">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            <span className="text-2xl">🎯</span>
            Daily Goal
          </h3>
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="text-navy-400 hover:text-white transition-colors"
            aria-label="Settings"
          >
            ⚙️
          </button>
        </div>
        
        {showSettings ? (
          <div className="space-y-3">
            <p className="text-sm text-navy-300">Lessons per day:</p>
            <div className="flex gap-2">
              {[1, 2, 3, 5].map((num) => (
                <button
                  key={num}
                  onClick={() => {
                    setDailyGoal(num)
                    setShowSettings(false)
                  }}
                  className={`flex-1 py-2 rounded-lg font-medium transition-all ${
                    goalData.dailyGoal === num
                      ? 'bg-primary-500 text-white'
                      : 'bg-navy-800 text-navy-300 hover:bg-navy-700'
                  }`}
                >
                  {num}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <>
            <div className="flex items-center gap-4 mb-3">
              <div className="flex-1">
                <div className="h-3 bg-navy-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      isComplete
                        ? 'bg-gradient-to-r from-green-500 to-green-400'
                        : 'bg-gradient-to-r from-primary-600 to-primary-400'
                    }`}
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
              <span className="text-sm font-medium text-white whitespace-nowrap">
                {goalData.todayProgress}/{goalData.dailyGoal}
              </span>
            </div>
            
            <p className="text-sm text-navy-300">
              {isComplete ? (
                <span className="text-green-400 flex items-center gap-1">
                  <span>🎉</span> Goal achieved! Great work!
                </span>
              ) : (
                `${goalData.dailyGoal - goalData.todayProgress} more lesson${goalData.dailyGoal - goalData.todayProgress !== 1 ? 's' : ''} to reach your goal`
              )}
            </p>
          </>
        )}
      </div>
    </div>
  )
}