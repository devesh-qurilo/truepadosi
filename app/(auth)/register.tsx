import { Image, ImageBackground } from 'expo-image';
import { useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
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
} from 'react-native';
import OtpModal from '../../src/components/OtpModal';
import { clearError, clearOtpState, sendOtpRequest } from '../../src/slices/authSlice';
import { useAppDispatch, useAppSelector } from '../../src/store/hooks';

// ✅ Import your assets (same as login screen)
const logo = require('../../assets/images/logo.png');
const background = require('../../assets/images/3d0b0760-ce28-4a8d-8036-1d43c1bdd630.png');

export default function RegisterScreen() {
  const router = useRouter();
  const hasNavigated = useRef(false);
  const [formData, setFormData] = useState({
    firstName: 'krishan',
    lastName: 'sharma',
    email: 'sharmakrish171@gmail.com',
    phone: '8822991258',
    password: '12345678',
    confirmPassword: '12345678'
  });
  
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otpDetailsId, setOtpDetailsId] = useState(null);
  
  const dispatch = useAppDispatch();
  const isLoading = useAppSelector((state) => state.auth.isLoading);
  const error = useAppSelector((state) => state.auth.error);
  const isOtpSent = useAppSelector((state) => state.auth.isOtpSent);
  const otpDetails = useAppSelector((state) => state.auth.otpDetailsId);
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const registrationSuccess = useAppSelector((state) => state.auth.registrationSuccess);

  // Add debug logs
  console.log('isOtpSent:', isOtpSent);
  console.log('otpDetails:', otpDetails);
  console.log('showOtpModal:', showOtpModal);
  console.log('formData:', formData); // Debug form data

  useEffect(() => {
    if (error) {
      Alert.alert('Registration Error', error);
      dispatch(clearError());
    }
  }, [error]);

  useEffect(() => {
    if (isAuthenticated && registrationSuccess && !hasNavigated.current) {
      hasNavigated.current = true;
      router.replace('/(auth)/communityAddress');
    }
  }, [isAuthenticated, registrationSuccess, router]);

  useEffect(() => {
    console.log('OTP Sent changed:', isOtpSent);
    console.log('OTP Details changed:', otpDetails);
    
    if (isOtpSent && otpDetails) {
      console.log('Opening OTP modal...', otpDetails);
      setOtpDetailsId(otpDetails);
      setShowOtpModal(true);
    }
  }, [isOtpSent, otpDetails]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSendOtp = () => {
    const { firstName, lastName, email, phone, password, confirmPassword } = formData;

    if (!firstName || !lastName || !email || !phone || !password || !confirmPassword) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters long');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }

    // Send OTP request with BOTH email and phoneNumber
    dispatch(sendOtpRequest({
      email: email,
      phoneNumber: phone
    }));
  };

  // Modified handleCloseOtpModal - don't clear form data
  const handleCloseOtpModal = () => {
    setShowOtpModal(false);
    // Don't clear otpDetailsId here, keep it for potential retry
    // setOtpDetailsId(null);
    dispatch(clearOtpState());
  };

  // New function to handle successful registration
  const handleRegistrationSuccess = () => {
    setShowOtpModal(false);
    setOtpDetailsId(null);
    // Only clear form data after successful registration
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      password: '',
      confirmPassword: ''
    });
    dispatch(clearOtpState());
  };

  const handleGoogleSignUp = () => {
    Alert.alert('Google Sign Up', 'Google authentication will be implemented soon');
  };

  return (
    <View style={styles.container}>
      <OtpModal
        visible={showOtpModal}
        onClose={handleCloseOtpModal}
        onSuccess={handleRegistrationSuccess} // Add success handler
        email={formData.email}
        phoneNumber={formData.phone}
        formData={formData}
        otpDetailsId={otpDetailsId}
      />
      
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
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardContainer}
        >
          <ScrollView 
            contentContainerStyle={styles.scrollContainer}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            {/* Tab Header */}
            <View style={styles.tabContainer}>
              <TouchableOpacity>
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
                    onChangeText={(value) => handleInputChange('firstName', value)}
                    placeholder="John"
                    placeholderTextColor="#9CA3AF"
                    editable={!showOtpModal} // Disable when OTP modal is open
                  />
                </View>
                <View style={styles.nameInputContainer}>
                  <Text style={styles.sectionLabel}>Last Name</Text>
                  <TextInput
                    style={styles.input}
                    value={formData.lastName}
                    onChangeText={(value) => handleInputChange('lastName', value)}
                    placeholder="Doe"
                    placeholderTextColor="#9CA3AF"
                    editable={!showOtpModal} // Disable when OTP modal is open
                  />
                </View>
              </View>

              <View style={styles.spacer} />

              {/* Email */}
              <Text style={styles.sectionLabel}>E-mail</Text>
              <TextInput
                style={styles.input}
                value={formData.email}
                onChangeText={(value) => handleInputChange('email', value)}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                placeholder="dssjkfsj@gmail.com"
                placeholderTextColor="#9CA3AF"
                editable={!showOtpModal} // Disable when OTP modal is open
              />

              <View style={styles.spacer} />

              {/* Phone */}
              <Text style={styles.sectionLabel}>Phone</Text>
              <TextInput
                style={styles.input}
                value={formData.phone}
                onChangeText={(value) => handleInputChange('phone', value)}
                keyboardType="phone-pad"
                placeholder="1728372847"
                placeholderTextColor="#9CA3AF"
                editable={!showOtpModal} // Disable when OTP modal is open
              />

              <View style={styles.spacer} />

              {/* Password */}
              <Text style={styles.sectionLabel}>Password</Text>
              <View style={styles.passwordInputContainer}>
                <TextInput
                  style={[styles.input, styles.passwordInput]}
                  value={formData.password}
                  onChangeText={(value) => handleInputChange('password', value)}
                  secureTextEntry
                  autoCapitalize="none"
                  placeholder="••••••••••••"
                  placeholderTextColor="#9CA3AF"
                  editable={!showOtpModal} // Disable when OTP modal is open
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
                  onChangeText={(value) => handleInputChange('confirmPassword', value)}
                  secureTextEntry
                  autoCapitalize="none"
                  placeholder="••••••••••••"
                  placeholderTextColor="#9CA3AF"
                  editable={!showOtpModal} // Disable when OTP modal is open
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
                  (isLoading || showOtpModal) && styles.signUpButtonDisabled
                ]}
                onPress={handleSendOtp}
                disabled={isLoading || showOtpModal}
              >
                <Text style={styles.signUpButtonText}>
                  {isLoading ? 'Sending OTP...' : 'Send OTP'}
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
                  showOtpModal && styles.googleButtonDisabled
                ]}
                onPress={handleGoogleSignUp}
                disabled={showOtpModal}
              >
                <Text style={styles.googleIcon}>G</Text>
                <Text style={styles.googleButtonText}>Continue With Google</Text>
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
    backgroundColor: '#FFFFFF',
  },
  topBackgroundContainer: {
    width: '100%',
    height: 200,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  topBackgroundImage: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    opacity: 0.5,
  },
  logoImage: {
    width: 150,
    height: 150,
    zIndex: 1,
  },
  contentContainer: {
    flex: 1,
    backgroundColor: '#F7F7F7',
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
 tabContainer: {
    flexDirection: 'row',
    marginBottom: 32,
    backgroundColor: '#E5E7EB',
    borderRadius: 25,
    padding: 4,
  },
  activeTab: {
    flex: 1,
    backgroundColor: '#10B981',
    borderRadius: 21,
    paddingVertical: 12,
    alignItems: 'center',
  },
  activeTabText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  inactiveTab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
  },
  inactiveTabText: {
    color: '#6B7280',
    fontSize: 16,
    fontWeight: '500',
  },
//
  sectionLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    backgroundColor: '#FFFFFF',
    color: '#374151',
  },
  nameRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  nameInputContainer: {
    flex: 1,
    marginHorizontal: 4,
  },
  passwordInputContainer: {
    position: 'relative',
  },
  passwordInput: {
    paddingRight: 50,
  },
  eyeIcon: {
    position: 'absolute',
    right: 16,
    top: 12,
    bottom: 12,
    justifyContent: 'center',
  },
  eyeIconText: {
    fontSize: 18,
    color: '#9CA3AF',
  },
  spacer: {
    height: 24,
  },
  signUpButton: {
    backgroundColor: '#8B5CF6',
    height: 50,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  signUpButtonDisabled: {
    backgroundColor: '#A78BFA',
  },
  signUpButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#D1D5DB',
  },
  dividerText: {
    marginHorizontal: 16,
    color: '#6B7280',
    fontSize: 14,
    fontWeight: '400',
  },
  googleButton: {
    height: 50,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 32,
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
  },
  googleButtonDisabled: {
    opacity: 0.5,
  },
  googleIcon: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#EA4335',
    marginRight: 12,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  googleButtonText: {
    color: '#374151',
    fontSize: 16,
    fontWeight: '500',
  },
});