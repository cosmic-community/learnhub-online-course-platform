import Link from 'next/link'
import { getCourses, getCategories, getInstructors } from '@/lib/cosmic'
import CourseCard from '@/components/CourseCard'
import CategoryCard from '@/components/CategoryCard'
import InstructorCard from '@/components/InstructorCard'
import AnimatedCounter from '@/components/AnimatedCounter'
import LearningTip from '@/components/LearningTip'
import ScrollReveal from '@/components/ScrollReveal'

export default async function HomePage() {
  const [courses, categories, instructors] = await Promise.all([
    getCourses(),
    getCategories(),
    getInstructors(),
  ])

  const featuredCourses = courses.slice(0, 3)
  
  // Calculate total lessons across all courses
  const totalLessons = courses.reduce((sum, course) => {
    return sum + (course.metadata?.lessons?.length || 0)
  }, 0)

  return (
    <div>
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-500/10 via-transparent to-navy-950" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-primary-500/5 rounded-full blur-3xl" />
        
        {/* Animated background particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-[10%] w-2 h-2 bg-primary-400/30 rounded-full animate-pulse" />
          <div className="absolute top-40 right-[15%] w-3 h-3 bg-primary-500/20 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }} />
          <div className="absolute bottom-32 left-[20%] w-2 h-2 bg-primary-400/25 rounded-full animate-pulse" style={{ animationDelay: '1s' }} />
          <div className="absolute bottom-20 right-[25%] w-4 h-4 bg-primary-500/15 rounded-full animate-pulse" style={{ animationDelay: '1.5s' }} />
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <ScrollReveal className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-500/10 border border-primary-500/20 rounded-full text-primary-400 text-sm mb-6">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary-500"></span>
              </span>
              Now with {totalLessons}+ lessons available
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
                Browse Courses
                <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
              <Link href="/categories" className="btn-secondary text-lg">
                Explore Categories
              </Link>
            </div>
          </ScrollReveal>
          
          {/* Stats */}
          <ScrollReveal delay={200} className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-3xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-white">
                <AnimatedCounter end={courses.length} suffix="+" />
              </div>
              <div className="text-navy-400 text-sm">Courses</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white">
                <AnimatedCounter end={totalLessons} suffix="+" />
              </div>
              <div className="text-navy-400 text-sm">Lessons</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white">
                <AnimatedCounter end={instructors.length} suffix="+" />
              </div>
              <div className="text-navy-400 text-sm">Instructors</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white">
                <AnimatedCounter end={categories.length} />
              </div>
              <div className="text-navy-400 text-sm">Categories</div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Learning Tip Section */}
      <section className="py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <LearningTip />
          </ScrollReveal>
        </div>
      </section>

      {/* Featured Courses */}
      <section className="py-20 bg-navy-900/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <div className="flex items-center justify-between mb-12">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">🔥</span>
                  <h2 className="text-3xl font-bold text-white">Featured Courses</h2>
                </div>
                <p className="text-navy-400">Start learning with our most popular courses</p>
              </div>
              <Link href="/courses" className="btn-secondary hidden sm:inline-flex">
                View All Courses
              </Link>
            </div>
          </ScrollReveal>
          
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

      {/* Categories */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-white mb-2">Browse by Category</h2>
              <p className="text-navy-400">Find the perfect course for your learning goals</p>
            </div>
          </ScrollReveal>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((category, index) => (
              <ScrollReveal key={category.id} delay={index * 75} direction="up">
                <CategoryCard category={category} />
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-20 bg-navy-900/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-white mb-2">Why Learn with Us?</h2>
              <p className="text-navy-400">Join thousands of successful learners worldwide</p>
            </div>
          </ScrollReveal>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <ScrollReveal delay={0}>
              <div className="text-center p-6">
                <div className="w-16 h-16 mx-auto mb-4 bg-primary-500/10 rounded-2xl flex items-center justify-center">
                  <span className="text-3xl">🎓</span>
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">Expert Instructors</h3>
                <p className="text-navy-400">Learn from industry professionals with years of real-world experience.</p>
              </div>
            </ScrollReveal>
            
            <ScrollReveal delay={100}>
              <div className="text-center p-6">
                <div className="w-16 h-16 mx-auto mb-4 bg-primary-500/10 rounded-2xl flex items-center justify-center">
                  <span className="text-3xl">💻</span>
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">Hands-On Projects</h3>
                <p className="text-navy-400">Build real projects and create a portfolio as you learn new skills.</p>
              </div>
            </ScrollReveal>
            
            <ScrollReveal delay={200}>
              <div className="text-center p-6">
                <div className="w-16 h-16 mx-auto mb-4 bg-primary-500/10 rounded-2xl flex items-center justify-center">
                  <span className="text-3xl">⚡</span>
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">Learn at Your Pace</h3>
                <p className="text-navy-400">Access courses anytime, anywhere. Learn on your own schedule.</p>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Instructors */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-white mb-2">Meet Our Instructors</h2>
              <p className="text-navy-400">Learn from industry experts with real-world experience</p>
            </div>
          </ScrollReveal>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {instructors.map((instructor, index) => (
              <ScrollReveal key={instructor.id} delay={index * 100}>
                <InstructorCard instructor={instructor} />
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <ScrollReveal>
            <div className="card p-12 relative overflow-hidden">
              {/* Background decoration */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500/5 rounded-full blur-3xl" />
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-primary-400/5 rounded-full blur-2xl" />
              
              <div className="relative">
                <span className="text-5xl mb-4 block">🚀</span>
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
          </ScrollReveal>
        </div>
      </section>
    </div>
  )
}