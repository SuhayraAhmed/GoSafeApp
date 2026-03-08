import React, { useState, useEffect } from 'react';
import { View, Text, Modal, TextInput, TouchableOpacity } from 'react-native';

export default function TimePickerModal({ visible, defaultMinutes = 5, onCancel, onConfirm }) {
  const [minutes, setMinutes] = useState(String(defaultMinutes));
  useEffect(() => setMinutes(String(defaultMinutes)), [defaultMinutes]);

  const submit = () => {
    const m = Math.max(1, parseInt(minutes || '0', 10));
    onConfirm?.(m);
  };

  return (
    <Modal transparent visible={visible} animationType="fade" onRequestClose={onCancel}>
      <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.35)', justifyContent: 'center', alignItems: 'center' }}>
        <View style={{ width: '82%', backgroundColor: '#fff', borderRadius: 14, padding: 18 }}>
          <Text style={{ fontSize: 16, fontWeight: '700', marginBottom: 12 }}>Hur länge? (minuter)</Text>
          <TextInput
            style={{ borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 8, padding: 10, fontSize: 16, marginBottom: 14 }}
            keyboardType="number-pad"
            value={minutes}
            onChangeText={setMinutes}
            placeholder="t.ex. 5"
            maxLength={3}
          />
          <View style={{ flexDirection: 'row', justifyContent: 'flex-end', gap: 12 }}>
            <TouchableOpacity onPress={onCancel} style={{ paddingHorizontal: 12, paddingVertical: 10 }}>
              <Text style={{ color: '#0E1726', fontWeight: '600' }}>Avbryt</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={submit} style={{ backgroundColor: '#5B9BFF', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 8 }}>
              <Text style={{ color: '#fff', fontWeight: '700' }}>Starta</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}
