class TShirtTracker {
    constructor() {
        this.data = {};
        this.currentDate = new Date();
        this.chart = null;
        this.unsubscribe = null; // For Firebase listener
        this.isOnline = false;
        this.init();
    }

    async init() {
        // Wait for Firebase to be ready
        if (typeof firebase === 'undefined' || !window.tshirtCollection) {
            console.error('Firebase not initialized. Please check firebase-config.js');
            this.showToast('Firebase configuration missing. Please set up Firebase.', 'error');
            return;
        }
        
        this.setupEventListeners();
        this.setTodayAsDefault();
        await this.setupFirebaseListener();
        this.updateStats();
        this.renderCalendar();
        this.renderChart();
        this.renderRecentEntries();
    }

    setupEventListeners() {
        // Log button
        document.getElementById('log-btn').addEventListener('click', () => {
            this.logTShirtDay();
        });

        // Calendar navigation
        document.getElementById('prev-month').addEventListener('click', () => {
            this.currentDate.setMonth(this.currentDate.getMonth() - 1);
            this.renderCalendar();
        });

        document.getElementById('next-month').addEventListener('click', () => {
            this.currentDate.setMonth(this.currentDate.getMonth() + 1);
            this.renderCalendar();
        });

        // Data management
        document.getElementById('export-btn').addEventListener('click', () => {
            this.exportData();
        });

        document.getElementById('import-btn').addEventListener('click', () => {
            document.getElementById('import-file').click();
        });

        document.getElementById('import-file').addEventListener('change', (e) => {
            this.importData(e.target.files[0]);
        });

        document.getElementById('clear-btn').addEventListener('click', () => {
            this.clearAllData();
        });

        // Enter key support for form
        document.getElementById('notes-input').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.logTShirtDay();
            }
        });
    }

    setTodayAsDefault() {
        const today = this.getTodayInPT();
        document.getElementById('date-input').value = today;
    }

    getTodayInPT() {
        const now = new Date();
        // Get current time in Pacific timezone
        const ptTime = new Intl.DateTimeFormat('en-CA', {
            timeZone: 'America/Los_Angeles',
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        }).format(now);
        return ptTime; // Returns YYYY-MM-DD format
    }

    formatDateInPT(dateString) {
        const date = new Date(dateString + 'T00:00:00');
        return date.toLocaleDateString('en-US', {
            timeZone: 'America/Los_Angeles',
            weekday: 'short',
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    }

    getCurrentMonthInPT() {
        const now = new Date();
        const ptDateString = new Intl.DateTimeFormat('en-CA', {
            timeZone: 'America/Los_Angeles',
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        }).format(now);
        const [year, month] = ptDateString.split('-').map(Number);
        return {
            year: year,
            month: month - 1 // JavaScript months are 0-based
        };
    }

    async setupFirebaseListener() {
        try {
            // Set up real-time listener for Firebase collection
            this.unsubscribe = window.tshirtCollection.onSnapshot(
                (snapshot) => {
                    this.data = {};
                    snapshot.forEach((doc) => {
                        this.data[doc.id] = doc.data();
                    });
                    
                    this.updateConnectionStatus(true);
                    this.updateStats();
                    this.renderCalendar();
                    this.renderChart();
                    this.renderRecentEntries();
                    
                    if (this.isOnline) {
                        this.showToast('Data updated in real-time', 'info');
                    }
                    this.isOnline = true;
                },
                (error) => {
                    console.error('Firebase listener error:', error);
                    this.updateConnectionStatus(false);
                    this.showToast('Connection lost. Retrying...', 'error');
                }
            );
        } catch (error) {
            console.error('Error setting up Firebase listener:', error);
            this.updateConnectionStatus(false);
            this.showToast('Failed to connect to Firebase', 'error');
        }
    }

    updateConnectionStatus(isOnline) {
        const statusEl = document.getElementById('online-status');
        if (statusEl) {
            if (isOnline) {
                statusEl.innerHTML = '🟢 Online';
                statusEl.style.color = '#48bb78';
            } else {
                statusEl.innerHTML = '🔴 Offline';
                statusEl.style.color = '#e53e3e';
            }
        }
    }

    async saveEntry(date, notes) {
        try {
            const entryData = {
                notes: notes || '',
                timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                userAgent: navigator.userAgent,
                lastModified: firebase.firestore.FieldValue.serverTimestamp()
            };
            
            await window.tshirtCollection.doc(date).set(entryData);
            return true;
        } catch (error) {
            console.error('Error saving entry:', error);
            this.showToast('Failed to save entry', 'error');
            return false;
        }
    }

    async updateEntry(date, notes) {
        try {
            const updateData = {
                notes: notes || '',
                lastModified: firebase.firestore.FieldValue.serverTimestamp(),
                userAgent: navigator.userAgent
            };
            
            await window.tshirtCollection.doc(date).update(updateData);
            return true;
        } catch (error) {
            console.error('Error updating entry:', error);
            this.showToast('Failed to update entry', 'error');
            return false;
        }
    }

    async deleteEntry(date) {
        try {
            await window.tshirtCollection.doc(date).delete();
            return true;
        } catch (error) {
            console.error('Error deleting entry:', error);
            this.showToast('Failed to delete entry', 'error');
            return false;
        }
    }

    async logTShirtDay() {
        const dateInput = document.getElementById('date-input');
        const notesInput = document.getElementById('notes-input');
        
        const date = dateInput.value;
        const notes = notesInput.value.trim();

        if (!date) {
            alert('Please select a date');
            return;
        }

        if (this.data[date]) {
            if (!confirm('An entry already exists for this date. Do you want to update it?')) {
                return;
            }
            
            const success = await this.updateEntry(date, notes);
            if (success) {
                this.updateStats();
                this.renderCalendar();
                this.renderChart();
                this.renderRecentEntries();
                notesInput.value = '';
                this.showToast('T-shirt day updated successfully! 👕');
            }
        } else {
            const success = await this.saveEntry(date, notes);
            if (success) {
                this.updateStats();
                this.renderCalendar();
                this.renderChart();
                this.renderRecentEntries();
                notesInput.value = '';
                this.showToast('T-shirt day logged successfully! 👕');
            }
        }
    }

    async removeEntry(date) {
        if (confirm('Are you sure you want to remove this entry?')) {
            const success = await this.deleteEntry(date);
            if (success) {
                this.updateStats();
                this.renderCalendar();
                this.renderChart();
                this.renderRecentEntries();
                this.showToast('Entry removed');
            }
        }
    }

    async editEntry(date) {
        const entry = this.data[date];
        const newNotes = prompt('Edit notes:', entry.notes || '');
        
        if (newNotes !== null) {
            const success = await this.updateEntry(date, newNotes.trim());
            if (success) {
                this.renderRecentEntries();
                this.showToast('Entry updated');
            }
        }
    }

    updateStats() {
        const dates = Object.keys(this.data).sort();
        const totalDays = dates.length;
        
        // This month count (using PT)
        const ptMonth = this.getCurrentMonthInPT();
        const thisMonthStart = new Date(ptMonth.year, ptMonth.month, 1);
        const thisMonthEnd = new Date(ptMonth.year, ptMonth.month + 1, 0);
        
        const thisMonthCount = dates.filter(date => {
            const d = new Date(date + 'T00:00:00');
            return d >= thisMonthStart && d <= thisMonthEnd;
        }).length;

        // Calculate streaks
        const { longestStreak, currentStreak } = this.calculateStreaks(dates);

        document.getElementById('total-days').textContent = totalDays;
        document.getElementById('this-month').textContent = thisMonthCount;
        document.getElementById('longest-streak').textContent = longestStreak;
        document.getElementById('current-streak').textContent = currentStreak;
    }

    calculateStreaks(sortedDates) {
        if (sortedDates.length === 0) {
            return { longestStreak: 0, currentStreak: 0 };
        }

        let longestStreak = 1;
        let currentStreakLength = 1;
        let tempStreak = 1;

        // Calculate longest streak
        for (let i = 1; i < sortedDates.length; i++) {
            const prevDate = new Date(sortedDates[i - 1]);
            const currDate = new Date(sortedDates[i]);
            const dayDiff = (currDate - prevDate) / (1000 * 60 * 60 * 24);

            if (dayDiff === 1) {
                tempStreak++;
            } else {
                longestStreak = Math.max(longestStreak, tempStreak);
                tempStreak = 1;
            }
        }
        longestStreak = Math.max(longestStreak, tempStreak);

        // Calculate current streak (from today backwards - using PT)
        const today = new Date();
        const todayPT = new Intl.DateTimeFormat('en-CA', {
            timeZone: 'America/Los_Angeles',
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        }).format(today);
        const todayIndex = sortedDates.indexOf(todayPT);
        
        if (todayIndex === -1) {
            currentStreakLength = 0;
        } else {
            let streakCount = 1;
            for (let i = todayIndex - 1; i >= 0; i--) {
                const prevDate = new Date(sortedDates[i]);
                const currDate = new Date(sortedDates[i + 1]);
                const dayDiff = (currDate - prevDate) / (1000 * 60 * 60 * 24);
                
                if (dayDiff === 1) {
                    streakCount++;
                } else {
                    break;
                }
            }
            currentStreakLength = streakCount;
        }

        return { longestStreak, currentStreak: currentStreakLength };
    }

    renderCalendar() {
        const year = this.currentDate.getFullYear();
        const month = this.currentDate.getMonth();
        
        // Update month/year display
        const monthNames = [
            'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'
        ];
        document.getElementById('current-month-year').textContent = 
            `${monthNames[month]} ${year}`;

        const calendarGrid = document.getElementById('calendar-grid');
        calendarGrid.innerHTML = '';

        // Add day headers
        const dayHeaders = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        dayHeaders.forEach(day => {
            const headerEl = document.createElement('div');
            headerEl.className = 'calendar-header';
            headerEl.textContent = day;
            calendarGrid.appendChild(headerEl);
        });

        // Get first day of month and number of days
        const firstDay = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const daysInPrevMonth = new Date(year, month, 0).getDate();

        // Add previous month's trailing days
        for (let i = firstDay - 1; i >= 0; i--) {
            const dayEl = this.createCalendarDay(
                daysInPrevMonth - i, 
                true, 
                new Date(year, month - 1, daysInPrevMonth - i)
            );
            calendarGrid.appendChild(dayEl);
        }

        // Add current month's days
        for (let day = 1; day <= daysInMonth; day++) {
            const dayEl = this.createCalendarDay(
                day, 
                false, 
                new Date(year, month, day)
            );
            calendarGrid.appendChild(dayEl);
        }

        // Add next month's leading days
        const remainingCells = 42 - (firstDay + daysInMonth); // 6 rows * 7 days
        for (let day = 1; day <= remainingCells; day++) {
            const dayEl = this.createCalendarDay(
                day, 
                true, 
                new Date(year, month + 1, day)
            );
            calendarGrid.appendChild(dayEl);
        }
    }

    createCalendarDay(day, isOtherMonth, date) {
        const dayEl = document.createElement('div');
        dayEl.className = 'calendar-day';
        dayEl.textContent = day;

        if (isOtherMonth) {
            dayEl.classList.add('other-month');
        }

        const dateStr = date.toISOString().split('T')[0];
        
        // Check if it's today (using PT)
        const today = this.getTodayInPT();
        if (dateStr === today) {
            dayEl.classList.add('today');
        }

        // Check if it's a t-shirt day
        if (this.data[dateStr]) {
            dayEl.classList.add('tshirt-day');
            dayEl.title = `T-shirt day! ${this.data[dateStr].notes || ''}`;
        }

        // Add click handler for quick logging
        dayEl.addEventListener('click', () => {
            if (!isOtherMonth) {
                document.getElementById('date-input').value = dateStr;
                if (this.data[dateStr]) {
                    // If entry exists, show edit options
                    const action = confirm('Entry exists for this date. Click OK to edit, Cancel to remove.');
                    if (action) {
                        this.editEntry(dateStr);
                    } else {
                        this.removeEntry(dateStr);
                    }
                } else {
                    // Quick log for this date
                    if (confirm(`Log t-shirt day for ${this.formatDateInPT(dateStr)}?`)) {
                        this.quickLogEntry(dateStr);
                    }
                }
            }
        });

        return dayEl;
    }

    async quickLogEntry(dateStr) {
        const success = await this.saveEntry(dateStr, '');
        if (success) {
            this.updateStats();
            this.renderCalendar();
            this.renderChart();
            this.renderRecentEntries();
            this.showToast('T-shirt day logged! 👕');
        }
    }

    // Firebase provides real-time updates, no manual refresh needed!
    
    cleanup() {
        // Clean up Firebase listener when page unloads
        if (this.unsubscribe) {
            this.unsubscribe();
        }
    }

    renderChart() {
        const ctx = document.getElementById('trend-chart').getContext('2d');
        
        if (this.chart) {
            this.chart.destroy();
        }

        // Prepare data for last 12 months
        const monthlyData = this.getMonthlyData();
        
        this.chart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: monthlyData.labels,
                datasets: [{
                    label: 'T-shirt Days',
                    data: monthlyData.data,
                    borderColor: '#667eea',
                    backgroundColor: 'rgba(102, 126, 234, 0.1)',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4,
                    pointBackgroundColor: '#667eea',
                    pointBorderColor: '#ffffff',
                    pointBorderWidth: 2,
                    pointRadius: 6
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            stepSize: 1
                        }
                    }
                },
                layout: {
                    padding: {
                        top: 10,
                        bottom: 10
                    }
                }
            }
        });
    }

    getMonthlyData() {
        const months = [];
        const data = [];
        const now = new Date();

        // Get last 12 months
        for (let i = 11; i >= 0; i--) {
            const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
            const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
            
            months.push(date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' }));
            
            // Count t-shirt days in this month
            const count = Object.keys(this.data).filter(dateStr => 
                dateStr.startsWith(monthKey)
            ).length;
            
            data.push(count);
        }

        return { labels: months, data };
    }

    renderRecentEntries() {
        const container = document.getElementById('recent-entries');
        const dates = Object.keys(this.data).sort().reverse().slice(0, 10);

        if (dates.length === 0) {
            container.innerHTML = '<p style="text-align: center; color: #718096; font-style: italic;">No entries yet. Log your first t-shirt day!</p>';
            return;
        }

        container.innerHTML = dates.map(date => {
            const entry = this.data[date];
            const formattedDate = this.formatDateInPT(date);

            return `
                <div class="entry-item">
                    <div>
                        <div class="entry-date">${formattedDate}</div>
                        ${entry.notes ? `<div class="entry-notes">${entry.notes}</div>` : ''}
                    </div>
                    <div class="entry-actions">
                        <button class="btn-small btn-edit" onclick="tracker.editEntry('${date}')">Edit</button>
                        <button class="btn-small btn-delete" onclick="tracker.removeEntry('${date}')">Delete</button>
                    </div>
                </div>
            `;
        }).join('');
    }

    async exportData() {
        try {
            // Convert Firebase timestamps to readable format for export
            const exportData = {};
            Object.keys(this.data).forEach(date => {
                const entry = { ...this.data[date] };
                // Convert Firebase timestamps to ISO strings
                if (entry.timestamp && entry.timestamp.toDate) {
                    entry.timestamp = entry.timestamp.toDate().toISOString();
                }
                if (entry.lastModified && entry.lastModified.toDate) {
                    entry.lastModified = entry.lastModified.toDate().toISOString();
                }
                exportData[date] = entry;
            });
            
            const dataStr = JSON.stringify(exportData, null, 2);
            const dataBlob = new Blob([dataStr], { type: 'application/json' });
            const url = URL.createObjectURL(dataBlob);
            
            const link = document.createElement('a');
            link.href = url;
            link.download = `david-tshirt-data-${new Date().toISOString().split('T')[0]}.json`;
            link.click();
            
            URL.revokeObjectURL(url);
            this.showToast('Data exported successfully');
        } catch (error) {
            console.error('Export error:', error);
            this.showToast('Failed to export data', 'error');
        }
    }

    async importData(file) {
        if (!file) return;

        const reader = new FileReader();
        reader.onload = async (e) => {
            try {
                const importedData = JSON.parse(e.target.result);
                
                if (confirm('This will merge the imported data with existing Firebase data. Continue?')) {
                    const batch = window.db.batch();
                    let importCount = 0;
                    
                    Object.keys(importedData).forEach(date => {
                        const entry = importedData[date];
                        const docRef = window.tshirtCollection.doc(date);
                        
                        // Convert string timestamps back to Firebase timestamps if needed
                        const entryData = {
                            notes: entry.notes || '',
                            userAgent: entry.userAgent || 'Imported',
                            timestamp: entry.timestamp ? new Date(entry.timestamp) : firebase.firestore.FieldValue.serverTimestamp(),
                            lastModified: firebase.firestore.FieldValue.serverTimestamp()
                        };
                        
                        batch.set(docRef, entryData, { merge: true });
                        importCount++;
                    });
                    
                    await batch.commit();
                    this.showToast(`Data imported successfully! ${importCount} entries imported.`);
                }
            } catch (error) {
                console.error('Import error:', error);
                this.showToast('Error importing data. Please check the file format.', 'error');
            }
        };
        reader.readAsText(file);
    }

    async clearAllData() {
        if (confirm('Are you sure you want to clear ALL shared data? This will affect all users and cannot be undone.')) {
            if (confirm('This will permanently delete all t-shirt tracking data for everyone. Are you absolutely sure?')) {
                try {
                    const snapshot = await window.tshirtCollection.get();
                    const batch = window.db.batch();
                    
                    snapshot.docs.forEach((doc) => {
                        batch.delete(doc.ref);
                    });
                    
                    await batch.commit();
                    this.showToast('All data cleared');
                } catch (error) {
                    console.error('Error clearing data:', error);
                    this.showToast('Failed to clear data', 'error');
                }
            }
        }
    }

    showToast(message, type = 'success') {
        // Create toast element
        const toast = document.createElement('div');
        
        const colors = {
            success: '#48bb78',
            error: '#e53e3e',
            info: '#4299e1',
            warning: '#ed8936'
        };
        
        toast.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${colors[type] || colors.success};
            color: white;
            padding: 12px 20px;
            border-radius: 8px;
            box-shadow: 0 4px 15px rgba(0,0,0,0.2);
            z-index: 1000;
            font-weight: 500;
            transition: opacity 0.3s;
            max-width: 300px;
        `;
        toast.textContent = message;
        
        document.body.appendChild(toast);
        
        // Remove after appropriate time
        const duration = type === 'error' ? 5000 : 3000;
        setTimeout(() => {
            toast.style.opacity = '0';
            setTimeout(() => {
                if (document.body.contains(toast)) {
                    document.body.removeChild(toast);
                }
            }, 300);
        }, duration);
    }
}

// Initialize the app when DOM is loaded
let tracker;
document.addEventListener('DOMContentLoaded', async () => {
    tracker = new TShirtTracker();
});

// Cleanup Firebase listener when page unloads
window.addEventListener('beforeunload', () => {
    if (tracker) {
        tracker.cleanup();
    }
});