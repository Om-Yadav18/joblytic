import { motion } from 'framer-motion';

const getMatchColor = (score) => {
  if (score >= 80) return 'text-green-400';
  if (score >= 50) return 'text-yellow-400';
  return 'text-red-400';
};

export default function JobCard({
  job,
  onSave,
  onUnsave,
  onApply,
  isSaved = false,
  isApplied = false,
  showActions = true,
}) {
  const matchScore = job.matchScore ?? 0;

  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.01, y: -2 }}
      className="glass-card p-6 border border-white/5 hover:border-brand-primary/30 hover:shadow-glow transition-all duration-300"
    >
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-1">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-white/10 to-white/5 flex items-center justify-center font-display font-bold text-text-muted border border-white/10">
              {job.company?.charAt(0) || 'J'}
            </div>
            <div>
              <h3 className="text-xl font-display font-bold text-text-main truncate leading-tight">{job.title}</h3>
              <p className="text-brand-accent text-sm font-medium">{job.company}</p>
            </div>
          </div>
          <p className="text-text-muted text-sm mt-2 flex items-center gap-2">
            <span className="opacity-80">📍</span> {job.location}
          </p>
          <div className="flex flex-wrap gap-2 mt-3 text-xs text-text-main font-medium">
            {job.salary && <span className="px-3 py-1 rounded-full bg-green-500/10 text-green-400 border border-green-500/20">💰 {job.salary}</span>}
            {job.employmentType && (
              <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10">
                {job.employmentType}
              </span>
            )}
          </div>
        </div>
        <div className="text-right bg-dark-bg p-3 rounded-2xl border border-white/5">
          <span className={`text-2xl font-display font-bold ${getMatchColor(matchScore)} block leading-none`}>
            {matchScore}%
          </span>
          <span className="text-xs text-text-muted font-medium uppercase tracking-widest mt-1 block">Match</span>
        </div>
      </div>

      <p className="text-text-muted text-sm mt-5 leading-relaxed line-clamp-2">
        {job.description ? job.description : 'No description available for this position.'}
      </p>

      {job.skills?.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-5">
          {job.skills.slice(0, 6).map((skill) => (
            <span
              key={skill}
              className="px-2.5 py-1 text-xs font-medium rounded-lg bg-brand-primary/10 text-brand-primary border border-brand-primary/20"
            >
              {skill}
            </span>
          ))}
        </div>
      )}

      {showActions && (
        <div className="flex flex-wrap items-center gap-3 mt-6 pt-6 border-t border-white/5">
          {job.applyLink && (
            <a
              href={job.applyLink}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary text-sm py-2.5 px-6"
            >
              Apply Now
            </a>
          )}
          {!isSaved ? (
            <button type="button" onClick={() => onSave?.(job)} className="btn-outline text-sm py-2.5 px-6">
              Save Job
            </button>
          ) : (
            <button type="button" onClick={() => onUnsave?.(job)} className="text-sm py-2.5 px-6 rounded-xl border border-brand-accent/30 text-brand-accent bg-brand-accent/10 hover:bg-brand-accent/20 transition-all">
              ★ Saved
            </button>
          )}
          {!isApplied && (
            <button
              type="button"
              onClick={() => onApply?.(job)}
              className="text-sm py-2.5 px-6 rounded-xl bg-green-500/10 text-green-400 border border-green-500/20 hover:bg-green-500/20 transition-all ml-auto"
            >
              Mark Applied
            </button>
          )}
          {isApplied && (
            <span className="text-sm py-2.5 px-4 text-green-400 font-medium ml-auto flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-400"></span> Applied
            </span>
          )}
        </div>
      )}
    </motion.article>
  );
}
