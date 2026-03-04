import { useEffect, useState } from 'react';
import { listDocumentsApi } from '../services/api';
import { useAuthStore } from '../store/authStore';

export interface Document {
  id: string;
  fileName: string;
  fileSize: number;
  status: 'PENDING_UPLOAD' | 'PROCESSING' | 'COMPLETED' | 'FAILED';
  updatedAt: string;
  processingCompletedAt?: string;
}

export const useDocuments = () => {
  const token = useAuthStore((s) => s.token);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDocuments = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await listDocumentsApi(token || undefined);
      const docs = response.data?.items || response.documents || [];
      
      console.log('� Documents API Response:', {
        raw: response,
        docsCount: docs.length,
        docs: docs.map((d: Document) => ({ 
          id: d.id, 
          fileName: d.fileName, 
          status: d.status,
          updatedAt: d.updatedAt 
        }))
      });
      
      setDocuments(docs);
    } catch (err: any) {
      console.error('❌ Documents fetch error:', err);
      setError(err.message || 'Failed to load documents');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchDocuments();
    }
  }, [token]);

  return { documents, loading, error, refetch: fetchDocuments };
};