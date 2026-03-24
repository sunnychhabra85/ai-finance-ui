import React, { useState } from "react";
import {
  ActivityIndicator,
  Platform,
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
import { sendChatMessageApi } from "../../services/api";
import { useAuthStore } from "../../store/authStore";
import { colors } from "../../theme/colors";
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
      console.log('🤖 Chat API full response:', JSON.stringify(response, null, 2));

      // Try every common field name chat APIs return
      const botText =
        response?.data?.message ||
        response?.data?.reply ||
        response?.data?.response ||
        response?.data?.content ||
        response?.data?.text ||
        response?.data?.answer ||
        response?.message ||
        response?.reply ||
        response?.response ||
        response?.content ||
        response?.text ||
        response?.answer ||
        (typeof response === 'string' ? response : null) ||
        "Sorry, I couldn't get a response. Please try again.";

      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: String(botText),
        isUser: false,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botResponse]);
    } catch (error: any) {
      console.error('Chat error:', error);

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

  const isWeb = Platform.OS === 'web';

  return (
    <View style={[styles.screen, isWeb && styles.webScreen]}>
      {/* Fixed header */}
      <View style={[styles.header, { paddingHorizontal: padding }]}>
        <View style={styles.headerRow}>
          <View style={styles.botIcon}>
            <Text style={{ color: "#fff", fontWeight: "700" }}>🤖</Text>
          </View>
          <View>
            <Text style={styles.title}>AI Assistant</Text>
            <Text style={styles.online}>● Online</Text>
          </View>
        </View>
      </View>

      {/* Scrollable messages */}
      <ScrollView
        style={styles.messagesContainer}
        contentContainerStyle={[styles.messagesContent, { paddingHorizontal: padding }]}
        showsVerticalScrollIndicator={false}
      >
        {messages.map((msg) => (
          <ChatBubble key={msg.id} text={msg.text} isUser={msg.isUser} />
        ))}
        {loading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="small" color="#2563EB" />
            <Text style={styles.loadingText}>AI is thinking...</Text>
          </View>
        )}
      </ScrollView>

      {/* Fixed bottom input bar */}
      <View style={[styles.bottomArea, { paddingHorizontal: padding }]}>
        <ChatChips onChipPress={handleChipPress} />
        <View style={styles.inputBar}>
          <TextInput
            placeholder="Ask about your spending..."
            style={styles.textInput}
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
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  webScreen: {
    width: 414,
    alignSelf: 'center' as any,
  },
  header: {
    paddingTop: 16,
    paddingBottom: 8,
    backgroundColor: colors.background,
  },
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
    backgroundColor: colors.background,
    paddingBottom: 10,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
  },
  textInput: {
    flex: 1,
    outlineStyle: 'none',
  } as any,

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
    flex: 1,
  },
  messagesContent: {
    paddingVertical: 12,
    paddingBottom: 8,
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
