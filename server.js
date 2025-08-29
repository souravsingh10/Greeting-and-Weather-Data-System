const app = require('./src/app');
const mongoose = require('mongoose');

// Import cron jobs (this will start the daily update task)
require('./src/cronJobs');

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/smartnode', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('MongoDB connected');
}).catch(err => {
    console.error('MongoDB connection error:', err);
});

// Start the server
const PORT = 4000;
app.listen(PORT, () => {
    console.log(`API listening on http://localhost:${PORT}`);
});