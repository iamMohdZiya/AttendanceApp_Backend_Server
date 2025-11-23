const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const authRoutes = require('./routes/authRoutes');
const sessionRoutes = require('./routes/sessionRoutes');
const attendanceRoutes = require('./routes/attendanceRoutes'); 
const adminRoutes = require('./routes/adminRoutes');

dotenv.config();


const app = express();

// Middleware
app.use(cors());
app.use(express.json());



// Database Connection
mongoose.connect(process.env.MONGO_URI )
.then(() => console.log('MongoDB Connected'))
.catch(err => console.error(err));




// Basic Route
app.get('/', (req, res) => {
  res.send('API is running...');
});

app.use('/api/auth', authRoutes);
app.use('/api/session', sessionRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/admin', adminRoutes);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));