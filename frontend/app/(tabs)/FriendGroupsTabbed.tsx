import React, { useState } from "react";
import { View, Text, TouchableOpacity, SafeAreaView, ScrollView, Image } from "react-native";
import { useRouter } from "expo-router";


const COLORS = 
{
 background: "#FFFFFF",
 card: "#CFE6FF",
 primary: "#7CA7D9",
 textPrimary: "#000000",
 textSecondary: "#444444",
 joined: "#4CAF50",
};


const allGroups = 
[
 {
   id: "1",
   name: "Book Lovers",
   description: "Connect with others who enjoy reading and sharing book recommendations.",
   photo: "https://reactnative.dev/img/tiny_logo.png",
 },
 {
   id: "2",
   name: "Hiking Enthusiasts",
   description: "Join local hikes and explore nature with fellow outdoor lovers.",
   photo: "https://reactnative.dev/img/tiny_logo.png",
 },
 {
   id: "3",
   name: "Movie Buffs",
   description: "Discuss and watch movies together with a group of fellow cinephiles.",
   photo: "https://reactnative.dev/img/tiny_logo.png",
 },
];


export default function FriendGroupsTabbed() 
{
 const [activeTab, setActiveTab] = useState<"joined" | "find">("joined");
 const [joinedGroups, setJoinedGroups] = useState<{ [key: string]: boolean }>({});
 const router = useRouter();


 const toggleJoin = (id: string) => 
    {
   setJoinedGroups((prev) => (
    {
     ...prev,
     [id]: !prev[id],
   }));
 };


 const joinedList = allGroups.filter((g) => joinedGroups[g.id]);
 const unjoinedList = allGroups.filter((g) => !joinedGroups[g.id]);


 return (
   <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.background }}>
       {/* Header */}
       <View style={{ paddingTop: 20, marginBottom: 20 }}>
         <Text style={{ fontSize: 28, fontWeight: "700", color: COLORS.textPrimary, textAlign: "center" }}>
           Friend Groups
         </Text>
       </View>
     {/* Tabs */}
     <View style={{ flexDirection: "row", justifyContent: "center", marginVertical: 10 }}>
       <TouchableOpacity
         onPress={() => setActiveTab("joined")}
         style={{
           flex: 1,
           backgroundColor: activeTab === "joined" ? COLORS.primary : "#eee",
           paddingVertical: 12,
           alignItems: "center",
           borderRadius: 8,
           marginHorizontal: 5,
         }}
       >
         <Text style={{ fontWeight: "600", color: COLORS.textPrimary }}>My Groups</Text>
       </TouchableOpacity>


       <TouchableOpacity
         onPress={() => setActiveTab("find")}
         style={{
           flex: 1,
           backgroundColor: activeTab === "find" ? COLORS.primary : "#eee",
           paddingVertical: 12,
           alignItems: "center",
           borderRadius: 8,
           marginHorizontal: 5,
         }}
       >
         <Text style={{ fontWeight: "600", color: COLORS.textPrimary }}>Find Groups</Text>
       </TouchableOpacity>
     </View>


     <ScrollView contentContainerStyle={{ padding: 20 }}>
       {activeTab === "joined"
         ? joinedList.length > 0
           ? joinedList.map((group) => (
               <TouchableOpacity
                 key={group.id}
                 onPress={() =>
                   router.push({
                     pathname: "/GroupDetail",
                     params: { id: group.id, name: group.name, description: group.description, photo: group.photo }
                   })
                 }
                 style={{
                   flexDirection: "row",
                   backgroundColor: COLORS.card,
                   padding: 20,
                   borderRadius: 12,
                   marginBottom: 15,
                   alignItems: "center",
                 }}
               >
                 <Image
                   source={{ uri: group.photo }}
                   style={{ width: 60, height: 60, borderRadius: 30, marginRight: 15 }}
                 />
                 <View style={{ flex: 1 }}>
                   <Text style={{ fontSize: 20, fontWeight: "600" }}>{group.name}</Text>
                   <Text style={{ color: COLORS.textSecondary }}>{group.description}</Text>
                 </View>
               </TouchableOpacity>
             ))
           : (
             <Text style={{ textAlign: "center", color: COLORS.textSecondary }}>
               You haven’t joined any groups yet.
             </Text>
           )
         : unjoinedList.map((group) => (
             <View
               key={group.id}
               style={{
                 flexDirection: "row",
                 backgroundColor: COLORS.card,
                 padding: 20,
                 borderRadius: 12,
                 marginBottom: 15,
                 alignItems: "center",
               }}
             >
               <Image
                 source={{ uri: group.photo }}
                 style={{ width: 60, height: 60, borderRadius: 30, marginRight: 15 }}
               />
               <View style={{ flex: 1 }}>
                 <Text style={{ fontSize: 20, fontWeight: "600" }}>{group.name}</Text>
                 <Text style={{ color: COLORS.textSecondary, marginBottom: 8 }}>
                   {group.description}
                 </Text>
                 <TouchableOpacity
                   onPress={() => toggleJoin(group.id)}
                   style={{
                     backgroundColor: joinedGroups[group.id] ? COLORS.joined : COLORS.primary,
                     paddingVertical: 10,
                     borderRadius: 12,
                     alignItems: "center",
                     width: 100,
                   }}
                 >
                   <Text style={{ color: COLORS.textPrimary, fontWeight: "600" }}>
                     {joinedGroups[group.id] ? "Joined" : "Join"}
                   </Text>
                 </TouchableOpacity>
               </View>
             </View>
           ))}
     </ScrollView>
   </SafeAreaView>
 );
}