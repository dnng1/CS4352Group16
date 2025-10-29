import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from "react-native";
import { useRouter } from "expo-router";

const COLORS = {
  background: "#FFFFFF",
  card: "#CFE6FF",
  primary: "#7CA7D9",
  textPrimary: "#000000",
  textSecondary: "#444444",
  border: "#003366",
};

const GROUPS = [
  {
    id: 1,
    name: "Friend group 1",
    description: "Pick-up games, match watch-alongs, and weekend runs for all levels.",
  },
  {
    id: 2,
    name: "Friend group 2",
    description: "Book chats, movie nights, and cozy cafe hangs with story lovers.",
  },
  {
    id: 3,
    name: "Friend group 3",
    description: "Explore neighborhoods, try new spots, and discover hidden city gems.",
  },
];

export default function QuizCompleted() {
  const router = useRouter();

  const goHome = () => router.replace("/(tabs)/home");

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Quiz Completed!</Text>
        <Text style={styles.subtitle}>Here are some groups based on your preferences:</Text>

        {GROUPS.map((g) => (
          <View key={g.id} style={styles.card}>
            <Image source={require("../assets/images/group.jpg")} style={styles.groupImage} />
            <View style={{ flex: 1 }}>
              <Text style={styles.groupTitle}>{g.name}</Text>
              <Text style={styles.groupDesc}>{g.description}</Text>
            </View>
            <TouchableOpacity style={styles.joinButton} onPress={goHome}>
              <Text style={styles.joinText}>Join</Text>
            </TouchableOpacity>
          </View>
        ))}

        <View style={styles.bottomRow}>
          <TouchableOpacity style={styles.skipButton} onPress={goHome}>
            <Text style={styles.skipText}>Skip ▶</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.homeButton} onPress={goHome}>
            <Text style={styles.homeText}>Go to Home</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    padding: 20,
  },
  content: {
    alignItems: "center",
    justifyContent: "center",
    paddingBottom: 40,
  },
  title: {
    marginTop: 20,
    fontSize: 34,
    fontWeight: "800",
    textAlign: "center",
    color: COLORS.textPrimary,
  },
  subtitle: {
    fontSize: 18,
    color: COLORS.textSecondary,
    textAlign: "center",
    marginTop: 16,
    marginBottom: 28,
    paddingHorizontal: 12,
  },
  card: {
    backgroundColor: COLORS.card,
    borderRadius: 18,
    padding: 20,
    marginBottom: 22,
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    maxWidth: 560,
  },
  groupImage: {
    width: 84,
    height: 84,
    borderRadius: 42,
    marginRight: 16,
  },
  groupTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: COLORS.textPrimary,
  },
  groupDesc: {
    marginTop: 6,
    color: COLORS.textSecondary,
  },
  joinButton: {
    marginLeft: 16,
    borderWidth: 2,
    borderColor: COLORS.border,
    paddingVertical: 10,
    paddingHorizontal: 22,
    borderRadius: 14,
    backgroundColor: "#fff",
  },
  joinText: {
    color: COLORS.textPrimary,
    fontWeight: "600",
  },
  bottomRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 22,
    width: "100%",
    maxWidth: 560,
  },
  skipButton: {
    flex: 1,
    marginRight: 10,
    backgroundColor: "#E5E5E5",
    borderRadius: 14,
    alignItems: "center",
    paddingVertical: 18,
  },
  skipText: {
    fontSize: 17,
    fontWeight: "700",
    color: "#111",
  },
  homeButton: {
    flex: 1,
    marginLeft: 10,
    backgroundColor: COLORS.primary,
    borderRadius: 14,
    alignItems: "center",
    paddingVertical: 18,
  },
  homeText: {
    fontSize: 17,
    fontWeight: "700",
    color: COLORS.textPrimary,
  },
});


