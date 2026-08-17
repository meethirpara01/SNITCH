import expressValidator from 'express-validator';

const { body, validationResult } = expressValidator;

export const registerValidator = [
  body('fullName')
    .notEmpty()
    .withMessage('Full name is required'),
  body('email')
    .isEmail()
    .withMessage('Invalid email address'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
  body('contact')
    .notEmpty()
    .matches(/^\d{10}$/)
    .withMessage('Contact number must be a valid 10-digit number'),
  body('role')
    .isIn(['buyer', 'seller'])
    .withMessage('Role must be either buyer or seller'),

    validationResult
];
