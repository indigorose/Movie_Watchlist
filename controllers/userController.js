const passport = require('passport');
const User = require('../models/userModel');

// Route handler for displaying the default '/' page
const defaultPage = (req, res) => {
	res.render('home', { user: req.user });
};

const loginPage = (req, res) => {
	res.render('login', { user: req.user });
};

const loginUser = passport.authenticate('local', {
	successRedirect: '/',
	failureRedirect: '/login',
	failureFlash: false,
});

const registerPage = (req, res) => {
	res.render('register', { user: req.user });
};

const registerUser = async (req, res) => {
	try {
		const { username, password } = req.body;
		const user = new User({ username });
		await User.register(user, password);
		passport.authenticate('local')(req, res, function () {
			res.redirect('/');
		});
	} catch (err) {
		console.log(err);
		res.redirect('/register');
	}
};

const logoutUser = (req, res) => {
	req.logout(function (err) {
		if (err) {
			return next(err);
		}
		res.redirect('/');
	});
};

const addMovie = async (req, res) => {
	const { movieId, title, poster_path, release_date } = req.body;
	const userId = req.user._id;
	try {
		// Find the user
		const user = await User.findById(userId);

		// Check if the movie is already on the list
		const movieExists = user.movies.some(
			(movie) => movie.movieId === Number(movieId)
		);

		if (!movieExists) {
			user.movies.push({ movieId, title, poster_path, release_date });
			await user.save();
		}
		// redirect to user list(myList) to view movies
		res.redirect('/mylist');
	} catch (error) {
		console.error(error);
		res.status(500).send('Server error');
	}
};

const renderUserPage = async (req, res) => {
	try {
		// Finds the user and populates the array of stored movies
		const user = await User.findById(req.user._id).populate('movies');

		// Ask to render the page 'my list' based on the array of the user
		res.render('mylist', { user });
	} catch (error) {
		console.error('Error fetching movie list:', error);
		res.status(500).send('Server error');
	}
};

module.exports = {
	loginPage,
	loginUser,
	registerPage,
	registerUser,
	logoutUser,
	defaultPage,
	addMovie,
	renderUserPage,
};
