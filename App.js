import React, { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { View, Text } from 'react-native';
import LoginScreen from './src/screens/LoginScreen';
import EmailAuth from './src/screens/EmailAuth';
import HomeScreen from './src/screens/HomeScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import WalkScreen from './src/screens/WalkScreen'; // ← FIXA DENNA IMPORT
import EmergencyContactsScreen from './src/screens/EmergencyContactsScreen';
import HistoryScreen from './src/screens/HistoryScreen';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './src/services/firebase';

const Stack = createNativeStackNavigator();

export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
      if (user) {
        console.log('User is signed in:', user.uid, user.email);
      } else {
        console.log('User is signed out');
      }
    });

    return unsubscribe;
  }, []);

  if (loading) {
    return (
      <SafeAreaProvider>
        <StatusBar style="dark" />
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text>Loading...</Text>
        </View>
      </SafeAreaProvider>
    );
  }

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <StatusBar style="dark" />
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          {user ? (
            // Användaren är inloggad - visa alla app-screens
            <>
              <Stack.Screen name="Home" component={HomeScreen} />
              <Stack.Screen name="Settings" component={SettingsScreen} />
              <Stack.Screen name="Walk" component={WalkScreen} />
              <Stack.Screen name="EmergencyContacts" component={EmergencyContactsScreen} />
              <Stack.Screen name="History" component={HistoryScreen} />
            </>
          ) : (
            // Användaren är utloggad - visa auth flöde
            <>
              <Stack.Screen name="Login" component={LoginScreen} />
              <Stack.Screen name="EmailAuth" component={EmailAuth} />
            </>
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}