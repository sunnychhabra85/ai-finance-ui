import { uploadDocumentApi } from "@/services/api";
import { Ionicons } from "@expo/vector-icons";
import * as DocumentPicker from "expo-document-picker";
import React, { useEffect, useRef } from "react";
import {
  ActivityIndicator,
  Platform,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions
} from "react-native";
import { ResponsiveContainer } from "../../components/ResponsiveContainer";
import { UploadItem } from "../../components/UploadItem";
import { useDocuments } from "../../hooks/useDocuments";
import { useAuthStore } from "../../store/authStore";
import { useUploadStore } from "../../store/uploadStore";
import { colors } from "../../theme/colors";
import { getAdaptivePadding } from "../../utils/responsive";

const PROCESSING_STATUSES = new Set([
  'PROCESSING',
  'PENDING_UPLOAD',
  'UPLOADING',
  'IN_PROGRESS',
  'QUEUED',
]);

const DONE_STATUSES = new Set([
  'COMPLETED',
  'UPLOADED',
  'DONE',
  'SUCCESS',
  'PARSED',
  'PROCESSED',
  'COMPLETED_SUCCESSFULLY',
]);

const TERMINAL_STATUSES = new Set([
  ...DONE_STATUSES,
  'FAILED',
  'ERROR',
  'CANCELLED',
]);

const normalizeDocumentStatus = (status: string) =>
  String(status || 'UNKNOWN').trim().toUpperCase();

const isProcessingStatus = (status: string) =>
  PROCESSING_STATUSES.has(normalizeDocumentStatus(status));

const isDoneStatus = (status: string) => {
  const normalized = normalizeDocumentStatus(status);
  return DONE_STATUSES.has(normalized) || TERMINAL_STATUSES.has(normalized);
};

export default function Upload() {
  const { uploads, addUpload, markDone } = useUploadStore();
  const token = useAuthStore((s) => s.token);
  const { width } = useWindowDimensions();
  const padding = getAdaptivePadding(width);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fetch real document history
  const { documents, loading, refetch } = useDocuments();

  const MAX_SIZE_BYTES = 10 * 1024 * 1024; // 10MB
  
  // Track if we're actively polling
  const hasProcessingDocs = documents.some(
    (doc) => isProcessingStatus(doc.status)
  );

  // Auto-refresh when there are processing documents
  useEffect(() => {
    const processingDocs = documents.filter(
      (doc) => isProcessingStatus(doc.status)
    );
    const hasProcessingDocs = processingDocs.length > 0;

    console.log('📊 Document Status Check:', {
      total: documents.length,
      processing: processingDocs.length,
      statuses: documents.map(d => ({ id: d.id, fileName: d.fileName, status: d.status }))
    });

    if (hasProcessingDocs && token) {
      console.log(`🔄 Auto-polling ENABLED: Found ${processingDocs.length} processing document(s)`);
      const intervalId = setInterval(() => {
        console.log('⏱️  Polling now...');
        refetch();
      }, 3000); // Poll every 3 seconds

      return () => {
        console.log('🛑 Auto-polling STOPPED');
        clearInterval(intervalId);
      };
    } else if (!hasProcessingDocs && documents.length > 0) {
      console.log('✅ All documents completed - polling not needed');
    }
  }, [documents, token]);
  
  // Also refresh on mount
  useEffect(() => {
    if (token) {
      console.log('🚀 Initial load: Fetching documents...');
      refetch();
    }
  }, []);

  const pickFileWeb = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleWebFileChange = async (event: any) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      alert('Please select a PDF file');
      return;
    }

    if (file.size > MAX_SIZE_BYTES) {
      alert('File size must be 10MB or less');
      return;
    }

    const id = Date.now().toString();
    const sizeInMB = (file.size / 1024 / 1024).toFixed(1);

    addUpload({
      id,
      name: file.name,
      size: `${sizeInMB} MB`,
      date: new Date().toLocaleDateString(),
      status: "processing",
    });

    try {
      await uploadDocumentApi(file, token || undefined);
      markDone(id);
      
      console.log('✅ Upload complete, refreshing document list...');
      // Refresh document list after successful upload
      await refetch();
    } catch (error) {
      console.error('Upload error:', error);
      alert('Upload failed. Please try again.');
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const pickFile = async () => {
    if (Platform.OS === 'web') {
      pickFileWeb();
      return;
    }

    const res = await DocumentPicker.getDocumentAsync({
      type: "application/pdf",
      copyToCacheDirectory: true,
    });

    if (res.canceled) return;

    const file = res.assets[0];

    if (file.size && file.size > MAX_SIZE_BYTES) {
      alert('File size must be 10MB or less');
      return;
    }

    const id = Date.now().toString();

    const nativeSize = typeof file.size === 'number' ? file.size : 0;

    addUpload({
      id,
      name: file.name,
      size: nativeSize > 0 ? `${(nativeSize / 1024 / 1024).toFixed(1)} MB` : 'Unknown size',
      date: new Date().toLocaleDateString(),
      status: "processing",
    });

    try {
      await uploadDocumentApi(file, token || undefined);
      markDone(id);
      
      console.log('✅ Upload complete, refreshing document list...');
      // Refresh document list after successful upload
      await refetch();
    } catch (error) {
      console.error('Upload error:', error);
      alert('Upload failed. Please try again.');
    }
  };

  const formatStatus = (status: string) => {
    const normalized = normalizeDocumentStatus(status);

    if (isDoneStatus(normalized)) {
      return 'done';
    }

    if (!isProcessingStatus(normalized)) {
      console.warn(`⚠️  Unknown document status: "${status}" - treating as processing`);
    }

    return 'processing';
  };

  return (
    <ResponsiveContainer 
      contentContainerStyle={{ paddingHorizontal: padding }}
      refreshControl={
        <RefreshControl refreshing={loading} onRefresh={refetch} />
      }
    >
      <Text style={styles.title}>Upload Statement</Text>
      <Text style={styles.subtitle}>
        Upload your bank PDF to analyze spending
      </Text>

      {/* Upload box */}
      <TouchableOpacity style={styles.uploadBox} onPress={pickFile}>
        <View style={styles.iconCircle}>
          <Ionicons name="cloud-upload-outline" size={28} color="#2563EB" />
        </View>
        <Text style={styles.uploadTitle}>Tap to Upload PDF</Text>
        <Text style={styles.uploadSub}>
          Supports standard bank statements PDF up to 10MB
        </Text>
      </TouchableOpacity>

      {Platform.OS === 'web' && (
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,application/pdf"
          onChange={handleWebFileChange}
          style={{ display: 'none' }}
        />
      )}

      <Text style={styles.recent}>RECENT UPLOADS</Text>
      
      {hasProcessingDocs && (
        <View style={{ 
          flexDirection: 'row', 
          alignItems: 'center', 
          backgroundColor: '#FEF3C7', 
          padding: 10, 
          borderRadius: 8,
          marginBottom: 10 
        }}>
          <ActivityIndicator size="small" color="#F59E0B" style={{ marginRight: 8 }} />
          <Text style={{ color: '#92400E', fontSize: 12 }}>
            Processing documents... Auto-refreshing
          </Text>
        </View>
      )}

      {loading && documents.length === 0 && (
        <ActivityIndicator size="large" color="#2563EB" style={{ marginVertical: 20 }} />
      )}

      {/* Show document history from backend */}
      {documents.length === 0 && !loading && (
        <Text style={{ color: colors.textLight, textAlign: 'center', marginTop: 20 }}>
          No uploads yet. Upload a PDF to get started!
        </Text>
      )}

      {documents.map((doc) => (
        <UploadItem
          key={doc.id}
          file={doc.fileName}
          size={`${(doc.fileSize / 1024 / 1024).toFixed(2)} MB`}
          date={new Date(doc.updatedAt).toLocaleDateString()}
          status={formatStatus(doc.status)}
          color="#DBEAFE"
        />
      ))}
    </ResponsiveContainer>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 26, fontWeight: "700" },
  subtitle: {
    color: colors.textLight,
    marginTop: 6,
    marginBottom: 24,
  },
  uploadBox: {
    borderWidth: 2,
    borderStyle: "dashed",
    borderColor: "#CBD5E1",
    borderRadius: 18,
    paddingVertical: 36,
    alignItems: "center",
    marginBottom: 28,
  },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#EFF6FF",
    justifyContent: "center",
    alignItems: "center",   
    marginBottom: 14,
  },
  uploadTitle: { fontWeight: "700", fontSize: 16 },
  uploadSub: {
    color: colors.textLight,
    fontSize: 13,
    marginTop: 6,
    textAlign: "center",
    paddingHorizontal: 30,
  },
  recent: {
    fontSize: 12,
    letterSpacing: 1.2,
    color: colors.textLight,
    marginBottom: 10,
  },
});