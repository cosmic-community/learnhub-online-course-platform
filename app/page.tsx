import Link from 'next/link'
import { getCourses, getCategories, getInstructors } from '@/lib/cosmic'
import CourseCard from '@/components/CourseCard'
import CategoryCard from '@/components/CategoryCard'
import InstructorCard from '@/components/InstructorCard'

export default async function HomePage() {
  const [courses, categories, instructors] = await Promise.all([
    getCourses(),
    getCategories(),
    getInstructors(),
  ])

  const featuredCourses = courses.slice(0, 3)
  
  // Calculate total lessons and hours
  const totalLessons = courses.reduce((acc, course) => {
    return acc + (course.metadata?.lessons?.length || 0)
  }, 0)
  
  const totalHours = courses.reduce((acc, course) => {
    return acc + (course.metadata?.estimated_hours || 0)
  }, 0)

  return (
    <div>
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-500/10 via-transparent to-navy-950" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-primary-500/5 rounded-full blur-3xl" />
        
        {/* Animated floating shapes */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-primary-500/10 rounded-full blur-xl animate-pulse" />
        <div className="absolute bottom-20 right-20 w-32 h-32 bg-blue-500/10 rounded-full blur-xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-40 right-40 w-16 h-16 bg-purple-500/10 rounded-full blur-xl animate-pulse" style={{ animationDelay: '2s' }} />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="text-center max-w-3xl mx-auto">
            {/* New achievement badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-500/10 border border-primary-500/20 rounded-full mb-6 animate-slide-up">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary-500"></span>
              </span>
              <span className="text-primary-400 text-sm font-medium">🎉 Now with Learning Streak Tracking!</span>
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
              <Link href="/courses" className="btn-primary text-lg group">
                <span>Browse Courses</span>
                <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
              <Link href="/categories" className="btn-secondary text-lg">
                Explore Categories
              </Link>
            </div>
          </div>
          
          {/* Enhanced Stats */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto">
            <div className="text-center p-4 bg-navy-900/30 rounded-2xl border border-navy-800/50 hover:border-primary-500/30 transition-colors">
              <div className="text-3xl font-bold text-white mb-1">{courses.length}+</div>
              <div className="text-navy-400 text-sm">Courses</div>
            </div>
            <div className="text-center p-4 bg-navy-900/30 rounded-2xl border border-navy-800/50 hover:border-primary-500/30 transition-colors">
              <div className="text-3xl font-bold text-white mb-1">{totalLessons}+</div>
              <div className="text-navy-400 text-sm">Lessons</div>
            </div>
            <div className="text-center p-4 bg-navy-900/30 rounded-2xl border border-navy-800/50 hover:border-primary-500/30 transition-colors">
              <div className="text-3xl font-bold text-white mb-1">{totalHours}+</div>
              <div className="text-navy-400 text-sm">Hours of Content</div>
            </div>
            <div className="text-center p-4 bg-navy-900/30 rounded-2xl border border-navy-800/50 hover:border-primary-500/30 transition-colors">
              <div className="text-3xl font-bold text-white mb-1">{instructors.length}+</div>
              <div className="text-navy-400 text-sm">Expert Instructors</div>
            </div>
          </div>
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

      {/* Learning Path Suggestion */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-primary-500/10 via-blue-500/10 to-purple-500/10 rounded-3xl border border-navy-800 p-8 md:p-12">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary-500/20 rounded-full mb-4">
                  <span className="text-xl">🎯</span>
                  <span className="text-primary-400 text-sm font-medium">New Feature</span>
                </div>
                <h2 className="text-3xl font-bold text-white mb-4">
                  Track Your Learning Progress
                </h2>
                <p className="text-navy-300 mb-6">
                  Build learning streaks, track your progress, and get personalized course recommendations. 
                  Your learning journey just got more engaging!
                </p>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-center gap-3 text-navy-200">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center">
                      <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </span>
                    Daily streak tracking with rewards
                  </li>
                  <li className="flex items-center gap-3 text-navy-200">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center">
                      <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </span>
                    Quick access to recent courses
                  </li>
                  <li className="flex items-center gap-3 text-navy-200">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center">
                      <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </span>
                    Milestone celebrations 🎉
                  </li>
                </ul>
                <p className="text-sm text-navy-400">
                  Look for the floating tracker button in the bottom right corner!
                </p>
              </div>
              <div className="hidden md:flex justify-center">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-primary-500/30 to-purple-500/30 blur-3xl" />
                  <div className="relative bg-navy-900 rounded-2xl border border-navy-700 p-6 shadow-2xl">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="text-4xl">🔥</div>
                      <div>
                        <div className="text-white font-bold text-xl">7 Day Streak!</div>
                        <div className="text-navy-400 text-sm">You&apos;re on fire!</div>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-3 mb-4">
                      <div className="bg-navy-800/50 rounded-lg p-3 text-center">
                        <div className="text-xl font-bold text-white">15</div>
                        <div className="text-navy-500 text-xs">Visits</div>
                      </div>
                      <div className="bg-navy-800/50 rounded-lg p-3 text-center">
                        <div className="text-xl font-bold text-white">4</div>
                        <div className="text-navy-500 text-xs">Courses</div>
                      </div>
                      <div className="bg-navy-800/50 rounded-lg p-3 text-center">
                        <div className="text-xl font-bold text-white">12</div>
                        <div className="text-navy-500 text-xs">Lessons</div>
                      </div>
                    </div>
                    <div className="h-2 bg-navy-800 rounded-full overflow-hidden">
                      <div className="h-full w-1/2 bg-gradient-to-r from-orange-400 to-red-500 rounded-full" />
                    </div>
                    <div className="flex justify-between text-xs mt-2">
                      <span className="text-navy-500">Progress to 14-day streak</span>
                      <span className="text-primary-400">💎 50%</span>
                    </div>
                  </div>
                </div>
              </div>
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
            {instructors.map((instructor) => (
              <InstructorCard key={instructor.id} instructor={instructor} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-navy-900/30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="card p-12 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            <div className="relative">
              <h2 className="text-3xl font-bold text-white mb-4">
                Ready to start learning?
              </h2>
              <p className="text-navy-300 mb-8 text-lg">
                Join thousands of students and start your journey to mastering new skills today.
                Build your streak and track your progress!
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