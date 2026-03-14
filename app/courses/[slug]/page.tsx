// app/courses/[slug]/page.tsx
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getCourseBySlug, getCourses } from '@/lib/cosmic'
import type { Metadata } from 'next'
import { marked } from 'marked'
import CourseViewTracker from '@/components/CourseViewTracker'

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  const courses = await getCourses()
  return courses.map((course) => ({
    slug: course.slug,
  }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const course = await getCourseBySlug(slug)
  
  if (!course) {
    return { title: 'Course Not Found' }
  }

  return {
    title: `${course.metadata?.seo_title || course.metadata?.title || course.title} - LearnHub`,
    description: course.metadata?.seo_description || course.metadata?.tagline,
  }
}

export default async function CoursePage({ params }: PageProps) {
  const { slug } = await params
  const course = await getCourseBySlug(slug)

  if (!course) {
    notFound()
  }

  const { metadata } = course
  const lessons = metadata?.lessons || []
  const instructors = metadata?.instructors || []
  const categories = metadata?.categories || []

  // Get difficulty badge class
  const getDifficultyClass = (difficulty: string | { key?: string; value?: string } | undefined) => {
    const value = typeof difficulty === 'object' ? difficulty?.value?.toLowerCase() : difficulty?.toLowerCase()
    switch (value) {
      case 'beginner': return 'badge-beginner'
      case 'intermediate': return 'badge-intermediate'
      case 'advanced': return 'badge-advanced'
      default: return 'bg-navy-700 text-navy-200'
    }
  }

  const getDifficultyLabel = (difficulty: string | { key?: string; value?: string } | undefined) => {
    if (typeof difficulty === 'object') {
      return difficulty?.value || 'Unknown'
    }
    return difficulty || 'Unknown'
  }

  // Calculate total duration
  const totalMinutes = lessons.reduce((acc, lesson) => acc + (lesson.metadata?.duration_minutes || 0), 0)
  const hours = Math.floor(totalMinutes / 60)
  const minutes = totalMinutes % 60

  return (
    <div className="py-12">
      {/* Track course view for "Continue Learning" feature */}
      <CourseViewTracker courseSlug={slug} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <ol className="flex items-center gap-2 text-sm text-navy-400">
            <li><Link href="/" className="hover:text-primary-400">Home</Link></li>
            <li>/</li>
            <li><Link href="/courses" className="hover:text-primary-400">Courses</Link></li>
            <li>/</li>
            <li className="text-navy-200">{metadata?.title || course.title}</li>
          </ol>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Hero */}
            <div className="mb-8">
              {metadata?.thumbnail?.imgix_url && (
                <img
                  src={`${metadata.thumbnail.imgix_url}?w=1600&h=600&fit=crop&auto=format,compress`}
                  alt={metadata?.title || course.title}
                  className="w-full h-64 object-cover rounded-2xl mb-6"
                />
              )}
              
              <div className="flex flex-wrap gap-2 mb-4">
                {categories.map((category) => (
                  <Link
                    key={category.id}
                    href={`/categories/${category.slug}`}
                    className="badge bg-primary-500/20 text-primary-400 hover:bg-primary-500/30 transition-colors"
                  >
                    {category.metadata?.icon} {category.metadata?.name || category.title}
                  </Link>
                ))}
                <span className={`badge ${getDifficultyClass(metadata?.difficulty)}`}>
                  {getDifficultyLabel(metadata?.difficulty)}
                </span>
                {metadata?.is_free && (
                  <span className="badge badge-free">Free</span>
                )}
              </div>

              <h1 className="text-4xl font-bold text-white mb-4">
                {metadata?.title || course.title}
              </h1>
              
              {metadata?.tagline && (
                <p className="text-xl text-navy-300 mb-6">{metadata.tagline}</p>
              )}
            </div>

            {/* Description */}
            {metadata?.description && (
              <div className="card p-8 mb-8">
                <h2 className="text-2xl font-bold text-white mb-4">About This Course</h2>
                <div 
                  className="prose"
                  dangerouslySetInnerHTML={{ __html: marked(metadata.description) }}
                />
              </div>
            )}

            {/* Lessons */}
            {lessons.length > 0 && (
              <div className="card p-8">
                <h2 className="text-2xl font-bold text-white mb-6">
                  Course Content
                  <span className="text-sm font-normal text-navy-400 ml-3">
                    {lessons.length} lessons • {hours > 0 ? `${hours}h ` : ''}{minutes}m
                  </span>
                </h2>
                <div className="space-y-3">
                  {lessons.map((lesson, index) => (
                    <Link
                      key={lesson.id}
                      href={`/courses/${course.slug}/lessons/${lesson.slug}`}
                      className="flex items-center gap-4 p-4 rounded-xl bg-navy-800/50 hover:bg-navy-800 transition-colors group"
                    >
                      <div className="w-10 h-10 rounded-full bg-navy-700 flex items-center justify-center text-navy-300 font-semibold group-hover:bg-primary-500 group-hover:text-white transition-colors">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-white group-hover:text-primary-400 transition-colors">
                          {lesson.metadata?.title || lesson.title}
                        </h3>
                        {lesson.metadata?.description && (
                          <p className="text-sm text-navy-400 line-clamp-1">
                            {lesson.metadata.description}
                          </p>
                        )}
                      </div>
                      {lesson.metadata?.duration_minutes && (
                        <span className="text-sm text-navy-400">
                          {lesson.metadata.duration_minutes} min
                        </span>
                      )}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-8 space-y-6">
              {/* Enroll Card */}
              <div className="card p-6">
                <div className="text-center mb-6">
                  {metadata?.is_free ? (
                    <div className="text-3xl font-bold text-primary-400">Free</div>
                  ) : (
                    <div className="text-3xl font-bold text-white">
                      ${metadata?.price || 0}
                    </div>
                  )}
                </div>
                
                {lessons.length > 0 && (
                  <Link
                    href={`/courses/${course.slug}/lessons/${lessons[0]?.slug}`}
                    className="btn-primary w-full mb-4"
                  >
                    Start Learning
                  </Link>
                )}

                <div className="space-y-3 text-sm">
                  <div className="flex items-center justify-between text-navy-300">
                    <span>📚 Lessons</span>
                    <span className="text-white">{lessons.length}</span>
                  </div>
                  <div className="flex items-center justify-between text-navy-300">
                    <span>⏱️ Duration</span>
                    <span className="text-white">
                      {metadata?.estimated_hours ? `${metadata.estimated_hours} hours` : `${totalMinutes} min`}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-navy-300">
                    <span>📊 Level</span>
                    <span className="text-white">{getDifficultyLabel(metadata?.difficulty)}</span>
                  </div>
                </div>
              </div>

              {/* Instructors */}
              {instructors.length > 0 && (
                <div className="card p-6">
                  <h3 className="font-semibold text-white mb-4">Instructor{instructors.length > 1 ? 's' : ''}</h3>
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
                          <div className="w-12 h-12 rounded-full bg-navy-700 flex items-center justify-center text-2xl">
                            👨‍🏫
                          </div>
                        )}
                        <div>
                          <div className="font-semibold text-white group-hover:text-primary-400 transition-colors">
                            {instructor.metadata?.name || instructor.title}
                          </div>
                          {instructor.metadata?.credentials && (
                            <div className="text-sm text-navy-400 line-clamp-1">
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