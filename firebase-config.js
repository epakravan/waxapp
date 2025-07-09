// Firebase Configuration
// Replace this with your Firebase project config from Firebase Console > Project Settings > General > Your apps
const firebaseConfig = {
  apiKey: "your-api-key-here",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "your-app-id"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Initialize Firestore
const db = firebase.firestore();

// Collection reference for t-shirt data
const tshirtCollection = db.collection('tshirt-entries');

// Export for use in other files
window.db = db;
window.tshirtCollection = tshirtCollection;