# LearnHub - Online Course Platform

![LearnHub Platform](https://imgix.cosmicjs.com/0a22d6f0-f821-11f0-a079-1de84a4d3baf-photo-1498050108023-c5249f4df085-1769148123238.jpg?w=1200&h=300&fit=crop&auto=format,compress)

A modern online learning platform built with Next.js and Cosmic, featuring courses, instructors, lessons, and category-based navigation.

## Features

- 📚 **Course Catalog** - Browse courses with category and difficulty filtering
- 👨‍🏫 **Instructor Profiles** - View instructor bios, credentials, and courses
- 📖 **Lesson Content** - Rich markdown content with code examples and video embeds
- 🏷️ **Category System** - Organize courses by topic with emoji icons
- 💰 **Pricing Display** - Show free and paid course options
- ⏱️ **Duration Tracking** - Display estimated course hours and lesson minutes
- 📱 **Responsive Design** - Optimized for all device sizes
- 🎨 **Modern UI** - Clean design with smooth animations

## Clone this Project

Want to create your own version of this project with all the content and structure? Clone this Cosmic bucket and code repository to get started instantly:

[![Clone this Project](https://img.shields.io/badge/Clone%20this%20Project-29abe2?style=for-the-badge&logo=cosmic&logoColor=white)](https://app.cosmic-staging.com/projects/new?clone_bucket=69730e1201043424a196d202&clone_repository=6973104301043424a196d298)

## Prompts

This application was built using the following prompts to generate the content structure and code:

### Content Model Prompt

> "What are some popular websites to power with content from a headless CMS. Most useful to novel ideas."

### Code Generation Prompt

> "Based on the content model I created, build a complete web application that showcases this content. Include a modern, responsive design with proper navigation, content display, and user-friendly interface."

The app has been tailored to work with your existing Cosmic content structure and includes all the features requested above.

## Technologies

- [Next.js 16](https://nextjs.org/) - React framework with App Router
- [Cosmic](https://www.cosmicjs.com/) - Headless CMS for content management
- [TypeScript](https://www.typescriptlang.org/) - Type-safe JavaScript
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [React Markdown](https://github.com/remarkjs/react-markdown) - Markdown rendering
- [React Syntax Highlighter](https://github.com/react-syntax-highlighter/react-syntax-highlighter) - Code highlighting

## Getting Started

### Prerequisites

- Node.js 18+ or Bun
- A Cosmic account with the course content model

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd learnhub
```

2. Install dependencies:
```bash
bun install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

Add your Cosmic credentials:
```env
COSMIC_BUCKET_SLUG=your-bucket-slug
COSMIC_READ_KEY=your-read-key
COSMIC_WRITE_KEY=your-write-key
```

4. Run the development server:
```bash
bun dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## Cosmic SDK Examples

### Fetching Courses with Related Data

```typescript
import { cosmic } from '@/lib/cosmic'

// Get all courses with instructors, categories, and lessons
const { objects: courses } = await cosmic.objects
  .find({ type: 'courses' })
  .props(['id', 'slug', 'title', 'metadata'])
  .depth(1)

// Get a single course by slug
const { object: course } = await cosmic.objects
  .findOne({ type: 'courses', slug: 'web-development-fundamentals' })
  .props(['id', 'slug', 'title', 'metadata'])
  .depth(1)
```

### Querying by Category

```typescript
// Get courses in a specific category
const { objects: courses } = await cosmic.objects
  .find({ 
    type: 'courses',
    'metadata.categories': categoryId 
  })
  .props(['id', 'slug', 'title', 'metadata'])
  .depth(1)
```

## Cosmic CMS Integration

This application uses the following Cosmic object types:

| Object Type | Description |
|-------------|-------------|
| **Courses** | Main course content with title, description, pricing, and related objects |
| **Lessons** | Individual lesson content with video URLs, markdown content, and code examples |
| **Categories** | Course categories with name, description, and emoji icon |
| **Instructors** | Instructor profiles with bio, photo, and credentials |

### Content Model Structure

- **Courses** link to Instructors, Categories, and Lessons via object metafields
- **Lessons** are ordered within courses using the `order` field
- **Categories** and **Instructors** can be shared across multiple courses

## Deployment

### Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

1. Push your code to a Git repository
2. Import the project to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

### Deploy to Netlify

1. Push your code to a Git repository
2. Connect to Netlify
3. Set build command: `bun run build`
4. Set publish directory: `.next`
5. Add environment variables
6. Deploy!

## License

MIT License - feel free to use this project for your own learning platform!

<!-- README_END -->