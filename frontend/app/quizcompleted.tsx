import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useState, useEffect } from 'react'
import AsyncStorage from "@react-native-async-storage/async-storage";

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
    id: 2,
    name: "Musical Wonders",
    description: "Play music. Create music. Sing music.",
    image: "https://cdn-icons-png.flaticon.com/128/3083/3083417.png"
  },
  {
    id: 3,
    name: "Cooking Ninjas",
    description: "Fun chats, cookout nights, and cozy cafe hangs with food enthusiasts.",
    image: "https://cdn-icons-png.flaticon.com/128/1027/1027128.png"
  },
  {
    id: 5,
    name: "Town Travellers",
    description: "Explore neighborhoods, try new spots, and discover hidden city gems.",
    image: "https://cdn-icons-png.flaticon.com/128/854/854894.png"
  },
];

export default function QuizCompleted() {
  const router = useRouter();

  const goHome = () => router.replace("/(tabs)/home");
  const goBack = () => router.push("/personalityquiz?step=summary");

  const [joined, setJoin] = useState<{[key: number]:boolean}>({});
  const [hasLoaded, setHasLoaded] = useState(false);
  
  useEffect (() => {
    const savedGroups = async () => {
      const saved = await AsyncStorage.getItem('joinedGroups');
      if(saved){
        setJoin(JSON.parse(saved));
      }
      setHasLoaded(true);
    }; 
    savedGroups();
  }, []);

  useEffect (() => {
    if (!hasLoaded) return;
    
    const saveGroups = async () => {
      await AsyncStorage.setItem('joinedGroups', JSON.stringify(joined));
    }; 
    saveGroups();
  }, [joined, hasLoaded]);

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <TouchableOpacity
          onPress={goBack}
          style={styles.backButton}
        >
          <Ionicons name="chevron-back" size={24} color="#000" />
          <Text style={styles.backButtonText}>Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Quiz Completed!</Text>
        <Text style={styles.subtitle}>Here are some groups based on your preferences:</Text>

        {GROUPS.map((g) => (
          <View key={g.id} style={styles.card}>
            <Image source={{ uri: g.image}} style={styles.groupImage} />
            <View style={{ flex: 1 }}>
              <Text style={styles.groupTitle}>{g.name}</Text>
              <Text style={styles.groupDesc}>{g.description}</Text>
            </View>
            <TouchableOpacity style={[styles.joinButton, joined[g.id] ? styles.joinActive : styles.joinInactive]} onPress={() => {setJoin((prev) => ({...prev, [g.id]: true}))}}>
              <Text> Join </Text>
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
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    marginBottom: 20,
    marginTop: 20,
  },
  backButtonText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#000",
    marginLeft: 4,
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
  joinActive: {
        backgroundColor: "#b4ecb4"
    },
    joinInactive : {
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


