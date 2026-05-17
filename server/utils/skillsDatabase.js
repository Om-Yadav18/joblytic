/**
 * A comprehensive local dictionary for ATS keyword matching and scoring.
 */
export const skillsDatabase = {
  frontend: [
    'react', 'reactjs', 'react.js', 'vue', 'vuejs', 'vue.js', 'angular', 'next.js', 'nextjs', 
    'html', 'css', 'javascript', 'typescript', 'tailwind', 'sass', 'bootstrap', 'jquery',
    'redux', 'zustand', 'webpack', 'vite', 'babel', 'figma', 'ui/ux', 'material-ui', 'mui'
  ],
  backend: [
    'node.js', 'nodejs', 'express', 'express.js', 'nest.js', 'nestjs', 'django', 'flask', 
    'fastapi', 'spring boot', 'spring', 'ruby on rails', 'rails', 'laravel', 'asp.net', 
    'graphql', 'rest api', 'microservices', 'gRPC', 'websocket'
  ],
  languages: [
    'javascript', 'typescript', 'python', 'java', 'c++', 'c#', 'ruby', 'go', 'golang',
    'rust', 'php', 'swift', 'kotlin', 'scala', 'r', 'matlab', 'dart', 'solidity'
  ],
  databases: [
    'mongodb', 'postgresql', 'postgres', 'mysql', 'redis', 'elasticsearch', 'dynamodb', 
    'firebase', 'supabase', 'cassandra', 'sqlite', 'oracle', 'neo4j', 'sql', 'nosql'
  ],
  cloud_devops: [
    'aws', 'amazon web services', 'azure', 'gcp', 'google cloud', 'docker', 'kubernetes', 
    'k8s', 'terraform', 'jenkins', 'ci/cd', 'github actions', 'gitlab ci', 'linux', 
    'bash', 'shell', 'nginx', 'apache', 'ansible', 'serverless', 'lambda'
  ],
  data_ai: [
    'machine learning', 'deep learning', 'tensorflow', 'pytorch', 'nlp', 'ai', 
    'data analysis', 'pandas', 'numpy', 'scikit-learn', 'tableau', 'power bi', 
    'hadoop', 'spark', 'kafka', 'llm', 'generative ai', 'openai'
  ],
  tools_methodologies: [
    'git', 'github', 'gitlab', 'bitbucket', 'agile', 'scrum', 'jira', 'confluence', 
    'trello', 'postman', 'jest', 'cypress', 'selenium', 'mocha', 'chai', 'junit'
  ]
};

export const normalizeSkill = (skill) => {
  const s = skill.toLowerCase();
  const map = {
    'reactjs': 'React', 'react.js': 'React', 'react': 'React',
    'nodejs': 'Node.js', 'node.js': 'Node.js', 'node': 'Node.js',
    'vuejs': 'Vue', 'vue.js': 'Vue', 'vue': 'Vue',
    'nextjs': 'Next.js', 'next.js': 'Next.js',
    'expressjs': 'Express', 'express.js': 'Express', 'express': 'Express',
    'golang': 'Go', 'go': 'Go',
    'c++': 'C++', 'c#': 'C#',
    'postgres': 'PostgreSQL', 'postgresql': 'PostgreSQL',
    'aws': 'AWS', 'amazon web services': 'AWS',
    'gcp': 'GCP', 'google cloud': 'GCP',
    'k8s': 'Kubernetes', 'kubernetes': 'Kubernetes',
    'machine learning': 'Machine Learning', 'ml': 'Machine Learning',
    'ai': 'AI', 'artificial intelligence': 'AI',
    'typescript': 'TypeScript', 'javascript': 'JavaScript',
    'mongodb': 'MongoDB', 'mysql': 'MySQL', 'sql': 'SQL'
  };
  
  return map[s] || skill.charAt(0).toUpperCase() + skill.slice(1);
};

export const getAllKeywords = () => {
  const all = new Set();
  Object.values(skillsDatabase).forEach(category => {
    category.forEach(skill => all.add(skill));
  });
  return Array.from(all);
};

export const suggestMissingSkills = (foundSkills) => {
  const foundLower = foundSkills.map(s => s.toLowerCase());
  const suggestions = new Set();
  
  // Basic recommendation logic based on found skills
  if (foundLower.includes('react') && !foundLower.includes('next.js')) suggestions.add('Next.js');
  if ((foundLower.includes('javascript') || foundLower.includes('react')) && !foundLower.includes('typescript')) suggestions.add('TypeScript');
  if (foundLower.includes('node.js') && !foundLower.includes('express')) suggestions.add('Express');
  if (foundLower.includes('express') && !foundLower.includes('mongodb') && !foundLower.includes('postgresql')) suggestions.add('MongoDB');
  if ((foundLower.includes('python') || foundLower.includes('java')) && !foundLower.includes('docker')) suggestions.add('Docker');
  if (foundLower.includes('docker') && !foundLower.includes('kubernetes')) suggestions.add('Kubernetes');
  
  // Generic highly desirable skills if missing
  if (!foundLower.includes('git')) suggestions.add('Git');
  if (!foundLower.includes('ci/cd')) suggestions.add('CI/CD');
  
  return Array.from(suggestions).slice(0, 5); // Return max 5
};
