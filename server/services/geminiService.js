import { GoogleGenerativeAI } from '@google/generative-ai';
import { env } from '../config/env.js';
import { getLocalQuestions, getQuestionObjectByString } from '../data/interviewQuestions.js';

const LOG = '[Gemini]';

// Simple in-memory cache to prevent redundant evaluation API calls
const evaluationCache = new Map();
const MAX_CACHE_SIZE = 100;

const getModel = (fallback = false) => {
  if (!env.geminiApiKey) return null;
  const genAI = new GoogleGenerativeAI(env.geminiApiKey);
  const modelName = fallback ? 'gemini-2.0-flash-lite' : 'gemini-2.0-flash';
  return genAI.getGenerativeModel({ model: modelName });
};

const parseJsonSafe = (text) => {
  const cleaned = text.replace(/```json|```/g, '').trim();
  try {
    return JSON.parse(cleaned);
  } catch {
    const match = cleaned.match(/\{[\s\S]*\}/);
    if (match) {
      try {
        return JSON.parse(match[0]);
      } catch {
        return null;
      }
    }
    return null;
  }
};

const runPromptWithFallback = async (prompt) => {
  if (!env.geminiApiKey) {
    return { ok: false, error: 'GEMINI_API_KEY not configured in server/.env' };
  }

  const started = Date.now();
  console.log(`${LOG} Sending prompt... length=${prompt.length}`);

  let model = getModel(false);
  try {
    const result = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      generationConfig: { maxOutputTokens: 250 } // Limit tokens to save quota
    });
    const text = result.response.text();
    const responseTime = Date.now() - started;
    console.log(`${LOG} [gemini-2.0-flash] Response in ${responseTime}ms, response_length=${text.length}`);
    return { ok: true, text };
  } catch (err) {
    console.warn(`${LOG} [gemini-2.0-flash] Failed: ${err.message}. Attempting fallback...`);
    
    try {
      model = getModel(true); // Fallback to lite
      const result = await model.generateContent({
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        generationConfig: { maxOutputTokens: 250 }
      });
      const text = result.response.text();
      const responseTime = Date.now() - started;
      console.log(`${LOG} [gemini-2.0-flash-lite] Response in ${responseTime}ms, response_length=${text.length}`);
      return { ok: true, text };
    } catch (fallbackErr) {
      const responseTime = Date.now() - started;
      console.error(`${LOG} Error after ${responseTime}ms:`, fallbackErr.message);
      
      let friendlyError = 'Unknown Gemini error';
      if (fallbackErr.message.includes('API key not valid')) friendlyError = 'Invalid Gemini API key';
      else if (fallbackErr.status === 429 || fallbackErr.message.includes('429') || fallbackErr.message.includes('quota')) friendlyError = '429';
      else if (fallbackErr.status === 404 || fallbackErr.message.includes('not found') || fallbackErr.message.includes('404')) friendlyError = 'Gemini model unavailable (404)';
      else if (fallbackErr.message.includes('fetch failed')) friendlyError = 'Network error reaching Gemini API';
      else friendlyError = fallbackErr.message;

      return { ok: false, error: friendlyError };
    }
  }
};

export const CATEGORIES = [
  'DSA',
  'Web Development',
  'OS',
  'DBMS',
  'OOPs',
  'Computer Networks',
  'HR Interview',
  'System Design'
];
export const DIFFICULTIES = ['beginner', 'intermediate', 'advanced'];
export const EXPERIENCE_LEVELS = ['intern', 'junior', 'mid', 'senior'];

export const PRESETS = [
  {
    id: 'web-dev',
    label: 'Web Developer',
    role: 'Web Developer',
    category: 'Web Development',
    difficulty: 'intermediate',
    experienceLevel: 'mid',
  },
  {
    id: 'dsa',
    label: 'Software Engineer DSA',
    role: 'Software Engineer',
    category: 'DSA',
    difficulty: 'intermediate',
    experienceLevel: 'mid',
  },
  {
    id: 'system-design',
    label: 'System Design Interview',
    role: 'Backend Engineer',
    category: 'System Design',
    difficulty: 'advanced',
    experienceLevel: 'senior',
  },
  {
    id: 'hr',
    label: 'HR Interview',
    role: 'Software Engineer',
    category: 'HR Interview',
    difficulty: 'intermediate',
    experienceLevel: 'junior',
  },
];

/**
 * Generate interview questions (Fully offline via local dataset to save quota)
 */
export const generateQuestions = async ({ category, difficulty, count = 5 }) => {
  // Completely bypass Gemini API to save quota
  const questionsObj = getLocalQuestions(category, difficulty, count);
  const questions = questionsObj.map(q => q.question);
  return { questions, fallback: false };
};

/**
 * Local Fallback Evaluation Logic when Gemini returns 429
 */
const localEvaluate = (question, answer) => {
  const ans = (answer || '').toLowerCase().trim();
  const words = ans.split(/\s+/).filter(Boolean).length;
  let score = 5;
  const strengths = [];
  const weaknesses = [];
  const improvement_tips = [];

  const qObj = getQuestionObjectByString(question);

  if (words < 10) {
    score = 2;
    weaknesses.push('Answer is extremely short and lacks detail.');
    improvement_tips.push('Expand your answer. Describe the "why" and "how".');
  } else if (words > 60) {
    score += 1;
    strengths.push('Detailed explanation provided.');
  } else {
    score += 1;
    strengths.push('Concise answer with good length.');
  }

  let ideal_answer = 'A structured answer detailing the concept, providing an example, and mentioning any relevant trade-offs.';

  if (qObj) {
    ideal_answer = qObj.idealAnswer;
    let kwCount = 0;
    qObj.keywords.forEach(kw => {
      if (ans.includes(kw.toLowerCase())) kwCount++;
    });

    const kwRatio = qObj.keywords.length > 0 ? kwCount / qObj.keywords.length : 0;
    
    if (kwRatio > 0.7) {
      score += 4;
      strengths.push('Excellent use of required technical terminology.');
    } else if (kwRatio > 0.3) {
      score += 2;
      strengths.push('Used some relevant technical terminology.');
      improvement_tips.push(`Try to include terms related to: ${qObj.keywords.join(', ')}.`);
    } else {
      score -= 1;
      weaknesses.push('Missing key technical terms.');
      improvement_tips.push(`Focus on including terms like: ${qObj.keywords.join(', ')}.`);
    }
  } else {
    const genericKeywords = ['use', 'data', 'system', 'function', 'object', 'class', 'api', 'database', 'server', 'client', 'network', 'algorithm'];
    let kwCount = genericKeywords.filter(kw => ans.includes(kw)).length;

    if (kwCount > 1) {
      score += 2;
      strengths.push('Used relevant technical terminology.');
    } else if (words >= 10) {
      weaknesses.push('Lacks specific technical terminology.');
      improvement_tips.push('Use industry-standard terms to demonstrate expertise.');
    }
  }

  return {
    score: Math.min(10, Math.max(0, score)),
    strengths,
    weaknesses,
    missing_points: ['Consider adding real-world examples to strengthen the answer.'],
    improvement_tips,
    ideal_answer,
    fallbackUsed: true
  };
};

/**
 * Evaluate a single answer (Uses Gemini with local fallback)
 */
export const evaluateAnswer = async ({
  role,
  category,
  difficulty,
  experienceLevel,
  question,
  answer,
}) => {
  const cacheKey = `${question}|${(answer || '').trim()}`;
  if (evaluationCache.has(cacheKey)) {
    console.log(`${LOG} Serving evaluation from cache`);
    return evaluationCache.get(cacheKey);
  }

  // Ultra-concise prompt to save tokens
  const prompt = `Eval answer.
Q: ${question}
A: ${answer || '(blank)'}
Return ONLY JSON:
{
  "score": <0-10>,
  "strengths": ["..."],
  "weaknesses": ["..."],
  "missing_points": ["..."],
  "improvement_tips": ["..."],
  "ideal_answer": "..."
}`;

  const result = await runPromptWithFallback(prompt);
  
  if (!result.ok) {
    console.warn(`${LOG} API failed. Using local fallback evaluation.`);
    const fallbackData = localEvaluate(question, answer);
    return { ...fallbackData, message: result.error };
  }

  const parsed = parseJsonSafe(result.text);
  if (parsed?.score != null) {
    const finalData = {
      score: Math.min(10, Math.max(0, Number(parsed.score))),
      strengths: parsed.strengths || [],
      weaknesses: parsed.weaknesses || [],
      missing_points: parsed.missing_points || [],
      improvement_tips: parsed.improvement_tips || parsed.improvementTips || parsed.suggestions || [],
      ideal_answer: parsed.ideal_answer || parsed.suggestedAnswer || '',
      fallbackUsed: false,
    };
    
    // Manage cache size
    if (evaluationCache.size > MAX_CACHE_SIZE) evaluationCache.clear();
    evaluationCache.set(cacheKey, finalData);
    
    return finalData;
  }

  console.warn(`${LOG} Failed to parse JSON. Using local fallback evaluation.`);
  return { ...localEvaluate(question, answer), message: 'Parse error' };
};

/**
 * Mock interview — next question based on prior exchange
 * (Fully offline via local dataset to save quota)
 */
export const mockInterviewTurn = async ({ category, difficulty, history }) => {
  // Extract all previous questions to avoid asking them again
  const askedQuestions = new Set((history || []).map(h => h.question));
  
  // Pull a larger pool from local dataset
  const pool = getLocalQuestions(category, difficulty, 10);
  
  // Find a question not asked yet
  let nextQObj = pool.find(q => !askedQuestions.has(q.question));
  
  let nextQ = nextQObj ? nextQObj.question : `Can you elaborate more on your experience with ${category}?`;

  return {
    question: nextQ,
    interviewerNote: 'Ask follow-up based on previous answer.',
    fallback: false,
    fallbackUsed: false // Since we intentionally use local, this isn't an "API failure" fallback state
  };
};

/**
 * Send a raw text block to Gemini and ask it to structure it as JSON
 */
export const structureResumeSection = async (sectionName, rawText) => {
  if (!rawText || rawText.trim() === '') return [];

  const cacheKey = `parse_${sectionName}_${rawText.slice(0, 100)}`;
  if (evaluationCache.has(cacheKey)) {
    return evaluationCache.get(cacheKey);
  }

  let schemaInstruction = '';
  if (sectionName === 'experience') {
    schemaInstruction = `[{ "company": "...", "role": "...", "duration": "...", "highlights": ["..."] }]`;
  } else if (sectionName === 'projects') {
    schemaInstruction = `[{ "title": "...", "description": "...", "techStack": ["..."] }]`;
  } else if (sectionName === 'education') {
    schemaInstruction = `[{ "institution": "...", "degree": "...", "year": "...", "score": "..." }]`;
  } else {
    schemaInstruction = `["item 1", "item 2"]`;
  }

  const prompt = `Extract the structured data from the following resume '${sectionName}' section.
Raw Text:
${rawText.slice(0, 3000)}

Return ONLY valid JSON matching this exact schema:
${schemaInstruction}`;

  const result = await runPromptWithFallback(prompt);
  
  if (!result.ok) {
    console.warn(`${LOG} Failed to structure ${sectionName}. Returning empty array.`);
    return [];
  }

  const parsed = parseJsonSafe(result.text);
  const structuredData = Array.isArray(parsed) ? parsed : [];
  
  if (evaluationCache.size > MAX_CACHE_SIZE) evaluationCache.clear();
  evaluationCache.set(cacheKey, structuredData);
  
  return structuredData;
};
