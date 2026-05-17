import { useAuth } from '../context/AuthContext';
import { useJobs } from '../hooks/useJobs';
import JobCard from '../components/JobCard';
import { motion } from 'framer-motion';

export default function SavedJobs() {
  const { user } = useAuth();
  const { handleUnsave, handleApply, isApplied } = useJobs();
  const saved = user?.savedJobs || [];

  return (
    <div>
      <h1 className="text-3xl font-bold">Saved Jobs</h1>
      <p className="text-gray-400 mt-1">{saved.length} jobs saved</p>

      {saved.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="glass-card p-12 mt-8 text-center text-gray-500"
        >
          No saved jobs yet. Browse recommendations and save roles you like.
        </motion.div>
      ) : (
        <div className="grid gap-6 mt-8">
          {saved.map((job) => (
            <JobCard
              key={job.jobId}
              job={{ ...job, matchScore: job.matchScore }}
              onUnsave={handleUnsave}
              onApply={handleApply}
              isSaved
              isApplied={isApplied(job.jobId)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
