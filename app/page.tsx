import Link from 'next/link'
import { getCourses, getCategories, getInstructors } from '@/lib/cosmic'
import CourseCard from '@/components/CourseCard'
import CategoryCard from '@/components/CategoryCard'
import InstructorCard from '@/components/InstructorCard'
import AnimatedCounter from '@/components/AnimatedCounter'
import MotivationalQuote from '@/components/MotivationalQuote'
import ScrollReveal from '@/components/ScrollReveal'

export default async function HomePage() {
  const [courses, categories, instructors] = await Promise.all([
    getCourses(),
    getCategories(),
    getInstructors(),
  ])

  const featuredCourses = courses.slice(0, 3)
  
  // Calculate total learning hours and lessons
  const totalLessons = courses.reduce((acc, course) => {
    const lessonCount = course.metadata?.lessons?.length || 0
    return acc + lessonCount
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
        
        {/* Animated particles effect */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="particle particle-1" />
          <div className="particle particle-2" />
          <div className="particle particle-3" />
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-primary-500/10 border border-primary-500/20 rounded-full px-4 py-2 mb-6 animate-fade-in">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary-500"></span>
              </span>
              <span className="text-primary-300 text-sm font-medium">Now with {totalLessons}+ lessons available</span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight animate-slide-up">
              Learn skills that
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-primary-600"> advance your career</span>
            </h1>
            <p className="text-xl text-navy-300 mb-8 animate-slide-up animation-delay-100">
              Master web development, design, and more with expert-led courses. 
              Start your learning journey today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up animation-delay-200">
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
          
          {/* Animated Stats */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto">
            <div className="text-center glass-card p-4 rounded-xl">
              <AnimatedCounter end={courses.length} suffix="+" />
              <div className="text-navy-400 text-sm">Courses</div>
            </div>
            <div className="text-center glass-card p-4 rounded-xl">
              <AnimatedCounter end={totalLessons} suffix="+" />
              <div className="text-navy-400 text-sm">Lessons</div>
            </div>
            <div className="text-center glass-card p-4 rounded-xl">
              <AnimatedCounter end={totalHours} suffix="h" />
              <div className="text-navy-400 text-sm">Content</div>
            </div>
            <div className="text-center glass-card p-4 rounded-xl">
              <AnimatedCounter end={instructors.length} suffix="+" />
              <div className="text-navy-400 text-sm">Instructors</div>
            </div>
          </div>
        </div>
      </section>

      {/* Motivational Quote Section */}
      <ScrollReveal>
        <section className="py-12 border-y border-navy-800/50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <MotivationalQuote />
          </div>
        </section>
      </ScrollReveal>

      {/* Featured Courses */}
      <ScrollReveal>
        <section className="py-20 bg-navy-900/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-12">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">🔥</span>
                  <span className="text-primary-400 text-sm font-semibold uppercase tracking-wider">Popular</span>
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
              {featuredCourses.map((course, index) => (
                <ScrollReveal key={course.id} delay={index * 100}>
                  <CourseCard course={course} />
                </ScrollReveal>
              ))}
            </div>
            
            <div className="mt-8 text-center sm:hidden">
              <Link href="/courses" className="btn-secondary">
                View All Courses
              </Link>
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* Categories */}
      <ScrollReveal>
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <span className="text-4xl mb-4 block">📚</span>
              <h2 className="text-3xl font-bold text-white mb-2">Browse by Category</h2>
              <p className="text-navy-400">Find the perfect course for your learning goals</p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {categories.map((category, index) => (
                <ScrollReveal key={category.id} delay={index * 75}>
                  <CategoryCard category={category} />
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* Instructors */}
      <ScrollReveal>
        <section className="py-20 bg-navy-900/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <span className="text-4xl mb-4 block">👨‍🏫</span>
              <h2 className="text-3xl font-bold text-white mb-2">Meet Our Instructors</h2>
              <p className="text-navy-400">Learn from industry experts with real-world experience</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {instructors.map((instructor, index) => (
                <ScrollReveal key={instructor.id} delay={index * 100}>
                  <InstructorCard instructor={instructor} />
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* Learning Path Section - NEW */}
      <ScrollReveal>
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <span className="text-4xl mb-4 block">🚀</span>
              <h2 className="text-3xl font-bold text-white mb-2">Your Learning Journey</h2>
              <p className="text-navy-400">Follow a structured path to achieve your goals</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="card p-6 text-center group hover:scale-105 transition-transform duration-300">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-green-500/25 group-hover:shadow-green-500/40 transition-shadow">
                  <span className="text-3xl">🌱</span>
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">1. Start Learning</h3>
                <p className="text-navy-400">Choose a course that matches your current skill level and interests</p>
              </div>
              
              <div className="card p-6 text-center group hover:scale-105 transition-transform duration-300">
                <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-primary-500/25 group-hover:shadow-primary-500/40 transition-shadow">
                  <span className="text-3xl">💪</span>
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">2. Build Skills</h3>
                <p className="text-navy-400">Practice with hands-on projects and real-world examples</p>
              </div>
              
              <div className="card p-6 text-center group hover:scale-105 transition-transform duration-300">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-purple-500/25 group-hover:shadow-purple-500/40 transition-shadow">
                  <span className="text-3xl">🎯</span>
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">3. Achieve Goals</h3>
                <p className="text-navy-400">Apply your knowledge and advance your career</p>
              </div>
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* CTA Section */}
      <ScrollReveal>
        <section className="py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="card p-12 relative overflow-hidden">
              {/* Background decoration */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary-500/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
              
              <div className="relative">
                <span className="text-5xl mb-6 block">✨</span>
                <h2 className="text-3xl font-bold text-white mb-4">
                  Ready to start learning?
                </h2>
                <p className="text-navy-300 mb-8 text-lg">
                  Join thousands of students and start your journey to mastering new skills today.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link href="/courses" className="btn-primary text-lg group">
                    <span>Get Started Now</span>
                    <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </Link>
                  <Link href="/contact" className="btn-secondary text-lg">
                    Contact Us
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </ScrollReveal>
    </div>
  )
}