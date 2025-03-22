require('dotenv').config();
const mongoose = require('mongoose');

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('Connected to MongoDB Atlas'))
    .catch(err => console.error('MongoDB connection error:', err));

// Define Schedule Schema
const scheduleSchema = new mongoose.Schema({
    classroom_id: { type: String, required: true },
    day: { type: String, required: true },
    start_time: { type: String, required: true },
    end_time: { type: String, required: true },
    course: { type: String, required: true }
});

// Create Schedule Model
const Schedule = mongoose.model('Schedule', scheduleSchema);

// Sample data for 10 classrooms
const classroomSchedules = [
    // Classroom 1
    {
        classroom_id: "CR101",
        day: "Monday",
        start_time: "09:00",
        end_time: "10:30",
        course: "Introduction to Computer Science"
    },
    {
        classroom_id: "CR101",
        day: "Wednesday",
        start_time: "09:00",
        end_time: "10:30",
        course: "Introduction to Computer Science"
    },
    // Classroom 2
    {
        classroom_id: "CR102",
        day: "Monday",
        start_time: "11:00",
        end_time: "12:30",
        course: "Database Management"
    },
    {
        classroom_id: "CR102",
        day: "Thursday",
        start_time: "14:00",
        end_time: "15:30",
        course: "Database Management"
    },
    // Classroom 3
    {
        classroom_id: "CR103",
        day: "Tuesday",
        start_time: "10:00",
        end_time: "11:30",
        course: "Data Structures and Algorithms"
    },
    {
        classroom_id: "CR103",
        day: "Friday",
        start_time: "10:00",
        end_time: "11:30",
        course: "Data Structures and Algorithms"
    },
    // Classroom 4
    {
        classroom_id: "CR104",
        day: "Wednesday",
        start_time: "13:00",
        end_time: "14:30",
        course: "Artificial Intelligence"
    },
    {
        classroom_id: "CR104",
        day: "Friday",
        start_time: "13:00",
        end_time: "14:30",
        course: "Artificial Intelligence"
    },
    // Classroom 5
    {
        classroom_id: "CR201",
        day: "Monday",
        start_time: "09:00",
        end_time: "10:30",
        course: "Web Development"
    },
    {
        classroom_id: "CR201",
        day: "Wednesday",
        start_time: "09:00",
        end_time: "10:30",
        course: "Web Development"
    },
    // Classroom 6
    {
        classroom_id: "CR202",
        day: "Tuesday",
        start_time: "11:00",
        end_time: "12:30",
        course: "Mobile App Development"
    },
    {
        classroom_id: "CR202",
        day: "Thursday",
        start_time: "11:00",
        end_time: "12:30",
        course: "Mobile App Development"
    },
    // Classroom 7
    {
        classroom_id: "CR203",
        day: "Monday",
        start_time: "14:00",
        end_time: "15:30",
        course: "Operating Systems"
    },
    {
        classroom_id: "CR203",
        day: "Thursday",
        start_time: "14:00",
        end_time: "15:30",
        course: "Operating Systems"
    },
    // Classroom 8
    {
        classroom_id: "CR204",
        day: "Tuesday",
        start_time: "15:00",
        end_time: "16:30",
        course: "Computer Networks"
    },
    {
        classroom_id: "CR204",
        day: "Friday",
        start_time: "15:00",
        end_time: "16:30",
        course: "Computer Networks"
    },
    // Classroom 9
    {
        classroom_id: "CR301",
        day: "Wednesday",
        start_time: "11:00",
        end_time: "12:30",
        course: "Software Engineering"
    },
    {
        classroom_id: "CR301",
        day: "Friday",
        start_time: "11:00",
        end_time: "12:30",
        course: "Software Engineering"
    },
    // Classroom 10
    {
        classroom_id: "CR302",
        day: "Monday",
        start_time: "16:00",
        end_time: "17:30",
        course: "Machine Learning"
    },
    {
        classroom_id: "CR302",
        day: "Wednesday",
        start_time: "16:00",
        end_time: "17:30",
        course: "Machine Learning"
    }
];

// Function to insert data
async function insertScheduleData() {
    try {
        // Clear existing data (optional)
        await Schedule.deleteMany({});
        console.log('Cleared existing schedule data');

        // Insert new data
        const result = await Schedule.insertMany(classroomSchedules);
        console.log(`Successfully inserted ${result.length} schedule records`);

        // Get count by classroom
        const classrooms = await Schedule.aggregate([
            { $group: { _id: "$classroom_id", count: { $sum: 1 } } }
        ]);

        console.log("Records by classroom:");
        classrooms.forEach(room => {
            console.log(`Classroom ${room._id}: ${room.count} schedules`);
        });

    } catch (error) {
        console.error('Error inserting data:', error);
    } finally {
        // Close the connection
        mongoose.connection.close();
        console.log('MongoDB connection closed');
    }
}

// Run the insert function
insertScheduleData();