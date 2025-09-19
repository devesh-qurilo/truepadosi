import { Image, ImageBackground } from "expo-image";
import { useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import {
  clearProfessionError,
  submitProfessionRequest,
} from "../../src/slices/professionSlice";
import { useAppDispatch, useAppSelector } from "../../src/store/hooks";

// ✅ Import your assets
const logo = require("../../assets/images/logo.png");
const background = require("../../assets/images/3d0b0760-ce28-4a8d-8036-1d43c1bdd630.png");

export default function ProfessionScreen() {
  const [formData, setFormData] = useState({
    profession: "",
    hourlyCharge: "",
  });

  const dispatch = useAppDispatch();
  const router = useRouter();
  const isLoading = useAppSelector((state) => state.profession.isLoading);
  const error = useAppSelector((state) => state.profession.error);
  const professionSubmitted = useAppSelector(
    (state) => state.profession.professionSubmitted
  );

  const hasNavigated = useRef(false);

  useEffect(() => {
    if (error) {
      Alert.alert("Profession Error", error);
      dispatch(clearProfessionError());
    }
  }, [error, dispatch]);

  useEffect(() => {
    if (professionSubmitted && !hasNavigated.current) {
      hasNavigated.current = true;
      router.replace("/(auth)/verification");
    }
  }, [professionSubmitted, router]);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmitProfession = () => {
    const { profession, hourlyCharge } = formData;

    if (!profession || !hourlyCharge) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    // Convert hourlyCharge to number
    const hourlyChargeNumber = parseFloat(hourlyCharge);

    if (isNaN(hourlyChargeNumber) || hourlyChargeNumber <= 0) {
      Alert.alert("Error", "Please enter a valid hourly charge");
      return;
    }

    dispatch(
      submitProfessionRequest({
        profession,
        hourlyCharge: hourlyChargeNumber,
      })
    );
  };

  return (
    <View style={styles.container}>
      {/* Top section with background and logo */}
      <View style={styles.topBackgroundContainer}>
        <ImageBackground
          source={background}
          style={styles.topBackgroundImage}
          contentFit="cover"
        />
        <Image
          style={styles.logoImage}
          source={logo}
          contentFit="contain"
          transition={300}
        />
      </View>

      {/* Main Content */}
      <View style={styles.contentContainer}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.keyboardContainer}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContainer}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            <View style={styles.header}>
              <Text style={styles.title}>Professional Details</Text>
              <Text style={styles.subtitle}>Tell us about your profession</Text>
            </View>

            <View style={styles.formContainer}>
              {/* Profession */}
              <Text style={styles.sectionLabel}>Profession *</Text>
              <TextInput
                style={styles.input}
                value={formData.profession}
                onChangeText={(value) => handleInputChange("profession", value)}
                placeholder="e.g., Software Developer, Designer, Consultant"
                placeholderTextColor="#9CA3AF"
              />

              <View style={styles.spacer} />

              {/* Hourly Charge */}
              <Text style={styles.sectionLabel}>Hourly Charge (₹) *</Text>
              <TextInput
                style={styles.input}
                value={formData.hourlyCharge}
                onChangeText={(value) =>
                  handleInputChange("hourlyCharge", value)
                }
                keyboardType="numeric"
                placeholder="e.g., 1500"
                placeholderTextColor="#9CA3AF"
              />

              <View style={styles.spacer} />

              {/* Submit Button */}
              <TouchableOpacity
                style={[
                  styles.submitButton,
                  isLoading && styles.submitButtonDisabled,
                ]}
                onPress={handleSubmitProfession}
                disabled={isLoading}
              >
                <Text style={styles.submitButtonText}>
                  {isLoading ? "Saving..." : "Save Profession"}
                </Text>
              </TouchableOpacity>

              {/* Skip for now button */}
              <TouchableOpacity
                style={styles.skipButton}
                onPress={() => router.replace("/(tabs)/home")}
                disabled={isLoading}
              >
                <Text style={styles.skipButtonText}>Skip for now</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  topBackgroundContainer: {
    width: "100%",
    height: 200,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  topBackgroundImage: {
    position: "absolute",
    width: "100%",
    height: "100%",
    opacity: 0.5,
  },
  logoImage: {
    width: 150,
    height: 150,
    zIndex: 1,
  },
  contentContainer: {
    flex: 1,
    backgroundColor: "#F7F7F7",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    marginTop: -24,
    paddingTop: 24,
  },
  keyboardContainer: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingBottom: 32,
  },
  header: {
    alignItems: "center",
    marginBottom: 32,
  },
  title: {
    fontSize: 24,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: "#6B7280",
    textAlign: "center",
  },
  formContainer: {
    width: "100%",
  },
  sectionLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 8,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    backgroundColor: "#FFFFFF",
    color: "#374151",
  },
  spacer: {
    height: 24,
  },
  submitButton: {
    backgroundColor: "#8B5CF6",
    height: 50,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  submitButtonDisabled: {
    backgroundColor: "#A78BFA",
  },
  submitButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  skipButton: {
    height: 50,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#D1D5DB",
  },
  skipButtonText: {
    color: "#6B7280",
    fontSize: 16,
    fontWeight: "500",
  },
});
