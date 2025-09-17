import { Image, ImageBackground } from 'expo-image';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
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
import { clearError, loginRequest } from '../../src/slices/authSlice';
import { useAppDispatch, useAppSelector } from '../../src/store/hooks';

// ✅ Import your assets
const logo = require('../../assets/images/logo.png');
const background = require('../../assets/images/3d0b0760-ce28-4a8d-8036-1d43c1bdd630.png');

export default function LoginScreen() {
  const [email, setEmail] = useState('sharmakrish171@gmail.com');
  const [password, setPassword] = useState('12345678');
  const [keepSignedIn, setKeepSignedIn] = useState(true);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const isLoading = useAppSelector((state) => state.auth.isLoading);
  const error = useAppSelector((state) => state.auth.error);

  useEffect(() => {
    if (error) {
      Alert.alert('Login Error', error);
      dispatch(clearError());
    }
  }, [error]);

  const handleLogin = () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }
    dispatch(loginRequest({ email, password }));
  };

  const handleGoogleLogin = () => {
    Alert.alert('Google Login', 'Google authentication will be implemented soon');
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
              <View style={styles.activeTab}>
                <Text style={styles.activeTabText}>Log in</Text>
              </View>
              <TouchableOpacity
                style={styles.inactiveTab}
                onPress={() => router.push('/register')}
              >
                <Text style={styles.inactiveTabText}>Sign Up</Text>
              </TouchableOpacity>
            </View>

            {/* Form Section */}
            <View style={styles.formContainer}>
              {/* Email */}
              <Text style={styles.sectionLabel}>Email Address</Text>
              <TextInput
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                placeholder="devesh2cse@gmail.com"
                placeholderTextColor="#9CA3AF"
              />
              <View style={styles.spacer} />

              {/* Password */}
              <View style={styles.passwordHeader}>
                <Text style={styles.sectionLabel}>Password</Text>
                <TouchableOpacity>
                  <Text style={styles.forgotPassword}>Forgot Password</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.passwordInputContainer}>
                <TextInput
                  style={[styles.input, styles.passwordInput]}
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                  autoCapitalize="none"
                  placeholder="••••••••••••"
                  placeholderTextColor="#9CA3AF"
                />
               
              </View>
              <View style={styles.spacer} />

              {/* Keep me signed in */}
              <View style={styles.checkboxContainer}>
                <TouchableOpacity
                  style={styles.checkbox}
                  onPress={() => setKeepSignedIn(!keepSignedIn)}
                >
                  <View style={[styles.checkboxBox, keepSignedIn && styles.checkboxChecked]}>
                    {keepSignedIn && <Text style={styles.checkmark}>✓</Text>}
                  </View>
                  <Text style={styles.checkboxLabel}>Keep me signed in</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.spacer} />

              {/* Login Button */}
              <TouchableOpacity
                style={[styles.loginButton, isLoading && styles.loginButtonDisabled]}
                onPress={handleLogin}
                disabled={isLoading}
              >
                <Text style={styles.loginButtonText}>
                  {isLoading ? 'Logging in...' : 'Login'}
                </Text>
              </TouchableOpacity>

              {/* Divider */}
              <View style={styles.dividerContainer}>
                <View style={styles.dividerLine} />
                <Text style={styles.dividerText}>— or sign in with —</Text>
                <View style={styles.dividerLine} />
              </View>

              {/* Google Login Button */}
              <TouchableOpacity style={styles.googleButton} onPress={handleGoogleLogin}>
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
  formContainer: {
    width: '100%',
  },
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
  passwordHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  forgotPassword: {
    fontSize: 14,
    color: '#10B981',
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
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkboxBox: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 4,
    marginRight: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#10B981',
    borderColor: '#10B981',
  },
  checkmark: {
    color: '#FFFFFF',
    fontSize: 12,
  },
  checkboxLabel: {
    fontSize: 14,
    color: '#374151',
  },
  loginButton: {
    backgroundColor: '#8B5CF6',
    height: 50,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  loginButtonDisabled: {
    backgroundColor: '#A78BFA',
  },
  loginButtonText: {
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
  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  signupText: {
    color: '#6B7280',
    fontSize: 16,
  },
  signupLink: {
    color: '#10B981',
    fontSize: 16,
    fontWeight: '500',
  },
  spacer: {
    height: 24,
  },
});
