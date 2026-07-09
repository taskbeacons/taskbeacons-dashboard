import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyBc5AIOaHa20BRkYyI6YMiTC2n0aRVD-1M",
  authDomain: "taskbeacon-76494.firebaseapp.com",
  projectId: "taskbeacon-76494",
  storageBucket: "taskbeacon-76494.firebasestorage.app",
  messagingSenderId: "223556745356",
  appId: "1:223556745356:web:98d9dd2b2378e40963a3a9",
  measurementId: "G-CQYGZG6X98"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
