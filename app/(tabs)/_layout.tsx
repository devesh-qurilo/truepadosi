import { FontAwesome } from '@expo/vector-icons';
import { Redirect, Tabs } from 'expo-router';
import { ActivityIndicator, View } from 'react-native';
import { useAppSelector } from '../../src/store/hooks';

export default function TabLayout() {
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const isLoading = useAppSelector((state) => state.auth.isLoading);

  // Show loading indicator while checking auth state
  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  // If user is not authenticated, redirect to login
  // if (!isAuthenticated) {
  //   return <Redirect href="/(auth)/login" />;
  // }
   if (!isAuthenticated) {
    return <Redirect href="/(auth)/login" />;
  }

  // Show tabs if authenticated
  return (
    <Tabs screenOptions={{ headerShown: false }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => (
            <FontAwesome name="home" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="event"
        options={{
          title: 'Events',
          tabBarIcon: ({ color, size }) => (
            <FontAwesome name="calendar" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="services"
        options={{
          title: 'Services',
          tabBarIcon: ({ color, size }) => (
            <FontAwesome name="suitcase" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="chat"
        options={{
          title: 'Chat',
          tabBarIcon: ({ color, size }) => (
            <FontAwesome name="snapchat" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="page"
        options={{
          title: 'Page',
          tabBarIcon: ({ color, size }) => (
            <FontAwesome name="copy" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}