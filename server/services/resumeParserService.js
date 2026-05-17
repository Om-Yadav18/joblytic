import fs from 'fs';
import pdf from 'pdf-parse';
import mammoth from 'mammoth';
import nlp from 'compromise';
import path from 'path';
import { extractSkillsFromText } from '../utils/skillsExtractor.js';
import { getAllKeywords, normalizeSkill, suggestMissingSkills } from '../utils/skillsDatabase.js';

// --- Text Extraction Utilities ---

const extractTextFromFile = async (filePath) => {
  const ext = path.extname(filePath).toLowerCase();
  
  if (ext === '.pdf') {
    const dataBuffer = fs.readFileSync(filePath);
    const pdfData = await pdf(dataBuffer);
    return pdfData.text || '';
  } else if (ext === '.docx') {
    const result = await mammoth.extractRawText({ path: filePath });
    return result.value || '';
  } else if (ext === '.txt') {
    return fs.readFileSync(filePath, 'utf8');
  }
  throw new Error('Unsupported file type');
};

const cleanText = (text) => {
  if (!text) return '';
  return text.replace(/\r\n/g, '\n').replace(/\n{3,}/g, '\n\n').trim();
};

const extractSection = (text, startHeaderRegex, allHeadersRegex) => {
  startHeaderRegex.lastIndex = 0;
  allHeadersRegex.lastIndex = 0;

  const match = startHeaderRegex.exec(text);
  if (!match) return '';

  const startIndex = match.index + match[0].length;
  const remainingText = text.slice(startIndex);
  
  allHeadersRegex.lastIndex = 0;
  const nextHeaderMatch = allHeadersRegex.exec(remainingText);
  
  if (nextHeaderMatch) {
    return cleanText(remainingText.slice(0, nextHeaderMatch.index));
  }
  return cleanText(remainingText);
};

// --- NLP Structuring Utilities ---

const parseExperience = (rawText) => {
  if (!rawText) return [];
  const blocks = rawText.split(/(?=\n[A-Z][a-zA-Z\s]+(?:\s*[-|]\s*|\s+)(?:20\d{2}|19\d{2}|Present|Now))/i).filter(b => b.trim().length > 10);
  
  if (blocks.length === 0) {
    // Fallback: just return one chunk if regex split failed
    return [{ company: 'Parsed Experience', role: 'Professional', duration: '', highlights: rawText.split('\n').map(s => s.trim()).filter(s => s.length > 5).slice(0, 5) }];
  }

  return blocks.map(block => {
    const lines = block.split('\n').map(l => l.trim()).filter(Boolean);
    const headerLine = lines[0] || '';
    
    // Attempt to extract duration
    const doc = nlp(headerLine);
    let duration = doc.match('#Date+').text() || doc.match('/(20|19)[0-9]{2}/').text();
    if (!duration) {
       const dateMatch = headerLine.match(/(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec|[0-9]{2})[a-z]*[\s\-,/]+(?:20|19)[0-9]{2}.*(?:Present|Now|Current|(?:20|19)[0-9]{2})/i);
       duration = dateMatch ? dateMatch[0] : '';
    }

    const highlights = lines.slice(1).filter(l => l.length > 10 && !l.toLowerCase().includes('skills:'));
    
    return {
      company: headerLine.replace(duration, '').trim() || 'Company',
      role: 'Role',
      duration: duration.trim(),
      highlights: highlights.slice(0, 4) // Max 4 highlights
    };
  });
};

const parseProjects = (rawText) => {
  if (!rawText) return [];
  const projects = [];
  const blocks = rawText.split(/\n\n/).filter(b => b.trim().length > 20);
  
  blocks.forEach(block => {
    const lines = block.split('\n').map(l => l.trim()).filter(Boolean);
    const title = lines[0];
    const desc = lines.slice(1).join(' ');
    
    // Find Tech Stack locally
    const techStack = [];
    getAllKeywords().forEach(kw => {
      if (new RegExp(`\\b${kw.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i').test(desc)) {
        techStack.push(normalizeSkill(kw));
      }
    });

    projects.push({
      title: title.length > 50 ? title.substring(0, 50) + '...' : title,
      description: desc.length > 200 ? desc.substring(0, 200) + '...' : desc,
      techStack: Array.from(new Set(techStack))
    });
  });
  return projects;
};

const parseEducation = (rawText) => {
  if (!rawText) return [];
  const lines = rawText.split('\n').map(l => l.trim()).filter(Boolean);
  if (lines.length === 0) return [];
  
  return [{
    institution: lines[0],
    degree: lines[1] || 'Degree',
    year: (rawText.match(/(?:20|19)[0-9]{2}/) || [''])[0],
    score: (rawText.match(/\b\d\.\d{1,2}\b|\b\d{2}\.d{1,2}%\b/) || [''])[0]
  }];
};

// --- ATS Engine ---

const calculateATSScore = (data) => {
  let score = 0;
  if (data.email) score += 10;
  if (data.phone) score += 10;
  if (data.skills.length >= 5) score += 20;
  if (data.skills.length >= 10) score += 10;
  if (data.experience.length > 0) score += 20;
  if (data.projects.length > 0) score += 15;
  if (data.education.length > 0) score += 15;
  
  return Math.min(100, score);
};

export const parseResumePdf = async (filePath) => {
  const text = await extractTextFromFile(filePath);
  
  const skills = extractSkillsFromText(text);

  const HEADERS_REGEX = /^(?:EDUCATION|EXPERIENCE|WORK EXPERIENCE|INTERNSHIP|PROJECTS|TECHNICAL SKILLS|SKILLS|CERTIFICATIONS|ACHIEVEMENTS|AWARDS|LANGUAGES|SUMMARY|PROFILE)\b/gim;

  const eduRegex = /^(?:EDUCATION)\b/im;
  const expRegex = /^(?:EXPERIENCE|WORK EXPERIENCE|INTERNSHIP)\b/im;
  const projRegex = /^(?:PROJECTS)\b/im;
  const certRegex = /^(?:CERTIFICATIONS)\b/im;
  const achRegex = /^(?:ACHIEVEMENTS|AWARDS)\b/im;
  const langRegex = /^(?:LANGUAGES)\b/im;

  const introText = text.slice(0, 1500);
  const emailRegex = /([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+)/i;
  const phoneRegex = /(?:(?:\+?1\s*(?:[.-]\s*)?)?(?:\(\s*([2-9]1[02-9]|[2-9][02-8]1|[2-9][02-8][02-9])\s*\)|([2-9]1[02-9]|[2-9][02-8]1|[2-9][02-8][02-9]))\s*(?:[.-]\s*)?)?([2-9]1[02-9]|[2-9][02-9]1|[2-9][02-9]{2})\s*(?:[.-]\s*)?([0-9]{4})(?:\s*(?:#|x\.?|ext\.?|extension)\s*(\d+))?/i;

  const emailMatch = introText.match(emailRegex);
  const phoneMatch = introText.match(phoneRegex);

  const rawEdu = extractSection(text, eduRegex, HEADERS_REGEX);
  const rawExp = extractSection(text, expRegex, HEADERS_REGEX);
  const rawProj = extractSection(text, projRegex, HEADERS_REGEX);
  const rawCert = extractSection(text, certRegex, HEADERS_REGEX);
  const rawAch = extractSection(text, achRegex, HEADERS_REGEX);
  const rawLang = extractSection(text, langRegex, HEADERS_REGEX);

  const structuredData = {
    text: cleanText(text),
    skills,
    email: emailMatch ? emailMatch[0] : '',
    phone: phoneMatch ? phoneMatch[0] : '',
    education: parseEducation(rawEdu),
    experience: parseExperience(rawExp),
    projects: parseProjects(rawProj),
    certifications: rawCert ? rawCert.split('\n').map(s => s.trim()).filter(Boolean) : [],
    achievements: rawAch ? rawAch.split('\n').map(s => s.trim()).filter(Boolean) : [],
    languages_spoken: rawLang ? rawLang.split('\n').map(s => s.trim()).filter(Boolean) : [],
  };

  structuredData.atsScore = calculateATSScore(structuredData);
  structuredData.missingSkills = suggestMissingSkills(skills);

  console.log('--- LOCAL NLP ATS PARSER DEBUG ---');
  console.log(`Extracted Skills Count: ${skills.length}`);
  console.log(`Parsed Experience: ${structuredData.experience.length} jobs`);
  console.log(`Parsed Projects: ${structuredData.projects.length} projects`);
  console.log(`ATS Score Calculated: ${structuredData.atsScore}/100`);
  console.log('----------------------------------');

  return structuredData;
};
