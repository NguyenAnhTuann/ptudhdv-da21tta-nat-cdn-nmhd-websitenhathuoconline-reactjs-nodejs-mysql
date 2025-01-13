const express = require('express');
const router = express.Router();
const { registerUser, loginUser, updateUser, forgotPassword, resetPassword } = require('../controllers/userController');

router.post('/login', loginUser);
router.post('/register', registerUser);
router.put("/:id", updateUser);
router.post("/forgot-password", forgotPassword); // Kiểm tra lại hàm này
router.post("/reset-password", resetPassword); // Kiểm tra lại hàm này

module.exports = router;
