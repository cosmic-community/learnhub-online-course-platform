// app/courses/[slug]/page.tsx
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getCourseBySlug, getCourses } from '@/lib/cosmic'
import CourseCard from '@/components/CourseCard'
import SmartRecommendations from '@/components/SmartRecommendations'
import type { Metadata } from 'next'
import type { Lesson, Instructor, Category } from '@/types'

interface CoursePageProps {
  params: Promise<{
    slug: string
  }>
}

export async function generateMetadata({ params }: CoursePageProps): Promise<Metadata> {
  const { slug } = await params
  const course = await getCourseBySlug(slug)
  
  if (!course) {
    return {
      title: 'Course Not Found - LearnHub',
    }
  }
  
  return {
    title: `${course.metadata?.seo_title || course.metadata?.title || course.title} - LearnHub`,
    description: course.metadata?.seo_description || course.metadata?.tagline || '',
  }
}

export default async function CoursePage({ params }: CoursePageProps) {
  const { slug } = await params
  const [course, allCourses] = await Promise.all([
    getCourseBySlug(slug),
    getCourses()
  ])
  
  if (!course) {
    notFound()
  }
  
  const { metadata } = course
  const lessons = (metadata?.lessons || []) as Lesson[]
  const instructors = (metadata?.instructors || []) as Instructor[]
  const categories = (metadata?.categories || []) as Category[]
  
  // Sort lessons by order
  const sortedLessons = [...lessons].sort((a, b) => {
    const orderA = a.metadata?.order ?? 999
    const orderB = b.metadata?.order ?? 999
    return orderA - orderB
  })
  
  // Calculate total duration
  const totalMinutes = sortedLessons.reduce((acc, lesson) => {
    return acc + (lesson.metadata?.duration_minutes || 0)
  }, 0)
  const hours = Math.floor(totalMinutes / 60)
  const minutes = totalMinutes % 60
  
  const getDifficultyClass = (difficulty?: string) => {
    switch (difficulty?.toLowerCase()) {
      case 'beginner':
        return 'badge-beginner'
      case 'intermediate':
        return 'badge-intermediate'
      case 'advanced':
        return 'badge-advanced'
      default:
        return 'bg-navy-700 text-navy-200'
    }
  }
  
  return (
    <div className="py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <ol className="flex items-center gap-2 text-sm">
            <li>
              <Link href="/" className="text-navy-400 hover:text-primary-400 transition-colors">
                Home
              </Link>
            </li>
            <li className="text-navy-600">/</li>
            <li>
              <Link href="/courses" className="text-navy-400 hover:text-primary-400 transition-colors">
                Courses
              </Link>
            </li>
            <li className="text-navy-600">/</li>
            <li className="text-navy-200 truncate max-w-[200px]">
              {metadata?.title || course.title}
            </li>
          </ol>
        </nav>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Course Header */}
            <div className="mb-8">
              <div className="flex flex-wrap items-center gap-3 mb-4">
                {metadata?.difficulty?.value && (
                  <span className={`badge ${getDifficultyClass(metadata.difficulty.value)}`}>
                    {metadata.difficulty.value}
                  </span>
                )}
                {metadata?.is_free && (
                  <span className="badge badge-free">Free Course</span>
                )}
                {categories.map((cat) => (
                  <Link
                    key={cat.id}
                    href={`/categories/${cat.slug}`}
                    className="badge bg-navy-800 text-navy-200 hover:bg-navy-700 transition-colors"
                  >
                    {cat.metadata?.icon} {cat.metadata?.name || cat.title}
                  </Link>
                ))}
              </div>
              
              <h1 className="text-4xl font-bold text-white mb-4">
                {metadata?.title || course.title}
              </h1>
              
              {metadata?.tagline && (
                <p className="text-xl text-navy-300 mb-6">{metadata.tagline}</p>
              )}
              
              {/* Course Stats */}
              <div className="flex flex-wrap items-center gap-6 text-navy-400">
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                  <span>{sortedLessons.length} lessons</span>
                </div>
                {totalMinutes > 0 && (
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>
                      {hours > 0 ? `${hours}h ` : ''}{minutes > 0 ? `${minutes}m` : ''}
                    </span>
                  </div>
                )}
                {metadata?.estimated_hours && (
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                    <span>~{metadata.estimated_hours} hours total</span>
                  </div>
                )}
              </div>
            </div>
            
            {/* Course Thumbnail */}
            {metadata?.thumbnail?.imgix_url && (
              <div className="mb-8 rounded-2xl overflow-hidden">
                <img
                  src={`${metadata.thumbnail.imgix_url}?w=1200&h=600&fit=crop&auto=format,compress`}
                  alt={metadata?.title || course.title}
                  className="w-full h-auto"
                />
              </div>
            )}
            
            {/* Course Description */}
            {metadata?.description && (
              <div className="card p-8 mb-8">
                <h2 className="text-2xl font-bold text-white mb-6">About This Course</h2>
                <div className="prose max-w-none">
                  {metadata.description.split('\n').map((paragraph: string, index: number) => {
                    if (paragraph.startsWith('# ')) {
                      return <h1 key={index}>{paragraph.replace('# ', '')}</h1>
                    }
                    if (paragraph.startsWith('## ')) {
                      return <h2 key={index}>{paragraph.replace('## ', '')}</h2>
                    }
                    if (paragraph.startsWith('- ')) {
                      return <li key={index}>{paragraph.replace('- ', '')}</li>
                    }
                    if (paragraph.trim()) {
                      return <p key={index}>{paragraph}</p>
                    }
                    return null
                  })}
                </div>
              </div>
            )}
            
            {/* Curriculum */}
            {sortedLessons.length > 0 && (
              <div className="card p-8">
                <h2 className="text-2xl font-bold text-white mb-6">Curriculum</h2>
                <div className="space-y-3">
                  {sortedLessons.map((lesson, index) => (
                    <Link
                      key={lesson.id}
                      href={`/courses/${course.slug}/lessons/${lesson.slug}`}
                      className="flex items-center gap-4 p-4 bg-navy-800/50 rounded-xl hover:bg-navy-800 transition-colors group"
                    >
                      <div className="w-10 h-10 bg-primary-500/20 text-primary-400 rounded-lg flex items-center justify-center font-semibold flex-shrink-0">
                        {index + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-white font-medium group-hover:text-primary-400 transition-colors truncate">
                          {lesson.metadata?.title || lesson.title}
                        </h3>
                        {lesson.metadata?.description && (
                          <p className="text-navy-400 text-sm truncate mt-1">
                            {lesson.metadata.description}
                          </p>
                        )}
                      </div>
                      {lesson.metadata?.duration_minutes && (
                        <div className="text-navy-400 text-sm flex-shrink-0">
                          {lesson.metadata.duration_minutes} min
                        </div>
                      )}
                      <svg 
                        className="w-5 h-5 text-navy-500 group-hover:text-primary-400 group-hover:translate-x-1 transition-all flex-shrink-0" 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Pricing Card */}
            <div className="card p-6 mb-8 sticky top-24">
              <div className="text-center mb-6">
                {metadata?.is_free ? (
                  <div className="text-4xl font-bold text-primary-400">Free</div>
                ) : metadata?.price ? (
                  <div className="text-4xl font-bold text-white">${metadata.price}</div>
                ) : (
                  <div className="text-4xl font-bold text-primary-400">Free</div>
                )}
                <p className="text-navy-400 text-sm mt-1">Full lifetime access</p>
              </div>
              
              {sortedLessons.length > 0 && (
                <Link
                  href={`/courses/${course.slug}/lessons/${sortedLessons[0]?.slug}`}
                  className="btn-primary w-full mb-4"
                >
                  Start Learning
                </Link>
              )}
              
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-3 text-navy-300">
                  <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span>{sortedLessons.length} comprehensive lessons</span>
                </div>
                <div className="flex items-center gap-3 text-navy-300">
                  <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span>Learn at your own pace</span>
                </div>
                <div className="flex items-center gap-3 text-navy-300">
                  <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span>Code examples included</span>
                </div>
                <div className="flex items-center gap-3 text-navy-300">
                  <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span>Full lifetime access</span>
                </div>
              </div>
            </div>
            
            {/* Instructors */}
            {instructors.length > 0 && (
              <div className="card p-6 mb-8">
                <h3 className="text-lg font-semibold text-white mb-4">
                  {instructors.length === 1 ? 'Instructor' : 'Instructors'}
                </h3>
                <div className="space-y-4">
                  {instructors.map((instructor) => (
                    <Link
                      key={instructor.id}
                      href={`/instructors/${instructor.slug}`}
                      className="flex items-center gap-3 group"
                    >
                      {instructor.metadata?.photo?.imgix_url ? (
                        <img
                          src={`${instructor.metadata.photo.imgix_url}?w=96&h=96&fit=crop&auto=format,compress`}
                          alt={instructor.metadata?.name || instructor.title}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-12 h-12 bg-navy-700 rounded-full flex items-center justify-center">
                          <span className="text-xl">👨‍🏫</span>
                        </div>
                      )}
                      <div>
                        <div className="text-white font-medium group-hover:text-primary-400 transition-colors">
                          {instructor.metadata?.name || instructor.title}
                        </div>
                        {instructor.metadata?.credentials && (
                          <div className="text-navy-400 text-xs truncate max-w-[180px]">
                            {instructor.metadata.credentials}
                          </div>
                        )}
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Smart Recommendations at the bottom */}
        <div className="mt-16">
          <SmartRecommendations courses={allCourses} currentCourseId={course.id} />
        </div>
      </div>
    </div>
  )
}