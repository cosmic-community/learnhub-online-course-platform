import Link from 'next/link'
import { getCourses, getCategories, getInstructors } from '@/lib/cosmic'
import CourseCard from '@/components/CourseCard'
import CategoryCard from '@/components/CategoryCard'
import InstructorCard from '@/components/InstructorCard'

// Motivational quotes for the hero section
const MOTIVATIONAL_QUOTES = [
  { quote: "The capacity to learn is a gift; the ability to learn is a skill; the willingness to learn is a choice.", author: "Brian Herbert" },
  { quote: "Live as if you were to die tomorrow. Learn as if you were to live forever.", author: "Mahatma Gandhi" },
  { quote: "The more that you read, the more things you will know. The more that you learn, the more places you'll go.", author: "Dr. Seuss" },
  { quote: "Education is not the filling of a pail, but the lighting of a fire.", author: "W.B. Yeats" },
  { quote: "An investment in knowledge pays the best interest.", author: "Benjamin Franklin" },
]

function getDailyQuote() {
  const today = new Date()
  const dayIndex = (today.getFullYear() * 365 + today.getMonth() * 30 + today.getDate()) % MOTIVATIONAL_QUOTES.length
  return MOTIVATIONAL_QUOTES[dayIndex]
}

export default async function HomePage() {
  const [courses, categories, instructors] = await Promise.all([
    getCourses(),
    getCategories(),
    getInstructors(),
  ])

  const featuredCourses = courses.slice(0, 3)
  const dailyQuote = getDailyQuote()

  // Calculate some fun stats
  const totalLessons = courses.reduce((acc, course) => {
    const lessons = course.metadata?.lessons
    return acc + (Array.isArray(lessons) ? lessons.length : 0)
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
        
        {/* Floating decorative elements */}
        <div className="absolute top-20 left-10 text-4xl animate-float opacity-20">📚</div>
        <div className="absolute top-40 right-20 text-3xl animate-float opacity-20" style={{ animationDelay: '1s' }}>💡</div>
        <div className="absolute bottom-20 left-1/4 text-2xl animate-float opacity-20" style={{ animationDelay: '2s' }}>🚀</div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="text-center max-w-3xl mx-auto">
            {/* Daily Quote Banner */}
            <div className="mb-8 inline-flex items-center gap-2 bg-primary-500/10 border border-primary-500/20 rounded-full px-4 py-2 text-sm">
              <span className="text-primary-400">💭</span>
              <span className="text-navy-200 italic">&ldquo;{dailyQuote.quote}&rdquo;</span>
              <span className="text-navy-400">— {dailyQuote.author}</span>
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
          </div>
          
          {/* Enhanced Stats */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto">
            <div className="text-center group">
              <div className="bg-navy-800/50 rounded-2xl p-4 border border-navy-700 group-hover:border-primary-500/50 transition-colors">
                <div className="text-3xl font-bold text-white mb-1">{courses.length}+</div>
                <div className="text-navy-400 text-sm">Courses</div>
              </div>
            </div>
            <div className="text-center group">
              <div className="bg-navy-800/50 rounded-2xl p-4 border border-navy-700 group-hover:border-primary-500/50 transition-colors">
                <div className="text-3xl font-bold text-white mb-1">{totalLessons}+</div>
                <div className="text-navy-400 text-sm">Lessons</div>
              </div>
            </div>
            <div className="text-center group">
              <div className="bg-navy-800/50 rounded-2xl p-4 border border-navy-700 group-hover:border-primary-500/50 transition-colors">
                <div className="text-3xl font-bold text-white mb-1">{totalHours}+</div>
                <div className="text-navy-400 text-sm">Hours of Content</div>
              </div>
            </div>
            <div className="text-center group">
              <div className="bg-navy-800/50 rounded-2xl p-4 border border-navy-700 group-hover:border-primary-500/50 transition-colors">
                <div className="text-3xl font-bold text-white mb-1">{instructors.length}+</div>
                <div className="text-navy-400 text-sm">Expert Instructors</div>
              </div>
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
                <span className="text-2xl">🔥</span>
                <span className="text-primary-400 font-semibold text-sm uppercase tracking-wider">Trending Now</span>
              </div>
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

      {/* Why Learn With Us - New Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-2">Why Learn With Us?</h2>
            <p className="text-navy-400">Everything you need to succeed in your learning journey</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="card p-6 text-center group">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <span className="text-3xl">🎯</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Project-Based Learning</h3>
              <p className="text-navy-400">Build real projects that you can add to your portfolio while learning</p>
            </div>
            
            <div className="card p-6 text-center group">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <span className="text-3xl">👨‍🏫</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Expert Instructors</h3>
              <p className="text-navy-400">Learn from industry professionals with years of real-world experience</p>
            </div>
            
            <div className="card p-6 text-center group">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <span className="text-3xl">🔄</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Lifetime Access</h3>
              <p className="text-navy-400">Access course content forever, including all future updates</p>
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
            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-primary-600/10 rounded-full blur-3xl" />
            
            <div className="relative">
              <div className="text-5xl mb-4">🚀</div>
              <h2 className="text-3xl font-bold text-white mb-4">
                Ready to start learning?
              </h2>
              <p className="text-navy-300 mb-8 text-lg">
                Join thousands of students and start your journey to mastering new skills today.
                Your future self will thank you!
              </p>
              <Link href="/courses" className="btn-primary text-lg inline-flex items-center gap-2 animate-pulse-glow">
                Get Started Now
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}