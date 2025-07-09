# David's T1T T-Shirt Tracker 🎯👕

A collaborative webapp where everyone can log and visualize when David wears his t1t t-shirt on Zoom calls. Multiple users can track entries together with real-time updates!

## Features

### 🚀 Collaborative Tracking
- **Firebase Real-time**: Instant updates across all users with Firestore
- **Multi-User Support**: Multiple people can log entries simultaneously
- **Live Sync**: Changes appear instantly without refresh
- **Connection Status**: Visual indicator showing online/offline status
- **User Attribution**: Tracks which browser/user made each entry
- **Cloud Storage**: Data stored securely in Firebase cloud

### 📝 Logging
- Easy date selection (defaults to today in Pacific Time)
- Optional notes for each entry (meeting type, context, etc.)
- One-click logging with visual feedback
- Quick logging directly from calendar clicks
- Real-time updates across all connected users

### 📊 Statistics
- **Total T-Shirt Days**: Total count of logged days
- **This Month**: Count for current month
- **Longest Streak**: Maximum consecutive days
- **Current Streak**: Current consecutive days (including today)

### 📅 Calendar View
- Monthly calendar with t-shirt days highlighted in green
- T-shirt emoji indicator on logged days
- Navigation between months
- Click any day to quickly log or edit entries
- Today's date highlighted with blue border

### 📈 Trends Chart
- Monthly trend visualization for the last 12 months
- Powered by Chart.js for smooth, interactive charts

### 📋 Recent Entries
- List of the 10 most recent entries
- Edit or delete functionality for each entry
- Shows date and notes for each logged day

### 💾 Data Management
- **Export**: Download all shared data as JSON file
- **Import**: Upload and merge data with existing shared data
- **Clear All**: Remove all shared data (affects all users, double confirmation required)
- **Persistent Storage**: Data stored on server, shared across all users
- **Backup Recommended**: Regular exports recommended for data safety

## How to Use

### Setup & Deployment

#### Firebase Setup (Required)
1. Follow the detailed instructions in [FIREBASE_SETUP.md](FIREBASE_SETUP.md)
2. Create a Firebase project and enable Firestore
3. Update `firebase-config.js` with your Firebase configuration

#### Local Development
1. Open `index.html` in your browser, or
2. Use a simple HTTP server:
   ```bash
   python3 -m http.server 8080
   # or
   npx serve .
   ```

#### Netlify Deployment (Recommended)
1. Push your code to GitHub/GitLab
2. Connect repository to Netlify
3. Deploy! No build process needed - it's a static site
4. Share your Netlify URL with team members

#### Alternative Hosting
- Vercel, GitHub Pages, or any static hosting service
- No server required - pure frontend with Firebase backend

### Logging T-Shirt Days
1. **Quick Method**: Click any day on the calendar and confirm
2. **Detailed Method**: 
   - Select date in the form (defaults to today)
   - Add optional notes about the meeting/context
   - Click "Log T-Shirt Day"

### Managing Entries
- **Edit**: Click "Edit" button in Recent Entries or click on a logged calendar day
- **Delete**: Click "Delete" button in Recent Entries or click on a logged calendar day and choose to remove
- **View Details**: Hover over calendar days to see tooltips with notes

### Data Backup
- Use "Export Data" to download a backup JSON file
- Import data from another device/browser using "Import Data"
- File format: `david-tshirt-data-YYYY-MM-DD.json`

## Technical Details

### Technology Stack
- **Backend**: Firebase Firestore (NoSQL cloud database)
- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Charts**: Chart.js for trend visualization  
- **Storage**: Firebase Firestore with real-time sync
- **Real-time**: Firebase real-time listeners (instant updates)
- **Hosting**: Static hosting (Netlify, Vercel, etc.)
- **Responsive**: Mobile-friendly design
- **Cross-Platform**: Works on any device with a web browser

### File Structure
```
├── index.html          # Main application HTML
├── styles.css          # All styling and responsive design
├── script.js           # Frontend logic with Firebase integration
├── firebase-config.js  # Firebase configuration (update with your keys)
├── README.md           # This documentation
└── FIREBASE_SETUP.md   # Step-by-step Firebase setup guide
```

### Data Format
Data is stored as JSON in `tshirt-data.json` on the server:
```json
{
  "2025-07-09": {
    "notes": "Team standup meeting",
    "timestamp": "2025-07-09T10:30:00.000Z",
    "userAgent": "Mozilla/5.0...",
    "lastModified": "2025-07-09T10:30:00.000Z"
  },
  "2025-07-08": {
    "notes": "Client presentation",
    "timestamp": "2025-07-08T15:45:00.000Z",
    "userAgent": "Mozilla/5.0...",
    "lastModified": "2025-07-08T15:45:00.000Z"
  }
}
```

## Browser Compatibility
- Chrome/Chromium (recommended)
- Firefox
- Safari
- Edge

## Features in Detail

### Calendar Interactions
- **Green Days**: Days when David wore his t1t shirt
- **T-shirt Emoji**: Visual indicator on logged days
- **Blue Border**: Today's date
- **Clickable**: Quick log/edit functionality
- **Tooltips**: Hover to see notes

### Streak Calculation
- **Longest Streak**: Calculates maximum consecutive days in history
- **Current Streak**: Counts backwards from today if today is logged
- **Smart Logic**: Handles gaps and calculates accurately

### Statistics Updates
- Real-time updates after every action
- Monthly counts based on calendar month
- Streak calculations consider consecutive calendar days

## Customization
The app can be easily customized by modifying:
- Colors and styling in `styles.css`
- Statistics calculations in `script.js`
- Chart configuration in the `renderChart()` method

## Collaboration & Privacy
- **Cloud Storage**: Data stored securely in Firebase (Google Cloud)
- **Real-time Sync**: Instant updates across all users worldwide
- **User Tracking**: Browser user-agent stored with entries for troubleshooting
- **Data Persistence**: Data persists in Firebase until manually cleared
- **Global Access**: Share your deployed URL with team members anywhere
- **Firebase Security**: Data protected by Firebase security rules

## Scaling & Production
- **Firebase Free Tier**: Generous limits for small teams
- **Auto-scaling**: Firebase scales automatically with usage
- **Global CDN**: Fast access from anywhere in the world
- **Authentication**: Can add Firebase Auth for user management
- **Backup**: Firebase handles backups automatically
- **Monitoring**: Firebase provides usage analytics and monitoring

---

**Enjoy tracking David's t1t t-shirt appearances! 🎯👕**