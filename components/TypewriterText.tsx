'use client'

import { useState, useEffect } from 'react'

interface TypewriterTextProps {
  words: string[]
  className?: string
  typingSpeed?: number
  deletingSpeed?: number
  pauseTime?: number
}

export default function TypewriterText({
  words,
  className = '',
  typingSpeed = 100,
  deletingSpeed = 50,
  pauseTime = 2000
}: TypewriterTextProps) {
  const [currentWordIndex, setCurrentWordIndex] = useState(0)
  const [currentText, setCurrentText] = useState('')
  const [isDeleting, setIsDeleting] = useState(false)
  const [isPaused, setIsPaused] = useState(false)

  useEffect(() => {
    const currentWord = words[currentWordIndex]
    
    if (!currentWord) return

    let timeout: NodeJS.Timeout

    if (isPaused) {
      timeout = setTimeout(() => {
        setIsPaused(false)
        setIsDeleting(true)
      }, pauseTime)
    } else if (isDeleting) {
      if (currentText === '') {
        setIsDeleting(false)
        setCurrentWordIndex((prev) => (prev + 1) % words.length)
      } else {
        timeout = setTimeout(() => {
          setCurrentText(currentWord.substring(0, currentText.length - 1))
        }, deletingSpeed)
      }
    } else {
      if (currentText === currentWord) {
        setIsPaused(true)
      } else {
        timeout = setTimeout(() => {
          setCurrentText(currentWord.substring(0, currentText.length + 1))
        }, typingSpeed)
      }
    }

    return () => clearTimeout(timeout)
  }, [currentText, isDeleting, isPaused, currentWordIndex, words, typingSpeed, deletingSpeed, pauseTime])

  return (
    <span className={className}>
      {' '}{currentText}
      <span className="animate-blink">|</span>
    </span>
  )
}