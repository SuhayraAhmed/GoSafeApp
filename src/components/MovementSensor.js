import React, { useState, useEffect, useRef } from 'react';
import { Alert, Vibration } from 'react-native';
import { Accelerometer, Gyroscope } from 'expo-sensors';

const MovementSensor = ({ onEmergencyAlert }) => {
  const [isCheckingWellbeing, setIsCheckingWellbeing] = useState(false);
  const [lastAlertTime, setLastAlertTime] = useState(0);
  const alertCooldownRef = useRef(false);

  const FALL_SENSITIVITY = 2.5;
  const STATIONARY_TIME_LIMIT = 30000; // 30 sekunder
  const MIN_MOVEMENT_THRESHOLD = 0.3;
  const ALERT_COOLDOWN = 60000; // 1 minut cooldown
  const [lastMovementDetected, setLastMovementDetected] = useState(Date.now());

  useEffect(() => {
    setupMovementTracking();
    
    const stationaryMonitor = setInterval(() => {
      checkIfStationaryTooLong();
    }, 10000);

    return () => {
      clearInterval(stationaryMonitor);
      Accelerometer.removeAllListeners();
      Gyroscope.removeAllListeners();
    };
  }, []);

  const setupMovementTracking = async () => {
    try {
      const isAccelerometerAvailable = await Accelerometer.isAvailableAsync();
      
      if (!isAccelerometerAvailable) {
        console.log('Accelerometer not available');
        return;
      }

      Accelerometer.setUpdateInterval(1000);
      
      Accelerometer.addListener(accelerationData => {
        checkForSuddenFall(accelerationData);
        trackMovementLevel(accelerationData);
      });

    } catch (error) {
      console.error('Motion detection setup error:', error);
    }
  };

  const checkForSuddenFall = (sensorData) => {
    const totalForce = Math.sqrt(
      sensorData.x * sensorData.x + 
      sensorData.y * sensorData.y + 
      sensorData.z * sensorData.z
    );

    if (totalForce > FALL_SENSITIVITY && !isCheckingWellbeing && !alertCooldownRef.current) {
      console.log('Possible fall detected!');
      triggerWellbeingCheck('fall');
    }
  };

  const trackMovementLevel = (sensorData) => {
    const movementAmount = Math.sqrt(
      sensorData.x * sensorData.x + 
      sensorData.y * sensorData.y + 
      sensorData.z * sensorData.z
    );

    if (movementAmount > MIN_MOVEMENT_THRESHOLD) {
      setLastMovementDetected(Date.now());
    }
  };

  const checkIfStationaryTooLong = () => {
    const currentTime = Date.now();
    const timeWithoutMovement = currentTime - lastMovementDetected;
    const timeSinceLastAlert = currentTime - lastAlertTime;

    // Kolla om cooldown perioden är över
    if (timeSinceLastAlert < ALERT_COOLDOWN) {
      return; // Fortfarande i cooldown, gör ingenting
    }

    if (timeWithoutMovement > STATIONARY_TIME_LIMIT && !isCheckingWellbeing && !alertCooldownRef.current) {
      console.log('User has been stationary for too long');
      triggerWellbeingCheck('stationary');
    }
  };

  const triggerWellbeingCheck = (reason) => {
    if (isCheckingWellbeing || alertCooldownRef.current) return;

    setIsCheckingWellbeing(true);
    alertCooldownRef.current = true;
    setLastAlertTime(Date.now());
    
    Vibration.vibrate([0, 500, 200, 500]);
    
    let alertMessage = '';
    switch (reason) {
      case 'fall':
        alertMessage = 'We detected a possible fall. Are you safe?';
        break;
      case 'stationary':
        alertMessage = 'You have been stationary for a while. Are you safe?';
        break;
      default:
        alertMessage = 'We detected unusual movement. Are you safe?';
    }

    Alert.alert(
      'Safety Check 🛡️',
      alertMessage,
      [
        {
          text: 'I\'m Safe',
          onPress: () => {
            handleSafeResponse();
          },
        },
        {
          text: 'Need Help',
          onPress: () => {
            handleEmergencyResponse(reason);
          },
          style: 'destructive',
        },
      ],
      {
        onDismiss: () => {
          // Om användaren stänger alerten utan att svara, anta att de är safe
          setTimeout(() => {
            if (isCheckingWellbeing) {
              handleSafeResponse();
            }
          }, 10000); // Ge 10 sekunder att svara innan auto-safe
        }
      }
    );
  };

  const handleSafeResponse = () => {
    setIsCheckingWellbeing(false);
    Vibration.cancel();
    
    // Starta cooldown timer
    setTimeout(() => {
      alertCooldownRef.current = false;
      console.log('Cooldown period over - alerts enabled again');
    }, ALERT_COOLDOWN);
  };

  const handleEmergencyResponse = (reason) => {
    setIsCheckingWellbeing(false);
    Vibration.cancel();
    onEmergencyAlert && onEmergencyAlert(reason);
    
    // Starta cooldown timer även vid emergency
    setTimeout(() => {
      alertCooldownRef.current = false;
    }, ALERT_COOLDOWN);
  };

  return null;
};

export default MovementSensor;