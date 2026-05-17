import axios from 'axios';
import Job from '../models/Job.js';
import { extractSkillsFromJobDescription } from '../utils/skillsExtractor.js';
import { getDummyJobs } from '../utils/dummyJobs.js';
import { env } from '../config/env.js';

const REQUEST_TIMEOUT_MS = 10000;
const LOG = '[Adzuna]';

export const EXAMPLE_QUERIES = [
  'software engineer',
  'frontend developer',
  'react developer',
];

const formatSalary = (min, max) => {
  if (!min && !max) return null;
  const currency = '₹';
  const fmt = (n) => Number(n).toLocaleString();
  if (min && max) return `${currency}${fmt(min)} - ${currency}${fmt(max)}/year`;
  if (min) return `${currency}${fmt(min)}+/year`;
  if (max) return `Up to ${currency}${fmt(max)}/year`;
  return null;
};

const mapJob = (item) => {
  const jobId = item.id || `adzuna-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  const description = item.description || '';
  
  return {
    jobId: String(jobId),
    title: item.title || 'Untitled',
    company: item.company?.display_name || 'Unknown',
    location: item.location?.display_name || 'Remote',
    description: description.replace(/<[^>]+>/g, ''), // Strip basic HTML if any
    applyLink: item.redirect_url || '',
    salary: formatSalary(item.salary_min, item.salary_max) || 'Not disclosed',
    employmentType: item.contract_type ? item.contract_type.toUpperCase() : 'Not specified',
    skills: extractSkillsFromJobDescription(description),
  };
};

/**
 * Fetch jobs from Adzuna Job Search endpoint
 */
export const fetchJobsFromAPI = async ({ query = 'developer', location = '', page = 1 }) => {
  const pageNum = Math.max(1, parseInt(page, 10) || 1);
  const startedAt = Date.now();

  if (!env.adzunaAppId || !env.adzunaAppKey) {
    const reason = 'ADZUNA_APP_ID or ADZUNA_APP_KEY is missing in server/.env';
    console.warn(`${LOG} Fallback: ${reason}`);
    return {
      jobs: getDummyJobs(query, location),
      source: 'fallback',
      fallbackReason: reason,
      apiError: reason,
      page: pageNum,
      total: 3,
      hasMore: false,
      responseTimeMs: Date.now() - startedAt,
    };
  }

  // Country 'in' for India as per user request
  const url = `https://api.adzuna.com/v1/api/jobs/in/search/${pageNum}`;
  const params = {
    app_id: env.adzunaAppId,
    app_key: env.adzunaAppKey,
    what: query,
    where: location || '',
    results_per_page: 10,
  };

  console.log(`${LOG} API request URL: ${url}`);
  console.log(`${LOG}   params: what=${params.what}, where=${params.where}, page=${pageNum}`);

  try {
    const response = await axios.get(url, {
      params,
      timeout: REQUEST_TIMEOUT_MS,
      headers: {
        'Accept': 'application/json',
      },
    });

    const responseTimeMs = Date.now() - startedAt;
    const bodyLength = JSON.stringify(response.data || {}).length;
    const httpStatus = response.status;
    const jobsRaw = Array.isArray(response.data?.results) ? response.data.results : [];

    console.log(`${LOG} Response status: HTTP ${httpStatus}`);
    console.log(`${LOG}   response time: ${responseTimeMs}ms`);
    console.log(`${LOG}   body length: ${bodyLength} chars`);
    console.log(`${LOG}   jobs count: ${jobsRaw.length}`);

    if (process.env.NODE_ENV !== 'production' && jobsRaw.length > 0) {
      console.log(`${LOG}   sample job title:`, jobsRaw[0].title);
    }

    const jobs = jobsRaw.map(mapJob);

    return {
      jobs,
      source: 'live',
      fallbackReason: null,
      apiError: null,
      page: pageNum,
      total: jobs.length, // Only returning count of current page as total isn't strictly needed for our UI
      hasMore: jobs.length >= 10,
      responseTimeMs,
    };
  } catch (error) {
    const responseTimeMs = Date.now() - startedAt;
    const isTimeout = error.code === 'ECONNABORTED' || error.message?.includes('timeout');
    const reason = isTimeout
      ? `Adzuna request timed out after ${REQUEST_TIMEOUT_MS}ms`
      : error.response?.data?.message ||
        error.message ||
        'Unknown Adzuna error';

    console.error(`${LOG} Caught error: ${reason}`);
    console.error(`${LOG}   response time: ${responseTimeMs}ms`);
    if (error.response?.status) {
      console.error(`${LOG}   HTTP status: ${error.response.status}`);
      console.error(`${LOG}   Response data:`, error.response.data);
    }

    return {
      jobs: getDummyJobs(query, location),
      source: 'fallback',
      fallbackReason: reason,
      apiError: reason,
      page: pageNum,
      total: 3,
      hasMore: false,
      responseTimeMs,
    };
  }
};

/**
 * Cache jobs in background — must not block HTTP response
 */
export const cacheJobs = (jobs, source = 'live') => {
  if (source !== 'live' || !jobs?.length) return;

  setImmediate(async () => {
    const cacheStart = Date.now();
    let cached = 0;
    for (const job of jobs) {
      if (job.jobId?.startsWith('dummy-')) continue;
      try {
        await Job.findOneAndUpdate(
          { jobId: job.jobId },
          { ...job, fetchedAt: new Date() },
          { upsert: true, new: true }
        );
        cached++;
      } catch (err) {
        console.warn(`${LOG} Cache skip job ${job.jobId}:`, err.message);
      }
    }
    console.log(`${LOG} Background cache: ${cached}/${jobs.length} jobs in ${Date.now() - cacheStart}ms`);
  });
};
