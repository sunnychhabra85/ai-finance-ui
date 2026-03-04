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

  const handleChipPress = (prompt: string) => {
    setInputText(prompt);
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
  send: {
    color: "#2563EB",
    fontSize: 18,
    marginLeft: 10,
  },
  sendDisabled: {
    opacity: 0.3,
  },
});
