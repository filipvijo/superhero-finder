import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getAnalytics } from 'firebase/analytics';

const firebaseConfig = {
  // Replace with your Firebase config
  apiKey: "AIzaSyCDJkOT8rW_BiWO7uw7SBHMinj25ic14zk",
  authDomain: "superhero-app-59b27.firebaseapp.com",
  projectId: "superhero-app-59b27",
  storageBucket: "superhero-app-59b27.firebasestorage.app",
  messagingSenderId: "260919986932",
  appId: "1:260919986932:web:00febdc34baa9ec9a2aca1",
  measurementId: "G-BTV6XRP83E"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const analytics = getAnalytics(app);
