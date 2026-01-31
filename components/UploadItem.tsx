import { Ionicons } from "@expo/vector-icons";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { colors } from "../theme/colors";
import { Card } from "./Card";

interface Props {
  file: string;
  size: string;
  date: string;
  color: string;
  status: "processing" | "done";
}

export const UploadItem = ({
  file,
  size,
  date,
  color,
  status,
}: Props) => {
  return (
    <Card style={styles.card}>
      <View style={[styles.iconBox, { backgroundColor: color }]}>
        <Ionicons name="document-text-outline" size={22} color="#fff" />
      </View>

      <View style={{ flex: 1 }}>
        <Text style={styles.file}>{file}</Text>
        <Text style={styles.meta}>
          {size} • Uploaded {date}
        </Text>
      </View>

      {status === "processing" ? (
        <View style={styles.processing}>
          <ActivityIndicator size="small" color="#F59E0B" />
          <Text style={styles.processingText}>Processing...</Text>
        </View>
      ) : (
        <View style={styles.done}>
          <Text style={styles.doneText}>Done</Text>
        </View>
      )}
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    padding: 14,
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  file: {
    fontWeight: "600",
    fontSize: 15,
  },
  meta: {
    color: colors.textLight,
    marginTop: 4,
    fontSize: 13,
  },
  done: {
    backgroundColor: "#DCFCE7",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  doneText: {
    color: "#16A34A",
    fontWeight: "600",
    fontSize: 12,
  },
  processing: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  processingText: {
    color: "#F59E0B",
    fontWeight: "600",
    fontSize: 12,
  },
});
