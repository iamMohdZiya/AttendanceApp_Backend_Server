

const mongoose = require('mongoose');

const dbConnect = async () => {
  
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/attendance_db')
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.error(err));

}
module.exports = dbConnect;