import Link from 'next/link'
import { getCourses, getCategories, getInstructors, getLessons } from '@/lib/cosmic'
import CourseCard from '@/components/CourseCard'
import CategoryCard from '@/components/CategoryCard'
import InstructorCard from '@/components/InstructorCard'
import LearningStats from '@/components/LearningStats'
import AnimatedCounter from '@/components/AnimatedCounter'

export default async function HomePage() {
  const [courses, categories, instructors, lessons] = await Promise.all([
    getCourses(),
    getCategories(),
    getInstructors(),
    getLessons(),
  ])

  const featuredCourses = courses.slice(0, 3)
  const featuredInstructors = instructors.slice(0, 3)

  return (
    <div>
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-500/10 via-transparent to-navy-950" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-primary-500/5 rounded-full blur-3xl" />
        
        {/* Animated background particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-primary-400/30 rounded-full animate-float" />
          <div className="absolute top-1/3 right-1/4 w-3 h-3 bg-primary-500/20 rounded-full animate-float-delayed" />
          <div className="absolute bottom-1/4 left-1/3 w-2 h-2 bg-primary-300/25 rounded-full animate-float-slow" />
          <div className="absolute top-1/2 right-1/3 w-1.5 h-1.5 bg-primary-400/30 rounded-full animate-float" />
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="text-center max-w-3xl mx-auto animate-fade-in-up">
            <div className="inline-flex items-center gap-2 bg-primary-500/10 border border-primary-500/20 rounded-full px-4 py-2 mb-6 animate-bounce-slow">
              <span className="text-primary-400 text-sm font-medium">🚀 Start learning today</span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              Learn skills that
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-primary-600 animate-gradient"> advance your career</span>
            </h1>
            <p className="text-xl text-navy-300 mb-8">
              Master web development, design, and more with expert-led courses. 
              Start your learning journey today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/courses" className="btn-primary text-lg group">
                <span>Browse Courses</span>
                <svg className="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
              <Link href="/categories" className="btn-secondary text-lg">
                Explore Categories
              </Link>
            </div>
          </div>
          
          {/* Animated Stats */}
          <div className="mt-16 grid grid-cols-3 gap-8 max-w-2xl mx-auto">
            <div className="text-center group">
              <div className="text-3xl font-bold text-white group-hover:text-primary-400 transition-colors">
                <AnimatedCounter end={courses.length} suffix="+" />
              </div>
              <div className="text-navy-400 text-sm">Courses</div>
            </div>
            <div className="text-center group">
              <div className="text-3xl font-bold text-white group-hover:text-primary-400 transition-colors">
                <AnimatedCounter end={instructors.length} suffix="+" />
              </div>
              <div className="text-navy-400 text-sm">Instructors</div>
            </div>
            <div className="text-center group">
              <div className="text-3xl font-bold text-white group-hover:text-primary-400 transition-colors">
                <AnimatedCounter end={lessons.length} />
              </div>
              <div className="text-navy-400 text-sm">Lessons</div>
            </div>
          </div>
        </div>
      </section>

      {/* Learning Stats Dashboard */}
      <section className="py-12 -mt-8 relative z-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <LearningStats 
            totalCourses={courses.length} 
            totalLessons={lessons.length}
            totalInstructors={instructors.length}
          />
        </div>
      </section>

      {/* Featured Courses */}
      <section className="py-20 bg-navy-900/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-12">
            <div>
              <div className="inline-flex items-center gap-2 text-primary-400 text-sm font-medium mb-2">
                <span>✨</span> Hand-picked for you
              </div>
              <h2 className="text-3xl font-bold text-white mb-2">Featured Courses</h2>
              <p className="text-navy-400">Start learning with our most popular courses</p>
            </div>
            <Link href="/courses" className="btn-secondary hidden sm:inline-flex group">
              View All Courses
              <svg className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredCourses.map((course, index) => (
              <div 
                key={course.id} 
                className="animate-fade-in-up"
                style={{ animationDelay: `${index * 150}ms` }}
              >
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
            <div className="inline-flex items-center gap-2 text-primary-400 text-sm font-medium mb-2">
              <span>🎯</span> Find your path
            </div>
            <h2 className="text-3xl font-bold text-white mb-2">Browse by Category</h2>
            <p className="text-navy-400">Find the perfect course for your learning goals</p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((category, index) => (
              <div 
                key={category.id}
                className="animate-fade-in-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
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
            <div className="inline-flex items-center gap-2 text-primary-400 text-sm font-medium mb-2">
              <span>🌟</span> Learn from the best
            </div>
            <h2 className="text-3xl font-bold text-white mb-2">Meet Our Instructors</h2>
            <p className="text-navy-400">Learn from industry experts with real-world experience</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredInstructors.map((instructor, index) => (
              <div 
                key={instructor.id}
                className="animate-fade-in-up"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <InstructorCard instructor={instructor} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonial/Social Proof */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="card p-8 md:p-12 text-center bg-gradient-to-br from-primary-500/5 to-navy-900/50 border-primary-500/20">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-500/20 rounded-full mb-6">
              <span className="text-3xl">💬</span>
            </div>
            <blockquote className="text-xl md:text-2xl text-white font-medium mb-6 leading-relaxed">
              "LearnHub transformed my career. The courses are practical, the instructors are amazing, 
              and the community is incredibly supportive."
            </blockquote>
            <div className="flex items-center justify-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center text-white font-bold">
                SK
              </div>
              <div className="text-left">
                <div className="text-white font-semibold">Sarah Kim</div>
                <div className="text-navy-400 text-sm">Full-Stack Developer</div>
              </div>
            </div>
            <div className="flex justify-center gap-1 mt-4">
              {[1, 2, 3, 4, 5].map((star) => (
                <svg key={star} className="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 20 20">
                  <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                </svg>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-navy-900/30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="card p-12 bg-gradient-to-br from-primary-500/10 to-navy-900/80 border-primary-500/20">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full mb-6 animate-bounce-slow">
              <span className="text-4xl">🚀</span>
            </div>
            <h2 className="text-3xl font-bold text-white mb-4">
              Ready to start learning?
            </h2>
            <p className="text-navy-300 mb-8 text-lg max-w-2xl mx-auto">
              Join thousands of students and start your journey to mastering new skills today.
              Your future self will thank you!
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
      </section>
    </div>
  )
}