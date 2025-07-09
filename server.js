const express = require('express');
const fs = require('fs').promises;
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_FILE = path.join(__dirname, 'tshirt-data.json');

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('.'));

// Initialize data file if it doesn't exist
async function initializeDataFile() {
    try {
        await fs.access(DATA_FILE);
    } catch (error) {
        // File doesn't exist, create it with empty data
        await fs.writeFile(DATA_FILE, JSON.stringify({}));
        console.log('Created initial data file');
    }
}

// Load data from file
async function loadData() {
    try {
        const data = await fs.readFile(DATA_FILE, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Error loading data:', error);
        return {};
    }
}

// Save data to file
async function saveData(data) {
    try {
        await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2));
        return true;
    } catch (error) {
        console.error('Error saving data:', error);
        return false;
    }
}

// API Routes

// GET /api/data - Get all t-shirt data
app.get('/api/data', async (req, res) => {
    try {
        const data = await loadData();
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: 'Failed to load data' });
    }
});

// POST /api/data - Add or update a t-shirt entry
app.post('/api/data', async (req, res) => {
    try {
        const { date, notes, userAgent } = req.body;
        
        if (!date) {
            return res.status(400).json({ error: 'Date is required' });
        }
        
        const data = await loadData();
        
        // Add entry with metadata
        data[date] = {
            notes: notes || '',
            timestamp: new Date().toISOString(),
            userAgent: userAgent || 'Unknown',
            lastModified: new Date().toISOString()
        };
        
        const success = await saveData(data);
        
        if (success) {
            res.json({ message: 'Entry saved successfully', date, data: data[date] });
        } else {
            res.status(500).json({ error: 'Failed to save data' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

// PUT /api/data/:date - Update existing entry
app.put('/api/data/:date', async (req, res) => {
    try {
        const { date } = req.params;
        const { notes, userAgent } = req.body;
        
        const data = await loadData();
        
        if (!data[date]) {
            return res.status(404).json({ error: 'Entry not found' });
        }
        
        // Update entry while preserving original timestamp
        data[date] = {
            ...data[date],
            notes: notes || '',
            userAgent: userAgent || 'Unknown',
            lastModified: new Date().toISOString()
        };
        
        const success = await saveData(data);
        
        if (success) {
            res.json({ message: 'Entry updated successfully', date, data: data[date] });
        } else {
            res.status(500).json({ error: 'Failed to update data' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

// DELETE /api/data/:date - Delete entry
app.delete('/api/data/:date', async (req, res) => {
    try {
        const { date } = req.params;
        
        const data = await loadData();
        
        if (!data[date]) {
            return res.status(404).json({ error: 'Entry not found' });
        }
        
        delete data[date];
        
        const success = await saveData(data);
        
        if (success) {
            res.json({ message: 'Entry deleted successfully', date });
        } else {
            res.status(500).json({ error: 'Failed to delete data' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

// GET /api/stats - Get statistics
app.get('/api/stats', async (req, res) => {
    try {
        const data = await loadData();
        const dates = Object.keys(data).sort();
        
        // Calculate stats
        const totalDays = dates.length;
        
        // This month count (PT timezone)
        const now = new Date();
        const ptDateString = new Intl.DateTimeFormat('en-CA', {
            timeZone: 'America/Los_Angeles',
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        }).format(now);
        const [currentYear, currentMonth] = ptDateString.split('-').map(Number);
        const monthPrefix = `${currentYear}-${String(currentMonth).padStart(2, '0')}`;
        
        const thisMonthCount = dates.filter(date => date.startsWith(monthPrefix)).length;
        
        // Calculate streaks
        let longestStreak = 0;
        let currentStreak = 0;
        let tempStreak = 1;
        
        if (dates.length > 0) {
            // Calculate longest streak
            for (let i = 1; i < dates.length; i++) {
                const prevDate = new Date(dates[i - 1]);
                const currDate = new Date(dates[i]);
                const dayDiff = (currDate - prevDate) / (1000 * 60 * 60 * 24);
                
                if (dayDiff === 1) {
                    tempStreak++;
                } else {
                    longestStreak = Math.max(longestStreak, tempStreak);
                    tempStreak = 1;
                }
            }
            longestStreak = Math.max(longestStreak, tempStreak);
            
            // Calculate current streak
            const todayIndex = dates.indexOf(ptDateString);
            if (todayIndex !== -1) {
                let streakCount = 1;
                for (let i = todayIndex - 1; i >= 0; i--) {
                    const prevDate = new Date(dates[i]);
                    const currDate = new Date(dates[i + 1]);
                    const dayDiff = (currDate - prevDate) / (1000 * 60 * 60 * 24);
                    
                    if (dayDiff === 1) {
                        streakCount++;
                    } else {
                        break;
                    }
                }
                currentStreak = streakCount;
            }
        }
        
        res.json({
            totalDays,
            thisMonth: thisMonthCount,
            longestStreak,
            currentStreak,
            lastUpdate: dates.length > 0 ? data[dates[dates.length - 1]].lastModified || data[dates[dates.length - 1]].timestamp : null
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to calculate stats' });
    }
});

// POST /api/import - Import data (merge with existing)
app.post('/api/import', async (req, res) => {
    try {
        const { importData } = req.body;
        
        if (!importData || typeof importData !== 'object') {
            return res.status(400).json({ error: 'Invalid import data' });
        }
        
        const existingData = await loadData();
        
        // Merge data, with imported data taking precedence
        const mergedData = { ...existingData, ...importData };
        
        const success = await saveData(mergedData);
        
        if (success) {
            res.json({ 
                message: 'Data imported successfully', 
                entriesImported: Object.keys(importData).length,
                totalEntries: Object.keys(mergedData).length
            });
        } else {
            res.status(500).json({ error: 'Failed to import data' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

// DELETE /api/data - Clear all data
app.delete('/api/data', async (req, res) => {
    try {
        const success = await saveData({});
        
        if (success) {
            res.json({ message: 'All data cleared successfully' });
        } else {
            res.status(500).json({ error: 'Failed to clear data' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Start server
async function startServer() {
    await initializeDataFile();
    
    app.listen(PORT, () => {
        console.log(`🎯 David's T-Shirt Tracker Server running on port ${PORT}`);
        console.log(`📊 Access the app at http://localhost:${PORT}`);
        console.log(`🔧 API endpoints available at http://localhost:${PORT}/api/`);
    });
}

startServer().catch(console.error);