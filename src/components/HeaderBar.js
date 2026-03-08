import React from 'react';
import { View, Text } from 'react-native';

export default function HeaderBar({ title = 'GoSafe' }) {
  return (
    <View style={{
      height: 64, backgroundColor: '#5B9BFF',
      alignItems: 'center', justifyContent: 'center'
    }}>
      <View style={{ position: 'absolute', left: 16, top: 10, bottom: 10, justifyContent: 'center' }}>
        <Text style={{ fontSize: 30 }}>🛡️</Text>
      </View>
      <Text style={{ color: '#fff', fontSize: 18, fontWeight: '700' }}>{title}</Text>
    </View>
  );
}
