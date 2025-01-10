const mongoose = require('mongoose');

const ratingSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    grade: { type: Number, required: true }
});

const bookSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    author: { type: String, required: true },
    imageUrl: { type: String },
    year: { type: Number },
    genre: { type: String },
    ratings: [ratingSchema], 
    averageRating: { type: Number, default: 0 }
});

module.exports = mongoose.model('Book', bookSchema);