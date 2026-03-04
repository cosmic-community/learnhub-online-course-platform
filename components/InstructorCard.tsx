import Link from 'next/link'
import type { Instructor } from '@/types'

interface InstructorCardProps {
  instructor: Instructor
}

export default function InstructorCard({ instructor }: InstructorCardProps) {
  const { metadata } = instructor

  return (
    <Link href={`/instructors/${instructor.slug}`} className="card group block p-6 text-center">
      {/* Photo */}
      <div className="relative w-24 h-24 mx-auto mb-4">
        {metadata?.photo?.imgix_url ? (
          <img
            src={`${metadata.photo.imgix_url}?w=192&h=192&fit=crop&auto=format,compress`}
            alt={metadata?.name || instructor.title}
            className="w-full h-full rounded-full object-cover ring-4 ring-navy-800 group-hover:ring-primary-500/50 transition-all duration-300"
          />
        ) : (
          <div className="w-full h-full rounded-full bg-gradient-to-br from-navy-700 to-navy-800 flex items-center justify-center ring-4 ring-navy-800 group-hover:ring-primary-500/50 transition-all duration-300">
            <span className="text-3xl">👨‍🏫</span>
          </div>
        )}
        {/* Online indicator */}
        <div className="absolute bottom-1 right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-navy-900 flex items-center justify-center">
          <span className="text-[10px]">✓</span>
        </div>
      </div>

      {/* Name */}
      <h3 className="text-lg font-semibold text-white mb-1 group-hover:text-primary-400 transition-colors">
        {metadata?.name || instructor.title}
      </h3>

      {/* Credentials */}
      {metadata?.credentials && (
        <p className="text-sm text-navy-400 mb-3 line-clamp-2">
          {metadata.credentials}
        </p>
      )}

      {/* Bio Preview */}
      {metadata?.bio && (
        <p className="text-sm text-navy-500 line-clamp-3 mb-4">
          {metadata.bio}
        </p>
      )}

      {/* View Profile Link */}
      <div className="inline-flex items-center gap-1 text-sm text-primary-400 group-hover:gap-2 transition-all">
        <span>View Profile</span>
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </div>
    </Link>
  )
}