import Link from 'next/link'
import { getCourses, getCategories, getInstructors } from '@/lib/cosmic'
import CourseCard from '@/components/CourseCard'
import CategoryCard from '@/components/CategoryCard'
import InstructorCard from '@/components/InstructorCard'
import AnimatedCounter from '@/components/AnimatedCounter'
import MotivationalQuote from '@/components/MotivationalQuote'
import TypewriterText from '@/components/TypewriterText'
import ScrollReveal from '@/components/ScrollReveal'
import LearningStreak from '@/components/LearningStreak'

export default async function HomePage() {
  const [courses, categories, instructors] = await Promise.all([
    getCourses(),
    getCategories(),
    getInstructors(),
  ])

  const featuredCourses = courses.slice(0, 3)
  const totalLessons = courses.reduce((acc, course) => {
    return acc + (course.metadata?.lessons?.length || 0)
  }, 0)

  return (
    <div>
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-500/10 via-transparent to-navy-950" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-primary-500/5 rounded-full blur-3xl" />
        
        {/* Floating particles effect */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-20 w-2 h-2 bg-primary-400/30 rounded-full animate-float" />
          <div className="absolute top-40 right-32 w-3 h-3 bg-primary-500/20 rounded-full animate-float-delayed" />
          <div className="absolute bottom-32 left-1/4 w-2 h-2 bg-primary-300/25 rounded-full animate-float" />
          <div className="absolute top-1/3 right-1/4 w-4 h-4 bg-primary-400/15 rounded-full animate-float-delayed" />
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="text-center max-w-3xl mx-auto">
            {/* Learning Streak Badge */}
            <div className="mb-6 flex justify-center">
              <LearningStreak />
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              Learn skills that
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-primary-600 block sm:inline">
                {' '}
                <TypewriterText 
                  phrases={['advance your career', 'unlock opportunities', 'transform your future', 'make you stand out']}
                  className="inline"
                />
              </span>
            </h1>
            <p className="text-xl text-navy-300 mb-8">
              Master web development, design, and more with expert-led courses. 
              Start your learning journey today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/courses" className="btn-primary text-lg group">
                Browse Courses
                <svg className="inline-block w-5 h-5 ml-2 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
              <Link href="/categories" className="btn-secondary text-lg">
                Explore Categories
              </Link>
            </div>
          </div>
          
          {/* Animated Stats */}
          <div className="mt-16 grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-8 max-w-3xl mx-auto">
            <div className="text-center group">
              <AnimatedCounter 
                end={courses.length} 
                suffix="+" 
                className="text-3xl sm:text-4xl font-bold text-white group-hover:text-primary-400 transition-colors"
              />
              <div className="text-navy-400 text-sm mt-1">Courses</div>
            </div>
            <div className="text-center group">
              <AnimatedCounter 
                end={instructors.length} 
                suffix="+" 
                className="text-3xl sm:text-4xl font-bold text-white group-hover:text-primary-400 transition-colors"
              />
              <div className="text-navy-400 text-sm mt-1">Expert Instructors</div>
            </div>
            <div className="text-center group">
              <AnimatedCounter 
                end={totalLessons} 
                suffix="+" 
                className="text-3xl sm:text-4xl font-bold text-white group-hover:text-primary-400 transition-colors"
              />
              <div className="text-navy-400 text-sm mt-1">Video Lessons</div>
            </div>
            <div className="text-center group">
              <AnimatedCounter 
                end={categories.length} 
                className="text-3xl sm:text-4xl font-bold text-white group-hover:text-primary-400 transition-colors"
              />
              <div className="text-navy-400 text-sm mt-1">Categories</div>
            </div>
          </div>
        </div>
      </section>

      {/* Motivational Quote Section */}
      <ScrollReveal direction="fade" className="py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <MotivationalQuote />
        </div>
      </ScrollReveal>

      {/* Featured Courses */}
      <section className="py-20 bg-navy-900/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal direction="up">
            <div className="flex items-center justify-between mb-12">
              <div>
                <h2 className="text-3xl font-bold text-white mb-2">Featured Courses</h2>
                <p className="text-navy-400">Start learning with our most popular courses</p>
              </div>
              <Link href="/courses" className="btn-secondary hidden sm:inline-flex group">
                View All Courses
                <svg className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </ScrollReveal>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredCourses.map((course, index) => (
              <ScrollReveal key={course.id} direction="up" delay={index * 100}>
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

      {/* Categories */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal direction="up">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-white mb-2">Browse by Category</h2>
              <p className="text-navy-400">Find the perfect course for your learning goals</p>
            </div>
          </ScrollReveal>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((category, index) => (
              <ScrollReveal key={category.id} direction="up" delay={index * 75}>
                <CategoryCard category={category} />
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Instructors */}
      <section className="py-20 bg-navy-900/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal direction="up">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-white mb-2">Meet Our Instructors</h2>
              <p className="text-navy-400">Learn from industry experts with real-world experience</p>
            </div>
          </ScrollReveal>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {instructors.map((instructor, index) => (
              <ScrollReveal key={instructor.id} direction="up" delay={index * 100}>
                <InstructorCard instructor={instructor} />
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <ScrollReveal direction="up">
            <div className="card p-12 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500/10 rounded-full blur-3xl" />
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-primary-500/5 rounded-full blur-2xl" />
              
              <div className="relative">
                <span className="inline-block text-5xl mb-4 animate-bounce">🚀</span>
                <h2 className="text-3xl font-bold text-white mb-4">
                  Ready to start learning?
                </h2>
                <p className="text-navy-300 mb-8 text-lg">
                  Join thousands of students and start your journey to mastering new skills today.
                </p>
                <Link href="/courses" className="btn-primary text-lg group">
                  Get Started Now
                  <svg className="inline-block w-5 h-5 ml-2 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Link>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </div>
  )
}