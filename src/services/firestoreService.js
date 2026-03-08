// src/services/firestoreService.js
import { db } from './firebase';
import {doc,setDoc,getDoc,updateDoc,collection,query,where,getDocs,deleteDoc,orderBy } from 'firebase/firestore';

export const createUserDocument = async (user) => {
  if (!user) return;

  try {
    const userRef = doc(db, 'users', user.uid);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      await setDoc(userRef, {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName || '',
        photoURL: user.photoURL || '',
        createdAt: new Date().toISOString(),
        lastLoginAt: new Date().toISOString(),
      });
      console.log('User document created for:', user.uid);
    } else {
      await updateDoc(userRef, {
        lastLoginAt: new Date().toISOString(),
      });
    }
  } catch (error) {
    console.error('Error creating user document:', error);
  }
};

export const getUserDocument = async (userId) => {
  try {
    const userRef = doc(db, 'users', userId);
    const userSnap = await getDoc(userRef);
    return userSnap.exists() ? userSnap.data() : null;
  } catch (error) {
    console.error('Error getting user document:', error);
    return null;
  }
};

// Nya funktioner för emergency contacts i egen collection
export const addEmergencyContact = async (userId, contact) => {
  try {
    const contactsRef = collection(db, 'emergencyContacts');
    const contactDoc = doc(contactsRef);
    
    const contactData = {
      id: contactDoc.id,
      userId: userId,
      name: contact.name,
      phone: contact.phone,
      addedAt: new Date().toISOString(),
      isActive: true
    };

    await setDoc(contactDoc, contactData);
    console.log('Emergency contact added:', contactDoc.id);
    return contactData;
  } catch (error) {
    console.error('Error adding emergency contact:', error);
    throw error;
  }
};

export const getEmergencyContacts = async (userId) => {
  try {
    const contactsRef = collection(db, 'emergencyContacts');
    const q = query(
      contactsRef, 
      where('userId', '==', userId),
      where('isActive', '==', true),
      orderBy('addedAt', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    const contacts = [];
    
    querySnapshot.forEach((doc) => {
      contacts.push(doc.data());
    });
    
    return contacts;
  } catch (error) {
    console.error('Error getting emergency contacts:', error);
    throw error;
  }
};

export const updateEmergencyContact = async (contactId, updatedData) => {
  try {
    const contactRef = doc(db, 'emergencyContacts', contactId);
    await updateDoc(contactRef, {
      ...updatedData,
      updatedAt: new Date().toISOString()
    });
    console.log('Emergency contact updated:', contactId);
    return true;
  } catch (error) {
    console.error('Error updating emergency contact:', error);
    throw error;
  }
};

export const deleteEmergencyContact = async (contactId) => {
  try {
    const contactRef = doc(db, 'emergencyContacts', contactId);
    await deleteDoc(contactRef);
    console.log('Emergency contact deleted:', contactId);
    return true;
  } catch (error) {
    console.error('Error deleting emergency contact:', error);
    throw error;
  }
};

// Kolla om användaren har max antal kontakter
export const canAddMoreContacts = async (userId, maxContacts = 5) => {
  try {
    const contacts = await getEmergencyContacts(userId);
    return contacts.length < maxContacts;
  } catch (error) {
    console.error('Error checking contact limit:', error);
    throw error;
  }
};

// firestoreService.js - Lägg till dessa funktioner

// Spara promenadhistorik
export const saveWalkHistory = async (userId, walkData) => {
  try {
    const walksRef = collection(db, 'walkHistory');
    const walkDoc = doc(walksRef);
    
    const historyData = {
      id: walkDoc.id,
      userId: userId,
      startTime: walkData.startTime,
      endTime: walkData.endTime || new Date().toISOString(),
      duration: walkData.duration,
      plannedDuration: walkData.plannedDuration,
      coordinates: walkData.coordinates || [],
      distance: walkData.distance || 0,
      status: walkData.status || 'completed', // 'completed', 'cancelled', 'emergency'
      emergencyTriggered: walkData.emergencyTriggered || false,
      createdAt: new Date().toISOString()
    };

    await setDoc(walkDoc, historyData);
    console.log('Walk history saved:', walkDoc.id);
    return historyData;
  } catch (error) {
    console.error('Error saving walk history:', error);
    throw error;
  }
};

// Hämta promenadhistorik
export const getWalkHistory = async (userId, limit = 50) => {
  try {
    const walksRef = collection(db, 'walkHistory');
    const q = query(
      walksRef, 
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    const walks = [];
    
    querySnapshot.forEach((doc) => {
      walks.push(doc.data());
    });
    
    return walks.slice(0, limit);
  } catch (error) {
    console.error('Error getting walk history:', error);
    throw error;
  }
};
