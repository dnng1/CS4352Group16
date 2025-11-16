import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function FindGroups(props: any) {
  const{joined = {}, setJoin} = props;
  
  const handleJoin = async (groupId: number) => {
    try {
      const updated = { ...joined, [groupId]: true };
      // Save to AsyncStorage first to ensure persistence
      await AsyncStorage.setItem('joinedGroups', JSON.stringify(updated));
      // Then update state
      setJoin(updated);
    } catch (error) {
      console.error('Error joining group:', error);
    }
  };
  return (
    <View style={styles.container}>
      <ScrollView>
      <Text style={styles.subheading}>Groups That May Interest You</Text>

    {/*  Friend group 1*/}
      {!joined[1] && (
      <View style={[styles.card, { flexDirection: "row", alignItems: "flex-start", paddingVertical: 12}]}>
        <Image source={{uri: "https://cdn-icons-png.flaticon.com/128/10156/10156019.png"}} style={styles.profileImage}></Image>
        <View style={styles.cardRow}>
            <View style={{flexDirection: "column", flex: 1, flexShrink: 1}}>
                <Text style={styles.groupName}>International Student Association</Text>
                <Text style={styles.desc}>Support group for international college students looking for mentorship and guidance</Text>
                <Text style={styles.desc1}>Flexible meeting</Text>
            </View>
            <TouchableOpacity style={[styles.joinButton, joined[1] ? styles.joinActive : styles.joinInactive]} onPress={() => handleJoin(1)}>
                <Text style={styles.buttonText}>
                    {joined[1] ? "Joined" : "Join"}
                </Text>
            </TouchableOpacity>
        </View>
      </View>
      )}

      {/*  Friend group 2*/}
      {!joined[2] && (
      <View style={[styles.card, { flexDirection: "row", alignItems: "flex-start", paddingVertical: 12}]}>
        <Image source={{uri: "https://cdn-icons-png.flaticon.com/128/3083/3083417.png"}} style={styles.profileImage}></Image>
        <View style={styles.cardRow}>
            <View style={{flexDirection: "column", flex: 1, flexShrink:1}}>
                <Text style={styles.groupName}>Musical Wonders</Text>
                <Text style={styles.desc}>Group of artists with passion for creating music, merging music from their hometowns</Text>
                <Text style={styles.desc1}>Meets monthly</Text>
            </View>
            <TouchableOpacity style={[styles.joinButton, joined[2] ? styles.joinActive : styles.joinInactive]} onPress={() => handleJoin(2)}>
                <Text style={styles.buttonText}>
                    {joined[2] ? "Joined" : "Join"}
                </Text>
            </TouchableOpacity>
        </View>
      </View>
      )}

      {/*  Friend group 3*/}
      {!joined[3] && (
      <View style={[styles.card, { flexDirection: "row", alignItems: "flex-start", paddingVertical: 12}]}>
        <Image source={{uri: "https://cdn-icons-png.flaticon.com/128/1027/1027128.png"}} style={styles.profileImage}></Image>
        <View style={styles.cardRow}>
            <View style={{flexDirection: "column", flex: 1, flexShrink:1}}>
                <Text style={styles.groupName}>Cooking Ninjas </Text>
                <Text style={styles.desc}>Chatting, cooking, and laughing. Food enthiusiasts sharing their culture</Text>
                <Text style={styles.desc1}>Meets biweekly</Text>
            </View>
            <TouchableOpacity style={[styles.joinButton, joined[3] ? styles.joinActive : styles.joinInactive]} onPress={() => handleJoin(3)}>
                <Text style={styles.buttonText}>
                    {joined[3] ? "Joined" : "Join"}
                </Text>
            </TouchableOpacity>
        </View>
      </View>
      )}

      {/*  Friend group 4*/}
      {!joined[4] && (
      <View style={[styles.card, { flexDirection: "row", alignItems: "flex-start", paddingVertical: 12}]}>
        <Image source={{uri: "https://cdn-icons-png.flaticon.com/128/1323/1323734.png"}} style={styles.profileImage}></Image>
        <View style={styles.cardRow}>
            <View style={{flexDirection: "column", flex: 1, flexShrink:1}}>
                <Text style={styles.groupName}>Bridge Between Us </Text>
                <Text style={styles.desc}>Connect with other migrants to learn from each other's moving process and figure things out together</Text>
                <Text style={styles.desc1}>Meets weekly</Text>
            </View>
            <TouchableOpacity style={[styles.joinButton, joined[4] ? styles.joinActive : styles.joinInactive]} onPress={() => handleJoin(4)}>
                <Text style={styles.buttonText}>
                    {joined[4] ? "Joined" : "Join"}
                </Text>
            </TouchableOpacity>
        </View>
      </View>
      )}

      {/*  Friend group 5*/}
      {!joined[5] && (
      <View style={[styles.card, { flexDirection: "row", alignItems: "flex-start", paddingVertical: 12}]}>
        <Image source={{uri: "https://cdn-icons-png.flaticon.com/128/854/854894.png"}} style={styles.profileImage}></Image>
        <View style={styles.cardRow}>
            <View style={{flexDirection: "column", flex: 1, flexShrink:1}}>
                <Text style={styles.groupName}>Town Travellers </Text>
                <Text style={styles.desc}>Visit must-see places in your local city with other newcomers</Text>
                <Text style={styles.desc1}>Meets monthly</Text>
            </View>
            <TouchableOpacity style={[styles.joinButton, joined[5] ? styles.joinActive : styles.joinInactive]} onPress={() => handleJoin(5)}>
                <Text style={styles.buttonText}>
                    {joined[5] ? "Joined" : "Join"}
                </Text>
            </TouchableOpacity>
        </View>
      </View>
      )}

    </ScrollView>
    </View>
    
  );
}


const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    justifyContent: "space-between", 
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
    marginTop: 10,
    fontSize: 24, 
    fontWeight: "700", 
    textAlign: "center", 
},

  subheading: {
    fontSize: 18,
    marginBottom: 20, 
    fontWeight: "600", 
  },

  card: {
    borderRadius: 15, 
    marginBottom: 30, 
    borderWidth: 2, 
    borderColor: "white", 
    backgroundColor: "#fff",
    shadowColor: "#000", 
    shadowOffset: {width: 0, height: 2}, 
    shadowOpacity: 0.2,
    shadowRadius: 4, 
    elevation: 3},
    
    cardRow: {
        flexDirection: "row", 
        flex: 1, 
        alignItems: "center", 
        justifyContent: "space-between",
        marginEnd: 20,
    },
    
    image: {
      width: "100%", 
      aspectRatio: 4/3,
      marginBottom: 10, 
      objectFit: "cover"
    },

    profileImage: {
      width: 60,
      height: 60, 
      borderRadius: 50, 
      borderWidth: 1, 
      resizeMode: "cover", 
      marginLeft: 10,
      marginTop: 10,
      marginBottom: 10
    },

    groupName: {
      fontWeight: "600",
      marginLeft: 20,
    },
     desc: {
      fontWeight: "400",
      marginLeft: 20, 
      flexWrap: "wrap",
      maxWidth: "85%",
      justifyContent: "space-between", 
      marginTop: 5
    },
desc1: {
      fontWeight: "200",
      marginLeft: 20, 
      flexWrap: "wrap",
      maxWidth: "80%",
      justifyContent: "space-between", 
      marginTop: 5
    },
    joinButton:{
        borderRadius: 8,
        borderColor: "black",
        textAlign: "center",
        padding: 5, 
        width: 65, 
        borderWidth: 1,
        alignSelf: "center",
        flexShrink: 0
        },

    buttonText: {
        textAlign: "center"
    },

    joinActive: {
        backgroundColor: "#b4ecb4"
    },
    joinInactive : {
    }
});
