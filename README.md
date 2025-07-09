# David's T1T T-Shirt Tracker 🎯👕

A collaborative webapp where everyone can log and visualize when David wears his t1t t-shirt on Zoom calls. Multiple users can track entries together with real-time updates!

## Features

### 🚀 Collaborative Tracking
- **Shared Data**: All users see the same data in real-time
- **Multi-User Support**: Multiple people can log entries simultaneously
- **Auto-Refresh**: Updates every 30 seconds to show other users' changes
- **Connection Status**: Visual indicator showing online/offline status
- **User Attribution**: Tracks which browser/user made each entry

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

### Running the App

#### Prerequisites
- Node.js (v14 or later)
- npm

#### Installation & Startup
1. Open a terminal in the project directory
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the server:
   ```bash
   npm start
   ```
4. Open your browser and navigate to `http://localhost:3000`
5. Share the URL with team members for collaborative tracking!

#### Development Mode
```bash
npm run dev  # Uses nodemon for auto-restart
```

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
- **Backend**: Node.js with Express.js REST API
- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Charts**: Chart.js for trend visualization  
- **Storage**: File-based JSON storage (server-side)
- **Real-time**: Polling-based updates every 30 seconds
- **Responsive**: Mobile-friendly design
- **Cross-Platform**: Works on any device with a web browser

### File Structure
```
├── server.js           # Express.js backend server
├── package.json        # Node.js dependencies and scripts
├── index.html          # Main application HTML
├── styles.css          # All styling and responsive design
├── script.js           # Frontend logic with API integration
├── tshirt-data.json    # Shared data storage (auto-created)
└── README.md           # This documentation
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
- **Shared Data**: All entries are visible to all users accessing the same server
- **Local Server**: Data stays on your local network (no external transmission)
- **User Tracking**: Browser user-agent stored with entries for troubleshooting
- **Data Persistence**: Data persists on server until manually cleared
- **Team Access**: Share `http://localhost:3000` with team members

## Production Deployment
For team use across different networks:
1. Deploy to a cloud server (Heroku, AWS, DigitalOcean, etc.)
2. Update the URL in team communications
3. Consider adding authentication for larger teams
4. Set up regular data backups

---

**Enjoy tracking David's t1t t-shirt appearances! 🎯👕**