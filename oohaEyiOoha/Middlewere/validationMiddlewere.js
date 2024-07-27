const mongoose = require('mongoose');
const { body, validationResult } = require('express-validator');
const BadRequestError = require('../Errors/CustomErrors.js');
const User = require('../Models/UserModel.js');

const withValidationErrors = (validateValues) => {
  return [
    validateValues,
    (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        const errorMessages = errors.array().map((error) => error.msg);
        throw new BadRequestError(errorMessages);
      }
      next();
    },
  ];
};

const validateUserInput = withValidationErrors([
  body('name')
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ min: 3, max: 50 })
    .withMessage('Name must be between 3 and 50 characters long')
    .trim(),
  //body('email')
  // .isEmail()
  // .withMessage('Valid email is required')
  body('email')
    .notEmpty()
    .withMessage('Please Enter Email')
    .isEmail()
    .withMessage('Valid email is required')
    .normalizeEmail()
    .custom(async (email) => {
      const user = await User.findOne({ email });
      if (user) {
        throw new BadRequestError('email already exists');
      }
    }),
  body('password')
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 3 })
    .withMessage('Password must be at least 3 characters long'),
  body('language').notEmpty().withMessage('language is required'),
]);

const validateLoginInput = withValidationErrors([
  body('email')
    .notEmpty()
    .withMessage('email is required')
    .isEmail()
    .withMessage('invalid email format'),
  body('password').notEmpty().withMessage('password is required'),
]);

const validateUpdateUserInput = withValidationErrors([
  body('name').notEmpty().withMessage('name is required'),
  body('email')
    .notEmpty()
    .withMessage('email is required')
    .isEmail()
    .withMessage('invalid email format')
    .custom(async (email, { req }) => {
      const user = await User.findOne({ email });
      if (user && user._id.toString() !== req.user.userId) {
        throw new Error('email already exists');
      }
    }),
  body('language').notEmpty().withMessage('name is required'),
]);

module.exports = {
  withValidationErrors,
  validateUserInput,
  validateLoginInput,
  validateUpdateUserInput
};
