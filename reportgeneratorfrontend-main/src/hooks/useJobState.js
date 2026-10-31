import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectJob } from '@/app/features/jobSlice';

export const useJobState = () => {
  const dispatch = useDispatch();
  const { job } = useSelector((state) => state.job);
  
  // Use sessionStorage as primary source of truth
  const [jobValue, setJobValue] = useState(() => {
    return sessionStorage.getItem('job') || 'telecom';
  });
  
  // Sync Redux state with sessionStorage on mount
  useEffect(() => {
    const savedJob = sessionStorage.getItem('job');
    if (savedJob && savedJob !== job) {
      dispatch(selectJob(savedJob));
    }
  }, [dispatch]);
  
  // Update local state when sessionStorage changes
  useEffect(() => {
    const savedJob = sessionStorage.getItem('job');
    if (savedJob && savedJob !== jobValue) {
      setJobValue(savedJob);
    }
  }, [jobValue]);
  
  // Function to update job value in both sessionStorage and Redux
  const updateJob = (newJob) => {
    sessionStorage.setItem('job', newJob);
    setJobValue(newJob);
    dispatch(selectJob(newJob));
  };
  
  return {
    jobValue,
    updateJob,
    isJobLoaded: !!sessionStorage.getItem('job')
  };
};
