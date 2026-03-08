// components/SOSAlarmSound.js
import React, { useEffect, useRef } from 'react';
import { Audio } from 'expo-av';
import { Vibration } from 'react-native';

const SOSAlarmSound = ({ isActive }) => {
  const soundRef = useRef(null);

  useEffect(() => {
    setupAudio();
    return () => {
      stopSound();
    };
  }, []);

  useEffect(() => {
    if (isActive) {
      playSound();
    } else {
      stopSound();
    }
  }, [isActive]);

  const setupAudio = async () => {
    try {
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        playsInSilentModeIOS: true,
        staysActiveInBackground: true,
        shouldDuckAndroid: true,
        playThroughEarpieceAndroid: false,
      });
    } catch (error) {
      console.error('Audio setup failed:', error);
    }
  };

  const playSound = async () => {
    try {
      await stopSound();

      const { sound } = await Audio.Sound.createAsync(
        require('../../assets/sounds/alarm.mp3'),
        { 
          shouldPlay: true,
          isLooping: true,
          volume: 1.0,
        }
      );

      soundRef.current = sound;
      Vibration.vibrate([500, 500], true);
      
    } catch (error) {
      console.error('Error playing sound:', error);
      Vibration.vibrate([500, 500], true);
    }
  };

  const stopSound = async () => {
    try {
      Vibration.cancel();
      
      if (soundRef.current) {
        await soundRef.current.stopAsync();
        await soundRef.current.unloadAsync();
        soundRef.current = null;
      }
    } catch (error) {
      console.error('Error stopping sound:', error);
    }
  };

  return null;
};

export default SOSAlarmSound;