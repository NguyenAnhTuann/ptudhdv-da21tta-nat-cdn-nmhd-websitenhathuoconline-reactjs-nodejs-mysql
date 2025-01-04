const bcrypt = require('bcrypt');

// Hàm mã hóa mật khẩu
const hashPassword = async (password) => {
  const saltRounds = 10; // Số lần mã hóa
  try {
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    return hashedPassword;
  } catch (error) {
    console.error("Lỗi khi mã hóa mật khẩu:", error);
    throw new Error("Mã hóa mật khẩu thất bại");
  }
};

// Hàm kiểm tra mật khẩu
const comparePassword = async (plainPassword, hashedPassword) => {
  try {
    const isMatch = await bcrypt.compare(plainPassword, hashedPassword);
    return isMatch;
  } catch (error) {
    console.error("Lỗi khi so sánh mật khẩu:", error);
    throw new Error("So sánh mật khẩu thất bại");
  }
};

module.exports = { hashPassword, comparePassword };
