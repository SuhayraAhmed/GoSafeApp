import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';

export default function BottomNav({ navigation }) {
  return (
    <View style={{
      flexDirection: 'row', borderTopWidth: 1, borderTopColor: '#E5E7EB',
      position: 'absolute', bottom: 0, left: 0, right: 0,
      backgroundColor: '#fff', height: 64, alignItems: 'center'
    }}>
      <TouchableOpacity style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}
        onPress={() => navigation.navigate('Home')}>
        <FontAwesome5 name="home" size={20} color="#5B9BFF" />
        <Text style={{ fontSize: 12, color: '#5B9BFF', fontWeight: '700', marginTop: 4 }}>Home</Text>
      </TouchableOpacity>

      <TouchableOpacity style={{ width: 64, alignItems: 'center', justifyContent: 'center' }}>
        <FontAwesome5 name="user" size={20} color="#000" />
      </TouchableOpacity>

      <TouchableOpacity style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}
        onPress={() => navigation.navigate('Settings')}>
        <FontAwesome5 name="cog" size={20} color="#0E1726" />
        <Text style={{ fontSize: 12, color: '#0E1726', marginTop: 4 }}>Settings</Text>
      </TouchableOpacity>
    </View>
  );
}
