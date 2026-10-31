import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectJob, setUserDetails } from '@/app/features/jobSlice';

const StateRestoration = ({ children }) => {
  const dispatch = useDispatch();
  const { job, user } = useSelector((state) => state.job);

  useEffect(() => {
    console.log('StateRestoration - Current Redux job:', job, 'Current Redux user:', user);
    
    // Restore job value from sessionStorage
    const savedJob = sessionStorage.getItem('job');
    console.log('StateRestoration - Saved job from sessionStorage:', savedJob);
    
    if (savedJob && !job) {
      console.log('StateRestoration - Restoring job to Redux:', savedJob);
      dispatch(selectJob(savedJob));
    }

    // Restore user data from sessionStorage
    if (!user || user.length === 0) {
      const userId = sessionStorage.getItem('userId');
      const jobValue = sessionStorage.getItem('job');
      console.log('StateRestoration - Restoring user data:', { userId, jobValue });
      
      if (userId && jobValue) {
        // Create a minimal user object from sessionStorage data
        const userData = [{
          _id: userId,
          accessLevel: jobValue,
          // Add other fields as needed
        }];
        dispatch(setUserDetails(userData));
      }
    }
  }, [dispatch, job, user]);

  return <>{children}</>;
};

export default StateRestoration;
