export const APPLICATION_STATUSES = [
  { value: 'applied', label: 'Applied', color: 'bg-blue-500/20 text-blue-400' },
  { value: 'interviewing', label: 'Interviewing', color: 'bg-yellow-500/20 text-yellow-400' },
  { value: 'offered', label: 'Offered', color: 'bg-green-500/20 text-green-400' },
  { value: 'rejected', label: 'Rejected', color: 'bg-red-500/20 text-red-400' },
];

export const getMatchColor = (score) => {
  if (score >= 80) return 'text-green-400';
  if (score >= 60) return 'text-yellow-400';
  if (score >= 40) return 'text-orange-400';
  return 'text-red-400';
};
