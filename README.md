# David's T1T T-Shirt Tracker 🎯👕

A fun webapp to log and visualize when David wears his t1t t-shirt on Zoom calls.

## Features

### 📝 Logging
- Easy date selection (defaults to today)
- Optional notes for each entry (meeting type, context, etc.)
- One-click logging with visual feedback
- Quick logging directly from calendar clicks

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
- **Export**: Download all data as JSON file
- **Import**: Upload and merge data from JSON file
- **Clear All**: Remove all data (with double confirmation)
- All data stored locally in browser's localStorage

## How to Use

### Running the App
1. Open a terminal in the project directory
2. Start a local web server:
   ```bash
   python3 -m http.server 8080
   ```
3. Open your browser and navigate to `http://localhost:8080`

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
- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Charts**: Chart.js for trend visualization
- **Storage**: Browser localStorage (client-side only)
- **Responsive**: Mobile-friendly design

### File Structure
```
├── index.html          # Main application HTML
├── styles.css          # All styling and responsive design
├── script.js           # Application logic and functionality
└── README.md           # This documentation
```

### Data Format
Data is stored as JSON in localStorage with the key `tshirt-tracker-data`:
```json
{
  "2025-07-09": {
    "notes": "Team standup meeting",
    "timestamp": "2025-07-09T10:30:00.000Z"
  },
  "2025-07-08": {
    "notes": "Client presentation",
    "timestamp": "2025-07-08T15:45:00.000Z"
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

## Privacy
- All data stays in your browser (localStorage)
- No external servers or data transmission
- Data persists until manually cleared or browser data is reset

---

**Enjoy tracking David's t1t t-shirt appearances! 🎯👕**