import React, { useState } from "react";
import { View, Text, Image, TouchableOpacity, ScrollView, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";


const COLORS = 
{
 background: "#FFFFFF",
 card: "#CFE6FF",
 primary: "#7CA7D9",
 textPrimary: "#000000",
 textSecondary: "#444444",
 divider: "#CCCCCC",
 checkmark: "#4CAF50",
};


export default function GroupDetails() 
{
 const { id } = useLocalSearchParams();
 const router = useRouter();
 const [activeTab, setActiveTab] = useState("events");
 const [checkedEvents, setCheckedEvents] = useState<{ [key: string]: boolean }>({});


 const groupData = 
 {
   1: 
   {
     name: "Book Lovers",
     description: "Connect with others who enjoy reading and sharing book recommendations.",
     photo: "https://via.placeholder.com/80",
   },
   2: 
   {
     name: "Hiking Enthusiasts",
     description: "Join local hikes and explore nature with fellow outdoor lovers.",
     photo: "https://via.placeholder.com/80",
   },
   3: 
   {
     name: "Movie Buffs",
     description: "Discuss and watch movies together with a group of fellow cinephiles.",
     photo: "https://via.placeholder.com/80",
   },
 };


 const numericId = Number(id);
 const group = groupData[numericId as keyof typeof groupData];


 if (!group) //not found
{
   return (
     <SafeAreaView
       style={{ flex: 1, backgroundColor: COLORS.background, alignItems: "center", justifyContent: "center" }}
     >
       <Text style={{ color: COLORS.textPrimary, fontSize: 18 }}>Group not found.</Text>
     </SafeAreaView>
   );
 }


 const toggleCheck = (eventId: string) => 
 {
   setCheckedEvents((prev) => ({ ...prev, [eventId]: !prev[eventId] }));
 };


 const newEvents = 
 [
   { id: "ne1", title: "New Book Release", date: "Oct 28, 2025" },
 ];


 const upcomingEvents = 
 [
   { id: "ue1", title: "Monthly Book Club", date: "Nov 5, 2025" },
   { id: "ue2", title: "Author Meetup", date: "Nov 12, 2025" },
 ];


 const previousEvents = 
 [
   { id: "pe1", title: "Past Workshop", date: "Oct 10, 2025" },
 ];


 const renderEvent = (event: { id: string; title: string; date: string }, isUpcoming: boolean = false) => (
   <View key={event.id} style={styles.eventCard}>
     <View>
       <Text style={styles.eventTitle}>{event.title}</Text>
       <Text style={styles.eventDate}>{event.date}</Text>
     </View>
     {isUpcoming && (
       <TouchableOpacity
         style={[styles.checkmarkButton, checkedEvents[event.id] && { backgroundColor: COLORS.checkmark }]}
         onPress={() => toggleCheck(event.id)}
       >
         <Text style={{ color: "white", fontWeight: "700" }}>
           {checkedEvents[event.id] ? "✓" : ""}
         </Text>
       </TouchableOpacity>
     )}
   </View>
 );


 return (
   <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.background, paddingHorizontal: 20, paddingTop: 20 }}>
     {/* Header */}
     <TouchableOpacity onPress={() => router.push("/home")} style={{ marginBottom: 10 }}>
       <Text style={{ color: COLORS.primary, fontSize: 16 }}>← Back</Text>
     </TouchableOpacity>


     {/* Group Info */}
     <View style={{ alignItems: "center", marginBottom: 20 }}>
       <Image
         source={{ uri: group.photo }}
         style={{ width: 100, height: 100, borderRadius: 50, marginBottom: 10 }}
       />
       <Text style={{ fontSize: 26, fontWeight: "700", color: COLORS.textPrimary }}>{group.name}</Text>
       <Text style={{ fontSize: 16, color: COLORS.textSecondary, textAlign: "center", marginTop: 5 }}>
         {group.description}
       </Text>
     </View>


     {/* Tabs */}
     <View style={styles.tabsContainer}>
       <TouchableOpacity
         onPress={() => setActiveTab("events")}
         style={[styles.tabButton, activeTab === "events" && styles.activeTab]}
       >
         <Text style={[styles.tabText, activeTab === "events" && { color: COLORS.primary }]}>Events</Text>
       </TouchableOpacity>
       <TouchableOpacity
         onPress={() => setActiveTab("chat")}
         style={[styles.tabButton, activeTab === "chat" && styles.activeTab]}
       >
         <Text style={[styles.tabText, activeTab === "chat" && { color: COLORS.primary }]}>Chat</Text>
       </TouchableOpacity>
     </View>


     {/* Tab Content */}
     <ScrollView style={{ flex: 1 }}>
       {activeTab === "events" ? (
         <View>
           <Text style={styles.sectionTitle}>New Events</Text>
           {newEvents.map((e) => renderEvent(e))}
           <View style={styles.divider} />


           <Text style={styles.sectionTitle}>Upcoming Events</Text>
           {upcomingEvents.map((e) => renderEvent(e, true))}
           <View style={styles.divider} />


           <Text style={styles.sectionTitle}>Previous Events</Text>
           {previousEvents.map((e) => renderEvent(e))}
         </View>
       ) : (
         <View>
           <Text style={styles.sectionTitle}>Group Chat</Text>
           <Text style={{ color: COLORS.textSecondary }}>
             Start chatting with your group members here!
           </Text>
         </View>
       )}
     </ScrollView>
   </SafeAreaView>
 );
}


const styles = StyleSheet.create({
 tabsContainer:
 {
   flexDirection: "row",
   justifyContent: "center",
   marginBottom: 20,
   borderBottomWidth: 1,
   borderBottomColor: "#ccc",
 },
 tabButton: 
 {
   paddingVertical: 10,
   paddingHorizontal: 20,
 },
 tabText: 
 {
   fontSize: 16,
   color: COLORS.textSecondary,
 },
 activeTab: 
 {
   borderBottomWidth: 3,
   borderBottomColor: COLORS.primary,
 },
 sectionTitle: 
 {
   fontSize: 18,
   fontWeight: "600",
   color: COLORS.textPrimary,
   marginBottom: 10,
   marginTop: 15,
 },
 divider: 
 {
   height: 1,
   backgroundColor: COLORS.divider,
   marginVertical: 10,
 },
 eventCard:
{
   flexDirection: "row",
   justifyContent: "space-between",
   backgroundColor: COLORS.card,
   padding: 15,
   borderRadius: 12,
   marginVertical: 5,
   alignItems: "center",
 },
 eventTitle: 
 {
   fontSize: 16,
   fontWeight: "600",
   color: COLORS.textPrimary,
 },
 eventDate: 
 {
   fontSize: 14,
   color: COLORS.textSecondary,
   marginTop: 2,
 },
 checkmarkButton: 
 {
   width: 30,
   height: 30,
   borderRadius: 15,
   backgroundColor: COLORS.primary,
   justifyContent: "center",
   alignItems: "center",
 },
});
