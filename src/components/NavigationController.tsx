import { useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { useAppSelector } from '../store/hooks';

export default function NavigationController() {
  const router = useRouter();
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const isLoading = useAppSelector((state) => state.auth.isLoading);
  
  // Profile completion status
  const addressSubmitted = useAppSelector((state) => state.address.addressSubmitted);
  const verificationSubmitted = useAppSelector((state) => state.verification.verificationSubmitted);
  const professionSubmitted = useAppSelector((state) => state.profession.professionSubmitted);
  const profileUpdated = useAppSelector((state) => state.profileUpdate.profileUpdated);

  const [isNavigating, setIsNavigating] = useState(false);
  const hasNavigated = useRef(false);

  useEffect(() => {
    if (isLoading || isNavigating || hasNavigated.current) return;

    if (!isAuthenticated) {
      // User not authenticated, stay on auth screens
      return;
    }

    // User is authenticated, check completion status
    let targetRoute = null;
    
    if (!addressSubmitted) {
      console.log("Redirecting to community address");
      targetRoute = '/(auth)/communityAddress';
    } else if (!verificationSubmitted) {
      console.log("Redirecting to verification");
      targetRoute = '/(auth)/verification';
    } else if (!professionSubmitted) {
      console.log("Redirecting to profession");
      targetRoute = '/(auth)/profession';
    } else if (!profileUpdated) {
      console.log("Redirecting to profile update");
      targetRoute = '/(auth)/profileUpdate';
    } else {
      console.log("All steps completed, redirecting to home");
      targetRoute = '/(tabs)/event';
    }

    if (targetRoute) {
      setIsNavigating(true);
      hasNavigated.current = true;
      
      // Use setTimeout to break the update cycle
      const timer = setTimeout(() => {
        router.replace(targetRoute);
        setIsNavigating(false);
      }, 100);
      
      return () => clearTimeout(timer);
    }
  }, [isAuthenticated, isLoading, addressSubmitted, verificationSubmitted, professionSubmitted, profileUpdated, router, isNavigating]);

  if (isLoading || isNavigating) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' , backgroundColor: 'red'}}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return null;
}