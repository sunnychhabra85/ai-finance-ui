import { uploadDocumentApi } from "@/services/api";
import { Ionicons } from "@expo/vector-icons";
import * as DocumentPicker from "expo-document-picker";
import React from "react";
import { Platform, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { UploadItem } from "../../components/UploadItem";
import { useUploadStore } from "../../store/uploadStore";
import { colors } from "../../theme/colors";

export default function Upload() {
  const { uploads, addUpload, markDone } = useUploadStore();

  const pickFile = async () => {
    if (Platform.OS === 'web') {
      alert('Document upload is not supported on web.');
      return;
    }
    const res = await DocumentPicker.getDocumentAsync({
      type: "application/pdf",
    });

    if (res.canceled) return;

    const file = res.assets[0];

    const id = Date.now().toString();

    addUpload({
      id,
      name: file.name,
      size: `${(file.size! / 1024 / 1024).toFixed(1)} MB`,
      date: new Date().toLocaleDateString(),
      status: "processing",
    });

    // Fake processing like video
    // setTimeout(() => {
    //   markDone(id);
    // }, 2500);

    //when api comes
    // await api.upload(file);
    await uploadDocumentApi(file);
    markDone(id);
  };

  return (
    <View style={styles.container}>
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

      <Text style={styles.recent}>RECENT UPLOADS</Text>

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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 24,
  },
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
