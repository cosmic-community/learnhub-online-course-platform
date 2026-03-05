'use client'

import { useState, useEffect } from 'react'

interface Question {
  question: string
  options: string[]
  correctIndex: number
  explanation: string
  category: string
}

const questions: Question[] = [
  {
    question: 'What does API stand for?',
    options: ['Application Programming Interface', 'Applied Program Integration', 'Automatic Program Interaction', 'Advanced Protocol Interface'],
    correctIndex: 0,
    explanation: 'API stands for Application Programming Interface - it allows different software systems to communicate with each other.',
    category: 'Web Fundamentals'
  },
  {
    question: 'Which CSS property creates rounded corners?',
    options: ['corner-radius', 'border-curve', 'border-radius', 'edge-round'],
    correctIndex: 2,
    explanation: 'border-radius is the CSS property used to create rounded corners on elements.',
    category: 'CSS'
  },
  {
    question: 'What is the purpose of "use client" in Next.js?',
    options: ['To import client libraries', 'To mark a component as a Client Component', 'To enable client-side caching', 'To create client sessions'],
    correctIndex: 1,
    explanation: '"use client" directive marks a component to be rendered on the client side, enabling hooks and interactivity.',
    category: 'Next.js'
  },
  {
    question: 'Which array method creates a new array without modifying the original?',
    options: ['push()', 'splice()', 'map()', 'sort()'],
    correctIndex: 2,
    explanation: 'map() returns a new array with transformed elements, while keeping the original array unchanged.',
    category: 'JavaScript'
  },
  {
    question: 'What does REST stand for in REST API?',
    options: ['Representational State Transfer', 'Remote Service Technology', 'Request State Transmission', 'Reliable Server Transfer'],
    correctIndex: 0,
    explanation: 'REST (Representational State Transfer) is an architectural style for designing networked applications.',
    category: 'Web Fundamentals'
  },
  {
    question: 'Which hook is used to manage state in React?',
    options: ['useEffect', 'useContext', 'useState', 'useRef'],
    correctIndex: 2,
    explanation: 'useState is the hook for adding state to functional components. It returns a state value and setter function.',
    category: 'React'
  },
  {
    question: 'What is TypeScript\'s main advantage over JavaScript?',
    options: ['Faster execution', 'Static type checking', 'Smaller bundle size', 'Better animations'],
    correctIndex: 1,
    explanation: 'TypeScript adds static type checking, catching errors at compile time rather than runtime.',
    category: 'TypeScript'
  },
  {
    question: 'Which HTTP method is used to update a resource?',
    options: ['GET', 'POST', 'PUT', 'DELETE'],
    correctIndex: 2,
    explanation: 'PUT is typically used to update an existing resource. PATCH can also be used for partial updates.',
    category: 'Web Fundamentals'
  }
]

type QuizState = 'question' | 'correct' | 'incorrect'

export default function QuickQuiz() {
  const [currentQuestion, setCurrentQuestion] = useState<Question>(questions[0])
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [quizState, setQuizState] = useState<QuizState>('question')
  const [score, setScore] = useState({ correct: 0, total: 0 })
  const [isShaking, setIsShaking] = useState(false)

  useEffect(() => {
    // Load score from localStorage
    const stored = localStorage.getItem('quizScore')
    if (stored) {
      setScore(JSON.parse(stored))
    }
    
    // Get a random question
    const randomIndex = Math.floor(Math.random() * questions.length)
    setCurrentQuestion(questions[randomIndex])
  }, [])

  const handleAnswer = (index: number) => {
    if (quizState !== 'question') return
    
    setSelectedAnswer(index)
    const isCorrect = index === currentQuestion.correctIndex
    
    const newScore = {
      correct: score.correct + (isCorrect ? 1 : 0),
      total: score.total + 1
    }
    setScore(newScore)
    localStorage.setItem('quizScore', JSON.stringify(newScore))
    
    if (isCorrect) {
      setQuizState('correct')
    } else {
      setQuizState('incorrect')
      setIsShaking(true)
      setTimeout(() => setIsShaking(false), 500)
    }
  }

  const nextQuestion = () => {
    const currentIndex = questions.findIndex(q => q.question === currentQuestion.question)
    const nextIndex = (currentIndex + 1) % questions.length
    setCurrentQuestion(questions[nextIndex])
    setSelectedAnswer(null)
    setQuizState('question')
  }

  const getOptionStyle = (index: number): string => {
    if (quizState === 'question') {
      return 'bg-navy-800 hover:bg-navy-700 border-navy-700 hover:border-primary-500'
    }
    if (index === currentQuestion.correctIndex) {
      return 'bg-green-500/20 border-green-500 text-green-400'
    }
    if (index === selectedAnswer && quizState === 'incorrect') {
      return 'bg-red-500/20 border-red-500 text-red-400'
    }
    return 'bg-navy-800 border-navy-700 opacity-50'
  }

  const accuracy = score.total > 0 ? Math.round((score.correct / score.total) * 100) : 0

  return (
    <div className={`card p-6 ${isShaking ? 'animate-shake' : ''}`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🧩</span>
          <div>
            <span className="text-xs text-primary-400 font-medium uppercase tracking-wider">
              Quick Quiz
            </span>
            <h3 className="text-sm font-semibold text-white">{currentQuestion.category}</h3>
          </div>
        </div>
        <div className="text-right">
          <div className="text-xs text-navy-400">Accuracy</div>
          <div className="text-lg font-bold text-primary-400">{accuracy}%</div>
        </div>
      </div>

      <p className="text-white font-medium mb-4 text-sm leading-relaxed">
        {currentQuestion.question}
      </p>

      <div className="space-y-2">
        {currentQuestion.options.map((option, index) => (
          <button
            key={index}
            onClick={() => handleAnswer(index)}
            disabled={quizState !== 'question'}
            className={`w-full text-left px-4 py-2.5 rounded-lg border transition-all duration-200 text-sm ${getOptionStyle(index)}`}
          >
            <span className="flex items-center gap-3">
              <span className="w-6 h-6 flex items-center justify-center rounded-full bg-navy-900/50 text-xs font-medium">
                {String.fromCharCode(65 + index)}
              </span>
              {option}
            </span>
          </button>
        ))}
      </div>

      {/* Feedback section */}
      {quizState !== 'question' && (
        <div className={`mt-4 p-4 rounded-lg ${quizState === 'correct' ? 'bg-green-500/10 border border-green-500/20' : 'bg-red-500/10 border border-red-500/20'}`}>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xl">{quizState === 'correct' ? '✅' : '❌'}</span>
            <span className={`font-semibold ${quizState === 'correct' ? 'text-green-400' : 'text-red-400'}`}>
              {quizState === 'correct' ? 'Correct!' : 'Not quite!'}
            </span>
          </div>
          <p className="text-navy-300 text-sm">{currentQuestion.explanation}</p>
          <button
            onClick={nextQuestion}
            className="mt-3 w-full btn-primary text-sm py-2"
          >
            Next Question →
          </button>
        </div>
      )}

      {/* Score footer */}
      <div className="mt-4 pt-4 border-t border-navy-800 flex justify-between text-xs text-navy-400">
        <span>{score.correct} correct</span>
        <span>{score.total} answered</span>
      </div>
    </div>
  )
}