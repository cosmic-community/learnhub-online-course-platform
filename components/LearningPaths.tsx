import Link from 'next/link'
import type { Category, Course } from '@/types'

interface LearningPathsProps {
  categories: Category[]
  courses: Course[]
}

export default function LearningPaths({ categories, courses }: LearningPathsProps) {
  // Get top 3 categories with their course counts
  const pathsWithCounts = categories.slice(0, 3).map(category => {
    const categoryId = category.id
    const coursesInCategory = courses.filter(course => 
      course.metadata?.categories?.some(cat => cat.id === categoryId)
    )
    
    // Get difficulty distribution
    const beginnerCount = coursesInCategory.filter(c => 
      c.metadata?.difficulty?.value === 'Beginner'
    ).length
    const intermediateCount = coursesInCategory.filter(c => 
      c.metadata?.difficulty?.value === 'Intermediate'
    ).length
    const advancedCount = coursesInCategory.filter(c => 
      c.metadata?.difficulty?.value === 'Advanced'
    ).length

    return {
      category,
      courseCount: coursesInCategory.length,
      beginnerCount,
      intermediateCount,
      advancedCount,
    }
  }).filter(p => p.courseCount > 0)

  if (pathsWithCounts.length === 0) return null

  return (
    <section className="py-16 bg-navy-900/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-navy-800/50 border border-navy-700 rounded-full text-navy-300 text-sm font-medium mb-4">
            <span className="text-lg">🗺️</span>
            Structured Learning
          </div>
          <h2 className="text-3xl font-bold text-white mb-2">Learning Paths</h2>
          <p className="text-navy-400 max-w-2xl mx-auto">
            Follow a structured path from beginner to advanced. Each path is designed to take you from zero to job-ready.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {pathsWithCounts.map((path, index) => (
            <Link 
              key={path.category.id}
              href={`/categories/${path.category.slug}`}
              className="card p-6 group relative overflow-hidden hover:border-primary-500/50 transition-all"
            >
              {/* Background gradient on hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              
              <div className="relative">
                {/* Category Icon */}
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-navy-800 rounded-xl flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                    {path.category.metadata?.icon || '📚'}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white group-hover:text-primary-400 transition-colors">
                      {path.category.metadata?.name || path.category.title}
                    </h3>
                    <p className="text-navy-400 text-sm">{path.courseCount} courses</p>
                  </div>
                </div>
                
                {/* Progress Path Visualization */}
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex-1 h-2 bg-navy-800 rounded-full overflow-hidden">
                    <div className="h-full flex">
                      {path.beginnerCount > 0 && (
                        <div 
                          className="bg-green-500 h-full"
                          style={{ width: `${(path.beginnerCount / path.courseCount) * 100}%` }}
                        />
                      )}
                      {path.intermediateCount > 0 && (
                        <div 
                          className="bg-yellow-500 h-full"
                          style={{ width: `${(path.intermediateCount / path.courseCount) * 100}%` }}
                        />
                      )}
                      {path.advancedCount > 0 && (
                        <div 
                          className="bg-red-500 h-full"
                          style={{ width: `${(path.advancedCount / path.courseCount) * 100}%` }}
                        />
                      )}
                    </div>
                  </div>
                </div>
                
                {/* Difficulty breakdown */}
                <div className="flex items-center gap-4 text-xs text-navy-400">
                  {path.beginnerCount > 0 && (
                    <span className="flex items-center gap-1">
                      <span className="w-2 h-2 bg-green-500 rounded-full" />
                      {path.beginnerCount} Beginner
                    </span>
                  )}
                  {path.intermediateCount > 0 && (
                    <span className="flex items-center gap-1">
                      <span className="w-2 h-2 bg-yellow-500 rounded-full" />
                      {path.intermediateCount} Intermediate
                    </span>
                  )}
                  {path.advancedCount > 0 && (
                    <span className="flex items-center gap-1">
                      <span className="w-2 h-2 bg-red-500 rounded-full" />
                      {path.advancedCount} Advanced
                    </span>
                  )}
                </div>
                
                {/* Arrow */}
                <div className="absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity">
                  <svg className="w-5 h-5 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}