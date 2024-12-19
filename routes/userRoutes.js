const express = require('express');
const userController = require('../controllers/userController');
const router = express.Router();

// Check user authentication before adding to list
const isAuthenticated = (req, res, next) => {
	if (req.isAuthenticated()) {
		return next();
	}
	res.redirect('/login');
};

router.route('/').get(userController.defaultPage);

router
	.route('/login')
	.get(userController.loginPage)
	.post(userController.loginUser);

router
	.route('/register')
	.get(userController.registerPage)
	.post(userController.registerUser);

router.route('/logout').get(userController.logoutUser);

router.route('/add').post(isAuthenticated, userController.addMovie);

router.route('/mylist').get(userController.renderUserPage);

router.delete('/movies/:id', userController.deleteMovie);

module.exports = router;
