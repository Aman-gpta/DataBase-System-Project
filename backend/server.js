require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('Connected to MongoDB Atlas'))
    .catch(err => console.error('MongoDB connection error:', err));

// Define Schemas
const signupSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true },
    password: { type: String, required: true }
});

const scheduleSchema = new mongoose.Schema({
    classroom_id: { type: String, required: true },
    day: { type: String, required: true },
    start_time: { type: String, required: true },
    end_time: { type: String, required: true },
    course: { type: String, required: true }
});

const applySchema = new mongoose.Schema({
    id: { type: String, required: true },
    fan: { type: Boolean, default: false },
    fan_comments: { type: String },
    ac: { type: Boolean, default: false },
    ac_comments: { type: String },
    projector: { type: Boolean, default: false },
    projector_comments: { type: String },
    light: { type: Boolean, default: false },
    light_comments: { type: String }
});

// Create Models
const User = mongoose.model('User', signupSchema);
const Schedule = mongoose.model('Schedule', scheduleSchema);
const Apply = mongoose.model('Apply', applySchema);

// Routes
// Get User Data by username
app.get('/UserData/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findOne({ username: id });

        if (!user) {
            console.log('No user found');
            return res.json([]);
        }

        console.log(user);
        res.json(user);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

// Create new user
app.post('/UserData', async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const newUser = new User({ username, email, password });
        const savedUser = await newUser.save();
        res.json(savedUser);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

// Create schedule
app.post('/schedule', async (req, res) => {
    try {
        const { classroom_id, day, start_time, end_time, course } = req.body;
        const newSchedule = new Schedule({ classroom_id, day, start_time, end_time, course });
        const savedSchedule = await newSchedule.save();
        res.json(savedSchedule);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

// Get schedule by classroom_id
app.get('/schedule/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const schedules = await Schedule.find({ classroom_id: id });

        if (schedules.length === 0) {
            return res.json([]);
        }

        console.log(schedules);
        res.json(schedules);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

// Submit application
app.post('/submit', async (req, res) => {
    try {
        const { id, fan, fan_comments, ac, ac_comments, projector, projector_comments, light, light_comments } = req.body;
        const newApply = new Apply({
            id,
            fan,
            fan_comments,
            ac,
            ac_comments,
            projector,
            projector_comments,
            light,
            light_comments
        });
        const savedApply = await newApply.save();
        res.json(savedApply);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

// Get admin data (joining apply and schedule collections)
app.get('/admindata/:id', async (req, res) => {
    try {
        const { id } = req.params;

        // In MongoDB, we need to do this join manually since it's not relational
        const applyData = await Apply.findOne({ id });

        if (!applyData) {
            return res.json([]);
        }

        const scheduleData = await Schedule.find({ classroom_id: id });

        if (scheduleData.length === 0) {
            return res.json([]);
        }

        // Combine the data to mimic the PostgreSQL join
        const result = scheduleData.map(schedule => {
            // Create a combined object that includes fields from both collections
            return {
                ...schedule.toObject(),
                ...applyData.toObject()
            };
        });

        console.log(result);
        res.json(result);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

// Start server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});