const express = require('express');
const userController = require('../controllers/userController');
const router = express.Router();

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

router.route('/add').post(userController.addMovie);

router.route('/mylist').get(userController.renderUserPage);

module.exports = router;
