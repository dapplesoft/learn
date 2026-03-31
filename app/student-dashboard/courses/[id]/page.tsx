'use client';

import React, { useState, useEffect, useRef } from 'react';
import { db, Course, Enrollment, Video, User } from '@/lib/db';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Play, 
  CheckCircle2, 
  Lock, 
  ChevronLeft, 
  Menu, 
  X, 
  Maximize2, 
  Minimize2, 
  ArrowRight,
  ArrowLeft,
  LayoutDashboard,
  Loader2
} from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';

export default function CoursePlayerPage() {
  const params = useParams();
  const router = useRouter();
  
  const [state, setState] = useState<{
    course: Course | null;
    enrollment: Enrollment | null;
    activeVideo: Video | null;
    user: User | null;
    loading: boolean;
  }>({
    course: null,
    enrollment: null,
    activeVideo: null,
    user: null,
    loading: true
  });

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const id = params.id as string;
    if (!id) return;

    const timer = setTimeout(() => {
      const currentUser = db.getCurrentUser();
      if (!currentUser) {
        router.push('/');
        return;
      }

      const courses = db.getCourses();
      const foundCourse = courses.find(c => c.id === id);
      
      if (!foundCourse) {
        setState(prev => ({ ...prev, loading: false }));
        return;
      }

      const enrollments = db.getEnrollments();
      const foundEnrollment = enrollments.find(e => e.userId === currentUser.id && e.courseId === id);
      
      if (!foundEnrollment) {
        router.push(`/courses/${id}/enroll`);
        return;
      }

      const allVideos = foundCourse.modules.flatMap(m => m.videos);
      let initialVideo = null;
      if (allVideos.length > 0) {
        const lastCompletedIndex = allVideos.findIndex(v => !foundEnrollment.completedVideos.includes(v.id));
        initialVideo = allVideos[lastCompletedIndex === -1 ? 0 : lastCompletedIndex];
      }

      setState({
        course: foundCourse,
        enrollment: foundEnrollment,
        activeVideo: initialVideo,
        user: currentUser,
        loading: false
      });
    }, 0);

    return () => clearTimeout(timer);
  }, [params.id, router]);

  // Handle sequential unlock logic
  const isVideoLocked = (videoId: string) => {
    if (!state.course || !state.enrollment) return true;
    const allVideos = state.course.modules.flatMap(m => m.videos);
    const index = allVideos.findIndex(v => v.id === videoId);
    if (index === 0) return false; // First video always unlocked
    
    // Video is unlocked if previous video is completed
    const prevVideo = allVideos[index - 1];
    return !state.enrollment.completedVideos.includes(prevVideo.id);
  };

  const markVideoComplete = (videoId: string) => {
    if (!state.enrollment || !state.course || state.enrollment.completedVideos.includes(videoId)) return;

    const newCompleted = [...state.enrollment.completedVideos, videoId];
    const allVideos = state.course.modules.flatMap(m => m.videos);
    const progress = allVideos.length > 0 ? Math.round((newCompleted.length / allVideos.length) * 100) : 100;

    const updatedEnrollment: Enrollment = {
      ...state.enrollment,
      completedVideos: newCompleted,
      progress,
      status: progress === 100 ? 'completed' : 'active'
    };

    const allEnrollments = db.getEnrollments();
    const index = allEnrollments.findIndex(e => e.id === state.enrollment!.id);
    if (index !== -1) {
      allEnrollments[index] = updatedEnrollment;
      db.saveEnrollments(allEnrollments);
      setState(prev => ({ ...prev, enrollment: updatedEnrollment }));
    }
  };

  const handleVideoSelect = (video: Video) => {
    if (isVideoLocked(video.id)) return;
    setState(prev => ({ ...prev, activeVideo: video }));
  };

  if (state.loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <Loader2 className="h-12 w-12 animate-spin text-emerald-600" />
      </div>
    );
  }

  if (!state.course || !state.enrollment) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white p-4">
        <h1 className="text-2xl font-bold text-slate-900 mb-4">Course or Enrollment Not Found</h1>
        <Link href="/student-dashboard" className="text-emerald-600 hover:underline flex items-center space-x-2">
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Dashboard</span>
        </Link>
      </div>
    );
  }

  if (!state.activeVideo) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white p-4">
        <h1 className="text-2xl font-bold text-slate-900 mb-4">No content available for this course yet.</h1>
        <Link href="/student-dashboard" className="text-emerald-600 hover:underline flex items-center space-x-2">
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Dashboard</span>
        </Link>
      </div>
    );
  }

  const { course, enrollment, activeVideo } = state;
  const allVideos = course.modules.flatMap(m => m.videos);
  const activeIndex = allVideos.findIndex(v => v.id === activeVideo.id);
  const nextVideo = allVideos[activeIndex + 1];
  const prevVideo = allVideos[activeIndex - 1];

  // Extract YouTube ID
  const getYoutubeId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  return (
    <div className={cn(
      "min-h-screen bg-white flex flex-col overflow-hidden",
      isFullscreen && "fixed inset-0 z-[100]"
    )}>
      {/* Top Bar */}
      {!isFullscreen && (
        <header className="h-16 border-b border-emerald-100 bg-white flex items-center justify-between px-4 shrink-0 shadow-sm">
          <div className="flex items-center space-x-4">
            <Link 
              href="/student-dashboard" 
              className="flex items-center space-x-2 px-4 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-xl transition-all font-bold text-sm"
            >
              <ChevronLeft className="h-4 w-4" />
              <span>Exit Player</span>
            </Link>
            <div className="hidden sm:block">
              <h1 className="font-bold text-sm md:text-base line-clamp-1 text-emerald-950">{course.name}</h1>
              <div className="text-xs text-emerald-600/60 font-medium">
                Module: {course.modules.find(m => m.videos.some(v => v.id === activeVideo.id))?.title}
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="hidden md:flex items-center space-x-2">
              <div className="w-32 bg-emerald-50 h-2 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-600" style={{ width: `${enrollment.progress}%` }} />
              </div>
              <span className="text-xs font-bold text-emerald-600">{enrollment.progress}%</span>
            </div>
            <button 
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 hover:bg-emerald-50 rounded-lg transition-colors text-emerald-600"
            >
              {sidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </header>
      )}

      <div className="flex flex-grow overflow-hidden">
        {/* Main Player Section */}
        <div className="flex-grow flex flex-col bg-emerald-50/20 relative overflow-y-auto scroll-lock">
          <div className={cn(
            "relative w-full aspect-video bg-black shadow-2xl",
            isFullscreen && "h-screen aspect-auto"
          )}>
            <iframe
              src={`https://www.youtube.com/embed/${getYoutubeId(activeVideo.youtubeUrl)}?autoplay=1&rel=0&modestbranding=1`}
              className="absolute inset-0 w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
            
            {/* Fullscreen Toggle Overlay */}
            <button 
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="absolute bottom-4 right-4 p-2 bg-black/50 hover:bg-black/80 text-white rounded-lg transition-all backdrop-blur-sm"
            >
              {isFullscreen ? <Minimize2 className="h-5 w-5" /> : <Maximize2 className="h-5 w-5" />}
            </button>
          </div>

          {/* Video Info & Controls */}
          <div className="p-6 md:p-10 max-w-4xl mx-auto w-full">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold mb-2 text-emerald-950">{activeVideo.title}</h2>
                <div className="flex items-center space-x-4">
                  <span className="text-emerald-700/60 text-sm font-bold uppercase tracking-wider">Duration: {activeVideo.duration}</span>
                  <span className="h-1 w-1 bg-emerald-200 rounded-full" />
                  <span className="text-emerald-700/60 text-sm font-bold uppercase tracking-wider">Lesson {activeIndex + 1} of {allVideos.length}</span>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => markVideoComplete(activeVideo.id)}
                  disabled={enrollment.completedVideos.includes(activeVideo.id)}
                  className={cn(
                    "px-6 py-3 rounded-xl font-bold transition-all flex items-center space-x-2",
                    enrollment.completedVideos.includes(activeVideo.id)
                      ? "bg-emerald-100 text-emerald-700 border border-emerald-200"
                      : "bg-emerald-600 hover:bg-emerald-700 text-white shadow-xl shadow-emerald-200"
                  )}
                >
                  {enrollment.completedVideos.includes(activeVideo.id) ? (
                    <>
                      <CheckCircle2 className="h-5 w-5" />
                      <span>Completed</span>
                    </>
                  ) : (
                    <span>Mark as Complete</span>
                  )}
                </button>
              </div>
            </div>

            <div className="flex justify-between items-center pt-8 border-t border-emerald-100">
              <button
                disabled={!prevVideo}
                onClick={() => handleVideoSelect(prevVideo!)}
                className="flex items-center space-x-2 text-emerald-900/40 hover:text-emerald-600 disabled:opacity-30 disabled:cursor-not-allowed transition-colors font-bold uppercase tracking-widest text-xs"
              >
                <ArrowLeft className="h-5 w-5" />
                <span className="hidden sm:inline">Previous Lesson</span>
              </button>
              <button
                disabled={!nextVideo || isVideoLocked(nextVideo.id)}
                onClick={() => handleVideoSelect(nextVideo!)}
                className="flex items-center space-x-2 text-emerald-600 hover:text-emerald-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors font-bold uppercase tracking-widest text-xs"
              >
                <span className="hidden sm:inline">Next Lesson</span>
                <ArrowRight className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Sidebar - Curriculum */}
        <AnimatePresence>
          {sidebarOpen && (
            <motion.aside
              initial={{ x: 300 }}
              animate={{ x: 0 }}
              exit={{ x: 300 }}
              className="w-80 border-l border-emerald-100 bg-white shrink-0 overflow-y-auto hidden md:block"
            >
              <div className="p-6 border-b border-emerald-50 bg-emerald-50/30">
                <h3 className="font-bold text-lg text-emerald-900">Course Content</h3>
                <p className="text-[10px] text-emerald-600/60 font-bold uppercase tracking-wider mt-1">{enrollment.completedVideos.length} of {allVideos.length} completed</p>
              </div>
              <div className="p-2">
                {course.modules.map((module, mIdx) => (
                  <div key={module.id} className="mb-4">
                    <div className="px-4 py-3 text-[10px] font-bold text-emerald-900/40 uppercase tracking-widest border-b border-emerald-50/50 mb-2">
                      Module {mIdx + 1}: {module.title}
                    </div>
                    <div className="space-y-1 mt-1">
                      {module.videos.map((video) => {
                        const isLocked = isVideoLocked(video.id);
                        const isCompleted = enrollment.completedVideos.includes(video.id);
                        const isActive = activeVideo.id === video.id;

                        return (
                          <button
                            key={video.id}
                            disabled={isLocked}
                            onClick={() => handleVideoSelect(video)}
                            className={cn(
                              "w-full text-left px-4 py-3 rounded-xl flex items-center space-x-3 transition-all",
                              isActive ? "bg-emerald-600 text-white shadow-lg shadow-emerald-100" : "hover:bg-emerald-50 text-emerald-900/70",
                              isLocked && "opacity-40 cursor-not-allowed"
                            )}
                          >
                            <div className="shrink-0">
                              {isCompleted ? (
                                <CheckCircle2 className={cn("h-5 w-5", isActive ? "text-white" : "text-emerald-500")} />
                              ) : isLocked ? (
                                <Lock className="h-5 w-5 text-emerald-200" />
                              ) : (
                                <Play className={cn("h-5 w-5", isActive ? "text-white" : "text-emerald-400")} />
                              )}
                            </div>
                            <div className="flex-grow">
                              <div className={cn("text-sm font-bold line-clamp-1", isActive ? "text-white" : "text-emerald-950")}>{video.title}</div>
                              <div className={cn("text-[10px] font-bold uppercase tracking-wider", isActive ? "text-emerald-100" : "text-emerald-600/40")}>{video.duration}</div>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </motion.aside>
          )}
        </AnimatePresence>
      </div>

      <style jsx global>{`
        .scroll-lock {
          scrollbar-width: none;
          -ms-overflow-style: none;
        }
        .scroll-lock::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}
