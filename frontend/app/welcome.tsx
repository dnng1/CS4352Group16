import React from "react";
import { View, Text, StyleSheet, ImageBackground, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";

const COLORS = {
  background: "#FFFFFF",
  primary: "#7CA7D9",
  border: "#003366",
  textPrimary: "#000000",
  white: "#FFFFFF",
};

export default function WelcomeScreen() {
  const router = useRouter();

  return (
    <ImageBackground
      source={require("../assets/images/globe.png")}
      resizeMode="cover"
      style={styles.bg}
      imageStyle={{ opacity: 0.15 }}
    >
      <View style={styles.overlay}>
        <View style={styles.headerArea}>
          <Text style={styles.title}>InterLink</Text>
          <Text style={styles.subtitle}>From New Lands to New Friends</Text>
        </View>

        <View style={styles.footerArea}>
          <TouchableOpacity style={styles.primaryButton} onPress={() => router.push("/signup")}> 
            <Text style={styles.primaryButtonText}>Create account</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.secondaryButton} onPress={() => router.push("/login")}> 
            <Text style={styles.secondaryButtonText}>Sign in</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  bg: { flex: 1, backgroundColor: COLORS.background },
  overlay: { flex: 1, paddingHorizontal: 24, paddingTop: 80, paddingBottom: 40, justifyContent: "space-between" },
  headerArea: { alignItems: "center" },
  title: { fontSize: 48, fontWeight: "800", color: COLORS.border, letterSpacing: 1 },
  subtitle: { marginTop: 8, fontSize: 20, color: COLORS.textPrimary, textAlign: "center" },
  footerArea: { },
  primaryButton: { backgroundColor: COLORS.primary, paddingVertical: 16, borderRadius: 12, alignItems: "center" },
  primaryButtonText: { color: COLORS.textPrimary, fontSize: 18, fontWeight: "700" },
  secondaryButton: { marginTop: 12, paddingVertical: 14, borderRadius: 12, alignItems: "center", borderWidth: 1.5, borderColor: COLORS.border, backgroundColor: COLORS.white },
  secondaryButtonText: { color: COLORS.border, fontSize: 16, fontWeight: "700" },
});


