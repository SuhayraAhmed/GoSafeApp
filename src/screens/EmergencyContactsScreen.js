import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, TextInput, ScrollView, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FontAwesome5 } from '@expo/vector-icons';
import { auth } from '../services/firebase';
import { 
  getEmergencyContacts, 
  addEmergencyContact, 
  updateEmergencyContact, 
  deleteEmergencyContact,
  canAddMoreContacts 
} from '../services/firestoreService';
import HeaderBar from '../components/HeaderBar';
import BottomNav from '../components/BottomNav';
import contactsStyles from '../styles/contactsStyles';

export default function EmergencyContactsScreen({ navigation }) {
  const [contacts, setContacts] = useState([]);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadContacts();
  }, []);

  const loadContacts = async () => {
    try {
      const user = auth.currentUser;
      if (!user) {
        Alert.alert('Error', 'You must be logged in to view contacts');
        return;
      }

      const contacts = await getEmergencyContacts(user.uid);
      setContacts(contacts);
    } catch (error) {
      console.error('Error loading contacts:', error);
      Alert.alert('Error', 'Failed to load contacts');
    }
  };

  const addContact = async () => {
    if (!name.trim() || !phone.trim()) {
      Alert.alert('Error', 'Please enter both name and phone number');
      return;
    }

    const phoneRegex = /^[\+]?[0-9\s\-\(\)]{8,}$/;
    if (!phoneRegex.test(phone)) {
      Alert.alert('Error', 'Please enter a valid phone number');
      return;
    }

    const contactExists = contacts.some(contact => 
      contact.phone === phone.trim()
    );

    if (contactExists) {
      Alert.alert('Error', 'This phone number is already in your contacts');
      return;
    }

    const canAddMore = await canAddMoreContacts(auth.currentUser.uid);
    if (!canAddMore) {
      Alert.alert('Limit Reached', 'You can only have up to 5 emergency contacts');
      return;
    }

    setLoading(true);

    try {
      const user = auth.currentUser;
      const newContact = {
        name: name.trim(),
        phone: phone.trim()
      };

      const savedContact = await addEmergencyContact(user.uid, newContact);
      
      setContacts(prevContacts => [savedContact, ...prevContacts]);
      
      setName('');
      setPhone('');
      Alert.alert('Success', 'Contact added successfully!');
    } catch (error) {
      console.error('Error adding contact:', error);
      Alert.alert('Error', 'Failed to add contact');
    } finally {
      setLoading(false);
    }
  };

  const deleteContact = async (contactId) => {
    Alert.alert(
      'Delete Contact',
      'Are you sure you want to delete this contact?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteEmergencyContact(contactId);
              // Uppdatera lokal state
              setContacts(prevContacts => 
                prevContacts.filter(contact => contact.id !== contactId)
              );
              Alert.alert('Success', 'Contact deleted successfully');
            } catch (error) {
              console.error('Error deleting contact:', error);
              Alert.alert('Error', 'Failed to delete contact');
            }
          }
        }
      ]
    );
  };

  const callContact = (phoneNumber) => {
    Alert.alert(
      'Call Contact',
      `Do you want to call ${phoneNumber}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Call', 
          onPress: () => {
            console.log('Calling:', phoneNumber);
            Alert.alert('Call', `Would call ${phoneNumber} in a real app`);
          }
        }
      ]
    );
  };

  const editContact = (contact) => {
    Alert.prompt(
      'Edit Contact',
      'Enter new name for this contact:',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Save',
          onPress: async (newName) => {
            if (newName && newName.trim()) {
              try {
                await updateEmergencyContact(contact.id, {
                  name: newName.trim()
                });
                
                // Uppdatera lokal state
                setContacts(prevContacts => 
                  prevContacts.map(c => 
                    c.id === contact.id 
                      ? { ...c, name: newName.trim() }
                      : c
                  )
                );
                Alert.alert('Success', 'Contact updated successfully');
              } catch (error) {
                console.error('Error updating contact:', error);
                Alert.alert('Error', 'Failed to update contact');
              }
            }
          }
        }
      ],
      'plain-text',
      contact.name
    );
  };

  return (
    <SafeAreaView style={contactsStyles.container}>
      <HeaderBar title="Emergency Contacts" />
      
      <KeyboardAvoidingView 
        style={contactsStyles.keyboardAvoid}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView style={contactsStyles.scrollView} showsVerticalScrollIndicator={false}>
          
          <View style={contactsStyles.formSection}>
            <Text style={contactsStyles.sectionTitle}>Add New Contact</Text>
            <View style={contactsStyles.formCard}>
              <TextInput
                style={contactsStyles.input}
                placeholder="Contact Name"
                value={name}
                onChangeText={setName}
                maxLength={30}
                editable={!loading}
              />
              <TextInput
                style={contactsStyles.input}
                placeholder="Phone Number"
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
                maxLength={15}
                editable={!loading}
              />
              <TouchableOpacity 
                style={[
                  contactsStyles.addButton,
                  loading && contactsStyles.disabledButton
                ]}
                onPress={addContact}
                disabled={loading}
              >
                {loading ? (
                  <Text style={contactsStyles.addButtonText}>Adding...</Text>
                ) : (
                  <>
                    <FontAwesome5 name="plus" size={16} color="#fff" />
                    <Text style={contactsStyles.addButtonText}>Add Contact</Text>
                  </>
                )}
              </TouchableOpacity>
            </View>
          </View>

          <View style={contactsStyles.listSection}>
            <Text style={contactsStyles.sectionTitle}>
              My Emergency Contacts ({contacts.length}/5)
            </Text>
            
            {contacts.length === 0 ? (
              <View style={contactsStyles.emptyState}>
                <FontAwesome5 name="users" size={48} color="#9CA3AF" />
                <Text style={contactsStyles.emptyStateTitle}>No Contacts Yet</Text>
                <Text style={contactsStyles.emptyStateText}>
                  Add your trusted contacts for emergencies
                </Text>
              </View>
            ) : (
              contacts.map((contact) => (
                <View key={contact.id} style={contactsStyles.contactCard}>
                  <View style={contactsStyles.contactInfo}>
                    <TouchableOpacity onPress={() => editContact(contact)}>
                      <Text style={contactsStyles.contactName}>{contact.name}</Text>
                    </TouchableOpacity>
                    <Text style={contactsStyles.contactPhone}>{contact.phone}</Text>
                    {contact.addedAt && (
                      <Text style={contactsStyles.contactDate}>
                        Added: {new Date(contact.addedAt).toLocaleDateString()}
                      </Text>
                    )}
                  </View>
                  <View style={contactsStyles.contactActions}>
                    <TouchableOpacity 
                      style={contactsStyles.callButton}
                      onPress={() => callContact(contact.phone)}
                    >
                      <FontAwesome5 name="phone" size={14} color="#fff" />
                    </TouchableOpacity>
                    <TouchableOpacity 
                      style={contactsStyles.editButton}
                      onPress={() => editContact(contact)}
                    >
                      <FontAwesome5 name="edit" size={14} color="#fff" />
                    </TouchableOpacity>
                    <TouchableOpacity 
                      style={contactsStyles.deleteButton}
                      onPress={() => deleteContact(contact.id)}
                    >
                      <FontAwesome5 name="trash" size={14} color="#fff" />
                    </TouchableOpacity>
                  </View>
                </View>
              ))
            )}
          </View>

          <View style={contactsStyles.infoSection}>
            <Text style={contactsStyles.infoTitle}>ℹ️ Important Information</Text>
            <Text style={contactsStyles.infoText}>
              • These contacts will be notified in case of emergency{'\n'}
              • Keep your contacts updated regularly{'\n'}
              • Maximum 5 contacts allowed{'\n'}
              • Contacts are saved securely in the cloud
            </Text>
          </View>

        </ScrollView>
      </KeyboardAvoidingView>

      <BottomNav navigation={navigation} />
    </SafeAreaView>
  );
}