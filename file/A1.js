
const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();
app.use(express.json());

// Logger middleware
app.use((req, res, next) => {
    console.log(req.method, req.url);
    next();
});

// Book Schema
const bookSchema = new mongoose.Schema({
    title: { type: String, required: true },
    author: { type: String, required: true },
    price: { type: Number, min: 1, required: true },
    category: String,
    isAvailable: { type: Boolean, default: true }
});

const Book = mongoose.model("Book", bookSchema);

// POST - Add book
app.post("/books", async (req, res, next) => {
    try {
        const book = await Book.create(req.body);
        res.status(201).json(book);
    } catch (err) {
        next(err);
    }
});

// GET - All books
app.get("/books", async (req, res, next) => {
    try {
        const books = await Book.find();
        res.status(200).json(books);
    } catch (err) {
        next(err);
    }
});

// GET - Single book
app.get("/books/:id", async (req, res, next) => {
    try {
        const book = await Book.findById(req.params.id);
        if (!book) return res.status(404).json({ message: "Book not found" });
        res.status(200).json(book);
    } catch (err) {
        next(err);
    }
});

// PUT - Update book
app.put("/books/:id", async (req, res, next) => {
    try {
        const book = await Book.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        if (!book) return res.status(404).json({ message: "Book not found" });
        res.status(200).json(book);
    } catch (err) {
        next(err);
    }
});

// DELETE - Delete book
app.delete("/books/:id", async (req, res, next) => {
    try {
        const book = await Book.findByIdAndDelete(req.params.id);
        if (!book) return res.status(404).json({ message: "Book not found" });
        res.status(200).json({ message: "Book deleted" });
    } catch (err) {
        next(err);
    }
});

// Error handling middleware
app.use((err, req, res, next) => {
    if (err.name === "ValidationError" || err.name === "CastError") {
        return res.status(400).json({ error: err.message });
    }
    console.error(err);
    res.status(500).json({ error: "Server error" });
});

// Start server
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log("MongoDB Connected");
        app.listen(process.env.PORT || 3000, () => {
            console.log("Server running on port 3000");
        });
    })
    .catch(err => console.log(err));
