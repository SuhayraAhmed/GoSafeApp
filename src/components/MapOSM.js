import React from 'react';
import MapView, { UrlTile, Marker } from 'react-native-maps';
import { View } from 'react-native';

export default function MapOSM({ height = 220, region, marker }) {
  return (
    <View style={{ height, marginHorizontal: 16, marginTop: 12, borderRadius: 14, overflow: 'hidden' }}>
      <MapView style={{ flex: 1 }} initialRegion={region} region={region}>
        <UrlTile urlTemplate="https://tile.openstreetmap.org/{z}/{x}/{y}.png" maximumZ={19} />
        {marker && (
          <Marker coordinate={marker} title="Current location">
            <View style={{
              width: 38, height: 38, borderRadius: 19, backgroundColor: '#9cc3ff',
              alignItems: 'center', justifyContent: 'center'
            }}>
              <View style={{ width: 18, height: 18, borderRadius: 9, backgroundColor: '#1e6bff' }} />
            </View>
          </Marker>
        )}
      </MapView>
    </View>
  );
}
