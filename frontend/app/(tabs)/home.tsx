import React, { useMemo, useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, Image, TouchableOpacity, Modal, Animated, Dimensions } from "react-native";
import { useRouter, useFocusEffect } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { getJoinedEventIds } from "../../utils/eventstorage";
import Tooltip from "../../components/Tooltip";
import { hasCompletedOnboarding, completeOnboarding } from "../../utils/onboarding";
import GlowWrapper from "../../components/GlowWrapper";
import EditEventModal from "../../components/EditEventModal";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const defaultEvents = [
  { event: "Musical Boat Party", image: "https://m.media-amazon.com/images/I/81s4Yq0JJWL._AC_UF350,350_QL80_.jpg", date: "December 12th", startTime: "14:00", endTime: "19:00", location: "1234 Sesame St. ", id: 1, group: "Welcome Wonders", description: "Boat Party with music, food, games, and fun!" },
  { event: "Cornhole Toss", image: "https://www.cornholeworldwide.com/wp-content/uploads/2020/07/shutterstock_717048238.jpg", date: "December 15th", startTime: "09:00", endTime: "12:00", location: "456 Boat Port ", id: 2, group: "Welcome Wonders", description: "Grab a friend and toss some bags into the cornhole!" },
  { event: "Friendsgiving Party", image: "https://www.mashed.com/img/gallery/52-thanksgiving-dishes-to-make-you-the-star-of-friendsgiving/intro-1637165015.jpg", date: "December 10th", startTime: "16:00", endTime: "18:00", location: "1234 ABC St. ", id: 3, group: "Welcome Wonders", description: "This is a party with food and games." }
];

// Group event IDs (from eventstorage.ts)
const groupEventIds = [4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 22, 23, 24, 25, 26, 27, 28];
const defaultEventIds = [1, 2, 3];

// Check if an event can be edited (only user-created events)
const canEditEvent = (event: any): boolean => {
  // User-created events have isUserCreated flag
  if (event.isUserCreated === true) {
    return true;
  }
  // Default events (IDs 1-3) cannot be edited
  if (defaultEventIds.includes(event.id)) {
    return false;
  }
  // Group events (IDs 4-28) cannot be edited
  if (groupEventIds.includes(event.id)) {
    return false;
  }
  // For backward compatibility: if event ID is a timestamp (very large number), assume it's user-created
  // Timestamps are typically > 1000000000000 (year 2001+)
  if (typeof event.id === 'number' && event.id > 1000000000000) {
    return true;
  }
  // Otherwise, don't allow editing
  return false;
};

const formatTime = (time: string) => {
  if (!time) return "";
  if (time.toLowerCase().includes("am") || time.toLowerCase().includes("pm")) {
    return time.replace(/\s*(am|pm)/i, " $1").toUpperCase();
  }
  const [hours, minutes] = time.split(":");
  const hour = parseInt(hours);
  const ampm = hour >= 12 ? "PM" : "AM";
  const displayHour = hour % 12 || 12;
  return `${displayHour}:${minutes} ${ampm}`;
};

const parseDateOnly = (value: string) => {
  const [y, m, d] = value.split("-").map(Number);
  return new Date(y, (m || 1) - 1, d || 1);
};

const formatDateRange = (event: any) => {
  if (event.startDate && event.endDate) {
    const startDateObj = parseDateOnly(event.startDate);
    const endDateObj = parseDateOnly(event.endDate);
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

const sortEvents = (events: any[]) => {
  const parseDate = (e: any) => {
    if (e.startDate) return new Date(e.startDate).getTime();
    if (e.date) {
      const months = ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december'];
      const match = e.date.toLowerCase().match(/(\w+)\s+(\d+)/);
      if (match) {
        const month = months.indexOf(match[1]);
        const day = parseInt(match[2]);
        const year = new Date().getFullYear();
        return new Date(year, month, day).getTime();
      }
    }
    return 0;
  };

  const getTimeValue = (e: any) => {
    if (e.startTime) {
      const [h, m] = e.startTime.split(':').map(Number);
      return h * 60 + m;
    }
    if (e.time) {
      const match = e.time.match(/(\d+):(\d+)\s*(am|pm)/i);
      if (match) {
        let h = parseInt(match[1]);
        const m = parseInt(match[2]);
        if (match[3].toLowerCase() === 'pm' && h !== 12) h += 12;
        if (match[3].toLowerCase() === 'am' && h === 12) h = 0;
        return h * 60 + m;
      }
    }
    return 0;
  };

  return [...events].sort((a, b) => {
    const dateA = parseDate(a);
    const dateB = parseDate(b);
    if (dateA !== dateB) return dateA - dateB;
    return getTimeValue(a) - getTimeValue(b);
  });
};



const COLORS = {
  primary: "#7CA7D9",
  border: "#003366",
  textPrimary: "#000000",
  textSecondary: "#444444",
  background: "#FFFFFF",
};

export default function Dashboard() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [search, setSearch] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const [events, setEvents] = useState(defaultEvents);
  const [joinedEventIds, setJoinedEventIds] = useState<number[]>([]);
  const [removedEventIds, setRemovedEventIds] = useState<number[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [eventToRemove, setEventToRemove] = useState<number | null>(null);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [eventToEdit, setEventToEdit] = useState<any>(null);
  
  const [onboardingActive, setOnboardingActive] = useState(false);
  const [onboardingStep, setOnboardingStep] = useState(0);
  const [tooltipPosition, setTooltipPosition] = useState<{ x: number; y: number; width: number; height: number } | null>(null);
  const searchBarRef = useRef<View>(null);
  const eventCardRef = useRef<View>(null);
  const profileRef = useRef<View>(null);
  const createEventRef = useRef<View>(null);
  const groupsRef = useRef<View>(null);
  const glowAnim = useRef(new Animated.Value(1)).current;
  
  const onboardingSteps = [
    {
      id: 'welcome',
      title: 'Welcome to InterLink! 👋',
      description: 'Let\'s take a quick tour to help you get started.',
      ref: null,
    },
    {
      id: 'search',
      title: 'Search Events',
      description: 'Use the search bar to find specific events by name, location, date, or time.',
      ref: searchBarRef,
    },
    {
      id: 'events',
      title: 'View Event Details',
      description: 'Tap on any event card to see full details including description, location, and more!',
      ref: eventCardRef,
    },
    {
      id: 'profile',
      title: 'Your Profile',
      description: 'Tap your profile icon to access settings and sign out.',
      ref: profileRef,
    },
    {
      id: 'createEvent',
      title: 'Create Event',
      description: 'Tap on the Create Event Button to create a new event for a group.',
      ref: createEventRef,
    },
    {
      id: 'groups',
      title: 'Groups',
      description: 'Tap the Groups button to join groups and view the groups you are part of.',
      ref: groupsRef,
    },
  ];

  const allEvents = useMemo(() => {
    const combined = [...events, ...defaultEvents];
    const unique = combined.filter((e, i, arr) => arr.findIndex(ev => ev.id === e.id) === i);
    return sortEvents(unique.filter(ev => !removedEventIds.includes(ev.id)));
  }, [events, removedEventIds]);

  const searchFilter = useMemo(() => {
    const filtered = !search.trim() ? allEvents : allEvents.filter(eventlist => {
      const searched = search.toUpperCase();
      const eventName = (eventlist.event || '').toUpperCase();
      const location = (eventlist.location || '').toUpperCase();
      const date = formatDateRange(eventlist).toUpperCase();
      const time = formatTimeRange(eventlist).toUpperCase();
      return eventName.includes(searched) || location.includes(searched) || date.includes(searched) || time.includes(searched);
    });
    return sortEvents(filtered);
  }, [search, allEvents])

  const filteredEvents = searchFilter.filter(
    ev =>
      defaultEvents.some(de => de.id === ev.id) ||
      joinedEventIds.includes(ev.id)
  );
  useFocusEffect(
    React.useCallback(() => {
      const loadEvents = async () => {
        try {
          const storedEvents = await AsyncStorage.getItem('events');
          if (storedEvents) {
            const parsedEvents = JSON.parse(storedEvents);
            setEvents(parsedEvents);
          } else {
            await AsyncStorage.setItem('events', JSON.stringify(defaultEvents));
            setEvents(defaultEvents);
          }
          
          const storedRemoved = await AsyncStorage.getItem('removedEventIds');
          if (storedRemoved) {
            setRemovedEventIds(JSON.parse(storedRemoved));
          }
        } catch (error) {
          console.error('Error loading events:', error);
          setEvents(defaultEvents);
        }
      };
      const loadJoinedEvents = async () => {
        const ids = await getJoinedEventIds();
        setJoinedEventIds(ids);
      };
      const checkOnboarding = async () => {
        const completed = await hasCompletedOnboarding();
        if (!completed) {
          setTimeout(() => {
            setOnboardingActive(true);
            setOnboardingStep(0);
          }, 500);
        }
      };
      loadEvents();
      loadJoinedEvents();
      checkOnboarding();
    }, [])
  );

  useEffect(() => {
    if (onboardingActive) {
      if (onboardingStep === 0) {
        setTooltipPosition({ x: 0, y: 0, width: 0, height: 0 });
      } else {
        const step = onboardingSteps[onboardingStep];
        if (step.ref?.current) {
          setTimeout(() => {
            step.ref.current?.measure((x, y, width, height, pageX, pageY) => {
              setTooltipPosition({ x: pageX, y: pageY, width, height });
            });
          }, 100);
        } else if (step.id === 'createEvent' || step.id === 'groups') {
          const squareSize = 60; 
          const squareY = SCREEN_HEIGHT - squareSize + 5;
          
          if (step.id === 'createEvent') {
            const buttonCenterX = (5 * SCREEN_WIDTH) / 6;
            const squareX = buttonCenterX - squareSize / 2;
            setTooltipPosition({ 
              x: squareX, 
              y: squareY, 
              width: squareSize, 
              height: squareSize 
            });
          } else if (step.id === 'groups') {
            const buttonCenterX = SCREEN_WIDTH / 2;
            const squareX = buttonCenterX - squareSize / 2;
            setTooltipPosition({ 
              x: squareX, 
              y: squareY, 
              width: squareSize, 
              height: squareSize 
            });
          }
        }
      }
      
      if (onboardingStep > 0) {
        Animated.loop(
          Animated.sequence([
            Animated.timing(glowAnim, {
              toValue: 1.3,
              duration: 1000,
              useNativeDriver: false,
            }),
            Animated.timing(glowAnim, {
              toValue: 1,
              duration: 1000,
              useNativeDriver: false,
            }),
          ])
        ).start();
      } else {
        glowAnim.setValue(1);
      }
    } else {
      glowAnim.setValue(1);
    }
  }, [onboardingActive, onboardingStep]);

  const handleNextOnboarding = () => {
    if (onboardingStep < onboardingSteps.length - 1) {
      setOnboardingStep(onboardingStep + 1);
    } else {
      completeOnboarding();
      setOnboardingActive(false);
    }
  };

  const handleSkipOnboarding = () => {
    completeOnboarding();
    setOnboardingActive(false);
  };

  const handleStartOnboarding = () => {
    setOnboardingActive(true);
    setOnboardingStep(0);
  };

  const handleRemoveEvent = async (eventId: number) => {
    try {
      const isDefaultEvent = defaultEvents.some(de => de.id === eventId);
      
      if (isDefaultEvent) {
        const updatedRemoved = [...removedEventIds, eventId];
        setRemovedEventIds(updatedRemoved);
        await AsyncStorage.setItem('removedEventIds', JSON.stringify(updatedRemoved));
      } else {
        const updatedEvents = events.filter(ev => ev.id !== eventId);
        setEvents(updatedEvents);
        await AsyncStorage.setItem('events', JSON.stringify(updatedEvents));
      }
    } catch (error) {
      console.error('Error removing event:', error);
    }
  };

  const handleConfirmRemove = () => {
    if (eventToRemove !== null) {
      handleRemoveEvent(eventToRemove);
    }
    setConfirmVisible(false);
    setEventToRemove(null);
  };

  const handleCancelRemove = () => {
    setConfirmVisible(false);
    setEventToRemove(null);
  };

  const handleEditSave = async () => {
    try {
      const storedEvents = await AsyncStorage.getItem('events');
      if (storedEvents) {
        const parsedEvents = JSON.parse(storedEvents);
        setEvents(parsedEvents);
      } else {
        setEvents([]);
      }
    } catch (error) {
      console.error('Error reloading events:', error);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView>
      <View style={styles.headerRow}>
        <View style={styles.helpContainer}>
          <TouchableOpacity
            style={styles.helpButton}
            onPress={handleStartOnboarding}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons name="help-circle-outline" size={44} color={COLORS.primary} />
            <Text style={styles.helpLabel}>Help</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.profileContainer}>
          <GlowWrapper 
            showGlow={onboardingActive && onboardingStep === 3}
            animatedValue={glowAnim}
          >
            <View ref={profileRef} collapsable={false}>
              <TouchableOpacity
                style={styles.profileButton}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                onPress={() => setMenuOpen(!menuOpen)}
              >
                <View style={styles.profileCircle}>
                  <Text style={styles.profileInitials}>Profile</Text>
                </View>
              </TouchableOpacity>
            </View>
          </GlowWrapper>
          {menuOpen && (
            <View style={styles.menuInFlow} pointerEvents="auto">
              <TouchableOpacity
                style={styles.menuItem}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                onPress={() => { 
                  setMenuOpen(false);
                  router.push('/editprofile');
                }}
              >
                <Ionicons name="person-outline" size={18} color="#111827" style={{ marginRight: 8 }} />
                <Text style={styles.menuText}>Edit Profile</Text>
              </TouchableOpacity>
              <View style={styles.menuDivider} />
              <TouchableOpacity
                style={styles.menuItem}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                onPress={() => { setMenuOpen(false); 
                router.replace('/welcome'); }}
              >
                <Ionicons name="log-out-outline" size={18} color="#111827" style={{ marginRight: 8 }} />
                <Text style={styles.menuText}>Sign out</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
      <Text style={styles.heading}>Home</Text>
      <GlowWrapper 
        showGlow={onboardingActive && onboardingStep === 1}
        animatedValue={glowAnim}
      >
        <View ref={searchBarRef} collapsable={false}>
          <TextInput style={styles.searchBar} placeholder="Search" value={search} onChangeText={setSearch}/>
        </View>
      </GlowWrapper>
      {search.trim().length > 0 ? (
        <>
          <Text style={styles.resultsLabel}>Results for "{search.trim()}"</Text>
          {filteredEvents.length === 0 ? (
            <Text style={styles.resultsLabel}>No events found.</Text>
          ) : (
            filteredEvents.map((ev, index) => (
              <GlowWrapper 
                key={ev.id}
                showGlow={onboardingActive && onboardingStep === 2 && index === 0}
                animatedValue={glowAnim}
              >
                <TouchableOpacity 
                  style={styles.card}
                  onPress={() => {
                    setSelectedEvent(ev);
                    setModalVisible(true);
                  }}
                  activeOpacity={0.9}
                >
                <Image source={{ uri: ev.image }} style={styles.image} />
                <Text style={styles.eventName}>{ev.event}</Text>
                <Text style={styles.eventDetails}>{formatTimeRange(ev)}</Text>
                <Text style={styles.eventDetails}>{formatDateRange(ev)}</Text>
                <Text style={[styles.eventDetails, { marginBottom: 10 }]}>
                  {ev.location}
                </Text>
                <View style={styles.cardActions}>
                  {canEditEvent(ev) && (
                    <TouchableOpacity
                      onPress={(e) => {
                        e.stopPropagation();
                        setEventToEdit(ev);
                        setEditModalVisible(true);
                      }}
                      style={styles.editButton}
                    >
                      <Ionicons name="create-outline" size={16} color="#fff" />
                      <Text style={styles.editButtonText}>Edit</Text>
                    </TouchableOpacity>
                  )}
                  <TouchableOpacity
                    onPress={(e) => {
                      e.stopPropagation();
                      setEventToRemove(ev.id);
                      setConfirmVisible(true);
                    }}
                    style={styles.removeButton}
                  >
                    <Text style={styles.removeButtonText}>Remove</Text>
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
              </GlowWrapper>
            ))
          )}
        </>
      ) : (
        <>
          <Text style={styles.subheading}>My Upcoming Events</Text>
          {filteredEvents.map((ev, index) => (
            <GlowWrapper 
              key={ev.id}
              showGlow={onboardingActive && onboardingStep === 2 && index === 0}
              animatedValue={glowAnim}
            >
              <TouchableOpacity 
                ref={index === 0 ? eventCardRef : null}
                style={styles.card}
                onPress={() => {
                  setSelectedEvent(ev);
                  setModalVisible(true);
                }}
                activeOpacity={0.9}
              >
              <Image source={{ uri: ev.image }} style={styles.image} />
              <Text style={styles.eventName}>{ev.event}</Text>
              <Text style={styles.eventDetails}>{formatTimeRange(ev)}</Text>
              <Text style={styles.eventDetails}>{formatDateRange(ev)}</Text>
                  <Text style={[styles.eventDetails, { marginBottom: 10 }]}>
                    {ev.location}
                  </Text>
                  <View style={styles.cardActions}>
                    {canEditEvent(ev) && (
                      <TouchableOpacity
                        onPress={(e) => {
                          e.stopPropagation();
                          setEventToEdit(ev);
                          setEditModalVisible(true);
                        }}
                        style={styles.editButton}
                      >
                        <Ionicons name="create-outline" size={16} color="#fff" />
                        <Text style={styles.editButtonText}>Edit</Text>
                      </TouchableOpacity>
                    )}
                    <TouchableOpacity
                      onPress={(e) => {
                        e.stopPropagation();
                        setEventToRemove(ev.id);
                        setConfirmVisible(true);
                      }}
                      style={styles.removeButton}
                    >
                      <Text style={styles.removeButtonText}>Remove</Text>
                    </TouchableOpacity>
                  </View>
                </TouchableOpacity>
            </GlowWrapper>
          ))}
        </>
      )}
    </ScrollView>

    <Modal
      visible={confirmVisible}
      transparent={true}
      animationType="fade"
      onRequestClose={handleCancelRemove}
    >
      <View style={styles.confirmOverlay}>
        <View style={styles.confirmBox}>
          <Text style={styles.modalTitle}>Confirm Removal</Text>
          <Text style={[styles.modalDetailText, { marginVertical: 12, textAlign: 'center' }]}>
            Are you sure you want to remove this event from upcoming events?
          </Text>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 12 }}>
            <TouchableOpacity
              style={[styles.confirmButton, styles.confirmButtonYes]}
              onPress={handleConfirmRemove}
            >
              <Text style={styles.confirmButtonTextYes}>Yes</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.confirmButton, styles.confirmButtonNo]}
              onPress={handleCancelRemove}
            >
              <Text style={styles.confirmButtonTextNo}>No</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>

    <Modal
      visible={modalVisible}
      transparent={true}
      animationType="slide"
      onRequestClose={() => setModalVisible(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Event Details</Text>
            <TouchableOpacity onPress={() => setModalVisible(false)}>
              <Ionicons name="close" size={24} color={COLORS.textPrimary} />
            </TouchableOpacity>
          </View>
          <ScrollView showsVerticalScrollIndicator={false}>
            {selectedEvent && (
              <>
                {selectedEvent.image && (
                  <Image 
                    source={{ uri: selectedEvent.image }} 
                    style={styles.modalImage} 
                  />
                )}
                <Text style={styles.modalEventName}>
                  {selectedEvent.event || selectedEvent.title}
                </Text>
                
                <View style={styles.modalDetailRow}>
                  <Ionicons name="calendar-outline" size={20} color={COLORS.primary} />
                  <Text style={styles.modalDetailText}>
                    {formatDateRange(selectedEvent)}
                  </Text>
                </View>
                
                <View style={styles.modalDetailRow}>
                  <Ionicons name="time-outline" size={20} color={COLORS.primary} />
                  <Text style={styles.modalDetailText}>
                    {formatTimeRange(selectedEvent)}
                  </Text>
                </View>
                
                <View style={styles.modalDetailRow}>
                  <Ionicons name="location-outline" size={20} color={COLORS.primary} />
                  <Text style={styles.modalDetailText}>
                    {selectedEvent.location || "Location not specified"}
                  </Text>
                </View>
                
                {selectedEvent.description && (
                  <View style={styles.modalDescriptionContainer}>
                    <Text style={styles.modalDescriptionLabel}>Description</Text>
                    <Text style={styles.modalDescriptionText}>
                      {selectedEvent.description}
                    </Text>
                  </View>
                )}
                
                {selectedEvent.group && (
                  <View style={styles.modalDetailRow}>
                    <Ionicons name="people-outline" size={20} color={COLORS.primary} />
                    <Text style={styles.modalDetailText}>
                      {selectedEvent.group}
                    </Text>
                  </View>
                )}
              </>
            )}
          </ScrollView>
        </View>
      </View>
    </Modal>

    <EditEventModal
      visible={editModalVisible}
      event={eventToEdit}
      onClose={() => {
        setEditModalVisible(false);
        setEventToEdit(null);
      }}
      onSave={handleEditSave}
    />

    {onboardingActive && onboardingSteps[onboardingStep] && (
      <Tooltip
        visible={onboardingActive}
        title={onboardingSteps[onboardingStep].title}
        description={onboardingSteps[onboardingStep].description}
        position={tooltipPosition || { x: 0, y: 0, width: 0, height: 0 }}
        onClose={handleSkipOnboarding}
        onNext={handleNextOnboarding}
        showNext={onboardingStep < onboardingSteps.length - 1}
        showSkip={true}
        onSkip={handleSkipOnboarding}
        step={onboardingStep + 1}
        totalSteps={onboardingSteps.length}
        showHighlight={onboardingStep > 0 && onboardingStep < 4}
        highlightPosition={null}
        highlightAnimValue={glowAnim}
      />
    )}
    
    {onboardingActive && (
      <>
        <View 
          ref={createEventRef} 
          style={{
            position: 'absolute',
            bottom: insets.bottom,
            left: (SCREEN_WIDTH / 3) * 2,
            width: SCREEN_WIDTH / 3,
            height: 49,
            zIndex: -1,
          }}
          collapsable={false}
        />
        <View 
          ref={groupsRef} 
          style={{
            position: 'absolute',
            bottom: insets.bottom,
            left: SCREEN_WIDTH / 3,
            width: SCREEN_WIDTH / 3,
            height: 49,
            zIndex: -1,
          }}
          collapsable={false}
        />
      </>
    )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#FFFFFF",
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  helpContainer: {
    position: "relative",
    height: 74,
  },
  helpButton: {
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 10,
  },
  helpLabel: {
    fontSize: 12,
    color: COLORS.primary,
    marginTop: 4,
    fontWeight: "500",
  },
  profileContainer: {
    position: "relative",
    height: 74,
  },
  profileButton: {
    paddingTop: 10,
  },
  profileCircle: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "#E2E8F0",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#CBD5E1",
  },
  profileInitials: {
    fontWeight: "700",
    color: "#1F2937",
    fontSize: 11,
  },
  menuInFlow: {
    position: "absolute",
    top: 74,
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
    flexDirection: "row",
    alignItems: "center",
  },
  menuText: {
    fontSize: 14,
    color: "#111827",
  },
  menuDivider: {
    height: 1,
    backgroundColor: "#E5E7EB",
    marginVertical: 4,
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
    backgroundColor: "#F1F5F9"
  },

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
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
    position: "relative",
  },

  image: {
    width: "100%",
    aspectRatio: 4 / 3,
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
  },

  resultsLabel: {
    fontSize: 14,
    color: "#6B7280",
    marginBottom: 8,
  },

  cardActions: {
    flexDirection: "row",
    gap: 8,
    position: "absolute",
    top: 10,
    right: 10,
  },
  editButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  editButtonText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "600",
  },
  removeButton: {
    backgroundColor: "#FF0000",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  removeButtonText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "600",
  },
  confirmOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  confirmBox: {
    width: '85%',
    backgroundColor: COLORS.background,
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 5,
  },
  confirmButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  confirmButtonYes: {
    marginRight: 8,
    backgroundColor: "#FF0000",
  },
  confirmButtonNo: {
    marginLeft: 8,
    backgroundColor: "#E5E7EB",
  },
  confirmButtonTextYes: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "700",
  },
  confirmButtonTextNo: {
    color: COLORS.textPrimary,
    fontSize: 15,
    fontWeight: "700",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: COLORS.background,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: '90%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  modalImage: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    marginBottom: 16,
    resizeMode: 'cover',
  },
  modalEventName: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: 20,
  },
  modalDetailRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
    paddingHorizontal: 4,
  },
  modalDetailText: {
    fontSize: 16,
    color: COLORS.textPrimary,
    marginLeft: 12,
    flex: 1,
    lineHeight: 22,
  },
  modalDescriptionContainer: {
    marginTop: 8,
    marginBottom: 16,
    padding: 16,
    backgroundColor: '#F1F5F9',
    borderRadius: 12,
  },
  modalDescriptionLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: 8,
  },
  modalDescriptionText: {
    fontSize: 15,
    color: COLORS.textSecondary,
    lineHeight: 22,
  },
});
