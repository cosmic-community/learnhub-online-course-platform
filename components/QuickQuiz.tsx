'use client'

import { useState } from 'react'

interface QuizQuestion {
  question: string
  options: string[]
  correctIndex: number
}

interface QuickQuizProps {
  courseName: string
  question?: QuizQuestion
}

const DEFAULT_QUESTIONS: Record<string, QuizQuestion> = {
  'node': {
    question: 'What is Node.js built on?',
    options: ['V8 Engine', 'SpiderMonkey', 'JavaScriptCore', 'Chakra'],
    correctIndex: 0
  },
  'vue': {
    question: 'What is Vue.js reactivity based on?',
    options: ['Virtual DOM only', 'Proxy/Refs', 'Direct DOM', 'Web Components'],
    correctIndex: 1
  },
  'aws': {
    question: 'What does EC2 stand for?',
    options: ['Easy Cloud 2', 'Elastic Compute Cloud', 'Enterprise Cloud', 'External Cache'],
    correctIndex: 1
  },
  'default': {
    question: 'What is the main benefit of online learning?',
    options: ['Fixed schedule', 'Learn at your pace', 'No interaction', 'Higher cost'],
    correctIndex: 1
  }
}

export default function QuickQuiz({ courseName, question }: QuickQuizProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)
  const [showResult, setShowResult] = useState(false)

  // Find matching question based on course name
  const getQuestion = (): QuizQuestion => {
    if (question) return question
    
    const lowerName = courseName.toLowerCase()
    if (lowerName.includes('node')) return DEFAULT_QUESTIONS['node']
    if (lowerName.includes('vue')) return DEFAULT_QUESTIONS['vue']
    if (lowerName.includes('aws')) return DEFAULT_QUESTIONS['aws']
    return DEFAULT_QUESTIONS['default']
  }

  const quizQuestion = getQuestion()

  const handleSelect = (index: number) => {
    if (showResult) return
    setSelectedIndex(index)
    setShowResult(true)
  }

  const isCorrect = selectedIndex === quizQuestion.correctIndex

  return (
    <div className="p-4 bg-navy-900/80 backdrop-blur-sm rounded-xl border border-navy-700">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-lg">🎯</span>
        <span className="text-xs font-medium text-primary-400 uppercase tracking-wide">Quick Quiz</span>
      </div>
      
      <p className="text-sm text-white mb-3 font-medium">{quizQuestion.question}</p>
      
      <div className="space-y-2">
        {quizQuestion.options.map((option, index) => (
          <button
            key={index}
            onClick={() => handleSelect(index)}
            className={`w-full text-left text-xs px-3 py-2 rounded-lg transition-all duration-200 ${
              showResult
                ? index === quizQuestion.correctIndex
                  ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                  : selectedIndex === index
                  ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                  : 'bg-navy-800/50 text-navy-400'
                : 'bg-navy-800/50 text-navy-300 hover:bg-navy-700/50 hover:text-white'
            }`}
          >
            {option}
          </button>
        ))}
      </div>
      
      {showResult && (
        <div className={`mt-3 text-xs ${isCorrect ? 'text-green-400' : 'text-amber-400'}`}>
          {isCorrect ? '✅ Correct! Great job!' : '💡 Keep learning to master this!'}
        </div>
      )}
    </div>
  )
}