import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Calendar } from "react-native-calendars";

const COLORS = {
  primary: "#7CA7D9",
  border: "#003366",
  textPrimary: "#000000",
  textSecondary: "#444444",
  background: "#FFFFFF",
};

export default function CreateEventScreen() {
  const router = useRouter();
  const [eventName, setEventName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [selectedGroup, setSelectedGroup] = useState("");
  

  const groups = [
    { id: "1", name: "Friend Group 1" },
    { id: "2", name: "Friend Group 3" },
  ];

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
        const start = new Date(startDate);
        const end = new Date(endDate);
        const current = new Date(start);
        
        while (current <= end) {
          const dateString = current.toISOString().split("T")[0];
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
    if (eventName && startDate && endDate && startTime && endTime && selectedGroup) {
      router.push({
        pathname: "/createeventdetails",
        params: {
          eventName,
          startDate,
          endDate,
          startTime,
          endTime,
          selectedGroup,
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

  const handleTimeChange = (time: string, isStart: boolean) => {
    // Remove non-numeric characters except colon
    let cleaned = time.replace(/[^0-9:]/g, '');
    
    // Auto-format as user types (HH:MM)
    if (cleaned.length <= 2) {
      cleaned = cleaned;
    } else if (cleaned.length <= 4) {
      cleaned = cleaned.slice(0, 2) + ':' + cleaned.slice(2);
    } else {
      cleaned = cleaned.slice(0, 5);
    }
    
    // Validate time format (HH:MM, 00-23:00-59)
    if (cleaned.length === 5) {
      const [hours, minutes] = cleaned.split(':');
      const h = parseInt(hours);
      const m = parseInt(minutes);
      if (h > 23 || m > 59) {
        return; // Don't update if invalid
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
          <Text style={styles.label}>Event Name</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter event name"
            placeholderTextColor="#999"
            value={eventName}
            onChangeText={setEventName}
          />
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Select Dates</Text>
          <Calendar
            onDayPress={handleDateSelect}
            markedDates={getMarkedDates()}
            markingType="period"
            minDate={new Date().toISOString().split("T")[0]}
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
                {new Date(startDate).toLocaleDateString('en-US', { 
                  month: 'long', 
                  day: 'numeric',
                  year: 'numeric'
                })}
                {startTime && ` at ${formatTime(startTime)}`}
                {" - "}
                {new Date(endDate).toLocaleDateString('en-US', { 
                  month: 'long', 
                  day: 'numeric',
                  year: 'numeric'
                })}
                {endTime && ` at ${formatTime(endTime)}`}
              </Text>
            </View>
          )}
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Select Times</Text>
          <View style={styles.timeContainer}>
            <View style={styles.timeInputGroup}>
              <Text style={styles.timeLabel}>Start Time</Text>
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
              <Text style={styles.timeLabel}>End Time</Text>
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
          <Text style={styles.label}>Visibility - Select Group</Text>
          <View style={styles.groupsContainer}>
            {groups.map((group) => (
              <TouchableOpacity
                key={group.id}
                style={[
                  styles.groupButton,
                  selectedGroup === group.id && styles.groupButtonSelected,
                ]}
                onPress={() => setSelectedGroup(group.id)}
              >
                <Text
                  style={[
                    styles.groupButtonText,
                    selectedGroup === group.id && styles.groupButtonTextSelected,
                  ]}
                >
                  {group.name}
                </Text>
                {selectedGroup === group.id && (
                  <Ionicons name="checkmark" size={20} color="#FFFFFF" />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <TouchableOpacity
          style={[
            styles.button,
            (!eventName || !startDate || !endDate || !startTime || !endTime || !selectedGroup) &&
              styles.buttonDisabled,
          ]}
          onPress={handleNext}
          disabled={!eventName || !startDate || !endDate || !startTime || !endTime || !selectedGroup}
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

