import { View, Text, StyleSheet, ScrollView, TextInput, Image, TouchableOpacity } from "react-native";
import { useState } from 'react';
import { useRouter } from "expo-router";

export default function MyGroups(props: any) {
    const router = useRouter();
    const { joined  = {}} = props; 
    return (
    <View style={styles.container}>
      <Text style={styles.subheading}>My Groups</Text>
      {/* group 0 */}
<TouchableOpacity style={[styles.card, { flexDirection: "row", alignItems: "center", height: 100}]}
        onPress={() => router.push({ pathname: "/groupEvents/welcomewonders", params: { groupName: "Welcome Wonders" } })}>        
        <Image source={{ uri: "https://cdn-icons-png.flaticon.com/512/25/25437.png" }} style={styles.profileImage}></Image>
        <View style={styles.cardRow}>
                <View style={{ flexDirection: "column", flexShrink: 1 }}>
                  <Text style={styles.groupName}>Welcome Wonders</Text>
                  <View style={{ flexDirection: "row", marginLeft: 20, marginTop: 5 }}>
                    <Image source={{ uri: "https://cdn-icons-png.flaticon.com/128/14026/14026550.png" }} style={styles.online}></Image>
                    <Text> 7 online </Text>
                  </View>
                </View>
                <Image source={{ uri: "https://cdn-icons-png.flaticon.com/128/189/189253.png" }} style={styles.nextButton}></Image>
              </View>
        
      </TouchableOpacity>

{
  joined[1] && (
  <TouchableOpacity style={[styles.card, { flexDirection: "row", alignItems: "center", height: 100}]}
        onPress={() => router.push({ pathname: "/groupEvents/isa", params: { groupName: "International Student Association" } })}>        
        <Image source={{uri: "https://cdn-icons-png.flaticon.com/128/10156/10156019.png"}} style={styles.profileImage}></Image>
        <View style={styles.cardRow}>
                <View style={{ flexDirection: "column", flexShrink: 1 }}>
          <Text style={styles.groupName}>International Student Association</Text>
          <View style={{ flexDirection: "row", marginLeft: 20, marginTop: 5 }}>
          <Image source={{uri: "https://cdn-icons-png.flaticon.com/128/14026/14026550.png"}} style={styles.online}></Image>
          <Text> 2 online </Text>
          </View>
                </View>
                <Image source={{uri: "https://cdn-icons-png.flaticon.com/128/189/189253.png"}} style={styles.nextButton}></Image>
              </View>
      </TouchableOpacity>
  )
}

{
  joined[2] && (
<TouchableOpacity style={[styles.card, { flexDirection: "row", alignItems: "center", height: 100}]}
        onPress={() => router.push({ pathname: "/groupEvents/musicalwonders", params: { groupName: "Town Travellers" } })}>        
        <Image source={{uri: "https://cdn-icons-png.flaticon.com/128/3083/3083417.png"}} style={styles.profileImage}></Image>
        <View style={styles.cardRow}>
            <View style={{ flexDirection: "column", flexShrink: 1}}>
          <Text style={styles.groupName}>Musical Wonders</Text>
          <View style={{ flexDirection: "row", marginLeft: 20, marginTop: 5}}>
            <Image source={{uri: "https://cdn-icons-png.flaticon.com/128/14026/14026550.png"}} style={styles.online}></Image>
          <Text> 2 online </Text>
          </View>
        </View>
        <Image source={{uri: "https://cdn-icons-png.flaticon.com/128/189/189253.png"}} style={styles.nextButton}></Image>
        </View>
      </TouchableOpacity>
  )
}

{
  joined[3] && (
<TouchableOpacity style={[styles.card, { flexDirection: "row", alignItems: "center", height: 100}]}
        onPress={() => router.push({ pathname: "/groupEvents/cookingninjas", params: { groupName: "Cooking Ninjas" } })}>        
        <Image source={{uri: "https://cdn-icons-png.flaticon.com/128/1027/1027128.png"}} style={styles.profileImage}></Image>
        <View style={styles.cardRow}>
            <View style={{ flexDirection: "column", flexShrink: 1}}>
          <Text style={styles.groupName}>Cooking Ninjas</Text>
          <View style={{ flexDirection: "row", marginLeft: 20, marginTop: 5}}>
            <Image source={{uri: "https://cdn-icons-png.flaticon.com/128/14026/14026550.png"}} style={styles.online}></Image>
          <Text> 1 online </Text>
          </View>
        </View>
        <Image source={{uri: "https://cdn-icons-png.flaticon.com/128/189/189253.png"}} style={styles.nextButton}></Image>
        </View>
      </TouchableOpacity>
  )
}

{
  joined[4] && (
    <TouchableOpacity style={[styles.card, { flexDirection: "row", alignItems: "center", height: 100}]}
        onPress={() => router.push({ pathname: "/groupEvents/bridgebetweenus", params: { groupName: "Bridge Between Us" } })}>
        <Image source={{uri: "https://cdn-icons-png.flaticon.com/128/1323/1323734.png"}} style={styles.profileImage}></Image>
        <View style={styles.cardRow}>
            <View style={{ flexDirection: "column", flexShrink: 1}}>
          <Text style={styles.groupName}>Bridge Between Us</Text>
          <View style={{ flexDirection: "row", marginLeft: 20, marginTop: 5}}>
            <Image source={{uri: "https://cdn-icons-png.flaticon.com/128/14026/14026550.png"}} style={styles.online}></Image>
          <Text> 8 online </Text>
          </View>
        </View>
        <Image source={{uri: "https://cdn-icons-png.flaticon.com/128/189/189253.png"}} style={styles.nextButton}></Image>
        </View>
      </TouchableOpacity>
  )
}

{
  joined[5] && (
    <TouchableOpacity style={[styles.card, { flexDirection: "row", alignItems: "center", height: 100}]}
        onPress={() => router.push({ pathname: "/groupEvents/towntravellers", params: { groupName: "Town Travellers" } })}>
        <Image source={{uri: "https://cdn-icons-png.flaticon.com/128/854/854894.png"}} style={styles.profileImage}></Image>
        <View style={styles.cardRow}>
            <View style={{ flexDirection: "column", flexShrink: 1}}>
          <Text style={styles.groupName}>Town Travellers</Text>
          <View style={{ flexDirection: "row", marginLeft: 20, marginTop: 5}}>
            <Image source={{uri: "https://cdn-icons-png.flaticon.com/128/14026/14026550.png"}} style={styles.online}></Image>
          <Text> 5 online </Text>
          </View>
        </View>
        <Image source={{uri: "https://cdn-icons-png.flaticon.com/128/189/189253.png"}} style={styles.nextButton}></Image>
        </View>
      </TouchableOpacity>
  )
}

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
    marginTop: 10,
    fontSize: 24, 
    fontWeight: "700", 
    textAlign: "center", 
},
  searchBar: {
    padding: 10, 
    fontSize: 16, 
    borderRadius: 20, 
    borderColor: "black", 
    borderWidth: 1, 
    marginBottom: 20,
    marginTop: 20,
    backgroundColor: "#F1F5F9"},

  subheading: {
    fontSize: 18,
    marginBottom: 20, 
    fontWeight: "600", 
  },



  card: {
    borderRadius: 15, 
    marginBottom: 20, 
    borderWidth: 2, 
    borderColor: "white", 
    shadowColor: "#000", 
    shadowOffset: {width: 0, height: 2}, 
    shadowOpacity: 0.2,
    shadowRadius: 4, 
    elevation: 3, },
    
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
      marginLeft: 20
    },

    online: {
      width: 10,
      height: 10,
      borderRadius: 10, 
      resizeMode: "cover", 
      marginTop: 6
    },

    nextButton: {
      width: 30, 
      height: 30, 
      borderRadius: 10, 
      resizeMode: "cover",
      marginRight: 20,
},
cardRow: {
        flexDirection: "row", 
        flex: 1, 
        alignItems: "center", 
        justifyContent: "space-between",
        marginEnd: 20
    },
    desc: {
      fontWeight: "400",
      marginLeft: 20, 
      flexWrap: "wrap",
      maxWidth: "55%",
      justifyContent: "space-between", 
      marginTop: 5
    },
});
