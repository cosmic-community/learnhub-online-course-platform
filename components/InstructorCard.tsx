import Link from 'next/link'
import type { Instructor } from '@/types'

interface InstructorCardProps {
  instructor: Instructor
}

export default function InstructorCard({ instructor }: InstructorCardProps) {
  const { metadata } = instructor

  return (
    <Link href={`/instructors/${instructor.slug}`} className="card group block">
      <div className="p-6">
        <div className="flex items-start gap-4">
          {/* Avatar */}
          <div className="relative flex-shrink-0">
            {metadata?.photo?.imgix_url ? (
              <img
                src={`${metadata.photo.imgix_url}?w=160&h=160&fit=crop&auto=format,compress`}
                alt={metadata?.name || instructor.title}
                className="w-20 h-20 rounded-full object-cover ring-4 ring-navy-700 group-hover:ring-primary-500/50 transition-all duration-300"
              />
            ) : (
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-2xl text-white ring-4 ring-navy-700 group-hover:ring-primary-500/50 transition-all duration-300">
                👨‍🏫
              </div>
            )}
            {/* Online indicator */}
            <div className="absolute bottom-1 right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-navy-900" />
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-white group-hover:text-primary-400 transition-colors truncate">
              {metadata?.name || instructor.title}
            </h3>
            {metadata?.credentials && (
              <p className="text-sm text-primary-400 line-clamp-1 mt-0.5">
                {metadata.credentials}
              </p>
            )}
            {metadata?.bio && (
              <p className="text-navy-400 text-sm mt-2 line-clamp-2">
                {metadata.bio}
              </p>
            )}
          </div>
        </div>

        {/* View Profile Link */}
        <div className="mt-4 pt-4 border-t border-navy-800 flex items-center justify-between">
          <span className="text-sm text-navy-400">View Profile</span>
          <span className="w-8 h-8 rounded-full bg-navy-800 group-hover:bg-primary-500/20 flex items-center justify-center transition-colors">
            <svg className="w-4 h-4 text-navy-400 group-hover:text-primary-400 transform group-hover:translate-x-0.5 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </span>
        </div>
      </div>
    </Link>
  )
}