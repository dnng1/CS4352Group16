import { View, Text, StyleSheet, ScrollView, TextInput, Image } from "react-native";
import {useState} from 'react';

const events = [
    { event: "Musical Boat Party", image: "https://m.media-amazon.com/images/I/81s4Yq0JJWL._AC_UF350,350_QL80_.jpg", date: "December 1st", time: "2:00 pm", location: "1234 Sesame St. ", id: 1 },
    { event: "Cornhole Toss", image: "https://www.cornholeworldwide.com/wp-content/uploads/2020/07/shutterstock_717048238.jpg", date: "December 2nd", time: "9:00 am", location: "456 Boat Port ", id: 2 },
    { event: "Friendsgiving Party", image:"https://www.mashed.com/img/gallery/52-thanksgiving-dishes-to-make-you-the-star-of-friendsgiving/intro-1637165015.jpg", date: "November 25th", time: "4:00 pm", location: "1234 ABC St. ", id: 3 }
  ]

export default function Dashboard() {
  const [search, setSearch] = useState('');
  return (
    <View style={styles.container}>
      <ScrollView>
      <Text style={styles.heading}>Home</Text>
      <TextInput style={styles.searchBar} placeholder="Search" value={search} onChangeText={setSearch}/>
      <Text style={styles.subheading}>My Upcoming Events</Text>
      {events.map((item) => (
        <View key={item.id} style={styles.card}>
            <Image source={{uri: item.image }} style={styles.image}></Image>
            <Text style={styles.eventName}>{item.event}</Text>
            <Text style={styles.eventDetails}>{item.time}</Text>
            <Text style={styles.eventDetails}>{item.date}</Text>
            <Text style={[styles.eventDetails, {marginBottom: 10}]}>{item.location}</Text>
        </View>

      ))}
      <Text style={styles.subheading}>My Groups</Text>
      <View style={[styles.card, { flexDirection: "row", alignItems: "center", justifyContent: "space-between", height: 100}]}>
        <Image source={{uri: "https://cdn-icons-png.flaticon.com/512/25/25437.png"}} style={styles.profileImage}></Image>
        <View style={{ flexDirection: "column", marginLeft: 15}}>
          <Text style={styles.groupName}>Friend Group 3</Text>
          <View style={{ flexDirection: "row"}}>
            <Image source={{uri: "https://cdn-icons-png.flaticon.com/128/14026/14026550.png"}} style={styles.online}></Image>
          <Text> 3 online </Text>
          </View>
        </View>
        <Image source={{uri: "https://cdn-icons-png.flaticon.com/128/189/189253.png"}} style={styles.nextButton}></Image>
      </View>

      <View style={[styles.card, { flexDirection: "row", alignItems: "center", justifyContent: "space-between", height: 100}]}>
        <Image source={{uri: "https://cdn-icons-png.flaticon.com/512/25/25437.png"}} style={styles.profileImage}></Image>
        <View style={{ flexDirection: "column", marginLeft: 15}}>
          <Text style={styles.groupName}>Friend Group 5</Text>
          <View style={{ flexDirection: "row"}}>
            <Image source={{uri: "https://cdn-icons-png.flaticon.com/128/14026/14026550.png"}} style={styles.online}></Image>
          <Text> 6 online </Text>
          </View>
        </View>
        <Image source={{uri: "https://cdn-icons-png.flaticon.com/128/189/189253.png"}} style={styles.nextButton}></Image>
      </View>

      
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

  eventName: {
    fontSize: 25, 
    fontWeight: "500",
    marginBottom: 10,
    marginLeft: 12,
    fontFamily: 'System'
  },

  eventDetails: {
    fontSize: 14,
    marginLeft: 12, 
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
      marginRight: 20
}
});
