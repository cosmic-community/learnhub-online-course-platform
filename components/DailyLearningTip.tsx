'use client'

import { useState, useEffect } from 'react'
import type { Category } from '@/types'

interface DailyLearningTipProps {
  categories: Category[]
}

const learningTips: Record<string, string[]> = {
  'web-development': [
    "Practice coding every day, even if it's just for 15 minutes. Consistency builds expertise.",
    "Build projects that solve real problems - it's the best way to learn and build your portfolio.",
    "Read other developers' code on GitHub. You'll learn new patterns and approaches.",
    "Don't just copy code - understand why it works. Debug it, break it, fix it.",
    "Learn keyboard shortcuts in your IDE. Small efficiencies add up to big productivity gains.",
  ],
  'mobile-development': [
    "Test your apps on real devices, not just simulators. User experience matters.",
    "Focus on performance from the start - mobile users have high expectations.",
    "Learn both iOS and Android basics, even if you specialize in one platform.",
    "Study Apple's Human Interface Guidelines and Google's Material Design.",
    "Build apps you'd actually use yourself - passion drives better products.",
  ],
  'data-science': [
    "Start with clean data - 80% of data science is data preparation.",
    "Visualize your data before applying algorithms. Insights often come from exploration.",
    "Learn SQL thoroughly - it's the foundation of data work.",
    "Practice explaining complex results in simple terms. Communication is crucial.",
    "Kaggle competitions are great for real-world practice and portfolio building.",
  ],
  'cloud-computing': [
    "Start with the free tiers - AWS, GCP, and Azure all offer generous free trials.",
    "Learn Infrastructure as Code early. Manual setup doesn't scale.",
    "Security should be your first thought, not an afterthought.",
    "Understand the shared responsibility model in cloud security.",
    "Monitor costs from day one - cloud bills can surprise you.",
  ],
  default: [
    "Set specific, measurable learning goals. 'Learn React' is vague; 'Build a task manager in React' is actionable.",
    "Teach what you learn - explaining concepts solidifies your understanding.",
    "Take breaks! The Pomodoro Technique (25 min work, 5 min break) keeps you fresh.",
    "Join developer communities. Learning with others accelerates your growth.",
    "Don't fear failure - bugs and errors are your best teachers.",
    "Review and refactor your old code. See how far you've come!",
    "Build in public - sharing your journey inspires others and keeps you accountable.",
    "Read documentation before Stack Overflow. Primary sources often have better answers.",
  ],
}

export default function DailyLearningTip({ categories }: DailyLearningTipProps) {
  const [tip, setTip] = useState<string>('')
  const [category, setCategory] = useState<string>('')
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Get a daily tip based on the date
    const today = new Date()
    const dayOfYear = Math.floor(
      (today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 
      (1000 * 60 * 60 * 24)
    )
    
    // Pick a category based on the day
    const categoryIndex = dayOfYear % categories.length
    const selectedCategory = categories[categoryIndex]
    const categorySlug = selectedCategory?.slug || 'default'
    
    // Get tips for this category, fall back to default
    const categoryTips = learningTips[categorySlug] || learningTips.default
    const tipIndex = dayOfYear % categoryTips.length
    
    setTip(categoryTips[tipIndex])
    setCategory(selectedCategory?.metadata?.name || selectedCategory?.title || 'General')
    
    // Animate in
    setTimeout(() => setIsVisible(true), 100)
  }, [categories])

  if (!tip) return null

  return (
    <section className={`py-8 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-primary-500/10 via-primary-600/5 to-navy-900/50 border border-primary-500/20 p-6 sm:p-8">
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary-500/10 rounded-full blur-2xl" />
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-primary-600/10 rounded-full blur-xl" />
          
          <div className="relative flex items-start gap-4">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 rounded-xl bg-primary-500/20 flex items-center justify-center">
                <span className="text-2xl">💡</span>
              </div>
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-primary-400 text-sm font-semibold uppercase tracking-wider">
                  Daily Learning Tip
                </span>
                <span className="text-navy-500">•</span>
                <span className="text-navy-400 text-sm">{category}</span>
              </div>
              
              <p className="text-white text-lg leading-relaxed">
                "{tip}"
              </p>
              
              <div className="mt-4 flex items-center gap-2 text-navy-400 text-sm">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>New tip every day</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}