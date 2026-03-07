'use client'

import { useEffect } from 'react'

interface JourneyTrackerProps {
  slug: string
  title: string
  type: 'course' | 'lesson' | 'category'
}

interface ViewedItem {
  slug: string
  title: string
  type: 'course' | 'lesson' | 'category'
  timestamp: number
}

export default function JourneyTracker({ slug, title, type }: JourneyTrackerProps) {
  useEffect(() => {
    // Load existing items
    const stored = localStorage.getItem('learnhub-journey')
    const items: ViewedItem[] = stored ? JSON.parse(stored) : []
    
    // Check if already tracked
    const exists = items.find(item => item.slug === slug && item.type === type)
    if (!exists) {
      const newItem: ViewedItem = {
        slug,
        title,
        type,
        timestamp: Date.now()
      }
      const updatedItems = [newItem, ...items].slice(0, 20)
      localStorage.setItem('learnhub-journey', JSON.stringify(updatedItems))
      
      // Dispatch custom event for the LearningJourney component to pick up
      window.dispatchEvent(new CustomEvent('journey-update', { detail: updatedItems }))
    }
  }, [slug, title, type])

  return null // This component doesn't render anything
}