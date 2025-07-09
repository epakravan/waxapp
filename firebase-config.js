// Firebase Configuration
// David's T-Shirt Tracker Firebase Project
const firebaseConfig = {
  apiKey: "AIzaSyAqHF2nR-ipCUjLKaQSWxLPOjD6fTdgqos",
  authDomain: "waxapp-ff7c2.firebaseapp.com",
  projectId: "waxapp-ff7c2",
  storageBucket: "waxapp-ff7c2.firebasestorage.app",
  messagingSenderId: "179937755040",
  appId: "1:179937755040:web:38b0ffe6d9b3e22a0b6ec5",
  measurementId: "G-ZF2XCN86KK"
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