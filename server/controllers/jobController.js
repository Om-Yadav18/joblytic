import { fetchJobsFromAPI, cacheJobs, EXAMPLE_QUERIES } from '../services/adzunaService.js';
import { sortJobsByMatch } from '../services/jobMatchingService.js';

const buildJobResponse = (result, userSkills) => {
  const withMatch = sortJobsByMatch(result.jobs || [], userSkills || []);

  return {
    success: true,
    jobs: withMatch,
    page: result.page,
    total: result.total,
    hasMore: result.hasMore,
    source: result.source,
    usingDummy: result.source === 'fallback',
    apiError: result.apiError || null,
    fallbackReason: result.fallbackReason || null,
    responseTimeMs: result.responseTimeMs ?? null,
    exampleQueries: EXAMPLE_QUERIES,
    message:
      withMatch.length === 0
        ? 'No jobs found for this search. Try different keywords or location.'
        : null,
  };
};

const sendJobError = (res, error, status = 500) => {
  console.error('[jobs] Handler error:', error.message);
  return res.status(status).json({
    success: false,
    jobs: [],
    message: error.message || 'Failed to fetch jobs',
    apiError: error.message,
    usingDummy: false,
    total: 0,
    hasMore: false,
  });
};

/**
 * GET /api/jobs/recommended
 */
export const getRecommendedJobs = async (req, res) => {
  const startedAt = Date.now();
  console.log('[jobs/recommended] Incoming request', {
    userId: req.user?._id,
    query: req.query,
  });

  try {
    const page = parseInt(req.query.page, 10) || 1;
    const user = req.user;
    const query =
      user.skills?.length > 0 ? user.skills.slice(0, 2).join(' ') : 'software engineer';

    console.log('[jobs/recommended] Fetching Adzuna query:', query, 'page:', page);

    const result = await fetchJobsFromAPI({ query, page });
    cacheJobs(result.jobs, result.source);

    const payload = buildJobResponse(result, user.skills);
    console.log('[jobs/recommended] Responding', {
      source: payload.source,
      count: payload.jobs.length,
      ms: Date.now() - startedAt,
    });
    return res.json(payload);
  } catch (error) {
    return sendJobError(res, error);
  }
};

/**
 * GET /api/jobs/search?keyword=&location=&page=
 */
export const searchJobs = async (req, res) => {
  const startedAt = Date.now();
  const { keyword = 'software engineer', location = '', page = 1 } = req.query;

  console.log('[jobs/search] Incoming request', {
    userId: req.user?._id,
    keyword,
    location,
    page,
  });

  try {
    const pageNum = parseInt(page, 10) || 1;
    const user = req.user;

    const result = await fetchJobsFromAPI({
      query: keyword,
      location,
      page: pageNum,
    });

    cacheJobs(result.jobs, result.source);

    const payload = buildJobResponse(result, user.skills);
    console.log('[jobs/search] Responding', {
      source: payload.source,
      count: payload.jobs.length,
      ms: Date.now() - startedAt,
    });
    return res.json(payload);
  } catch (error) {
    return sendJobError(res, error);
  }
};

export const saveJob = async (req, res) => {
  try {
    const user = req.user;
    const jobData = req.body;
    const jobId = req.params.id || jobData.jobId;

    if (!jobId) {
      return res.status(400).json({ message: 'Job data required' });
    }

    if (user.savedJobs.some((j) => j.jobId === jobId)) {
      return res.status(400).json({ message: 'Job already saved' });
    }

    user.savedJobs.push({
      jobId,
      title: jobData.title,
      company: jobData.company,
      location: jobData.location,
      description: jobData.description,
      applyLink: jobData.applyLink,
      salary: jobData.salary,
      employmentType: jobData.employmentType,
      matchScore: jobData.matchScore || 0,
    });

    await user.save();
    res.status(201).json({ message: 'Job saved', savedJobs: user.savedJobs });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const unsaveJob = async (req, res) => {
  try {
    const user = req.user;
    user.savedJobs = user.savedJobs.filter((j) => j.jobId !== req.params.id);
    await user.save();
    res.json({ message: 'Job removed from saved', savedJobs: user.savedJobs });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const applyToJob = async (req, res) => {
  try {
    const user = req.user;
    const jobData = req.body;
    const jobId = req.params.id || jobData.jobId;

    if (user.appliedJobs.some((j) => j.jobId === jobId)) {
      return res.status(400).json({ message: 'Already applied to this job' });
    }

    user.appliedJobs.push({
      jobId,
      title: jobData.title,
      company: jobData.company,
      location: jobData.location,
      description: jobData.description,
      applyLink: jobData.applyLink,
      salary: jobData.salary,
      employmentType: jobData.employmentType,
      status: req.body.status || 'applied',
    });

    await user.save();
    res.status(201).json({ message: 'Application tracked', appliedJobs: user.appliedJobs });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateApplicationStatus = async (req, res) => {
  try {
    const user = req.user;
    const job = user.appliedJobs.find((j) => j.jobId === req.params.id);

    if (!job) {
      return res.status(404).json({ message: 'Application not found' });
    }

    const validStatuses = ['applied', 'interviewing', 'offered', 'rejected'];
    if (req.body.status && validStatuses.includes(req.body.status)) {
      job.status = req.body.status;
    }

    await user.save();
    res.json({ message: 'Status updated', appliedJobs: user.appliedJobs });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
