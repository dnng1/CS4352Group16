import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  Alert,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { joinEvent } from "../utils/eventstorage";

const COLORS = {
  primary: "#7CA7D9",
  border: "#003366",
  textPrimary: "#000000",
  textSecondary: "#444444",
  background: "#FFFFFF",
};

export default function CreateEventDetailsScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [address, setAddress] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState<string | null>(null);

  const formatTime = (time: string) => {
    if (!time) return "";
    const [hours, minutes] = time.split(":");
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? "PM" : "AM";
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const pickImage = async () => {
    // Request permission
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission needed",
        "Sorry, we need camera roll permissions to upload images!"
      );
      return;
    }

    // Launch image picker
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

  const handlePost = async () => {
    if (!address || !description) {
      Alert.alert("Missing Information", "Please fill in all required fields.");
      return;
    }

    try {
      // Get existing events from AsyncStorage
      const storedEvents = await AsyncStorage.getItem('events');
      const existingEvents = storedEvents ? JSON.parse(storedEvents) : [];
      
      // Format dates for display 
      const startDateObj = new Date(params.startDate as string);
      const endDateObj = new Date(params.endDate as string);
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
      
      const formattedStartTime = params.startTime 
        ? formatTime(params.startTime as string)
        : startDateObj.toLocaleTimeString('en-US', { 
            hour: 'numeric', 
            minute: '2-digit',
            hour12: true 
          });
      const formattedEndTime = params.endTime 
        ? formatTime(params.endTime as string)
        : endDateObj.toLocaleTimeString('en-US', { 
            hour: 'numeric', 
            minute: '2-digit',
            hour12: true 
          });
      const formattedTime = formattedStartTime === formattedEndTime
        ? formattedStartTime
        : `${formattedStartTime} - ${formattedEndTime}`;

      // Parse selected groups
      const selectedGroups = params.selectedGroups 
        ? JSON.parse(params.selectedGroups as string) 
        : [];
      
      // Get group names for display
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

      // Create new event object
      const newEvent = {
        id: Date.now(), // Use timestamp as unique ID
        event: params.eventName as string,
        image: image || "https://via.placeholder.com/400x300?text=Event+Image",
        date: formattedDate,
        time: formattedTime,
        location: address,
        description: description,
        startDate: params.startDate as string,
        endDate: params.endDate as string,
        startTime: params.startTime as string,
        endTime: params.endTime as string,
        groups: selectedGroups,
        group: groupNames || "No groups selected",
      };

      // Add new event to the beginning of the array
      const updatedEvents = [newEvent, ...existingEvents];
      
      // Save to AsyncStorage
      await AsyncStorage.setItem('events', JSON.stringify(updatedEvents));
      await joinEvent(newEvent.id); //adds new event as joined

      // Show success and navigate
      Alert.alert(
        "Event Created!",
        "Your event has been posted successfully.",
        [
          {
            text: "OK",
            onPress: () => router.push("/(tabs)/home"),
          },
        ]
      );
    } catch (error) {
      console.error('Error saving event:', error);
      Alert.alert("Error", "Failed to save event. Please try again.");
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <TouchableOpacity
          onPress={() => router.push("/(tabs)/createevent")}
          style={styles.backButton}
        >
          <Ionicons name="chevron-back" size={24} color="#000" />
          <Text style={styles.backButtonText}>Back</Text>
        </TouchableOpacity>

        <Text style={styles.title}>Event Details</Text>

        <View style={styles.eventInfo}>
          <Text style={styles.eventInfoLabel}>Event Name:</Text>
          <Text style={styles.eventInfoText}>{params.eventName}</Text>
        </View>

        <View style={styles.eventInfo}>
          <Text style={styles.eventInfoLabel}>Date & Time Range:</Text>
          <Text style={styles.eventInfoText}>
            {new Date(params.startDate as string).toLocaleDateString('en-US', { 
              month: 'long', 
              day: 'numeric',
              year: 'numeric'
            })}
            {params.startTime && ` at ${formatTime(params.startTime as string)}`}
            {" - "}
            {new Date(params.endDate as string).toLocaleDateString('en-US', { 
              month: 'long', 
              day: 'numeric',
              year: 'numeric'
            })}
            {params.endTime && ` at ${formatTime(params.endTime as string)}`}
          </Text>
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Address *</Text>
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
          <Text style={styles.label}>Event Description *</Text>
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

        <View style={styles.fieldGroup}>
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
            (!address || !description) && styles.buttonDisabled,
          ]}
          onPress={handlePost}
          disabled={!address || !description}
        >
          <Text style={styles.buttonText}>Post Event</Text>
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
    color: "#000",
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: COLORS.textPrimary,
    marginBottom: 24,
    textAlign: "center",
  },
  eventInfo: {
    marginBottom: 16,
    padding: 12,
    backgroundColor: "#F1F5F9",
    borderRadius: 8,
  },
  eventInfoLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.textSecondary,
    marginBottom: 4,
  },
  eventInfoText: {
    fontSize: 16,
    color: COLORS.textPrimary,
    fontWeight: "500",
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
    minHeight: 50,
    borderColor: COLORS.border,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: "#fff",
  },
  textArea: {
    minHeight: 120,
    paddingTop: 12,
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
});

