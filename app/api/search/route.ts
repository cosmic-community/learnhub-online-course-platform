import { NextRequest, NextResponse } from 'next/server'
import { getCourses, getCategories } from '@/lib/cosmic'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const query = searchParams.get('q')?.toLowerCase() || ''

  if (!query) {
    return NextResponse.json({ results: [] })
  }

  try {
    const [courses, categories] = await Promise.all([
      getCourses(),
      getCategories(),
    ])

    const results: Array<{
      type: 'course' | 'category'
      slug: string
      title: string
      description?: string
      icon?: string
    }> = []

    // Search courses
    courses.forEach((course) => {
      const title = course.title.toLowerCase()
      const tagline = (course.metadata?.tagline || '').toLowerCase()
      const description = (course.metadata?.description || '').toLowerCase()

      if (title.includes(query) || tagline.includes(query) || description.includes(query)) {
        results.push({
          type: 'course',
          slug: course.slug,
          title: course.title,
          description: course.metadata?.tagline,
        })
      }
    })

    // Search categories
    categories.forEach((category) => {
      const name = (category.metadata?.name || category.title).toLowerCase()
      const description = (category.metadata?.description || '').toLowerCase()

      if (name.includes(query) || description.includes(query)) {
        results.push({
          type: 'category',
          slug: category.slug,
          title: category.metadata?.name || category.title,
          description: category.metadata?.description,
          icon: category.metadata?.icon,
        })
      }
    })

    // Limit results
    return NextResponse.json({ results: results.slice(0, 10) })
  } catch (error) {
    console.error('Search error:', error)
    return NextResponse.json({ results: [] })
  }
}