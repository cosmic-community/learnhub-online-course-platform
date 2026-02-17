import Link from 'next/link'
import type { Instructor } from '@/types'

interface InstructorCardProps {
  instructor: Instructor
}

export default function InstructorCard({ instructor }: InstructorCardProps) {
  const { metadata } = instructor

  return (
    <Link 
      href={`/instructors/${instructor.slug}`} 
      className="card group block p-6 text-center hover:transform hover:-translate-y-2 transition-all duration-300"
    >
      <div className="relative mx-auto w-24 h-24 mb-4">
        {/* Animated ring on hover */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-primary-500 to-primary-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-md" />
        
        {metadata?.photo ? (
          <img
            src={`${metadata.photo.imgix_url}?w=192&h=192&fit=crop&auto=format,compress`}
            alt={metadata?.name || instructor.title}
            width={96}
            height={96}
            className="relative w-24 h-24 rounded-full object-cover ring-4 ring-navy-700 group-hover:ring-primary-500/50 transition-all duration-300"
          />
        ) : (
          <div className="relative w-24 h-24 rounded-full bg-navy-700 flex items-center justify-center text-3xl ring-4 ring-navy-700 group-hover:ring-primary-500/50 transition-all duration-300">
            👨‍🏫
          </div>
        )}
      </div>
      
      <h3 className="text-lg font-semibold text-white mb-1 group-hover:text-primary-400 transition-colors">
        {metadata?.name || instructor.title}
      </h3>
      
      {metadata?.credentials && (
        <p className="text-sm text-primary-400 mb-3 line-clamp-1">
          {metadata.credentials}
        </p>
      )}
      
      {metadata?.bio && (
        <p className="text-navy-400 text-sm line-clamp-3 group-hover:text-navy-300 transition-colors">
          {metadata.bio}
        </p>
      )}
      
      <div className="mt-4 inline-flex items-center gap-1 text-sm text-primary-400 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
        <span>View Profile</span>
        <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </div>
    </Link>
  )
}