import { Image, ImageBackground } from "expo-image";
import { useRouter, useFocusEffect } from "expo-router";
import React, { useEffect, useRef, useState, useCallback } from "react";
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
  Modal,
  Animated,
} from "react-native";
import {
  clearError,
  clearOtpState,
  sendOtpRequest,
} from "../../src/slices/authSlice";
import { useAppDispatch, useAppSelector } from "../../src/store/hooks";

// ✅ Import your assets (same as login screen)
const logo = require("../../assets/images/logo.png");
const background = require("../../assets/images/3d0b0760-ce28-4a8d-8036-1d43c1bdd630.png");

export default function RegisterScreen() {
  const router = useRouter();
  const hasNavigated = useRef(false);
  const [formData, setFormData] = useState({
    firstName: "krishan",
    lastName: "sharma",
    email: "sharmakrish1gdgdg71@gmail.com",
    phone: "8299206978",
    password: "12345678",
    confirmPassword: "12345678",
  });

  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otpDetailsId, setOtpDetailsId] = useState(null);
  const slideAnim = useRef(new Animated.Value(0)).current;

  const dispatch = useAppDispatch();
  const isLoading = useAppSelector((state) => state.auth.isLoading);
  const error = useAppSelector((state) => state.auth.error);
  const isOtpSent = useAppSelector((state) => state.auth.isOtpSent);
  const otpDetails = useAppSelector((state) => state.auth.otpDetailsId);
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const registrationSuccess = useAppSelector(
    (state) => state.auth.registrationSuccess
  );

  // Reset state when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      // Reset OTP-related states when screen is focused
      setShowOtpModal(false);
      setOtpDetailsId(null);
      dispatch(clearOtpState());
    }, [dispatch])
  );

  // Animate modal when it opens/closes
  useEffect(() => {
    if (showOtpModal) {
      Animated.timing(slideAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [showOtpModal]);

  useEffect(() => {
    if (error) {
      Alert.alert("Registration Error", error);
      dispatch(clearError());
    }
  }, [error]);

  useEffect(() => {
    if (isAuthenticated && registrationSuccess && !hasNavigated.current) {
      hasNavigated.current = true;
      router.replace("/(auth)/communityAddress");
    }
  }, [isAuthenticated, registrationSuccess, router]);

  useEffect(() => {
    console.log("OTP Sent changed:", isOtpSent);
    console.log("OTP Details changed:", otpDetails);

    if (isOtpSent && otpDetails) {
      console.log("Opening OTP modal...", otpDetails);
      setOtpDetailsId(otpDetails);
      setShowOtpModal(true);
    }
  }, [isOtpSent, otpDetails]);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSendOtp = () => {
    const { firstName, lastName, email, phone, password, confirmPassword } =
      formData;

    if (
      !firstName ||
      !lastName ||
      !email ||
      !phone ||
      !password ||
      !confirmPassword
    ) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match");
      return;
    }

    if (password.length < 6) {
      Alert.alert("Error", "Password must be at least 6 characters long");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert("Error", "Please enter a valid email address");
      return;
    }

    // For testing: directly show the modal without API call
    setShowOtpModal(true);

    // In production, you would use:
    dispatch(
      sendOtpRequest({
        email: email,
        phoneNumber: phone,
      })
    );
  };

  const handleCloseOtpModal = () => {
    setShowOtpModal(false);
    setOtpDetailsId(null);
    dispatch(clearOtpState());
  };

  const handleRegistrationSuccess = () => {
    setShowOtpModal(false);
    setOtpDetailsId(null);
    // Clear form data after successful registration
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
    });
    dispatch(clearOtpState());

    // Navigate to next screen
    router.replace("/(auth)/communityAddress");
  };

  const handleGoogleSignUp = () => {
    Alert.alert(
      "Google Sign Up",
      "Google authentication will be implemented soon"
    );
  };

  // Simple OTP Modal Component (embedded)
  const OtpModal = () => {
    const [otp, setOtp] = useState("");
    const [isVerifying, setIsVerifying] = useState(false);

    const handleVerifyOtp = () => {
      if (!otp) {
        Alert.alert("Error", "Please enter the OTP");
        return;
      }

      if (otp.length !== 4) {
        Alert.alert("Error", "OTP must be 4 digits");
        return;
      }

      setIsVerifying(true);

      // Simulate API call
      setTimeout(() => {
        setIsVerifying(false);
        Alert.alert("Success", "OTP verified successfully!");
        handleRegistrationSuccess();
      }, 1500);
    };

    const handleResendOtp = () => {
      Alert.alert("Info", "OTP has been resent");
      // In a real app, you would dispatch an action to resend OTP
    };

    const modalTranslateY = slideAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [600, 0],
    });

    return (
      <Modal
        visible={showOtpModal}
        transparent={true}
        animationType="none"
        onRequestClose={handleCloseOtpModal}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={handleCloseOtpModal}
        >
          <Animated.View
            style={[
              styles.modalContainer,
              { transform: [{ translateY: modalTranslateY }] },
            ]}
          >
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Verify OTP</Text>
              <TouchableOpacity onPress={handleCloseOtpModal}>
                <Text style={styles.closeButton}>✕</Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.modalSubtitle}>
              Enter the 4-digit OTP sent to {formData.phone}
            </Text>

            <TextInput
              style={styles.otpInput}
              value={otp}
              onChangeText={setOtp}
              keyboardType="number-pad"
              maxLength={4}
              placeholder="1234"
              placeholderTextColor="#9CA3AF"
              autoFocus={true}
            />

            <TouchableOpacity
              style={[
                styles.verifyButton,
                isVerifying && styles.verifyButtonDisabled,
              ]}
              onPress={handleVerifyOtp}
              disabled={isVerifying}
            >
              <Text style={styles.verifyButtonText}>
                {isVerifying ? "Verifying..." : "Verify & Sign Up"}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.resendButton}
              onPress={handleResendOtp}
              disabled={isVerifying}
            >
              <Text style={styles.resendText}>Resend OTP</Text>
            </TouchableOpacity>
          </Animated.View>
        </TouchableOpacity>
      </Modal>
    );
  };

  return (
    <View style={styles.container}>
      <OtpModal />

      {/* Top section with background and logo (same as login screen) */}
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
            {/* Tab Header */}
            {/* <View style={styles.tabContainer}>
              <TouchableOpacity onPress={() => router.push("/(auth)/login")}>
                <Text style={styles.inactiveTabText}>Log in</Text>
              </TouchableOpacity>
              <View style={styles.activeTab}>
                <Text style={styles.activeTabText}>Sign Up</Text>
              </View>
            </View> */}

            <View style={styles.tabContainer}>
              <TouchableOpacity
                style={styles.inactiveTab}
                onPress={() => router.push("/login")}
              >
                <Text style={styles.inactiveTabText}>Log in</Text>
              </TouchableOpacity>
              <View style={styles.activeTab}>
                <Text style={styles.activeTabText}>Sign Up</Text>
              </View>
            </View>

            <View style={styles.formContainer}>
              {/* Name Row */}
              <View style={styles.nameRow}>
                <View style={styles.nameInputContainer}>
                  <Text style={styles.sectionLabel}>First Name</Text>
                  <TextInput
                    style={styles.input}
                    value={formData.firstName}
                    onChangeText={(value) =>
                      handleInputChange("firstName", value)
                    }
                    placeholder="John"
                    placeholderTextColor="#9CA3AF"
                    editable={!showOtpModal}
                  />
                </View>
                <View style={styles.nameInputContainer}>
                  <Text style={styles.sectionLabel}>Last Name</Text>
                  <TextInput
                    style={styles.input}
                    value={formData.lastName}
                    onChangeText={(value) =>
                      handleInputChange("lastName", value)
                    }
                    placeholder="Doe"
                    placeholderTextColor="#9CA3AF"
                    editable={!showOtpModal}
                  />
                </View>
              </View>

              <View style={styles.spacer} />

              {/* Email */}
              <Text style={styles.sectionLabel}>E-mail</Text>
              <TextInput
                style={styles.input}
                value={formData.email}
                onChangeText={(value) => handleInputChange("email", value)}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                placeholder="example@gmail.com"
                placeholderTextColor="#9CA3AF"
                editable={!showOtpModal}
              />

              <View style={styles.spacer} />

              {/* Phone */}
              <Text style={styles.sectionLabel}>Phone</Text>
              <TextInput
                style={styles.input}
                value={formData.phone}
                onChangeText={(value) => handleInputChange("phone", value)}
                keyboardType="phone-pad"
                placeholder="1234567890"
                placeholderTextColor="#9CA3AF"
                editable={!showOtpModal}
              />

              <View style={styles.spacer} />

              {/* Password */}
              <Text style={styles.sectionLabel}>Password</Text>
              <View style={styles.passwordInputContainer}>
                <TextInput
                  style={[styles.input, styles.passwordInput]}
                  value={formData.password}
                  onChangeText={(value) => handleInputChange("password", value)}
                  secureTextEntry
                  autoCapitalize="none"
                  placeholder="••••••••••••"
                  placeholderTextColor="#9CA3AF"
                  editable={!showOtpModal}
                />
                <TouchableOpacity style={styles.eyeIcon}>
                  <Text style={styles.eyeIconText}>👁</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.spacer} />

              {/* Confirm Password */}
              <Text style={styles.sectionLabel}>Confirm Password</Text>
              <View style={styles.passwordInputContainer}>
                <TextInput
                  style={[styles.input, styles.passwordInput]}
                  value={formData.confirmPassword}
                  onChangeText={(value) =>
                    handleInputChange("confirmPassword", value)
                  }
                  secureTextEntry
                  autoCapitalize="none"
                  placeholder="••••••••••••"
                  placeholderTextColor="#9CA3AF"
                  editable={!showOtpModal}
                />
                <TouchableOpacity style={styles.eyeIcon}>
                  <Text style={styles.eyeIconText}>👁</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.spacer} />

              {/* Sign Up Button */}
              <TouchableOpacity
                style={[
                  styles.signUpButton,
                  (isLoading || showOtpModal) && styles.signUpButtonDisabled,
                ]}
                onPress={handleSendOtp}
                disabled={isLoading || showOtpModal}
              >
                <Text style={styles.signUpButtonText}>
                  {isLoading ? "Sending OTP..." : "Send OTP"}
                </Text>
              </TouchableOpacity>

              {/* Divider */}
              <View style={styles.dividerContainer}>
                <View style={styles.dividerLine} />
                <Text style={styles.dividerText}>— or sign up with —</Text>
                <View style={styles.dividerLine} />
              </View>

              {/* Google Sign Up Button */}
              <TouchableOpacity
                style={[
                  styles.googleButton,
                  showOtpModal && styles.googleButtonDisabled,
                ]}
                onPress={handleGoogleSignUp}
                disabled={showOtpModal}
              >
                <Text style={styles.googleIcon}>G</Text>
                <Text style={styles.googleButtonText}>
                  Continue With Google
                </Text>
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
    height: 200,
    position: "relative",
  },
  topBackgroundImage: {
    width: "100%",
    height: "100%",
  },
  logoImage: {
    position: "absolute",
    width: 100,
    height: 100,
    alignSelf: "center",
    top: 50,
  },
  contentContainer: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    marginTop: -20,
  },
  keyboardContainer: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingBottom: 80,
    marginBottom: 50,
  },
  // tabContainer: {
  //   flexDirection: "row",
  //   justifyContent: "center",
  //   marginTop: 24,
  //   marginBottom: 32,
  // },
  // inactiveTabText: {
  //   fontSize: 18,
  //   color: "#9CA3AF",
  //   paddingHorizontal: 16,
  //   paddingVertical: 8,
  // },
  // activeTab: {
  //   borderBottomWidth: 2,
  //   borderBottomColor: "#8B5CF6",
  // },
  // activeTabText: {
  //   fontSize: 18,
  //   fontWeight: "600",
  //   color: "#8B5CF6",
  //   paddingHorizontal: 16,
  //   paddingVertical: 8,
  // },
  tabContainer: {
    flexDirection: "row",
    marginBottom: 32,
    backgroundColor: "#E5E7EB",
    borderRadius: 25,
    padding: 4,
    marginTop: 24,
  },
  activeTab: {
    flex: 1,
    backgroundColor: "#10B981",
    borderRadius: 21,
    paddingVertical: 12,
    alignItems: "center",
  },
  activeTabText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  inactiveTab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
  },
  inactiveTabText: {
    color: "#6B7280",
    fontSize: 16,
    fontWeight: "500",
  },
  formContainer: {
    flex: 1,
  },
  nameRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  nameInputContainer: {
    width: "48%",
  },
  sectionLabel: {
    fontSize: 14,
    fontWeight: "500",
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
    height: 16,
  },
  passwordInputContainer: {
    position: "relative",
  },
  passwordInput: {
    paddingRight: 50,
  },
  eyeIcon: {
    position: "absolute",
    right: 16,
    top: 12,
  },
  eyeIconText: {
    fontSize: 20,
  },
  signUpButton: {
    backgroundColor: "#8B5CF6",
    height: 50,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 8,
  },
  signUpButtonDisabled: {
    backgroundColor: "#A7F3D0",
  },
  signUpButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#E5E7EB",
  },
  dividerText: {
    marginHorizontal: 16,
    color: "#6B7280",
    fontSize: 14,
  },
  googleButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
    height: 50,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#D1D5DB",
  },
  googleButtonDisabled: {
    opacity: 0.5,
  },
  googleIcon: {
    fontSize: 20,
    fontWeight: "bold",
    marginRight: 12,
    color: "#374151",
  },
  googleButtonText: {
    color: "#374151",
    fontSize: 16,
    fontWeight: "500",
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContainer: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 24,
    minHeight: 350,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#374151",
  },
  closeButton: {
    fontSize: 24,
    color: "#6B7280",
  },
  modalSubtitle: {
    fontSize: 16,
    color: "#6B7280",
    marginBottom: 24,
  },
  otpInput: {
    height: 50,
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 18,
    backgroundColor: "#FFFFFF",
    color: "#374151",
    textAlign: "center",
    marginBottom: 24,
  },
  verifyButton: {
    backgroundColor: "#10B981",
    height: 50,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  verifyButtonDisabled: {
    backgroundColor: "#A7F3D0",
  },
  verifyButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  resendButton: {
    alignItems: "center",
  },
  resendText: {
    color: "#8B5CF6",
    fontSize: 16,
    fontWeight: "500",
  },
});
