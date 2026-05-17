import {
  generateQuestions,
  evaluateAnswer,
  mockInterviewTurn,
  PRESETS,
  CATEGORIES,
  DIFFICULTIES,
  EXPERIENCE_LEVELS,
} from '../services/geminiService.js';

/**
 * POST /api/interview-prep
 * body: { action, role, category, difficulty, experienceLevel, question?, answer?, history?, count? }
 */
export const handleInterviewPrep = async (req, res) => {
  const startedAt = Date.now();
  const { action } = req.body;

  console.log('[interview-prep] Incoming', {
    action,
    role: req.body.role,
    category: req.body.category,
    userId: req.user?._id,
  });

  try {
    if (action === 'meta') {
      return res.json({
        success: true,
        presets: PRESETS,
        categories: CATEGORIES,
        difficulties: DIFFICULTIES,
        experienceLevels: EXPERIENCE_LEVELS,
      });
    }

    const {
      role,
      category = 'frontend',
      difficulty = 'intermediate',
      experienceLevel = 'mid',
    } = req.body;

    if (!role) {
      return res.status(400).json({ success: false, message: 'Role is required' });
    }

    if (action === 'generate') {
      const result = await generateQuestions({
        role,
        category,
        difficulty,
        experienceLevel,
        count: req.body.count || 5,
      });
      console.log('[interview-prep] generate done', Date.now() - startedAt, 'ms');
      return res.json({ success: true, ...result });
    }

    if (action === 'evaluate') {
      const { question, answer } = req.body;
      if (!question) {
        return res.status(400).json({ success: false, message: 'Question is required' });
      }
      const result = await evaluateAnswer({
        role,
        category,
        difficulty,
        experienceLevel,
        question,
        answer,
      });
      console.log('[interview-prep] evaluate done', Date.now() - startedAt, 'ms');
      return res.json({ success: true, ...result });
    }

    if (action === 'mock') {
      const result = await mockInterviewTurn({
        role,
        category,
        difficulty,
        experienceLevel,
        history: req.body.history || [],
      });
      console.log('[interview-prep] mock done', Date.now() - startedAt, 'ms');
      return res.json({ success: true, ...result });
    }

    return res.status(400).json({
      success: false,
      message: 'Invalid action. Use meta, generate, evaluate, or mock',
    });
  } catch (error) {
    console.error('[interview-prep] Error:', error.message);
    return res.status(500).json({ success: false, message: error.message });
  }
};
