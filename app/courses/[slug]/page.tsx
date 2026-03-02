// app/courses/[slug]/page.tsx
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getCourseBySlug, getCourses } from '@/lib/cosmic'
import { marked } from 'marked'
import LearningProgress from '@/components/LearningProgress'

export async function generateStaticParams() {
  const courses = await getCourses()
  return courses.map((course) => ({
    slug: course.slug,
  }))
}

interface CoursePageProps {
  params: Promise<{ slug: string }>
}

export default async function CoursePage({ params }: CoursePageProps) {
  const { slug } = await params
  const course = await getCourseBySlug(slug)

  if (!course) {
    notFound()
  }

  const { metadata } = course
  const lessons = metadata?.lessons || []
  const instructors = metadata?.instructors || []
  const categories = metadata?.categories || []
  const difficulty = metadata?.difficulty?.value || 'Beginner'
  const isFree = metadata?.is_free
  const price = metadata?.price
  const estimatedHours = metadata?.estimated_hours

  // Calculate total duration
  const totalMinutes = lessons.reduce((acc: number, lesson: { metadata?: { duration_minutes?: number } }) => {
    return acc + (lesson.metadata?.duration_minutes || 0)
  }, 0)
  const totalHours = Math.floor(totalMinutes / 60)
  const remainingMinutes = totalMinutes % 60

  // Parse description markdown
  const descriptionHtml = metadata?.description 
    ? marked(metadata.description) 
    : ''

  // Get lesson slugs for progress tracking
  const lessonSlugs = lessons.map((lesson: { slug: string }) => lesson.slug)

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Breadcrumb */}
      <nav className="mb-8">
        <ol className="flex items-center gap-2 text-sm text-navy-400">
          <li>
            <Link href="/" className="hover:text-primary-400 transition-colors">
              Home
            </Link>
          </li>
          <li>/</li>
          <li>
            <Link href="/courses" className="hover:text-primary-400 transition-colors">
              Courses
            </Link>
          </li>
          <li>/</li>
          <li className="text-navy-200">{metadata?.title || course.title}</li>
        </ol>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Main Content */}
        <div className="lg:col-span-2">
          {/* Course Header */}
          <div className="mb-8">
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <span className={`badge badge-${difficulty.toLowerCase()}`}>
                {difficulty}
              </span>
              {isFree && <span className="badge badge-free">Free</span>}
              {categories.map((cat: { id: string; slug: string; metadata?: { icon?: string; name?: string } }) => (
                <Link
                  key={cat.id}
                  href={`/categories/${cat.slug}`}
                  className="badge bg-navy-700 text-navy-200 hover:bg-navy-600 transition-colors"
                >
                  {cat.metadata?.icon} {cat.metadata?.name}
                </Link>
              ))}
            </div>
            <h1 className="text-4xl font-bold text-white mb-4">
              {metadata?.title || course.title}
            </h1>
            {metadata?.tagline && (
              <p className="text-xl text-navy-300 mb-6">{metadata.tagline}</p>
            )}
          </div>

          {/* Course Thumbnail */}
          {metadata?.thumbnail?.imgix_url && (
            <div className="relative aspect-video mb-8 rounded-xl overflow-hidden">
              <img
                src={`${metadata.thumbnail.imgix_url}?w=1200&h=675&fit=crop&auto=format,compress`}
                alt={metadata?.title || course.title}
                className="w-full h-full object-cover"
              />
              {metadata?.preview_video_url && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/30 group hover:bg-black/50 transition-colors cursor-pointer">
                  <div className="w-20 h-20 rounded-full bg-primary-500/90 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <svg className="w-8 h-8 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Learning Progress Tracker */}
          <LearningProgress 
            courseSlug={course.slug}
            totalLessons={lessons.length}
            lessonSlugs={lessonSlugs}
          />

          {/* Course Description */}
          {descriptionHtml && (
            <div className="card p-8 mb-8">
              <div 
                className="prose max-w-none"
                dangerouslySetInnerHTML={{ __html: descriptionHtml }}
              />
            </div>
          )}

          {/* Lessons */}
          {lessons.length > 0 && (
            <div className="card p-8">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                <span>📚</span> Course Curriculum
                <span className="text-sm font-normal text-navy-400 ml-auto">
                  {lessons.length} lessons • {totalHours > 0 ? `${totalHours}h ` : ''}{remainingMinutes}m
                </span>
              </h2>
              <div className="space-y-3">
                {lessons.map((lesson: { id: string; slug: string; metadata?: { title?: string; duration_minutes?: number; description?: string } }, index: number) => (
                  <Link
                    key={lesson.id}
                    href={`/courses/${course.slug}/lessons/${lesson.slug}`}
                    className="flex items-center gap-4 p-4 bg-navy-800/50 rounded-lg hover:bg-navy-800 transition-colors group"
                  >
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-navy-700 flex items-center justify-center text-navy-300 group-hover:bg-primary-500 group-hover:text-white transition-colors">
                      {index + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-white group-hover:text-primary-400 transition-colors truncate">
                        {lesson.metadata?.title || `Lesson ${index + 1}`}
                      </h3>
                      {lesson.metadata?.description && (
                        <p className="text-sm text-navy-400 truncate">
                          {lesson.metadata.description}
                        </p>
                      )}
                    </div>
                    {lesson.metadata?.duration_minutes && (
                      <div className="flex-shrink-0 text-sm text-navy-400">
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
            {/* Pricing Card */}
            <div className="card p-6">
              <div className="text-center mb-6">
                {isFree ? (
                  <div className="text-4xl font-bold text-green-400">Free</div>
                ) : (
                  <div className="text-4xl font-bold text-white">
                    ${price || 0}
                  </div>
                )}
              </div>
              <Link
                href={lessons.length > 0 ? `/courses/${course.slug}/lessons/${lessons[0].slug}` : '#'}
                className="btn-primary w-full text-center mb-4"
              >
                {isFree ? 'Start Learning' : 'Enroll Now'}
              </Link>
              <ul className="space-y-3 text-sm text-navy-300">
                <li className="flex items-center gap-2">
                  <span className="text-primary-400">✓</span>
                  {lessons.length} lessons
                </li>
                {estimatedHours && (
                  <li className="flex items-center gap-2">
                    <span className="text-primary-400">✓</span>
                    {estimatedHours} hours of content
                  </li>
                )}
                <li className="flex items-center gap-2">
                  <span className="text-primary-400">✓</span>
                  Lifetime access
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-primary-400">✓</span>
                  Progress tracking
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-primary-400">✓</span>
                  Certificate of completion
                </li>
              </ul>
            </div>

            {/* Instructors */}
            {instructors.length > 0 && (
              <div className="card p-6">
                <h3 className="text-lg font-semibold text-white mb-4">
                  {instructors.length === 1 ? 'Instructor' : 'Instructors'}
                </h3>
                <div className="space-y-4">
                  {instructors.map((instructor: { id: string; slug: string; metadata?: { photo?: { imgix_url?: string }; name?: string; credentials?: string } }) => (
                    <Link
                      key={instructor.id}
                      href={`/instructors/${instructor.slug}`}
                      className="flex items-center gap-4 group"
                    >
                      {instructor.metadata?.photo?.imgix_url ? (
                        <img
                          src={`${instructor.metadata.photo.imgix_url}?w=100&h=100&fit=crop&auto=format,compress`}
                          alt={instructor.metadata?.name || 'Instructor'}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-navy-700 flex items-center justify-center text-2xl">
                          👨‍🏫
                        </div>
                      )}
                      <div>
                        <div className="font-medium text-white group-hover:text-primary-400 transition-colors">
                          {instructor.metadata?.name}
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
  )
}