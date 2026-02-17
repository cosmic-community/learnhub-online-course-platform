import Link from 'next/link'
import { getCourses, getCategories, getInstructors } from '@/lib/cosmic'
import CourseCard from '@/components/CourseCard'
import CategoryCard from '@/components/CategoryCard'
import InstructorCard from '@/components/InstructorCard'
import CourseQuiz from '@/components/CourseQuiz'
import LearningPathCard from '@/components/LearningPathCard'
import StatsCounter from '@/components/StatsCounter'

export default async function HomePage() {
  const [courses, categories, instructors] = await Promise.all([
    getCourses(),
    getCategories(),
    getInstructors(),
  ])

  const featuredCourses = courses.slice(0, 3)
  
  // Calculate total learning hours
  const totalHours = courses.reduce((sum, course) => sum + (course.metadata?.estimated_hours || 0), 0)
  
  // Calculate total lessons
  const totalLessons = courses.reduce((sum, course) => sum + (course.metadata?.lessons?.length || 0), 0)

  // Define learning paths based on categories
  const learningPaths = [
    {
      title: 'Web Development Path',
      description: 'Master frontend and backend development from HTML to full-stack applications',
      icon: '💻',
      color: 'teal' as const,
      courses: courses.filter(c => c.metadata?.categories?.some(cat => cat.slug === 'web-development')).length || 4,
      hours: 25,
      href: '/categories/web-development',
    },
    {
      title: 'Cloud & DevOps Path',
      description: 'Learn AWS, Docker, and modern cloud infrastructure practices',
      icon: '☁️',
      color: 'blue' as const,
      courses: courses.filter(c => c.metadata?.categories?.some(cat => cat.slug === 'cloud-computing')).length || 3,
      hours: 18,
      href: '/categories/cloud-computing',
    },
    {
      title: 'Mobile Development Path',
      description: 'Build iOS and Android apps with native and cross-platform tools',
      icon: '📱',
      color: 'purple' as const,
      courses: courses.filter(c => c.metadata?.categories?.some(cat => cat.slug === 'mobile-development')).length || 2,
      hours: 15,
      href: '/categories/mobile-development',
    },
    {
      title: 'Data Science Path',
      description: 'Master Python, machine learning, and data visualization',
      icon: '📊',
      color: 'orange' as const,
      courses: courses.filter(c => c.metadata?.categories?.some(cat => cat.slug === 'data-science')).length || 2,
      hours: 20,
      href: '/categories/data-science',
    },
  ]

  return (
    <div>
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-500/10 via-transparent to-navy-950" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-primary-500/5 rounded-full blur-3xl" />
        
        {/* Floating Elements */}
        <div className="absolute top-20 left-10 text-4xl animate-float opacity-20">🚀</div>
        <div className="absolute top-40 right-20 text-3xl animate-float stagger-2 opacity-20">💡</div>
        <div className="absolute bottom-20 left-1/4 text-3xl animate-float stagger-3 opacity-20">⚡</div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-primary-500/10 border border-primary-500/20 rounded-full px-4 py-2 mb-6 animate-fadeIn">
              <span className="text-primary-400 text-sm font-medium">✨ New courses added weekly</span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight animate-slideUp">
              Learn skills that
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-primary-600"> advance your career</span>
            </h1>
            <p className="text-xl text-navy-300 mb-8 animate-slideUp stagger-1">
              Master web development, cloud computing, and more with expert-led courses. 
              Start your learning journey today.
            </p>
            
            {/* Course Quiz CTA */}
            <div className="flex flex-col items-center gap-6 animate-slideUp stagger-2">
              <CourseQuiz courses={courses} categories={categories} />
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/courses" className="btn-secondary text-lg">
                  Browse All Courses
                </Link>
                <Link href="/categories" className="text-navy-400 hover:text-white transition-colors flex items-center gap-2 px-6 py-3">
                  Explore Categories
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
          
          {/* Animated Stats */}
          <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            <StatsCounter value={courses.length} suffix="+" label="Courses" />
            <StatsCounter value={totalLessons} suffix="+" label="Lessons" />
            <StatsCounter value={instructors.length} suffix="+" label="Instructors" />
            <StatsCounter value={totalHours} suffix="h" label="Content" />
          </div>
        </div>
      </section>

      {/* Learning Paths Section */}
      <section className="py-20 bg-gradient-to-b from-navy-950 to-navy-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-primary-400 font-medium text-sm uppercase tracking-wider mb-2 block">Structured Learning</span>
            <h2 className="text-3xl font-bold text-white mb-2">Choose Your Path</h2>
            <p className="text-navy-400 max-w-2xl mx-auto">
              Follow curated learning paths designed to take you from beginner to job-ready
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {learningPaths.map((path, index) => (
              <div key={path.title} className={`animate-slideUp stagger-${index + 1}`}>
                <LearningPathCard path={path} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Courses */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-12">
            <div>
              <span className="text-primary-400 font-medium text-sm uppercase tracking-wider mb-2 block">Top Picks</span>
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

      {/* Categories */}
      <section className="py-20 bg-navy-900/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-primary-400 font-medium text-sm uppercase tracking-wider mb-2 block">Explore Topics</span>
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
            <span className="text-primary-400 font-medium text-sm uppercase tracking-wider mb-2 block">World-Class Experts</span>
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
          <div className="relative">
            {/* Decorative elements */}
            <div className="absolute -top-10 left-1/4 text-5xl opacity-10 animate-float">🎓</div>
            <div className="absolute -top-5 right-1/4 text-4xl opacity-10 animate-float stagger-2">💪</div>
            
            <div className="card p-12 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-primary-500/5 to-transparent" />
              <div className="relative z-10">
                <span className="text-5xl mb-6 block">🚀</span>
                <h2 className="text-3xl font-bold text-white mb-4">
                  Ready to start learning?
                </h2>
                <p className="text-navy-300 mb-8 text-lg max-w-xl mx-auto">
                  Join thousands of students and start your journey to mastering new skills today. 
                  No credit card required to get started.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link href="/courses" className="btn-primary text-lg animate-pulse-glow">
                    Get Started Free
                  </Link>
                  <Link href="/contact" className="btn-secondary text-lg">
                    Contact Us
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}