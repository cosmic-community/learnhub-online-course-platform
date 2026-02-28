// app/courses/[slug]/page.tsx
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getCourseBySlug } from '@/lib/cosmic'
import MarkdownContent from '@/components/MarkdownContent'
import CourseProgress from '@/components/CourseProgress'
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
    return { title: 'Course Not Found - LearnHub' }
  }
  
  return {
    title: course.metadata?.seo_title || `${course.metadata?.title || course.title} - LearnHub`,
    description: course.metadata?.seo_description || course.metadata?.tagline || '',
  }
}

function getDifficultyBadgeClass(difficulty: string): string {
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

export default async function CoursePage({ params }: CoursePageProps) {
  const { slug } = await params
  const course = await getCourseBySlug(slug)
  
  if (!course) {
    notFound()
  }
  
  const { metadata } = course
  const lessons = (metadata?.lessons || []) as Lesson[]
  const instructors = (metadata?.instructors || []) as Instructor[]
  const categories = (metadata?.categories || []) as Category[]
  const difficulty = metadata?.difficulty?.value || metadata?.difficulty || 'Beginner'
  const lessonSlugs = lessons.map(l => l.slug)
  
  return (
    <div className="py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="mb-6 text-sm">
          <ol className="flex items-center gap-2 text-navy-400">
            <li>
              <Link href="/courses" className="hover:text-primary-400 transition-colors">
                Courses
              </Link>
            </li>
            <li>/</li>
            <li className="text-white">{metadata?.title || course.title}</li>
          </ol>
        </nav>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Hero Section */}
            <div className="card overflow-hidden mb-8">
              {metadata?.thumbnail?.imgix_url && (
                <div className="aspect-video relative">
                  <img
                    src={`${metadata.thumbnail.imgix_url}?w=1200&h=675&fit=crop&auto=format,compress`}
                    alt={metadata?.title || course.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-transparent to-transparent" />
                </div>
              )}
              
              <div className="p-8">
                <div className="flex flex-wrap gap-3 mb-4">
                  <span className={`badge ${getDifficultyBadgeClass(difficulty)}`}>
                    {difficulty}
                  </span>
                  {metadata?.is_free && (
                    <span className="badge badge-free">Free</span>
                  )}
                  {categories.map((cat) => (
                    <Link
                      key={cat.id}
                      href={`/categories/${cat.slug}`}
                      className="badge bg-navy-700 text-navy-200 hover:bg-navy-600"
                    >
                      {cat.metadata?.icon} {cat.metadata?.name || cat.title}
                    </Link>
                  ))}
                </div>
                
                <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                  {metadata?.title || course.title}
                </h1>
                
                {metadata?.tagline && (
                  <p className="text-xl text-navy-300 mb-6">
                    {metadata.tagline}
                  </p>
                )}
                
                <div className="flex flex-wrap gap-6 text-navy-400">
                  {metadata?.estimated_hours && (
                    <div className="flex items-center gap-2">
                      <span>⏱️</span>
                      <span>{metadata.estimated_hours} hours</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <span>📚</span>
                    <span>{lessons.length} lessons</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Description */}
            {metadata?.description && (
              <div className="card p-8 mb-8">
                <h2 className="text-2xl font-bold text-white mb-6">About This Course</h2>
                <MarkdownContent content={metadata.description} />
              </div>
            )}
            
            {/* Lessons */}
            {lessons.length > 0 && (
              <div className="card p-8">
                <h2 className="text-2xl font-bold text-white mb-6">
                  Course Content ({lessons.length} lessons)
                </h2>
                <div className="space-y-3">
                  {lessons.map((lesson, index) => (
                    <Link
                      key={lesson.id}
                      href={`/courses/${slug}/lessons/${lesson.slug}`}
                      className="flex items-center gap-4 p-4 bg-navy-800/50 hover:bg-navy-800 rounded-xl transition-colors group"
                    >
                      <div className="w-10 h-10 rounded-full bg-navy-700 flex items-center justify-center text-navy-300 font-medium group-hover:bg-primary-500 group-hover:text-white transition-colors">
                        {index + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-white group-hover:text-primary-400 transition-colors">
                          {lesson.metadata?.title || lesson.title}
                        </h3>
                        {lesson.metadata?.description && (
                          <p className="text-sm text-navy-400 line-clamp-1 mt-1">
                            {lesson.metadata.description}
                          </p>
                        )}
                      </div>
                      {lesson.metadata?.duration_minutes && (
                        <div className="text-sm text-navy-500">
                          {lesson.metadata.duration_minutes} min
                        </div>
                      )}
                      <svg className="w-5 h-5 text-navy-500 group-hover:text-primary-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
            <div className="sticky top-8 space-y-6">
              {/* Course Progress */}
              <CourseProgress 
                courseSlug={slug} 
                totalLessons={lessons.length}
                lessonSlugs={lessonSlugs}
              />
              
              {/* Enrollment Card */}
              <div className="card p-6">
                <div className="mb-6">
                  {metadata?.is_free ? (
                    <div className="text-3xl font-bold text-green-400">Free</div>
                  ) : (
                    <div className="text-3xl font-bold text-white">
                      ${metadata?.price || 0}
                    </div>
                  )}
                </div>
                
                {lessons.length > 0 && (
                  <Link
                    href={`/courses/${slug}/lessons/${lessons[0].slug}`}
                    className="btn-primary w-full mb-4 justify-center"
                  >
                    {metadata?.is_free ? 'Start Learning' : 'Enroll Now'}
                  </Link>
                )}
                
                <ul className="space-y-3 text-sm text-navy-300">
                  <li className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Full lifetime access
                  </li>
                  <li className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Access on mobile and desktop
                  </li>
                  <li className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Certificate of completion
                  </li>
                </ul>
              </div>
              
              {/* Instructors */}
              {instructors.length > 0 && (
                <div className="card p-6">
                  <h3 className="font-semibold text-white mb-4">
                    {instructors.length === 1 ? 'Instructor' : 'Instructors'}
                  </h3>
                  <div className="space-y-4">
                    {instructors.map((instructor) => (
                      <div key={instructor.id} className="flex items-center gap-3">
                        {instructor.metadata?.photo?.imgix_url ? (
                          <img
                            src={`${instructor.metadata.photo.imgix_url}?w=80&h=80&fit=crop&auto=format,compress`}
                            alt={instructor.metadata?.name || instructor.title}
                            className="w-12 h-12 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-full bg-navy-700 flex items-center justify-center">
                            <span className="text-xl">👨‍🏫</span>
                          </div>
                        )}
                        <div>
                          <div className="font-medium text-white">
                            {instructor.metadata?.name || instructor.title}
                          </div>
                          {instructor.metadata?.credentials && (
                            <div className="text-xs text-navy-400 line-clamp-1">
                              {instructor.metadata.credentials}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}