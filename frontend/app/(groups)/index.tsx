import { View, Text, StyleSheet, ScrollView, TouchableOpacity} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import MyGroups from "./_components/MyGroups";
import FindGroups from "./_components/FindGroups";
import { useState, useEffect, useRef } from 'react';
import { useRouter, useFocusEffect } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React from "react";
import Tooltip from "../../components/Tooltip";
import { hasCompletedOnboarding, resetOnboarding } from "../../utils/onboarding";
import { Ionicons } from "@expo/vector-icons";

const COLORS = {
  primary: "#7CA7D9",
  border: "#003366",
  textPrimary: "#000000",
  textSecondary: "#444444",
  background: "#FFFFFF",
};

export default function Groups() {
  const router = useRouter();
  const [toggle, setToggle] = useState<"mygroups" | "findgroups">("mygroups");
  const [menuOpen, setMenuOpen] = useState(false);
  const [joined, setJoin] = useState<{[key: number]:boolean}>({
    0: true,
    1: false,
    2: false, 
    3: false, 
    4: false, 
    5: false
  });
  const [hasLoaded, setHasLoaded] = useState(false);
  const [onboardingActive, setOnboardingActive] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState<{ x: number; y: number; width: number; height: number } | null>(null);
  const toggleBarRef = useRef<View>(null);

  const handleStartOnboarding = async () => {
    await resetOnboarding();
    if (toggleBarRef.current) {
      setTimeout(() => {
        toggleBarRef.current?.measure((x, y, width, height, pageX, pageY) => {
          setTooltipPosition({ x: pageX, y: pageY, width, height });
          setOnboardingActive(true);
        });
      }, 100);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      const loadGroups = async () => {
        try {
          const saved = await AsyncStorage.getItem('joinedGroups');
          if(saved){
            const parsed = JSON.parse(saved);
            setJoin(parsed);
          } else {
            const defaultGroups = {
              0: true,
              1: false,
              2: false, 
              3: false, 
              4: false, 
              5: false
            };
            await AsyncStorage.setItem('joinedGroups', JSON.stringify(defaultGroups));
            setJoin(defaultGroups);
          }
          setHasLoaded(true);
        } catch (error) {
          console.error('Error loading groups:', error);
          setHasLoaded(true);
        }
      };
      const checkOnboarding = async () => {
        const completed = await hasCompletedOnboarding();
        if (!completed && toggleBarRef.current) {
          setTimeout(() => {
            toggleBarRef.current?.measure((x, y, width, height, pageX, pageY) => {
              setTooltipPosition({ x: pageX, y: pageY, width, height });
              setOnboardingActive(true);
            });
          }, 500);
        }
      };
      loadGroups();
      checkOnboarding();
    }, [])
  );

  useEffect(() => {
    if (!hasLoaded) return;
    
    const saveGroups = async () => {
      try {
        await AsyncStorage.setItem('joinedGroups', JSON.stringify(joined));
      } catch (error) {
        console.error('Error saving groups:', error);
      }
    }; 
    saveGroups();
  }, [joined, hasLoaded]);

  return (
    <SafeAreaView style={styles.container} edges={[]}>
      <View style={styles.headerRow}>
        <View style={styles.helpContainer}>
          <TouchableOpacity
            style={styles.helpButton}
            onPress={handleStartOnboarding}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons name="help-circle-outline" size={44} color={COLORS.primary} />
            <Text style={styles.helpLabel}>Help</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.profileContainer}>
          <TouchableOpacity
            style={styles.profileButton}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            onPress={() => setMenuOpen(!menuOpen)}
          >
            <View style={styles.profileCircle}>
              <Text style={styles.profileInitials}>Profile</Text>
            </View>
          </TouchableOpacity>
          {menuOpen && (
            <View style={styles.menuInFlow} pointerEvents="auto">
              <TouchableOpacity
                style={styles.menuItem}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                onPress={() => { 
                  setMenuOpen(false);
                  router.push('/editprofile');
                }}
              >
                <Ionicons name="person-outline" size={18} color="#111827" style={{ marginRight: 8 }} />
                <Text style={styles.menuText}>Edit Profile</Text>
              </TouchableOpacity>
              <View style={styles.menuDivider} />
              <TouchableOpacity
                style={styles.menuItem}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                onPress={() => { setMenuOpen(false); router.replace('/welcome'); }}
              >
                <Ionicons name="log-out-outline" size={18} color="#111827" style={{ marginRight: 8 }} />
                <Text style={styles.menuText}>Sign out</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
      <Text style={styles.heading}>Groups</Text>

      <View ref={toggleBarRef} collapsable={false} style={styles.toggleBar}>
        <TouchableOpacity
          style={[
            styles.toggleButton,
            { borderTopLeftRadius: 20, borderBottomLeftRadius: 20 },
            toggle === "mygroups" && styles.toggleButtonActive
          ]}
          onPress={() => setToggle("mygroups")}
        >
          <Text style={[styles.toggleText, toggle === "mygroups" && styles.toggleTextActive]}>
            My Groups
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.toggleButton,
            { borderTopRightRadius: 20, borderBottomRightRadius: 20 },
            toggle === "findgroups" && styles.toggleButtonActive
          ]}
          onPress={() => setToggle("findgroups")}
        >
          <Text style={[styles.toggleText, toggle === "findgroups" && styles.toggleTextActive]}>
            Find Groups
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.bodyContainer}>
        <ScrollView style={styles.scrollView}>
          {toggle === "mygroups" ? <MyGroups joined={joined}/> : <FindGroups joined={joined} setJoin={setJoin}/>}
        </ScrollView>
      </View>

      {onboardingActive && (
        <Tooltip
          visible={onboardingActive}
          title="Explore Groups 👥"
          description="Switch between 'My Groups' to see groups you've joined, or 'Find Groups' to discover new communities to join!"
          position={tooltipPosition || { x: 0, y: 0, width: 0, height: 0 }}
          onClose={() => setOnboardingActive(false)}
          showSkip={false}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 20,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  helpContainer: {
    position: "relative",
    height: 74,
  },
  helpButton: {
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 10,
  },
  helpLabel: {
    fontSize: 12,
    color: COLORS.primary,
    marginTop: 4,
    fontWeight: "500",
  },
  profileContainer: {
    position: "relative",
    height: 74,
  },
  profileButton: {
    paddingTop: 10,
  },
  profileCircle: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "#E2E8F0",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#CBD5E1",
  },
  profileInitials: {
    fontWeight: "700",
    color: "#1F2937",
    fontSize: 11,
  },
  menuInFlow: {
    position: "absolute",
    top: 74,
    right: 0,
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    paddingVertical: 6,
    width: 140,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 3,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    zIndex: 999,
  },
  menuItem: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
  },
  menuText: {
    fontSize: 14,
    color: "#111827",
  },
  menuDivider: {
    height: 1,
    backgroundColor: "#E5E7EB",
    marginVertical: 4,
  },
  heading: { 
    marginTop: 10,
    fontSize: 24, 
    fontWeight: "700", 
    textAlign: "center", 
  },
  toggleBar: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    marginHorizontal: 0,
    marginTop: 20,
    marginBottom: 8,
    borderRadius: 20,
    padding: 0,
    zIndex: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
    overflow: 'hidden',
  },
  toggleButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
  },
  toggleButtonActive: {
    backgroundColor: '#7CA7D9',
  },
  toggleText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  toggleTextActive: {
    color: '#fff',
  },
  bodyContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollView: {
    paddingHorizontal: 20,
  },
});