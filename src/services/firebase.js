// src/services/firebase.js

import 'react-native-get-random-values';
import 'react-native-url-polyfill/auto';
import { Platform } from 'react-native';
import { initializeApp, getApps } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { initializeAuth, getReactNativePersistence, getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyAk-87DQqv7lUmTyr8INEgrjZ4oOIFrxGA",
  authDomain: "gosafe-66268.firebaseapp.com",
  projectId: "gosafe-66268",
  storageBucket: "gosafe-66268.firebasestorage.app",
  messagingSenderId: "476145451003",
  appId: "1:476145451003:web:1c6a786535d2e93bcd155e",
  measurementId: "G-DJTE22CZL0"
};

const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);

let auth;
if (Platform.OS === 'web') {
  auth = getAuth(app);
} else {
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
  });
}

export const EXPO_GO_WEB_CLIENT_ID =
'476145451003-1n4ugirfaeb27aceoura0on06fv8kpot.apps.googleusercontent.com';

export { auth };
export const db = getFirestore(app);
