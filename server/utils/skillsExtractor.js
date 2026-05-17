/**
 * Dictionary mapping for skill normalization (e.g., "React.js" -> "React")
 */
const SKILL_NORMALIZATION_MAP = {
  'react.js': 'React',
  'reactjs': 'React',
  'node.js': 'Node.js',
  'nodejs': 'Node.js',
  'vue.js': 'Vue',
  'vuejs': 'Vue',
  'next.js': 'Next.js',
  'nextjs': 'Next.js',
  'express.js': 'Express',
  'expressjs': 'Express',
  'golang': 'Go',
  'c++': 'C++',
  'c#': 'C#',
};

/**
 * Common tech skills for keyword extraction from resume text
 */
const SKILL_KEYWORDS = [
  'javascript', 'typescript', 'python', 'java', 'c++', 'c#', 'ruby', 'go', 'golang',
  'rust', 'php', 'swift', 'kotlin', 'scala', 'r', 'matlab',
  'react', 'vue', 'angular', 'next.js', 'nextjs', 'node.js', 'nodejs', 'express',
  'django', 'flask', 'fastapi', 'spring', 'laravel', 'rails',
  'mongodb', 'postgresql', 'mysql', 'redis', 'elasticsearch', 'dynamodb', 'firebase',
  'aws', 'azure', 'gcp', 'docker', 'kubernetes', 'terraform', 'jenkins', 'ci/cd',
  'git', 'github', 'gitlab', 'graphql', 'rest', 'api',
  'html', 'css', 'tailwind', 'sass', 'bootstrap',
  'machine learning', 'deep learning', 'tensorflow', 'pytorch', 'nlp', 'ai',
  'data analysis', 'pandas', 'numpy', 'sql', 'tableau', 'power bi',
  'agile', 'scrum', 'jira', 'figma', 'ux', 'ui',
  'linux', 'bash', 'shell', 'microservices', 'serverless',
  'blockchain', 'solidity', 'web3',
  'android', 'ios', 'react native', 'flutter',
  'selenium', 'jest', 'cypress', 'testing',
  'project management', 'leadership', 'communication',
];

/**
 * Extract skills from resume text using keyword matching and normalization
 */
export const extractSkillsFromText = (text) => {
  if (!text || typeof text !== 'string') return [];

  const lowerText = text.toLowerCase();
  const found = new Set();

  for (const skill of SKILL_KEYWORDS) {
    const pattern = new RegExp(`\\b${skill.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
    if (pattern.test(lowerText)) {
      // Normalize if it exists in map, otherwise title case it
      let finalSkill = SKILL_NORMALIZATION_MAP[skill.toLowerCase()];
      if (!finalSkill) {
        finalSkill = skill
          .split(' ')
          .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
          .join(' ');
      }
      found.add(finalSkill);
    }
  }

  return Array.from(found).sort();
};

/**
 * Extract skill-like tokens from job description
 */
export const extractSkillsFromJobDescription = (description) => {
  return extractSkillsFromText(description);
};
