import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, Image, TouchableOpacity, Modal, FlatList } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import { joinEvent, leaveEvent} from "../utils/eventstorage";

const groupMembers = [
  { id: 1, name: "John Doe", avatar: "https://i.pravatar.cc/150?img=1", online: true },
  { id: 2, name: "Jane Smith", avatar: "https://i.pravatar.cc/150?img=2", online: true },
  { id: 3, name: "Mike Johnson", avatar: "https://i.pravatar.cc/150?img=3", online: true },
  { id: 4, name: "Sarah Williams", avatar: "https://i.pravatar.cc/150?img=4", online: true },
  { id: 5, name: "Emily Brown", avatar: "https://i.pravatar.cc/150?img=5", online: false },
  { id: 6, name: "David Lee", avatar: "https://i.pravatar.cc/150?img=6", online: false },
  { id: 7, name: "Lisa Chen", avatar: "https://i.pravatar.cc/150?img=7", online: false },
];

const newEvents = [
  {
    id: 4,
    title: "Park Visit",
    location: "1234 Address St, City, State",
    time: "4:00 pm - 8:00 pm",
    date: null,
    image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400",
    peopleGoing: 3,
  },
];

const upcomingEvents = [
  {
    id: 5,
    title: "Park Visit",
    location: "1234 Address St, City, State",
    time: "4:00 pm - 8:00 pm",
    date: "Oct 20",
    image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400",
    isGoing: null,
  },
  {
    id: 6,
    title: "Study Group",
    location: "Online",
    time: "12:00 pm - 2:00 pm",
    date: "Today",
    image: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=400",
    isGoing: null,
  },
];

const previousEvents = [
  {
    id: 7,
    title: "Study Group",
    location: "Online",
    time: "12:00 pm - 2:00 pm",
    date: "Oct 15",
    image: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=400",
  },
];

const chatMessages = [
  { id: 1, sender: "John Doe", message: "Hey everyone! Who's up for a park visit this weekend?", time: "10:30 AM" },
  { id: 2, sender: "Jane Smith", message: "I'm in! 🎉", time: "10:32 AM" },
  { id: 3, sender: "Mike Johnson", message: "Sounds great! What time?", time: "10:35 AM" },
  { id: 4, sender: "Sarah Williams", message: "4pm works for me!", time: "10:40 AM" },
];

export default function FriendGroupScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const groupName = params.groupName || "Friend Group 1";
  
  const [activeTab, setActiveTab] = useState<'events' | 'chat'>('events');
  const [showMembersModal, setShowMembersModal] = useState(false);
  const [eventStatuses, setEventStatuses] = useState<Record<number, boolean | null>>({
    5: null,
    6: null,
  });
  const [message, setMessage] = useState('');

  const handleEventResponse = async (eventId: number, isGoing: boolean) => {
    setEventStatuses(prev => ({
      ...prev,
      [eventId]: isGoing,
    }));

    if(isGoing)
    {
        await joinEvent(eventId);
    }
    else
    {
      await leaveEvent(eventId);
    }
  };

  const renderEventCard = (event: any, isPrevious: boolean = false) => {
    const isUpcoming = !isPrevious && event.isGoing !== undefined;
    const isGoing = eventStatuses[event.id] ?? event.isGoing;

    return (
      <View key={event.id} style={[styles.eventCard, isPrevious && styles.previousEventCard]}>
        <Image source={{ uri: event.image }} style={styles.eventImage} />
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
              <TouchableOpacity
                style={[styles.actionButton, isGoing === false && styles.actionButtonActive, { marginRight: 8 }]}
                onPress={() => handleEventResponse(event.id, false)}
              >
                <Ionicons 
                  name="close" 
                  size={20} 
                  color={isGoing === false ? "#fff" : "#000"} 
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.actionButton, isGoing === true && styles.actionButtonActive]}
                onPress={() => handleEventResponse(event.id, true)}
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
      </View>
    );
  };

  const renderEventsTab = () => (
    <ScrollView style={styles.eventsContainer} showsVerticalScrollIndicator={false}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>New Events</Text>
        {newEvents.map(event => renderEventCard(event))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Upcoming Events</Text>
        {upcomingEvents.map(event => renderEventCard(event))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Previous Events</Text>
        {previousEvents.map(event => renderEventCard(event, true))}
      </View>
    </ScrollView>
  );

  const renderChatTab = () => (
    <View style={styles.chatContainer}>
      <FlatList
        data={chatMessages}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.chatMessages}
        renderItem={({ item }) => (
          <View style={styles.messageBubble}>
            <Text style={styles.messageSender}>{item.sender}</Text>
            <Text style={styles.messageText}>{item.message}</Text>
            <Text style={styles.messageTime}>{item.time}</Text>
          </View>
        )}
      />
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={[]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color="#000" />
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
            />
            <View style={styles.inputIcons}>
              <TouchableOpacity style={[styles.inputIcon, { marginLeft: 0 }]}>
                <Ionicons name="mic" size={24} color="#007AFF" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.inputIcon}>
                <Ionicons name="image" size={24} color="#007AFF" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.inputIcon}>
                <Ionicons name="camera" size={24} color="#007AFF" />
              </TouchableOpacity>
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
    backgroundColor: '#E6F4FE',
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
    padding: 8,
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
    backgroundColor: '#E6F4FE',
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
  },
  messageInput: {
    flex: 1,
    fontSize: 16,
    color: '#000',
    maxHeight: 100,
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
});

