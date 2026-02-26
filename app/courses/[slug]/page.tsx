// app/courses/[slug]/page.tsx
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getCourseBySlug, getCourses } from '@/lib/cosmic'
import LessonList from '@/components/LessonList'
import MarkdownContent from '@/components/MarkdownContent'
import type { Metadata } from 'next'
import CourseViewTracker from '@/components/CourseViewTracker'

interface CoursePageProps {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  const courses = await getCourses()
  return courses.map((course) => ({
    slug: course.slug,
  }))
}

export async function generateMetadata({ params }: CoursePageProps): Promise<Metadata> {
  const { slug } = await params
  const course = await getCourseBySlug(slug)
  
  if (!course) {
    return { title: 'Course Not Found - LearnHub' }
  }

  return {
    title: `${course.metadata?.seo_title || course.metadata?.title || course.title} - LearnHub`,
    description: course.metadata?.seo_description || course.metadata?.tagline || '',
  }
}

export default async function CoursePage({ params }: CoursePageProps) {
  const { slug } = await params
  const course = await getCourseBySlug(slug)

  if (!course) {
    notFound()
  }

  const { metadata } = course
  const instructors = metadata?.instructors || []
  const categories = metadata?.categories || []
  const lessons = metadata?.lessons || []
  const difficulty = metadata?.difficulty?.value || 'Beginner'

  // Sort lessons by order
  const sortedLessons = [...lessons].sort((a, b) => {
    const orderA = a.metadata?.order ?? 999
    const orderB = b.metadata?.order ?? 999
    return orderA - orderB
  })

  const totalMinutes = sortedLessons.reduce((sum, lesson) => {
    return sum + (lesson.metadata?.duration_minutes || 0)
  }, 0)

  const getDifficultyClass = (level: string) => {
    switch (level.toLowerCase()) {
      case 'beginner': return 'badge-beginner'
      case 'intermediate': return 'badge-intermediate'
      case 'advanced': return 'badge-advanced'
      default: return 'bg-navy-700 text-navy-200'
    }
  }

  return (
    <div className="py-12">
      {/* Track course view for Recently Viewed */}
      <CourseViewTracker 
        slug={course.slug} 
        title={metadata?.title || course.title}
        thumbnail={metadata?.thumbnail?.imgix_url}
      />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <ol className="flex items-center gap-2 text-sm">
            <li>
              <Link href="/" className="text-navy-400 hover:text-white transition-colors">
                Home
              </Link>
            </li>
            <li className="text-navy-600">/</li>
            <li>
              <Link href="/courses" className="text-navy-400 hover:text-white transition-colors">
                Courses
              </Link>
            </li>
            <li className="text-navy-600">/</li>
            <li className="text-white truncate max-w-xs">
              {metadata?.title || course.title}
            </li>
          </ol>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Course Header */}
            <div className="mb-8">
              {/* Categories */}
              {categories.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {categories.map((cat) => (
                    <Link
                      key={cat.id}
                      href={`/categories/${cat.slug}`}
                      className="text-sm text-primary-400 hover:text-primary-300 transition-colors"
                    >
                      {cat.metadata?.icon} {cat.metadata?.name || cat.title}
                    </Link>
                  ))}
                </div>
              )}

              <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                {metadata?.title || course.title}
              </h1>

              {metadata?.tagline && (
                <p className="text-xl text-navy-300 mb-6">{metadata.tagline}</p>
              )}

              {/* Meta Info */}
              <div className="flex flex-wrap items-center gap-4">
                <span className={`badge ${getDifficultyClass(difficulty)}`}>
                  {difficulty}
                </span>
                {metadata?.is_free ? (
                  <span className="badge badge-free">Free</span>
                ) : metadata?.price ? (
                  <span className="text-2xl font-bold text-white">${metadata.price}</span>
                ) : null}
                {totalMinutes > 0 && (
                  <span className="text-navy-400">
                    🕐 {Math.round(totalMinutes / 60)}h {totalMinutes % 60}m total
                  </span>
                )}
                <span className="text-navy-400">
                  📖 {sortedLessons.length} {sortedLessons.length === 1 ? 'lesson' : 'lessons'}
                </span>
              </div>
            </div>

            {/* Course Thumbnail */}
            {metadata?.thumbnail?.imgix_url && (
              <div className="mb-8 rounded-2xl overflow-hidden">
                <img
                  src={`${metadata.thumbnail.imgix_url}?w=1200&h=600&fit=crop&auto=format,compress`}
                  alt={metadata?.title || course.title}
                  className="w-full aspect-video object-cover"
                />
              </div>
            )}

            {/* Course Description */}
            {metadata?.description && (
              <div className="card p-8 mb-8">
                <h2 className="text-xl font-bold text-white mb-4">About This Course</h2>
                <MarkdownContent content={metadata.description} />
              </div>
            )}

            {/* Lessons */}
            {sortedLessons.length > 0 && (
              <div className="card p-8">
                <h2 className="text-xl font-bold text-white mb-6">
                  Course Content
                  <span className="text-sm font-normal text-navy-400 ml-2">
                    ({sortedLessons.length} {sortedLessons.length === 1 ? 'lesson' : 'lessons'})
                  </span>
                </h2>
                <LessonList lessons={sortedLessons} courseSlug={course.slug} />
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-8 space-y-6">
              {/* CTA Card */}
              <div className="card p-6">
                {sortedLessons.length > 0 && sortedLessons[0] && (
                  <Link
                    href={`/courses/${course.slug}/lessons/${sortedLessons[0].slug}`}
                    className="btn-primary w-full text-center mb-4"
                  >
                    Start Learning
                  </Link>
                )}
                
                <div className="space-y-3 text-sm">
                  <div className="flex items-center justify-between text-navy-300">
                    <span>Lessons</span>
                    <span className="text-white">{sortedLessons.length}</span>
                  </div>
                  <div className="flex items-center justify-between text-navy-300">
                    <span>Duration</span>
                    <span className="text-white">
                      {metadata?.estimated_hours ? `${metadata.estimated_hours}h` : `${Math.round(totalMinutes / 60)}h ${totalMinutes % 60}m`}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-navy-300">
                    <span>Level</span>
                    <span className="text-white">{difficulty}</span>
                  </div>
                </div>
              </div>

              {/* Instructors */}
              {instructors.length > 0 && (
                <div className="card p-6">
                  <h3 className="font-semibold text-white mb-4">
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
                          <div className="w-12 h-12 rounded-full bg-navy-700 flex items-center justify-center text-lg">
                            👤
                          </div>
                        )}
                        <div>
                          <div className="font-medium text-white group-hover:text-primary-400 transition-colors">
                            {instructor.metadata?.name || instructor.title}
                          </div>
                          {instructor.metadata?.credentials && (
                            <div className="text-xs text-navy-400 line-clamp-1">
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
        </div>
      </div>
    </div>
  )
}