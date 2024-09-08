const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

// Define the movie schema
const movieSchema = new mongoose.Schema({
	title: String,
	poster_path: String,
	release_date: String,
	movieId: Number, // Store a unique movie ID to avoid duplicates
});
const userSchema = new mongoose.Schema({
	username: { type: String, required: true, unique: true },
	movies: [movieSchema], // Array to store user's movies
});

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', userSchema);
