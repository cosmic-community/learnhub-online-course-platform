'use server'

import { submitContactForm } from '@/lib/cosmic'
import type { ContactFormData } from '@/types'

export async function submitContactAction(formData: ContactFormData): Promise<{ success: boolean; error?: string }> {
  // Validate required fields
  if (!formData.name || !formData.email || !formData.subject || !formData.message) {
    return {
      success: false,
      error: 'All fields are required'
    }
  }

  // Basic email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(formData.email)) {
    return {
      success: false,
      error: 'Please enter a valid email address'
    }
  }

  // Call the Cosmic API function (server-side only)
  const result = await submitContactForm(formData)
  
  return result
}