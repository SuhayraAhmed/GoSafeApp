import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../services/firebase';
import emailAuthStyles from '../styles/emailAuthStyles';
import { createUserDocument } from '../services/firestoreService';


export default function EmailAuth({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(true);

   // I din EmailAuth.js, uppdatera handleAuth funktionen:
   const handleAuth = async () => {
    if (!email || !password) {
    Alert.alert('Error', 'Please enter both email and password');
    return;
   }

   if (password.length < 6) {
    Alert.alert('Error', 'Password must be at least 6 characters');
    return;
   }

   setIsLoading(true);

   try {
    let userCredential;
    if (isSignUp) {
      // Create new account
      userCredential = await createUserWithEmailAndPassword(auth, email, password);
      console.log('User created:', userCredential.user.uid);
      Alert.alert('Success', 'Account created successfully!');
      
      // Skapa användardokument i Firestore när man registrerar sig
      await createUserDocument(userCredential.user);
    } else {
      // Sign in
      userCredential = await signInWithEmailAndPassword(auth, email, password);
      console.log('User signed in:', userCredential.user.uid);
    }
    
    // Navigate to Home after successful authentication
     navigation.replace('Home');
   } catch (error) {
    console.error('Auth error:', error);
    Alert.alert('Authentication Failed', error.message);
   } finally {
    setIsLoading(false);
   }
 };

  return (
    <View style={emailAuthStyles.container}>
      <Text style={emailAuthStyles.title}>
        {isSignUp ? 'Create account' : 'Sign in'}
      </Text>
      
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        style={emailAuthStyles.input}
        keyboardType="email-address"
        autoCapitalize="none"
        editable={!isLoading}
      />
      
      <TextInput
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        style={emailAuthStyles.input}
        editable={!isLoading}
      />
      
      <TouchableOpacity
        style={[
          emailAuthStyles.authButton,
          isLoading && emailAuthStyles.disabledButton
        ]}
        onPress={handleAuth}
        disabled={isLoading}
      >
        <Text style={emailAuthStyles.authButtonText}>
          {isLoading ? 'Please wait...' : (isSignUp ? 'Create Account' : 'Sign In')}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={emailAuthStyles.switchButton}
        onPress={() => setIsSignUp(!isSignUp)}
        disabled={isLoading}
      >
        <Text style={emailAuthStyles.switchButtonText}>
          {isSignUp ? 'Already have an account? Sign in' : 'Need an account? Sign up'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={emailAuthStyles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Text style={emailAuthStyles.backButtonText}>Back to Login</Text>
      </TouchableOpacity>
    </View>
  );
}
