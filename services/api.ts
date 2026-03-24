import { Platform } from 'react-native';

// IMPORTANT: To run on a physical device, you need to use your computer's local IP address
// instead of localhost or 10.0.2.2. Find your IP address:
// - Windows: Run 'ipconfig' and look for IPv4 Address (e.g., 192.168.1.100)
// - Mac/Linux: Run 'ifconfig' or 'ip addr' (e.g., 192.168.1.100)
// Then set these environment variables or update the fallback IPs below

// For physical devices, replace these with your computer's local network IP
const DEVICE_IP = process.env.EXPO_PUBLIC_API_HOST || '10.0.2.2'; // Change to your IP (e.g., '192.168.1.100')

// Single API Gateway base URL
const getApiBase = () => {
  const platformOS = Platform.OS;
  
  if (platformOS === 'web') {
    return process.env.REACT_APP_API_BASE || 'http://localhost:3000/api/v1';
    //return process.env.REACT_APP_API_BASE || 'http://3.89.88.81/api/v1';
  }
  // For Android/iOS, use DEVICE_IP which works for both emulator (10.0.2.2) and physical devices
  if (platformOS === 'android' || platformOS === 'ios') {
    return `http://${DEVICE_IP}:3000/api/v1`;
  }
  // return 'http://localhost/api/v1';
  //return 'http://3.89.88.81/api/v1';
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

// All services now use the same API Gateway base URL
// The gateway will route requests to appropriate microservices based on the path
export const UPLOAD_API_BASE = API_BASE;
export const ANALYTICS_API_BASE = API_BASE;
export const NOTIFICATION_API_BASE = API_BASE;

// Log API configuration for debugging
console.log('🌐 API Configuration:', {
  platform: Platform.OS,
  deviceIP: DEVICE_IP,
  apiGateway: API_BASE,
});

export const uploadDocumentApi = async (file: any, token?: string) => {
  // Derive common file metadata across platforms
  const isWeb = Platform.OS === 'web';

  const fileName: string | undefined = isWeb
    ? file?.name
    : file?.name || file?.uri?.split('/')?.pop();

  let nativeBlob: Blob | null = null;
  const rawSize: number | undefined = isWeb ? file?.size : file?.size;
  let fileSize: number | undefined =
    typeof rawSize === 'number' && Number.isFinite(rawSize) ? rawSize : undefined;

  // Android document picker may return missing size; derive it from the picked URI.
  if (!isWeb && (!fileSize || fileSize <= 0) && file?.uri) {
    try {
      const fileResponse = await fetch(file.uri);
      nativeBlob = await fileResponse.blob();
      fileSize = nativeBlob.size;
    } catch (sizeError) {
      console.warn('⚠️ Could not resolve native file size from URI:', {
        uri: file?.uri,
        error: String(sizeError),
      });
    }
  }

  const rawContentType: string = isWeb
    ? file?.type || ''
    : file?.mimeType || file?.type || '';

  // Accept PDF mime variants coming from Android content providers.
  const looksLikePdf =
    /pdf/i.test(rawContentType || '') ||
    /\.pdf$/i.test(fileName || '');

  const contentType: string = looksLikePdf
    ? 'application/pdf'
    : rawContentType || 'application/octet-stream';

  if (!fileName || typeof fileSize !== 'number' || fileSize <= 0) {
    throw new Error('Invalid file metadata: missing name or size');
  }

  if (!looksLikePdf) {
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
      // React Native: use the already-read blob when size probing happened, else read now.
      const blob = nativeBlob || (await (await fetch(file.uri)).blob());

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
  console.log('🚀 Making GET request:', {
    url,
    hasToken: !!token,
    tokenPrefix: token ? token.substring(0, 20) + '...' : 'none',
  });

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
      console.error('❌ Server Error Response:', {
        status: res.status,
        statusText: res.statusText,
        serverResponse: errorText,
      });
      throw new Error(`API Error: ${res.status} ${res.statusText} - ${errorText}`);
    }
    return res.json();
  } catch (error: any) {
    if (error?.name === 'AbortError') {
      console.error('❌ GET request aborted:', url);
      throw new Error(`Backend not responding at ${url}. Is your backend service running?`);
    }
    console.error('❌ GET Error:', { message: error.message, url });
    throw error;
  }
};

// Helper function to post with auth token
const postWithAuth = async (url: string, body: any, token?: string) => {
  console.log('🚀 Making POST request:', {
    url,
    hasToken: !!token,
    tokenPrefix: token ? token.substring(0, 20) + '...' : 'none',
    bodyKeys: body ? Object.keys(body) : [],
  });

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
      console.error('❌ Server Error Response:', {
        status: res.status,
        statusText: res.statusText,
        serverResponse: errorText,
      });
      throw new Error(`API Error: ${res.status} ${res.statusText} - ${errorText}`);
    }
    return res.json();
  } catch (error: any) {
    if (error?.name === 'AbortError') {
      console.error('❌ POST request aborted:', url);
      throw new Error(`Backend not responding at ${url}. Is your backend service running?`);
    }
    console.error('❌ POST Error:', { message: error.message, url });
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
