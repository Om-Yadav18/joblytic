import { useState, useCallback, useRef } from 'react';
import { getRecommendedJobs, searchJobs, saveJob, unsaveJob, applyToJob, getApiErrorMessage } from '../services/api';
import { useAuth } from '../context/AuthContext';

export function useJobs() {
  const { refreshUser, user } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [emptyMessage, setEmptyMessage] = useState(null);
  const [apiError, setApiError] = useState(null);
  const [usingFallback, setUsingFallback] = useState(false);
  const [fallbackReason, setFallbackReason] = useState(null);
  const [source, setSource] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const requestIdRef = useRef(0);

  const applyResponse = (data, pageNum) => {
    console.log('[useJobs] applyResponse data:', data);
    
    // Clear previous states before applying new ones
    setError(null);
    setApiError(null);
    setEmptyMessage(null);

    const list = Array.isArray(data?.jobs) ? data.jobs : [];
    setJobs(list);
    setPage(pageNum);
    setHasMore(Boolean(data?.hasMore));
    setSource(data?.source || null);
    setUsingFallback(Boolean(data?.usingDummy));
    setFallbackReason(data?.fallbackReason || null);
    
    if (data?.apiError) {
      setApiError(data.apiError);
    }

    if (data?.apiError && data?.usingDummy) {
      setError(data.apiError);
    } else if (data?.success === false) {
      setError(data.message || 'Search failed');
    }

    if (list.length === 0 && !data?.apiError && data?.success !== false) {
      setEmptyMessage(data?.message || 'No jobs found. Try different keywords or location.');
    }
  };

  const fetchRecommended = useCallback(async (pageNum = 1) => {
    const reqId = ++requestIdRef.current;
    setLoading(true);
    setError(null);
    setEmptyMessage(null);
    setApiError(null);

    try {
      const { data } = await getRecommendedJobs(pageNum);
      console.log('[useJobs] Recommended API raw response:', data);
      if (reqId !== requestIdRef.current) return;
      if (!data || typeof data !== 'object') {
        throw new Error('Invalid response from server');
      }
      applyResponse(data, pageNum);
    } catch (err) {
      console.error('[useJobs] Recommended fetch error:', err);
      if (reqId !== requestIdRef.current) return;
      const msg = getApiErrorMessage(err, 'Failed to fetch jobs');
      setError(msg);
      setJobs([]);
      setEmptyMessage(null);
    } finally {
      if (reqId === requestIdRef.current) {
        setLoading(false);
      }
    }
  }, []);

  const search = useCallback(async (keyword, location, pageNum = 1) => {
    const reqId = ++requestIdRef.current;
    setLoading(true);
    setError(null);
    setEmptyMessage(null);
    setApiError(null);

    try {
      const { data } = await searchJobs({ keyword, location, page: pageNum });
      console.log('[useJobs] Search API raw response:', data);
      if (reqId !== requestIdRef.current) return;
      if (!data || typeof data !== 'object') {
        throw new Error('Invalid response from server');
      }
      applyResponse(data, pageNum);
    } catch (err) {
      console.error('[useJobs] Search fetch error:', err);
      if (reqId !== requestIdRef.current) return;
      const msg = getApiErrorMessage(err, 'Search failed');
      setError(msg);
      setJobs([]);
      setEmptyMessage(null);
    } finally {
      if (reqId === requestIdRef.current) {
        setLoading(false);
      }
    }
  }, []);

  const handleSave = async (job) => {
    await saveJob(job.jobId, job);
    await refreshUser();
  };

  const handleUnsave = async (job) => {
    await unsaveJob(job.jobId);
    await refreshUser();
  };

  const handleApply = async (job) => {
    await applyToJob(job.jobId, job);
    await refreshUser();
  };

  const isSaved = (jobId) => user?.savedJobs?.some((j) => j.jobId === jobId);
  const isApplied = (jobId) => user?.appliedJobs?.some((j) => j.jobId === jobId);

  return {
    jobs,
    loading,
    error,
    emptyMessage,
    apiError,
    usingFallback,
    fallbackReason,
    source,
    page,
    hasMore,
    fetchRecommended,
    search,
    handleSave,
    handleUnsave,
    handleApply,
    isSaved,
    isApplied,
  };
}
