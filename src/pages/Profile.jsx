import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { updateProfile, uploadResume, updateApplicationStatus } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import { APPLICATION_STATUSES } from '../utils/constants';

export default function Profile() {
  const { user, refreshUser } = useAuth();
  const [form, setForm] = useState({
    name: '',
    phone: '',
    location: '',
    linkedinUrl: '',
    skills: '',
    certifications: '',
    achievements: '',
    languages_spoken: '',
  });
  const [loading, setLoading] = useState(false);
  const [resumeLoading, setResumeLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (user) {
      setForm({
        name: user.name || '',
        phone: user.phone || '',
        location: user.location || '',
        linkedinUrl: user.linkedinUrl || '',
        skills: (user.skills || []).join(', '),
        certifications: (user.certifications || []).join(',\n'),
        achievements: (user.achievements || []).join(',\n'),
        languages_spoken: (user.languages_spoken || []).join(', '),
      });
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');
    try {
      await updateProfile({
        ...form,
        skills: form.skills.split(',').map((s) => s.trim()).filter(Boolean),
        certifications: form.certifications.split('\n').map(s => s.trim()).filter(Boolean),
        achievements: form.achievements.split('\n').map(s => s.trim()).filter(Boolean),
        languages_spoken: form.languages_spoken.split(',').map(s => s.trim()).filter(Boolean),
      });
      await refreshUser();
      setMessage('Profile updated successfully');
    } catch (err) {
      setError(err.response?.data?.message || 'Update failed');
    } finally {
      setLoading(false);
    }
  };

  const handleResumeUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setResumeLoading(true);
    setError('');
    setMessage('');
    try {
      const { data } = await uploadResume(file);
      await refreshUser();
      setMessage(data.message || 'Resume uploaded and parsed using AI');
    } catch (err) {
      setError(err.response?.data?.message || 'Upload failed');
    } finally {
      setResumeLoading(false);
    }
  };

  const handleStatusChange = async (jobId, status) => {
    await updateApplicationStatus(jobId, status);
    await refreshUser();
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold font-display">My Profile</h1>
          <p className="text-gray-400 mt-1">Manage your parsed resume data and applications.</p>
        </div>
      </div>

      {message && <div className="mb-6 p-4 rounded-xl bg-green-500/10 border border-green-500/20 text-green-400">{message}</div>}
      {error && <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400">{error}</div>}

      <div className="grid lg:grid-cols-3 gap-8">
        
        {/* LEFT COLUMN: Controls & Basic Info */}
        <div className="space-y-6 lg:col-span-1">
          {/* Resume Upload Box */}
          <div className="glass-card p-6 border-brand-primary/20 shadow-glow relative overflow-hidden">
            <div className="absolute -right-10 -top-10 w-40 h-40 bg-brand-primary/10 blur-[50px] rounded-full pointer-events-none"></div>
            <h2 className="text-lg font-semibold mb-2 relative z-10">AI Resume Upload</h2>
            <p className="text-gray-400 text-sm mb-6 relative z-10 leading-relaxed">
              Upload your PDF resume. Our Gemini AI pipeline will automatically extract and structure your experience, projects, and skills.
            </p>
            <label className={`w-full flex items-center justify-center p-6 border-2 border-dashed rounded-xl cursor-pointer transition-all ${resumeLoading ? 'border-brand-primary bg-brand-primary/5' : 'border-white/10 hover:border-brand-primary/50 hover:bg-white/5'}`}>
              <div className="text-center">
                <div className="text-2xl mb-2">{resumeLoading ? '🤖' : '📄'}</div>
                <div className="text-sm font-medium">{resumeLoading ? 'AI is Parsing...' : 'Click or Drag PDF'}</div>
              </div>
              <input type="file" accept="application/pdf" className="hidden" onChange={handleResumeUpload} disabled={resumeLoading} />
            </label>
            {user?.resumeUrl && <p className="text-green-400 text-xs mt-4 text-center font-medium">✓ Resume Synced</p>}
          </div>

          {/* Basic Form */}
          <form onSubmit={handleSubmit} className="glass-card p-6 space-y-5">
            <h2 className="text-lg font-semibold border-b border-white/5 pb-4 mb-4">Manual Overrides</h2>
            <div>
              <label className="block text-xs font-medium text-text-muted uppercase tracking-widest mb-2">Name</label>
              <input className="input-field" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-text-muted uppercase tracking-widest mb-2">Phone</label>
                <input className="input-field" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
              </div>
              <div>
                <label className="block text-xs font-medium text-text-muted uppercase tracking-widest mb-2">Location</label>
                <input className="input-field" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-text-muted uppercase tracking-widest mb-2">LinkedIn URL</label>
              <input className="input-field" value={form.linkedinUrl} onChange={(e) => setForm({ ...form, linkedinUrl: e.target.value })} />
            </div>
            <div>
              <label className="block text-xs font-medium text-text-muted uppercase tracking-widest mb-2">Languages Spoken</label>
              <input className="input-field" value={form.languages_spoken} onChange={(e) => setForm({ ...form, languages_spoken: e.target.value })} />
            </div>
            <button type="submit" disabled={loading} className="btn-outline w-full flex justify-center py-2 mt-4">
              {loading ? <LoadingSpinner size="sm" /> : 'Save Basic Info'}
            </button>
          </form>

          {/* Application Tracker */}
          {user?.appliedJobs?.length > 0 && (
            <div className="glass-card p-6">
              <h2 className="text-lg font-semibold mb-4 border-b border-white/5 pb-4">Application Tracker</h2>
              <div className="space-y-4">
                {user.appliedJobs.map((job) => (
                  <div key={job.jobId} className="border border-white/10 rounded-xl p-4 bg-dark-bg/50">
                    <p className="font-medium text-sm truncate">{job.title}</p>
                    <p className="text-xs text-gray-500 mb-3">{job.company}</p>
                    <select
                      value={job.status}
                      onChange={(e) => handleStatusChange(job.jobId, e.target.value)}
                      className="input-field text-xs py-1.5 px-3 h-auto"
                    >
                      {APPLICATION_STATUSES.map((s) => (
                        <option key={s.value} value={s.value}>{s.label}</option>
                      ))}
                    </select>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: AI Structured Data */}
        <div className="lg:col-span-2 space-y-6">

          {/* ATS Score Meter */}
          {user?.atsScore !== undefined && (
            <div className="glass-card p-6 flex flex-col sm:flex-row items-center gap-6 border-brand-primary/20 bg-brand-primary/5">
              <div className="relative w-24 h-24 flex items-center justify-center shrink-0">
                <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 36 36">
                  <path className="text-white/10" strokeWidth="3" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                  <path className="text-brand-primary transition-all duration-1000" strokeDasharray={`${user.atsScore}, 100`} strokeWidth="3" strokeLinecap="round" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                </svg>
                <div className="absolute text-xl font-bold font-display text-white">{user.atsScore}</div>
              </div>
              <div>
                <h2 className="text-xl font-bold mb-2">ATS Resume Score</h2>
                <p className="text-sm text-gray-400 mb-3">Your resume is scored based on completeness, keyword density, and formatting standard.</p>
                {user.missingSkills?.length > 0 && (
                  <div className="flex flex-wrap gap-2 items-center">
                    <span className="text-xs font-semibold text-yellow-500 uppercase tracking-wide">Missing Key Skills:</span>
                    {user.missingSkills.map(ms => (
                      <span key={ms} className="text-xs px-2 py-0.5 rounded-full bg-yellow-500/10 border border-yellow-500/20 text-yellow-400">
                        {ms}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
          
          {/* Skills Badges */}
          <div className="glass-card p-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">🛠 Extracted Skills <span className="text-xs bg-brand-primary/20 text-brand-primary px-2 py-0.5 rounded-full">{user?.skills?.length || 0}</span></h2>
            {user?.skills?.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {user.skills.map(skill => (
                  <span key={skill} className="px-3 py-1 rounded-full border border-white/10 bg-white/5 text-sm font-medium text-text-main">
                    {skill}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-text-muted text-sm italic">No skills extracted yet. Upload a resume.</p>
            )}
          </div>

          {/* Experience Cards */}
          <div className="glass-card p-6">
            <h2 className="text-lg font-semibold mb-6 flex items-center gap-2">💼 Work Experience</h2>
            {user?.experience?.length > 0 ? (
              <div className="space-y-6">
                {user.experience.map((exp, i) => (
                  <div key={i} className="relative pl-6 border-l border-white/10">
                    <div className="absolute w-3 h-3 bg-brand-accent rounded-full -left-[6.5px] top-1.5 border-4 border-dark-card shadow-glow-accent"></div>
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-2">
                      <div>
                        <h3 className="font-bold text-lg text-text-main">{exp.role}</h3>
                        <p className="text-brand-accent font-medium text-sm">{exp.company}</p>
                      </div>
                      <span className="text-xs font-medium text-text-muted bg-white/5 px-3 py-1 rounded-full mt-2 sm:mt-0 border border-white/5 whitespace-nowrap">
                        {exp.duration}
                      </span>
                    </div>
                    {exp.highlights?.length > 0 && (
                      <ul className="mt-4 space-y-2">
                        {exp.highlights.map((point, j) => (
                          <li key={j} className="text-sm text-text-muted leading-relaxed flex gap-2">
                            <span className="text-brand-primary/50 text-xs mt-1">▹</span>
                            {point}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-text-muted text-sm italic">No structured experience found. Upload your latest resume.</p>
            )}
          </div>

          {/* Projects Cards */}
          <div className="glass-card p-6">
            <h2 className="text-lg font-semibold mb-6 flex items-center gap-2">🚀 Technical Projects</h2>
            {user?.projects?.length > 0 ? (
              <div className="grid sm:grid-cols-2 gap-4">
                {user.projects.map((proj, i) => (
                  <div key={i} className="bg-dark-bg/50 border border-white/5 rounded-xl p-5 hover:border-brand-primary/30 transition-colors group">
                    <h3 className="font-bold text-text-main mb-2 group-hover:text-brand-primary transition-colors">{proj.title}</h3>
                    <p className="text-sm text-text-muted leading-relaxed mb-4 line-clamp-3">
                      {proj.description}
                    </p>
                    {proj.techStack?.length > 0 && (
                      <div className="flex flex-wrap gap-1.5">
                        {proj.techStack.map((tech, j) => (
                          <span key={j} className="px-2 py-0.5 rounded text-[10px] font-medium uppercase tracking-wider bg-brand-primary/10 text-brand-primary border border-brand-primary/20">
                            {tech}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-text-muted text-sm italic">No structured projects found.</p>
            )}
          </div>

          {/* Education & Certifications Grid */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="glass-card p-6">
              <h2 className="text-lg font-semibold mb-4">🎓 Education</h2>
              {user?.education?.length > 0 ? (
                <div className="space-y-4">
                  {user.education.map((edu, i) => (
                    <div key={i} className="bg-white/5 rounded-lg p-4 border border-white/5">
                      <h3 className="font-bold text-sm mb-1">{edu.degree}</h3>
                      <p className="text-xs text-text-muted mb-2">{edu.institution}</p>
                      <div className="flex justify-between items-center text-xs text-text-muted">
                        <span className="font-medium text-brand-accent">{edu.score}</span>
                        <span>{edu.year}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-text-muted text-sm italic">No education parsed.</p>
              )}
            </div>

            <div className="glass-card p-6">
              <h2 className="text-lg font-semibold mb-4">🏆 Certifications</h2>
              {user?.certifications?.length > 0 ? (
                <ul className="space-y-2">
                  {user.certifications.map((cert, i) => (
                    <li key={i} className="text-sm text-text-muted flex gap-2 items-start">
                      <span className="text-brand-accent">✓</span>
                      <span className="leading-relaxed">{cert}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-text-muted text-sm italic">No certifications parsed.</p>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
