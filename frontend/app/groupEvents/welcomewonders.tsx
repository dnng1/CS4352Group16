import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, Image, TouchableOpacity, Modal, FlatList, Alert, KeyboardAvoidingView, Platform } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import { joinEvent, leaveEvent, leaveGroup} from "../../utils/eventstorage";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from "expo-image-picker";

const saveEventToStorage = async (event: any) => 
{
  const stored = await AsyncStorage.getItem("events");
  const existing = stored ? JSON.parse(stored) : [];

  //only add if not already saved
  if (!existing.some((e: any) => e.id === event.id)) {
    existing.push({
      id: event.id,
      event: event.title,
      image: event.image || "",
      date: event.date || "",
      time: event.time || "",
      location: event.location || "",
    });

    await AsyncStorage.setItem("events", JSON.stringify(existing));
  }
};

const groupMembers = [
  { id: 1, name: "Angelica Doe", avatar: "https://i.pravatar.cc/150?img=1", online: true },
  { id: 2, name: "Johnathan Patel", avatar: "https://i.pravatar.cc/150?img=2", online: true },
  { id: 3, name: "Mary Sancho", avatar: "https://i.pravatar.cc/150?img=3", online: true },
  { id: 4, name: "Dexter Remirez", avatar: "https://i.pravatar.cc/150?img=4", online: true },
  { id: 5, name: "Joe Brown", avatar: "https://i.pravatar.cc/150?img=5", online: false },
  { id: 6, name: "Michael Lee", avatar: "https://i.pravatar.cc/150?img=6", online: false },
  { id: 7, name: "Lydia Chen", avatar: "https://i.pravatar.cc/150?img=7", online: false },
];

const newEvents = [
  {
    id: 26,
    title: "Welcome Orientation",
    location: "Online",
    time: "4:00 pm - 8:00 pm",
    date: null,
    image: "https://cdn-icons-png.flaticon.com/128/2652/2652673.png",
    peopleGoing: 5,
  },
];

const upcomingEvents = [
  {
    id: 27,
    title: "Get-to-know-you-bingo",
    location: "Online",
    time: "8:00 pm - 9:00 pm",
    date: "Nov 28",
    image: "https://cdn-icons-png.flaticon.com/128/2102/2102170.png",
    isGoing: null,
  },
  {
    id: 28,
    title: "Get together dinner potluck",
    location: "1800 W Testing St, Codebusters, TX",
    time: "7:00 pm - 10:00 pm",
    date: "Today",
    image: "https://cdn-icons-png.flaticon.com/128/272/272186.png",
    isGoing: null,
  },
];

const previousEvents: any[] = [];

const defaultChatMessages: Array<{ id: number; sender: string; message?: string; image?: string; time: string; type: 'text' | 'image' }> = [];

export default function FriendGroupScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const groupName = params.groupName || "Friend Group 1";
  
  const [activeTab, setActiveTab] = useState<'events' | 'chat'>('events');
  const [showMembersModal, setShowMembersModal] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [eventStatuses, setEventStatuses] = useState<Record<number, boolean | null>>({
    26: null,
    27: null,
    28: null,
  });
  const [message, setMessage] = useState('');
  const [chatMessages, setChatMessages] = useState(defaultChatMessages);
  const flatListRef = useRef<FlatList>(null);
  const currentUser = "You";

  const getCurrentTime = () => {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const ampm = hours >= 12 ? 'pm' : 'am';
    const displayHours = hours % 12 || 12;
    return `${displayHours}:${minutes.toString().padStart(2, '0')} ${ampm}`;
  };

  const handleSendMessage = () => {
    if (!message.trim()) return;

    const newMessage = {
      id: Date.now(),
      sender: currentUser,
      message: message.trim(),
      time: getCurrentTime(),
      type: 'text' as const,
    };

    setChatMessages(prev => [...prev, newMessage]);
    setMessage('');
    
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  const handlePickImage = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission needed', 'Please grant camera roll permissions to send images');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        const newMessage = {
          id: Date.now(),
          sender: currentUser,
          image: result.assets[0].uri,
          time: getCurrentTime(),
          type: 'image' as const,
        };

        setChatMessages(prev => [...prev, newMessage]);
        
        setTimeout(() => {
          flatListRef.current?.scrollToEnd({ animated: true });
        }, 100);
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to pick image');
    }
  };

  const handleTakePhoto = async () => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission needed', 'Please grant camera permissions to take photos');
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        const newMessage = {
          id: Date.now(),
          sender: currentUser,
          image: result.assets[0].uri,
          time: getCurrentTime(),
          type: 'image' as const,
        };

        setChatMessages(prev => [...prev, newMessage]);
        
        setTimeout(() => {
          flatListRef.current?.scrollToEnd({ animated: true });
        }, 100);
      }
    } catch (error) {
      console.error('Error taking photo:', error);
      Alert.alert('Error', 'Failed to take photo');
    }
  };

  const handleEventResponse = async (eventId: number, isGoing: boolean, eventObj: any) => {
    setEventStatuses(prev => ({
      ...prev,
      [eventId]: isGoing,
    }));

    if(isGoing)
    {
        await saveEventToStorage(eventObj);
        await joinEvent(eventId);
    }
    else
    {
      await leaveEvent(eventId);
    }
  };

  const renderEventCard = (event: any, isPrevious: boolean = false) => {
    if (!event || !event.id) return null;
    
    const isUpcoming = !isPrevious && event.isGoing !== undefined;
    const isGoing = eventStatuses[event.id] ?? event.isGoing;

    return (
      <View style={[styles.eventCard, isPrevious && styles.previousEventCard]}>
        {event.image && event.image.trim() ? (
          <Image source={{ uri: event.image }} style={styles.eventImage} />
        ) : (
          <View style={styles.eventImage} />
        )}
        <View style={styles.eventDetails}>
          <Text style={[styles.eventTitle, isPrevious && styles.previousEventText]}>{event.title}</Text>
          <Text style={[styles.eventInfo, isPrevious && styles.previousEventText]}>{event.location}</Text>
          {event.date ? (
            <Text style={[styles.eventInfo, isPrevious && styles.previousEventText]}>
              {event.date} {event.time}
            </Text>
          ) : (
            <Text style={[styles.eventInfo, isPrevious && styles.previousEventText]}>{event.time}</Text>
          )}
          {event.peopleGoing && (
            <Text style={[styles.eventInfo, isPrevious && styles.previousEventText]}>
              {event.peopleGoing} People Going
            </Text>
          )}
          {isUpcoming && (
            <View style={styles.eventActions}>
              <View style = {{alignItems : 'center', marginRight: 8}}>

              <TouchableOpacity
                style={[styles.actionButton, isGoing === false && styles.actionButtonActiveDecline]}
                onPress={() => handleEventResponse(event.id, false, event)}
              >
                <Ionicons 
                  name="close" 
                  size={20} 
                  color={isGoing === false ? "#fff" : "#000"} 
                />
                </TouchableOpacity>
                <Text style = {{ marginTop: 4, fontSize: 12}} >Decline</Text>
                </View>

              
              <View style = {{alignItems : 'center', marginRight: 8}}>
              <TouchableOpacity
                style={[styles.actionButton, isGoing === true && styles.actionButtonActiveAccept]}
                onPress={() => handleEventResponse(event.id, true, event)}
              >
                <Ionicons 
                  name="checkmark" 
                  size={20} 
                  color={isGoing === true ? "#fff" : "#000"} 
                />
              </TouchableOpacity>
                <Text style = {{ marginTop: 4, fontSize: 12}} >Accept</Text>
              </View>
            </View>
          )}
        </View>
      </View>
    );
  };

  const renderEventsTab = () => (
    <ScrollView style={styles.eventsContainer} showsVerticalScrollIndicator={false}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>New Events</Text>
        {newEvents.filter(event => event && event.id).map(event => (
          <View key={event.id}>
            {renderEventCard(event)}
          </View>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Upcoming Events</Text>
        {upcomingEvents.filter(event => event && event.id).map(event => (
          <View key={event.id}>
            {renderEventCard(event)}
          </View>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Previous Events</Text>
        {previousEvents.filter(event => event && event.id).map(event => (
          <View key={event.id}>
            {renderEventCard(event, true)}
          </View>
        ))}
      </View>
    </ScrollView>
  );

  const renderChatTab = () => (
    <FlatList
        ref={flatListRef}
        data={chatMessages}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.chatMessages}
        renderItem={({ item }) => (
          <View style={styles.messageBubble}>
            <Text style={styles.messageSender}>{item.sender}</Text>
            {item.type === 'text' && item.message && (
              <Text style={styles.messageText}>{item.message}</Text>
            )}
            {item.type === 'image' && item.image && (
              <Image source={{ uri: item.image }} style={styles.messageImage} />
            )}
            <Text style={styles.messageTime}>{item.time}</Text>
          </View>
        )}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
      />
  );

  return (
    <SafeAreaView style={styles.container} edges={[]}>
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => router.push("/(tabs)/groups")} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color="#000" />
          <Text style={styles.backButtonText}>Back</Text>
        </TouchableOpacity>
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
      <TouchableOpacity 
        onPress={() => setShowMembersModal(true)}
      >
        <Text style={styles.heading}>{groupName}</Text>
      </TouchableOpacity>

      <View style={styles.toggleBar}>
        <TouchableOpacity
          style={[
            styles.toggleButton,
            { borderTopLeftRadius: 20, borderBottomLeftRadius: 20 },
            activeTab === 'events' && styles.toggleButtonActive
          ]}
          onPress={() => setActiveTab('events')}
        >
          <Text style={[styles.toggleText, activeTab === 'events' && styles.toggleTextActive]}>
            Events
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.toggleButton,
            { borderTopRightRadius: 20, borderBottomRightRadius: 20 },
            activeTab === 'chat' && styles.toggleButtonActive
          ]}
          onPress={() => setActiveTab('chat')}
        >
          <Text style={[styles.toggleText, activeTab === 'chat' && styles.toggleTextActive]}>
            Chat
          </Text>
        </TouchableOpacity>
      </View>

      {activeTab === 'events' ? (
        <View style={styles.whiteCard}>
          {renderEventsTab()}
        </View>
      ) : (
        <KeyboardAvoidingView 
          style={styles.chatWrapper}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
        >
          <LinearGradient
            colors={['#E6F4FE', '#E8E0F7']}
            style={styles.chatGradient}
          />
          <View style={styles.chatContainer}>
            {renderChatTab()}
          </View>
          
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.messageInput}
              placeholder="Message"
              placeholderTextColor="#999"
              value={message}
              onChangeText={setMessage}
              multiline
              editable={true}
              onSubmitEditing={handleSendMessage}
            />
            <View style={styles.inputIcons} pointerEvents="box-none">
              <TouchableOpacity 
                style={[styles.inputIcon, { marginLeft: 0 }]}
                onPress={handlePickImage}
                activeOpacity={0.7}
              >
                <Ionicons name="image" size={24} color="#007AFF" />
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.inputIcon}
                onPress={handleTakePhoto}
                activeOpacity={0.7}
              >
                <Ionicons name="camera" size={24} color="#007AFF" />
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.sendButton}
                onPress={handleSendMessage}
                activeOpacity={0.7}
              >
                <Ionicons name="send" size={16} color="#fff" />
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      )}

      <Modal
        visible={showMembersModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowMembersModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Group Members</Text>
              <TouchableOpacity onPress={() => setShowMembersModal(false)}>
                <Ionicons name="close" size={24} color="#000" />
              </TouchableOpacity>
            </View>
            <FlatList
              data={groupMembers}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <View style={styles.memberItem}>
                  <Image source={{ uri: item.avatar }} style={styles.memberAvatar} />
                  <Text style={styles.memberName}>{item.name}</Text>
                  {item.online && (
                    <View style={styles.onlineIndicator} />
                  )}
                </View>
              )}
            />
            <TouchableOpacity 
              style={styles.leaveButton}
              onPress={async () => {
                await leaveGroup(groupName as string);
                setShowMembersModal(false);
                router.replace("/(tabs)/groups");
              }}
            >
              <Text style={styles.leaveButtonText}>Leave Group</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Bottom Navigation Bar */}
      <View style={styles.bottomNav}>
        <TouchableOpacity 
          style={styles.navItem}
          onPress={() => router.push("/(tabs)/home")}
        >
          <Ionicons name="home-outline" size={24} color="#000" />
          <Text style={styles.navLabel}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.navItem}
          onPress={() => router.push("/(tabs)/groups")}
        >
          <Ionicons name="people-outline" size={24} color="#000" />
          <Text style={styles.navLabel}>Groups</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.navItem}
          onPress={() => router.push("/(tabs)/createevent")}
        >
          <Ionicons name="add" size={24} color="#000" />
          <Text style={styles.navLabel}>Create Event</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 20,
    paddingBottom: 80,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 10,
  },
  backButtonText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#000",
    marginLeft: 4,
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
  toggleBar: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    marginHorizontal: 0,
    marginTop: 20,
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
    backgroundColor: '#7CA7D9',
  },
  toggleText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  toggleTextActive: {
    color: '#fff',
  },
  whiteCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    marginHorizontal: 0,
    marginTop: 0,
    marginBottom: 0,
    borderRadius: 0,
    padding: 16,
  },
  eventsContainer: {
    flex: 1,
  },
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
    color: '#000',
  },
  eventCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E5E5',
    marginBottom: 12,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  previousEventCard: {
    opacity: 0.5,
  },
  eventImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 12,
  },
  eventDetails: {
    flex: 1,
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
    color: '#000',
  },
  eventInfo: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  previousEventText: {
    opacity: 0.6,
  },
  eventActions: {
    flexDirection: 'row',
    marginTop: 8,
    flexWrap: "nowrap"
  },
  actionButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E5E5E5',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  actionButtonActiveDecline: {
    backgroundColor: '#fe6966ff',
    borderColor: '#fe6966ff',
  },
  actionButtonActiveAccept: {
    backgroundColor: '#7fff81ff',
    borderColor: '#7fff81ff',
  },
  chatWrapper: {
    flex: 1,
    position: 'relative',
  },
  chatGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  chatContainer: {
    flex: 1,
    zIndex: 1,
  },
  chatMessages: {
    padding: 16,
    paddingTop: 8,
    paddingBottom: 16,
  },
  messageBubble: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  messageSender: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
    color: '#000',
  },
  messageText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 4,
  },
  messageTime: {
    fontSize: 12,
    color: '#999',
  },
  inputContainer: {
    backgroundColor: '#fff',
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginHorizontal: 12,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
    zIndex: 100,
  },
  messageInput: {
    flex: 1,
    fontSize: 16,
    color: '#000',
    maxHeight: 100,
    pointerEvents: 'auto',
  },
  inputIcons: {
    flexDirection: 'row',
    marginLeft: 8,
  },
  inputIcon: {
    padding: 4,
    marginLeft: 12,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#000',
  },
  memberItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  leaveButton: {
    backgroundColor: '#FF3B30',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 20,
    marginTop: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  leaveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  memberAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  memberName: {
    flex: 1,
    fontSize: 16,
    color: '#000',
  },
  onlineIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#4CAF50',
    borderWidth: 2,
    borderColor: '#fff',
  },
  bottomNav: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#E5E5E5',
    paddingVertical: 10,
    paddingBottom: 20,
    justifyContent: 'space-around',
    alignItems: 'center',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  navItem: {
    alignItems: 'center',
    flex: 1,
  },
  navLabel: {
    fontSize: 12,
    marginTop: 4,
    color: '#000',
  },
  usersSection: {
    marginBottom: 12,
    paddingBottom: 12,
    paddingHorizontal: 16,
    paddingTop: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  usersGroup: {
    marginBottom: 12,
  },
  usersLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    color: '#000',
  },
  avatarsContainer: {
    flexDirection: 'row',
  },
  userAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#fff',
    marginRight: 8,
  },
  messageImage: {
    width: 200,
    height: 200,
    borderRadius: 12,
    marginVertical: 8,
  },
  sendButton: {
    backgroundColor: '#007AFF',
    borderRadius: 16,
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
});

