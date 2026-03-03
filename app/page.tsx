import Link from 'next/link'
import { getCourses, getCategories, getInstructors } from '@/lib/cosmic'
import CourseCard from '@/components/CourseCard'
import CategoryCard from '@/components/CategoryCard'
import InstructorCard from '@/components/InstructorCard'
import DailyTip from '@/components/DailyTip'
import WelcomeConfetti from '@/components/WelcomeConfetti'
import ScrollReveal from '@/components/ScrollReveal'
import QuickStartPath from '@/components/QuickStartPath'

export default async function HomePage() {
  const [courses, categories, instructors] = await Promise.all([
    getCourses(),
    getCategories(),
    getInstructors(),
  ])

  const featuredCourses = courses.slice(0, 3)

  // Calculate total learning hours
  const totalHours = courses.reduce((sum, course) => {
    return sum + (course.metadata?.estimated_hours ?? 0)
  }, 0)

  return (
    <div>
      {/* Welcome Confetti Animation */}
      <WelcomeConfetti />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-500/10 via-transparent to-navy-950" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-primary-500/5 rounded-full blur-3xl" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-500/10 border border-primary-500/20 text-primary-400 text-sm font-medium mb-6 animate-pulse-slow">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary-500"></span>
              </span>
              {totalHours}+ hours of content available
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
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
              <Link href="/categories" className="btn-secondary text-lg">
                Explore Categories
              </Link>
            </div>
          </div>
          
          {/* Stats */}
          <div className="mt-16 grid grid-cols-2 sm:grid-cols-4 gap-8 max-w-3xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-white">{courses.length}+</div>
              <div className="text-navy-400 text-sm">Courses</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white">{instructors.length}+</div>
              <div className="text-navy-400 text-sm">Instructors</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white">{categories.length}</div>
              <div className="text-navy-400 text-sm">Categories</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white">{totalHours}+</div>
              <div className="text-navy-400 text-sm">Hours</div>
            </div>
          </div>
        </div>
      </section>

      {/* Daily Learning Tip */}
      <ScrollReveal>
        <section className="py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <DailyTip />
          </div>
        </section>
      </ScrollReveal>

      {/* Quick Start Learning Path */}
      <ScrollReveal delay={100}>
        <section className="py-12 bg-navy-900/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <QuickStartPath categories={categories} />
          </div>
        </section>
      </ScrollReveal>

      {/* Featured Courses */}
      <ScrollReveal delay={150}>
        <section className="py-20">
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
              {featuredCourses.map((course, index) => (
                <div key={course.id} className="animate-fade-in-up" style={{ animationDelay: `${index * 100}ms` }}>
                  <CourseCard course={course} />
                </div>
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
      <ScrollReveal delay={200}>
        <section className="py-20 bg-navy-900/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-white mb-2">Browse by Category</h2>
              <p className="text-navy-400">Find the perfect course for your learning goals</p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {categories.map((category, index) => (
                <div key={category.id} className="animate-fade-in-up" style={{ animationDelay: `${index * 75}ms` }}>
                  <CategoryCard category={category} />
                </div>
              ))}
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* Instructors */}
      <ScrollReveal delay={250}>
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-white mb-2">Meet Our Instructors</h2>
              <p className="text-navy-400">Learn from industry experts with real-world experience</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {instructors.map((instructor, index) => (
                <div key={instructor.id} className="animate-fade-in-up" style={{ animationDelay: `${index * 100}ms` }}>
                  <InstructorCard instructor={instructor} />
                </div>
              ))}
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* CTA Section */}
      <ScrollReveal delay={300}>
        <section className="py-20 bg-navy-900/30">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="card p-12 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 to-transparent" />
              <div className="relative">
                <div className="text-5xl mb-4">🚀</div>
                <h2 className="text-3xl font-bold text-white mb-4">
                  Ready to start learning?
                </h2>
                <p className="text-navy-300 mb-8 text-lg">
                  Join thousands of students and start your journey to mastering new skills today.
                </p>
                <Link href="/courses" className="btn-primary text-lg inline-flex items-center gap-2">
                  Get Started Now
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </ScrollReveal>
    </div>
  )
}