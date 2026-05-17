import fs from 'fs';
import User from '../models/User.js';
import { parseResumePdf } from '../services/resumeParserService.js';

/**
 * POST /api/resume/upload
 */
export const uploadResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Please upload a PDF resume' });
    }

    const parsedData = await parseResumePdf(req.file.path);
    const { text, skills, phone, email, education, experience, projects, certifications, achievements, languages_spoken, atsScore, missingSkills } = parsedData;

    const user = await User.findById(req.user._id);
    user.resumeUrl = `/uploads/${req.file.filename}`;
    user.resumeText = text;
    
    // Defensive Normalization: Fix legacy string data before saving
    if (!Array.isArray(user.education)) user.education = [];
    if (!Array.isArray(user.experience)) user.experience = [];
    if (!Array.isArray(user.projects)) user.projects = [];
    if (!Array.isArray(user.certifications)) user.certifications = [];
    if (!Array.isArray(user.achievements)) user.achievements = [];
    if (!Array.isArray(user.languages_spoken)) user.languages_spoken = [];

    // Safe deep-filter before assignment to prevent synchronous Mongoose CastErrors
    const safeEdu = Array.isArray(education) ? education.filter(item => typeof item === 'object' && item !== null && !Array.isArray(item) && Object.keys(item).length > 0) : [];
    const safeExp = Array.isArray(experience) ? experience.filter(item => typeof item === 'object' && item !== null && !Array.isArray(item) && Object.keys(item).length > 0) : [];
    const safeProj = Array.isArray(projects) ? projects.filter(item => typeof item === 'object' && item !== null && !Array.isArray(item) && Object.keys(item).length > 0) : [];

    // Save structured data if found (only overwrite if parsed correctly to avoid wiping existing manual entry)
    if (phone) user.phone = phone;
    if (safeEdu.length > 0) user.education = safeEdu;
    if (safeExp.length > 0) user.experience = safeExp;
    if (safeProj.length > 0) user.projects = safeProj;
    if (Array.isArray(certifications) && certifications.length > 0) user.certifications = certifications;
    if (Array.isArray(achievements) && achievements.length > 0) user.achievements = achievements;
    if (Array.isArray(languages_spoken) && languages_spoken.length > 0) user.languages_spoken = languages_spoken;
    if (atsScore !== undefined) user.atsScore = atsScore;
    if (missingSkills) user.missingSkills = missingSkills;

    // Merge extracted skills with existing, dedupe
    const merged = new Set([...(user.skills || []), ...skills]);
    user.skills = Array.from(merged);

    await user.save();

    // Keep file on disk for reference; optional cleanup of old files can be added later

    res.json({
      message: 'Resume uploaded and parsed successfully',
      resumeUrl: user.resumeUrl,
      skills: user.skills,
      skillsExtracted: skills.length,
      preview: text.slice(0, 500),
    });
  } catch (error) {
    if (req.file?.path && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    res.status(500).json({ message: error.message || 'Failed to parse resume' });
  }
};
