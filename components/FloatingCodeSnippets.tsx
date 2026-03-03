'use client'

import { useEffect, useState } from 'react'

const codeSnippets = [
  { code: 'const learn = () => {}', color: 'text-blue-400', delay: 0 },
  { code: 'function code() {}', color: 'text-green-400', delay: 2 },
  { code: '<Component />', color: 'text-purple-400', delay: 4 },
  { code: 'import React from', color: 'text-yellow-400', delay: 1 },
  { code: 'export default', color: 'text-pink-400', delay: 3 },
  { code: 'async/await', color: 'text-cyan-400', delay: 5 },
  { code: '.map()', color: 'text-orange-400', delay: 2.5 },
  { code: 'npm install', color: 'text-red-400', delay: 1.5 },
  { code: 'git commit', color: 'text-emerald-400', delay: 4.5 },
  { code: 'useState()', color: 'text-indigo-400', delay: 3.5 },
]

interface Snippet {
  id: number
  code: string
  color: string
  x: number
  y: number
  size: number
  duration: number
  delay: number
}

export default function FloatingCodeSnippets() {
  const [snippets, setSnippets] = useState<Snippet[]>([])
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const generatedSnippets = codeSnippets.map((snippet, index) => ({
      id: index,
      code: snippet.code,
      color: snippet.color,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: 0.6 + Math.random() * 0.4,
      duration: 15 + Math.random() * 10,
      delay: snippet.delay,
    }))
    setSnippets(generatedSnippets)
  }, [])

  if (!mounted) return null

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {snippets.map((snippet) => (
        <div
          key={snippet.id}
          className={`absolute font-mono text-sm opacity-20 ${snippet.color} floating-code`}
          style={{
            left: `${snippet.x}%`,
            top: `${snippet.y}%`,
            fontSize: `${snippet.size}rem`,
            animationDuration: `${snippet.duration}s`,
            animationDelay: `${snippet.delay}s`,
          }}
        >
          {snippet.code}
        </div>
      ))}
    </div>
  )
}