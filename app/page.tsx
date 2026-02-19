import Link from 'next/link'
import { getCourses, getCategories, getInstructors } from '@/lib/cosmic'
import CourseCard from '@/components/CourseCard'
import CategoryCard from '@/components/CategoryCard'
import InstructorCard from '@/components/InstructorCard'
import AnimatedCounter from '@/components/AnimatedCounter'
import FloatingParticles from '@/components/FloatingParticles'

export default async function HomePage() {
  const [courses, categories, instructors] = await Promise.all([
    getCourses(),
    getCategories(),
    getInstructors(),
  ])

  const featuredCourses = courses.slice(0, 3)

  // Calculate total learning hours
  const totalLessons = courses.reduce((acc, course) => {
    return acc + (course.metadata?.lessons?.length || 0)
  }, 0)

  return (
    <div>
      {/* Hero Section */}
      <section className="relative overflow-hidden min-h-[90vh] flex items-center">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-500/10 via-transparent to-navy-950" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-primary-500/5 rounded-full blur-3xl" />
        
        {/* Floating Particles Background */}
        <FloatingParticles />
        
        {/* Floating decorative elements */}
        <div className="absolute top-20 left-10 text-6xl animate-float opacity-20" style={{ animationDelay: '0s' }}>💻</div>
        <div className="absolute top-40 right-20 text-5xl animate-float opacity-20" style={{ animationDelay: '1s' }}>🚀</div>
        <div className="absolute bottom-40 left-1/4 text-4xl animate-float opacity-20" style={{ animationDelay: '2s' }}>⚡</div>
        <div className="absolute bottom-20 right-1/4 text-5xl animate-float opacity-20" style={{ animationDelay: '0.5s' }}>🎯</div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-500/10 border border-primary-500/20 rounded-full text-primary-400 text-sm mb-6 animate-fade-in">
              <span className="animate-pulse">🔥</span>
              <span>New courses added weekly</span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight animate-slide-up">
              Learn skills that
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-primary-600"> advance your career</span>
            </h1>
            <p className="text-xl text-navy-300 mb-8 animate-slide-up" style={{ animationDelay: '0.1s' }}>
              Master web development, design, and more with expert-led courses. 
              Start your learning journey today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up" style={{ animationDelay: '0.2s' }}>
              <Link href="/courses" className="btn-primary text-lg group">
                <span>Browse Courses</span>
                <svg className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
              <Link href="/categories" className="btn-secondary text-lg">
                Explore Categories
              </Link>
            </div>
          </div>
          
          {/* Stats */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-3xl mx-auto animate-slide-up" style={{ animationDelay: '0.3s' }}>
            <div className="text-center group">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-primary-500/10 rounded-xl mb-3 group-hover:bg-primary-500/20 transition-colors">
                <span className="text-2xl">📚</span>
              </div>
              <AnimatedCounter target={courses.length} suffix="+" />
              <div className="text-navy-400 text-sm">Courses</div>
            </div>
            <div className="text-center group">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-primary-500/10 rounded-xl mb-3 group-hover:bg-primary-500/20 transition-colors">
                <span className="text-2xl">👨‍🏫</span>
              </div>
              <AnimatedCounter target={instructors.length} suffix="+" delay={200} />
              <div className="text-navy-400 text-sm">Instructors</div>
            </div>
            <div className="text-center group">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-primary-500/10 rounded-xl mb-3 group-hover:bg-primary-500/20 transition-colors">
                <span className="text-2xl">📖</span>
              </div>
              <AnimatedCounter target={totalLessons} suffix="+" delay={400} />
              <div className="text-navy-400 text-sm">Lessons</div>
            </div>
            <div className="text-center group">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-primary-500/10 rounded-xl mb-3 group-hover:bg-primary-500/20 transition-colors">
                <span className="text-2xl">🏷️</span>
              </div>
              <AnimatedCounter target={categories.length} delay={600} />
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
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">⭐</span>
                <span className="text-primary-400 text-sm font-medium uppercase tracking-wider">Featured</span>
              </div>
              <h2 className="text-3xl font-bold text-white mb-2">Popular Courses</h2>
              <p className="text-navy-400">Start learning with our most popular courses</p>
            </div>
            <Link href="/courses" className="btn-secondary hidden sm:inline-flex group">
              <span>View All</span>
              <svg className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 stagger-children">
            {featuredCourses.map((course) => (
              <div key={course.id} className="animate-slide-up">
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

      {/* Categories */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 mb-2">
              <span className="text-2xl">🎯</span>
              <span className="text-primary-400 text-sm font-medium uppercase tracking-wider">Categories</span>
            </div>
            <h2 className="text-3xl font-bold text-white mb-2">Browse by Category</h2>
            <p className="text-navy-400">Find the perfect course for your learning goals</p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 stagger-children">
            {categories.map((category) => (
              <div key={category.id} className="animate-slide-up">
                <CategoryCard category={category} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Instructors */}
      <section className="py-20 bg-navy-900/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 mb-2">
              <span className="text-2xl">🌟</span>
              <span className="text-primary-400 text-sm font-medium uppercase tracking-wider">Expert Teachers</span>
            </div>
            <h2 className="text-3xl font-bold text-white mb-2">Meet Our Instructors</h2>
            <p className="text-navy-400">Learn from industry experts with real-world experience</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 stagger-children">
            {instructors.slice(0, 6).map((instructor) => (
              <div key={instructor.id} className="animate-slide-up">
                <InstructorCard instructor={instructor} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="card p-12 relative overflow-hidden">
            {/* Decorative gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary-500/10 via-transparent to-transparent" />
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500/5 rounded-full blur-3xl" />
            
            <div className="relative">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-500/10 rounded-2xl mb-6 animate-pulse-glow">
                <span className="text-3xl">🚀</span>
              </div>
              
              <h2 className="text-3xl font-bold text-white mb-4">
                Ready to start learning?
              </h2>
              <p className="text-navy-300 mb-8 text-lg max-w-xl mx-auto">
                Join thousands of students and start your journey to mastering new skills today.
                Your first lesson is just a click away.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/courses" className="btn-primary text-lg">
                  Get Started Now
                </Link>
                <Link href="/contact" className="btn-secondary text-lg">
                  Have Questions?
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}