import { Image, ImageBackground } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
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
import { clearVerificationError, submitVerificationRequest } from '../../src/slices/verificationSlice';
import { useAppDispatch, useAppSelector } from '../../src/store/hooks';

// ✅ Import your assets
const logo = require('../../assets/images/logo.png');
const background = require('../../assets/images/3d0b0760-ce28-4a8d-8036-1d43c1bdd630.png');

export default function VerificationScreen() {
  const [formData, setFormData] = useState({
    verificationByPostalCard: 'yes',
    document: null,
    address: '',
  });

  const dispatch = useAppDispatch();
  const router = useRouter();
  const isLoading = useAppSelector((state) => state.verification.isLoading);
  const error = useAppSelector((state) => state.verification.error);
  const verificationSubmitted = useAppSelector((state) => state.verification.verificationSubmitted);

  const hasNavigated = useRef(false);

  useEffect(() => {
    if (error) {
      Alert.alert('Verification Error', error);
      dispatch(clearVerificationError());
    }
  }, [error, dispatch]);

  useEffect(() => {
    if (verificationSubmitted && !hasNavigated.current) {
      hasNavigated.current = true;
      router.replace('/(auth)/profession');
    }
  }, [verificationSubmitted, router]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const pickDocument = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });
      if (!result.canceled) {
        setFormData(prev => ({
          ...prev,
          document: {
            uri: result.assets[0].uri,
            type: 'image/jpeg',
            name: `document_${Date.now()}.jpg`,
          }
        }));
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to pick document');
    }
  };

  const handleSubmitVerification = () => {
    const { verificationByPostalCard, document, address } = formData;
    if (!verificationByPostalCard) {
      Alert.alert('Error', 'Please select verification option');
      return;
    }
    if (!document) {
      Alert.alert('Error', 'Please upload a document');
      return;
    }
    if (!address.trim()) {
      Alert.alert('Error', 'Please enter your address');
      return;
    }
    dispatch(submitVerificationRequest(formData));
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
            <View style={styles.header}>
              <Text style={styles.title}>Identity Verification</Text>
              <Text style={styles.subtitle}>Verify your identity with documents</Text>
            </View>

            <View style={styles.formContainer}>
              {/* Verification by Postal Card - Radio Button */}
              <Text style={styles.sectionLabel}>Verification by Postal Card *</Text>
              <View style={styles.radioContainer}>
                <TouchableOpacity
                  style={styles.radioButton}
                  onPress={() => handleInputChange('verificationByPostalCard', 'yes')}
                >
                  <View style={[styles.radioCircle, formData.verificationByPostalCard === 'yes' && styles.radioCircleSelected]}>
                    {formData.verificationByPostalCard === 'yes' && <View style={styles.radioInnerCircle} />}
                  </View>
                  <Text style={styles.radioLabel}>Yes</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.radioButton}
                  onPress={() => handleInputChange('verificationByPostalCard', 'no')}
                >
                  <View style={[styles.radioCircle, formData.verificationByPostalCard === 'no' && styles.radioCircleSelected]}>
                    {formData.verificationByPostalCard === 'no' && <View style={styles.radioInnerCircle} />}
                  </View>
                  <Text style={styles.radioLabel}>No</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.spacer} />

              {/* Document Upload */}
              <Text style={styles.sectionLabel}>Document Upload *</Text>
              <TouchableOpacity
                style={styles.uploadButton}
                onPress={pickDocument}
              >
                <Text style={styles.uploadButtonText}>
                  {formData.document ? 'Change Document' : 'Select Document'}
                </Text>
              </TouchableOpacity>
              {formData.document && (
                <View style={styles.previewContainer}>
                  <Image source={{ uri: formData.document.uri }} style={styles.previewImage} contentFit="contain" />
                  <Text style={styles.previewText}>Document selected</Text>
                </View>
              )}

              <View style={styles.spacer} />

              {/* Address - Text Input */}
              <Text style={styles.sectionLabel}>Address *</Text>
              <TextInput
                style={[styles.input, styles.addressInput]}
                value={formData.address}
                onChangeText={(value) => handleInputChange('address', value)}
                placeholder="Enter your complete address"
                placeholderTextColor="#9CA3AF"
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />

              <View style={styles.spacer} />

              {/* Submit Button */}
              <TouchableOpacity
                style={[styles.submitButton, isLoading && styles.submitButtonDisabled]}
                onPress={handleSubmitVerification}
                disabled={isLoading}
              >
                <Text style={styles.submitButtonText}>
                  {isLoading ? 'Submitting...' : 'Submit Verification'}
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
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
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
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    backgroundColor: '#FFFFFF',
    color: '#374151',
  },
  addressInput: {
    height: 100,
    paddingTop: 12,
    paddingBottom: 12,
    textAlignVertical: 'top',
  },
  radioContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  radioButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
  },
  radioCircle: {
    height: 20,
    width: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#8B5CF6',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  radioCircleSelected: {
    backgroundColor: '#8B5CF6',
  },
  radioInnerCircle: {
    height: 8,
    width: 8,
    borderRadius: 4,
    backgroundColor: '#FFFFFF',
  },
  radioLabel: {
    fontSize: 16,
    color: '#374151',
  },
  uploadButton: {
    backgroundColor: '#F3F4F6',
    height: 50,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderStyle: 'dashed',
  },
  uploadButtonText: {
    color: '#8B5CF6',
    fontSize: 16,
    fontWeight: '500',
  },
  previewContainer: {
    marginTop: 12,
    alignItems: 'center',
  },
  previewImage: {
    width: 200,
    height: 150,
    borderRadius: 8,
    marginBottom: 8,
  },
  previewText: {
    fontSize: 14,
    color: '#6B7280',
  },
  spacer: {
    height: 24,
  },
  submitButton: {
    backgroundColor: '#8B5CF6',
    height: 50,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  submitButtonDisabled: {
    backgroundColor: '#A78BFA',
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});