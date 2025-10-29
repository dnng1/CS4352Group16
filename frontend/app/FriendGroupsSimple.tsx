import React, { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";


const COLORS = 
{
 background: "#FFFFFF",
 card: "#CFE6FF",
 primary: "#7CA7D9",
 textPrimary: "#000000",
 textSecondary: "#444444",
 border: "#003366",
 joined: "#4CAF50", // green for joined
};


const groups = 
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


export default function FriendGroups() 
{
 const router = useRouter();
 const [joinedGroups, setJoinedGroups] = useState<{ [key: string]: boolean }>({});


 const toggleJoin = (id: string) => 
    {
   setJoinedGroups((prev) => ({
     ...prev,
     [id]: !prev[id],
   }));
 };


 return (
   <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.background, paddingHorizontal: 20 }}>
     <ScrollView showsVerticalScrollIndicator={false}>
       <View style={{ paddingTop: 20, marginBottom: 20 }}>
         <Text style={{ fontSize: 28, fontWeight: "700", color: COLORS.textPrimary, textAlign: "center" }}>
           Quiz Completed! 🎉
         </Text>
         <Text style={{ fontSize: 16, color: COLORS.textSecondary, textAlign: "center", marginTop: 10 }}>
           Here are some groups based off your preferences:
         </Text>
       </View>


       {groups.map((group) => {
         const isJoined = joinedGroups[group.id];
         return (
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
             {/* Group photo */}
             <Image
               source={{ uri: group.photo }}
               style={{
                 width: 60,
                 height: 60,
                 borderRadius: 30,
                 marginRight: 15,
               }}
             />


             {/* Group info */}
             <View style={{ flex: 1 }}>
               <Text style={{ fontSize: 20, fontWeight: "600", color: COLORS.textPrimary, marginBottom: 4 }}>
                 {group.name}
               </Text>
               <Text style={{ fontSize: 14, color: COLORS.textSecondary, marginBottom: 8 }}>
                 {group.description}
               </Text>


               <TouchableOpacity
                 onPress={() => toggleJoin(group.id)}
                 style={{
                   backgroundColor: isJoined ? COLORS.joined : COLORS.primary,
                   paddingVertical: 10,
                   borderRadius: 12,
                   alignItems: "center",
                   width: 100,
                 }}
               >
                 <Text style={{ color: COLORS.textPrimary, fontWeight: "600", fontSize: 16 }}>
                   {isJoined ? "Joined" : "Join"}
                 </Text>
               </TouchableOpacity>
             </View>
           </View>
         );
       })}


       {/* Skip button */}
       <TouchableOpacity
         onPress={() => router.push("/home")} // navigate to home page
         style=
         {{
           backgroundColor: COLORS.primary,
           paddingVertical: 16,
           borderRadius: 12,
           alignItems: "center",
           marginVertical: 20,
         }}
       >
         <Text style={{ color: COLORS.textPrimary, fontWeight: "600", fontSize: 16 }}>
           Skip
         </Text>
       </TouchableOpacity>
     </ScrollView>
   </SafeAreaView>
 );
}