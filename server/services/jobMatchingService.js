import { extractSkillsFromJobDescription } from '../utils/skillsExtractor.js';

/**
 * Calculate match percentage between user skills and job
 */
export const calculateMatchScore = (userSkills = [], jobDescription = '', jobSkills = []) => {
  const normalizedUser = userSkills.map((s) => s.toLowerCase().trim()).filter(Boolean);

  if (normalizedUser.length === 0) return 0;

  const jobSkillSet = new Set(
    [...(jobSkills || []), ...extractSkillsFromJobDescription(jobDescription)]
      .map((s) => s.toLowerCase().trim())
      .filter(Boolean)
  );

  if (jobSkillSet.size === 0) {
    // Fallback: check if any user skill appears in description
    const desc = (jobDescription || '').toLowerCase();
    const matches = normalizedUser.filter((skill) => desc.includes(skill));
    return Math.round((matches.length / normalizedUser.length) * 100);
  }

  let matchCount = 0;
  for (const skill of normalizedUser) {
    if (jobSkillSet.has(skill)) {
      matchCount++;
      continue;
    }
    for (const js of jobSkillSet) {
      if (js.includes(skill) || skill.includes(js)) {
        matchCount++;
        break;
      }
    }
  }

  return Math.round((matchCount / normalizedUser.length) * 100);
};

/**
 * Sort jobs by match score descending
 */
export const sortJobsByMatch = (jobs, userSkills) => {
  return jobs
    .map((job) => ({
      ...job,
      matchScore: calculateMatchScore(
        userSkills,
        job.description,
        job.skills
      ),
    }))
    .sort((a, b) => b.matchScore - a.matchScore);
};
