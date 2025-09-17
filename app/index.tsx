import { Redirect } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';

export default function Index() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simple loading delay to ensure Redux is initialized
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' , backgroundColor: 'red'}}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  // Always redirect to login - authentication will be handled in auth layout
  return <Redirect href="/(auth)/login" />;
}

