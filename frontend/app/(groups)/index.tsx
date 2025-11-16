import { View, Text, StyleSheet, ScrollView, TouchableOpacity} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import MyGroups from "./_components/MyGroups";
import FindGroups from "./_components/FindGroups";
import { useState, useEffect } from 'react';
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

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

  useEffect (() => {
    const savedGroups = async () => {
      const saved = await AsyncStorage.getItem('joinedGroups');
      if(saved){
        setJoin(JSON.parse(saved));
      }
    }; 
    savedGroups();
  }, []);

    useEffect (() => {
    const saveGroups = async () => {
      await AsyncStorage.setItem('joinedGroups', JSON.stringify(joined));
    }; 
    saveGroups();
  }, [joined]);

  return (
    <SafeAreaView style={styles.container} edges={[]}>
      <View style={styles.header}>
        <View style={styles.placeholder} />
        <View style={styles.titleContainer}>
          <Text style={styles.headerTitle}>Groups</Text>
        </View>
        <View style={styles.profileContainer}>
          <TouchableOpacity
            style={styles.profileButton}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            onPress={() => setMenuOpen(!menuOpen)}
          >
            <View style={styles.profileCircle}>
              <Text style={styles.profileInitials}>U</Text>
            </View>
          </TouchableOpacity>
          {menuOpen && (
            <View style={styles.menuInFlow} pointerEvents="auto">
              <TouchableOpacity
                style={styles.menuItem}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                onPress={() => { setMenuOpen(false); router.replace('/welcome'); }}
              >
                <Text style={styles.menuText}>Sign out</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>

      <View style={styles.toggleBar}>
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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E6F4FE',
  },
  header: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  placeholder: {
    width: 40,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    fontStyle: 'italic',
    color: '#000',
  },
  profileContainer: {
    position: "relative",
    height: 44,
  },
  profileButton: {
    padding: 8,
  },
  profileCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#E2E8F0",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#CBD5E1",
  },
  profileInitials: {
    fontWeight: "700",
    color: "#1F2937",
  },
  menuInFlow: {
    position: "absolute",
    top: 44,
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
  },
  menuText: {
    fontSize: 14,
    color: "#111827",
  },
  toggleBar: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginTop: -20,
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
    backgroundColor: '#007AFF',
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
    backgroundColor: '#E6F4FE',
  },
  scrollView: {
    paddingHorizontal: 20,
  },
});