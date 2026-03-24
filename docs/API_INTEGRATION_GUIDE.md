# API Integration Guide

This guide shows how to replace dummy/mock data with real API calls using the presigned URL upload flow and other microservices.

## 🎯 Overview

Your project has these API methods ready:

### Upload Service APIs
- `getPresignedUrlApi()` - Get presigned URL for S3 upload
- `confirmUploadApi()` - Confirm upload completion
- `listDocumentsApi()` - List all uploaded documents
- `pollDocumentStatusApi()` - Check document processing status

### Analytics Service APIs  
- `getDashboardApi()` - Get dashboard summary (debit, credit, categories)
- `getCategoriesApi()` - Get spending categories
- `getTransactionsApi()` - Get transactions (optionally filtered by category)

### Chat Service API
- `sendChatMessageApi()` - Send message to AI assistant

---

## 📝 Implementation Examples

### 1. Overview Screen - Replace Dummy Dashboard Data

**Current:** Hardcoded values in `SummaryCards.tsx` and `InsightsBlock.tsx`  
**Solution:** Fetch from `getDashboardApi()` and display real data

#### Step 1: Create a Dashboard Hook

Create `hooks/useDashboard.ts`:

```typescript
import { useEffect, useState } from 'react';
import { getDashboardApi, getCategoriesApi } from '../services/api';
import { useAuthStore } from '../store/authStore';

export interface DashboardData {
  totalDebit: number;
  totalCredit: number;
  highestSpendingMonth?: {
    month: string;
    amount: number;
  };
  topCategory?: {
    name: string;
    percentage: number;
  };
  categories?: Array<{
    name: string;
    amount: number;
    percentage: number;
  }>;
}

export const useDashboard = () => {
  const token = useAuthStore((s) => s.token);
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await getDashboardApi(token || undefined);
      
      // Adapt the response to your UI needs
      setData({
        totalDebit: response.data?.totalDebit || response.totalDebit || 0,
        totalCredit: response.data?.totalCredit || response.totalCredit || 0,
        highestSpendingMonth: response.data?.highestSpendingMonth || response.highestSpendingMonth,
        topCategory: response.data?.topCategory || response.topCategory,
        categories: response.data?.categories || response.categories || [],
      });
    } catch (err: any) {
      console.error('Dashboard fetch error:', err);
      setError(err.message || 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchDashboard();
    }
  }, [token]);

  return { data, loading, error, refetch: fetchDashboard };
};
```

#### Step 2: Update SummaryCards Component

Update `components/SummaryCards.tsx`:

```typescript
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { useDashboard } from "../hooks/useDashboard";
import { colors } from "../theme/colors";

export const SummaryCards = () => {
  const { data, loading, error } = useDashboard();

  if (loading) {
    return (
      <View style={styles.row}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.row}>
        <Text style={{ color: 'red' }}>Error: {error}</Text>
      </View>
    );
  }

  const debit = data?.totalDebit || 0;
  const credit = data?.totalCredit || 0;

  return (
    <View style={styles.row}>
      <View style={[styles.card, { backgroundColor: colors.primary }]}>
        <Text style={styles.label}>Total Debit</Text>
        <Text style={styles.amountWhite}>${debit.toLocaleString()} ↘</Text>
      </View>

      <View style={styles.cardWhite}>
        <Text style={styles.labelDark}>Total Credit</Text>
        <Text style={styles.amountGreen}>${credit.toLocaleString()} ↗</Text>
      </View>
    </View>
  );
};

// ... styles remain the same
```

#### Step 3: Update InsightsBlock Component

Update `components/InsightsBlock.tsx`:

```typescript
import React from "react";
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from "react-native";
import { useDashboard } from "../hooks/useDashboard";
import { Card } from "./Card";
import { Donut } from "./Donut";
import { InsightMiniCard } from "./InsightMiniCard";
import { MonthlyTrend } from "./MonthlyTrend";

export const InsightsBlock = () => {
  const { data, loading } = useDashboard();

  if (loading) {
    return <ActivityIndicator size="large" color="#2563EB" />;
  }

  return (
    <>
      {/* Horizontal insight cards */}
      <View style={styles.horizontalScrollContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {data?.highestSpendingMonth && (
            <View style={styles.insightCard}>
              <InsightMiniCard
                title="Highest Spending Month"
                value={data.highestSpendingMonth.month}
                sub={`$${data.highestSpendingMonth.amount.toLocaleString()} spent`}
                borderColor="#FB923C"
              />
            </View>
          )}
          
          {data?.topCategory && (
            <View style={styles.insightCard}>
              <InsightMiniCard
                title="Top Category"
                value={data.topCategory.name}
                sub={`${data.topCategory.percentage}% of total spend`}
                borderColor="#3B82F6"
              />
            </View>
          )}
        </ScrollView>
      </View>

      {/* Donut chart with real category data */}
      <Card>
        <Text style={styles.heading}>Spending by Category</Text>
        <Donut categories={data?.categories} />
        <View style={styles.labels}>
          {data?.categories?.map((cat) => (
            <Text key={cat.name} style={styles.label}>
              {cat.name}
            </Text>
          ))}
        </View>
      </Card>

      <MonthlyTrend />
    </>
  );
};

// ... styles remain the same
```

---

### 2. Transactions List - Replace Dummy Transaction Data

#### Step 1: Create Transactions Hook

Create `hooks/useApiTransactions.ts`:

```typescript
import { useEffect, useState } from 'react';
import { getTransactionsApi } from '../services/api';
import { useAuthStore } from '../store/authStore';

export interface ApiTransaction {
  id: string;
  title: string;
  date: string;
  amount: number;
  category: string;
  description?: string;
}

export const useApiTransactions = (category?: string) => {
  const token = useAuthStore((s) => s.token);
  const [transactions, setTransactions] = useState<ApiTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await getTransactionsApi(
        category !== 'All' ? category : undefined,
        token || undefined
      );
      
      // Extract transactions from response
      const txns = response.data?.transactions || response.transactions || [];
      setTransactions(txns);
    } catch (err: any) {
      console.error('Transactions fetch error:', err);
      setError(err.message || 'Failed to load transactions');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchTransactions();
    }
  }, [token, category]);

  return { transactions, loading, error, refetch: fetchTransactions };
};
```

#### Step 2: Update Overview Screen

Update `app/(tabs)/overview.tsx`:

```typescript
import React, { useState } from "react";
import {
    ActivityIndicator,
    StyleSheet,
    View,
    useWindowDimensions
} from "react-native";

import { Chips } from "../../components/Chips";
import { InsightsBlock } from "../../components/InsightsBlock";
import { ResponsiveContainer } from "../../components/ResponsiveContainer";
import { ScreenHeader } from "../../components/ScreenHeader";
import { SearchBar } from "../../components/SearchBar";
import { Segment } from "../../components/Segment";
import { SummaryCards } from "../../components/SummaryCards";
import { TransactionItem } from "../../components/TransactionItem";
import type { Category } from "../../data/transactions";
import { useApiTransactions } from "../../hooks/useApiTransactions";
import { useAuthStore } from "../../store/authStore";
import { colors } from "../../theme/colors";
import { getAdaptivePadding } from "../../utils/responsive";

export default function Overview() {
    const [tab, setTab] = useState("Transactions");
    const logout = useAuthStore((s) => s.logout);
    const [search, setSearch] = useState("");
    const { width } = useWindowDimensions();
    const [category, setCategory] = useState<Category | "All">("All");
    const padding = getAdaptivePadding(width);

    // Fetch real transactions from API
    const { transactions, loading, error } = useApiTransactions(
      category !== 'All' ? category : undefined
    );

    // Filter by search term on the client side
    const filtered = transactions.filter((t) =>
      t.title.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <ResponsiveContainer style={{ backgroundColor: colors.background, paddingHorizontal: padding }}>
            {/* Header with logout */}
            <View style={styles.headerRow}>
                <View>
                    <ScreenHeader
                        title="Financial Overview"
                        subtitle="Your transactions & insights"
                    />
                </View>
            </View>

            <SummaryCards />
            <Segment tab={tab} setTab={setTab} />

            {tab === "Transactions" ? (
                <>
                    <SearchBar value={search} onChange={setSearch} />
                    <Chips selected={category} onSelect={setCategory} />
                    
                    {loading && <ActivityIndicator size="large" color="#2563EB" />}
                    
                    {error && <Text style={{ color: 'red' }}>Error: {error}</Text>}
                    
                    {!loading && !error && filtered.map((item) => (
                        <TransactionItem
                            key={item.id}
                            title={item.title}
                            date={item.date}
                            amount={
                                item.amount > 0
                                    ? `+$${item.amount.toFixed(2)}`
                                    : `-$${Math.abs(item.amount).toFixed(2)}`
                            }
                        />
                    ))}
                </>
            ) : (
                <InsightsBlock />
            )}
        </ResponsiveContainer>
    );
}

const styles = StyleSheet.create({
    headerRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
});
```

---

### 3. Chat Screen - Real AI Responses

#### Step 1: Update Chat Screen with Real API

Update `app/(tabs)/chat.tsx`:

```typescript
import React, { useState } from "react";
import { 
  ActivityIndicator, 
  Alert, 
  ScrollView, 
  StyleSheet, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  View, 
  useWindowDimensions 
} from "react-native";
import { ChatBubble } from "../../components/ChatBubble";
import { ChatChips } from "../../components/ChatChips";
import { ResponsiveContainer } from "../../components/ResponsiveContainer";
import { sendChatMessageApi } from "../../services/api";
import { useAuthStore } from "../../store/authStore";
import { getAdaptivePadding } from "../../utils/responsive";

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

export default function Chat() {
  const { width } = useWindowDimensions();
  const padding = getAdaptivePadding(width);
  const token = useAuthStore((s) => s.token);
  
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hi! I'm your personal spending assistant. Ask me anything about your finances!",
      isUser: false,
      timestamp: new Date(),
    }
  ]);
  const [inputText, setInputText] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!inputText.trim()) return;
    
    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText.trim(),
      isUser: true,
      timestamp: new Date(),
    };
    
    setMessages((prev) => [...prev, userMessage]);
    setInputText("");
    setLoading(true);

    try {
      const response = await sendChatMessageApi(userMessage.text, token || undefined);
      
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: response.data?.message || response.message || "I'm processing your request...",
        isUser: false,
        timestamp: new Date(),
      };
      
      setMessages((prev) => [...prev, botResponse]);
    } catch (error: any) {
      console.error('Chat error:', error);
      Alert.alert('Error', 'Failed to send message. Please try again.');
      
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "Sorry, I'm having trouble responding right now. Please try again.",
        isUser: false,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleChipPress = async (prompt: string) => {
    setInputText(prompt);
    // Optionally auto-send
    // await handleSend();
  };

  return (
    <ResponsiveContainer contentContainerStyle={{ paddingHorizontal: padding, justifyContent: 'space-between' }}>
      {/* TOP CONTENT */}
      <View>
        <View style={styles.headerRow}>
          <View style={styles.botIcon}>
            <Text style={{ color: "#fff", fontWeight: "700" }}>🤖</Text>
          </View>
          <View>
            <Text style={styles.title}>AI Assistant</Text>
            <Text style={styles.online}>● Online</Text>
          </View>
        </View>

        <ScrollView style={styles.messagesContainer}>
          {messages.map((msg) => (
            <ChatBubble
              key={msg.id}
              text={msg.text}
              isUser={msg.isUser}
            />
          ))}
          {loading && (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="small" color="#2563EB" />
              <Text style={styles.loadingText}>AI is thinking...</Text>
            </View>
          )}
        </ScrollView>
      </View>

      {/* BOTTOM AREA */}
      <View style={styles.bottomArea}>
        <ChatChips onChipPress={handleChipPress} />

        <View style={styles.inputBar}>
          <TextInput
            placeholder="Ask about your spending..."
            style={{ flex: 1 }}
            value={inputText}
            onChangeText={setInputText}
            onSubmitEditing={handleSend}
            editable={!loading}
          />
          <TouchableOpacity onPress={handleSend} disabled={loading || !inputText.trim()}>
            <Text style={[styles.send, (!inputText.trim() || loading) && styles.sendDisabled]}>
              ➤
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ResponsiveContainer>
  );
}

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  botIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#2563EB",
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
  },
  online: {
    color: "#22C55E",
    fontSize: 12,
    marginTop: 2,
  },
  messagesContainer: {
    marginVertical: 16,
    maxHeight: 400,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 12,
  },
  loadingText: {
    color: '#64748B',
    fontSize: 13,
  },
  bottomArea: {
    marginBottom: 10,
  },
  inputBar: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 30,
    paddingHorizontal: 16,
    height: 52,
    marginTop: 12,
  },
  send: {
    color: "#2563EB",
    fontSize: 18,
    marginLeft: 10,
  },
  sendDisabled: {
    opacity: 0.3,
  },
});
```

---

### 4. Upload Screen - Show Document History

#### Step 1: Create Documents Hook

Create `hooks/useDocuments.ts`:

```typescript
import { useEffect, useState } from 'react';
import { listDocumentsApi } from '../services/api';
import { useAuthStore } from '../store/authStore';

export interface Document {
  id: string;
  fileName: string;
  fileSize: number;
  status: 'PENDING_UPLOAD' | 'PROCESSING' | 'COMPLETED' | 'FAILED';
  uploadedAt: string;
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
      const docs = response.data?.documents || response.documents || [];
      
      setDocuments(docs);
    } catch (err: any) {
      console.error('Documents fetch error:', err);
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
```

#### Step 2: Update Upload Screen

Update `app/(tabs)/upload.tsx` to show real document history:

```typescript
import { uploadDocumentApi } from "@/services/api";
import { Ionicons } from "@expo/vector-icons";
import * as DocumentPicker from "expo-document-picker";
import React, { useRef } from "react";
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

export default function Upload() {
  const { uploads, addUpload, markDone } = useUploadStore();
  const token = useAuthStore((s) => s.token);
  const { width } = useWindowDimensions();
  const padding = getAdaptivePadding(width);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fetch real document history
  const { documents, loading, refetch } = useDocuments();

  const MAX_SIZE_BYTES = 10 * 1024 * 1024; // 10MB

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
      
      // Refresh document list after successful upload
      refetch();
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
    });

    if (res.canceled) return;

    const file = res.assets[0];

    if (file.size && file.size > MAX_SIZE_BYTES) {
      alert('File size must be 10MB or less');
      return;
    }

    const id = Date.now().toString();

    addUpload({
      id,
      name: file.name,
      size: `${(file.size! / 1024 / 1024).toFixed(1)} MB`,
      date: new Date().toLocaleDateString(),
      status: "processing",
    });

    try {
      await uploadDocumentApi(file, token || undefined);
      markDone(id);
      
      // Refresh document list after successful upload
      refetch();
    } catch (error) {
      console.error('Upload error:', error);
      alert('Upload failed. Please try again.');
    }
  };

  const formatStatus = (status: string) => {
    return status === 'COMPLETED' ? 'done' : 'processing';
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

      {/* Show currently uploading items from store */}
      {uploads.map((u) => (
        <UploadItem
          key={u.id}
          file={u.name}
          size={u.size}
          date={u.date}
          status={u.status}
          color="#DBEAFE"
        />
      ))}

      {loading && <ActivityIndicator size="large" color="#2563EB" />}

      {/* Show document history from backend */}
      {documents.map((doc) => (
        <UploadItem
          key={doc.id}
          file={doc.fileName}
          size={`${(doc.fileSize / 1024 / 1024).toFixed(1)} MB`}
          date={new Date(doc.uploadedAt).toLocaleDateString()}
          status={formatStatus(doc.status) as 'processing' | 'done'}
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
```

---

### 5. (Optional) Document Status Polling

If you want to show live status updates while a document is processing:

Create `hooks/useDocumentStatus.ts`:

```typescript
import { useEffect, useState } from 'react';
import { pollDocumentStatusApi } from '../services/api';
import { useAuthStore } from '../store/authStore';

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
    const intervalId = setInterval(poll, intervalMs);

    return () => clearInterval(intervalId);
  }, [documentId, token, intervalMs]);

  return { status, isPolling };
};
```

Usage in upload screen after upload completes:

```typescript
const { status } = useDocumentStatus(documentId);

// Show status badge
<Text>Status: {status}</Text>
```

---

## 🚀 Quick Start Checklist

1. ✅ **Upload Flow** - Already implemented with presigned URLs
2. ⬜ **Create Dashboard Hook** - Copy `useDashboard.ts` 
3. ⬜ **Create Transactions Hook** - Copy `useApiTransactions.ts`
4. ⬜ **Create Documents Hook** - Copy `useDocuments.ts`
5. ⬜ **Update SummaryCards** - Use `useDashboard()`
6. ⬜ **Update InsightsBlock** - Use `useDashboard()`
7. ⬜ **Update Overview Screen** - Use `useApiTransactions()`
8. ⬜ **Update Chat Screen** - Use `sendChatMessageApi()`
9. ⬜ **Update Upload Screen** - Use `useDocuments()`

---

## 🔧 Backend Response Format

Ensure your backend returns data in these formats:

### Dashboard API Response
```json
{
  "data": {
    "totalDebit": 3240,
    "totalCredit": 5350,
    "highestSpendingMonth": {
      "month": "June",
      "amount": 3500
    },
    "topCategory": {
      "name": "Food",
      "percentage": 25
    },
    "categories": [
      { "name": "Food", "amount": 1200, "percentage": 25 },
      { "name": "Travel", "amount": 800, "percentage": 17 }
    ]
  }
}
```

### Transactions API Response
```json
{
  "data": {
    "transactions": [
      {
        "id": "txn_123",
        "title": "Starbucks Coffee",
        "date": "2024-05-24",
        "amount": -6.75,
        "category": "Food"
      }
    ]
  }
}
```

### Documents API Response
```json
{
  "data": {
    "documents": [
      {
        "id": "doc_123",
        "fileName": "statement.pdf",
        "fileSize": 102400,
        "status": "COMPLETED",
        "uploadedAt": "2024-05-24T10:30:00Z"
      }
    ]
  }
}
```

### Chat API Response
```json
{
  "data": {
    "message": "Your top spending category this month is Food at $1,240"
  }
}
```

---

## 📊 Testing

1. Start your backend services (auth, upload, analytics, chat)
2. Update environment variables if needed
3. Test each screen:
   - **Overview**: Should load dashboard and transactions from API
   - **Chat**: Should send/receive messages  
   - **Upload**: Should upload via presigned URL and show history

---

## ⚠️ Error Handling

All hooks include:
- `loading` state - Show loading indicators
- `error` state - Display error messages
- `refetch()` function - Manual refresh
- Try-catch blocks - Graceful degradation

---

## 🎉 Result

After implementing these changes:
- ✅ No more hardcoded dummy data
- ✅ Real-time data from your backend
- ✅ Secure presigned URL uploads
- ✅ Working AI chat assistant
- ✅ Document processing status tracking
- ✅ Pull-to-refresh on all screens
