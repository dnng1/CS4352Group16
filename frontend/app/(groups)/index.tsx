import { View, Text, StyleSheet, ScrollView, TouchableOpacity} from "react-native";
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
    <View style={styles.container}>
      <View style={styles.headerRow}>
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
          <ScrollView>
            <Text style={styles.heading}>Groups</Text>
            <View style={styles.toggle}>
            <TouchableOpacity style={[styles.mygroupsButton, toggle === "mygroups" ? styles.active : styles.inactive]} onPress={() => setToggle("mygroups")}>
              <Text style={styles.buttonText}> My Groups </Text>
            </TouchableOpacity>
              <TouchableOpacity style={[styles.findgroupsButton, toggle === "findgroups" ? styles.active : styles.inactive]} onPress={() => setToggle("findgroups")}>
              <Text style={styles.buttonText}> Find Groups </Text>
            </TouchableOpacity>
            </View>
            {toggle === "mygroups" ? <MyGroups joined={joined}/> : <FindGroups joined={joined} setJoin={setJoin}/>}
          </ScrollView>
      </View>
  );
}

const styles = StyleSheet.create({
 container: { 
    flex: 1, 
    justifyContent: "center", 
    padding: 20, 
    },
      headerRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
  },
  profileContainer: {
    position: "relative",
    height: 44,
  },
  profileButton: {
    paddingTop: 10,
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

    heading: {
      fontSize: 28, 
      textAlign: "center",
      marginBottom: 10, 
    },

    toggle: {
      flexDirection: "row",
      justifyContent: "center",
      borderWidth: 1, 
      borderColor: "black", 
      borderRadius: 20,
      alignSelf: "center", 
      width: "50%",
      marginVertical: 10
    },

    mygroupsButton: {
      flex: 1, 
      borderBottomLeftRadius: 20,
      borderTopLeftRadius: 20,
      borderBottomRightRadius: 0,
      borderTopRightRadius: 0,
      padding: 6,
      paddingLeft: 10,
      borderRightWidth: 1,
      borderRightColor: "black",
      alignItems: "center"
    },

    findgroupsButton: {
      flex: 1,
      borderBottomRightRadius: 20,
      borderTopRightRadius: 20,
      borderBottomLeftRadius: 0,
      borderTopLeftRadius: 0,
      padding: 6, 
      paddingRight: 10,
      alignItems: "center"
    },

    buttonText: {
      color: "black",
      fontSize: 12
    }, 

    active: {
      backgroundColor: "#7CA7D9"
    },

    inactive: {
      backgroundColor: ""
    }
});