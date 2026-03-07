interface ReadingTimeProps {
  content: string
  className?: string
}

export default function ReadingTime({ content, className = '' }: ReadingTimeProps) {
  // Average reading speed: 200 words per minute
  const wordsPerMinute = 200
  const wordCount = content.trim().split(/\s+/).length
  const readingTime = Math.ceil(wordCount / wordsPerMinute)

  return (
    <span className={`inline-flex items-center gap-1.5 text-navy-400 ${className}`}>
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <span>{readingTime} min read</span>
    </span>
  )
}