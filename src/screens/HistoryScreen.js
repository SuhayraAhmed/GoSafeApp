import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FontAwesome5 } from '@expo/vector-icons';
import { auth } from '../services/firebase';
import { getWalkHistory } from '../services/firestoreService';
import historyStyles from '../styles/historyStyles';


export default function HistoryScreen({ navigation }) {
  const [walks, setWalks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadWalkHistory();
  }, []);

  const loadWalkHistory = async () => {
    try {
      setLoading(true);
      const user = auth.currentUser;
      if (!user) {
        Alert.alert('Error', 'You must be logged in to view history');
        navigation.goBack();
        return;
      }

      const walkHistory = await getWalkHistory(user.uid);
      setWalks(walkHistory);
    } catch (error) {
      console.error('Error loading walk history:', error);
      Alert.alert('Error', 'Could not load walk history');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    loadWalkHistory();
  };

  const formatDuration = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const hrs = Math.floor(minutes / 60);
    const mins = minutes % 60;
    
    if (hrs > 0) {
      return `${hrs}h ${mins}m`;
    }
    return `${mins}m`;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusIcon = (status, emergencyTriggered) => {
    if (emergencyTriggered) {
      return { icon: 'exclamation-triangle', color: '#dc2626', text: 'Emergency' };
    }
    
    switch (status) {
      case 'completed':
        return { icon: 'check-circle', color: '#16a34a', text: 'Completed' };
      case 'cancelled':
        return { icon: 'times-circle', color: '#d97706', text: 'Cancelled' };
      case 'emergency':
        return { icon: 'exclamation-triangle', color: '#dc2626', text: 'Emergency' };
      default:
        return { icon: 'question-circle', color: '#6b7280', text: 'Unknown' };
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={historyStyles.container}>
        <View style={historyStyles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={historyStyles.backButton}>
            <FontAwesome5 name="arrow-left" size={20} color="#333" />
          </TouchableOpacity>
          <Text style={historyStyles.title}>Walk History</Text>
          <View style={historyStyles.placeholder} />
        </View>
        <View style={historyStyles.loadingContainer}>
          <ActivityIndicator size="large" color="#5B9BFF" />
          <Text style={historyStyles.loadingText}>Loading your walk history...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={historyStyles.container}>
      <View style={historyStyles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={historyStyles.backButton}>
          <FontAwesome5 name="arrow-left" size={20} color="#333" />
        </TouchableOpacity>
        <Text style={historyStyles.title}>Walk History</Text>
        <TouchableOpacity onPress={handleRefresh} style={historyStyles.refreshButton}>
          <FontAwesome5 name="sync" size={18} color="#5B9BFF" />
        </TouchableOpacity>
      </View>

      <ScrollView style={historyStyles.scrollView} showsVerticalScrollIndicator={false}>
        {walks.length === 0 ? (
          <View style={historyStyles.emptyState}>
            <FontAwesome5 name="history" size={50} color="#d1d5db" />
            <Text style={historyStyles.emptyTitle}>No Walk History</Text>
            <Text style={historyStyles.emptyText}>
              Your completed walks will appear here
            </Text>
          </View>
        ) : (
          walks.map((walk) => {
            const statusInfo = getStatusIcon(walk.status, walk.emergencyTriggered);
            
            return (
              <View key={walk.id} style={historyStyles.walkCard}>
                <View style={historyStyles.walkHeader}>
                  <View style={historyStyles.dateContainer}>
                    <FontAwesome5 name="calendar" size={14} color="#6b7280" />
                    <Text style={historyStyles.dateText}>
                      {formatDate(walk.startTime)}
                    </Text>
                  </View>
                  
                  {/* Ta bort delete-knappen helt */}
                </View>

                <View style={historyStyles.walkDetails}>
                  <View style={historyStyles.detailRow}>
                    <View style={historyStyles.detailItem}>
                      <FontAwesome5 name="clock" size={14} color="#6b7280" />
                      <Text style={historyStyles.detailText}>
                        Duration: {formatDuration(walk.duration)}
                      </Text>
                    </View>
                    
                    <View style={historyStyles.detailItem}>
                      <FontAwesome5 name="route" size={14} color="#6b7280" />
                      <Text style={historyStyles.detailText}>
                        Planned: {formatDuration(walk.plannedDuration)}
                      </Text>
                    </View>
                  </View>

                  <View style={historyStyles.statusContainer}>
                    <FontAwesome5 
                      name={statusInfo.icon} 
                      size={14} 
                      color={statusInfo.color} 
                    />
                    <Text style={[historyStyles.statusText, { color: statusInfo.color }]}>
                      {statusInfo.text}
                    </Text>
                  </View>
                </View>
              </View>
            );
          })
        )}
      </ScrollView>
    </SafeAreaView>
  );
}