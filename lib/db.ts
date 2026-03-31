import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Interface for Course data
 */
export interface Course {
  id: string;
  name: string;
  category: string;
  isPaid: boolean;
  price: number;
  pricingType: 'single' | 'tiered';
  tieredPrices?: {
    oneMonth: number;
    threeMonths: number;
    sixMonths: number;
    oneYear: number;
    lifetime: number;
  };
  modulesCount: number;
  description: string;
  shortDescription: string;
  image: string;
  published: boolean;
  modules: Module[];
  duration: string;
  seo: {
    title: string;
    description: string;
    keywords: string;
  };
}

export interface Module {
  id: string;
  title: string;
  videos: Video[];
}

export interface Video {
  id: string;
  title: string;
  youtubeUrl: string;
  duration: string;
}

export interface BlogPost {
  id: string;
  title: string;
  shortDescription: string;
  content: string;
  image: string;
  date: string;
  author: string;
  seo: {
    title: string;
    description: string;
    keywords: string;
  };
}

export interface Enrollment {
  id: string;
  userId: string;
  courseId: string;
  enrolledAt: string;
  progress: number; // percentage
  completedVideos: string[]; // array of video IDs
  status: 'active' | 'completed';
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'admin';
  avatar?: string;
}

export interface Payment {
  id: string;
  userId: string;
  courseId: string;
  amount: number;
  status: 'success' | 'failed';
  date: string;
  plan: string;
}

// Helper for Tailwind classes
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// LocalStorage Keys
const KEYS = {
  COURSES: 'dapplesoft_courses',
  BLOGS: 'dapplesoft_blogs',
  ENROLLMENTS: 'dapplesoft_enrollments',
  USER: 'dapplesoft_user',
  PAYMENTS: 'dapplesoft_payments',
};

// Initial Seed Data
export const CATEGORIES = [
  'Web Development',
  'Mobile Development',
  'Data Science',
  'Machine Learning',
  'Artificial Intelligence',
  'Cloud Computing',
  'DevOps',
  'Cyber Security',
  'Game Development',
  'UI/UX Design',
  'Digital Marketing',
  'Business Analytics',
  'Blockchain',
  'Internet of Things',
  'Embedded Systems',
  'Software Engineering',
  'Database Management',
  'Network Engineering',
  'Project Management',
  'Agile & Scrum',
  'Python Programming',
  'JavaScript Mastery',
  'Java Development',
  'C++ Programming',
  'PHP & Laravel',
  'Ruby on Rails',
  'Swift & iOS',
  'Kotlin & Android',
  'React & Next.js',
  'Angular & Vue'
];

export const INITIAL_COURSES: Course[] = [
  {
    id: '1',
    name: 'Mastering C# & .NET Core',
    category: 'Programming',
    isPaid: true,
    price: 49.99,
    pricingType: 'tiered',
    tieredPrices: {
      oneMonth: 9.99,
      threeMonths: 24.99,
      sixMonths: 39.99,
      oneYear: 69.99,
      lifetime: 99.99
    },
    modulesCount: 3,
    shortDescription: 'Comprehensive guide to modern C# development.',
    description: 'Learn C# from scratch to advanced topics including LINQ, Async/Await, and ASP.NET Core Web APIs.',
    image: 'https://picsum.photos/seed/csharp/800/600',
    published: true,
    duration: '20h',
    seo: { title: 'C# Masterclass', description: 'Learn C#', keywords: 'c#, .net' },
    modules: [
      {
        id: 'm1',
        title: 'Introduction to C#',
        videos: [
          { id: 'v1', title: 'Getting Started', youtubeUrl: 'https://www.youtube.com/watch?v=GhQdlIFylQ8', duration: '10:00' },
          { id: 'v2', title: 'Variables & Types', youtubeUrl: 'https://www.youtube.com/watch?v=GhQdlIFylQ8', duration: '15:00' },
        ]
      },
      {
        id: 'm2',
        title: 'Object Oriented Programming',
        videos: [
          { id: 'v3', title: 'Classes & Objects', youtubeUrl: 'https://www.youtube.com/watch?v=GhQdlIFylQ8', duration: '20:00' },
        ]
      }
    ]
  },
  {
    id: '2',
    name: 'Linux for DevOps',
    category: 'DevOps',
    isPaid: false,
    price: 0,
    pricingType: 'single',
    modulesCount: 2,
    shortDescription: 'Master the Linux command line for server management.',
    description: 'Essential Linux skills for developers and DevOps engineers.',
    image: 'https://picsum.photos/seed/linux/800/600',
    published: true,
    duration: '12h',
    seo: { title: 'Linux DevOps', description: 'Learn Linux', keywords: 'linux, devops' },
    modules: [
      {
        id: 'm3',
        title: 'Bash Basics',
        videos: [
          { id: 'v4', title: 'The Terminal', youtubeUrl: 'https://www.youtube.com/watch?v=GhQdlIFylQ8', duration: '12:00' },
        ]
      }
    ]
  }
];

export const INITIAL_BLOGS: BlogPost[] = [
  {
    id: '1',
    title: 'The Future of AI in Programming',
    shortDescription: 'How AI is changing the way we write code in 2026.',
    content: 'AI is no longer just a tool; it is becoming a partner in the development process...',
    image: 'https://picsum.photos/seed/ai/800/600',
    date: '2026-03-25',
    author: 'Admin',
    seo: { title: 'AI in Programming', description: 'AI future', keywords: 'ai, code' }
  }
];

// DB Utility
export const db = {
  getCourses: (): Course[] => {
    if (typeof window === 'undefined') return [];
    const data = localStorage.getItem(KEYS.COURSES);
    if (!data) {
      localStorage.setItem(KEYS.COURSES, JSON.stringify(INITIAL_COURSES));
      return INITIAL_COURSES;
    }
    const courses = JSON.parse(data);
    // Migration: ensure pricingType exists
    return courses.map((c: any) => ({
      ...c,
      pricingType: c.pricingType || 'single',
      image: (c.image === 't' || !c.image) ? 'https://picsum.photos/seed/default/800/600' : c.image
    }));
  },
  saveCourses: (courses: Course[]) => {
    localStorage.setItem(KEYS.COURSES, JSON.stringify(courses));
  },
  getBlogs: (): BlogPost[] => {
    if (typeof window === 'undefined') return [];
    const data = localStorage.getItem(KEYS.BLOGS);
    if (!data) {
      localStorage.setItem(KEYS.BLOGS, JSON.stringify(INITIAL_BLOGS));
      return INITIAL_BLOGS;
    }
    return JSON.parse(data).map((b: any) => ({
      ...b,
      image: (b.image === 't' || !b.image) ? 'https://picsum.photos/seed/default/800/600' : b.image
    }));
  },
  saveBlogs: (blogs: BlogPost[]) => {
    localStorage.setItem(KEYS.BLOGS, JSON.stringify(blogs));
  },
  getEnrollments: (): Enrollment[] => {
    if (typeof window === 'undefined') return [];
    const data = localStorage.getItem(KEYS.ENROLLMENTS);
    return data ? JSON.parse(data) : [];
  },
  saveEnrollments: (enrollments: Enrollment[]) => {
    localStorage.setItem(KEYS.ENROLLMENTS, JSON.stringify(enrollments));
  },
  getCurrentUser: (): User | null => {
    if (typeof window === 'undefined') return null;
    const data = localStorage.getItem(KEYS.USER);
    return data ? JSON.parse(data) : null;
  },
  setCurrentUser: (user: User | null) => {
    if (user) localStorage.setItem(KEYS.USER, JSON.stringify(user));
    else localStorage.removeItem(KEYS.USER);
  },
  getPayments: (): Payment[] => {
    if (typeof window === 'undefined') return [];
    const data = localStorage.getItem(KEYS.PAYMENTS);
    return data ? JSON.parse(data) : [];
  },
  savePayments: (payments: Payment[]) => {
    localStorage.setItem(KEYS.PAYMENTS, JSON.stringify(payments));
  }
};
