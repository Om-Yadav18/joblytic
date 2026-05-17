import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useJobs } from '../hooks/useJobs';
import JobCard from '../components/JobCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { APPLICATION_STATUSES } from '../utils/constants';

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } }
};

export default function Dashboard() {
  const { user } = useAuth();
  const {
    jobs,
    loading,
    error,
    usingFallback,
    fallbackReason,
    source,
    fetchRecommended,
    handleSave,
    handleUnsave,
    handleApply,
    isSaved,
    isApplied,
  } = useJobs();

  useEffect(() => {
    fetchRecommended();
  }, [fetchRecommended]);

  const stats = [
    { label: 'Saved Jobs', value: user?.savedJobs?.length || 0, color: 'text-brand-accent' },
    { label: 'Applied', value: user?.appliedJobs?.length || 0, color: 'text-green-400' },
    { label: 'Skills', value: user?.skills?.length || 0, color: 'text-brand-primary' },
    { label: 'Resume', value: user?.resumeUrl ? 'Uploaded' : 'Missing', color: 'text-yellow-400' },
  ];

  return (
    <div className="space-y-10">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-4xl font-bold font-display tracking-tight">Dashboard</h1>
        <p className="text-text-muted mt-2 text-lg">Welcome back, <span className="text-text-main font-medium">{user?.name}</span></p>
      </motion.div>

      <motion.div 
        variants={containerVariants} 
        initial="hidden" 
        animate="show" 
        className="grid grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {stats.map((s) => (
          <motion.div key={s.label} variants={itemVariants} className="glass-card p-6 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
               <span className="text-6xl">📈</span>
            </div>
            <p className="text-sm font-medium text-text-muted uppercase tracking-wider">{s.label}</p>
            <p className={`text-4xl font-display font-bold mt-2 ${s.color}`}>{s.value}</p>
          </motion.div>
        ))}
      </motion.div>

      <div className="grid lg:grid-cols-2 gap-8">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="glass-card p-8 flex flex-col">
          <div className="flex justify-between items-start mb-6">
            <h2 className="text-xl font-display font-semibold">Profile Strength</h2>
            <div className="w-12 h-12 rounded-full border-4 border-brand-primary flex items-center justify-center text-sm font-bold">
              {user?.resumeUrl ? '90%' : '50%'}
            </div>
          </div>
          
          {user?.resumeUrl ? (
            <div className="flex items-center gap-2 text-green-400 text-sm bg-green-500/10 px-3 py-2 rounded-lg w-fit">
              <span>✓</span> Resume on file
            </div>
          ) : (
            <div className="flex items-center gap-2 text-yellow-400 text-sm bg-yellow-500/10 px-3 py-2 rounded-lg w-fit">
              <span>⚠</span> No resume uploaded
            </div>
          )}
          
          <div className="flex flex-wrap gap-2 mt-6 flex-1">
            {(user?.skills || []).slice(0, 8).map((skill) => (
              <span key={skill} className="px-3 py-1 text-xs font-medium rounded-full bg-brand-primary/10 text-brand-primary border border-brand-primary/20">
                {skill}
              </span>
            ))}
            {(!user?.skills || user.skills.length === 0) && (
              <p className="text-text-muted text-sm">Upload a resume or add skills to get AI insights.</p>
            )}
          </div>
          <Link to="/profile" className="btn-outline text-center mt-6 text-sm py-2 px-4">
            Manage Profile
          </Link>
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="glass-card p-8 flex flex-col justify-between relative overflow-hidden">
          <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-brand-accent/10 rounded-full blur-3xl"></div>
          <div>
            <h2 className="text-xl font-display font-semibold mb-4">AI Interview Prep</h2>
            <p className="text-text-muted text-sm leading-relaxed mb-6">Master your next interview with our real-time Gemini 2.0 evaluation engine. Practice across 8 categories.</p>
          </div>
          <Link to="/interview-prep" className="btn-primary text-center text-sm py-3 px-4 shadow-glow-accent">
            Start Mock Interview →
          </Link>
        </motion.div>
      </div>

      <section className="mt-12">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-display font-semibold">AI Recommended Jobs</h2>
          <Link to="/jobs" className="text-brand-accent text-sm hover:underline font-medium">
            View live map →
          </Link>
        </div>

        {loading && <LoadingSpinner className="py-12" />}

        {!loading && error && (
          <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm mb-4">
            {error}
            {usingFallback && <p className="mt-2 text-yellow-400/90">Showing fallback sample jobs below.</p>}
          </div>
        )}

        {!loading && !usingFallback && source === 'live' && jobs.length > 0 && (
          <div className="flex items-center gap-2 text-brand-accent text-sm mb-6">
            <span className="w-2 h-2 rounded-full bg-brand-accent animate-pulse"></span>
            Live feed active
          </div>
        )}

        {!loading && (
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="grid gap-6"
          >
            {jobs.slice(0, 4).map((job) => (
              <JobCard
                key={job.jobId}
                job={job}
                onSave={handleSave}
                onUnsave={handleUnsave}
                onApply={handleApply}
                isSaved={isSaved(job.jobId)}
                isApplied={isApplied(job.jobId)}
              />
            ))}
            {jobs.length === 0 && !error && (
              <div className="glass-card p-10 text-center border-dashed border-white/20">
                <p className="text-text-muted">Add more skills or upload a resume to unlock personalized AI recommendations.</p>
              </div>
            )}
          </motion.div>
        )}
      </section>
    </div>
  );
}
