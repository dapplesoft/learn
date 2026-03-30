'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { db, Course, BlogPost, Enrollment, Payment, User, Module, Video } from '@/lib/db';
import { cn } from '@/lib/utils';
import { 
  LayoutDashboard, 
  BookOpen, 
  Users, 
  DollarSign, 
  FileText, 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  TrendingUp,
  BarChart3,
  PieChart as PieChartIcon,
  Download,
  Settings,
  LogOut,
  CheckCircle2,
  XCircle,
  ChevronDown,
  ChevronUp,
  Video as VideoIcon,
  Clock
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell,
  LineChart,
  Line
} from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [courses, setCourses] = useState<Course[]>([]);
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [editingCourse, setEditingCourse] = useState<Course | 'new' | null>(null);
  const [currentPricingType, setCurrentPricingType] = useState<'single' | 'tiered'>('single');
  const [currentIsPaid, setCurrentIsPaid] = useState<boolean>(false);
  const [editingBlog, setEditingBlog] = useState<BlogPost | 'new' | null>(null);
  const [formModules, setFormModules] = useState<Module[]>([]);

  const addModule = () => {
    const newModule: Module = {
      id: Math.random().toString(36).substr(2, 9),
      title: `Module ${formModules.length + 1}`,
      videos: []
    };
    setFormModules([...formModules, newModule]);
  };

  const removeModule = (moduleId: string) => {
    setFormModules(formModules.filter(m => m.id !== moduleId));
  };

  const updateModuleTitle = (moduleId: string, title: string) => {
    setFormModules(formModules.map(m => m.id === moduleId ? { ...m, title } : m));
  };

  const addVideo = (moduleId: string) => {
    setFormModules(formModules.map(m => {
      if (m.id === moduleId) {
        const newVideo: Video = {
          id: Math.random().toString(36).substr(2, 9),
          title: '',
          youtubeUrl: '',
          duration: '0'
        };
        return { ...m, videos: [...m.videos, newVideo] };
      }
      return m;
    }));
  };

  const removeVideo = (moduleId: string, videoId: string) => {
    setFormModules(formModules.map(m => {
      if (m.id === moduleId) {
        return { ...m, videos: m.videos.filter(v => v.id !== videoId) };
      }
      return m;
    }));
  };

  const updateVideo = (moduleId: string, videoId: string, field: keyof Video, value: string) => {
    setFormModules(formModules.map(m => {
      if (m.id === moduleId) {
        return {
          ...m,
          videos: m.videos.map(v => v.id === videoId ? { ...v, [field]: value } : v)
        };
      }
      return m;
    }));
  };

  const calculateTotalDuration = () => {
    let totalMinutes = 0;
    formModules.forEach(m => {
      m.videos.forEach(v => {
        const mins = parseInt(v.duration) || 0;
        totalMinutes += mins;
      });
    });
    
    if (totalMinutes < 60) return `${totalMinutes}m`;
    const hours = Math.floor(totalMinutes / 60);
    const mins = totalMinutes % 60;
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
  };

  useEffect(() => {
    const currentUser = db.getCurrentUser();
    if (!currentUser || currentUser.role !== 'admin') {
      window.location.href = '/login';
      return;
    }

    const timer = setTimeout(() => {
      setUser(currentUser);
      setCourses(db.getCourses());
      setBlogs(db.getBlogs());
      setEnrollments(db.getEnrollments());
      setPayments(db.getPayments());
    }, 0);

    return () => clearTimeout(timer);
  }, []);

  const stats = [
    { label: 'Total Revenue', value: `$${payments.reduce((acc, p) => acc + p.amount, 0).toFixed(2)}`, icon: DollarSign, color: 'text-green-500' },
    { label: 'Total Students', value: new Set(enrollments.map(e => e.userId)).size, icon: Users, color: 'text-blue-500' },
    { label: 'Courses', value: courses.length, icon: BookOpen, color: 'text-purple-500' },
    { label: 'Enrollments', value: enrollments.length, icon: TrendingUp, color: 'text-amber-500' },
  ];

  const revenueData = courses.map(c => ({
    name: c.name,
    revenue: payments.filter(p => p.courseId === c.id).reduce((acc, p) => acc + p.amount, 0)
  }));

  const freeVsPaidData = [
    { name: 'Free', value: courses.filter(c => !c.isPaid).length },
    { name: 'Paid', value: courses.filter(c => c.isPaid).length },
  ];

  const monthlyRevenueData = payments.reduce((acc, p) => {
    const month = new Date(p.date).toLocaleString('default', { month: 'short' });
    const existing = acc.find(item => item.name === month);
    if (existing) {
      existing.revenue += p.amount;
    } else {
      acc.push({ name: month, revenue: p.amount });
    }
    return acc;
  }, [] as { name: string, revenue: number }[]);

  const COLORS = ['#3b82f6', '#f59e0b', '#10b981', '#ef4444'];

  const handleExportCSV = () => {
    const headers = ['Student ID', 'Course ID', 'Date', 'Amount', 'Status', 'Plan'];
    const csvContent = [
      headers.join(','),
      ...payments.map(p => [
        p.userId,
        p.courseId,
        new Date(p.date).toISOString(),
        p.amount,
        p.status,
        p.plan || 'N/A'
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `payments_export_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const renderOverview = () => (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {stats.map((s, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-xl bg-slate-50 ${s.color}`}>
                <s.icon className="h-6 w-6" />
              </div>
            </div>
            <div className="text-2xl font-bold mb-1 text-slate-900">{s.value}</div>
            <div className="text-slate-500 text-sm font-medium">{s.label}</div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm">
          <h3 className="text-lg font-bold mb-6 flex items-center space-x-2 text-slate-900">
            <BarChart3 className="h-5 w-5 text-blue-600" />
            <span>Revenue per Course</span>
          </h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} />
                <YAxis stroke="#94a3b8" fontSize={12} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  itemStyle={{ color: '#0f172a' }}
                />
                <Bar dataKey="revenue" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm">
          <h3 className="text-lg font-bold mb-6 flex items-center space-x-2 text-slate-900">
            <PieChartIcon className="h-5 w-5 text-purple-600" />
            <span>Free vs Paid Courses</span>
          </h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={freeVsPaidData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {freeVsPaidData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent Payments */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
          <h3 className="text-lg font-bold text-slate-900">Recent Payments</h3>
          <button 
            onClick={handleExportCSV}
            className="text-blue-600 hover:text-blue-700 text-sm font-bold flex items-center space-x-1 transition-colors"
          >
            <Download className="h-4 w-4" />
            <span>Export CSV</span>
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-widest">
                <th className="px-6 py-4 font-bold">Student</th>
                <th className="px-6 py-4 font-bold">Course</th>
                <th className="px-6 py-4 font-bold">Date</th>
                <th className="px-6 py-4 font-bold">Amount</th>
                <th className="px-6 py-4 font-bold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {payments.slice(0, 5).map((p) => (
                <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 text-sm font-medium text-slate-900">{p.userId}</td>
                  <td className="px-6 py-4 text-sm text-slate-600">
                    {courses.find(c => c.id === p.courseId)?.name}
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-500">{new Date(p.date).toLocaleDateString()}</td>
                  <td className="px-6 py-4 text-sm font-bold text-slate-900">${p.amount}</td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center space-x-1 px-2 py-1 rounded-full bg-green-50 text-green-600 text-xs font-bold">
                      <CheckCircle2 className="h-3 w-3" />
                      <span>Success</span>
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const handleSaveBlog = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const newBlog: BlogPost = {
      id: editingBlog === 'new' ? Math.random().toString(36).substr(2, 9) : (editingBlog as BlogPost).id,
      title: formData.get('title') as string,
      shortDescription: formData.get('shortDescription') as string,
      content: formData.get('content') as string,
      image: formData.get('image') as string,
      date: formData.get('date') as string,
      author: formData.get('author') as string,
      seo: {
        title: formData.get('seoTitle') as string,
        description: formData.get('seoDescription') as string,
        keywords: formData.get('seoKeywords') as string,
      }
    };

    const updatedBlogs = editingBlog === 'new' 
      ? [...blogs, newBlog]
      : blogs.map(b => b.id === newBlog.id ? newBlog : b);
      
    db.saveBlogs(updatedBlogs);
    setBlogs(updatedBlogs);
    setEditingBlog(null);
  };

  const handleDeleteBlog = (id: string) => {
    if (confirm('Are you sure you want to delete this blog post?')) {
      const updatedBlogs = blogs.filter(b => b.id !== id);
      db.saveBlogs(updatedBlogs);
      setBlogs(updatedBlogs);
    }
  };

  const renderBlogs = () => {
    if (editingBlog) {
      const isNew = editingBlog === 'new';
      const blog = isNew ? null : editingBlog as BlogPost;
      return (
        <div className="bg-white border border-slate-200 p-8 rounded-2xl shadow-sm">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">{isNew ? 'Create New Blog Post' : 'Edit Blog Post'}</h2>
            <button onClick={() => setEditingBlog(null)} className="text-slate-500 hover:text-slate-900 font-medium transition-colors">Cancel</button>
          </div>
          <form onSubmit={handleSaveBlog} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Title</label>
                <input name="title" defaultValue={blog?.title} required className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Author</label>
                <input name="author" defaultValue={blog?.author || user?.name} required className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Date</label>
                <input name="date" type="date" defaultValue={blog?.date || new Date().toISOString().split('T')[0]} required className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Image URL</label>
                <input name="image" defaultValue={blog?.image} required className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all" />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Short Description</label>
              <textarea name="shortDescription" defaultValue={blog?.shortDescription} required rows={2} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Content (Markdown/HTML supported)</label>
              <textarea name="content" defaultValue={blog?.content} required rows={8} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 font-mono text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all" />
            </div>

            <div className="border-t border-slate-100 pt-6 mt-6">
              <h3 className="text-lg font-bold mb-6 text-slate-900">SEO Settings</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">SEO Title</label>
                  <input name="seoTitle" defaultValue={blog?.seo?.title} required className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">SEO Description</label>
                  <input name="seoDescription" defaultValue={blog?.seo?.description} required className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">SEO Keywords</label>
                  <input name="seoKeywords" defaultValue={blog?.seo?.keywords} required className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all" />
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-6">
              <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-bold transition-all shadow-lg shadow-blue-200">
                Save Blog Post
              </button>
            </div>
          </form>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Blog Management</h2>
          <button onClick={() => setEditingBlog('new')} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-bold flex items-center space-x-2 transition-all shadow-lg shadow-blue-200">
            <Plus className="h-5 w-5" />
            <span>Create New Post</span>
          </button>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {blogs.map((blog) => (
            <div key={blog.id} className="bg-white border border-slate-200 p-6 rounded-2xl flex items-center justify-between shadow-sm hover:shadow-md transition-all">
              <div className="flex items-center space-x-6">
                <div className="relative w-20 h-12 rounded-lg overflow-hidden shadow-sm">
                  <Image src={blog.image} alt={blog.title} fill className="object-cover" referrerPolicy="no-referrer" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-slate-900">{blog.title}</h3>
                  <div className="flex items-center space-x-4 text-xs text-slate-500 mt-1 font-medium">
                    <span>{new Date(blog.date).toLocaleDateString()}</span>
                    <span>By {blog.author}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button onClick={() => setEditingBlog(blog)} className="p-2 hover:bg-slate-50 rounded-lg text-slate-400 hover:text-blue-600 transition-all">
                  <Edit className="h-5 w-5" />
                </button>
                <button onClick={() => handleDeleteBlog(blog.id)} className="p-2 hover:bg-slate-50 rounded-lg text-slate-400 hover:text-red-500 transition-all">
                  <Trash2 className="h-5 w-5" />
                </button>
                <Link href={`/blog/${blog.id}`} className="p-2 hover:bg-slate-50 rounded-lg text-slate-400 hover:text-blue-600 transition-all">
                  <Eye className="h-5 w-5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderStudents = () => {
    // Group enrollments by user
    const studentData = enrollments.reduce((acc, curr) => {
      if (!acc[curr.userId]) {
        acc[curr.userId] = {
          userId: curr.userId,
          enrollments: []
        };
      }
      acc[curr.userId].enrollments.push(curr);
      return acc;
    }, {} as Record<string, { userId: string, enrollments: Enrollment[] }>);

    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Student Analytics</h2>
        </div>
        
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-widest border-b border-slate-200">
                  <th className="px-6 py-4 font-bold">Student ID</th>
                  <th className="px-6 py-4 font-bold">Enrolled Courses</th>
                  <th className="px-6 py-4 font-bold">Avg. Progress</th>
                  <th className="px-6 py-4 font-bold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {Object.values(studentData).map((student) => {
                  const avgProgress = student.enrollments.reduce((acc, curr) => acc + curr.progress, 0) / student.enrollments.length;
                  return (
                    <tr key={student.userId} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4 text-sm font-medium">{student.userId}</td>
                      <td className="px-6 py-4 text-sm text-slate-600">
                        {student.enrollments.length} courses
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <div className="w-full bg-slate-100 rounded-full h-2 max-w-[100px]">
                            <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${avgProgress}%` }}></div>
                          </div>
                          <span className="text-xs text-slate-500">{Math.round(avgProgress)}%</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center space-x-1 px-2 py-1 rounded-full bg-blue-500/10 text-blue-600 text-xs font-bold">
                          Active
                        </span>
                      </td>
                    </tr>
                  );
                })}
                {Object.keys(studentData).length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-6 py-8 text-center text-slate-400">No students enrolled yet.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  const renderRevenue = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Revenue & Analytics</h2>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm">
          <h3 className="text-lg font-bold mb-6 flex items-center space-x-2">
            <BarChart3 className="h-5 w-5 text-blue-500" />
            <span>Revenue per Course</span>
          </h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} />
                <YAxis stroke="#94a3b8" fontSize={12} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px' }}
                  itemStyle={{ color: '#1e293b' }}
                />
                <Bar dataKey="revenue" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm">
          <h3 className="text-lg font-bold mb-6 flex items-center space-x-2">
            <TrendingUp className="h-5 w-5 text-green-500" />
            <span>Monthly Revenue</span>
          </h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyRevenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} />
                <YAxis stroke="#94a3b8" fontSize={12} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px' }}
                  itemStyle={{ color: '#1e293b' }}
                />
                <Line type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={3} dot={{ r: 4, fill: '#10b981' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );

  const renderVideoAnalytics = () => {
    // Calculate completion stats per video
    const videoStats: Record<string, { title: string, courseName: string, completions: number }> = {};
    
    courses.forEach(course => {
      course.modules.forEach(module => {
        module.videos.forEach(video => {
          videoStats[video.id] = {
            title: video.title,
            courseName: course.name,
            completions: 0
          };
        });
      });
    });

    enrollments.forEach(enrollment => {
      enrollment.completedVideos.forEach(videoId => {
        if (videoStats[videoId]) {
          videoStats[videoId].completions += 1;
        }
      });
    });

    const sortedVideos = Object.values(videoStats).sort((a, b) => b.completions - a.completions);

    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Video Analytics</h2>
        </div>
        
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-widest border-b border-slate-200">
                  <th className="px-6 py-4 font-bold">Video Title</th>
                  <th className="px-6 py-4 font-bold">Course</th>
                  <th className="px-6 py-4 font-bold">Total Completions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {sortedVideos.map((stat, idx) => (
                  <tr key={idx} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 text-sm font-medium">{stat.title}</td>
                    <td className="px-6 py-4 text-sm text-slate-500">{stat.courseName}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-bold text-blue-600">{stat.completions}</span>
                        <span className="text-xs text-slate-400">students</span>
                      </div>
                    </td>
                  </tr>
                ))}
                {sortedVideos.length === 0 && (
                  <tr>
                    <td colSpan={3} className="px-6 py-8 text-center text-slate-400">No video data available.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  const handleSaveCourse = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const newCourse: Course = {
      id: editingCourse === 'new' ? Math.random().toString(36).substr(2, 9) : (editingCourse as Course).id,
      name: formData.get('name') as string,
      category: formData.get('category') as string,
      isPaid: formData.get('isPaid') === 'true',
      price: formData.get('isPaid') === 'true' ? Number(formData.get('price')) : 0,
      pricingType: formData.get('isPaid') === 'true' ? (formData.get('pricingType') as 'single' | 'tiered') : 'single',
      tieredPrices: (formData.get('isPaid') === 'true' && formData.get('pricingType') === 'tiered') ? {
        oneMonth: Number(formData.get('oneMonth')),
        threeMonths: Number(formData.get('threeMonths')),
        sixMonths: Number(formData.get('sixMonths')),
        oneYear: Number(formData.get('oneYear')),
        lifetime: Number(formData.get('lifetime')),
      } : undefined,
      modulesCount: formModules.length,
      description: formData.get('description') as string,
      shortDescription: formData.get('shortDescription') as string,
      image: formData.get('image') as string,
      published: formData.get('published') === 'true',
      duration: calculateTotalDuration(),
      seo: {
        title: formData.get('seoTitle') as string,
        description: formData.get('seoDescription') as string,
        keywords: formData.get('seoKeywords') as string,
      },
      modules: formModules,
    };

    const updatedCourses = editingCourse === 'new' 
      ? [...courses, newCourse]
      : courses.map(c => c.id === newCourse.id ? newCourse : c);
      
    db.saveCourses(updatedCourses);
    setCourses(updatedCourses);
    setEditingCourse(null);
    setCurrentPricingType('single');
    setCurrentIsPaid(false);
  };

  const handleDeleteCourse = (id: string) => {
    if (confirm('Are you sure you want to delete this course?')) {
      const updatedCourses = courses.filter(c => c.id !== id);
      db.saveCourses(updatedCourses);
      setCourses(updatedCourses);
    }
  };

  const renderCourses = () => {
    if (editingCourse) {
      const isNew = editingCourse === 'new';
      const course = isNew ? null : editingCourse as Course;
      return (
        <div className="bg-white border border-slate-200 p-8 rounded-2xl shadow-sm">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">{isNew ? 'Create New Course' : 'Edit Course'}</h2>
            <button onClick={() => { setEditingCourse(null); setCurrentPricingType('single'); setCurrentIsPaid(false); }} className="text-slate-500 hover:text-slate-900 font-medium transition-colors">Cancel</button>
          </div>
          <form onSubmit={handleSaveCourse} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Course Name</label>
                <input name="name" defaultValue={course?.name} required className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Category</label>
                <input name="category" defaultValue={course?.category} required className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Image URL</label>
                <input name="image" defaultValue={course?.image} required className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Is Paid?</label>
                <select 
                  name="isPaid" 
                  defaultValue={course?.isPaid ? 'true' : 'false'} 
                  onChange={(e) => setCurrentIsPaid(e.target.value === 'true')}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                >
                  <option value="false">Free</option>
                  <option value="true">Paid</option>
                </select>
              </div>
              {currentIsPaid ? (
                <>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Base Price ($) - Lifetime</label>
                    <input name="price" type="number" step="0.01" defaultValue={course?.price || 0} required className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Pricing System</label>
                    <select 
                      name="pricingType" 
                      defaultValue={course?.pricingType || 'single'} 
                      onChange={(e) => setCurrentPricingType(e.target.value as 'single' | 'tiered')}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                    >
                      <option value="single">Single Price (Lifetime)</option>
                      <option value="tiered">Tiered Pricing (1m, 3m, 6m, 1y, Lifetime)</option>
                    </select>
                  </div>
                  {currentPricingType === 'tiered' && (
                    <div className="col-span-full grid grid-cols-1 md:grid-cols-5 gap-4 p-4 bg-blue-50/50 rounded-2xl border border-blue-100">
                      <div className="col-span-full">
                        <h4 className="text-sm font-bold text-blue-900 mb-2">Tiered Pricing Details ($)</h4>
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-blue-700 uppercase mb-1">1 Month</label>
                        <input name="oneMonth" type="number" step="0.01" defaultValue={course?.tieredPrices?.oneMonth || 0} className="w-full bg-white border border-blue-200 rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-500/20 outline-none" />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-blue-700 uppercase mb-1">3 Months</label>
                        <input name="threeMonths" type="number" step="0.01" defaultValue={course?.tieredPrices?.threeMonths || 0} className="w-full bg-white border border-blue-200 rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-500/20 outline-none" />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-blue-700 uppercase mb-1">6 Months</label>
                        <input name="sixMonths" type="number" step="0.01" defaultValue={course?.tieredPrices?.sixMonths || 0} className="w-full bg-white border border-blue-200 rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-500/20 outline-none" />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-blue-700 uppercase mb-1">1 Year</label>
                        <input name="oneYear" type="number" step="0.01" defaultValue={course?.tieredPrices?.oneYear || 0} className="w-full bg-white border border-blue-200 rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-500/20 outline-none" />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-blue-700 uppercase mb-1">Lifetime</label>
                        <input name="lifetime" type="number" step="0.01" defaultValue={course?.tieredPrices?.lifetime || 0} className="w-full bg-white border border-blue-200 rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-500/20 outline-none" />
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div className="col-span-full p-4 bg-green-50 rounded-2xl border border-green-100 flex items-center space-x-3">
                  <div className="bg-green-100 p-2 rounded-full">
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                  </div>
                  <p className="text-sm font-medium text-green-800">This course is free. Price will be automatically set to $0.</p>
                  <input type="hidden" name="price" value="0" />
                  <input type="hidden" name="pricingType" value="single" />
                </div>
              )}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Published</label>
                <select name="published" defaultValue={course?.published ? 'true' : 'false'} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all">
                  <option value="true">Yes</option>
                  <option value="false">No</option>
                </select>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Short Description</label>
              <textarea name="shortDescription" defaultValue={course?.shortDescription} required rows={2} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Full Description</label>
              <textarea name="description" defaultValue={course?.description} required rows={4} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all" />
            </div>

            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Course Curriculum</h3>
                  <p className="text-sm text-slate-500">Add modules and videos to your course</p>
                </div>
                <button 
                  type="button"
                  onClick={addModule}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center space-x-2 transition-all shadow-md shadow-blue-200"
                >
                  <Plus className="h-4 w-4" />
                  <span>Add Module</span>
                </button>
              </div>

              <div className="space-y-4">
                {formModules.map((module, mIdx) => (
                  <div key={module.id} className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                    <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                      <div className="flex items-center space-x-4 flex-grow">
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Module {mIdx + 1}</span>
                        <input 
                          type="text"
                          value={module.title}
                          onChange={(e) => updateModuleTitle(module.id, e.target.value)}
                          placeholder="Module Title"
                          className="bg-transparent border-none focus:ring-0 font-bold text-slate-900 p-0 flex-grow"
                        />
                      </div>
                      <div className="flex items-center space-x-2">
                        <button 
                          type="button"
                          onClick={() => addVideo(module.id)}
                          className="p-2 hover:bg-blue-50 text-blue-600 rounded-lg transition-all"
                          title="Add Video"
                        >
                          <VideoIcon className="h-5 w-5" />
                        </button>
                        <button 
                          type="button"
                          onClick={() => removeModule(module.id)}
                          className="p-2 hover:bg-red-50 text-red-500 rounded-lg transition-all"
                          title="Remove Module"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                    <div className="p-4 space-y-3">
                      {module.videos.map((video, vIdx) => (
                        <div key={video.id} className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end p-4 bg-slate-50 rounded-xl border border-slate-100">
                          <div className="md:col-span-4">
                            <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Video Title</label>
                            <input 
                              type="text"
                              value={video.title}
                              onChange={(e) => updateVideo(module.id, video.id, 'title', e.target.value)}
                              placeholder="e.g. Introduction to React"
                              className="w-full bg-white border border-slate-200 rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-500/20 outline-none"
                            />
                          </div>
                          <div className="md:col-span-5">
                            <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">YouTube URL</label>
                            <input 
                              type="text"
                              value={video.youtubeUrl}
                              onChange={(e) => updateVideo(module.id, video.id, 'youtubeUrl', e.target.value)}
                              placeholder="https://www.youtube.com/watch?v=..."
                              className="w-full bg-white border border-slate-200 rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-500/20 outline-none"
                            />
                          </div>
                          <div className="md:col-span-2">
                            <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Minutes</label>
                            <input 
                              type="number"
                              value={video.duration}
                              onChange={(e) => updateVideo(module.id, video.id, 'duration', e.target.value)}
                              placeholder="10"
                              className="w-full bg-white border border-slate-200 rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-500/20 outline-none"
                            />
                          </div>
                          <div className="md:col-span-1 flex justify-center">
                            <button 
                              type="button"
                              onClick={() => removeVideo(module.id, video.id)}
                              className="p-2 hover:bg-red-50 text-red-500 rounded-lg transition-all"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                      {module.videos.length === 0 && (
                        <div className="text-center py-4 border-2 border-dashed border-slate-200 rounded-xl">
                          <p className="text-xs text-slate-400">No videos added to this module yet.</p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                {formModules.length === 0 && (
                  <div className="text-center py-12 border-2 border-dashed border-slate-200 rounded-3xl">
                    <BookOpen className="h-12 w-12 text-slate-200 mx-auto mb-4" />
                    <p className="text-slate-500">Start by adding your first module</p>
                  </div>
                )}
              </div>
              
              <div className="mt-6 flex items-center justify-between p-4 bg-blue-50 rounded-xl border border-blue-100">
                <div className="flex items-center space-x-2 text-blue-700">
                  <Clock className="h-4 w-4" />
                  <span className="text-sm font-bold">Total Calculated Duration: {calculateTotalDuration()}</span>
                </div>
                <div className="text-blue-700 text-sm font-bold">
                  {formModules.length} Modules | {formModules.reduce((acc, m) => acc + m.videos.length, 0)} Videos
                </div>
              </div>
            </div>

            <div className="border-t border-slate-100 pt-6 mt-6">
              <h3 className="text-lg font-bold mb-6 text-slate-900">SEO Settings</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">SEO Title</label>
                  <input name="seoTitle" defaultValue={course?.seo?.title} required className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">SEO Description</label>
                  <input name="seoDescription" defaultValue={course?.seo?.description} required className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">SEO Keywords</label>
                  <input name="seoKeywords" defaultValue={course?.seo?.keywords} required className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all" />
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-6">
              <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-bold transition-all shadow-lg shadow-blue-200">
                Save Course
              </button>
            </div>
          </form>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Course Management</h2>
          <button onClick={() => { setEditingCourse('new'); setCurrentPricingType('single'); setCurrentIsPaid(false); setFormModules([]); }} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-bold flex items-center space-x-2 transition-all shadow-lg shadow-blue-200">
            <Plus className="h-5 w-5" />
            <span>Create New Course</span>
          </button>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {courses.map((course) => (
            <div key={course.id} className="bg-white border border-slate-200 p-6 rounded-2xl flex items-center justify-between shadow-sm hover:shadow-md transition-all">
              <div className="flex items-center space-x-6">
                <div className="relative w-20 h-12 rounded-lg overflow-hidden shadow-sm">
                  <Image src={course.image} alt={course.name} fill className="object-cover" referrerPolicy="no-referrer" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-slate-900">{course.name}</h3>
                  <div className="flex items-center space-x-4 text-xs text-slate-500 mt-1 font-medium">
                    <span className="bg-slate-100 px-2 py-0.5 rounded uppercase text-slate-600">{course.category}</span>
                    {course.isPaid && (
                      <span className="bg-blue-50 px-2 py-0.5 rounded uppercase text-blue-600 text-[10px] font-bold">{course.pricingType}</span>
                    )}
                    <span>{course.modulesCount} Modules</span>
                    <span className={course.isPaid ? 'text-amber-600' : 'text-green-600'}>
                      {course.isPaid ? (
                        course.pricingType === 'tiered' 
                          ? `From $${course.tieredPrices?.oneMonth || 0}`
                          : `$${course.price}`
                      ) : 'Free'}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button onClick={() => { 
                  setEditingCourse(course); 
                  setCurrentPricingType(course.pricingType || 'single'); 
                  setCurrentIsPaid(course.isPaid);
                  setFormModules(course.modules || []);
                }} className="p-2 hover:bg-slate-50 rounded-lg text-slate-400 hover:text-blue-600 transition-all">
                  <Edit className="h-5 w-5" />
                </button>
                <button onClick={() => handleDeleteCourse(course.id)} className="p-2 hover:bg-slate-50 rounded-lg text-slate-400 hover:text-red-500 transition-all">
                  <Trash2 className="h-5 w-5" />
                </button>
                <Link href={`/courses/${course.id}`} className="p-2 hover:bg-slate-50 rounded-lg text-slate-400 hover:text-blue-600 transition-all">
                  <Eye className="h-5 w-5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-white flex text-slate-900">
      {/* Sidebar */}
      <aside className="w-64 border-r border-slate-200 bg-white hidden md:flex flex-col sticky top-0 h-screen shadow-sm">
        <div className="p-6 border-b border-slate-100">
          <Link href="/" className="flex items-center space-x-2">
            <div className="bg-blue-600 p-1.5 rounded-lg shadow-lg shadow-blue-200">
              <BookOpen className="h-6 w-6 text-white" />
            </div>
            <span className="font-bold text-lg tracking-tight text-slate-900">Admin Panel</span>
          </Link>
        </div>
        <nav className="flex-grow p-4 space-y-2">
          {[
            { id: 'overview', label: 'Overview', icon: LayoutDashboard },
            { id: 'courses', label: 'Courses', icon: BookOpen },
            { id: 'blogs', label: 'Blog Posts', icon: FileText },
            { id: 'students', label: 'Students', icon: Users },
            { id: 'revenue', label: 'Revenue', icon: DollarSign },
            { id: 'video-analytics', label: 'Video Analytics', icon: BarChart3 },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={cn(
                "w-full flex items-center space-x-3 px-4 py-3 rounded-xl font-medium transition-all duration-200",
                activeTab === item.id 
                  ? "bg-blue-50 text-blue-600 shadow-sm" 
                  : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
              )}
            >
              <item.icon className={cn("h-5 w-5", activeTab === item.id ? "text-blue-600" : "text-slate-400")} />
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
        <div className="p-4 border-t border-slate-100">
          <button 
            onClick={() => window.location.href = '/'}
            className="w-full flex items-center space-x-3 px-4 py-3 text-slate-500 hover:text-slate-900 hover:bg-slate-50 rounded-xl transition-all font-medium"
          >
            <LogOut className="h-5 w-5" />
            <span>Exit Admin</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-grow p-8 overflow-y-auto bg-slate-50/50">
        <header className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-3xl font-bold capitalize text-slate-900 tracking-tight">{activeTab}</h1>
            <p className="text-slate-500 font-medium">Manage your platform and track performance.</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-right hidden sm:block">
              <div className="font-bold text-slate-900">{user?.name}</div>
              <div className="text-xs text-slate-500 font-medium">Platform Administrator</div>
            </div>
            <div className="relative h-10 w-10 rounded-full overflow-hidden border-2 border-white shadow-md">
              <Image src={user?.avatar || 'https://picsum.photos/seed/avatar/100/100'} alt={user?.name || 'User'} fill className="object-cover" referrerPolicy="no-referrer" />
            </div>
          </div>
        </header>

        <AnimatePresence mode="wait">
          {activeTab === 'overview' && (
            <motion.div key="overview" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              {renderOverview()}
            </motion.div>
          )}
          {activeTab === 'courses' && (
            <motion.div key="courses" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              {renderCourses()}
            </motion.div>
          )}
          {activeTab === 'blogs' && (
            <motion.div key="blogs" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              {renderBlogs()}
            </motion.div>
          )}
          {activeTab === 'students' && (
            <motion.div key="students" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              {renderStudents()}
            </motion.div>
          )}
          {activeTab === 'revenue' && (
            <motion.div key="revenue" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              {renderRevenue()}
            </motion.div>
          )}
          {activeTab === 'video-analytics' && (
            <motion.div key="video-analytics" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              {renderVideoAnalytics()}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <style jsx global>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 8s linear infinite;
        }
      `}</style>
    </div>
  );
}
