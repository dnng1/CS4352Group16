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
    <Text style={styles.subsubheading0}>Start Here</Text>

<TouchableOpacity style={[styles.card, { flexDirection: "row", alignItems: "center", height: 100}]}
        onPress={() => router.push({ pathname: "/groupEvents/welcomewonders", params: { groupName: "Welcome Wonders" } })}>        
        <Image source={{ uri: "https://cdn-icons-png.flaticon.com/512/25/25437.png" }} style={styles.profileImage}></Image>
        <View style={styles.cardRow}>
                <View style={{ flexDirection: "column", flexShrink: 1 }}>
                  <Text style={styles.groupName}>Welcome Wonders</Text>
                  <Text style ={styles.desc}>Learn about essential resources, policies, and connect with new members</Text>
                  <View style={{ flexDirection: "row", marginLeft: 20, marginTop: 3 }}>
                    <Image source={{ uri: "https://cdn-icons-png.flaticon.com/128/14026/14026550.png" }} style={styles.online}></Image>
                    <Text > 7 online </Text>
                  </View>
                </View>
        <View style={{flexDirection: "column", alignItems: "center"}}>
        <Image source={{uri: "https://cdn-icons-png.flaticon.com/128/189/189253.png"}} style={styles.nextButton}>
        </Image>
          <Text style={styles.meetingFreq}>Meets biweekly</Text>
        </View>              </View>
        
      </TouchableOpacity>


    {(joined[1] || joined[4]) && (
      <Text style={styles.subsubheading1}>Support Systems</Text>
      
    )}
{
  joined[1] && (
  <TouchableOpacity style={[styles.card, { flexDirection: "row", alignItems: "center", height: 100}]}
        onPress={() => router.push({ pathname: "/groupEvents/isa", params: { groupName: "International Student Association" } })}>        
        <Image source={{uri: "https://cdn-icons-png.flaticon.com/128/10156/10156019.png"}} style={styles.profileImage}></Image>
        <View style={styles.cardRow}>
                <View style={{ flexDirection: "column", flexShrink: 1 }}>
          <Text style={styles.groupName}>International Student Association</Text>
          <Text style ={styles.desc}>Support group for international college students looking for mentorship and guidance</Text>
          <View style={{ flexDirection: "row", marginLeft: 20, marginTop: 5 }}>
          <Image source={{uri: "https://cdn-icons-png.flaticon.com/128/14026/14026550.png"}} style={styles.online}></Image>
          <Text> 2 online </Text>
          </View>
                </View>
        <View style={{flexDirection: "column", alignItems: "center"}}>
        <Image source={{uri: "https://cdn-icons-png.flaticon.com/128/189/189253.png"}} style={styles.nextButton}>
        </Image>
          <Text style={styles.meetingFreq}>Flexible meeting</Text>
        </View>              </View>
      </TouchableOpacity>
  )
}

<View style={{position: "relative"}}>{
  joined[4] && (
    <TouchableOpacity style={[styles.card, { flexDirection: "row", alignItems: "center", height: 100}]}
        onPress={() => router.push({ pathname: "/groupEvents/bridgebetweenus", params: { groupName: "Bridge Between Us" } })}>
        <Image source={{uri: "https://cdn-icons-png.flaticon.com/128/1323/1323734.png"}} style={styles.profileImage}></Image>
        <View style={styles.cardRow}>
            <View style={{ flexDirection: "column", flexShrink: 1}}>
          <Text style={styles.groupName}>Bridge Between Us</Text>
          <Text style={styles.desc}>Connect with other migrants to learn from each other's moving process and figure logistics out together</Text>
          <View style={{ flexDirection: "row", marginLeft: 20, marginTop: 5}}>
            <Image source={{uri: "https://cdn-icons-png.flaticon.com/128/14026/14026550.png"}} style={styles.online}></Image>
          <Text> 8 online </Text>
          </View>
        </View>
        <View style={{flexDirection: "column", alignItems: "center"}}>
        <Image source={{uri: "https://cdn-icons-png.flaticon.com/128/189/189253.png"}} style={styles.nextButton}>
        </Image>
          <Text style={styles.meetingFreq}>Meets Weekly</Text>
        </View>
        </View>
      </TouchableOpacity>
  )
}

</View>



{(joined[2] || joined[3]) && (
      <Text style={styles.subsubheading2}>Hobbies & Culture</Text>
    )}
{
  joined[2] && (
<TouchableOpacity style={[styles.card, { flexDirection: "row", alignItems: "center", height: 100}]}
        onPress={() => router.push({ pathname: "/groupEvents/musicalwonders", params: { groupName: "Musical Wonders" } })}>        
        <Image source={{uri: "https://cdn-icons-png.flaticon.com/128/3083/3083417.png"}} style={styles.profileImage}></Image>
        <View style={styles.cardRow}>
            <View style={{ flexDirection: "column", flexShrink: 1}}>
          <Text style={styles.groupName}>Musical Wonders</Text>
        <Text style={styles.desc}>Group of artists with passion for creating music, merging music from their hometowns</Text>
        <View style={{ flexDirection: "row", marginLeft: 20, marginTop: 5}}>
            <Image source={{uri: "https://cdn-icons-png.flaticon.com/128/14026/14026550.png"}} style={styles.online}></Image>
          <Text> 2 online </Text>
          </View>
        </View>
        <View style={{flexDirection: "column", alignItems: "center"}}>
        <Image source={{uri: "https://cdn-icons-png.flaticon.com/128/189/189253.png"}} style={styles.nextButton}>
        </Image>
          <Text style={styles.meetingFreq}>Meets monthly</Text>
        </View>        </View>
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
          <Text style={styles.desc}>Chatting, cooking, and laughing. Share and learn about various cultures through food</Text>
          <View style={{ flexDirection: "row", marginLeft: 20, marginTop: 5}}>
            <Image source={{uri: "https://cdn-icons-png.flaticon.com/128/14026/14026550.png"}} style={styles.online}></Image>
          <Text> 1 online </Text>
          </View>
        </View>
        <View style={{flexDirection: "column", alignItems: "center"}}>
        <Image source={{uri: "https://cdn-icons-png.flaticon.com/128/189/189253.png"}} style={styles.nextButton}>
        </Image>
          <Text style={styles.meetingFreq}>Meets biweekly</Text>
        </View>        </View>
      </TouchableOpacity>
  )
}

{joined[5]&& (
      <Text style={styles.subsubheading3}>Travel & Adventure</Text>
      
    )}

{
  joined[5] && (
    <TouchableOpacity style={[styles.card, { flexDirection: "row", alignItems: "center", height: 100}]}
        onPress={() => router.push({ pathname: "/groupEvents/towntravellers", params: { groupName: "Town Travellers" } })}>
        <Image source={{uri: "https://cdn-icons-png.flaticon.com/128/854/854894.png"}} style={styles.profileImage}></Image>
        <View style={styles.cardRow}>
            <View style={{ flexDirection: "column", flexShrink: 1}}>
          <Text style={styles.groupName}>Town Travellers</Text>
          <Text style={styles.desc}>Visit must-see places in your local city with other newcomers</Text>
          <View style={{ flexDirection: "row", marginLeft: 20, marginTop: 5}}>
            <Image source={{uri: "https://cdn-icons-png.flaticon.com/128/14026/14026550.png"}} style={styles.online}></Image>
          <Text> 5 online </Text>
          </View>
        </View>
        <View style={{flexDirection: "column", alignItems: "center"}}>
        <Image source={{uri: "https://cdn-icons-png.flaticon.com/128/189/189253.png"}} style={styles.nextButton}>
        </Image>
          <Text style={styles.meetingFreq}>Meets monthly</Text>
        </View>        </View>
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
   subsubheading0 : {
    fontSize: 14, 
    marginBottom: 20, 
    fontWeight: 700,
    color: "#000007ff",
    textAlign: "center"
  },
   subsubheading1 : {
    fontSize: 14, 
    marginBottom: 20, 
    fontWeight: 700,
    color: "#6e8cf9ff",
    textAlign: "center"
  },
     subsubheading2: {
    fontSize: 14, 
    marginBottom: 20, 
    fontWeight: 700,
    color: "green",
    textAlign: "center"
  },
  subsubheading3: {
    fontSize: 14, 
    marginBottom: 20, 
    fontWeight: 700,
    color: "#ffaf6eff",
    textAlign: "center"
  },
  card: {
    borderRadius: 15, 
    marginBottom: 20, 
    borderWidth: 2, 
    borderColor: "white", 
    backgroundColor: "#fff",
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

    online: {
      width: 10,
      height: 10,
      borderRadius: 10, 
      resizeMode: "cover", 
      marginTop: 6,
      marginBottom: 5
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
    meetingFreq:{
      fontSize: 10, 
      fontWeight: 500, 
      marginTop: 20,
      color: "#000"
    }

});
