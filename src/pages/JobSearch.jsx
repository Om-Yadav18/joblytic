import { useState } from 'react';
import { motion } from 'framer-motion';
import { useJobs } from '../hooks/useJobs';
import JobCard from '../components/JobCard';
import LoadingSpinner from '../components/LoadingSpinner';

const QUICK_SEARCHES = [
  'Software Engineer',
  'Frontend Developer',
  'React Developer',
  'Backend Engineer'
];

export default function JobSearch() {
  const [keyword, setKeyword] = useState('Software Engineer');
  const [location, setLocation] = useState('');
  const {
    jobs,
    loading,
    error,
    emptyMessage,
    usingFallback,
    fallbackReason,
    source,
    page,
    hasMore,
    search,
    handleSave,
    handleUnsave,
    handleApply,
    isSaved,
    isApplied,
  } = useJobs();

  const handleSearch = (e) => {
    e.preventDefault();
    search(keyword, location, 1);
  };

  const runQuickSearch = (term) => {
    setKeyword(term);
    search(term, location, 1);
  };

  return (
    <div className="pb-12">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-4xl font-display font-bold tracking-tight">Job Search</h1>
        <p className="text-text-muted mt-2 text-lg">Discover your next role via live Adzuna feeds</p>
      </motion.div>

      <motion.form initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} onSubmit={handleSearch} className="glass-card p-8 mt-10 flex flex-col md:flex-row gap-4">
        <input
          type="text"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          className="input-field flex-1"
          placeholder="Job title, keyword, or company"
        />
        <input
          type="text"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="input-field md:w-64"
          placeholder="Location (e.g., Remote, NY)"
        />
        <button type="submit" className="btn-primary md:w-auto min-w-[120px]" disabled={loading}>
          {loading ? 'Searching...' : 'Search Jobs'}
        </button>
      </motion.form>

      <div className="flex flex-wrap items-center gap-3 mt-6">
        <span className="text-xs text-text-muted uppercase tracking-widest font-semibold mr-1">Quick Search</span>
        {QUICK_SEARCHES.map((term) => (
          <button
            key={term}
            type="button"
            onClick={() => runQuickSearch(term)}
            className="text-xs font-medium px-4 py-2 rounded-full border border-white/10 text-text-muted hover:text-text-main hover:bg-white/5 hover:border-white/20 transition-all"
            disabled={loading}
          >
            {term}
          </button>
        ))}
      </div>

      {loading && <LoadingSpinner className="py-20" />}

      {!loading && error && (
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="mt-8 p-6 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-400">
          <p className="font-bold text-lg mb-1">Search failed</p>
          <p>{error}</p>
          {usingFallback && jobs.length > 0 && (
            <p className="mt-3 text-sm text-yellow-400/90 flex items-center gap-2">
              <span>⚠</span> Showing fallback sample jobs instead. {fallbackReason}
            </p>
          )}
        </motion.div>
      )}

      {!loading && !error && usingFallback && jobs.length > 0 && (
        <p className="text-yellow-400 text-sm mt-8 flex items-center gap-2">
          <span>⚠</span> Fallback data active — {fallbackReason || 'API currently unavailable'}
        </p>
      )}

      {!loading && !usingFallback && source === 'live' && jobs.length > 0 && (
        <div className="flex items-center justify-between mt-10 mb-6">
          <p className="text-green-400 text-sm font-medium flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span> Live API Feed Active
          </p>
          <p className="text-text-muted text-sm">{jobs.length} results on page {page}</p>
        </div>
      )}

      {!loading && emptyMessage && jobs.length === 0 && (
        <div className="glass-card p-12 mt-10 text-center border-dashed border-white/20">
          <span className="text-4xl mb-4 block opacity-50">🔍</span>
          <p className="text-text-muted">{emptyMessage}</p>
        </div>
      )}

      {!loading && jobs.length > 0 && (
        <>
          <div className="grid gap-6">
            {jobs.map((job) => (
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
          </div>
          
          <div className="flex items-center justify-center gap-6 mt-12 bg-dark-card/50 w-fit mx-auto px-6 py-3 rounded-full border border-white/5">
            <button
              type="button"
              disabled={page <= 1 || loading}
              onClick={() => search(keyword, location, page - 1)}
              className="text-sm font-medium text-text-muted hover:text-text-main disabled:opacity-50 transition-colors"
            >
              ← Previous
            </button>
            <span className="flex items-center text-text-main font-bold px-4 py-1 bg-white/5 rounded-lg">Page {page}</span>
            <button
              type="button"
              disabled={loading || !hasMore}
              onClick={() => search(keyword, location, page + 1)}
              className="text-sm font-medium text-text-muted hover:text-text-main disabled:opacity-50 transition-colors"
            >
              Next →
            </button>
          </div>
        </>
      )}

      {!loading && jobs.length === 0 && !error && !emptyMessage && (
        <div className="glass-card p-16 mt-10 text-center border-dashed border-white/10">
          <span className="text-5xl mb-6 block opacity-20">✨</span>
          <p className="text-text-muted text-lg">Search parameters ready.</p>
          <p className="text-text-muted text-sm mt-2 opacity-70">Enter a keyword or click a quick search badge to discover roles.</p>
        </div>
      )}
    </div>
  );
}
