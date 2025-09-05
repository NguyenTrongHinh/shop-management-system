import { body } from "express-validator";
import { validationResult } from "express-validator";

// Validation rules cho register
export const registerValidation = [
  body('username')
    .isLength({ min: 3, max: 50 })
    .withMessage('Username must be between 3-50 characters')
    .trim(),
  body('email')
    .isEmail()
    .withMessage('Please enter a valid email')
    .normalizeEmail(),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters'),
  body('adminSecret')  // ✅ Thêm: Bắt buộc nếu muốn tạo admin
    .optional()        // Không bắt buộc, nhưng nếu có thì validate
    .isString()
    .withMessage('adminSecret must be a string')
];

// Validation rules cho login
export const loginValidation = [
  body('email')
    .isEmail()
    .withMessage('Please enter a valid email')
    .normalizeEmail(),
  body('password')
    .notEmpty()
    .withMessage('Password is required')
];

// Middleware để check validation results
export const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      message: "Validation failed",
      errors: errors.array()
    });
  }
  next();
};
export const cartItemValidation = [
  body('productId')
    .isMongoId() 
    .withMessage('ID sản phẩm không hợp lệ'),
  body('quantity')
    .isInt({ min: 1 })
    .withMessage('Số lượng phải là số nguyên lớn hơn 0')
];

export const updateQuantityValidation = [
  body('quantity')
    .isInt({ min: 0 }) 
    .withMessage('Số lượng phải là số nguyên >= 0')
];