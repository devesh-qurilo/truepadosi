import React, { useEffect, useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Modal,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { clearError, registerRequest } from "../slices/authSlice";
import { useAppDispatch, useAppSelector } from "../store/hooks";

type OtpModalProps = {
  visible: boolean,
  onClose: () => void,
  onSuccess?: () => void,
  email?: string,
  phoneNumber?: string,
  formData: {
    firstName: string,
    lastName: string,
    email: string,
    phone: string,
    password: string,
    confirmPassword: string,
  },
  otpDetailsId: string | null,
};

const OtpModal: React.FC<OtpModalProps> = ({
  visible,
  onClose,
  onSuccess,
  email,
  phoneNumber,
  formData,
  otpDetailsId,
}) => {
  const [otp, setOtp] = useState("");
  const dispatch = useAppDispatch();
  const isLoading = useAppSelector((state) => state.auth.isLoading);
  const error = useAppSelector((state) => state.auth.error);
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const registrationSuccess = useAppSelector(
    (state) => state.auth.registrationSuccess
  );

  // Clear OTP when modal opens or closes
  useEffect(() => {
    if (visible) {
      setOtp("");
    }
  }, [visible]);

  useEffect(() => {
    if (isAuthenticated && registrationSuccess && visible) {
      console.log("User authenticated, closing OTP modal");
      if (onSuccess) {
        onSuccess();
      } else {
        onClose();
      }
    }
  }, [isAuthenticated, registrationSuccess, visible, onClose, onSuccess]);

  const handleVerifyOtp = () => {
    if (!otp) {
      Alert.alert("Error", "Please enter the OTP");
      return;
    }

    if (otp.length !== 4) {
      Alert.alert("Error", "OTP must be 4 digits");
      return;
    }

    if (!otpDetailsId) {
      Alert.alert("Error", "OTP session expired. Please request a new OTP");
      return;
    }

    const registrationData = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      phoneNumber: formData.phone,
      password: formData.password,
      confirmPassword: formData.confirmPassword,
      otp: otp,
      otpDetailsId: otpDetailsId,
    };

    dispatch(registerRequest(registrationData));
  };

  const handleResendOtp = () => {
    Alert.alert("Info", "OTP resend functionality will be implemented");
  };

  useEffect(() => {
    if (error) {
      Alert.alert("OTP Error", error);
      dispatch(clearError());
    }
  }, [error, dispatch]);

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.keyboardContainer}
        >
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Verify OTP</Text>
            <Text style={styles.modalSubtitle}>
              Enter the 4-digit OTP sent to {phoneNumber}
            </Text>

            <TextInput
              style={styles.otpInput}
              value={otp}
              onChangeText={setOtp}
              keyboardType="number-pad"
              maxLength={4}
              placeholder="Enter OTP"
              placeholderTextColor="#9CA3AF"
              autoFocus={true}
            />

            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={[
                  styles.verifyButton,
                  isLoading && styles.verifyButtonDisabled,
                ]}
                onPress={handleVerifyOtp}
                disabled={isLoading}
              >
                <Text style={styles.verifyButtonText}>
                  {isLoading ? "Verifying..." : "Verify & Sign Up"}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.cancelButton}
                onPress={onClose}
                disabled={isLoading}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={styles.resendButton}
              onPress={handleResendOtp}
              disabled={isLoading}
            >
              <Text style={styles.resendText}>Resend OTP</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  keyboardContainer: {
    width: "100%",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 24,
    width: "85%",
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#374151",
    marginBottom: 8,
  },
  modalSubtitle: {
    fontSize: 16,
    color: "#6B7280",
    textAlign: "center",
    marginBottom: 24,
  },
  otpInput: {
    height: 50,
    width: "100%",
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
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 16,
  },
  verifyButton: {
    flex: 1,
    backgroundColor: "#10B981",
    height: 50,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },
  verifyButtonDisabled: {
    backgroundColor: "#A7F3D0",
  },
  verifyButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  cancelButton: {
    flex: 1,
    backgroundColor: "#EF4444",
    height: 50,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 8,
  },
  cancelButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  resendButton: {
    marginTop: 8,
  },
  resendText: {
    color: "#8B5CF6",
    fontSize: 16,
    fontWeight: "500",
  },
});

export default OtpModal;
