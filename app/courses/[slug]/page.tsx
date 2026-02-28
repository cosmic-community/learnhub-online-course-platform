// app/courses/[slug]/page.tsx
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getCourseBySlug, getCourses } from '@/lib/cosmic'
import LessonCard from '@/components/LessonCard'
import CourseViewTracker from '@/components/CourseViewTracker'
import type { Metadata } from 'next'
import type { Lesson } from '@/types'

interface CoursePageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: CoursePageProps): Promise<Metadata> {
  const { slug } = await params
  const course = await getCourseBySlug(slug)
  
  if (!course) {
    return { title: 'Course Not Found - LearnHub' }
  }
  
  return {
    title: course.metadata?.seo_title || `${course.title} - LearnHub`,
    description: course.metadata?.seo_description || course.metadata?.tagline || 'Learn with LearnHub',
  }
}

export async function generateStaticParams() {
  const courses = await getCourses()
  return courses.map((course) => ({
    slug: course.slug,
  }))
}

export default async function CoursePage({ params }: CoursePageProps) {
  const { slug } = await params
  const course = await getCourseBySlug(slug)
  
  if (!course) {
    notFound()
  }
  
  const { metadata } = course
  const lessons = (metadata?.lessons || []) as Lesson[]
  const instructors = metadata?.instructors || []
  const categories = metadata?.categories || []
  
  // Sort lessons by order
  const sortedLessons = [...lessons].sort((a, b) => {
    const orderA = a.metadata?.order ?? 999
    const orderB = b.metadata?.order ?? 999
    return orderA - orderB
  })
  
  const totalDuration = lessons.reduce((acc, lesson) => {
    return acc + (lesson.metadata?.duration_minutes || 0)
  }, 0)
  
  const getDifficultyBadgeClass = (difficulty?: string) => {
    switch (difficulty?.toLowerCase()) {
      case 'beginner': return 'badge-beginner'
      case 'intermediate': return 'badge-intermediate'
      case 'advanced': return 'badge-advanced'
      default: return 'bg-navy-700 text-navy-300'
    }
  }

  return (
    <div className="py-12">
      {/* Track this course view */}
      <CourseViewTracker 
        courseId={course.id}
        courseSlug={course.slug}
        courseTitle={course.title}
        thumbnail={metadata?.thumbnail?.imgix_url}
        difficulty={metadata?.difficulty?.value}
      />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <ol className="flex items-center gap-2 text-sm text-navy-400">
            <li>
              <Link href="/" className="hover:text-primary-400 transition-colors">Home</Link>
            </li>
            <li>/</li>
            <li>
              <Link href="/courses" className="hover:text-primary-400 transition-colors">Courses</Link>
            </li>
            <li>/</li>
            <li className="text-white truncate max-w-[200px]">{course.title}</li>
          </ol>
        </nav>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Course Header */}
            <div className="mb-8">
              <div className="flex flex-wrap items-center gap-3 mb-4">
                {metadata?.difficulty && (
                  <span className={`badge ${getDifficultyBadgeClass(metadata.difficulty.value)}`}>
                    {metadata.difficulty.value}
                  </span>
                )}
                {metadata?.is_free && (
                  <span className="badge badge-free">Free</span>
                )}
                {categories.map((cat: { id: string; slug: string; title: string }) => (
                  <Link 
                    key={cat.id} 
                    href={`/categories/${cat.slug}`}
                    className="badge bg-navy-800 text-navy-200 hover:bg-navy-700 transition-colors"
                  >
                    {cat.title}
                  </Link>
                ))}
              </div>
              
              <h1 className="text-4xl font-bold text-white mb-4">{metadata?.title || course.title}</h1>
              
              {metadata?.tagline && (
                <p className="text-xl text-navy-300 mb-6">{metadata.tagline}</p>
              )}
              
              {/* Course Stats */}
              <div className="flex flex-wrap items-center gap-6 text-navy-400">
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  <span>{lessons.length} lessons</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>{metadata?.estimated_hours || Math.ceil(totalDuration / 60)} hours</span>
                </div>
              </div>
            </div>
            
            {/* Course Thumbnail */}
            {metadata?.thumbnail && (
              <div className="relative aspect-video rounded-2xl overflow-hidden mb-8">
                <img
                  src={`${metadata.thumbnail.imgix_url}?w=1600&h=900&fit=crop&auto=format,compress`}
                  alt={course.title}
                  className="w-full h-full object-cover"
                />
                {metadata?.preview_video_url && (
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <a
                      href={metadata.preview_video_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-20 h-20 bg-white/90 hover:bg-white rounded-full flex items-center justify-center transition-colors"
                    >
                      <svg className="w-8 h-8 text-navy-900 ml-1" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </a>
                  </div>
                )}
              </div>
            )}
            
            {/* Description */}
            {metadata?.description && (
              <div className="prose mb-12">
                <h2>About This Course</h2>
                <div dangerouslySetInnerHTML={{ __html: metadata.description.replace(/\n/g, '<br />') }} />
              </div>
            )}
            
            {/* Lessons */}
            <div>
              <h2 className="text-2xl font-bold text-white mb-6">Course Content</h2>
              <div className="space-y-4">
                {sortedLessons.map((lesson, index) => (
                  <LessonCard 
                    key={lesson.id} 
                    lesson={lesson} 
                    courseSlug={slug}
                    index={index + 1}
                  />
                ))}
              </div>
              
              {lessons.length === 0 && (
                <div className="text-center py-12 bg-navy-900/30 rounded-2xl">
                  <p className="text-navy-400">No lessons available yet.</p>
                </div>
              )}
            </div>
          </div>
          
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              {/* Price Card */}
              <div className="card p-6 mb-6">
                <div className="text-center mb-6">
                  {metadata?.is_free ? (
                    <div className="text-3xl font-bold text-primary-400">Free</div>
                  ) : (
                    <div className="text-3xl font-bold text-white">
                      ${metadata?.price || 0}
                    </div>
                  )}
                </div>
                
                {sortedLessons.length > 0 && (
                  <Link
                    href={`/courses/${slug}/lessons/${sortedLessons[0]?.slug}`}
                    className="btn-primary w-full mb-4"
                  >
                    Start Learning
                  </Link>
                )}
                
                <div className="space-y-3 text-sm text-navy-300">
                  <div className="flex items-center gap-3">
                    <svg className="w-5 h-5 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>{lessons.length} lessons</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <svg className="w-5 h-5 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>{metadata?.estimated_hours || Math.ceil(totalDuration / 60)} hours of content</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <svg className="w-5 h-5 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Lifetime access</span>
                  </div>
                </div>
              </div>
              
              {/* Instructors */}
              {instructors.length > 0 && (
                <div className="card p-6">
                  <h3 className="font-semibold text-white mb-4">Instructor{instructors.length > 1 ? 's' : ''}</h3>
                  <div className="space-y-4">
                    {instructors.map((instructor: { id: string; slug: string; title: string; metadata?: { name?: string; photo?: { imgix_url: string }; credentials?: string } }) => (
                      <Link
                        key={instructor.id}
                        href={`/instructors/${instructor.slug}`}
                        className="flex items-center gap-3 group"
                      >
                        {instructor.metadata?.photo ? (
                          <img
                            src={`${instructor.metadata.photo.imgix_url}?w=96&h=96&fit=crop&auto=format,compress`}
                            alt={instructor.metadata?.name || instructor.title}
                            className="w-12 h-12 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-full bg-navy-800 flex items-center justify-center text-xl">
                            👨‍🏫
                          </div>
                        )}
                        <div>
                          <p className="font-medium text-white group-hover:text-primary-400 transition-colors">
                            {instructor.metadata?.name || instructor.title}
                          </p>
                          {instructor.metadata?.credentials && (
                            <p className="text-sm text-navy-400 line-clamp-1">
                              {instructor.metadata.credentials}
                            </p>
                          )}
                        </div>
                      </Link>
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