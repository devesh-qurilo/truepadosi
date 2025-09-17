import React, { useEffect, useState } from 'react';
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
} from 'react-native';
import { clearError, registerRequest } from '../slices/authSlice';
import { useAppDispatch, useAppSelector } from '../store/hooks';

type OtpModalProps = {
  visible: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  email?: string;
  phoneNumber?: string;
  formData: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    password: string;
    confirmPassword: string;
  };
  otpDetailsId: string;
};

const OtpModal: React.FC<OtpModalProps> = ({ 
  visible, 
  onClose, 
  onSuccess, // Add success callback
  email, 
  phoneNumber, 
  formData, 
  otpDetailsId 
}) => {
  const [otp, setOtp] = useState(''); 
  const dispatch = useAppDispatch();
  const isLoading = useAppSelector((state) => state.auth.isLoading);
  const error = useAppSelector((state) => state.auth.error);
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const registrationSuccess = useAppSelector((state) => state.auth.registrationSuccess);

  // Clear OTP when modal opens
  useEffect(() => {
    if (visible) {
      setOtp('');
    }
  }, [visible]);

  useEffect(() => {
    if (isAuthenticated && registrationSuccess && visible) {
      console.log('User authenticated, closing OTP modal', isAuthenticated, visible);
      if (onSuccess) {
        onSuccess(); // Call success handler instead of just closing
      } else {
        onClose();
      }
    }
  }, [isAuthenticated, registrationSuccess, visible, onClose, onSuccess]);

  const handleVerifyOtp = () => {
    if (!otp) {
      Alert.alert('Error', 'Please enter the OTP');
      return;
    }

    if (otp.length !== 4) {
      Alert.alert('Error', 'OTP must be 4 digits');
      return;
    }

    // Debug: Log the form data being sent
    console.log('Form data before registration:', formData);
    console.log('OTP:', otp);
    console.log('OTP Details ID:', otpDetailsId);

    const registrationData = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      phoneNumber: formData.phone,
      password: formData.password,
      confirmPassword: formData.confirmPassword,
      otp: otp,
      otpDetailsId: otpDetailsId
    };

    // Debug: Log the complete registration data
    console.log('Complete registration data:', registrationData);

    dispatch(registerRequest(registrationData));
  };

  const handleResendOtp = () => {
    // You can implement resend OTP functionality here
    Alert.alert('Info', 'OTP resend functionality will be implemented');
  };

  useEffect(() => {
    if (error) {
      Alert.alert('OTP Error', error);
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
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardContainer}
        >
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Verify OTP</Text>
            <Text style={styles.modalSubtitle}>
              Enter the 4-digit OTP sent to {phoneNumber}
            </Text>

            {/* Debug info - Remove in production */}
            {/* {__DEV__ && (
              <View style={styles.debugContainer}>
                <Text style={styles.debugText}>
                  Debug: Email: {email || 'Empty'}
                </Text>
                <Text style={styles.debugText}>
                  Debug: Phone: {phoneNumber || 'Empty'}
                </Text>
                <Text style={styles.debugText}>
                  Debug: First Name: {formData?.firstName || 'Empty'}
                </Text>
              </View>
            )} */}

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
                style={[styles.verifyButton, isLoading && styles.verifyButtonDisabled]}
                onPress={handleVerifyOtp}
                disabled={isLoading}
              >
                <Text style={styles.verifyButtonText}>
                  {isLoading ? 'Verifying...' : 'Verify & Sign Up'}
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
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  keyboardContainer: {
    width: '100%',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    width: '85%',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#374151',
    marginBottom: 8,
  },
  modalSubtitle: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 24,
  },
  debugContainer: {
    backgroundColor: '#FEF2F2',
    padding: 8,
    borderRadius: 8,
    marginBottom: 16,
    width: '100%',
  },
  debugText: {
    fontSize: 12,
    color: '#DC2626',
    marginBottom: 2,
  },
  otpInput: {
    height: 50,
    width: '100%',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 18,
    backgroundColor: '#FFFFFF',
    color: '#374151',
    textAlign: 'center',
    marginBottom: 24,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 16,
  },
  verifyButton: {
    flex: 1,
    backgroundColor: '#10B981',
    height: 50,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  verifyButtonDisabled: {
    backgroundColor: '#A7F3D0',
  },
  verifyButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#EF4444',
    height: 50,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  cancelButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  resendButton: {
    marginTop: 8,
  },
  resendText: {
    color: '#8B5CF6',
    fontSize: 16,
    fontWeight: '500',
  },
});

export default OtpModal;