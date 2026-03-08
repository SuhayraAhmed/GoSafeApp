import React, { useState, useEffect, useRef } from 'react';
import { Vibration, Alert, View, Text } from 'react-native';

const AutoSafetyCheck = ({ 
  onEmergencyAlert, 
  isWalkFinished 
}) => {
  const [secondsUntilAlert, setSecondsUntilAlert] = useState(null);
  const [safetyCheckActive, setSafetyCheckActive] = useState(false);
  const safetyCheckCompletedRef = useRef(false);

  useEffect(() => {
    if (isWalkFinished && !safetyCheckCompletedRef.current) {
      startSafetyVerification();
    }
  }, [isWalkFinished]);

  const startSafetyVerification = () => {
    if (safetyCheckCompletedRef.current) return;
    
    safetyCheckCompletedRef.current = true;
    setSafetyCheckActive(true);
    
    let countdownTime = 60; // 1 minut
    
    Alert.alert(
      'Walk Completed - Safety Check 🛡️',
      `Your walk time is up. Please confirm you are safe.\n\nAutomatic SOS will trigger in ${countdownTime} seconds.`,
      [
        {
          text: 'I\'m Safe ✅',
          onPress: cancelSafetyAlert,
        }
      ],
      { 
        cancelable: false,
        onDismiss: () => {
          // Om användaren stänger alerten, starta countdown
          startAlertCountdown(countdownTime);
        }
      }
    );

    startVibrationWarning();
    startAlertCountdown(countdownTime);
  };

  const startVibrationWarning = () => {
    const vibrationInterval = setInterval(() => {
      if (!safetyCheckActive) {
        clearInterval(vibrationInterval);
        return;
      }
      Vibration.vibrate([1000, 2000]);
    }, 3000);

    return vibrationInterval;
  };

  const startAlertCountdown = (seconds) => {
    let timeLeft = seconds;
    
    const countdown = setInterval(() => {
      if (!safetyCheckActive) {
        clearInterval(countdown);
        return;
      }
      
      timeLeft -= 1;
      setSecondsUntilAlert(timeLeft);
      
      if (timeLeft <= 0) {
        clearInterval(countdown);
        sendAutomaticEmergencyAlert();
      } else if (timeLeft <= 10) {
        Vibration.vibrate([500, 500]);
      }
    }, 1000);

    return countdown;
  };

  const cancelSafetyAlert = () => {
    setSafetyCheckActive(false);
    Vibration.cancel();
    setSecondsUntilAlert(null);
    
    // Safety check är klar, ingen mer kommer
    safetyCheckCompletedRef.current = true;
  };

  const sendAutomaticEmergencyAlert = () => {
    setSafetyCheckActive(false);
    Vibration.cancel();
    
    Alert.alert(
      'Automatic SOS Activation 🚨',
      'No safety confirmation received. Sending emergency alert now!',
      [
        {
          text: 'Cancel SOS',
          onPress: cancelSafetyAlert,
          style: 'cancel'
        },
        {
          text: 'OK',
          onPress: () => {
            onEmergencyAlert && onEmergencyAlert('timeout');
            safetyCheckCompletedRef.current = true;
          }
        }
      ],
      { 
        cancelable: false,
        onDismiss: () => {
          onEmergencyAlert && onEmergencyAlert('timeout');
          safetyCheckCompletedRef.current = true;
        }
      }
    );
  };

  if (secondsUntilAlert !== null && safetyCheckActive) {
    return (
      <View style={styles.alertCountdown}>
        <Text style={styles.alertCountdownText}>
          ⚠️ Automatic SOS in: {secondsUntilAlert}s
        </Text>
        <Text style={styles.alertCountdownHelp}>
          Tap "I'm Safe" to cancel
        </Text>
      </View>
    );
  }

  return null;
};

const styles = {
  alertCountdown: {
    padding: 15,
    marginHorizontal: 20,
    marginBottom: 10,
    borderRadius: 10,
    backgroundColor: '#fff3cd',
    borderWidth: 2,
    borderColor: '#ffc107',
    alignItems: 'center',
  },
  alertCountdownText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#856404',
    textAlign: 'center',
  },
  alertCountdownHelp: {
    fontSize: 12,
    color: '#856404',
    marginTop: 5,
    textAlign: 'center',
  }
};

export default AutoSafetyCheck;