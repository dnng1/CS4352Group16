import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Platform, Modal } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Calendar } from "react-native-calendars";
import AsyncStorage from "@react-native-async-storage/async-storage";
import DateTimePicker from "@react-native-community/datetimepicker";

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
  const [startTimeDate, setStartTimeDate] = useState<Date>(new Date());
  const [endTimeDate, setEndTimeDate] = useState<Date>(new Date());
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);
  const [tempStartTimeDate, setTempStartTimeDate] = useState<Date | null>(null);
  const [tempEndTimeDate, setTempEndTimeDate] = useState<Date | null>(null);
  const [selectedGroups, setSelectedGroups] = useState<string[]>([]);
  const [groups, setGroups] = useState<{ id: string; name: string }[]>([]);
  const [menuOpen, setMenuOpen] = useState(false);

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

  const formatDateString = (dateString: string) => {
    const [year, month, day] = dateString.split('-').map(Number);
    const date = new Date(year, month - 1, day);
    return date.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatDeviceTime = (date: Date) =>
    date.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });

  const openStartPicker = () => {
    setTempStartTimeDate(startTimeDate);
    setShowStartPicker(true);
  };

  const openEndPicker = () => {
    setTempEndTimeDate(endTimeDate);
    setShowEndPicker(true);
  };

  const handleStartTimeChange = (event: any, date?: Date) => {
    if (Platform.OS === "ios") {
      if (date) //update as user scrolls
      {
        setTempStartTimeDate(date);
      }
    }
    else {
      setShowStartPicker(false);
      if (event.type === "set" && date) {
        setStartTimeDate(date);
        setStartTime(formatDeviceTime(date));
      }
    }
  };

  const handleEndTimeChange = (event: any, date?: Date) => {
    if (Platform.OS === "ios") {
      if (date) {
        setTempEndTimeDate(date);
      }
    } else {
      setShowEndPicker(false);
      if (event.type === "set" && date) {
        setEndTimeDate(date);
        setEndTime(formatDeviceTime(date));
      }
    }
  };

  return (
    <View style={styles.container}>
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
                onPress={() => { setMenuOpen(false); router.replace('/welcome'); }}
              >
                <Text style={styles.menuText}>Sign out</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
      <Text style={styles.heading}>Create New Event</Text>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Event Name <Text style={styles.requiredAsterisk}>*</Text></Text>
          <TextInput
            style={styles.input}
            placeholder="Enter event name"
            placeholderTextColor="#999"
            value={eventName}
            onChangeText={setEventName}
          />
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Select Dates <Text style={styles.requiredAsterisk}>*</Text></Text>
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
                {startTime && ` at ${startTime}`}
                {" - "}
                {formatDateString(endDate)}
                {endTime && ` at ${endTime}`}
              </Text>
            </View>
          )}
        </View>
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>
            Select Times <Text style={styles.requiredAsterisk}>*</Text>
          </Text>
          <View style={styles.timeContainer}>
            {/* Start time */}
            <View style={styles.timeInputGroup}>
              <Text style={styles.timeLabel}>
                Start Time <Text style={styles.requiredAsterisk}>*</Text>
              </Text>
              <TouchableOpacity
                style={styles.timeInput}
                onPress={() => {
                  if (Platform.OS === "ios") {
                    openStartPicker();
                  } else {
                    setShowStartPicker(true);
                  }
                }}>
                <Text
                  style={{
                    fontSize: 16,
                    color: startTime ? COLORS.textPrimary : "#999",
                  }}>
                  {startTime || "Select start time"}
                </Text>
              </TouchableOpacity>
            </View>
            {/* End time */}
            <View style={styles.timeInputGroup}>
              <Text style={styles.timeLabel}>
                End Time <Text style={styles.requiredAsterisk}>*</Text>
              </Text>
              <TouchableOpacity
                style={styles.timeInput}
                onPress={() => {
                  if (Platform.OS === "ios") {
                    openEndPicker();
                  } else {
                    setShowEndPicker(true);
                  }
                }}>
                <Text
                  style={{
                    fontSize: 16,
                    color: endTime ? COLORS.textPrimary : "#999",
                  }}>
                  {endTime || "Select end time"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Visibility - Select Groups <Text style={styles.requiredAsterisk}>*</Text></Text>
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

      {Platform.OS === "ios" && (
        <>
          <Modal
            visible={showStartPicker}
            transparent
            animationType="fade"
            onRequestClose={() => {
              setShowStartPicker(false);
              setTempStartTimeDate(null);
            }}
          >
            <View style={styles.modalOverlay}>
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>Select start time</Text>
                <DateTimePicker
                  value={tempStartTimeDate || startTimeDate}
                  mode="time"
                  display="spinner"
                  textColor = "#000000"
                  onChange={handleStartTimeChange}
                />
                <View style={styles.modalButtonsRow}>
                  <TouchableOpacity
                    onPress={() => {
                      setShowStartPicker(false);
                      setTempStartTimeDate(null);
                    }}
                  >
                    <Text style={styles.modalButtonText}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => {
                      const finalDate = tempStartTimeDate || startTimeDate;
                      setStartTimeDate(finalDate);
                      setStartTime(formatDeviceTime(finalDate));
                      setShowStartPicker(false);
                      setTempStartTimeDate(null);
                    }}
                  >
                    <Text style={styles.modalButtonText}>Done ✓</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>
          <Modal
            visible={showEndPicker}
            transparent
            animationType="fade"
            onRequestClose={() => {
              setShowEndPicker(false);
              setTempEndTimeDate(null);
            }}
          >
            <View style={styles.modalOverlay}>
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>Select end time</Text>
                <DateTimePicker
                  value={tempEndTimeDate || endTimeDate}
                  mode="time"
                  display="spinner"
                  textColor = "#000000"
                  onChange={handleEndTimeChange}
                />
                <View style={styles.modalButtonsRow}>
                  <TouchableOpacity
                    onPress={() => {
                      setShowEndPicker(false);
                      setTempEndTimeDate(null);
                    }}
                  >
                    <Text style={styles.modalButtonText}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => {
                      const finalDate = tempEndTimeDate || endTimeDate;
                      setEndTimeDate(finalDate);
                      setEndTime(formatDeviceTime(finalDate));
                      setShowEndPicker(false);
                      setTempEndTimeDate(null);
                    }}
                  >
                    <Text style={styles.modalButtonText}>Done ✓</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>
        </>
      )}

      {Platform.OS === "android" && showStartPicker && (
        <DateTimePicker
          value={startTimeDate}
          mode="time"
          display="default"
          onChange={handleStartTimeChange}
        />
      )}
      {Platform.OS === "android" && showEndPicker && (
        <DateTimePicker
          value={endTimeDate}
          mode="time"
          display="default"
          onChange={handleEndTimeChange}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
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
  heading: {
    marginTop: 10,
    marginBottom: 40,
    fontSize: 24,
    fontWeight: "700",
    textAlign: "center",
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
    justifyContent: "center",
    paddingVertical: 0,
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
  scrollContent: {
    paddingBottom: 40,
  },
  requiredAsterisk: {
    color: "#FF0000",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 16,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  modalTitle: {
    color: "#000000",
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 8,
  },
  modalButtonsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
  },
  modalButtonText: {
    color: "#000000",
    fontSize: 16,
    fontWeight: "600",
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
});

