'use client'

import { useEffect, useState } from 'react'

interface SkillBadge {
  icon: string
  name: string
  color: string
  delay: number
}

const skillBadges: SkillBadge[] = [
  { icon: '⚛️', name: 'React', color: 'from-cyan-400 to-blue-500', delay: 0 },
  { icon: '🟢', name: 'Node.js', color: 'from-green-400 to-emerald-500', delay: 0.2 },
  { icon: '☁️', name: 'AWS', color: 'from-orange-400 to-amber-500', delay: 0.4 },
  { icon: '🎨', name: 'Vue.js', color: 'from-emerald-400 to-teal-500', delay: 0.6 },
  { icon: '📱', name: 'Mobile', color: 'from-purple-400 to-pink-500', delay: 0.8 },
  { icon: '🔷', name: 'TypeScript', color: 'from-blue-400 to-indigo-500', delay: 1.0 },
]

const codingTips = [
  { tip: "Write code for humans first, machines second.", author: "Martin Fowler" },
  { tip: "Simplicity is the soul of efficiency.", author: "Austin Freeman" },
  { tip: "First, solve the problem. Then, write the code.", author: "John Johnson" },
  { tip: "Code is like humor. When you have to explain it, it's bad.", author: "Cory House" },
  { tip: "The best error message is the one that never shows up.", author: "Thomas Fuchs" },
  { tip: "Clean code always looks like it was written by someone who cares.", author: "Robert C. Martin" },
  { tip: "Make it work, make it right, make it fast.", author: "Kent Beck" },
]

export default function LearningJourney() {
  const [mounted, setMounted] = useState(false)
  const [dailyTip, setDailyTip] = useState(codingTips[0])
  const [hoveredBadge, setHoveredBadge] = useState<number | null>(null)

  useEffect(() => {
    setMounted(true)
    // Select a "random" tip based on the day
    const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000)
    setDailyTip(codingTips[dayOfYear % codingTips.length])
  }, [])

  if (!mounted) return null

  return (
    <section className="py-16 relative overflow-hidden">
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary-500/5 via-transparent to-purple-500/5 animate-pulse" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Section Header */}
        <div className="text-center mb-12">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-500/10 text-primary-400 text-sm font-medium mb-4">
            <span className="w-2 h-2 bg-primary-400 rounded-full animate-ping" />
            Your Learning Journey
          </span>
          <h2 className="text-3xl font-bold text-white mb-4">
            Master In-Demand Skills
          </h2>
          <p className="text-navy-400 max-w-2xl mx-auto">
            Join thousands of developers leveling up their careers with our expert-crafted courses
          </p>
        </div>

        {/* Floating Skill Badges */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {skillBadges.map((badge, index) => (
            <div
              key={badge.name}
              className={`group relative cursor-pointer transform transition-all duration-500 ${
                hoveredBadge === index ? 'scale-110 -translate-y-2' : 'hover:scale-105'
              }`}
              style={{
                animation: `float 3s ease-in-out infinite`,
                animationDelay: `${badge.delay}s`,
              }}
              onMouseEnter={() => setHoveredBadge(index)}
              onMouseLeave={() => setHoveredBadge(null)}
            >
              <div className={`flex items-center gap-3 px-5 py-3 rounded-2xl bg-gradient-to-r ${badge.color} bg-opacity-10 backdrop-blur-sm border border-white/10 shadow-lg transition-all duration-300 group-hover:shadow-xl group-hover:shadow-primary-500/20`}>
                <span className="text-2xl">{badge.icon}</span>
                <span className="font-semibold text-white">{badge.name}</span>
              </div>
              
              {/* Glow effect on hover */}
              {hoveredBadge === index && (
                <div className={`absolute inset-0 rounded-2xl bg-gradient-to-r ${badge.color} opacity-20 blur-xl -z-10 animate-pulse`} />
              )}
            </div>
          ))}
        </div>

        {/* Daily Coding Tip */}
        <div className="max-w-2xl mx-auto">
          <div className="card p-6 text-center relative overflow-hidden group hover:border-primary-500/50 transition-all duration-500">
            {/* Decorative elements */}
            <div className="absolute top-0 left-0 w-20 h-20 bg-primary-500/10 rounded-full blur-2xl group-hover:bg-primary-500/20 transition-colors duration-500" />
            <div className="absolute bottom-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-2xl group-hover:bg-purple-500/20 transition-colors duration-500" />
            
            <div className="relative">
              <div className="flex items-center justify-center gap-2 mb-4">
                <span className="text-2xl">💡</span>
                <span className="text-sm font-medium text-primary-400 uppercase tracking-wider">
                  Daily Coding Wisdom
                </span>
              </div>
              
              <blockquote className="text-lg text-navy-200 italic mb-4">
                "{dailyTip.tip}"
              </blockquote>
              
              <cite className="text-sm text-navy-400 not-italic">
                — {dailyTip.author}
              </cite>
            </div>
          </div>
        </div>

        {/* Progress Path Visualization */}
        <div className="mt-12 flex justify-center">
          <div className="flex items-center gap-2">
            {[1, 2, 3, 4, 5].map((step) => (
              <div key={step} className="flex items-center">
                <div 
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-500 ${
                    step <= 3 
                      ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/30' 
                      : 'bg-navy-800 text-navy-400 border border-navy-700'
                  }`}
                  style={{ animationDelay: `${step * 0.1}s` }}
                >
                  {step <= 3 ? '✓' : step}
                </div>
                {step < 5 && (
                  <div className={`w-8 h-1 mx-1 rounded-full transition-all duration-500 ${
                    step < 3 ? 'bg-primary-500' : 'bg-navy-800'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>
        
        <p className="text-center text-sm text-navy-400 mt-4">
          You're making great progress! Keep learning to unlock new achievements 🚀
        </p>
      </div>

      {/* CSS for floating animation */}
      <style jsx>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }
      `}</style>
    </section>
  )
}