import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, Alert, Platform } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import { GoogleAuthProvider, signInWithCredential } from 'firebase/auth';
import { SafeAreaView } from 'react-native-safe-area-context';
import loginStyles from '../styles/loginStyles';
import { auth, EXPO_GO_WEB_CLIENT_ID } from '../services/firebase';

WebBrowser.maybeCompleteAuthSession();

export default function LoginScreen({ navigation }) {
  const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
    expoClientId: EXPO_GO_WEB_CLIENT_ID,
    iosClientId: EXPO_GO_WEB_CLIENT_ID,
    androidClientId: EXPO_GO_WEB_CLIENT_ID, 
  });

  useEffect(() => {
    const run = async () => {
      if (response?.type === 'success') {
        const idToken = response.params?.id_token;
        if (!idToken) {
          Alert.alert('Google sign-in', 'No id_token returned.');
          return;
        }
        const credential = GoogleAuthProvider.credential(idToken);
        await signInWithCredential(auth, credential);
        
      }
    };
    run().catch((e) => {
      console.error(e);
      Alert.alert('Sign-in failed', e.message);
    });
  }, [response]);

  return (
    <SafeAreaView style={loginStyles.container}>
      
      <View style={loginStyles.hero}>
        <Text style={loginStyles.logoText}>GoSafe</Text>
      </View>

      {}
      <View style={loginStyles.content}>
        <Text style={loginStyles.welcomeLine1}>Welcome to GoSafe &</Text>
        <Text style={loginStyles.welcomeLine2}>let's get started</Text>

       
        <TouchableOpacity
          style={loginStyles.primaryButton}
          activeOpacity={0.85}
          onPress={() => navigation.navigate('EmailAuth')}
        >
          <Text style={loginStyles.primaryButtonText}>Sign up with Email</Text>
        </TouchableOpacity>

        <Text style={loginStyles.orText}>or</Text>

        
        <View style={loginStyles.socialRow}>
          
          <TouchableOpacity
            style={loginStyles.socialBtn}
            activeOpacity={0.7}
            disabled={!request}
            onPress={() => promptAsync()}
          >
            <FontAwesome5 name="google" size={22} color="#DB4437" />
          </TouchableOpacity>

          
          <TouchableOpacity style={loginStyles.socialBtn} activeOpacity={0.7} disabled>
            <FontAwesome5 name="facebook" size={22} color="#4267B2" />
          </TouchableOpacity>

        
          <TouchableOpacity style={loginStyles.socialBtn} activeOpacity={0.7} disabled>
            <FontAwesome5 name="twitter" size={22} color="#1DA1F2" />
          </TouchableOpacity>
        </View>

        
        <Text style={loginStyles.infoText}>
          Note: Google sign-in works with the same client ID for Expo Go
        </Text>
      </View>
    </SafeAreaView>
  );
}