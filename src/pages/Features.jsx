import { motion } from 'framer-motion';

const features = [
  {
    icon: '🔍',
    title: 'Live Job Search',
    desc: 'Access thousands of real-time job listings verified and aggregated via the Adzuna API.'
  },
  {
    icon: '📄',
    title: 'Smart Resume Parsing',
    desc: 'Upload your PDF and our system instantly extracts your skills, experience, and contact info.'
  },
  {
    icon: '🎯',
    title: 'AI Matching Engine',
    desc: 'We cross-reference your parsed skills with live job descriptions to give you an exact Match % score.'
  },
  {
    icon: '🤖',
    title: 'AI Interview Coach',
    desc: 'Practice via a real-time mock chat with Gemini 2.0, complete with algorithmic local fallbacks for zero downtime.'
  },
  {
    icon: '⭐',
    title: 'Saved Jobs CRM',
    desc: 'Keep track of roles you love in a centralized saved jobs board with easy 1-click apply links.'
  },
  {
    icon: '📊',
    title: 'Application Tracking',
    desc: 'Mark jobs as applied and watch your dashboard stats grow as you move through your career journey.'
  }
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

export default function Features() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-12 md:py-20">
      <div className="text-center mb-16">
        <h1 className="text-5xl font-display font-bold mb-4">Platform <span className="gradient-text">Features</span></h1>
        <p className="text-text-muted text-lg max-w-2xl mx-auto">Everything you need to find, track, and win your next technical role in one unified dashboard.</p>
      </div>

      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {features.map((f, i) => (
          <motion.div key={i} variants={item} className="glass-card p-8 group hover:border-brand-primary/30 transition-all">
            <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center text-3xl mb-6 group-hover:scale-110 transition-transform border border-white/10">
              {f.icon}
            </div>
            <h3 className="text-xl font-display font-bold mb-3">{f.title}</h3>
            <p className="text-text-muted leading-relaxed">{f.desc}</p>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
