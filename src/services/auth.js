import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import {signInWithCredential,GoogleAuthProvider,onAuthStateChanged,signInWithEmailAndPassword,createUserWithEmailAndPassword,signOut} from 'firebase/auth';
import { auth } from './firebase';

WebBrowser.maybeCompleteAuthSession();

export function useGoogleAuth(clientId) {
  return Google.useIdTokenAuthRequest({
    clientId,
    iosClientId: clientId,
    androidClientId: clientId
  });
}

export async function signInWithGoogleIdToken(idToken) {
  const credential = GoogleAuthProvider.credential(idToken);
  return signInWithCredential(auth, credential);
}

export function onUserChanged(cb) {
  return onAuthStateChanged(auth, cb);
}

export function emailSignIn(email, password) {
  return signInWithEmailAndPassword(auth, email, password);
}

export function emailSignUp(email, password) {
  return createUserWithEmailAndPassword(auth, email, password);
}

export function doSignOut() {
  return signOut(auth);
}
