// Import the functions you need from the SDKs you need
import { getApp, getApps, initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getAnalytics } from 'firebase/analytics';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyA8fRQ-YjDxSznPD2Ao0wJo7gjZfdXv-08',
  authDomain: 'golive-chat-app.firebaseapp.com',
  projectId: 'golive-chat-app',
  storageBucket: 'golive-chat-app.appspot.com',
  messagingSenderId: '341808483442',
  appId: '1:341808483442:web:f6bd052431c2d22e4d86eb',
  measurementId: 'G-E8M0VN72R7',
};

// Initialize Firebase

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

const db = getFirestore(app);

const auth = getAuth(app);

const provider = new GoogleAuthProvider();

export { db, auth, provider };
