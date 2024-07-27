const { Router } = require('express');
const router = Router();
const {
  getAllIngs,
  fetchRecipes,
  fetchFavs,
  removeRecipe,
  starRecipe,
  createImage,
  addHistory,
  fetchhistory,
  getCurrentUser,
  updateuser
} = require('../Controllers/authController.js');
const { register } = require('../Controllers/authController.js');
const { login } = require('../Controllers/authController.js');
const {
  validateUserInput,
  validateLoginInput,
  validateUpdateUserInput
} = require('../Middlewere/validationMiddlewere.js');
const authMiddlewere = require('../Middlewere/authMiddlewere.js');

router.post('/fetchRecipes', authMiddlewere, fetchRecipes);
router.post('/removeRecipe', authMiddlewere, removeRecipe);
router.post('/starRecipe', authMiddlewere, starRecipe);
router.post('/createImage', authMiddlewere, createImage);
router.get('/getallIngs', authMiddlewere, getAllIngs);
router.get('/fetchFavs', authMiddlewere, fetchFavs);
router.post('/addhistory', authMiddlewere, addHistory);
router.get('/fetchhistory', authMiddlewere, fetchhistory);
router.post('/register', validateUserInput, register);
router.post('/login', validateLoginInput, login);
router.get('/getcurrentuser', authMiddlewere, getCurrentUser);
router.post(
  '/updateuser',
  authMiddlewere,
  validateUpdateUserInput,
  updateuser
);
module.exports = router;
