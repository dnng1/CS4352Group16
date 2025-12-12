import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  Alert,
  Modal,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { Calendar } from "react-native-calendars";
import DateTimePicker from "@react-native-community/datetimepicker";
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

interface EditEventModalProps {
  visible: boolean;
  event: any;
  onClose: () => void;
  onSave: () => void;
}

export default function EditEventModal({ visible, event, onClose, onSave }: EditEventModalProps) {
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
  const [address, setAddress] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState<string | null>(null);

  useEffect(() => {
    if (visible && event) {
      setEventName(event.event || event.title || "");
      setAddress(event.location || "");
      setDescription(event.description || "");
      setImage(event.image || null);

      if (event.startDate) {
        setStartDate(event.startDate);
      } else if (event.date) {
        const dateMatch = event.date.match(/(\w+)\s+(\d+)/);
        if (dateMatch) {
          const months = ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december'];
          const month = months.indexOf(dateMatch[1].toLowerCase());
          const day = parseInt(dateMatch[2]);
          const year = new Date().getFullYear();
          const date = new Date(year, month, day);
          const formattedDate = date.toISOString().split('T')[0];
          setStartDate(formattedDate);
          setEndDate(formattedDate);
        }
      }

      if (event.endDate) {
        setEndDate(event.endDate);
      } else if (event.startDate) {
        setEndDate(event.startDate);
      }

      const parseTime = (timeStr: string): { date: Date; formatted: string } | null => {
        if (!timeStr) return null;
        
        if (timeStr.includes(':')) {
          const parts = timeStr.split(':');
          const hours = parseInt(parts[0]);
          const minutes = parseInt(parts[1] || '0');
          
          if (!isNaN(hours) && !isNaN(minutes)) {
            const timeDate = new Date();
            timeDate.setHours(hours, minutes, 0, 0);
            const formatted = timeDate.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
            return { date: timeDate, formatted };
          }
        }
        
        return { date: new Date(), formatted: timeStr };
      };

      if (event.startTime) {
        const parsed = parseTime(event.startTime);
        if (parsed) {
          setStartTimeDate(parsed.date);
          setStartTime(parsed.formatted);
        } else {
          setStartTime(event.startTime);
        }
      }

      if (event.endTime) {
        const parsed = parseTime(event.endTime);
        if (parsed) {
          setEndTimeDate(parsed.date);
          setEndTime(parsed.formatted);
        } else {
          setEndTime(event.endTime);
        }
      } else if (event.time && event.time.includes('-')) {
        const [start, end] = event.time.split('-').map((t: string) => t.trim());
        if (start) {
          const parsed = parseTime(start);
          if (parsed) {
            setStartTimeDate(parsed.date);
            setStartTime(parsed.formatted);
          } else {
            setStartTime(start);
          }
        }
        if (end) {
          const parsed = parseTime(end);
          if (parsed) {
            setEndTimeDate(parsed.date);
            setEndTime(parsed.formatted);
          } else {
            setEndTime(end);
          }
        }
      }

      if (event.groups && Array.isArray(event.groups)) {
        setSelectedGroups(event.groups);
      } else if (event.group) {
        const groupNameToId: { [key: string]: string } = {
          "Welcome Wonders": "0",
          "International Student Association": "1",
          "Musical Wonders": "2",
          "Cooking Ninjas": "3",
          "Bridge Between Us": "4",
          "Town Travellers": "5",
        };
        const groupNames = event.group.split(',').map((g: string) => g.trim());
        const groupIds = groupNames
          .map((name: string) => groupNameToId[name])
          .filter(Boolean);
        setSelectedGroups(groupIds);
      }
    }
  }, [visible, event]);

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
    if (visible) {
      loadJoinedGroups();
    }
  }, [visible]);

  const handleDateSelect = (day: any) => {
    if (!startDate || (startDate && endDate)) {
      setStartDate(day.dateString);
      setEndDate("");
    } else if (day.dateString >= startDate) {
      setEndDate(day.dateString);
    } else {
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
      if (date) {
        setTempStartTimeDate(date);
      }
    } else {
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

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission needed",
        "Sorry, we need camera roll permissions to upload images!"
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled && result.assets[0]) {
      setImage(result.assets[0].uri);
    }
  };

  const handleSave = async () => {
    if (!eventName || !startDate || !endDate || !startTime || !endTime || !address || !description || selectedGroups.length === 0) {
      Alert.alert("Missing Information", "Please fill in all required fields.");
      return;
    }

    try {
      const storedEvents = await AsyncStorage.getItem('events');
      const existingEvents = storedEvents ? JSON.parse(storedEvents) : [];

      const parseDateString = (dateString: string): Date => {
        const [year, month, day] = dateString.split('-').map(Number);
        return new Date(year, month - 1, day);
      };

      const startDateObj = parseDateString(startDate);
      const endDateObj = parseDateString(endDate);
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

      const formattedDate = formattedStartDate === formattedEndDate
        ? formattedStartDate
        : `${formattedStartDate} - ${formattedEndDate}`;

      const formatTimeForStorage = (timeStr: string): string => {
        if (timeStr.includes('AM') || timeStr.includes('PM')) {
          const [time, period] = timeStr.split(' ');
          const [hours, minutes] = time.split(':').map(Number);
          let hour24 = hours;
          if (period === 'PM' && hours !== 12) hour24 = hours + 12;
          if (period === 'AM' && hours === 12) hour24 = 0;
          return `${String(hour24).padStart(2, '0')}:${String(minutes || 0).padStart(2, '0')}`;
        }
        return timeStr;
      };

      const formattedStartTime = formatTimeForStorage(startTime);
      const formattedEndTime = formatTimeForStorage(endTime);
      const formattedTime = formattedStartTime === formattedEndTime
        ? formattedStartTime
        : `${formattedStartTime} - ${formattedEndTime}`;

      const groupMapping: { [key: string]: string } = {
        "0": "Welcome Wonders",
        "1": "International Student Association",
        "2": "Musical Wonders",
        "3": "Cooking Ninjas",
        "4": "Bridge Between Us",
        "5": "Town Travellers",
      };
      const groupNames = selectedGroups
        .map((groupId: string) => groupMapping[groupId])
        .filter(Boolean)
        .join(", ");

      const updatedEvent = {
        ...event,
        event: eventName,
        image: image || event.image || "https://via.placeholder.com/400x300?text=Event+Image",
        date: formattedDate,
        time: formattedTime,
        location: address,
        description: description,
        startDate: startDate,
        endDate: endDate,
        startTime: startTime,
        endTime: endTime,
        groups: selectedGroups,
        group: groupNames || "No groups selected",
      };

      const eventIndex = existingEvents.findIndex((e: any) => e.id === event.id);
      if (eventIndex >= 0) {
        existingEvents[eventIndex] = updatedEvent;
      } else {
        existingEvents.push(updatedEvent);
      }

      await AsyncStorage.setItem('events', JSON.stringify(existingEvents));

      onSave();
      onClose();
      Alert.alert("Success", "Event updated successfully!");
    } catch (error) {
      console.error('Error updating event:', error);
      Alert.alert("Error", "Failed to update event. Please try again.");
    }
  };

  if (!visible || !event) return null;

  return (
    <Modal
      visible={visible}
      transparent={false}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.headerRow}>
            <TouchableOpacity onPress={onClose} style={styles.backButton}>
              <Ionicons name="chevron-back" size={24} color="#000" />
              <Text style={styles.backButtonText}>Cancel</Text>
            </TouchableOpacity>
            <Text style={styles.title}>Edit Event</Text>
            <View style={{ width: 80 }} />
          </View>

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
            <Text style={styles.subtext}>Double click the date to select an event to be single day</Text>
            <Calendar
              onDayPress={handleDateSelect}
              markedDates={getMarkedDates()}
              markingType="period"
              minDate={(() => {
                const today = new Date();
                const year = today.getFullYear();
                const month = String(today.getMonth() + 1).padStart(2, "0");
                const day = String(today.getDate()).padStart(2, "0");
                return `${year}-${month}-${day}`;
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
                  {(() => {
                    const [year, month, day] = startDate.split('-').map(Number);
                    const date = new Date(year, month - 1, day);
                    return date.toLocaleDateString('en-US', {
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric'
                    });
                  })()}
                  {startTime && ` at ${startTime}`}
                  {" - "}
                  {(() => {
                    const [year, month, day] = endDate.split('-').map(Number);
                    const date = new Date(year, month - 1, day);
                    return date.toLocaleDateString('en-US', {
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric'
                    });
                  })()}
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
                        setSelectedGroups(selectedGroups.filter(id => id !== group.id));
                      } else {
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

          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Address <Text style={styles.requiredAsterisk}>*</Text></Text>
            <TextInput
              style={styles.input}
              placeholder="Enter event address"
              placeholderTextColor="#999"
              value={address}
              onChangeText={setAddress}
              multiline
            />
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Event Description <Text style={styles.requiredAsterisk}>*</Text></Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Describe your event..."
              placeholderTextColor="#999"
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={6}
              textAlignVertical="top"
            />
          </View>

          <View style={[styles.fieldGroup, styles.imageFieldGroup]}>
            <Text style={styles.label}>Event Image</Text>
            <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
              {image ? (
                <Image source={{ uri: image }} style={styles.imagePreview} />
              ) : (
                <View style={styles.imagePlaceholder}>
                  <Ionicons name="image-outline" size={48} color={COLORS.textSecondary} />
                  <Text style={styles.imagePlaceholderText}>
                    Tap to upload an image
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={[
              styles.button,
              (!eventName || !startDate || !endDate || !startTime || !endTime || !address || !description || selectedGroups.length === 0) &&
              styles.buttonDisabled,
            ]}
            onPress={handleSave}
            disabled={!eventName || !startDate || !endDate || !startTime || !endTime || !address || !description || selectedGroups.length === 0}
          >
            <Text style={styles.buttonText}>Save Changes</Text>
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
                    textColor="#000000"
                    onChange={handleStartTimeChange}
                  />
                  <View style={styles.modalButtonsRow}>
                    <TouchableOpacity
                      onPress={() => {
                        setShowStartPicker(false);
                        setTempStartTimeDate(null);
                      }}>
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
                    textColor="#000000"
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
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    padding: 20,
    paddingTop: 60,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  backButtonText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#000",
    marginLeft: 4,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    textAlign: "center",
    flex: 1,
  },
  fieldGroup: {
    width: "100%",
    marginBottom: 24,
  },
  imageFieldGroup: {
    marginTop: 70,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.textPrimary,
    marginBottom: 8,
  },
  subtext: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginBottom: 8,
    fontStyle: "italic",
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
  textArea: {
    minHeight: 120,
    paddingTop: 12,
  },
  requiredAsterisk: {
    color: "#FF0000",
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
  imagePicker: {
    width: "100%",
    minHeight: 200,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderStyle: "dashed",
    overflow: "hidden",
  },
  imagePlaceholder: {
    width: "100%",
    height: 200,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F9FAFB",
  },
  imagePlaceholderText: {
    marginTop: 8,
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  imagePreview: {
    width: "100%",
    height: 200,
    resizeMode: "cover",
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

