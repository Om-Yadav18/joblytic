import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

export default function Landing() {
  const { user } = useAuth();

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6 lg:pt-48 lg:pb-32 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-brand-primary/20 blur-[120px] rounded-full pointer-events-none"></div>
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <span className="px-4 py-1.5 rounded-full bg-brand-accent/10 border border-brand-accent/20 text-brand-accent text-sm font-bold uppercase tracking-widest mb-6 inline-block">
              Joblytic 2.0 is Live
            </span>
            <h1 className="text-6xl md:text-8xl font-display font-bold tracking-tight mb-8 leading-[1.1]">
              Find your next role with an <span className="gradient-text">Unfair Advantage.</span>
            </h1>
            <p className="text-xl md:text-2xl text-text-muted mb-10 max-w-3xl mx-auto leading-relaxed">
              Live Adzuna data feeds. Automated AI resume parsing. Real-time interview coaching powered by Gemini 2.0. The ultimate career CRM.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to={user ? '/dashboard' : '/register'} className="btn-primary text-lg py-4 px-10 shadow-glow w-full sm:w-auto">
                {user ? 'Go to Dashboard' : 'Start for Free'}
              </Link>
              <Link to="/features" className="btn-outline text-lg py-4 px-10 w-full sm:w-auto">
                Explore Features
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 px-6 bg-dark-card/30 border-y border-white/5 relative">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-display font-bold mb-4">How it works</h2>
            <p className="text-text-muted text-lg">Three steps to your next offer.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: '01', title: 'Upload Resume', desc: 'Drop your PDF. Our engine extracts skills, experience, and builds your profile instantly.' },
              { step: '02', title: 'Live Matching', desc: 'We query the global Adzuna database and surface jobs that perfectly align with your parsed skills.' },
              { step: '03', title: 'Prep & Win', desc: 'Enter the Gemini 2.0 mock interview simulator to practice technical rounds before the real thing.' }
            ].map((s, i) => (
              <motion.div 
                key={i} 
                initial={{ opacity: 0, y: 20 }} 
                whileInView={{ opacity: 1, y: 0 }} 
                viewport={{ once: true }} 
                transition={{ delay: i * 0.1 }}
                className="glass-card p-8"
              >
                <div className="text-5xl font-display font-bold text-white/5 mb-6">{s.step}</div>
                <h3 className="text-xl font-bold mb-3">{s.title}</h3>
                <p className="text-text-muted leading-relaxed">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Deep Dive Features */}
      <section className="py-32 px-6 max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-center mb-32">
          <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            <h2 className="text-4xl font-display font-bold mb-6">Real-Time Mock Interviews</h2>
            <p className="text-lg text-text-muted mb-8 leading-relaxed">
              Don't go into a technical interview cold. Joblytic's AI Interview Coach acts as a hiring manager, throwing dynamically generated questions at you based on your target role. Submit your answers and get an instant x/10 score with actionable feedback on algorithmic gaps and communication style.
            </p>
            <ul className="space-y-4">
              {['DSA & System Design', 'Web & Mobile Frameworks', 'Zero-quota local fallbacks', 'Instant technical grading'].map(li => (
                <li key={li} className="flex items-center gap-3 text-text-main font-medium">
                  <span className="text-brand-accent">✓</span> {li}
                </li>
              ))}
            </ul>
          </motion.div>
          <motion.div initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} className="glass-card p-6 border-brand-primary/20 shadow-glow relative">
             <div className="absolute -left-6 -top-6 w-12 h-12 rounded-full bg-brand-primary flex items-center justify-center text-xl shadow-glow">🤖</div>
             <div className="space-y-4 opacity-80 pointer-events-none">
                <div className="bg-dark-bg p-4 rounded-xl border border-white/5 w-3/4"><p className="text-sm">Explain how the Event Loop works in Node.js.</p></div>
                <div className="bg-brand-primary/10 p-4 rounded-xl border border-brand-primary/20 w-3/4 ml-auto"><p className="text-sm">It handles asynchronous callbacks via the call stack and microtask queues...</p></div>
                <div className="bg-dark-bg p-4 rounded-xl border border-white/5 w-full"><p className="text-sm font-bold text-green-400 mb-1">Score: 8/10</p><p className="text-xs text-text-muted">Good, but mention the V8 engine thread pool.</p></div>
             </div>
          </motion.div>
        </div>

        <div className="grid lg:grid-cols-2 gap-16 items-center flex-col-reverse lg:flex-row-reverse">
          <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            <h2 className="text-4xl font-display font-bold mb-6">Live Global Job Feeds</h2>
            <p className="text-lg text-text-muted mb-8 leading-relaxed">
              We aggregate data directly from the Adzuna API, parsing through millions of active listings. When you search, our backend calculates a precise Match Score % by comparing your parsed resume tokens against the employer's exact requirements.
            </p>
            <Link to="/features" className="text-brand-accent font-bold hover:underline flex items-center gap-2">
              See all features <span>→</span>
            </Link>
          </motion.div>
          <motion.div initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} className="glass-card p-6 border-brand-accent/20 shadow-glow-accent">
            <div className="space-y-3 pointer-events-none opacity-80">
              {[1, 2, 3].map(j => (
                <div key={j} className="p-4 rounded-xl bg-dark-bg border border-white/5 flex justify-between items-center">
                  <div>
                    <div className="h-4 w-32 bg-white/20 rounded mb-2"></div>
                    <div className="h-3 w-20 bg-white/10 rounded"></div>
                  </div>
                  <div className="text-2xl font-display font-bold text-green-400">92%</div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6 text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="max-w-4xl mx-auto glass-card p-12 md:p-20 relative overflow-hidden border-brand-primary/30 shadow-glow">
          <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-brand-accent/10 blur-[100px] rounded-full pointer-events-none"></div>
          <h2 className="text-4xl md:text-5xl font-display font-bold mb-6 relative z-10">Stop searching. Start matching.</h2>
          <p className="text-xl text-text-muted mb-10 relative z-10">Join the next generation of engineers landing roles with AI.</p>
          <Link to={user ? '/dashboard' : '/register'} className="btn-primary text-lg py-4 px-12 relative z-10">
            {user ? 'Enter Dashboard' : 'Create Free Account'}
          </Link>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-2xl font-display font-bold gradient-text">Joblytic.</div>
          <div className="flex gap-6 text-sm text-text-muted">
            <Link to="/about" className="hover:text-text-main">About</Link>
            <Link to="/features" className="hover:text-text-main">Features</Link>
            <Link to="/contact" className="hover:text-text-main">Contact</Link>
          </div>
          <div className="text-sm text-text-muted">© 2026 Joblytic. All rights reserved.</div>
        </div>
      </footer>
    </div>
  );
}
