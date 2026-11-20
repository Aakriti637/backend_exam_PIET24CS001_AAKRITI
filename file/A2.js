
const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const app = express();
app.use(express.json());

// Student Schema
const studentSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, default: "student" }
});

const Student = mongoose.model("Student", studentSchema);

// Registration API
app.post("/register", async (req, res) => {
    try {
        const { name, email, password } = req.body;

        const existing = await Student.findOne({ email });
        if (existing) {
            return res.status(400).json({ message: "Email already registered" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const student = await Student.create({
            name,
            email,
            password: hashedPassword
        });

        res.status(201).json({
            message: "Student registered successfully",
            studentId: student._id
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Login API
app.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        const student = await Student.findOne({ email });
        if (!student) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        const isMatch = await bcrypt.compare(password, student.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        const token = jwt.sign(
            { id: student._id, role: student.role },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        res.json({
            message: "Login successful",
            token
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Authentication Middleware
function verifyToken(req, res, next) {
    const token = req.headers.authorization;

    if (!token) {
        return res.status(401).json({ message: "Token required" });
    }

    try {
        const decoded = jwt.verify(token.replace("Bearer ", ""), process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        res.status(401).json({ message: "Invalid or expired token" });
    }
}

// Protected Route
app.get("/profile", verifyToken, async (req, res) => {
    const student = await Student.findById(req.user.id).select("-password");

    if (!student) {
        return res.status(404).json({ message: "Student not found" });
    }

    res.json(student);
});

// Admin Route
app.get("/admin", verifyToken, (req, res) => {
    if (req.user.role !== "admin") {
        return res.status(403).json({ message: "Access denied. Admin only." });
    }

    res.json({ message: "Welcome Admin" });
});

// Start Server
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log("MongoDB Connected");
        app.listen(3001, () => {
            console.log("Server running on port 3001");
        });
    })
    .catch(err => console.log(err));
