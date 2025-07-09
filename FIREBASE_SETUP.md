# Firebase Setup Instructions

## Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project" or "Add project"
3. Enter project name: `david-tshirt-tracker` (or any name you prefer)
4. Choose whether to enable Google Analytics (optional)
5. Click "Create project"

## Step 2: Enable Firestore Database

1. In your Firebase project console, click "Firestore Database" in the left sidebar
2. Click "Create database"
3. Choose "Start in test mode" (for now) and click "Next"
4. Choose a location (preferably close to your users) and click "Done"

## Step 3: Get Firebase Configuration

1. In Firebase Console, click the gear icon ⚙️ next to "Project Overview"
2. Select "Project settings"
3. Scroll down to "Your apps" section
4. Click "Add app" and choose the web icon `</>`
5. Enter app nickname: `David T-Shirt Tracker`
6. Click "Register app"
7. Copy the `firebaseConfig` object that looks like this:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyC...",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef..."
};
```

## Step 4: Update Configuration File

1. Open `firebase-config.js` in your project
2. Replace the placeholder `firebaseConfig` object with your actual configuration
3. Save the file

## Step 5: Deploy to Netlify

1. Push your updated code to your Git repository
2. Connect your repository to Netlify
3. Deploy!

## Security Rules (Optional but Recommended)

Once deployed, you may want to update Firestore security rules:

1. Go to Firestore Database > Rules in Firebase Console
2. Replace the default rules with:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow read/write access to tshirt-entries collection
    match /tshirt-entries/{document} {
      allow read, write: if true;
    }
  }
}
```

3. Click "Publish"

## That's it!

Your collaborative David's T-Shirt Tracker will now work with real-time Firebase updates on Netlify! 🎉

## Troubleshooting

- **"Firebase not initialized" error**: Check that your config is correct in `firebase-config.js`
- **Permission denied**: Make sure Firestore rules allow read/write access
- **Connection issues**: Check that Firestore is enabled in your Firebase project