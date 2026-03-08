import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FontAwesome5 } from '@expo/vector-icons';
import * as Location from 'expo-location';
import HeaderBar from '../components/HeaderBar';
import BottomNav from '../components/BottomNav';
import TimePickerModal from '../components/TimePickerModal';
import MapComponent from '../components/MapComponent';
import homeStyles from '../styles/homeStyles';

export default function HomeScreen({ navigation }) {
  const [open, setOpen] = useState(false);
  const [userLocation, setUserLocation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getUserLocation();
  }, []);

  const getUserLocation = async () => {
    try {
      setLoading(true);
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setError('Location permission required');
        setLoading(false);
        return;
      }

      let location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      setUserLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.005,
        longitudeDelta: 0.005,
      });
      setLoading(false);
    } catch (err) {
      console.error('Location error:', err);
      setError('Could not get your location');
      setLoading(false);
    }
  };

  const handleStartWalk = () => {
    if (!userLocation) {
      Alert.alert('Location Required', 'Please enable location services to start a walk.', [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Retry', onPress: getUserLocation },
      ]);
      return;
    }
    setOpen(true);
  };

  const region = userLocation || {
    latitude: 59.3293,
    longitude: 18.0686,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  };

  return (
    <SafeAreaView style={homeStyles.container}>
      <HeaderBar title="GoSafe" />

      <ScrollView style={homeStyles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={homeStyles.section}>
          <Text style={homeStyles.sectionTitle}>Your Current Location</Text>
          <View style={homeStyles.mapContainer}>
            <MapComponent
              region={region}
              userLocation={userLocation}
              loading={loading}
              error={error}
              onRetry={getUserLocation}
            />
          </View>
        </View>

        <View style={homeStyles.mainContent}>
          <View style={homeStyles.welcomeCard}>
            <Text style={homeStyles.welcomeTitle}>Welcome to GoSafe! 👋</Text>
            <Text style={homeStyles.welcomeSubtitle}>
              Your safety companion for peaceful walks
            </Text>
          </View>

          <TouchableOpacity style={homeStyles.walkButton} onPress={handleStartWalk} activeOpacity={0.9}>
            <View style={homeStyles.walkButtonContent}>
              <FontAwesome5 name="walking" size={24} color="#fff" />
              <Text style={homeStyles.walkButtonText}>Start Safe Walk</Text>
            </View>
            <Text style={homeStyles.walkButtonSubtext}>Set duration and stay protected</Text>
          </TouchableOpacity>

          <View style={homeStyles.quickActionsSection}>
            <Text style={homeStyles.sectionTitle}>Quick Actions</Text>
            <View style={homeStyles.quickActions}>
              <TouchableOpacity
                style={homeStyles.actionCard}
                onPress={() => navigation.navigate('EmergencyContacts')}
                activeOpacity={0.8}
              >
                <View style={homeStyles.actionIconContainer}>
                  <FontAwesome5 name="users" size={20} color="#5B9BFF" />
                </View>
                <Text style={homeStyles.actionTitle}>Emergency Contacts</Text>
                <Text style={homeStyles.actionDescription}>Manage your trusted contacts</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={homeStyles.actionCard}
                onPress={() => navigation.navigate('History')}
                activeOpacity={0.8}
              >
                <View style={homeStyles.actionIconContainer}>
                  <FontAwesome5 name="history" size={20} color="#5B9BFF" />
                </View>
                <Text style={homeStyles.actionTitle}>Walk History</Text>
                <Text style={homeStyles.actionDescription}>View your previous walks</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>

      <BottomNav navigation={navigation} />

      <TimePickerModal
        visible={open}
        onCancel={() => setOpen(false)}
        onConfirm={(min) => navigation.navigate('Walk', { durationSec: min * 60 })}
      />
    </SafeAreaView>
  );
}
