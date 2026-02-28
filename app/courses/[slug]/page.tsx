// app/courses/[slug]/page.tsx
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getCourseBySlug, getCourses } from '@/lib/cosmic'
import MarkdownRenderer from '@/components/MarkdownRenderer'
import ProgressTracker from '@/components/ProgressTracker'
import type { Metadata } from 'next'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const course = await getCourseBySlug(slug)
  
  if (!course) {
    return { title: 'Course Not Found - LearnHub' }
  }

  return {
    title: `${course.metadata?.title || course.title} - LearnHub`,
    description: course.metadata?.seo_description || course.metadata?.tagline || '',
  }
}

export async function generateStaticParams() {
  const courses = await getCourses()
  return courses.map((course) => ({
    slug: course.slug,
  }))
}

export default async function CoursePage({ params }: Props) {
  const { slug } = await params
  const course = await getCourseBySlug(slug)

  if (!course) {
    notFound()
  }

  const { metadata } = course
  const lessons = metadata?.lessons || []
  const instructors = metadata?.instructors || []
  const categories = metadata?.categories || []
  
  // Calculate total duration
  const totalMinutes = lessons.reduce((acc: number, lesson: { metadata?: { duration_minutes?: number } }) => {
    return acc + (lesson.metadata?.duration_minutes || 0)
  }, 0)
  const hours = Math.floor(totalMinutes / 60)
  const minutes = totalMinutes % 60

  return (
    <div className="py-12">
      {/* Progress Tracker - tracks when user views this course */}
      <ProgressTracker type="course" id={course.id} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <ol className="flex items-center gap-2 text-sm text-navy-400">
            <li><Link href="/" className="hover:text-white">Home</Link></li>
            <li>/</li>
            <li><Link href="/courses" className="hover:text-white">Courses</Link></li>
            <li>/</li>
            <li className="text-white">{metadata?.title || course.title}</li>
          </ol>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Course Header */}
            <div className="mb-8">
              <div className="flex flex-wrap gap-2 mb-4">
                {categories.map((category: { id: string; slug: string; metadata?: { name?: string; icon?: string } }) => (
                  <Link
                    key={category.id}
                    href={`/categories/${category.slug}`}
                    className="badge bg-navy-800 text-navy-200 hover:bg-navy-700"
                  >
                    {category.metadata?.icon} {category.metadata?.name}
                  </Link>
                ))}
                {metadata?.difficulty?.value && (
                  <span className={`badge badge-${metadata.difficulty.value.toLowerCase()}`}>
                    {metadata.difficulty.value}
                  </span>
                )}
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

              {/* Course Stats */}
              <div className="flex flex-wrap gap-6 text-navy-400">
                <div className="flex items-center gap-2">
                  <span>📚</span>
                  <span>{lessons.length} lessons</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>⏱️</span>
                  <span>
                    {hours > 0 ? `${hours}h ` : ''}{minutes > 0 ? `${minutes}m` : ''}
                    {hours === 0 && minutes === 0 ? 'Duration varies' : ''}
                  </span>
                </div>
                {metadata?.estimated_hours && (
                  <div className="flex items-center gap-2">
                    <span>📅</span>
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
                  alt={metadata.title || course.title}
                  className="w-full h-auto"
                />
              </div>
            )}

            {/* Course Description */}
            {metadata?.description && (
              <div className="card p-8 mb-8">
                <h2 className="text-2xl font-bold text-white mb-6">About This Course</h2>
                <MarkdownRenderer content={metadata.description} />
              </div>
            )}

            {/* Lessons List */}
            {lessons.length > 0 && (
              <div className="card p-8">
                <h2 className="text-2xl font-bold text-white mb-6">Course Curriculum</h2>
                <div className="space-y-3">
                  {lessons.map((lesson: { id: string; slug: string; metadata?: { title?: string; description?: string; duration_minutes?: number; order?: number } }, index: number) => (
                    <Link
                      key={lesson.id}
                      href={`/courses/${slug}/lessons/${lesson.slug}`}
                      className="block p-4 rounded-xl bg-navy-800/50 hover:bg-navy-800 transition-colors group"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-lg bg-primary-500/20 text-primary-400 flex items-center justify-center font-semibold group-hover:bg-primary-500 group-hover:text-white transition-colors">
                          {lesson.metadata?.order || index + 1}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-white group-hover:text-primary-400 transition-colors">
                            {lesson.metadata?.title || lesson.slug}
                          </h3>
                          {lesson.metadata?.description && (
                            <p className="text-navy-400 text-sm line-clamp-1">
                              {lesson.metadata.description}
                            </p>
                          )}
                        </div>
                        {lesson.metadata?.duration_minutes && (
                          <div className="text-navy-400 text-sm">
                            {lesson.metadata.duration_minutes} min
                          </div>
                        )}
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Pricing Card */}
            <div className="card p-6 mb-6 sticky top-24">
              <div className="mb-6">
                {metadata?.is_free ? (
                  <div className="text-3xl font-bold text-green-400">Free</div>
                ) : (
                  <div className="text-3xl font-bold text-white">
                    ${metadata?.price || 0}
                  </div>
                )}
              </div>

              <Link
                href={lessons.length > 0 ? `/courses/${slug}/lessons/${lessons[0]?.slug}` : '#'}
                className="btn-primary w-full mb-4 justify-center"
              >
                {metadata?.is_free ? 'Start Learning' : 'Enroll Now'}
              </Link>

              <ul className="space-y-3 text-navy-300 text-sm">
                <li className="flex items-center gap-2">
                  <span className="text-green-400">✓</span>
                  {lessons.length} video lessons
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-400">✓</span>
                  Lifetime access
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-400">✓</span>
                  Code examples included
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-400">✓</span>
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
                  {instructors.map((instructor: { id: string; slug: string; metadata?: { name?: string; photo?: { imgix_url?: string }; credentials?: string } }) => (
                    <Link
                      key={instructor.id}
                      href={`/instructors/${instructor.slug}`}
                      className="flex items-center gap-4 group"
                    >
                      {instructor.metadata?.photo?.imgix_url ? (
                        <img
                          src={`${instructor.metadata.photo.imgix_url}?w=96&h=96&fit=crop&auto=format,compress`}
                          alt={instructor.metadata.name || 'Instructor'}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-navy-700 flex items-center justify-center text-xl">
                          👨‍🏫
                        </div>
                      )}
                      <div>
                        <div className="font-semibold text-white group-hover:text-primary-400 transition-colors">
                          {instructor.metadata?.name}
                        </div>
                        {instructor.metadata?.credentials && (
                          <div className="text-navy-400 text-sm line-clamp-1">
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