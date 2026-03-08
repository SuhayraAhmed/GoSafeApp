import React, { useEffect, useState, useRef } from 'react';
import { View, Text, TouchableOpacity, Alert, ActivityIndicator, Linking } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import * as Location from 'expo-location';
import * as SMS from 'expo-sms';
import { auth } from '../services/firebase';
import { getEmergencyContacts, saveWalkHistory } from '../services/firestoreService';
import walkStyles from '../styles/walkStyles';
import AutoSafetyCheck from '../components/AutoSafetyCheck';
import MovementSensor from '../components/MovementSensor';
import SOSAlarmSound from '../components/SOSAlarmSound';

function formatTime(sec) {
  const m = Math.floor(sec / 60).toString().padStart(2, '0');
  const s = Math.floor(sec % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}

function calculateDuration(startTime, endTime) {
  const start = new Date(startTime);
  const end = new Date(endTime);
  return Math.floor((end - start) / 1000);
}

export default function WalkScreen({ route, navigation }) {
  const { durationSec = 300 } = route.params || {};
  const [remaining, setRemaining] = useState(durationSec);
  const [pos, setPos] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sosLoading, setSosLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const [walkCompleted, setWalkCompleted] = useState(false);
  const [walkStartTime] = useState(new Date().toISOString());
  const [coordinates, setCoordinates] = useState([]);
  const [sosAlarmActive, setSosAlarmActive] = useState(false);
  const watchRef = useRef(null);
  const mapRef = useRef(null);

  useEffect(() => {
    initializeLocation();

    const timerId = setInterval(() => {
      setRemaining((r) => {
        if (r <= 1) {
          setWalkCompleted(true);
          return 0;
        }
        return r - 1;
      });
    }, 1000);

    return () => {
      clearInterval(timerId);
      if (watchRef.current) watchRef.current.remove();
      setSosAlarmActive(false);
    };
  }, []);

  const initializeLocation = async () => {
    try {
      setLoading(true);
      let { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== 'granted') {
        setErrorMsg('Location permission required');
        setLoading(false);
        return;
      }

      let location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      const initialPos = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      };

      setPos(initialPos);
      setCoordinates([initialPos]);

      watchRef.current = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.BestForNavigation,
          timeInterval: 3000,
          distanceInterval: 10,
        },
        (newLocation) => {
          const newPos = {
            latitude: newLocation.coords.latitude,
            longitude: newLocation.coords.longitude,
          };
          setPos(newPos);
          setCoordinates((prev) => [...prev, newPos]);
        }
      );

      setLoading(false);
    } catch (error) {
      console.error('Location error:', error);
      setErrorMsg('Could not get your location');
      setLoading(false);
    }
  };

  const handleEmergencyAlert = (reason) => {
    console.log('Emergency alert triggered because:', reason);
    handleSOS();
  };

  const handleSOS = async () => {
    try {
      setSosLoading(true);
      setSosAlarmActive(true); // Starta larmet omedelbart
      
      const user = auth.currentUser;
      if (!user) {
        Alert.alert('Error', 'You must be logged in to send SOS');
        setSosAlarmActive(false);
        return;
      }

      const emergencyContacts = await getEmergencyContacts(user.uid);

      if (emergencyContacts.length === 0) {
        Alert.alert('No Contacts', 'Please add emergency contacts first');
        setSosAlarmActive(false);
        return;
      }

      const locationLink = pos
        ? `https://maps.google.com/?q=${pos.latitude},${pos.longitude}`
        : 'Location unavailable';

      const message = `🚨 SOS EMERGENCY ALERT 🚨

I need immediate assistance! This is an automatic emergency alert from GoSafe.

📍 LOCATION:
${locationLink}
Coordinates: ${pos ? `${pos.latitude.toFixed(6)}, ${pos.longitude.toFixed(6)}` : 'Unavailable'}

⏰ TIME: ${new Date().toLocaleString()}`;

      const isAvailable = await SMS.isAvailableAsync();
      if (!isAvailable) {
        const firstContact = emergencyContacts[0];
        Alert.alert(
          'SMS Not Available',
          'Would you like to call your emergency contacts instead?',
          [
            { 
              text: 'Cancel', 
              style: 'cancel',
              onPress: () => setSosAlarmActive(false)
            },
            { 
              text: 'Call', 
              onPress: () => {
                Linking.openURL(`tel:${firstContact.phone}`);
                setSosAlarmActive(false);
              }
            },
          ]
        );
        return;
      }

      const phoneNumbers = emergencyContacts.map((contact) => contact.phone);
      const { result } = await SMS.sendSMSAsync(phoneNumbers, message);

      // Spara historik oavsett SMS-resultat
      const endTime = new Date().toISOString();
      const duration = calculateDuration(walkStartTime, endTime);

      await saveWalkHistory(user.uid, {
        startTime: walkStartTime,
        endTime: endTime,
        duration: duration,
        plannedDuration: durationSec,
        coordinates: coordinates,
        status: 'emergency',
        emergencyTriggered: true,
      });

      if (result === 'sent') {
        Alert.alert(
          'SOS Sent! 🚨', 
          'Your emergency contacts have been notified. Emergency alarm is active!',
          [
            {
              text: 'Stop Alarm',
              onPress: () => setSosAlarmActive(false)
            }
          ]
        );
      } else {
        Alert.alert(
          'SOS Partially Sent', 
          'Some messages may not have been delivered. Emergency alarm is active!',
          [
            {
              text: 'Stop Alarm',
              onPress: () => setSosAlarmActive(false)
            }
          ]
        );
      }
    } catch (error) {
      console.error('Error sending SOS:', error);
      Alert.alert('Error', 'Could not send SOS alert.');
      setSosAlarmActive(false);
    } finally {
      setSosLoading(false);
    }
  };

  const handleArrived = async () => {
    try {
      if (sosAlarmActive) {
        setSosAlarmActive(false);
      }

      const endTime = new Date().toISOString();
      const duration = calculateDuration(walkStartTime, endTime);

      await saveWalkHistory(auth.currentUser.uid, {
        startTime: walkStartTime,
        endTime: endTime,
        duration: duration,
        plannedDuration: durationSec,
        coordinates: coordinates,
        status: walkCompleted ? 'completed' : 'cancelled',
        emergencyTriggered: false,
      });

      if (walkCompleted) {
        Alert.alert(
          'Walk Completed!',
          'Great job! You have completed your walk.',
          [
            {
              text: 'Back Home',
              onPress: () => navigation.goBack(),
            },
          ]
        );
      } else {
        Alert.alert(
          'End Walk?',
          'Do you want to end your walk early?',
          [
            {
              text: 'Continue',
              style: 'cancel',
            },
            {
              text: 'End',
              style: 'destructive',
              onPress: () => navigation.goBack(),
            },
          ]
        );
      }
    } catch (error) {
      console.error('Error saving walk history:', error);
      Alert.alert('Error', 'Could not save walk history.');
    }
  };

  const handleCenterMap = () => {
    if (mapRef.current && pos) {
      mapRef.current.animateToRegion({
        ...pos,
        latitudeDelta: 0.005,
        longitudeDelta: 0.005,
      }, 1000);
    }
  };

  const retryLocation = () => {
    setErrorMsg(null);
    initializeLocation();
  };

  const region = pos
    ? { ...pos, latitudeDelta: 0.005, longitudeDelta: 0.005 }
    : { latitude: 59.3293, longitude: 18.0686, latitudeDelta: 0.05, longitudeDelta: 0.05 };

  const renderMapContent = () => {
    if (loading) {
      return (
        <View style={walkStyles.loadingContainer}>
          <ActivityIndicator size="large" color="#5B9BFF" />
          <Text style={walkStyles.loadingText}>Getting your location...</Text>
        </View>
      );
    }

    if (errorMsg) {
      return (
        <View style={walkStyles.errorContainer}>
          <Text style={walkStyles.errorIcon}>📍</Text>
          <Text style={walkStyles.errorTitle}>Location unavailable</Text>
          <Text style={walkStyles.errorText}>{errorMsg}</Text>
          <TouchableOpacity style={walkStyles.retryButton} onPress={retryLocation}>
            <Text style={walkStyles.retryButtonText}>Try Again</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return (
      <>
        <MapView
          ref={mapRef}
          style={walkStyles.map}
          initialRegion={region}
          region={region}
          showsUserLocation={false}
          showsMyLocationButton={false}
          showsCompass={true}
          showsScale={true}
          zoomEnabled={true}
          scrollEnabled={true}
          rotateEnabled={true}
        >
          <MapView.UrlTile
            urlTemplate="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            maximumZ={19}
            flipY={false}
          />
          {coordinates.length > 1 && (
            <Polyline
              coordinates={coordinates}
              strokeWidth={4}
              strokeColor="#5B9BFF"
            />
          )}
          {pos && (
            <Marker
              coordinate={pos}
              title="Your location"
              description="You are here"
            >
              <View style={walkStyles.markerContainer}>
                <View style={walkStyles.markerPulse} />
                <View style={walkStyles.markerPin}>
                  <View style={walkStyles.markerDot} />
                </View>
              </View>
            </Marker>
          )}
        </MapView>

        {/* Center Map Button */}
        <TouchableOpacity
          style={walkStyles.centerButton}
          onPress={handleCenterMap}
        >
          <Text style={walkStyles.centerButtonText}>📍</Text>
        </TouchableOpacity>

        {/* Location Info Card */}
        <View style={walkStyles.locationCard}>
          <Text style={walkStyles.locationTitle}>Your Position</Text>
          <Text style={walkStyles.locationCoordinates}>
            {pos ? `${pos.latitude.toFixed(6)}, ${pos.longitude.toFixed(6)}` : 'Loading...'}
          </Text>
          <Text style={walkStyles.locationStatus}>
            {pos ? 'Live location' : 'Getting location'}
          </Text>
        </View>
      </>
    );
  };

  return (
    <View style={walkStyles.container}>
      <SOSAlarmSound isActive={sosAlarmActive} />

      <MovementSensor onEmergencyAlert={handleEmergencyAlert} />
      <AutoSafetyCheck onEmergencyAlert={handleEmergencyAlert} isWalkFinished={walkCompleted} />

      <View style={walkStyles.header}>
        <Text style={walkStyles.appTitle}>GoSafe</Text>
        <Text style={walkStyles.subtitle}>Your Safe Walk</Text>
      </View>

      {/* Timer Section */}
      <View
        style={[
          walkStyles.timerContainer,
          walkCompleted && walkStyles.timerCompleted,
          remaining < 60 && !walkCompleted && walkStyles.timerWarning,
          sosAlarmActive && walkStyles.emergencyTimer,
        ]}
      >
        <Text style={[
          walkStyles.timerLabel,
          sosAlarmActive && { color: '#FFFFFF' }
        ]}>
          {sosAlarmActive ? '🚨 EMERGENCY ALARM 🚨' : (walkCompleted ? 'Walk Completed' : 'Time Remaining')}
        </Text>
        <Text style={[
          walkStyles.timerText,
          sosAlarmActive && { color: '#FFFFFF' }
        ]}>
          {sosAlarmActive ? 'SOS ACTIVE' : formatTime(remaining)}
        </Text>
        <Text style={[
          walkStyles.timerStatus,
          sosAlarmActive && { color: '#FFFFFF' }
        ]}>
          {sosAlarmActive ? 'Alarm sounding - seeking help!' : 
           walkCompleted ? 'Great job!' : 
           remaining < 60 ? 'Almost done!' : 'Active walk'}
        </Text>
      </View>

      {/* Map Container */}
      <View style={walkStyles.mapContainer}>
        {renderMapContent()}
      </View>

      {/* Action Buttons */}
      <View style={walkStyles.actionsContainer}>
        <TouchableOpacity
          style={[
            walkStyles.sosButton, 
            (sosLoading || sosAlarmActive) && walkStyles.disabledButton,
            sosAlarmActive && { backgroundColor: '#FF6B6B' }
          ]}
          onPress={handleSOS}
          disabled={sosLoading || sosAlarmActive}
        >
          {sosLoading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={walkStyles.sosText}>
              {sosAlarmActive ? 'ALARMING' : 'SOS'}
            </Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity 
          style={walkStyles.arrivedButton} 
          onPress={handleArrived}
        >
          <Text style={walkStyles.arrivedText}>
            {sosAlarmActive ? 'STOP ALARM' : (walkCompleted ? 'Completed' : 'Arrived')}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}