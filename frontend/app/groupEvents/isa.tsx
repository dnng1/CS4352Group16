import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, Image, TouchableOpacity, Modal, FlatList, Alert } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import { joinEvent, leaveEvent} from "../../utils/eventstorage";
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
  { id: 1, name: "John Doe", avatar: "https://i.pravatar.cc/150?img=1", online: true },
  { id: 2, name: "Riya Patel", avatar: "https://i.pravatar.cc/150?img=2", online: true },
  { id: 3, name: "Juan Sancho", avatar: "https://i.pravatar.cc/150?img=3", online: true },
  { id: 4, name: "Rose Remirez", avatar: "https://i.pravatar.cc/150?img=4", online: true },
  { id: 5, name: "Emily Brown", avatar: "https://i.pravatar.cc/150?img=5", online: false },
  { id: 6, name: "David Lee", avatar: "https://i.pravatar.cc/150?img=6", online: false },
  { id: 7, name: "Lisa Chen", avatar: "https://i.pravatar.cc/150?img=7", online: false },
  { id: 8, name: "Ibrahim Ali", avatar: "https://i.pravatar.cc/150?img=7", online: false },
  { id: 9, name: "Pritham Arora", avatar: "https://i.pravatar.cc/150?img=5", online: false },
  { id: 10, name: "Lisa Nguyen", avatar: "https://i.pravatar.cc/150?img=6", online: false },
  { id: 11, name: "Hannah Ramirez", avatar: "https://i.pravatar.cc/150?img=7", online: false },
  { id: 12, name: "Joesph John", avatar: "https://i.pravatar.cc/150?img=7", online: false },  
];

const newEvents = [
  {
    id: 12,
    title: "Career Insights",
    location: "Online",
    time: "4:00 pm - 8:00 pm",
    date: "Dec 12",
    image: "https://cdn-icons-png.flaticon.com/128/12343/12343398.png",
    peopleGoing: 10,
  },
];

const upcomingEvents = [
  {
    id: 13,
    title: "Career Insights",
    location: "Online",
    time: "4:00 pm - 8:00 pm",
    date: "Dec 12",
    image: "https://cdn-icons-png.flaticon.com/128/12343/12343398.png",
    isGoing: null,
  },
  {
    id: 14,
    title: "Group Study Session",
    location: "ABC 123 S Univ Rd, Fantasy World, JA",
    time: "9:00 am - 12:00 pm",
    date: "Today",
    image: "https://cdn-icons-png.flaticon.com/128/6747/6747157.png",
    isGoing: null,
  },
];

const previousEvents = [
  {
    id: 15,
    title: "Group Study Session",
    location: "ABC 123 S Univ Rd, Fantasy World, JA",
    time: "9:00 am - 12:00 pm",
    date: "Sept 17",
    image: "https://cdn-icons-png.flaticon.com/128/6747/6747157.png",
  },
  {
    id: 16,
    title: "Network with professionals",
    location: "ABC 123 S Univ Rd, Fantasy World, JA",
    time: "12:00 pm - 2:00 pm",
    date: "Sept 23",
    image: "https://cdn-icons-png.flaticon.com/128/1239/1239719.png",
  },
  {
    id: 17,
    title: "Find a friend",
    location: "Online",
    time: "8:00 am - 9:00 am",
    date: "Oct 15",
    image: "https://plus.unsplash.com/premium_photo-1661369931884-0706c99d88b3?w=1000&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8ZmluZCUyMGElMjBmcmllbmR8ZW58MHx8MHx8fDA%3D",
  },
];

const defaultChatMessages: Array<{ id: number; sender: string; message?: string; image?: string; time: string; type: 'text' | 'image' }> = [
  { id: 1, sender: "John Doe", message: "hey yall, i just moved a month ago and am looking for grad school opportunities. do yall know any good resrouces? ", time: "1:21 AM", type: 'text' },
  { id: 2, sender: "Riya Patel", message: "come to the career insights event", time: "1:32 AM", type: 'text' },
  { id: 3, sender: "Juan Sancho", message: "wait wait ill join too", time: "9:35 AM", type: 'text' },
  { id: 4, sender: "Lisa Chen", message: "you can network with a lot of ppl", time: "8:40 pm", type: 'text' },
];

export default function FriendGroupScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const groupName = params.groupName || "Friend Group 1";
  
  const [activeTab, setActiveTab] = useState<'events' | 'chat'>('events');
  const [showMembersModal, setShowMembersModal] = useState(false);
  const [eventStatuses, setEventStatuses] = useState<Record<number, boolean | null>>({
    12: null,
    13: null,
    14: null
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
        </View>
        {isUpcoming && (
          <View style={styles.eventActions}>
            <TouchableOpacity
              style={[styles.actionButton, isGoing === false && styles.actionButtonActive, { marginRight: 8 }]}
              onPress={() => handleEventResponse(event.id, false, event)}
            >
              <Ionicons 
                name="close" 
                size={20} 
                color={isGoing === false ? "#fff" : "#000"} 
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.actionButton, isGoing === true && styles.actionButtonActive]}
              onPress={() => handleEventResponse(event.id, true, event)}
            >
              <Ionicons 
                name="checkmark" 
                size={20} 
                color={isGoing === true ? "#fff" : "#000"} 
              />
            </TouchableOpacity>
          </View>
        )}
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
    <View style={styles.chatContainer}>
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
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={[]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color="#000" />
          <Text style={styles.backButtonText}>Back</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.titleContainer}
          onPress={() => setShowMembersModal(true)}
        >
          <Text style={styles.headerTitle}>{groupName}</Text>
          <Ionicons name="chevron-down" size={20} color="#000" style={styles.chevron} />
        </TouchableOpacity>
        <View style={styles.placeholder} />
      </View>

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
        <View style={styles.chatWrapper}>
          <LinearGradient
            colors={['#E6F4FE', '#E8E0F7']}
            style={styles.chatGradient}
          />
          {renderChatTab()}
          
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
              {message.trim() && (
                <TouchableOpacity 
                  style={styles.sendButton}
                  onPress={handleSendMessage}
                  activeOpacity={0.7}
                >
                  <Ionicons name="send" size={20} color="#fff" />
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>
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
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 8,
  },
  backButtonText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#000",
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    fontStyle: 'italic',
    color: '#000',
    padding: 10
  },
  chevron: {
    marginLeft: 8,
  },
  placeholder: {
    width: 40,
  },
  toggleBar: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginTop: -20,
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
    backgroundColor: '#007AFF',
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
    alignItems: 'center',
    justifyContent: 'center',
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
  actionButtonActive: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
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
    pointerEvents: 'box-none',
  },
  chatMessages: {
    padding: 16,
    paddingTop: 8,
    paddingBottom: 80,
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
    position: 'absolute',
    bottom: 16,
    left: 12,
    right: 12,
    backgroundColor: '#fff',
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
    zIndex: 100,
    pointerEvents: 'box-none',
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
    borderRadius: 20,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
});

