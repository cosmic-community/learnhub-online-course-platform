interface ReadingTimeProps {
  content?: string
  durationMinutes?: number
  className?: string
}

export default function ReadingTime({ content, durationMinutes, className = '' }: ReadingTimeProps) {
  // Use provided duration or calculate from content
  let readTime = durationMinutes
  
  if (!readTime && content) {
    // Average reading speed: 200 words per minute
    const words = content.trim().split(/\s+/).length
    readTime = Math.max(1, Math.ceil(words / 200))
  }
  
  if (!readTime) return null
  
  return (
    <div className={`flex items-center gap-1.5 text-navy-400 ${className}`}>
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <span className="text-sm">{readTime} min read</span>
    </div>
  )
}