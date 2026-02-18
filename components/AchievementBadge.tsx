'use client'

import { useState } from 'react'

interface Achievement {
  id: string
  icon: string
  title: string
  description: string
  unlocked: boolean
  rarity: 'common' | 'rare' | 'epic' | 'legendary'
}

const achievements: Achievement[] = [
  { id: '1', icon: '🎯', title: 'First Steps', description: 'Start your first course', unlocked: true, rarity: 'common' },
  { id: '2', icon: '📚', title: 'Bookworm', description: 'Complete 5 lessons', unlocked: true, rarity: 'common' },
  { id: '3', icon: '🔥', title: 'On Fire', description: '3-day learning streak', unlocked: true, rarity: 'rare' },
  { id: '4', icon: '🏆', title: 'Champion', description: 'Complete a full course', unlocked: false, rarity: 'epic' },
  { id: '5', icon: '⚡', title: 'Speed Learner', description: 'Complete 3 lessons in one day', unlocked: false, rarity: 'rare' },
  { id: '6', icon: '🌟', title: 'Rising Star', description: '7-day learning streak', unlocked: false, rarity: 'legendary' },
]

const rarityColors = {
  common: 'from-gray-400 to-gray-500',
  rare: 'from-blue-400 to-blue-500',
  epic: 'from-purple-400 to-purple-500',
  legendary: 'from-yellow-400 to-orange-500',
}

const rarityBorders = {
  common: 'border-gray-500/30',
  rare: 'border-blue-500/30',
  epic: 'border-purple-500/30',
  legendary: 'border-yellow-500/30 animate-pulse-slow',
}

export default function AchievementBadge() {
  const [selectedAchievement, setSelectedAchievement] = useState<Achievement | null>(null)
  const unlockedCount = achievements.filter(a => a.unlocked).length

  return (
    <div className="card p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            <span className="text-2xl">🏅</span> Achievements
          </h3>
          <p className="text-sm text-navy-400">{unlockedCount} of {achievements.length} unlocked</p>
        </div>
        <div className="px-3 py-1 bg-primary-500/20 rounded-full">
          <span className="text-primary-400 font-medium">{Math.round((unlockedCount / achievements.length) * 100)}%</span>
        </div>
      </div>

      <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
        {achievements.map((achievement) => (
          <button
            key={achievement.id}
            onClick={() => setSelectedAchievement(achievement)}
            className={`relative group p-3 rounded-xl border-2 transition-all duration-300 ${
              achievement.unlocked
                ? `${rarityBorders[achievement.rarity]} bg-navy-800/50 hover:scale-110`
                : 'border-navy-700 bg-navy-900/50 opacity-50'
            }`}
          >
            <div className={`text-3xl ${!achievement.unlocked ? 'grayscale' : ''}`}>
              {achievement.icon}
            </div>
            {achievement.unlocked && (
              <div className={`absolute -top-1 -right-1 w-4 h-4 rounded-full bg-gradient-to-r ${rarityColors[achievement.rarity]}`}>
                <span className="text-xs">✓</span>
              </div>
            )}
            
            {/* Tooltip */}
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-navy-800 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10 shadow-xl">
              <p className="text-sm font-medium text-white">{achievement.title}</p>
              <p className="text-xs text-navy-400">{achievement.description}</p>
            </div>
          </button>
        ))}
      </div>

      {/* Achievement Detail Modal */}
      {selectedAchievement && (
        <div 
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedAchievement(null)}
        >
          <div 
            className="card p-6 max-w-sm w-full animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            <div className={`w-20 h-20 mx-auto rounded-2xl bg-gradient-to-r ${rarityColors[selectedAchievement.rarity]} flex items-center justify-center mb-4`}>
              <span className="text-5xl">{selectedAchievement.icon}</span>
            </div>
            <h4 className="text-xl font-bold text-white text-center">{selectedAchievement.title}</h4>
            <p className="text-navy-400 text-center mt-2">{selectedAchievement.description}</p>
            <div className="mt-4 flex justify-center">
              <span className={`px-3 py-1 rounded-full text-sm font-medium bg-gradient-to-r ${rarityColors[selectedAchievement.rarity]} text-white capitalize`}>
                {selectedAchievement.rarity}
              </span>
            </div>
            {!selectedAchievement.unlocked && (
              <p className="text-center text-sm text-navy-500 mt-4">🔒 Keep learning to unlock!</p>
            )}
            <button
              onClick={() => setSelectedAchievement(null)}
              className="mt-6 w-full btn-secondary"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  )
}