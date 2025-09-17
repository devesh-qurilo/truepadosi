import { Image, ImageBackground } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Animated,
  Dimensions,
  FlatList,
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View
} from 'react-native';
import citiesAndStates from '../../data/cities_and_states.json';
import { clearAddressError, submitAddressRequest } from '../../src/slices/addressSlice';
import { useAppDispatch, useAppSelector } from '../../src/store/hooks';

const { width, height } = Dimensions.get('window');

interface CitiesAndStates {
  states: string[];
  cities: { [key: string]: string[] };
}

interface PostOffice {
  Name: string;
  Description: null | string;
  BranchType: string;
  DeliveryStatus: string;
  Circle: string;
  District: string;
  Division: string;
  Region: string;
  State: string;
  Country: string;
  Pincode: string;
}

interface PincodeApiResponse {
  Message: string;
  Status: string;
  PostOffice: PostOffice[];
}

const typedCitiesAndStates = citiesAndStates as CitiesAndStates;
const STATES = typedCitiesAndStates.states;
const CITIES = typedCitiesAndStates.cities;

const logo = require('../../assets/images/logo.png');
const background = require('../../assets/images/3d0b0760-ce28-4a8d-8036-1d43c1bdd630.png');

interface FormData {
  country: string;
  state: string;
  city: string;
  pincode: string;
}

interface DropdownSelectorProps {
  label: string;
  value: string;
  placeholder: string;
  options: string[];
  onSelect: (value: string) => void;
  disabled?: boolean;
  icon: string;
}

const DropdownSelector: React.FC<DropdownSelectorProps> = ({
  label,
  value,
  placeholder,
  options,
  onSelect,
  disabled = false,
  icon,
}) => {
  const [modalVisible, setModalVisible] = useState(false);

  const handleSelect = (item: string) => {
    onSelect(item);
    setModalVisible(false);
  };

  return (
    <View style={styles.inputGroup}>
      <Text style={styles.inputLabel}>{label}</Text>
      <TouchableOpacity
        style={[
          styles.dropdownContainer,
          disabled && styles.dropdownContainerDisabled,
          value && styles.dropdownContainerFilled,
        ]}
        onPress={() => !disabled && setModalVisible(true)}
        disabled={disabled}
        activeOpacity={0.8}
      >
        <View style={styles.dropdownIconContainer}>
          <Text style={styles.dropdownIcon}>{icon}</Text>
        </View>
        <View style={styles.dropdownTextContainer}>
          <Text style={[styles.dropdownText, !value && styles.dropdownPlaceholder]}>
            {value || placeholder}
          </Text>
        </View>
        <View style={styles.chevronContainer}>
          <Text style={[styles.chevronIcon, disabled && styles.chevronIconDisabled]}>▼</Text>
        </View>
      </TouchableOpacity>
      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select {label}</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.modalCloseButton}>
                <Text style={styles.modalCloseText}>✕</Text>
              </TouchableOpacity>
            </View>
            <FlatList
              data={options}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.modalOptionItem}
                  onPress={() => handleSelect(item)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.modalOptionText}>{item}</Text>
                </TouchableOpacity>
              )}
              showsVerticalScrollIndicator={false}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default function CommunityAddressScreen() {
  const [formData, setFormData] = useState<FormData>({
    country: 'India',
    state: '',
    city: '',
    pincode: '',
  });

  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const [pincodeFocused, setPincodeFocused] = useState(false);
  const [pincodeOptions, setPincodeOptions] = useState<string[]>([]);
  const [pincodeModalVisible, setPincodeModalVisible] = useState(false);
  const [loadingPincodes, setLoadingPincodes] = useState(false);
  const [manualPincodeEntry, setManualPincodeEntry] = useState(false);
  
  const progressAnim = useRef(new Animated.Value(0)).current;
  const scrollViewRef = useRef<ScrollView>(null);
  const pincodeInputRef = useRef<TextInput>(null);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const isLoading = useAppSelector((state: any) => state.address.isLoading);
  const error = useAppSelector((state: any) => state.address.error);
  const addressSubmitted = useAppSelector((state: any) => state.address.addressSubmitted);
  const hasNavigated = useRef(false);
  const availableCities = formData.state ? CITIES[formData.state] || [] : [];

  const progressBarWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  useEffect(() => {
    Animated.timing(progressAnim, {
      toValue: 0.6,
      duration: 1000,
      useNativeDriver: false,
    }).start();
  }, []);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        setKeyboardVisible(true);
      }
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        setKeyboardVisible(false);
      }
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  useEffect(() => {
    if (error) {
      Alert.alert('Address Error', error);
      dispatch(clearAddressError());
    }
  }, [error, dispatch]);

  useEffect(() => {
    if (addressSubmitted && !hasNavigated.current) {
      hasNavigated.current = true;
      const timer = setTimeout(() => {
        router.replace('/(auth)/verification');
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [addressSubmitted, router]);

  // Fetch pincodes when city changes
  useEffect(() => {
    if (formData.city) {
      fetchPincodes(formData.city);
    } else {
      setPincodeOptions([]);
      setFormData(prev => ({ ...prev, pincode: '' }));
    }
  }, [formData.city]);

  const fetchPincodes = async (city: string) => {
    setLoadingPincodes(true);
    try {
      const response = await fetch(`https://api.postalpincode.in/postoffice/${encodeURIComponent(city)}`);
      const data: PincodeApiResponse[] = await response.json();
      
      if (data && data[0]?.Status === 'Success' && data[0]?.PostOffice) {
        // Extract unique pincodes
        const uniquePincodes = Array.from(
          new Set(data[0].PostOffice.map(office => office.Pincode))
        );
        setPincodeOptions(uniquePincodes);
      } else {
        setPincodeOptions([]);
        Alert.alert('Info', 'No pincodes found for this city. Please enter manually.');
        setManualPincodeEntry(true);
      }
    } catch (error) {
      console.error('Error fetching pincodes:', error);
      Alert.alert('Error', 'Failed to fetch pincodes. Please enter manually.');
      setManualPincodeEntry(true);
    } finally {
      setLoadingPincodes(false);
    }
  };

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => {
      const newData = { ...prev, [field]: value };
      if (field === 'state') {
        newData.city = '';
        newData.pincode = '';
        setPincodeOptions([]);
        setManualPincodeEntry(false);
      }
      if (field === 'city') {
        newData.pincode = '';
        setManualPincodeEntry(false);
      }
      return newData;
    });
  };

  const handlePincodeSelect = (pincode: string) => {
    setFormData(prev => ({ ...prev, pincode }));
    setPincodeModalVisible(false);
    setManualPincodeEntry(false);
  };

  const handleManualPincodeEntry = () => {
    setManualPincodeEntry(true);
    setPincodeModalVisible(false);
    setTimeout(() => {
      pincodeInputRef.current?.focus();
    }, 100);
  };

  const handleSubmitAddress = async () => {
    const { state, city, pincode } = formData;
    if (!state || !city || !pincode) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }
    if (!/^\d{6}$/.test(pincode)) {
      Alert.alert('Error', 'Pincode must be a 6-digit number');
      return;
    }
    await dispatch(submitAddressRequest(formData));
  };

  const handlePincodeFocus = () => {
    setPincodeFocused(true);
    // Use setTimeout to ensure the scroll happens after the keyboard is fully shown
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  const isFormValid = formData.state && formData.city && formData.pincode.length === 6;

  return (
    <TouchableWithoutFeedback onPress={dismissKeyboard}>
      <View style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#1a1a2e" />
        <View style={[styles.topBackgroundContainer, keyboardVisible && styles.topBackgroundContainerSmall]}>
          <ImageBackground source={background} style={styles.topBackgroundImage} contentFit="cover" />
          <Image style={[styles.logoImage, keyboardVisible && styles.logoImageSmall]} source={logo} contentFit="contain" transition={300} />
        </View>

        <View style={[styles.progressContainer, keyboardVisible && styles.progressContainerHidden]}>
          <View style={styles.progressBarBackground}>
            <Animated.View style={[styles.progressBarFill, { width: progressBarWidth }]} />
          </View>
          <Text style={styles.progressText}>Step 2 of 3</Text>
        </View>

        <KeyboardAvoidingView
          style={styles.contentContainer}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 80 : 0}
        >
          <ScrollView
            ref={scrollViewRef}
            contentContainerStyle={[
              styles.scrollContainer, 
              keyboardVisible && styles.scrollContainerKeyboardVisible
            ]}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.formContainer}>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Country</Text>
                <View style={[styles.dropdownContainer, styles.dropdownContainerDisabled]}>
                  <View style={styles.dropdownIconContainer}>
                    <Text style={styles.dropdownIcon}>🇮🇳</Text>
                  </View>
                  <View style={styles.dropdownTextContainer}>
                    <Text style={styles.dropdownText}>India</Text>
                  </View>
                  <View style={styles.lockContainer}>
                    <Text style={styles.lockIcon}>🔒</Text>
                  </View>
                </View>
              </View>

              <DropdownSelector
                label="State"
                value={formData.state}
                placeholder="Select your state"
                options={STATES}
                onSelect={(value) => handleInputChange('state', value)}
                icon="🏛️"
              />
              <DropdownSelector
                label="City"
                value={formData.city}
                placeholder="Select your city"
                options={availableCities}
                onSelect={(value) => handleInputChange('city', value)}
                disabled={!formData.state}
                icon="🏙️"
              />

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>PIN Code</Text>
                
                {!manualPincodeEntry && pincodeOptions.length > 0 ? (
                  <>
                    <TouchableOpacity
                      style={[
                        styles.dropdownContainer,
                        formData.pincode && styles.dropdownContainerFilled,
                      ]}
                      onPress={() => setPincodeModalVisible(true)}
                      activeOpacity={0.8}
                    >
                      <View style={styles.dropdownIconContainer}>
                        <Text style={styles.dropdownIcon}>📮</Text>
                      </View>
                      <View style={styles.dropdownTextContainer}>
                        <Text style={[styles.dropdownText, !formData.pincode && styles.dropdownPlaceholder]}>
                          {formData.pincode || 'Select PIN code'}
                        </Text>
                      </View>
                      <View style={styles.chevronContainer}>
                        <Text style={styles.chevronIcon}>▼</Text>
                      </View>
                    </TouchableOpacity>
                    
                    <TouchableOpacity 
                      onPress={handleManualPincodeEntry}
                      style={styles.manualEntryButton}
                    >
                      <Text style={styles.manualEntryText}>Enter PIN code manually</Text>
                    </TouchableOpacity>
                  </>
                ) : (
                  <View
                    style={[
                      styles.pincodeContainer,
                      pincodeFocused && styles.pincodeContainerFocused,
                      formData.pincode && styles.pincodeContainerFilled,
                    ]}
                  >
                    <View style={styles.pincodeIconContainer}>
                      <Text style={styles.pincodeIcon}>📮</Text>
                    </View>
                    <TextInput
                      ref={pincodeInputRef}
                      style={styles.pincodeInput}
                      value={formData.pincode}
                      onChangeText={(value) => handleInputChange('pincode', value.replace(/[^0-9]/g, ''))}
                      keyboardType="number-pad"
                      maxLength={6}
                      placeholder="Enter 6-digit PIN code"
                      placeholderTextColor="#9ca3af"
                      onFocus={handlePincodeFocus}
                      onBlur={() => setPincodeFocused(false)}
                      returnKeyType="done"
                    />
                    {formData.pincode.length === 6 && (
                      <View style={styles.validationContainer}>
                        <Text style={styles.validationIcon}>✓</Text>
                      </View>
                    )}
                  </View>
                )}
                
                {loadingPincodes && (
                  <View style={styles.loadingContainer}>
                    <ActivityIndicator size="small" color="#6366f1" />
                    <Text style={styles.loadingText}>Fetching pincodes...</Text>
                  </View>
                )}
              </View>

              {/* Pincode Selection Modal */}
              <Modal
                visible={pincodeModalVisible}
                transparent
                animationType="slide"
                onRequestClose={() => setPincodeModalVisible(false)}
              >
                <View style={styles.modalOverlay}>
                  <View style={styles.modalContent}>
                    <View style={styles.modalHeader}>
                      <Text style={styles.modalTitle}>Select PIN Code</Text>
                      <TouchableOpacity onPress={() => setPincodeModalVisible(false)} style={styles.modalCloseButton}>
                        <Text style={styles.modalCloseText}>✕</Text>
                      </TouchableOpacity>
                    </View>
                    <FlatList
                      data={pincodeOptions}
                      keyExtractor={(item) => item}
                      renderItem={({ item }) => (
                        <TouchableOpacity
                          style={styles.modalOptionItem}
                          onPress={() => handlePincodeSelect(item)}
                          activeOpacity={0.7}
                        >
                          <Text style={styles.modalOptionText}>{item}</Text>
                        </TouchableOpacity>
                      )}
                      ListEmptyComponent={
                        <View style={styles.emptyContainer}>
                          <Text style={styles.emptyText}>No pincodes available</Text>
                        </View>
                      }
                      showsVerticalScrollIndicator={false}
                    />
                    <TouchableOpacity 
                      onPress={handleManualPincodeEntry}
                      style={styles.manualEntryModalButton}
                    >
                      <Text style={styles.manualEntryModalText}>Enter PIN code manually</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </Modal>

              <View style={styles.actionContainer}>
                <TouchableOpacity
                  style={[
                    styles.submitButton,
                    (isLoading || !isFormValid) && styles.submitButtonDisabled,
                  ]}
                  onPress={handleSubmitAddress}
                  disabled={isLoading || !isFormValid}
                  activeOpacity={0.9}
                >
                  <LinearGradient
                    colors={
                      isLoading || !isFormValid ? ['#9ca3af', '#6b7280'] : ['#6366f1', '#8b5cf6']
                    }
                    style={styles.submitGradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                  >
                    <Text style={styles.submitButtonText}>
                      {isLoading ? 'Submitting...' : 'Continue'}
                    </Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#ffffff' },
  topBackgroundContainer: {
    height: height * 0.2,
    width: '100%',
    position: 'relative',
    overflow: 'hidden',
  },
  topBackgroundContainerSmall: {
    height: height * 0.1,
  },
  topBackgroundImage: { flex: 1, justifyContent: 'center', alignItems: 'center', width: '100%' },
  logoImage: {
    position: 'absolute',
    width: width * 0.4,
    height: width * 0.4,
    resizeMode: 'contain',
    alignSelf: 'center',
    top: '50%',
    transform: [{ translateY: -50 }],
  },
  logoImageSmall: {
    width: width * 0.3,
    height: width * 0.3,
  },
  progressContainer: { 
    alignItems: 'center', 
    marginTop: 20,
  },
  progressContainerHidden: {
    opacity: 0,
    height: 0,
    marginTop: 0,
  },
  progressBarBackground: {
    width: width - 80,
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 2,
    marginBottom: 8,
  },
  progressBarFill: { height: '100%', backgroundColor: '#ffffff', borderRadius: 2 },
  progressText: { color: 'rgba(255, 255, 255, 0.8)', fontSize: 14, fontWeight: '500' },
  contentContainer: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    marginTop: -30,
    paddingTop: 8,
  },
  scrollContainer: { 
    flexGrow: 1, 
    paddingHorizontal: 24,
    paddingBottom: 20,
  },
  scrollContainerKeyboardVisible: {
    paddingBottom: 100,
  },
  formContainer: { flex: 1, paddingTop: 32 },
  inputGroup: { marginBottom: 24 },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
    letterSpacing: 0.2,
  },
  dropdownContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    backgroundColor: '#ffffff',
    minHeight: 64,
    paddingHorizontal: 16,
  },
  dropdownContainerDisabled: { backgroundColor: '#f9fafb', borderColor: '#e5e7eb' },
  dropdownContainerFilled: { borderColor: '#6366f1', backgroundColor: '#f8fafc' },
  dropdownIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f3f4f6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  dropdownIcon: { fontSize: 20 },
  dropdownTextContainer: { flex: 1 },
  dropdownText: { fontSize: 16, color: '#1f2937', fontWeight: '500' },
  dropdownPlaceholder: { color: '#9ca3af', fontWeight: '400' },
  chevronContainer: { padding: 4 },
  chevronIcon: { fontSize: 12, color: '#6b7280' },
  chevronIconDisabled: { color: '#d1d5db' },
  lockContainer: { padding: 4 },
  lockIcon: { fontSize: 16 },
  pincodeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    backgroundColor: '#ffffff',
    minHeight: 64,
    paddingHorizontal: 16,
  },
  pincodeContainerFocused: {
    borderColor: '#6366f1',
    shadowColor: '#6366f1',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  pincodeContainerFilled: { borderColor: '#10b981', backgroundColor: '#f0fdf4' },
  pincodeIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f3f4f6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  pincodeIcon: { fontSize: 20 },
  pincodeInput: { flex: 1, fontSize: 16, color: '#1f2937', fontWeight: '500', paddingVertical: 16 },
  validationContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#10b981',
    justifyContent: 'center',
    alignItems: 'center',
  },
  validationIcon: { fontSize: 16, color: '#ffffff', fontWeight: 'bold' },
  actionContainer: { marginTop: 32, paddingBottom: 32 },
  submitButton: {
    borderRadius: 12,
    shadowColor: '#6366f1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  submitButtonDisabled: { shadowOpacity: 0.1, elevation: 2 },
  submitGradient: { paddingVertical: 16, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  submitButtonText: { color: '#ffffff', fontSize: 16, fontWeight: '600', letterSpacing: 0.5 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContent: {
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: height * 0.6,
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 32,
  },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  modalTitle: { fontSize: 18, fontWeight: '600', color: '#1f2937' },
  modalCloseButton: { padding: 4 },
  modalCloseText: { fontSize: 20, color: '#6b7280' },
  modalOptionItem: {
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  modalOptionText: { fontSize: 16, color: '#1f2937' },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  loadingText: {
    marginLeft: 8,
    color: '#6366f1',
    fontSize: 14,
  },
  manualEntryButton: {
    marginTop: 8,
    padding: 8,
    alignItems: 'center',
  },
  manualEntryText: {
    color: '#6366f1',
    fontSize: 14,
    textDecorationLine: 'underline',
  },
  manualEntryModalButton: {
    padding: 16,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
  },
  manualEntryModalText: {
    color: '#6366f1',
    fontSize: 16,
    fontWeight: '500',
  },
  emptyContainer: {
    padding: 20,
    alignItems: 'center',
  },
  emptyText: {
    color: '#9ca3af',
    fontSize: 16,
  },
});