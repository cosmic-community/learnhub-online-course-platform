'use client'

import { useState } from 'react'

interface StudyTimeCalculatorProps {
  totalHours: number
}

export default function StudyTimeCalculator({ totalHours }: StudyTimeCalculatorProps) {
  const [minutesPerDay, setMinutesPerDay] = useState(30)

  const daysToComplete = Math.ceil((totalHours * 60) / minutesPerDay)
  const weeksToComplete = Math.ceil(daysToComplete / 7)

  const getCompletionMessage = () => {
    if (daysToComplete <= 7) {
      return { emoji: "🚀", text: "You could finish this week!" }
    } else if (daysToComplete <= 14) {
      return { emoji: "⚡", text: "Two weeks to mastery!" }
    } else if (daysToComplete <= 30) {
      return { emoji: "📅", text: "About a month of learning" }
    } else {
      return { emoji: "🎯", text: "A rewarding journey ahead!" }
    }
  }

  const message = getCompletionMessage()

  return (
    <div className="bg-navy-800/50 rounded-xl p-4 border border-navy-700">
      <h4 className="text-white font-medium mb-3 flex items-center gap-2">
        <span>⏱️</span>
        Study Time Calculator
      </h4>
      
      <div className="mb-4">
        <label className="text-navy-400 text-sm mb-2 block">
          Minutes per day: <span className="text-primary-400 font-semibold">{minutesPerDay}</span>
        </label>
        <input
          type="range"
          min="10"
          max="120"
          step="5"
          value={minutesPerDay}
          onChange={(e) => setMinutesPerDay(Number(e.target.value))}
          className="w-full h-2 bg-navy-700 rounded-lg appearance-none cursor-pointer accent-primary-500"
        />
        <div className="flex justify-between text-xs text-navy-500 mt-1">
          <span>10 min</span>
          <span>1 hour</span>
          <span>2 hours</span>
        </div>
      </div>

      <div className="bg-navy-900/50 rounded-lg p-3 text-center">
        <div className="text-3xl mb-1">{message.emoji}</div>
        <div className="text-white font-semibold">
          {daysToComplete} days
          <span className="text-navy-400 font-normal text-sm"> ({weeksToComplete} {weeksToComplete === 1 ? 'week' : 'weeks'})</span>
        </div>
        <div className="text-primary-400 text-sm mt-1">{message.text}</div>
      </div>
    </div>
  )
}