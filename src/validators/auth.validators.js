import { body, validationResult } from 'express-validator';

export async function validate(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ 
      message: errors.array()[0]?.msg || 'Validation error',
      errors: errors.array() 
    });
  }
  next();
}

export const registerValidator = [
  body('fullName')
    .trim()
    .notEmpty()
    .withMessage('Full name is required'),
  body('email')
    .trim()
    .isEmail()
    .withMessage('Invalid email address'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
  body('contact')
    .trim()
    .notEmpty()
    .matches(/^\d{10}$/)
    .withMessage('Contact number must be a valid 10-digit number'),
  body('role')
    .optional()
    .isIn(['buyer', 'seller'])
    .withMessage('Role must be either buyer or seller'),

  validate
];

export const loginValidator = [
  body('identifier')
    .optional()
    .trim(),
  body('email')
    .optional()
    .trim(),
  body('password')
    .notEmpty()
    .withMessage('Password is required'),

  validate
];
