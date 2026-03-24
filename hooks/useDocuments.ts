import { useEffect, useState } from 'react';
import { listDocumentsApi } from '../services/api';
import { useAuthStore } from '../store/authStore';

export interface Document {
  id: string;
  fileName: string;
  fileSize: number;
  status: string;
  updatedAt: string;
  processingCompletedAt?: string;
}

const toNumber = (value: any) => {
  const num = Number(value);
  return Number.isFinite(num) ? num : 0;
};

const normalizeStatus = (value: any) => String(value || 'UNKNOWN').trim().toUpperCase();

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
      const rawDocs =
        response.data?.items ||
        response.data?.documents ||
        response.items ||
        response.documents ||
        [];

      const docs: Document[] = (Array.isArray(rawDocs) ? rawDocs : []).map((doc: any) => ({
        id: String(doc?.id || doc?.documentId || doc?._id || ''),
        fileName: String(
          doc?.fileName || doc?.filename || doc?.name || doc?.originalName || 'Unknown.pdf'
        ),
        fileSize: toNumber(doc?.fileSize ?? doc?.size ?? doc?.file_size),
        status: normalizeStatus(doc?.status || doc?.processingStatus || doc?.documentStatus),
        updatedAt:
          doc?.updatedAt ||
          doc?.updated_at ||
          doc?.processingCompletedAt ||
          doc?.createdAt ||
          new Date().toISOString(),
        processingCompletedAt: doc?.processingCompletedAt,
      }));
      
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