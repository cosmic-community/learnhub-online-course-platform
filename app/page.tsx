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

  // Calculate total lessons across all courses
  const totalLessons = courses.reduce((acc, course) => {
    return acc + (course.metadata?.lessons?.length || 0)
  }, 0)

  return (
    <div>
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-500/10 via-transparent to-navy-950" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-primary-500/5 rounded-full blur-3xl" />
        
        {/* Animated background particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-2 h-2 bg-primary-400/30 rounded-full animate-pulse" />
          <div className="absolute top-40 right-20 w-3 h-3 bg-blue-400/20 rounded-full animate-bounce" style={{ animationDelay: '0.5s' }} />
          <div className="absolute bottom-32 left-1/4 w-2 h-2 bg-purple-400/25 rounded-full animate-pulse" style={{ animationDelay: '1s' }} />
          <div className="absolute top-1/3 right-1/3 w-4 h-4 bg-primary-500/10 rounded-full animate-bounce" style={{ animationDelay: '0.3s' }} />
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="text-center max-w-3xl mx-auto">
            {/* New Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-500/10 border border-primary-500/20 text-primary-400 text-sm font-medium mb-6 animate-pulse">
              <span className="text-lg">🔥</span>
              <span>Build your learning streak today!</span>
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
                <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
              </Link>
              <Link href="/categories" className="btn-secondary text-lg">
                Explore Categories
              </Link>
            </div>
          </div>
          
          {/* Enhanced Stats */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto">
            <div className="text-center p-4 rounded-xl bg-navy-900/30 border border-navy-800/50 hover:border-primary-500/30 transition-colors">
              <div className="text-3xl font-bold text-white mb-1">{courses.length}+</div>
              <div className="text-navy-400 text-sm">Courses</div>
            </div>
            <div className="text-center p-4 rounded-xl bg-navy-900/30 border border-navy-800/50 hover:border-primary-500/30 transition-colors">
              <div className="text-3xl font-bold text-white mb-1">{totalLessons}+</div>
              <div className="text-navy-400 text-sm">Lessons</div>
            </div>
            <div className="text-center p-4 rounded-xl bg-navy-900/30 border border-navy-800/50 hover:border-primary-500/30 transition-colors">
              <div className="text-3xl font-bold text-white mb-1">{instructors.length}+</div>
              <div className="text-navy-400 text-sm">Instructors</div>
            </div>
            <div className="text-center p-4 rounded-xl bg-navy-900/30 border border-navy-800/50 hover:border-primary-500/30 transition-colors">
              <div className="text-3xl font-bold text-white mb-1">{categories.length}</div>
              <div className="text-navy-400 text-sm">Categories</div>
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

      {/* Learning Path Highlight */}
      <section className="py-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary-500/5 via-transparent to-purple-500/5" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="card p-8 md:p-12 bg-gradient-to-br from-navy-900/80 to-navy-950/80 border-primary-500/20">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-500/20 text-primary-400 text-sm font-medium mb-4">
                  <span>✨</span> New Feature
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
                  Track Your Learning Journey
                </h2>
                <p className="text-navy-300 mb-6">
                  Build daily learning streaks, earn achievement badges, and celebrate your progress 
                  with fun confetti animations. Your dedication deserves recognition! 🎉
                </p>
                <div className="flex flex-wrap gap-3">
                  <span className="px-3 py-1.5 bg-green-500/20 text-green-400 rounded-lg text-sm font-medium">
                    🔥 Daily Streaks
                  </span>
                  <span className="px-3 py-1.5 bg-yellow-500/20 text-yellow-400 rounded-lg text-sm font-medium">
                    🏆 Achievements
                  </span>
                  <span className="px-3 py-1.5 bg-purple-500/20 text-purple-400 rounded-lg text-sm font-medium">
                    🎉 Celebrations
                  </span>
                </div>
              </div>
              <div className="flex justify-center">
                <div className="relative">
                  {/* Mock streak display */}
                  <div className="bg-navy-800/50 rounded-2xl p-6 border border-navy-700">
                    <div className="flex items-center gap-4 mb-4">
                      <span className="text-4xl animate-bounce">🔥</span>
                      <div>
                        <div className="text-3xl font-bold text-white">7 Day</div>
                        <div className="text-navy-400">Streak</div>
                      </div>
                    </div>
                    <div className="flex gap-2 mb-4">
                      {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, i) => (
                        <div 
                          key={day + i} 
                          className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-medium ${
                            i < 7 ? 'bg-primary-500 text-white' : 'bg-navy-700 text-navy-500'
                          }`}
                        >
                          ✓
                        </div>
                      ))}
                    </div>
                    <div className="flex gap-2 flex-wrap">
                      <span className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded-full text-xs">🌟 First Step</span>
                      <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded-full text-xs">🌱 Growing</span>
                      <span className="px-2 py-1 bg-yellow-500/20 text-yellow-400 rounded-full text-xs">🔥 On Fire</span>
                    </div>
                  </div>
                  {/* Decorative elements */}
                  <div className="absolute -top-4 -right-4 w-8 h-8 bg-yellow-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}>
                    ⭐
                  </div>
                  <div className="absolute -bottom-2 -left-4 w-6 h-6 bg-green-400 rounded-full animate-pulse">
                    ✨
                  </div>
                </div>
              </div>
            </div>
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
            {/* Background decoration */}
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-primary-500/10 via-transparent to-purple-500/10" />
            <div className="absolute top-4 left-4 text-4xl animate-bounce">🚀</div>
            <div className="absolute bottom-4 right-4 text-4xl animate-pulse">⭐</div>
            
            <div className="relative">
              <h2 className="text-3xl font-bold text-white mb-4">
                Ready to start learning?
              </h2>
              <p className="text-navy-300 mb-8 text-lg">
                Join thousands of students and start your journey to mastering new skills today.
                Build your streak and unlock achievements along the way!
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