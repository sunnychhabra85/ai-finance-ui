import { useEffect, useState } from 'react';
import { pollDocumentStatusApi } from '../services/api';
import { useAuthStore } from '../store/authStore';

/**
 * Hook to poll document processing status
 * Usage: const { status, isPolling } = useDocumentStatus(documentId);
 */
export const useDocumentStatus = (documentId: string | null, intervalMs = 3000) => {
  const token = useAuthStore((s) => s.token);
  const [status, setStatus] = useState<string>('UNKNOWN');
  const [isPolling, setIsPolling] = useState(false);

  useEffect(() => {
    if (!documentId || !token) return;

    setIsPolling(true);
    
    const poll = async () => {
      try {
        const response = await pollDocumentStatusApi(documentId, token);
        const newStatus = response.data?.status || response.status;
        setStatus(newStatus);
        
        // Stop polling if completed or failed
        if (newStatus === 'COMPLETED' || newStatus === 'FAILED') {
          setIsPolling(false);
        }
      } catch (err) {
        console.error('Status polling error:', err);
      }
    };

    // Initial poll
    poll();
    
    // Set up interval if still processing
    const intervalId = setInterval(() => {
      if (status !== 'COMPLETED' && status !== 'FAILED') {
        poll();
      }
    }, intervalMs);

    return () => clearInterval(intervalId);
  }, [documentId, token, intervalMs, status]);

  return { status, isPolling };
};
