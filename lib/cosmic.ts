import { createBucketClient } from '@cosmicjs/sdk'
import type { Course, Lesson, Category, Instructor, ContactFormData } from '@/types'

export const cosmic = createBucketClient({
  bucketSlug: process.env.COSMIC_BUCKET_SLUG as string,
  readKey: process.env.COSMIC_READ_KEY as string,
  writeKey: process.env.COSMIC_WRITE_KEY as string,
  apiEnvironment: 'staging',
})

// Helper function to check for status errors
function hasStatus(error: unknown): error is { status: number } {
  return typeof error === 'object' && error !== null && 'status' in error
}

// Helper function to safely extract metafield values (handles select-dropdown objects)
export function getMetafieldValue(field: unknown): string {
  if (field === null || field === undefined) return ''
  if (typeof field === 'string') return field
  if (typeof field === 'number' || typeof field === 'boolean') return String(field)
  if (typeof field === 'object' && field !== null && 'value' in field) {
    return String((field as { value: unknown }).value)
  }
  if (typeof field === 'object' && field !== null && 'key' in field) {
    return String((field as { key: unknown }).key)
  }
  return ''
}

// Get all courses
export async function getCourses(): Promise<Course[]> {
  try {
    const response = await cosmic.objects
      .find({ type: 'courses' })
      .props(['id', 'slug', 'title', 'metadata'])
      .depth(1)
    
    return response.objects as Course[]
  } catch (error) {
    if (hasStatus(error) && error.status === 404) {
      return []
    }
    throw new Error('Failed to fetch courses')
  }
}

// Get single course by slug
export async function getCourseBySlug(slug: string): Promise<Course | null> {
  try {
    const response = await cosmic.objects
      .findOne({ type: 'courses', slug })
      .props(['id', 'slug', 'title', 'metadata'])
      .depth(1)
    
    return response.object as Course
  } catch (error) {
    if (hasStatus(error) && error.status === 404) {
      return null
    }
    throw new Error('Failed to fetch course')
  }
}

// Get all categories
export async function getCategories(): Promise<Category[]> {
  try {
    const response = await cosmic.objects
      .find({ type: 'categories' })
      .props(['id', 'slug', 'title', 'metadata'])
      .depth(1)
    
    return response.objects as Category[]
  } catch (error) {
    if (hasStatus(error) && error.status === 404) {
      return []
    }
    throw new Error('Failed to fetch categories')
  }
}

// Get single category by slug
export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  try {
    const response = await cosmic.objects
      .findOne({ type: 'categories', slug })
      .props(['id', 'slug', 'title', 'metadata'])
      .depth(1)
    
    return response.object as Category
  } catch (error) {
    if (hasStatus(error) && error.status === 404) {
      return null
    }
    throw new Error('Failed to fetch category')
  }
}

// Get courses by category ID
export async function getCoursesByCategory(categoryId: string): Promise<Course[]> {
  try {
    const response = await cosmic.objects
      .find({ 
        type: 'courses',
        'metadata.categories': categoryId
      })
      .props(['id', 'slug', 'title', 'metadata'])
      .depth(1)
    
    return response.objects as Course[]
  } catch (error) {
    if (hasStatus(error) && error.status === 404) {
      return []
    }
    throw new Error('Failed to fetch courses by category')
  }
}

// Get all instructors
export async function getInstructors(): Promise<Instructor[]> {
  try {
    const response = await cosmic.objects
      .find({ type: 'instructors' })
      .props(['id', 'slug', 'title', 'metadata'])
      .depth(1)
    
    return response.objects as Instructor[]
  } catch (error) {
    if (hasStatus(error) && error.status === 404) {
      return []
    }
    throw new Error('Failed to fetch instructors')
  }
}

// Get single instructor by slug
export async function getInstructorBySlug(slug: string): Promise<Instructor | null> {
  try {
    const response = await cosmic.objects
      .findOne({ type: 'instructors', slug })
      .props(['id', 'slug', 'title', 'metadata'])
      .depth(1)
    
    return response.object as Instructor
  } catch (error) {
    if (hasStatus(error) && error.status === 404) {
      return null
    }
    throw new Error('Failed to fetch instructor')
  }
}

// Get courses by instructor ID
export async function getCoursesByInstructor(instructorId: string): Promise<Course[]> {
  try {
    const response = await cosmic.objects
      .find({ 
        type: 'courses',
        'metadata.instructors': instructorId
      })
      .props(['id', 'slug', 'title', 'metadata'])
      .depth(1)
    
    return response.objects as Course[]
  } catch (error) {
    if (hasStatus(error) && error.status === 404) {
      return []
    }
    throw new Error('Failed to fetch courses by instructor')
  }
}

// Get all lessons
export async function getLessons(): Promise<Lesson[]> {
  try {
    const response = await cosmic.objects
      .find({ type: 'lessons' })
      .props(['id', 'slug', 'title', 'metadata'])
      .depth(1)
    
    // Sort by order field
    const lessons = response.objects as Lesson[]
    return lessons.sort((a, b) => {
      const orderA = a.metadata?.order ?? 999
      const orderB = b.metadata?.order ?? 999
      return orderA - orderB
    })
  } catch (error) {
    if (hasStatus(error) && error.status === 404) {
      return []
    }
    throw new Error('Failed to fetch lessons')
  }
}

// Get single lesson by slug
export async function getLessonBySlug(slug: string): Promise<Lesson | null> {
  try {
    const response = await cosmic.objects
      .findOne({ type: 'lessons', slug })
      .props(['id', 'slug', 'title', 'metadata'])
      .depth(1)
    
    return response.object as Lesson
  } catch (error) {
    if (hasStatus(error) && error.status === 404) {
      return null
    }
    throw new Error('Failed to fetch lesson')
  }
}

// Submit contact form
export async function submitContactForm(data: ContactFormData): Promise<{ success: boolean; error?: string }> {
  try {
    const submittedAt = new Date().toISOString()
    const slug = `contact-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
    
    await cosmic.objects.insertOne({
      title: `Contact from ${data.name}`,
      slug,
      type: 'contact-form-submissions',
      metadata: {
        name: data.name,
        email: data.email,
        subject: data.subject,
        message: data.message,
        submitted_at: submittedAt,
      },
    })
    
    return { success: true }
  } catch (error) {
    console.error('Failed to submit contact form:', error)
    return { 
      success: false, 
      error: 'Failed to submit contact form. Please try again.' 
    }
  }
}