import Link from 'next/link'
import { getCourses, getCategories, getInstructors } from '@/lib/cosmic'
import CourseCard from '@/components/CourseCard'
import CategoryCard from '@/components/CategoryCard'
import InstructorCard from '@/components/InstructorCard'
import AnimatedStats from '@/components/AnimatedStats'
import DailyTip from '@/components/DailyTip'
import QuickSearch from '@/components/QuickSearch'

export default async function HomePage() {
  const [courses, categories, instructors] = await Promise.all([
    getCourses(),
    getCategories(),
    getInstructors(),
  ])

  const featuredCourses = courses.slice(0, 3)
  
  // Calculate total lessons across all courses
  const totalLessons = courses.reduce((acc, course) => {
    return acc + (course.metadata?.lessons?.length || 0)
  }, 0)
  
  // Calculate total learning hours
  const totalHours = courses.reduce((acc, course) => {
    return acc + (course.metadata?.estimated_hours || 0)
  }, 0)

  return (
    <div>
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-500/10 via-transparent to-navy-950" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-primary-500/5 rounded-full blur-3xl" />
        
        {/* Floating particles effect */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-2 h-2 bg-primary-400/30 rounded-full animate-float" />
          <div className="absolute top-40 right-20 w-3 h-3 bg-primary-500/20 rounded-full animate-float-delayed" />
          <div className="absolute bottom-32 left-1/4 w-2 h-2 bg-primary-300/40 rounded-full animate-float" />
          <div className="absolute top-1/3 right-1/3 w-4 h-4 bg-primary-400/10 rounded-full animate-float-delayed" />
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="text-center max-w-3xl mx-auto">
            {/* Daily Learning Tip */}
            <DailyTip categories={categories} />
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              Learn skills that
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-primary-600"> advance your career</span>
            </h1>
            <p className="text-xl text-navy-300 mb-8">
              Master web development, design, and more with expert-led courses. 
              Start your learning journey today.
            </p>
            
            {/* Quick Search */}
            <QuickSearch courses={courses} />
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
              <Link href="/courses" className="btn-primary text-lg group">
                <span>Browse Courses</span>
                <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
              <Link href="/categories" className="btn-secondary text-lg">
                Explore Categories
              </Link>
            </div>
          </div>
          
          {/* Animated Stats */}
          <AnimatedStats 
            coursesCount={courses.length}
            instructorsCount={instructors.length}
            categoriesCount={categories.length}
            lessonsCount={totalLessons}
            hoursCount={totalHours}
          />
        </div>
      </section>

      {/* Featured Courses */}
      <section className="py-20 bg-navy-900/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-12">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-primary-500/20 text-primary-400 animate-pulse">
                  🔥 Popular
                </span>
              </div>
              <h2 className="text-3xl font-bold text-white mb-2">Featured Courses</h2>
              <p className="text-navy-400">Start learning with our most popular courses</p>
            </div>
            <Link href="/courses" className="btn-secondary hidden sm:inline-flex group">
              <span>View All Courses</span>
              <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
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

      {/* Why Choose Us Section - NEW */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-2">Why Learn with Us?</h2>
            <p className="text-navy-400">Everything you need for a successful learning journey</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="card p-6 text-center group hover:border-primary-500/50 transition-all">
              <div className="w-14 h-14 mx-auto mb-4 rounded-xl bg-primary-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                <span className="text-2xl">🎯</span>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Project-Based</h3>
              <p className="text-navy-400 text-sm">Learn by building real-world projects you can add to your portfolio</p>
            </div>
            
            <div className="card p-6 text-center group hover:border-primary-500/50 transition-all">
              <div className="w-14 h-14 mx-auto mb-4 rounded-xl bg-primary-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                <span className="text-2xl">👨‍🏫</span>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Expert Instructors</h3>
              <p className="text-navy-400 text-sm">Learn from industry professionals with years of experience</p>
            </div>
            
            <div className="card p-6 text-center group hover:border-primary-500/50 transition-all">
              <div className="w-14 h-14 mx-auto mb-4 rounded-xl bg-primary-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                <span className="text-2xl">⚡</span>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Learn at Your Pace</h3>
              <p className="text-navy-400 text-sm">Access courses anytime, anywhere, and learn on your schedule</p>
            </div>
            
            <div className="card p-6 text-center group hover:border-primary-500/50 transition-all">
              <div className="w-14 h-14 mx-auto mb-4 rounded-xl bg-primary-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                <span className="text-2xl">💻</span>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Code Examples</h3>
              <p className="text-navy-400 text-sm">Get practical code snippets you can use in your own projects</p>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-20 bg-navy-900/30">
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
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-2">Meet Our Instructors</h2>
            <p className="text-navy-400">Learn from industry experts with real-world experience</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {instructors.slice(0, 6).map((instructor) => (
              <InstructorCard key={instructor.id} instructor={instructor} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-navy-900/30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="card p-12 relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-primary-500/5 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2" />
            
            <div className="relative">
              <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold bg-primary-500/20 text-primary-400 mb-6">
                🚀 Start Learning Today
              </span>
              <h2 className="text-3xl font-bold text-white mb-4">
                Ready to start learning?
              </h2>
              <p className="text-navy-300 mb-8 text-lg">
                Join thousands of students and start your journey to mastering new skills today.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/courses" className="btn-primary text-lg">
                  Get Started Now
                </Link>
                <Link href="/contact" className="btn-secondary text-lg">
                  Contact Us
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}