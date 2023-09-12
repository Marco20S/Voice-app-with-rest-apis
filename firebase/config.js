// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import {getStorage, ref} from "firebase/storage"
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { initializeAuth } from 'firebase/auth';
import { getReactNativePersistence } from 'firebase/auth/react-native';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
// Import the functions you need from the SDKs you need
// import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDucXCaTtcvkZZESEfWER38i-eR6mk1zFo",
  authDomain: "voice-record-app-4ccfd.firebaseapp.com",
  projectId: "voice-record-app-4ccfd",
  storageBucket: "voice-record-app-4ccfd.appspot.com",
  messagingSenderId: "1039238876981",
  appId: "1:1039238876981:web:30810c67ac8fb0d962c67c"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// const analytics = getAnalytics(app);

// export default getFirestore(app)
export const database = getFirestore(app);
export const storage = getStorage(app)

//auth for firebase
// export const auth = getAuth(app)

export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});