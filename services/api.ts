import { Platform } from 'react-native';

// IMPORTANT: To run on a physical device, you need to use your computer's local IP address
// instead of localhost or 10.0.2.2. Find your IP address:
// - Windows: Run 'ipconfig' and look for IPv4 Address (e.g., 192.168.1.100)
// - Mac/Linux: Run 'ifconfig' or 'ip addr' (e.g., 192.168.1.100)
// Then set these environment variables or update the fallback IPs below

// For physical devices, replace these with your computer's local network IP
const DEVICE_IP = process.env.EXPO_PUBLIC_API_HOST || '10.0.2.2'; // Change to your IP (e.g., '192.168.1.100')

const getApiBase = () => {
  const platformOS = Platform.OS;
  
  if (platformOS === 'web') {
    return process.env.REACT_APP_API_BASE || 'http://localhost:3001/api/v1';
  }
  // For Android/iOS, use DEVICE_IP which works for both emulator (10.0.2.2) and physical devices
  if (platformOS === 'android' || platformOS === 'ios') {
    return `http://${DEVICE_IP}:3001/api/v1`;
  }
  return 'http://localhost:3001/api/v1';
};

export const API_BASE = getApiBase();

export const apiPost = async (url: string, body: any) => {
  const fullUrl = `${API_BASE}${url}`;
  
  console.log('🚀 Making API request:', { url: fullUrl, method: 'POST' });
  
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      console.error('⏰ Request timeout after 30 seconds');
      controller.abort();
    }, 30000); // 30 second timeout (increased from 10s)

    const res = await fetch(fullUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);
    console.log('✅ API response received:', { status: res.status, url: fullUrl });

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`API Error: ${res.status} ${res.statusText} - ${errorText}`);
    }
    return res.json();
  } catch (error: any) {
    if (error?.name === 'AbortError') {
      console.error('❌ Request aborted - Backend not responding!', {
        url: fullUrl,
        platform: Platform.OS,
        deviceIP: DEVICE_IP,
        possibleCauses: [
          '1. Backend service is not running',
          '2. Wrong IP address or port',
          '3. Firewall blocking connection',
          '4. Not on same network (for physical device)'
        ]
      });
      throw new Error(`Backend not responding at ${fullUrl}. Is your backend service running?`);
    }
    console.error('❌ API Error Details:', {
      message: error?.message,
      name: error?.name,
      url: fullUrl,
      platform: Platform.OS,
      deviceIP: DEVICE_IP,
    });
    throw error;
  }
};

const getUploadApiBase = () => {
  if (Platform.OS === 'web') {
    return process.env.REACT_APP_UPLOAD_API_BASE || 'http://localhost:3002/api/v1';
  }
  if (Platform.OS === 'android' || Platform.OS === 'ios') {
    return `http://${DEVICE_IP}:3002/api/v1`;
  }
  return 'http://localhost:3002/api/v1';
};

const getAnalyticsApiBase = () => {
  if (Platform.OS === 'web') {
    return process.env.REACT_APP_ANALYTICS_API_BASE || 'http://localhost:3004/api/v1';
  }
  if (Platform.OS === 'android' || Platform.OS === 'ios') {
    return `http://${DEVICE_IP}:3004/api/v1`;
  }
  return 'http://localhost:3004/api/v1';
};

const getNotificationApiBase = () => {
  if (Platform.OS === 'web') {
    return process.env.REACT_APP_NOTIFICATION_API_BASE || 'http://localhost:3005/api/v1';
  }
  if (Platform.OS === 'android' || Platform.OS === 'ios') {
    return `http://${DEVICE_IP}:3005/api/v1`;
  }
  return 'http://localhost:3005/api/v1';
};

// Use different base URLs for each microservice
const UPLOAD_API_BASE = getUploadApiBase();
export const ANALYTICS_API_BASE = getAnalyticsApiBase();
export const NOTIFICATION_API_BASE = getNotificationApiBase();

// Log API configuration for debugging
console.log('🌐 API Configuration:', {
  platform: Platform.OS,
  deviceIP: DEVICE_IP,
  authAPI: API_BASE,
  uploadAPI: UPLOAD_API_BASE,
  analyticsAPI: ANALYTICS_API_BASE,
  notificationAPI: NOTIFICATION_API_BASE,
});

export const uploadDocumentApi = async (file: any, token?: string) => {
  // Derive common file metadata across platforms
  const isWeb = Platform.OS === 'web';

  const fileName: string | undefined = isWeb
    ? file?.name
    : file?.name || file?.uri?.split('/')?.pop();

  const fileSize: number | undefined = isWeb ? file?.size : file?.size;

  const contentType: string = isWeb
    ? file?.type || 'application/pdf'
    : file?.mimeType || 'application/pdf';

  if (!fileName || typeof fileSize !== 'number') {
    throw new Error('Invalid file metadata: missing name or size');
  }

  if (!contentType || contentType !== 'application/pdf') {
    throw new Error('Only PDF documents are supported');
  }

  // Optional: enforce a hard size limit (10MB)
  const MAX_SIZE_BYTES = 10 * 1024 * 1024;
  if (fileSize > MAX_SIZE_BYTES) {
    throw new Error('File size exceeds 10MB limit');
  }

  try {
    // 1) Ask backend for a presigned URL
    const presignResponse: any = await getPresignedUrlApi(
      {
        fileName,
        contentType,
        fileSize,
      },
      token
    );
  const uploadUrl: string =
      presignResponse?.data?.uploadUrl || presignResponse?.url || presignResponse?.presignedUrl;
    const documentId: string | undefined = presignResponse?.data?.documentId;

    if (!uploadUrl || !documentId) {
      throw new Error('Invalid presigned URL response from server');
    }

    // 2) Upload the raw file bytes directly to S3 using the presigned URL
    if (isWeb) {
      const putRes = await fetch(uploadUrl, {
        method: 'PUT',
        headers: {
          'Content-Type': contentType,
        },
        body: file,
      });

      if (!putRes.ok) {
        const errorText = await putRes.text();
        throw new Error(`S3 upload failed: ${putRes.status} ${putRes.statusText} - ${errorText}`);
      }
    } else {
      // React Native: fetch the local file and convert to Blob for upload
      const fileResponse = await fetch(file.uri);
      const blob = await fileResponse.blob();

      const putRes = await fetch(uploadUrl, {
        method: 'PUT',
        headers: {
          'Content-Type': contentType,
        },
        body: blob,
      });

      if (!putRes.ok) {
        const errorText = await putRes.text();
        throw new Error(`S3 upload failed: ${putRes.status} ${putRes.statusText} - ${errorText}`);
      }
    }

    // 3) Notify backend that the upload is complete so it can start processing
    const confirmResponse = await confirmUploadApi(documentId, token);
    return confirmResponse;
  } catch (error: any) {
    console.error('Upload API Error:', {
      message: error?.message,
      platform: Platform.OS,
      fileName: file?.name || file?.uri,
    });
    throw error;
  }
};

// Helper function to get with auth token
const getWithAuth = async (url: string, token?: string) => {
  console.log('🚀 Making GET request:', { url, hasToken: !!token });
  
  const headers: Record<string, string> = {};
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      console.error('⏰ GET request timeout after 30 seconds:', url);
      controller.abort();
    }, 30000);

    const res = await fetch(url, {
      method: 'GET',
      headers,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);
    console.log('✅ GET response received:', { status: res.status, url });

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`API Error: ${res.status} ${res.statusText} - ${errorText}`);
    }
    return res.json();
  } catch (error: any) {
    if (error?.name === 'AbortError') {
      console.error('❌ GET request aborted:', url);
      throw new Error(`Backend not responding at ${url}. Is your backend service running?`);
    }
    throw error;
  }
};

// Helper function to post with auth token
const postWithAuth = async (url: string, body: any, token?: string) => {
  console.log('🚀 Making POST request:', { url, hasToken: !!token });
  
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      console.error('⏰ POST request timeout after 30 seconds:', url);
      controller.abort();
    }, 30000);

    const res = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);
    console.log('✅ POST response received:', { status: res.status, url });

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`API Error: ${res.status} ${res.statusText} - ${errorText}`);
    }
    return res.json();
  } catch (error: any) {
    if (error?.name === 'AbortError') {
      console.error('❌ POST request aborted:', url);
      throw new Error(`Backend not responding at ${url}. Is your backend service running?`);
    }
    throw error;
  }
};

// Upload Service APIs
export const getPresignedUrlApi = async (
  payload: { fileName: string; contentType: string; fileSize: number },
  token?: string
) => {
  return postWithAuth(`${UPLOAD_API_BASE}/upload/presigned-url`, payload, token);
};

export const confirmUploadApi = async (documentId: string, token?: string) => {
  return postWithAuth(`${UPLOAD_API_BASE}/upload/confirm`, { documentId }, token);
};

export const pollDocumentStatusApi = async (documentId: string, token?: string) => {
  return getWithAuth(`${UPLOAD_API_BASE}/upload/documents/${documentId}/status`, token);
};

export const listDocumentsApi = async (token?: string) => {
  return getWithAuth(`${UPLOAD_API_BASE}/upload/documents`, token);
};

// Analytics Service APIs
export const getDashboardApi = async (token?: string) => {
  return getWithAuth(`${ANALYTICS_API_BASE}/analytics/dashboard`, token);
};

export const getCategoriesApi = async (token?: string) => {
  return getWithAuth(`${ANALYTICS_API_BASE}/analytics/categories`, token);
};

export const getTransactionsApi = async (category?: string, token?: string) => {
  const url = category 
    ? `${ANALYTICS_API_BASE}/analytics/transactions?category=${category}`
    : `${ANALYTICS_API_BASE}/analytics/transactions`;
  return getWithAuth(url, token);
};

export const sendChatMessageApi = async (message: string, token?: string) => {
  return postWithAuth(`${ANALYTICS_API_BASE}/chat`, { message }, token);
};

// Notification Service APIs
export const getDocumentStatusStreamUrl = (documentId: string) => {
  return `${NOTIFICATION_API_BASE}/notifications/documents/${documentId}/status-stream`;
};
