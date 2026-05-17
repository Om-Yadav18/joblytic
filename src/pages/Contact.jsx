import { motion } from 'framer-motion';
import { useState } from 'react';

export default function Contact() {
  const [sent, setSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSent(true);
    setTimeout(() => setSent(false), 3000);
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-12 md:py-20 grid lg:grid-cols-2 gap-16 items-center">
      <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }}>
        <h1 className="text-5xl font-display font-bold mb-6">Get in <span className="gradient-text">Touch</span></h1>
        <p className="text-text-muted text-lg mb-10 leading-relaxed">
          Have a question, feature request, or want to integrate Joblytic into your enterprise? We'd love to hear from you.
        </p>

        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-xl">📧</div>
            <div>
              <p className="text-sm text-text-muted font-medium uppercase tracking-widest">Email</p>
              <p className="text-text-main">hello@joblytic.app</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-xl">💻</div>
            <div>
              <p className="text-sm text-text-muted font-medium uppercase tracking-widest">GitHub</p>
              <a href="https://github.com/joblytic" className="text-brand-accent hover:underline">github.com/joblytic</a>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-xl">💼</div>
            <div>
              <p className="text-sm text-text-muted font-medium uppercase tracking-widest">LinkedIn</p>
              <a href="https://linkedin.com/company/joblytic" className="text-brand-accent hover:underline">linkedin.com/company/joblytic</a>
            </div>
          </div>
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} className="glass-card p-8 md:p-10">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="text-sm font-medium text-text-muted mb-2 block">Name</label>
            <input type="text" required className="input-field" placeholder="John Doe" />
          </div>
          <div>
            <label className="text-sm font-medium text-text-muted mb-2 block">Email Address</label>
            <input type="email" required className="input-field" placeholder="john@company.com" />
          </div>
          <div>
            <label className="text-sm font-medium text-text-muted mb-2 block">Message</label>
            <textarea required className="input-field min-h-[150px] resize-none" placeholder="How can we help you?" />
          </div>
          <button type="submit" className="btn-primary w-full">
            {sent ? 'Message Sent! ✓' : 'Send Message'}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
