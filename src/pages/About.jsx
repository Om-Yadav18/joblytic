import { motion } from 'framer-motion';

export default function About() {
  return (
    <div className="max-w-6xl mx-auto px-6 py-12 md:py-20">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-5xl md:text-6xl font-display font-bold gradient-text tracking-tight mb-6">Our Mission.</h1>
        <p className="text-xl text-text-muted max-w-3xl leading-relaxed">
          Joblytic was built to completely rethink the job hunting experience. We combine live market feeds with next-generation AI to give you an unfair advantage in your career search.
        </p>
      </motion.div>

      <div className="grid md:grid-cols-2 gap-12 mt-20">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="glass-card p-10">
          <div className="w-12 h-12 rounded-xl bg-brand-primary/20 flex items-center justify-center mb-6 text-2xl border border-brand-primary/30 shadow-glow">
            🧠
          </div>
          <h2 className="text-2xl font-display font-bold mb-4">Powered by Gemini 2.0</h2>
          <p className="text-text-muted leading-relaxed">
            We don't just match keywords. Joblytic uses the latest Google Gemini 2.0 models to semantically understand your resume and actively train you for interviews in real-time, zero-latency text environments.
          </p>
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="glass-card p-10">
          <div className="w-12 h-12 rounded-xl bg-brand-accent/20 flex items-center justify-center mb-6 text-2xl border border-brand-accent/30 shadow-glow-accent">
            ⚡
          </div>
          <h2 className="text-2xl font-display font-bold mb-4">Live Adzuna Integration</h2>
          <p className="text-text-muted leading-relaxed">
            Stop looking at stale, expired job posts. Our backend pipelines directly into the Adzuna API, pulling live, verified job listings across the globe, matched instantly to your parsed skill profile.
          </p>
        </motion.div>
      </div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="mt-20 glass-card p-12 text-center relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[300px] bg-brand-primary/20 blur-[100px] rounded-full pointer-events-none"></div>
        <h2 className="text-3xl font-display font-bold mb-6 relative z-10">The Tech Stack</h2>
        <div className="flex flex-wrap justify-center gap-4 relative z-10">
          {['React', 'Node.js', 'Express', 'MongoDB', 'Tailwind CSS', 'Framer Motion', 'Adzuna API', 'Google Generative AI'].map(tech => (
            <span key={tech} className="px-4 py-2 rounded-full border border-white/10 bg-dark-bg text-text-main text-sm font-medium">
              {tech}
            </span>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
