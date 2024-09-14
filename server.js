// Dependencies
require('dotenv').config(); // Hides our information and calls it safely
const express = require('express');
const app = express();
const connectDB = require('./config/connectDB');
const userRoutes = require('./routes/userRoutes');
const session = require('express-session');
const mongoose = require('mongoose');
const passport = require('passport');
// const LocalStrategy = require('passport-local');
const User = require('./models/userModel');
const axios = require('axios');
const path = require('path');

const PORT = process.env.PORT || 3000;

connectDB();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');

app.use(
	session({
		secret: process.env.SECRET,
		resave: false,
		saveUninitialized: false,
	})
);

app.use(passport.initialize());
app.use(passport.session());

// Configure passport-local-mongoose
passport.use(User.createStrategy()); // This is provided by passport-local-mongoose

// Serialize and deserialize user instances to and from the session
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// passing current user through

app.use((req, res, next) => {
	res.locals.currentUser = req.user;
	next();
});

//routing
app.use('/', userRoutes);

// Define the route to handle the movie search
app.get('/results', async (req, res) => {
	const query = req.query.query;

	try {
		// Replace with your OMDb API key
		const response = await axios.get(
			`https://api.themoviedb.org/3/search/movie?api_key=${process.env.MOVIEDB_API_KEY}&query=${query}`
		);
		const movies = response.data.results.slice(0, 12);

		// Render the search results in search.ejs
		res.render('results', { query, movies, user: req.user });
	} catch (error) {
		console.error(error);
		res.render('results', { query, movies: [] });
	}
});

// server connection
mongoose.connection.once('open', () => {
	console.log('Connected to MongoDB');
	app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});
