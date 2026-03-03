import Link from 'next/link'
import { getCourses, getCategories, getInstructors } from '@/lib/cosmic'
import CourseCard from '@/components/CourseCard'
import CategoryCard from '@/components/CategoryCard'
import InstructorCard from '@/components/InstructorCard'
import AnimatedStats from '@/components/AnimatedStats'
import DailyTip from '@/components/DailyTip'
import QuickStartPath from '@/components/QuickStartPath'
import ScrollReveal from '@/components/ScrollReveal'

export default async function HomePage() {
  const [courses, categories, instructors] = await Promise.all([
    getCourses(),
    getCategories(),
    getInstructors(),
  ])

  const featuredCourses = courses.slice(0, 3)
  
  // Group courses by difficulty for the quick start path
  const beginnerCourses = courses.filter(c => c.metadata?.difficulty?.value === 'Beginner' || c.metadata?.difficulty?.value === 'beginner')
  const intermediateCourses = courses.filter(c => c.metadata?.difficulty?.value === 'Intermediate' || c.metadata?.difficulty?.value === 'intermediate')
  const advancedCourses = courses.filter(c => c.metadata?.difficulty?.value === 'Advanced' || c.metadata?.difficulty?.value === 'advanced')

  return (
    <div>
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-500/10 via-transparent to-navy-950" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-primary-500/5 rounded-full blur-3xl" />
        
        {/* Animated background particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-2 h-2 bg-primary-400/30 rounded-full animate-float" />
          <div className="absolute top-40 right-20 w-3 h-3 bg-primary-500/20 rounded-full animate-float-delayed" />
          <div className="absolute bottom-32 left-1/4 w-2 h-2 bg-primary-300/25 rounded-full animate-float" />
          <div className="absolute top-1/3 right-1/3 w-4 h-4 bg-primary-400/15 rounded-full animate-float-delayed" />
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-primary-500/10 border border-primary-500/20 rounded-full px-4 py-2 mb-6 animate-fade-in">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary-500"></span>
              </span>
              <span className="text-primary-300 text-sm font-medium">New courses added weekly</span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight animate-slide-up">
              Learn skills that
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-primary-600"> advance your career</span>
            </h1>
            <p className="text-xl text-navy-300 mb-8 animate-slide-up-delayed">
              Master web development, design, and more with expert-led courses. 
              Start your learning journey today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up-more-delayed">
              <Link href="/courses" className="btn-primary text-lg group">
                <span>Browse Courses</span>
                <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
          />
        </div>
      </section>

      {/* Daily Learning Tip */}
      <ScrollReveal>
        <section className="py-8 border-y border-navy-800/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <DailyTip />
          </div>
        </section>
      </ScrollReveal>

      {/* Quick Start Path Finder */}
      <ScrollReveal delay={100}>
        <section className="py-16 bg-gradient-to-b from-navy-900/50 to-transparent">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <h2 className="text-2xl font-bold text-white mb-2">🎯 Find Your Learning Path</h2>
              <p className="text-navy-400">Choose your skill level and discover the perfect courses</p>
            </div>
            <QuickStartPath 
              beginnerCount={beginnerCourses.length}
              intermediateCount={intermediateCourses.length}
              advancedCount={advancedCourses.length}
            />
          </div>
        </section>
      </ScrollReveal>

      {/* Featured Courses */}
      <ScrollReveal delay={150}>
        <section className="py-20 bg-navy-900/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-12">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h2 className="text-3xl font-bold text-white">Featured Courses</h2>
                  <span className="px-3 py-1 bg-gradient-to-r from-primary-500/20 to-primary-600/20 border border-primary-500/30 rounded-full text-primary-300 text-sm font-medium">
                    ⭐ Top Picks
                  </span>
                </div>
                <p className="text-navy-400">Start learning with our most popular courses</p>
              </div>
              <Link href="/courses" className="btn-secondary hidden sm:inline-flex group">
                <span>View All Courses</span>
                <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredCourses.map((course, index) => (
                <div key={course.id} className="animate-fade-in" style={{ animationDelay: `${index * 100}ms` }}>
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
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-white mb-2">Browse by Category</h2>
              <p className="text-navy-400">Find the perfect course for your learning goals</p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {categories.map((category, index) => (
                <div key={category.id} className="animate-fade-in" style={{ animationDelay: `${index * 75}ms` }}>
                  <CategoryCard category={category} />
                </div>
              ))}
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* Instructors */}
      <ScrollReveal delay={250}>
        <section className="py-20 bg-navy-900/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-white mb-2">Meet Our Instructors</h2>
              <p className="text-navy-400">Learn from industry experts with real-world experience</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {instructors.map((instructor, index) => (
                <div key={instructor.id} className="animate-fade-in" style={{ animationDelay: `${index * 100}ms` }}>
                  <InstructorCard instructor={instructor} />
                </div>
              ))}
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* CTA Section */}
      <ScrollReveal delay={300}>
        <section className="py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="card p-12 relative overflow-hidden">
              {/* Decorative elements */}
              <div className="absolute top-0 right-0 w-40 h-40 bg-primary-500/10 rounded-full blur-3xl" />
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-primary-600/10 rounded-full blur-2xl" />
              
              <div className="relative">
                <div className="text-5xl mb-4">🚀</div>
                <h2 className="text-3xl font-bold text-white mb-4">
                  Ready to start learning?
                </h2>
                <p className="text-navy-300 mb-8 text-lg">
                  Join thousands of students and start your journey to mastering new skills today.
                </p>
                <Link href="/courses" className="btn-primary text-lg group inline-flex">
                  <span>Get Started Now</span>
                  <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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