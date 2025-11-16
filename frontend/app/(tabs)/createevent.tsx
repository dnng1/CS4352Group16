import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Calendar } from "react-native-calendars";
import AsyncStorage from "@react-native-async-storage/async-storage";

const COLORS = {
  primary: "#7CA7D9",
  border: "#003366",
  textPrimary: "#000000",
  textSecondary: "#444444",
  background: "#FFFFFF",
};

const groupMapping: { [key: number]: { id: string; name: string } } = {
  0: { id: "0", name: "Welcome Wonders" },
  1: { id: "1", name: "International Student Association" },
  2: { id: "2", name: "Musical Wonders" },
  3: { id: "3", name: "Cooking Ninjas" },
  4: { id: "4", name: "Bridge Between Us" },
  5: { id: "5", name: "Town Travellers" },
};

export default function CreateEventScreen() {
  const router = useRouter();
  const [eventName, setEventName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [selectedGroups, setSelectedGroups] = useState<string[]>([]);
  const [groups, setGroups] = useState<{ id: string; name: string }[]>([]);

  useEffect(() => {
    const loadJoinedGroups = async () => {
      try {
        const saved = await AsyncStorage.getItem('joinedGroups');
        if (saved) {
          const joinedGroups = JSON.parse(saved);
          const userGroups = Object.keys(joinedGroups)
            .filter(key => joinedGroups[parseInt(key)] === true)
            .map(key => groupMapping[parseInt(key)])
            .filter(Boolean);
          setGroups(userGroups);
        } else {
          setGroups([groupMapping[0]]);
        }
      } catch (error) {
        console.error('Error loading joined groups:', error);
        setGroups([groupMapping[0]]);
      }
    };
    loadJoinedGroups();
  }, []);

  const handleDateSelect = (day: any) => {
    if (!startDate || (startDate && endDate)) {
      // Start new selection
      setStartDate(day.dateString);
      setEndDate("");
    } else if (day.dateString >= startDate) {
      // Set end date
      setEndDate(day.dateString);
    } else {
      // If selected date is before start date, make it the new start date
      setStartDate(day.dateString);
      setEndDate("");
    }
  };

  const getMarkedDates = () => {
    const marked: any = {};
    
    if (startDate) {
      marked[startDate] = {
        startingDay: true,
        color: COLORS.primary,
        textColor: "#FFFFFF",
      };
    }
    
    if (endDate) {
      marked[endDate] = {
        endingDay: true,
        color: COLORS.primary,
        textColor: "#FFFFFF",
      };
      
      // Mark dates in between
      if (startDate && endDate) {
        const [startYear, startMonth, startDay] = startDate.split('-').map(Number);
        const [endYear, endMonth, endDay] = endDate.split('-').map(Number);
        const start = new Date(startYear, startMonth - 1, startDay);
        const end = new Date(endYear, endMonth - 1, endDay);
        const current = new Date(start);
        
        while (current <= end) {
          const year = current.getFullYear();
          const month = String(current.getMonth() + 1).padStart(2, '0');
          const day = String(current.getDate()).padStart(2, '0');
          const dateString = `${year}-${month}-${day}`;
          
          if (dateString !== startDate && dateString !== endDate) {
            marked[dateString] = {
              color: COLORS.primary,
              textColor: "#FFFFFF",
            };
          }
          current.setDate(current.getDate() + 1);
        }
      }
    }
    
    return marked;
  };

  const handleNext = () => {
    if (eventName && startDate && endDate && startTime && endTime && selectedGroups.length > 0) {
      router.push({
        pathname: "/createeventdetails",
        params: {
          eventName,
          startDate,
          endDate,
          startTime,
          endTime,
          selectedGroups: JSON.stringify(selectedGroups),
        },
      });
    }
  };

  const formatTime = (time: string) => {
    if (!time) return "";
    const [hours, minutes] = time.split(":");
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? "PM" : "AM";
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const formatDateString = (dateString: string) => {
    const [year, month, day] = dateString.split('-').map(Number);
    const date = new Date(year, month - 1, day);
    return date.toLocaleDateString('en-US', { 
      month: 'long', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  const handleTimeChange = (time: string, isStart: boolean) => {
    // Allow empty input
    if (time === "") {
      if (isStart) {
        setStartTime("");
      } else {
        setEndTime("");
      }
      return;
    }
    
    // Remove non-numeric characters except colon
    let cleaned = time.replace(/[^0-9:]/g, '');
    
    // Limit to reasonable length (max 5 chars for HH:MM)
    if (cleaned.length > 5) {
      cleaned = cleaned.slice(0, 5);
    }
    
    const currentTime = isStart ? startTime : endTime;
    
    if (cleaned.length < currentTime.length) {
      if (isStart) {
        setStartTime(cleaned);
      } else {
        setEndTime(cleaned);
      }
      return;
    }

    if (!cleaned.includes(':') && cleaned.length >= 3) {
      // Auto-insert colon after 2 digits when typing
      cleaned = cleaned.slice(0, 2) + ':' + cleaned.slice(2);
    }
    
    // Validate only when we have a complete time (HH:MM format)
    if (cleaned.length === 5 && cleaned.includes(':')) {
      const [hours, minutes] = cleaned.split(':');
      if (hours && minutes) {
        const h = parseInt(hours);
        const m = parseInt(minutes);

        if (isNaN(h) || isNaN(m) || h > 23 || m > 59) {
          return; 
        }
        
        if (minutes.length === 1) {
          cleaned = hours + ':' + '0' + minutes;
        }
      }
    }
    
    if (isStart) {
      setStartTime(cleaned);
    } else {
      setEndTime(cleaned);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <TouchableOpacity
          onPress={() => router.push("/(tabs)/home")}
          style={styles.backButton}
        >
          <Ionicons name="chevron-back" size={24} color={COLORS.primary} />
          <Text style={styles.backButtonText}>Back</Text>
        </TouchableOpacity>

        <Text style={styles.title}>Create New Event</Text>

        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Event Name *</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter event name"
            placeholderTextColor="#999"
            value={eventName}
            onChangeText={setEventName}
          />
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Select Dates *</Text>
          <Calendar
            onDayPress={handleDateSelect}
            markedDates={getMarkedDates()}
            markingType="period"
            minDate={(() => {
              const today = new Date();
              today.setDate(today.getDate() - 1);
              return today.toISOString().split("T")[0];
            })()}
            style={styles.calendar}
            theme={{
              backgroundColor: COLORS.background,
              calendarBackground: COLORS.background,
              textSectionTitleColor: COLORS.textPrimary,
              selectedDayBackgroundColor: COLORS.primary,
              selectedDayTextColor: "#FFFFFF",
              todayTextColor: COLORS.primary,
              dayTextColor: COLORS.textPrimary,
              textDisabledColor: "#d9e1e8",
              dotColor: COLORS.primary,
              selectedDotColor: "#FFFFFF",
              arrowColor: COLORS.primary,
              monthTextColor: COLORS.textPrimary,
              indicatorColor: COLORS.primary,
              textDayFontWeight: "500",
              textMonthFontWeight: "600",
              textDayHeaderFontWeight: "600",
              textDayFontSize: 16,
              textMonthFontSize: 18,
              textDayHeaderFontSize: 14,
            }}
          />
          {startDate && endDate && (
            <View style={styles.dateRangeContainer}>
              <Text style={styles.dateRangeText}>
                {formatDateString(startDate)}
                {startTime && ` at ${formatTime(startTime)}`}
                {" - "}
                {formatDateString(endDate)}
                {endTime && ` at ${formatTime(endTime)}`}
              </Text>
            </View>
          )}
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Select Times *</Text>
          <View style={styles.timeContainer}>
            <View style={styles.timeInputGroup}>
              <Text style={styles.timeLabel}>Start Time *</Text>
              <TextInput
                style={styles.timeInput}
                placeholder="14:30 (24h format)"
                placeholderTextColor="#999"
                value={startTime}
                onChangeText={(text) => handleTimeChange(text, true)}
                keyboardType="numeric"
                maxLength={5}
              />
              {startTime && (
                <Text style={styles.timeDisplay}>{formatTime(startTime)}</Text>
              )}
            </View>
            <View style={styles.timeInputGroup}>
              <Text style={styles.timeLabel}>End Time *</Text>
              <TextInput
                style={styles.timeInput}
                placeholder="16:00 (24h format)"
                placeholderTextColor="#999"
                value={endTime}
                onChangeText={(text) => handleTimeChange(text, false)}
                keyboardType="numeric"
                maxLength={5}
              />
              {endTime && (
                <Text style={styles.timeDisplay}>{formatTime(endTime)}</Text>
              )}
            </View>
          </View>
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Visibility - Select Groups *</Text>
          <View style={styles.groupsContainer}>
            {groups.map((group) => {
              const isSelected = selectedGroups.includes(group.id);
              return (
                <TouchableOpacity
                  key={group.id}
                  style={[
                    styles.groupButton,
                    isSelected && styles.groupButtonSelected,
                  ]}
                  onPress={() => {
                    if (isSelected) {
                      // Remove from selection
                      setSelectedGroups(selectedGroups.filter(id => id !== group.id));
                    } else {
                      // Add to selection
                      setSelectedGroups([...selectedGroups, group.id]);
                    }
                  }}
                >
                  <Text
                    style={[
                      styles.groupButtonText,
                      isSelected && styles.groupButtonTextSelected,
                    ]}
                  >
                    {group.name}
                  </Text>
                  {isSelected && (
                    <Ionicons name="checkmark" size={20} color="#FFFFFF" />
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        <TouchableOpacity
          style={[
            styles.button,
            (!eventName || !startDate || !endDate || !startTime || !endTime || selectedGroups.length === 0) &&
              styles.buttonDisabled,
          ]}
          onPress={handleNext}
          disabled={!eventName || !startDate || !endDate || !startTime || !endTime || selectedGroups.length === 0}
        >
          <Text style={styles.buttonText}>Next</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingTop: 60,
    paddingHorizontal: 24,
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  backButtonText: {
    fontSize: 18,
    fontWeight: "600",
    color: COLORS.primary,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: COLORS.textPrimary,
    marginBottom: 24,
    textAlign: "center",
  },
  fieldGroup: {
    width: "100%",
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.textPrimary,
    marginBottom: 8,
  },
  input: {
    width: "100%",
    height: 50,
    borderColor: COLORS.border,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    backgroundColor: "#fff",
  },
  calendar: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    overflow: "hidden",
  },
  dateRangeContainer: {
    marginTop: 12,
    padding: 12,
    backgroundColor: "#F1F5F9",
    borderRadius: 8,
  },
  dateRangeText: {
    fontSize: 14,
    color: COLORS.textPrimary,
    fontWeight: "500",
    lineHeight: 20,
  },
  timeContainer: {
    flexDirection: "row",
    gap: 12,
  },
  timeInputGroup: {
    flex: 1,
  },
  timeLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.textSecondary,
    marginBottom: 8,
  },
  timeInput: {
    width: "100%",
    height: 50,
    borderColor: COLORS.border,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    backgroundColor: "#fff",
  },
  timeDisplay: {
    marginTop: 6,
    fontSize: 12,
    color: COLORS.primary,
    fontWeight: "500",
  },
  groupsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  groupButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: "#fff",
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  groupButtonSelected: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  groupButtonText: {
    fontSize: 16,
    color: COLORS.textPrimary,
    fontWeight: "500",
  },
  groupButtonTextSelected: {
    color: "#FFFFFF",
  },
  button: {
    width: "100%",
    backgroundColor: COLORS.primary,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 8,
    marginBottom: 40,
  },
  buttonDisabled: {
    backgroundColor: "#ccc",
    opacity: 0.6,
  },
  buttonText: {
    color: COLORS.textPrimary,
    fontSize: 16,
    fontWeight: "600",
  },
});

