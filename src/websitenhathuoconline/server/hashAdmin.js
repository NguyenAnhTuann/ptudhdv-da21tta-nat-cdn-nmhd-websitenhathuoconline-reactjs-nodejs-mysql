const { hashPassword } = require('./hashPassword');
const db = require('./db');

const createAdmin = async () => {
  const adminEmail = "websitenhathuoconline@gmail.com";
  const adminPassword = "admin2024(@)";

  try {
    // Kiểm tra nếu admin đã tồn tại
    const [existingAdmin] = await db.query('SELECT * FROM admin WHERE email = ?', [adminEmail]);
    if (existingAdmin.length > 0) {
      console.log("Admin đã tồn tại!");
      return;
    }

    // Mã hóa mật khẩu
    const hashedPassword = await hashPassword(adminPassword);

    // Thêm admin vào cơ sở dữ liệu
    await db.query(
      'INSERT INTO admin (name, email, password) VALUES (?, ?, ?)',
      ['Admin', adminEmail, hashedPassword]
    );

    console.log("Admin mặc định đã được tạo với mật khẩu mã hóa!");
  } catch (error) {
    console.error("Lỗi khi tạo admin:", error);
  }
};

createAdmin();
