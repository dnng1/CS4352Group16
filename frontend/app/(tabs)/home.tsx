import React, { useMemo, useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, Image, TouchableOpacity } from "react-native";
import { useRouter, useFocusEffect } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getJoinedEventIds } from "../../utils/eventstorage";
import { resetStorage } from '@/utils/appStartup';

useEffect(() => 
{
  resetStorage();
}, []);

const defaultEvents = [
    { event: "Musical Boat Party", image: "https://m.media-amazon.com/images/I/81s4Yq0JJWL._AC_UF350,350_QL80_.jpg", date: "December 1st", time: "2:00 pm", location: "1234 Sesame St. ", id: 1 },
    { event: "Cornhole Toss", image: "https://www.cornholeworldwide.com/wp-content/uploads/2020/07/shutterstock_717048238.jpg", date: "December 2nd", time: "9:00 am", location: "456 Boat Port ", id: 2 },
    { event: "Friendsgiving Party", image:"https://www.mashed.com/img/gallery/52-thanksgiving-dishes-to-make-you-the-star-of-friendsgiving/intro-1637165015.jpg", date: "November 25th", time: "4:00 pm", location: "1234 ABC St. ", id: 3 }
  ];

const formatTime = (time: string) => {
  if (!time) return "";
  const [hours, minutes] = time.split(":");
  const hour = parseInt(hours);
  const ampm = hour >= 12 ? "PM" : "AM";
  const displayHour = hour % 12 || 12;
  return `${displayHour}:${minutes} ${ampm}`;
};

const formatDateRange = (event: any) => {
  if (event.startDate && event.endDate) {
    const startDateObj = new Date(event.startDate);
    const endDateObj = new Date(event.endDate);
    const formattedStartDate = startDateObj.toLocaleDateString('en-US', { 
      month: 'long', 
      day: 'numeric',
      year: 'numeric'
    });
    const formattedEndDate = endDateObj.toLocaleDateString('en-US', { 
      month: 'long', 
      day: 'numeric',
      year: 'numeric'
    });
    return formattedStartDate === formattedEndDate 
      ? formattedStartDate 
      : `${formattedStartDate} - ${formattedEndDate}`;
  }
  
  return event.date || "";
};

const formatTimeRange = (event: any) => {
  if (event.startTime && event.endTime) {
    const formattedStartTime = formatTime(event.startTime);
    const formattedEndTime = formatTime(event.endTime);
    return formattedStartTime === formattedEndTime
      ? formattedStartTime
      : `${formattedStartTime} - ${formattedEndTime}`;
  }
  
  return event.time || "";
};



export default function Dashboard() {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const [events, setEvents] = useState(defaultEvents);
  const [joinedEventIds, setJoinedEventIds] = useState<number[]>([]);

  const searchFilter = useMemo(() => {
    if (!search.trim()) {
      return events;
    }
    const searched = search.toUpperCase();
    return events.filter(eventlist => {
      const eventName = (eventlist.event || '').toUpperCase();
      const location = (eventlist.location || '').toUpperCase();
      const date = formatDateRange(eventlist).toUpperCase();
      const time = formatTimeRange(eventlist).toUpperCase();
      
      return eventName.includes(searched) || 
             location.includes(searched) || 
             date.includes(searched) ||
             time.includes(searched);
    }); 
  }, [search, events])
  // Load events from AsyncStorage when screen is focused
  useFocusEffect(
    React.useCallback(() => {
      const loadEvents = async () => {
        try {
          const storedEvents = await AsyncStorage.getItem('events');
          if (storedEvents) {
            const parsedEvents = JSON.parse(storedEvents);
            setEvents(parsedEvents);
          } else {
            // Initialize with default events if no stored events
            await AsyncStorage.setItem('events', JSON.stringify(defaultEvents));
            setEvents(defaultEvents);
          }
        } catch (error) {
          console.error('Error loading events:', error);
          setEvents(defaultEvents);
        }
      };
      const loadJoinedEvents = async () =>
      {
        const ids = await getJoinedEventIds(); 
        //console.log("Loaded joined event ids: ", ids);
        setJoinedEventIds(ids);
      };
      loadEvents();
      loadJoinedEvents(); //loads which events the user joined
    }, [])
  );
  return (
    <View style={styles.container}>
      <ScrollView>
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
                onPress={() => { setMenuOpen(false); 
                router.replace('/welcome'); }}
              >
                <Text style={styles.menuText}>Sign out</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
      <Text style={styles.heading}>Home</Text>
      <TextInput style={styles.searchBar} placeholder="Search" value={search} onChangeText={setSearch}/>
      <Text style={styles.subheading}>My Upcoming Events</Text>
      {/* Always show default events */}
      {defaultEvents
        .filter(ev => {
          // Apply search filter to default events
          if (!search.trim()) return true;
          const searched = search.toUpperCase();
          const eventName = (ev.event || '').toUpperCase();
          const location = (ev.location || '').toUpperCase();
          const date = formatDateRange(ev).toUpperCase();
          const time = formatTimeRange(ev).toUpperCase();
          
          return eventName.includes(searched) || 
                 location.includes(searched) || 
                 date.includes(searched) ||
                 time.includes(searched);
        })
        .map(ev => (
          <View key= {ev.id} style={styles.card}>
            <Image source ={{ uri: ev.image }} style={styles.image} />
            <Text style={styles.eventName}>{ev.event}</Text>
            <Text style={styles.eventDetails}>{formatTimeRange(ev)}</Text>
            <Text style={styles.eventDetails}>{formatDateRange(ev)}</Text>
            <Text style={[styles.eventDetails, {marginBottom: 10}]}>{ev.location}</Text>
          </View>
        ))
      }
      {/* Show joined events from storage */}
      {searchFilter
        .filter(ev => joinedEventIds.includes(ev.id)) //only show joined
        .map(ev => (
          <View key= {ev.id} style={styles.card}>
            <Image source ={{ uri: ev.image }} style={styles.image} />
            <Text style={styles.eventName}>{ev.event}</Text>
            <Text style={styles.eventDetails}>{formatTimeRange(ev)}</Text>
            <Text style={styles.eventDetails}>{formatDateRange(ev)}</Text>
            <Text style={[styles.eventDetails, {marginBottom: 10}]}>{ev.location}</Text>
          </View>
        ))
      }
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
