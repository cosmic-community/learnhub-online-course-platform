// app/courses/[slug]/page.tsx
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getCourseBySlug, getCourses } from '@/lib/cosmic'
import MarkdownContent from '@/components/MarkdownContent'
import StartLearningButton from '@/components/StartLearningButton'

interface CoursePageProps {
  params: Promise<{
    slug: string
  }>
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
  const lessons = metadata?.lessons || []
  const instructors = metadata?.instructors || []
  const categories = metadata?.categories || []
  const firstLesson = lessons[0]

  const totalDuration = lessons.reduce((acc, lesson) => {
    return acc + (lesson.metadata?.duration_minutes || 0)
  }, 0)

  const difficultyValue = typeof metadata?.difficulty === 'object' 
    ? metadata.difficulty.value 
    : metadata?.difficulty

  return (
    <div>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-navy-900 to-navy-950 py-16 lg:py-24">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-500/10 via-transparent to-navy-950" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              {/* Categories */}
              {categories.length > 0 && (
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
                </div>
              )}

              <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4">
                {metadata?.title || course.title}
              </h1>

              {metadata?.tagline && (
                <p className="text-xl text-navy-300 mb-6">{metadata.tagline}</p>
              )}

              {/* Course Stats */}
              <div className="flex flex-wrap items-center gap-6 mb-8">
                {difficultyValue && (
                  <span className={`badge badge-${difficultyValue.toLowerCase()}`}>
                    {difficultyValue}
                  </span>
                )}
                {lessons.length > 0 && (
                  <span className="text-navy-400 flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                    {lessons.length} lessons
                  </span>
                )}
                {totalDuration > 0 && (
                  <span className="text-navy-400 flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {Math.round(totalDuration / 60)}h {totalDuration % 60}m
                  </span>
                )}
                {metadata?.estimated_hours && (
                  <span className="text-navy-400 flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    ~{metadata.estimated_hours} hours total
                  </span>
                )}
              </div>

              {/* Price & CTA */}
              <div className="flex flex-wrap items-center gap-4">
                {metadata?.is_free ? (
                  <span className="text-3xl font-bold text-green-400">Free</span>
                ) : metadata?.price ? (
                  <span className="text-3xl font-bold text-white">${metadata.price}</span>
                ) : null}
                
                <StartLearningButton 
                  courseSlug={slug}
                  firstLessonSlug={firstLesson?.slug}
                  className="text-lg"
                />
              </div>
            </div>

            {/* Course Thumbnail */}
            <div className="relative">
              {metadata?.thumbnail?.imgix_url && (
                <div className="relative rounded-2xl overflow-hidden shadow-2xl shadow-primary-500/10">
                  <img
                    src={`${metadata.thumbnail.imgix_url}?w=800&h=500&fit=crop&auto=format,compress`}
                    alt={metadata?.title || course.title}
                    className="w-full aspect-video object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-navy-950/80 via-transparent to-transparent" />
                  {metadata?.preview_video_url && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-16 h-16 bg-primary-500 rounded-full flex items-center justify-center shadow-lg shadow-primary-500/40 hover:scale-110 transition-transform cursor-pointer">
                        <svg className="w-6 h-6 text-white ml-1" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                        </svg>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Description */}
            {metadata?.description && (
              <div className="card p-8 mb-8">
                <h2 className="text-2xl font-bold text-white mb-6">About This Course</h2>
                <div className="prose">
                  <MarkdownContent content={metadata.description} />
                </div>
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
                      className="flex items-center gap-4 p-4 rounded-xl bg-navy-800/50 hover:bg-navy-800 transition-colors group"
                    >
                      <div className="w-10 h-10 rounded-full bg-navy-700 flex items-center justify-center text-navy-300 group-hover:bg-primary-500 group-hover:text-white transition-colors">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium text-white group-hover:text-primary-400 transition-colors">
                          {lesson.metadata?.title || lesson.title}
                        </h3>
                        {lesson.metadata?.description && (
                          <p className="text-sm text-navy-400 line-clamp-1">
                            {lesson.metadata.description}
                          </p>
                        )}
                      </div>
                      {lesson.metadata?.duration_minutes && (
                        <span className="text-sm text-navy-500">
                          {lesson.metadata.duration_minutes} min
                        </span>
                      )}
                      <svg className="w-5 h-5 text-navy-600 group-hover:text-primary-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
            {/* Instructors */}
            {instructors.length > 0 && (
              <div className="card p-6 mb-6">
                <h3 className="text-lg font-semibold text-white mb-4">
                  {instructors.length === 1 ? 'Instructor' : 'Instructors'}
                </h3>
                <div className="space-y-4">
                  {instructors.map((instructor) => (
                    <Link
                      key={instructor.id}
                      href={`/instructors/${instructor.slug}`}
                      className="flex items-center gap-4 group"
                    >
                      {instructor.metadata?.photo?.imgix_url ? (
                        <img
                          src={`${instructor.metadata.photo.imgix_url}?w=100&h=100&fit=crop&auto=format,compress`}
                          alt={instructor.metadata?.name || instructor.title}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-navy-700 flex items-center justify-center text-xl">
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

            {/* Quick Stats Card */}
            <div className="card p-6 bg-gradient-to-br from-primary-500/10 to-purple-500/10">
              <h3 className="text-lg font-semibold text-white mb-4">Track Your Progress</h3>
              <p className="text-navy-300 text-sm mb-4">
                Complete lessons to build your streak and unlock achievements!
              </p>
              <div className="flex items-center gap-2 text-2xl mb-2">
                🔥 🏆 📚 ⭐
              </div>
              <p className="text-xs text-navy-400">
                Your progress is saved automatically
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}