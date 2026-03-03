import { Platform } from 'react-native';

// Use environment variable or fallback for web

const getApiBase = () => {
  const platformOS = Platform.OS;
  console.log('Platform:', platformOS);
  
  if (platformOS === 'web') {
    return process.env.REACT_APP_API_BASE || 'http://localhost:3001';
  }
  if (platformOS === 'android') {
    return 'http://10.0.2.2:3001';
  }
  return 'http://localhost:3001';
};

export const API_BASE = getApiBase();

export const apiPost = async (url: string, body: any) => {
  const fullUrl = `${API_BASE}${url}`;
  console.log('Making request to:', fullUrl);
  console.log('Request body:', body);
  
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

    const res = await fetch(fullUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`API Error: ${res.status} ${res.statusText} - ${errorText}`);
    }
    return res.json();
  } catch (error: any) {
    console.error('API Error Details:', {
      message: error?.message,
      name: error?.name,
      url: fullUrl,
      platform: Platform.OS,
    });
    throw error;
  }
};

const getUploadApiBase = () => {
  if (Platform.OS === 'web') {
    return process.env.REACT_APP_UPLOAD_API_BASE || 'http://localhost:3003';
  }
  if (Platform.OS === 'android') {
    return 'http://10.0.2.2:3003'; // Use 10.0.2.2 for Android emulator
  }
  return 'http://localhost:3003';
};
// Use a different base URL for document upload service
const UPLOAD_API_BASE = getUploadApiBase();

export const uploadDocumentApi = async (file: any) => {
  const formData = new FormData();
  
  // Handle both web File objects and React Native file objects
  if (Platform.OS === 'web') {
    // Web: file is a File object
    formData.append('file', file, file.name);
  } else {
    // Mobile: file has uri, name, size properties
    const uriParts = file.uri.split('/');
    const fileName = uriParts[uriParts.length - 1];
    
    if (Platform.OS === 'android') {
      // Android
      formData.append('file', {
        uri: file.uri,
        type: file.mimeType || 'application/pdf',
        name: fileName || file.name,
      } as any);
    } else {
      // iOS
      formData.append('file', {
        uri: file.uri.replace('file://', ''),
        type: file.mimeType || 'application/pdf',
        name: fileName || file.name,
      } as any);
    }
  }

  try {
    const res = await fetch(`${UPLOAD_API_BASE}/upload`, {
      method: 'POST',
      body: formData,
      // Don't set Content-Type header for FormData - browser/fetch will set it automatically
    });

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`Upload failed: ${res.status} ${res.statusText} - ${errorText}`);
    }
    return res.json();
  } catch (error: any) {
    console.error('Upload API Error:', {
      message: error?.message,
      platform: Platform.OS,
      fileName: file?.name || file?.uri,
    });
    throw error;
  }
};
