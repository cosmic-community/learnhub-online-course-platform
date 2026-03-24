// app/courses/[slug]/page.tsx
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getCourseBySlug, getCourses } from '@/lib/cosmic'
import ReactMarkdown from 'react-markdown'
import LearningProgress from '@/components/LearningProgress'

// Generate static paths for all courses
export async function generateStaticParams() {
  const courses = await getCourses()
  return courses.map((course) => ({
    slug: course.slug,
  }))
}

// Generate metadata for SEO
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const course = await getCourseBySlug(slug)
  
  if (!course) {
    return {
      title: 'Course Not Found - LearnHub',
    }
  }

  return {
    title: course.metadata?.seo_title || `${course.metadata?.title || course.title} - LearnHub`,
    description: course.metadata?.seo_description || course.metadata?.tagline || '',
  }
}

export default async function CoursePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const course = await getCourseBySlug(slug)

  if (!course) {
    notFound()
  }

  const { metadata } = course
  const lessons = metadata?.lessons || []
  const instructors = metadata?.instructors || []
  const categories = metadata?.categories || []
  const difficulty = typeof metadata?.difficulty === 'object' 
    ? metadata.difficulty.value 
    : metadata?.difficulty || 'beginner'

  // Calculate total duration
  const totalMinutes = lessons.reduce((acc: number, lesson: { metadata?: { duration_minutes?: number } }) => {
    return acc + (lesson.metadata?.duration_minutes || 0)
  }, 0)
  const hours = Math.floor(totalMinutes / 60)
  const minutes = totalMinutes % 60

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-navy-400 mb-8">
        <Link href="/" className="hover:text-white transition-colors">Home</Link>
        <span>/</span>
        <Link href="/courses" className="hover:text-white transition-colors">Courses</Link>
        <span>/</span>
        <span className="text-navy-200">{metadata?.title || course.title}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Main Content */}
        <div className="lg:col-span-2">
          {/* Course Header */}
          <div className="mb-8">
            {/* Categories */}
            {categories.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {categories.map((category: { id: string; slug: string; metadata?: { icon?: string; name?: string }; title: string }) => (
                  <Link
                    key={category.id}
                    href={`/categories/${category.slug}`}
                    className="badge bg-navy-800 text-navy-300 hover:bg-navy-700 transition-colors"
                  >
                    {category.metadata?.icon} {category.metadata?.name || category.title}
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
            <div className="flex flex-wrap items-center gap-4 text-sm">
              <span className={`badge badge-${difficulty.toLowerCase()}`}>
                {difficulty}
              </span>
              {metadata?.estimated_hours && (
                <span className="text-navy-400">
                  ⏱️ {metadata.estimated_hours} hours
                </span>
              )}
              {lessons.length > 0 && (
                <span className="text-navy-400">
                  📖 {lessons.length} lessons
                </span>
              )}
              {totalMinutes > 0 && (
                <span className="text-navy-400">
                  🎬 {hours > 0 ? `${hours}h ` : ''}{minutes > 0 ? `${minutes}m` : ''} total
                </span>
              )}
            </div>
          </div>

          {/* Course Thumbnail */}
          {metadata?.thumbnail?.imgix_url && (
            <div className="mb-8 rounded-2xl overflow-hidden">
              <img
                src={`${metadata.thumbnail.imgix_url}?w=1600&h=900&fit=crop&auto=format,compress`}
                alt={metadata.title || course.title}
                className="w-full aspect-video object-cover"
              />
            </div>
          )}

          {/* Course Description */}
          {metadata?.description && (
            <div className="prose max-w-none mb-12">
              <ReactMarkdown>{metadata.description}</ReactMarkdown>
            </div>
          )}

          {/* Lessons List */}
          {lessons.length > 0 && (
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-white mb-6">Course Content</h2>
              <div className="space-y-3">
                {lessons
                  .sort((a: { metadata?: { order?: number } }, b: { metadata?: { order?: number } }) => 
                    (a.metadata?.order ?? 999) - (b.metadata?.order ?? 999)
                  )
                  .map((lesson: { id: string; slug: string; metadata?: { title?: string; duration_minutes?: number; order?: number }; title: string }, index: number) => (
                    <Link
                      key={lesson.id}
                      href={`/courses/${course.slug}/lessons/${lesson.slug}`}
                      className="card flex items-center gap-4 p-4 group"
                    >
                      <div className="w-10 h-10 rounded-lg bg-navy-800 flex items-center justify-center text-navy-400 group-hover:bg-primary-500 group-hover:text-white transition-colors">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium text-white group-hover:text-primary-400 transition-colors">
                          {lesson.metadata?.title || lesson.title}
                        </h3>
                      </div>
                      {lesson.metadata?.duration_minutes && (
                        <span className="text-sm text-navy-400">
                          {lesson.metadata.duration_minutes} min
                        </span>
                      )}
                      <svg className="w-5 h-5 text-navy-400 group-hover:text-primary-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
          <div className="sticky top-24 space-y-6">
            {/* Learning Progress Tracker */}
            <LearningProgress 
              totalLessons={lessons.length}
              courseSlug={course.slug}
              courseName={metadata?.title || course.title}
            />
            
            {/* Course Info Card */}
            <div className="card p-6">
              <div className="space-y-4">
                {/* Price */}
                <div className="text-center pb-4 border-b border-navy-800">
                  {metadata?.is_free ? (
                    <span className="text-3xl font-bold text-green-400">Free</span>
                  ) : (
                    <span className="text-3xl font-bold text-white">
                      ${metadata?.price || 0}
                    </span>
                  )}
                </div>

                {/* Start Learning Button */}
                {lessons.length > 0 && (
                  <Link
                    href={`/courses/${course.slug}/lessons/${lessons[0].slug}`}
                    className="btn-primary w-full justify-center"
                  >
                    Start Learning
                  </Link>
                )}

                {/* Course Stats */}
                <div className="space-y-3 pt-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-navy-400">Difficulty</span>
                    <span className={`badge badge-${difficulty.toLowerCase()}`}>
                      {difficulty}
                    </span>
                  </div>
                  {metadata?.estimated_hours && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-navy-400">Duration</span>
                      <span className="text-white">{metadata.estimated_hours} hours</span>
                    </div>
                  )}
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-navy-400">Lessons</span>
                    <span className="text-white">{lessons.length}</span>
                  </div>
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
                  {instructors.map((instructor: { id: string; slug: string; metadata?: { name?: string; photo?: { imgix_url?: string }; credentials?: string }; title: string }) => (
                    <div key={instructor.id} className="flex items-center gap-3">
                      {instructor.metadata?.photo?.imgix_url ? (
                        <img
                          src={`${instructor.metadata.photo.imgix_url}?w=96&h=96&fit=crop&auto=format,compress`}
                          alt={instructor.metadata.name || instructor.title}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-navy-800 flex items-center justify-center text-navy-400">
                          👤
                        </div>
                      )}
                      <div>
                        <Link
                          href={`/instructors/${instructor.slug}`}
                          className="font-medium text-white hover:text-primary-400 transition-colors"
                        >
                          {instructor.metadata?.name || instructor.title}
                        </Link>
                        {instructor.metadata?.credentials && (
                          <p className="text-xs text-navy-400 line-clamp-1">
                            {instructor.metadata.credentials}
                          </p>
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
  )
}