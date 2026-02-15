import Link from 'next/link'
import { getCourses, getCategories, getInstructors } from '@/lib/cosmic'
import CourseCard from '@/components/CourseCard'
import CategoryCard from '@/components/CategoryCard'
import InstructorCard from '@/components/InstructorCard'
import AnimatedCounter from '@/components/AnimatedCounter'
import CourseSpotlight from '@/components/CourseSpotlight'
import ProgressRing from '@/components/ProgressRing'
import QuickStartPaths from '@/components/QuickStartPaths'

export default async function HomePage() {
  const [courses, categories, instructors] = await Promise.all([
    getCourses(),
    getCategories(),
    getInstructors(),
  ])

  const featuredCourses = courses.slice(0, 3)
  const spotlightCourses = courses.slice(0, 5)

  // Calculate some fun stats
  const totalLessons = courses.reduce((acc, course) => {
    return acc + (course.metadata?.lessons?.length || 0)
  }, 0)
  
  const totalHours = courses.reduce((acc, course) => {
    return acc + (course.metadata?.estimated_hours || 0)
  }, 0)

  const freeCourses = courses.filter(c => c.metadata?.is_free).length
  const freePercentage = courses.length > 0 ? Math.round((freeCourses / courses.length) * 100) : 0

  return (
    <div>
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-500/10 via-transparent to-navy-950" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-primary-500/5 rounded-full blur-3xl" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-500/10 rounded-full text-primary-400 text-sm font-medium mb-6">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary-500"></span>
              </span>
              New courses added weekly
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              Learn skills that
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-primary-600"> advance your career</span>
            </h1>
            <p className="text-xl text-navy-300 mb-8">
              Master web development, design, and more with expert-led courses. 
              Start your learning journey today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/courses" className="btn-primary text-lg">
                Browse Courses
              </Link>
              <Link href="/categories" className="btn-secondary text-lg">
                Explore Categories
              </Link>
            </div>
          </div>

          {/* Course Spotlight */}
          {spotlightCourses.length > 0 && (
            <CourseSpotlight courses={spotlightCourses} />
          )}
        </div>
      </section>

      {/* Animated Stats Section */}
      <section className="py-16 border-y border-navy-800 bg-navy-900/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <ProgressRing progress={100} size={100} strokeWidth={6} color="primary">
                <div className="text-center">
                  <AnimatedCounter end={courses.length} suffix="+" className="text-2xl font-bold text-white" />
                </div>
              </ProgressRing>
              <div className="text-navy-400 text-sm mt-3">Total Courses</div>
            </div>
            <div className="text-center">
              <ProgressRing progress={100} size={100} strokeWidth={6} color="green">
                <div className="text-center">
                  <AnimatedCounter end={totalLessons} className="text-2xl font-bold text-white" />
                </div>
              </ProgressRing>
              <div className="text-navy-400 text-sm mt-3">Video Lessons</div>
            </div>
            <div className="text-center">
              <ProgressRing progress={100} size={100} strokeWidth={6} color="yellow">
                <div className="text-center">
                  <AnimatedCounter end={totalHours} suffix="h" className="text-2xl font-bold text-white" />
                </div>
              </ProgressRing>
              <div className="text-navy-400 text-sm mt-3">Learning Hours</div>
            </div>
            <div className="text-center">
              <ProgressRing progress={freePercentage} size={100} strokeWidth={6} color="primary">
                <div className="text-center">
                  <AnimatedCounter end={freePercentage} suffix="%" className="text-2xl font-bold text-white" />
                </div>
              </ProgressRing>
              <div className="text-navy-400 text-sm mt-3">Free Content</div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Start Paths */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-2">Quick Start Your Journey</h2>
            <p className="text-navy-400">Choose a learning path that matches your goals</p>
          </div>
          <QuickStartPaths categories={categories} />
        </div>
      </section>

      {/* Featured Courses */}
      <section className="py-20 bg-navy-900/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl font-bold text-white mb-2">Featured Courses</h2>
              <p className="text-navy-400">Start learning with our most popular courses</p>
            </div>
            <Link href="/courses" className="btn-secondary hidden sm:inline-flex">
              View All Courses
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredCourses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
          
          <div className="mt-8 text-center sm:hidden">
            <Link href="/courses" className="btn-secondary">
              View All Courses
            </Link>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-2">Browse by Category</h2>
            <p className="text-navy-400">Find the perfect course for your learning goals</p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((category) => (
              <CategoryCard key={category.id} category={category} />
            ))}
          </div>
        </div>
      </section>

      {/* Instructors */}
      <section className="py-20 bg-navy-900/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-2">Meet Our Instructors</h2>
            <p className="text-navy-400">Learn from industry experts with real-world experience</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {instructors.map((instructor) => (
              <InstructorCard key={instructor.id} instructor={instructor} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="card p-12 relative overflow-hidden">
            {/* Animated background */}
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl animate-pulse" />
            </div>
            
            <div className="relative">
              <div className="text-5xl mb-6">🚀</div>
              <h2 className="text-3xl font-bold text-white mb-4">
                Ready to start learning?
              </h2>
              <p className="text-navy-300 mb-8 text-lg">
                Join thousands of students and start your journey to mastering new skills today.
              </p>
              <Link href="/courses" className="btn-primary text-lg">
                Get Started Now
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}