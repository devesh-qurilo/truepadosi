import DateTimePicker from '@react-native-community/datetimepicker';
import { Image, ImageBackground } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
  Alert,
  Animated,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { clearProfileUpdateError, updateProfileRequest } from '../../src/slices/profileUpdateSlice';
import { useAppDispatch, useAppSelector } from '../../src/store/hooks';

const { width, height } = Dimensions.get('window');

export default function ProfileUpdateScreen() {
  const [formData, setFormData] = useState({
    gender: '',
    dateOfBirth: '',
  });

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const progressAnim = useRef(new Animated.Value(0)).current;

  const dispatch = useAppDispatch();
  const router = useRouter();
  const isLoading = useAppSelector((state) => state.profileUpdate.isLoading);
  const error = useAppSelector((state) => state.profileUpdate.error);
  const profileUpdated = useAppSelector((state) => state.profileUpdate.profileUpdated);

  const hasNavigated = useRef(false);
  const logo = require('../../assets/images/logo.png');
  const background = require('../../assets/images/3d0b0760-ce28-4a8d-8036-1d43c1bdd630.png');

  useEffect(() => {
    Animated.timing(progressAnim, {
      toValue: 0.4,
      duration: 1000,
      useNativeDriver: false,
    }).start();
  }, []);

  useEffect(() => {
    if (error) {
      Alert.alert('Profile Update Error', error);
      dispatch(clearProfileUpdateError());
    }
  }, [error, dispatch]);

  useEffect(() => {
    if (profileUpdated && !hasNavigated.current) {
      hasNavigated.current = true;
      router.replace('/(auth)/communityAddress');
    }
  }, [profileUpdated, router]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleDateChange = (event, date) => {
    setShowDatePicker(false);
    if (date) {
      setSelectedDate(date);
      const formattedDate = date.toISOString().split('T')[0];
      handleInputChange('dateOfBirth', formattedDate);
    }
  };

  const showDatepicker = () => {
    setShowDatePicker(true);
  };

  const handleSubmitProfile = () => {
    const { gender, dateOfBirth } = formData;
    if (!gender || !dateOfBirth) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }
    if (!['Male', 'Female', 'Other'].includes(gender)) {
      Alert.alert('Error', 'Please select a valid gender');
      return;
    }
    const dobDate = new Date(dateOfBirth);
    const today = new Date();
    if (dobDate >= today) {
      Alert.alert('Error', 'Date of birth must be in the past');
      return;
    }
    dispatch(updateProfileRequest(formData));
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Select your date of birth';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const genderOptions = [
    { value: 'Male', icon: '👨', color: '#3b82f6' },
    { value: 'Female', icon: '👩', color: '#ec4899' },
    { value: 'Other', icon: '👤', color: '#8b5cf6' }
  ];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1a1a2e" />
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
          >
            <View style={styles.formContainer}>
              {/* Gender Section */}
              <View style={styles.sectionContainer}>
                <Text style={styles.sectionTitle}>Gender</Text>
                <Text style={styles.sectionDescription}>Select your gender identity</Text>

                <View style={styles.genderContainer}>
                  {genderOptions.map((option) => (
                    <TouchableOpacity
                      key={option.value}
                      style={[
                        styles.genderOption,
                        formData.gender === option.value && [
                          styles.genderOptionSelected,
                          { borderColor: option.color }
                        ]
                      ]}
                      onPress={() => handleInputChange('gender', option.value)}
                      activeOpacity={0.7}
                    >
                      <View style={[
                        styles.genderIconContainer,
                        formData.gender === option.value && { backgroundColor: option.color }
                      ]}>
                        <Text style={styles.genderIcon}>{option.icon}</Text>
                      </View>
                      <Text style={[
                        styles.genderLabel,
                        formData.gender === option.value && { color: option.color, fontWeight: '600' }
                      ]}>
                        {option.value}
                      </Text>
                      <View style={[
                        styles.radioCircle,
                        formData.gender === option.value && [
                          styles.radioCircleSelected,
                          { backgroundColor: option.color, borderColor: option.color }
                        ]
                      ]}>
                        {formData.gender === option.value && (
                          <View style={styles.radioInnerCircle} />
                        )}
                      </View>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Date of Birth Section */}
              <View style={styles.sectionContainer}>
                <Text style={styles.sectionTitle}>Date of Birth</Text>
                <Text style={styles.sectionDescription}>When were you born?</Text>

                <TouchableOpacity
                  style={[
                    styles.dateInputContainer,
                    formData.dateOfBirth && styles.dateInputContainerFilled
                  ]}
                  onPress={showDatepicker}
                  activeOpacity={0.8}
                >
                  <View style={styles.dateIconContainer}>
                    <Text style={styles.dateIcon}>📅</Text>
                  </View>
                  <View style={styles.dateTextContainer}>
                    <Text style={[
                      styles.dateText,
                      !formData.dateOfBirth && styles.datePlaceholder
                    ]}>
                      {formatDate(formData.dateOfBirth)}
                    </Text>
                  </View>
                  <View style={styles.chevronContainer}>
                    <Text style={styles.chevronIcon}>▼</Text>
                  </View>
                </TouchableOpacity>
                {showDatePicker && (
                  <DateTimePicker
                    value={selectedDate}
                    mode="date"
                    display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                    onChange={handleDateChange}
                    maximumDate={new Date()}
                  />
                )}
              </View>

              {/* Action Buttons */}
              <View style={styles.actionContainer}>
                <TouchableOpacity
                  style={[
                    styles.continueButton,
                    isLoading && styles.continueButtonDisabled,
                    (!formData.gender || !formData.dateOfBirth) && styles.continueButtonDisabled
                  ]}
                  onPress={handleSubmitProfile}
                  disabled={isLoading || !formData.gender || !formData.dateOfBirth}
                  activeOpacity={0.9}
                >
                  <LinearGradient
                    colors={
                      isLoading || (!formData.gender || !formData.dateOfBirth)
                        ? ['#A78BFA', '#D8B4FE']
                        : ['#8B5CF6', '#7C3AED']
                    }
                    style={styles.continueGradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                  >
                    <Text style={styles.continueButtonText}>
                      {isLoading ? 'Updating...' : 'Continue'}
                    </Text>
                  </LinearGradient>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.skipButton}
                  onPress={() => router.replace('/(tabs)/services')}
                  disabled={isLoading}
                  activeOpacity={0.8}
                >
                  <Text style={styles.skipButtonText}>Skip for now</Text>
                </TouchableOpacity>
              </View>
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
  formContainer: {
    width: '100%',
  },
  sectionContainer: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  sectionDescription: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 20,
  },
  genderContainer: {
    gap: 12,
  },
  genderOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
  },
  genderOptionSelected: {
    backgroundColor: '#F3F4F6',
    borderWidth: 2,
  },
  genderIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  genderIcon: {
    fontSize: 20,
  },
  genderLabel: {
    flex: 1,
    fontSize: 16,
    color: '#374151',
    fontWeight: '500',
  },
  radioCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  radioCircleSelected: {
    backgroundColor: '#8B5CF6',
    borderColor: '#8B5CF6',
  },
  radioInnerCircle: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FFFFFF',
  },
  dateInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    minHeight: 64,
  },
  dateInputContainerFilled: {
    borderColor: '#8B5CF6',
    backgroundColor: '#F3F4F6',
  },
  dateIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  dateIcon: {
    fontSize: 20,
  },
  dateTextContainer: {
    flex: 1,
  },
  dateText: {
    fontSize: 16,
    color: '#374151',
    fontWeight: '500',
  },
  datePlaceholder: {
    color: '#9CA3AF',
    fontWeight: '400',
  },
  chevronContainer: {
    padding: 4,
  },
  chevronIcon: {
    fontSize: 12,
    color: '#6B7280',
  },
  actionContainer: {
    marginTop: 32,
    paddingBottom: 32,
  },
  continueButton: {
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#8B5CF6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  continueButtonDisabled: {
    shadowOpacity: 0.1,
    elevation: 2,
  },
  continueGradient: {
    paddingVertical: 16,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  continueButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  skipButton: {
    paddingVertical: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
  },
  skipButtonText: {
    color: '#6B7280',
    fontSize: 16,
    fontWeight: '500',
  },
});
