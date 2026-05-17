/**
 * Fallback jobs only when Adzuna API is unavailable
 */
export const getDummyJobs = (query = 'developer', location = '') => {
  const loc = location || 'Remote';
  return [
    {
      jobId: `dummy-${query}-1`,
      title: `Senior ${query}`,
      company: 'TechNova Inc',
      location: loc,
      description: `We need a ${query} with React, Node.js, MongoDB, TypeScript, AWS, Docker experience.`,
      applyLink: 'https://example.com/apply/1',
      salary: 'Not disclosed',
      employmentType: 'FULLTIME',
      skills: ['React', 'Node.js', 'MongoDB', 'TypeScript', 'AWS', 'Docker'],
    },
    {
      jobId: `dummy-${query}-2`,
      title: `Full Stack ${query}`,
      company: 'DataPulse Labs',
      location: loc,
      description: `Python, Django, PostgreSQL, REST API, Git, Agile team.`,
      applyLink: 'https://example.com/apply/2',
      salary: '$90,000 - $120,000/year',
      employmentType: 'FULLTIME',
      skills: ['Python', 'Django', 'PostgreSQL', 'Rest', 'Git', 'Agile'],
    },
    {
      jobId: `dummy-${query}-3`,
      title: `${query} — Frontend`,
      company: 'CloudSync',
      location: loc,
      description: `Vue, JavaScript, HTML, CSS, Tailwind, Figma.`,
      applyLink: 'https://example.com/apply/3',
      salary: '$70,000 - $95,000/year',
      employmentType: 'CONTRACTOR',
      skills: ['Vue', 'Javascript', 'Html', 'Css', 'Tailwind', 'Figma'],
    },
  ];
};
