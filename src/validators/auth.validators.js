import { body, validationResult } from 'express-validator';

export async function validate(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
}

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

  validate
];
