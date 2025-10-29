import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StatusBar,
  TextInput,
  ScrollView,
  Image,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";

const COLORS = {
  background: "#FFFFFF",
  card: "#CFE6FF",
  primary: "#7CA7D9",
  secondary: "#E5E5E5",
  textPrimary: "#000000",
  textSecondary: "#444444",
  border: "#003366",
  disabled: "#CCCCCC",
};

const personalityQuestions = [
  {
    id: 1,
    title: "What do you look forward to most when moving somewhere new?",
    options: [
      "Trying new foods and traditions",
      "Meeting new people",
      "Exploring the city",
      "Building a routine",
    ],
  },
  {
    id: 2,
    title: "How do you spend your weekends?",
    options: [
      "Going out with friends",
      "Relaxing at home",
      "Exploring new places",
      "Learning new skills",
    ],
  },
  {
    id: 3,
    title: "What role do you play in friend groups?",
    options: [
      "The planner",
      "The listener",
      "The adventurer",
      "The motivator",
    ],
  },
  {
    id: 4,
    title: "What helps you feel most connected to others?",
    options: [
      "Deep conversations",
      "Shared activities",
      "Laughing together",
      "Shared goals",
    ],
  },
  {
    id: 5,
    title: "How do you usually meet new people?",
    options: [
      "School or work",
      "Online communities",
      "Social events",
      "Through friends",
    ],
  },
  {
    id: 6,
    title: "How comfortable are you with new cultures?",
    options: [
      "Love immersing myself",
      "Curious but cautious",
      "Learn some things",
      "Prefer familiar places",
    ],
  },
  {
    id: 7,
    title: "How do you handle challenges in a new country?",
    options: [
      "Ask others for help",
      "Research on my own",
      "Take breaks and adjust",
      "Stay positive",
    ],
  },
  {
    id: 8,
    title: "What social vibe do you prefer?",
    options: [
      "Small groups",
      "Big gatherings",
      "Chill hangouts",
      "Activity based",
    ],
  },
  {
    id: 9,
    title: "What's most important in friendship?",
    options: [
      "Loyalty and trust",
      "Shared interests",
      "Mutual growth",
      "Emotional support",
    ],
  },
  {
    id: 10,
    title: "What would your ideal friend group theme be?",
    options: [
      "Cultural Explorers",
      "Deep Talks and Coffee",
      "Adventure Squad",
      "Study and Support Circle",
    ],
  },
];

export default function App() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [userInfo, setUserInfo] = useState({
    fullName: "",
    phoneNumber: "",
    location: "",
  });
  const [answers, setAnswers] = useState<{ [key: number]: string }>({});
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [cameFromSummary, setCameFromSummary] = useState(false);

  const question = personalityQuestions[currentQuestion];
  const totalQuestions = personalityQuestions.length;

  const handleUserInfoNext = () => {
    if (userInfo.fullName && userInfo.phoneNumber && userInfo.location) {
      setCurrentStep(1);
    } else {
      Alert.alert("Missing Information", "Please fill in all fields");
    }
  };

  const handleQuizNext = () => {
    // Require an answer before continuing
    if (!selectedOption) {
      Alert.alert("Select an answer", "Please choose an option to continue.");
      return;
    }

    // Save current answer
    setAnswers({ ...answers, [currentQuestion]: selectedOption });

    if (currentQuestion + 1 < totalQuestions) {
      setCurrentQuestion(currentQuestion + 1);
      const nextQuestionAnswer = answers[currentQuestion + 1];
      setSelectedOption(nextQuestionAnswer || null);
    } else {
      if (cameFromSummary) {
        setCurrentStep(3);
        setCameFromSummary(false);
      } else {
        setCurrentStep(2);
      }
    }
  };

  const handleQuizBack = () => {
    if (currentQuestion > 0) {
      if (selectedOption) {
        setAnswers({ ...answers, [currentQuestion]: selectedOption });
      }
      setCurrentQuestion(currentQuestion - 1);
      const answerForPreviousQuestion = answers[currentQuestion - 1];
      setSelectedOption(answerForPreviousQuestion || null);
    } else {
      if (cameFromSummary) {
        setCurrentStep(3);
        setCameFromSummary(false);
      } else {
        setCurrentStep(0);
      }
    }
  };

  const handleBack = () => {
    if (currentStep === 1) {
      handleQuizBack();
    } else if (currentStep === 2) {
      setCurrentStep(1);
    } else if (currentStep === 3) {
      setCurrentStep(2);
    }
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setProfileImage(result.assets[0].uri);
    }
  };

  const handleImageNext = () => {
    if (profileImage) {
      setCurrentStep(3);
    } else {
      Alert.alert("Missing Image", "Please upload a profile image first");
    }
  };

  const handleEditQuestion = (questionIndex: number) => {
    setCurrentQuestion(questionIndex);
    setCurrentStep(1);
    setSelectedOption(answers[questionIndex] || null);
    setCameFromSummary(true);
  };

  const handleSubmit = () => {
    Alert.alert("Success!", "Your personality quiz has been submitted!");
    setCurrentStep(0);
    setCurrentQuestion(0);
    setSelectedOption(null);
    setUserInfo({ fullName: "", phoneNumber: "", location: "" });
    setAnswers({});
    setProfileImage(null);
    setCameFromSummary(false);
    
    // go to FriendGroupsSimple page
    router.replace("/FriendGroupsSimple");
  };

  const renderUserInfoForm = () => (
    <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
      <View style={{ paddingTop: 20 }}>
        <Text
          style={{
            fontSize: 28,
            fontWeight: "700",
            color: COLORS.textPrimary,
            textAlign: "center",
          }}
        >
          Welcome! 
        </Text>
        <Text
          style={{
            fontSize: 16,
            color: COLORS.textSecondary,
            marginBottom: 40,
            textAlign: "center",
          }}
        >
          Let's get to know you better
        </Text>

        {["Full Name", "Phone Number", "Location"].map((field, idx) => (
          <View key={idx} style={{ marginBottom: 20 }}>
            <Text
              style={{
                fontSize: 16,
                fontWeight: "600",
                color: COLORS.textPrimary,
                marginBottom: 8,
              }}
            >
              {field}
            </Text>
            <TextInput
              style={{
                borderWidth: 1,
                borderColor: COLORS.border,
                backgroundColor: "#fff",
                padding: 15,
                borderRadius: 12,
                fontSize: 16,
              }}
              placeholder={`Enter your ${field.toLowerCase()}`}
              value={
                field === "Full Name"
                  ? userInfo.fullName
                  : field === "Phone Number"
                  ? userInfo.phoneNumber
                  : userInfo.location
              }
              onChangeText={(text) =>
                setUserInfo({
                  ...userInfo,
                  [field === "Full Name"
                    ? "fullName"
                    : field === "Phone Number"
                    ? "phoneNumber"
                    : "location"]: text,
                })
              }
              keyboardType={field === "Phone Number" ? "phone-pad" : "default"}
            />
          </View>
        ))}

        <TouchableOpacity
          onPress={handleUserInfoNext}
          style={{
            backgroundColor: COLORS.primary,
            paddingVertical: 16,
            borderRadius: 12,
            alignItems: "center",
          }}
        >
          <Text
            style={{
              color: COLORS.textPrimary,
              fontSize: 16,
              fontWeight: "600",
            }}
          >
            Start Personality Quiz →
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );

  const renderQuiz = () => (
    <ScrollView style={{ flex: 1 }}>
      <View style={{ paddingTop: 20 }}>
        <View
          style={{
            height: 4,
            backgroundColor: COLORS.secondary,
            borderRadius: 10,
            marginBottom: 20,
          }}
        >
          <View
            style={{
              width: `${((currentQuestion + 1) / totalQuestions) * 100}%`,
              height: "100%",
              backgroundColor: COLORS.primary,
              borderRadius: 10,
            }}
          />
        </View>

        <Text style={{ fontSize: 16, color: COLORS.textSecondary }}>
          Question {currentQuestion + 1} of {totalQuestions}
        </Text>

        <Text
          style={{
            fontSize: 22,
            fontWeight: "600",
            color: COLORS.textPrimary,
            marginVertical: 30,
          }}
        >
          {question.title}
        </Text>

        {question.options.map((option, index) => {
          const selected = selectedOption === option;
          return (
            <TouchableOpacity
              key={index}
              onPress={() => setSelectedOption(option)}
              style={{
                borderWidth: 1.5,
                borderColor: selected ? COLORS.border : "#ddd",
                backgroundColor: selected ? COLORS.card : "#fff",
                padding: 18,
                borderRadius: 12,
                marginBottom: 12,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Text style={{ fontSize: 16, color: COLORS.textPrimary }}>
                {option}
              </Text>
              {selected && (
                <Ionicons name="checkmark-circle" size={22} color={COLORS.primary} />
              )}
            </TouchableOpacity>
          );
        })}

        <TouchableOpacity
          onPress={handleQuizNext}
          disabled={!selectedOption}
          style={{
            backgroundColor: selectedOption ? COLORS.primary : COLORS.disabled,
            paddingVertical: 16,
            borderRadius: 12,
            alignItems: "center",
            marginTop: 30,
          }}
        >
          <Text
            style={{
              color: COLORS.textPrimary,
              fontSize: 16,
              fontWeight: "600",
            }}
          >
            {currentQuestion + 1 === totalQuestions
              ? "Continue →"
              : "Next →"}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );

  const renderIdentityConfirmation = () => (
    <ScrollView style={{ flex: 1 }}>
      <View style={{ paddingTop: 20 }}>
        <Text
          style={{
            fontSize: 28,
            fontWeight: "700",
            color: COLORS.textPrimary,
            textAlign: "center",
          }}
        >
          Almost Done! 
        </Text>
        <Text
          style={{
            fontSize: 16,
            color: COLORS.textSecondary,
            textAlign: "center",
            marginBottom: 40,
          }}
        >
          Please upload a photo to confirm your identity
        </Text>

        <View style={{ alignItems: "center", marginBottom: 40 }}>
          <TouchableOpacity
            onPress={pickImage}
            style={{
              width: 150,
              height: 150,
              borderRadius: 75,
              backgroundColor: COLORS.secondary,
              borderWidth: 2,
              borderColor: COLORS.border,
              borderStyle: "dashed",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {profileImage ? (
              <Image
                source={{ uri: profileImage }}
                style={{ width: 146, height: 146, borderRadius: 73 }}
              />
            ) : (
              <View style={{ alignItems: "center" }}>
                <Ionicons name="camera" size={40} color={COLORS.textSecondary} />
                <Text
                  style={{
                    color: COLORS.textSecondary,
                    marginTop: 8,
                    textAlign: "center",
                  }}
                >
                  Tap to upload
                </Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          onPress={handleImageNext}
          style={{
            backgroundColor: COLORS.primary,
            paddingVertical: 16,
            borderRadius: 12,
            alignItems: "center",
          }}
        >
          <Text
            style={{
              color: COLORS.textPrimary,
              fontSize: 16,
              fontWeight: "600",
            }}
          >
            Continue to Summary →
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );

  const renderSummary = () => (
    <ScrollView style={{ flex: 1 }}>
      <View style={{ paddingTop: 20 }}>
        <Text
          style={{
            fontSize: 28,
            fontWeight: "700",
            color: COLORS.textPrimary,
            textAlign: "center",
          }}
        >
          Your Information Summary 
        </Text>
        <Text
          style={{
            fontSize: 16,
            color: COLORS.textSecondary,
            textAlign: "center",
            marginBottom: 20,
          }}
        >
          Please review your information before submitting
        </Text>
        <Text
          style={{
            fontSize: 14,
            color: COLORS.primary,
            textAlign: "center",
            marginBottom: 40,
            fontStyle: "italic",
          }}
        >
          Tap on any question below to edit your answer
        </Text>

        <View
          style={{
            backgroundColor: COLORS.card,
            padding: 20,
            borderRadius: 12,
            marginBottom: 20,
          }}
        >
          <Text
            style={{
              fontSize: 20,
              fontWeight: "600",
              color: COLORS.textPrimary,
              marginBottom: 15,
            }}
          >
            Personal Information
          </Text>
          <View style={{ marginBottom: 10 }}>
            <Text style={{ fontSize: 14, color: COLORS.textSecondary, fontWeight: "500" }}>
              Full Name:
            </Text>
            <Text style={{ fontSize: 16, color: COLORS.textPrimary }}>
              {userInfo.fullName}
            </Text>
          </View>
          <View style={{ marginBottom: 10 }}>
            <Text style={{ fontSize: 14, color: COLORS.textSecondary, fontWeight: "500" }}>
              Phone Number:
            </Text>
            <Text style={{ fontSize: 16, color: COLORS.textPrimary }}>
              {userInfo.phoneNumber}
            </Text>
          </View>
          <View>
            <Text style={{ fontSize: 14, color: COLORS.textSecondary, fontWeight: "500" }}>
              Location:
            </Text>
            <Text style={{ fontSize: 16, color: COLORS.textPrimary }}>
              {userInfo.location}
            </Text>
          </View>
        </View>

        <View
          style={{
            backgroundColor: COLORS.card,
            padding: 20,
            borderRadius: 12,
            marginBottom: 30,
          }}
        >
          <Text
            style={{
              fontSize: 20,
              fontWeight: "600",
              color: COLORS.textPrimary,
              marginBottom: 15,
            }}
          >
            Your Quiz Answers
          </Text>
          {personalityQuestions.map((question, index) => {
            const isAnswered = answers[index];
            return (
              <TouchableOpacity
                key={question.id}
                onPress={() => handleEditQuestion(index)}
                style={{
                  marginBottom: 15,
                  padding: 12,
                  borderRadius: 8,
                  backgroundColor: isAnswered ? "#f0f8ff" : "#f8f9fa",
                  borderWidth: 1,
                  borderColor: isAnswered ? COLORS.primary : "#e9ecef",
                }}
              >
                <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                  <View style={{ flex: 1 }}>
                    <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 5 }}>
                      <Text
                        style={{
                          fontSize: 14,
                          color: COLORS.textSecondary,
                          fontWeight: "500",
                        }}
                      >
                        Question {index + 1}:
                      </Text>
                      {isAnswered && (
                        <Ionicons name="checkmark-circle" size={16} color={COLORS.primary} style={{ marginLeft: 8 }} />
                      )}
                    </View>
                    <Text
                      style={{
                        fontSize: 14,
                        color: COLORS.textPrimary,
                        marginBottom: 5,
                      }}
                    >
                      {question.title}
                    </Text>
                    <Text
                      style={{
                        fontSize: 14,
                        color: isAnswered ? COLORS.primary : COLORS.textSecondary,
                        fontWeight: "500",
                      }}
                    >
                      {isAnswered ? `✓ ${answers[index]}` : "Not answered - Tap to edit"}
                    </Text>
                  </View>
                  <Ionicons name="create-outline" size={20} color={COLORS.primary} />
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        <TouchableOpacity
          onPress={handleSubmit}
          style={{
            backgroundColor: COLORS.primary,
            paddingVertical: 16,
            borderRadius: 12,
            alignItems: "center",
            marginBottom: 20,
          }}
        >
          <Text
            style={{
              color: COLORS.textPrimary,
              fontSize: 16,
              fontWeight: "600",
            }}
          >
            Submit Personality Quiz
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );

  return (
    <LinearGradient
      colors={[COLORS.background, COLORS.background]}
      style={{ flex: 1 }}
    >
      <SafeAreaView style={{ flex: 1, paddingHorizontal: 20 }}>
        <StatusBar barStyle="dark-content" />
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            paddingVertical: 10,
          }}
        >
          {currentStep === 0 ? (
            <TouchableOpacity
              onPress={() => router.push("/welcome")}
              style={{ flexDirection: "row", alignItems: "center" }}
            >
              <Ionicons name="chevron-back" size={24} color={COLORS.primary} />
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: "600",
                  color: COLORS.primary,
                  marginLeft: 4,
                }}
              >
                Back
              </Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              onPress={currentStep > 0 ? handleBack : undefined}
              disabled={currentStep === 0}
              style={{ flexDirection: "row", alignItems: "center" }}
            >
              <Ionicons
                name="chevron-back"
                size={24}
                color={currentStep > 0 ? COLORS.textPrimary : COLORS.disabled}
              />
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: "600",
                  color: currentStep > 0 ? COLORS.textPrimary : COLORS.disabled,
                  marginLeft: 4,
                }}
              >
                {currentStep === 1
                  ? "Personality Quiz"
                  : currentStep === 2
                  ? "Identity Confirmation"
                  : "Summary"}
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {currentStep === 0 && renderUserInfoForm()}
        {currentStep === 1 && renderQuiz()}
        {currentStep === 2 && renderIdentityConfirmation()}
        {currentStep === 3 && renderSummary()}
      </SafeAreaView>
    </LinearGradient>
  );
}
