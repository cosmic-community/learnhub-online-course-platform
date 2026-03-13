'use client'

import { useState } from 'react'
import Link from 'next/link'
import Confetti from './Confetti'

interface CelebrationButtonProps {
  href: string
  children: React.ReactNode
  className?: string
}

export default function CelebrationButton({ href, children, className = '' }: CelebrationButtonProps) {
  const [showConfetti, setShowConfetti] = useState(false)

  const handleClick = () => {
    setShowConfetti(true)
  }

  return (
    <>
      <Confetti trigger={showConfetti} onComplete={() => setShowConfetti(false)} />
      <Link 
        href={href} 
        className={className}
        onClick={handleClick}
      >
        {children}
      </Link>
    </>
  )
}