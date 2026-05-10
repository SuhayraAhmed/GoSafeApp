import React from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FontAwesome5 } from '@expo/vector-icons';
import { signOut } from 'firebase/auth';
import { auth } from '../services/firebase';
import settingsStyles from '../styles/settingsStyles';

export default function SettingsScreen({ navigation }) {
  const handleLogout = async () => {
    try {
      await signOut(auth);
      // Navigation sker automatiskt via onAuthStateChanged i App.js
    } catch (error) {
      Alert.alert('Logout Error', error.message);
    }
  };

  return (
    <SafeAreaView style={settingsStyles.container}>
      <View style={settingsStyles.header}>
        <Text style={settingsStyles.title}>Settings</Text>
      </View>

      <View style={settingsStyles.menu}>
        <TouchableOpacity style={settingsStyles.menuItem}>
          <FontAwesome5 name="user" size={20} color="#5B9BFF" />
          <Text style={settingsStyles.menuText}>Profile</Text>
        </TouchableOpacity>

        <TouchableOpacity style={settingsStyles.menuItem}>
          <FontAwesome5 name="bell" size={20} color="#5B9BFF" />
          <Text style={settingsStyles.menuText}>Notifications</Text>
        </TouchableOpacity>

        <TouchableOpacity style={settingsStyles.menuItem}>
          <FontAwesome5 name="shield-alt" size={20} color="#5B9BFF" />
          <Text style={settingsStyles.menuText}>Privacy</Text>
        </TouchableOpacity>

        <TouchableOpacity style={settingsStyles.menuItem}>
          <FontAwesome5 name="question-circle" size={20} color="#5B9BFF" />
          <Text style={settingsStyles.menuText}>Help & Support</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[settingsStyles.menuItem, { marginTop: 20 }]} 
          onPress={handleLogout}
        >
          <FontAwesome5 name="sign-out-alt" size={20} color="#EF4444" />
          <Text style={[settingsStyles.menuText, { color: '#EF4444' }]}>Logout</Text>
        </TouchableOpacity>
      </View>

      
      <View style={settingsStyles.bottomNav}>
        <TouchableOpacity 
          style={settingsStyles.navItem} 
          activeOpacity={0.7}
          onPress={() => navigation.navigate('Home')}
        >
          <FontAwesome5 name="home" size={20} color="#6B7280" />
          <Text style={settingsStyles.navText}>Home</Text>
        </TouchableOpacity>

        <TouchableOpacity style={settingsStyles.navItem} activeOpacity={0.7}>
          <FontAwesome5 name="cog" size={20} color="#5B9BFF" />
          <Text style={[settingsStyles.navText, settingsStyles.navTextActive]}>Settings</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}