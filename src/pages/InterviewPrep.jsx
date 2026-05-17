import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { interviewPrepRequest, getApiErrorMessage } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import MarkdownText from '../components/interview/MarkdownText';

const MODES = [
  { id: 'practice', label: 'Practice Q&A' },
  { id: 'mock', label: 'Mock Interview' },
];

export default function InterviewPrep() {
  const [meta, setMeta] = useState(null);
  const [mode, setMode] = useState('practice');
  const [role, setRole] = useState('Web Developer');
  const [category, setCategory] = useState('Web Development');
  const [difficulty, setDifficulty] = useState('intermediate');
  const [experienceLevel, setExperienceLevel] = useState('mid');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [fallbackNotice, setFallbackNotice] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentQ, setCurrentQ] = useState(0);
  const [answer, setAnswer] = useState('');
  const [evaluation, setEvaluation] = useState(null);
  const [practiceHistory, setPracticeHistory] = useState([]);
  const [mockHistory, setMockHistory] = useState([]);
  const [mockQuestion, setMockQuestion] = useState('');
  const [mockNote, setMockNote] = useState('');
  const [mockAnswer, setMockAnswer] = useState('');

  useEffect(() => {
    interviewPrepRequest({ action: 'meta' })
      .then(({ data }) => setMeta(data))
      .catch(() => {});
  }, []);

  const applyPreset = (preset) => {
    setRole(preset.role);
    setCategory(preset.category);
    setDifficulty(preset.difficulty);
    setExperienceLevel(preset.experienceLevel);
    setError(null);
  };

  const basePayload = () => ({ role, category, difficulty, experienceLevel });

  const handleGenerate = async () => {
    setLoading(true);
    setError(null);
    setFallbackNotice(null);
    setEvaluation(null);
    setQuestions([]);
    setPracticeHistory([]);
    try {
      const { data } = await interviewPrepRequest({ action: 'generate', ...basePayload() });
      if (!data.success) throw new Error(data.message);
      setQuestions(data.questions || []);
      setCurrentQ(0);
      setAnswer('');
      if (data.fallback) setFallbackNotice(data.message || 'Using local question generation');
    } catch (err) {
      setError(getApiErrorMessage(err, 'Failed to generate questions'));
    } finally {
      setLoading(false);
    }
  };

  const handleEvaluate = async () => {
    if (!questions[currentQ]) return;
    setLoading(true);
    setError(null);
    setFallbackNotice(null);
    try {
      const { data } = await interviewPrepRequest({
        action: 'evaluate',
        ...basePayload(),
        question: questions[currentQ],
        answer,
      });
      if (!data.success) throw new Error(data.message);
      setEvaluation(data);
      if (data.fallbackUsed || data.fallback) setFallbackNotice(data.message || 'Using local fallback evaluation due to API limits.');
      
      setPracticeHistory(prev => {
        const next = [...prev];
        next[currentQ] = { question: questions[currentQ], answer, evaluation: data };
        return next;
      });
    } catch (err) {
      setError(getApiErrorMessage(err, 'Evaluation failed'));
    } finally {
      setLoading(false);
    }
  };

  const startMock = async () => {
    setLoading(true);
    setError(null);
    setFallbackNotice(null);
    setMockHistory([]);
    setMockAnswer('');
    try {
      const { data } = await interviewPrepRequest({ action: 'mock', ...basePayload(), history: [] });
      setMockQuestion(data.question);
      setMockNote(data.interviewerNote || '');
      if (data.fallback) setFallbackNotice('Mock interview fallback mode');
    } catch (err) {
      setError(getApiErrorMessage(err, 'Failed to start mock interview'));
    } finally {
      setLoading(false);
    }
  };

  const submitMockAnswer = async () => {
    if (!mockAnswer.trim()) return;
    setLoading(true);
    setError(null);
    setFallbackNotice(null);
    const nextHistory = [...mockHistory, { question: mockQuestion, answer: mockAnswer }];
    
    // Optimistic UI update
    setMockHistory(nextHistory);
    setMockAnswer('');

    try {
      const { data } = await interviewPrepRequest({
        action: 'mock',
        ...basePayload(),
        history: nextHistory,
      });
      setMockQuestion(data.question);
      setMockNote(data.interviewerNote || '');
    } catch (err) {
      setError(getApiErrorMessage(err, 'Mock interview failed'));
      // Rollback optimistic update
      setMockHistory(mockHistory);
      setMockAnswer(nextHistory[nextHistory.length - 1].answer);
    } finally {
      setLoading(false);
    }
  };

  const presets = meta?.presets || [];
  const categories = meta?.categories || ['DSA', 'Web Development', 'OS', 'DBMS', 'OOPs', 'Computer Networks', 'HR Interview', 'System Design'];
  const difficulties = meta?.difficulties || ['beginner', 'intermediate', 'advanced'];
  const levels = meta?.experienceLevels || ['intern', 'junior', 'mid', 'senior'];

  return (
    <div className="pb-16 max-w-6xl mx-auto">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-4xl font-display font-bold gradient-text tracking-tight">AI Interview Prep</h1>
        <p className="text-text-muted mt-2 text-lg">Hone your skills with real-time Gemini 2.0 evaluation</p>
      </motion.div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} className="glass-card p-8 mt-10 space-y-6">
        <div className="flex flex-wrap gap-3 pb-2 border-b border-white/5">
          {MODES.map((m) => (
            <button
              key={m.id}
              type="button"
              onClick={() => { setMode(m.id); setQuestions([]); setPracticeHistory([]); setMockQuestion(''); }}
              className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                mode === m.id
                  ? 'bg-brand-primary/20 text-brand-primary border border-brand-primary/30 shadow-glow'
                  : 'bg-white/5 text-text-muted border border-white/10 hover:bg-white/10 hover:text-text-main'
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div>
            <label className="text-xs text-text-muted uppercase tracking-wider font-semibold mb-1 block">Role</label>
            <input className="input-field" value={role} onChange={(e) => setRole(e.target.value)} />
          </div>
          <div>
            <label className="text-xs text-text-muted uppercase tracking-wider font-semibold mb-1 block">Experience</label>
            <select className="input-field appearance-none" value={experienceLevel} onChange={(e) => setExperienceLevel(e.target.value)}>
              {levels.map((l) => (
                <option key={l} value={l} className="bg-dark-bg">{l}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs text-text-muted uppercase tracking-wider font-semibold mb-1 block">Category</label>
            <select className="input-field appearance-none" value={category} onChange={(e) => setCategory(e.target.value)}>
              {categories.map((c) => (
                <option key={c} value={c} className="bg-dark-bg">{c}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs text-text-muted uppercase tracking-wider font-semibold mb-1 block">Difficulty</label>
            <select className="input-field appearance-none" value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
              {difficulties.map((d) => (
                <option key={d} value={d} className="bg-dark-bg">{d}</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <p className="text-xs text-text-muted uppercase tracking-wider font-semibold mb-3">Quick Presets</p>
          <div className="flex flex-wrap gap-2">
            {presets.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => applyPreset(p)}
                className="text-xs px-4 py-2 rounded-lg border border-brand-accent/20 text-brand-accent hover:bg-brand-accent/10 transition-all font-medium"
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        <div className="pt-2">
          {mode === 'practice' ? (
            <button type="button" onClick={handleGenerate} disabled={loading} className="btn-primary w-full sm:w-auto">
              {loading ? 'Initializing Context...' : 'Generate Practice Questions'}
            </button>
          ) : (
            <button type="button" onClick={startMock} disabled={loading} className="btn-primary w-full sm:w-auto">
              {loading ? 'Booting AI Session...' : 'Start Mock Interview'}
            </button>
          )}
        </div>
      </motion.div>

      {error && (
        <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} className="mt-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
          {error}
        </motion.div>
      )}

      {/* PRACTICE MODE */}
      {mode === 'practice' && questions.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="grid lg:grid-cols-2 gap-8 mt-10">
          <div className="glass-card p-8 flex flex-col h-full">
            <div className="flex items-center justify-between mb-6">
              <p className="text-sm font-medium text-brand-accent uppercase tracking-wider">Question {currentQ + 1} of {questions.length}</p>
              <div className="flex gap-1">
                {questions.map((_, i) => (
                  <div key={i} className={`w-2 h-2 rounded-full ${i === currentQ ? 'bg-brand-accent shadow-glow-accent' : 'bg-white/10'}`} />
                ))}
              </div>
            </div>
            
            <p className="text-xl font-display text-text-main font-medium leading-relaxed mb-6">{questions[currentQ]}</p>
            
            <div className="flex-1">
              <textarea 
                className="input-field h-full min-h-[200px] resize-none" 
                value={answer} 
                onChange={(e) => setAnswer(e.target.value)} 
                placeholder="Type your detailed answer here..." 
              />
            </div>
            
            <div className="flex items-center gap-3 mt-6 pt-6 border-t border-white/5">
              <button type="button" className="btn-outline text-sm py-2 px-4" disabled={currentQ <= 0} onClick={() => { setCurrentQ((q) => q - 1); setEvaluation(practiceHistory[currentQ - 1]?.evaluation || null); setAnswer(practiceHistory[currentQ - 1]?.answer || ''); }}>←</button>
              <button type="button" className="btn-primary flex-1 py-2" onClick={handleEvaluate} disabled={loading || !answer.trim()}>
                {loading ? 'Evaluating...' : 'Evaluate Output'}
              </button>
              <button type="button" className="btn-outline text-sm py-2 px-4" disabled={currentQ >= questions.length - 1} onClick={() => { setCurrentQ((q) => q + 1); setEvaluation(practiceHistory[currentQ + 1]?.evaluation || null); setAnswer(practiceHistory[currentQ + 1]?.answer || ''); }}>→</button>
            </div>
          </div>

          <AnimatePresence mode="wait">
            {!evaluation && loading ? (
              <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="glass-card p-8 flex flex-col items-center justify-center min-h-[400px]">
                <div className="relative w-20 h-20 mb-6">
                  <div className="absolute inset-0 border-4 border-brand-primary/20 rounded-full"></div>
                  <div className="absolute inset-0 border-4 border-brand-primary border-t-transparent rounded-full animate-spin"></div>
                  <div className="absolute inset-3 border-4 border-brand-accent/20 rounded-full"></div>
                  <div className="absolute inset-3 border-4 border-brand-accent border-b-transparent rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
                </div>
                <p className="text-brand-primary font-medium text-lg mb-2">Analyzing response...</p>
                <div className="flex gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-primary animate-bounce"></span>
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-primary animate-bounce" style={{ animationDelay: '0.15s' }}></span>
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-primary animate-bounce" style={{ animationDelay: '0.3s' }}></span>
                </div>
              </motion.div>
            ) : evaluation ? (
              <motion.div key="evaluation" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="glass-card p-8 space-y-6 h-full flex flex-col">
                {evaluation.fallbackUsed && (
                  <div className="p-4 rounded-xl bg-yellow-500/10 border border-yellow-500/30 text-yellow-400 text-sm flex items-start gap-3">
                    <span className="text-xl leading-none">⚠️</span>
                    <p>AI evaluation quota temporarily limited. Providing a fast algorithmic assessment.</p>
                  </div>
                )}
                
                <div className="flex items-center gap-6 pb-6 border-b border-white/5">
                  <div className="relative w-24 h-24 flex items-center justify-center rounded-full bg-dark-bg shadow-inner">
                    <svg className="absolute inset-0 w-full h-full transform -rotate-90">
                      <circle cx="48" cy="48" r="42" className="stroke-current text-white/5" strokeWidth="8" fill="transparent" />
                      <circle cx="48" cy="48" r="42" className={`stroke-current ${evaluation.score >= 8 ? 'text-green-500 shadow-glow' : evaluation.score >= 5 ? 'text-yellow-500' : 'text-red-500'}`} strokeWidth="8" fill="transparent" strokeDasharray={`${(evaluation.score / 10) * 264} 264`} style={{ transition: 'stroke-dasharray 1s ease-out' }} strokeLinecap="round" />
                    </svg>
                    <div className="flex flex-col items-center relative z-10">
                      <span className="text-3xl font-display font-bold text-white leading-none">{evaluation.score}</span>
                      <span className="text-[10px] text-text-muted uppercase tracking-widest mt-1">/ 10</span>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-display font-bold text-white mb-1">
                      {evaluation.score >= 8 ? 'Excellent Response' : evaluation.score >= 5 ? 'Good Effort' : 'Needs Improvement'}
                    </h3>
                    <p className="text-sm text-text-muted">Based on technical depth, terminology, and completeness.</p>
                  </div>
                </div>

                <div className="flex-1 space-y-6 overflow-y-auto pr-2 custom-scrollbar">
                  {evaluation.strengths?.length > 0 && (
                    <div>
                      <p className="text-green-400 text-sm font-bold uppercase tracking-wider mb-2 flex items-center gap-2"><span>⊕</span> Core Strengths</p>
                      <div className="flex flex-wrap gap-2">
                        {evaluation.strengths.map((s, i) => <span key={i} className="px-3 py-1.5 rounded-lg bg-green-500/10 text-green-300 text-sm border border-green-500/20">{s}</span>)}
                      </div>
                    </div>
                  )}
                  
                  {evaluation.weaknesses?.length > 0 && (
                    <div>
                      <p className="text-red-400 text-sm font-bold uppercase tracking-wider mb-2 flex items-center gap-2"><span>⊖</span> Areas to Fix</p>
                      <ul className="text-sm text-text-muted list-disc pl-5 space-y-1">
                        {evaluation.weaknesses.map((w, i) => <li key={i}>{w}</li>)}
                      </ul>
                    </div>
                  )}

                  {evaluation.missing_points?.length > 0 && (
                    <div>
                      <p className="text-orange-400 text-sm font-bold uppercase tracking-wider mb-2 flex items-center gap-2"><span>◎</span> Missing Context</p>
                      <ul className="text-sm text-text-muted list-disc pl-5 space-y-1">
                        {evaluation.missing_points.map((m, i) => <li key={i}>{m}</li>)}
                      </ul>
                    </div>
                  )}

                  {evaluation.improvement_tips?.length > 0 && (
                    <div>
                      <p className="text-yellow-400 text-sm font-bold uppercase tracking-wider mb-2 flex items-center gap-2"><span>💡</span> Actionable Tips</p>
                      <ul className="text-sm text-text-muted list-disc pl-5 space-y-1">
                        {(evaluation.improvement_tips || evaluation.improvementTips || []).map((t, i) => <li key={i}>{t}</li>)}
                      </ul>
                    </div>
                  )}

                  {(evaluation.ideal_answer || evaluation.suggestedAnswer) && (
                    <div className="pt-4 mt-4 border-t border-white/5">
                      <p className="text-brand-accent text-sm font-bold uppercase tracking-wider mb-3">Model Answer</p>
                      <div className="p-4 rounded-xl bg-dark-bg border border-white/5 text-text-main text-sm leading-relaxed">
                        <MarkdownText>{evaluation.ideal_answer || evaluation.suggestedAnswer || ''}</MarkdownText>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            ) : (
              <div className="glass-card p-8 flex flex-col items-center justify-center opacity-50 border-dashed border-white/20">
                <span className="text-4xl mb-4">🎯</span>
                <p className="text-text-muted text-center max-w-sm">Submit your answer to receive an instant AI breakdown of your technical communication.</p>
              </div>
            )}
          </AnimatePresence>
        </motion.div>
      )}

      {/* MOCK INTERVIEW MODE */}
      {mode === 'mock' && (mockHistory.length > 0 || mockQuestion) && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-6 md:p-10 mt-10 max-w-4xl mx-auto flex flex-col">
          <div className="flex items-center justify-between pb-6 border-b border-white/5 mb-6">
            <div>
              <h2 className="text-xl font-display font-bold">Live AI Session</h2>
              <p className="text-sm text-text-muted">{role} • {category}</p>
            </div>
            <div className="px-3 py-1 rounded-full bg-green-500/10 text-green-400 border border-green-500/20 text-xs font-bold uppercase tracking-widest flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span> Active
            </div>
          </div>

          <div className="flex-1 overflow-y-auto space-y-8 mb-8 pb-4 custom-scrollbar">
            {mockHistory.map((h, i) => (
              <div key={i} className="space-y-6">
                <div className="flex items-start gap-4 max-w-[85%]">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-primary to-blue-500 flex-shrink-0 flex items-center justify-center shadow-glow">
                    <span className="text-xs text-white">AI</span>
                  </div>
                  <div className="p-4 rounded-2xl rounded-tl-sm bg-white/5 border border-white/10 text-text-main text-sm md:text-base leading-relaxed">
                    {h.question}
                  </div>
                </div>
                
                <div className="flex items-start gap-4 max-w-[85%] ml-auto flex-row-reverse">
                  <div className="w-8 h-8 rounded-full bg-dark-bg border border-white/10 flex-shrink-0 flex items-center justify-center">
                    <span className="text-xs text-text-muted">You</span>
                  </div>
                  <div className="p-4 rounded-2xl rounded-tr-sm bg-brand-primary/10 border border-brand-primary/20 text-text-main text-sm md:text-base leading-relaxed">
                    {h.answer}
                  </div>
                </div>
              </div>
            ))}

            {!loading && mockQuestion && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex items-start gap-4 max-w-[85%]">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-primary to-blue-500 flex-shrink-0 flex items-center justify-center shadow-glow">
                  <span className="text-xs text-white">AI</span>
                </div>
                <div>
                  <div className="p-4 rounded-2xl rounded-tl-sm bg-white/5 border border-white/10 text-text-main text-sm md:text-base leading-relaxed">
                    {mockQuestion}
                  </div>
                  {mockNote && <p className="text-xs text-text-muted mt-2 ml-1 opacity-70">💡 {mockNote}</p>}
                </div>
              </motion.div>
            )}

            {loading && (
              <div className="flex items-center gap-3 text-text-muted text-sm ml-12">
                <div className="flex gap-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-brand-primary animate-bounce"></div>
                  <div className="w-1.5 h-1.5 rounded-full bg-brand-primary animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-1.5 h-1.5 rounded-full bg-brand-primary animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
                AI is typing...
              </div>
            )}
          </div>

          <div className="mt-auto relative">
            <textarea 
              className="input-field min-h-[100px] pb-16 resize-none bg-dark-bg/80" 
              value={mockAnswer} 
              onChange={(e) => setMockAnswer(e.target.value)} 
              placeholder="Type your response to the AI interviewer..."
              disabled={loading}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
                  submitMockAnswer();
                }
              }}
            />
            <div className="absolute bottom-3 right-3 left-3 flex justify-between items-center">
              <span className="text-xs text-text-muted hidden sm:inline-block pl-2">Press <kbd className="font-mono bg-white/10 px-1 rounded">Cmd</kbd> + <kbd className="font-mono bg-white/10 px-1 rounded">Enter</kbd> to send</span>
              <button 
                type="button" 
                className="btn-primary py-2 px-6 ml-auto shadow-glow transition-all disabled:opacity-50" 
                onClick={submitMockAnswer} 
                disabled={loading || !mockAnswer.trim()}
              >
                Send Response
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
