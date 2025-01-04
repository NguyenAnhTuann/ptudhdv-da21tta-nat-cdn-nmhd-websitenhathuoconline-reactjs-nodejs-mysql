const db = require('../db'); // Kết nối cơ sở dữ liệu
const bcrypt = require('bcrypt');

// Đăng ký người dùng
const registerUser = async (req, res) => {
  const { name, email, phone, address, password } = req.body;

  if (!name || !email || !phone || !address || !password) {
    return res.status(400).json({ message: 'Vui lòng điền đầy đủ thông tin!' });
  }

  try {
    // Kiểm tra email trùng lặp
    const [existingUser] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    if (existingUser.length > 0) {
      return res.status(400).json({ message: 'Email đã tồn tại!' });
    }

    // Mã hóa mật khẩu
    const hashedPassword = await bcrypt.hash(password, 10);

    // Thêm người dùng mới vào cơ sở dữ liệu
    const [result] = await db.query(
      'INSERT INTO users (name, email, phone, address, password) VALUES (?, ?, ?, ?, ?)',
      [name, email, phone, address, hashedPassword]
    );

    res.status(201).json({ message: 'Đăng ký thành công!', userId: result.insertId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Lỗi máy chủ!' });
  }
};

const loginUser = async (req, res) => {
  const { emailOrPhone, password } = req.body;

  if (!emailOrPhone || !password) {
    return res.status(400).json({ message: 'Vui lòng nhập email/số điện thoại và mật khẩu!' });
  }

  try {
    // Kiểm tra trong bảng admin
    const [admin] = await db.query('SELECT * FROM admin WHERE email = ?', [emailOrPhone]);
    if (admin.length > 0) {
      const isPasswordValid = await bcrypt.compare(password, admin[0].password);
      if (!isPasswordValid) {
        return res.status(401).json({ message: 'Sai mật khẩu!' });
      }

      return res.status(200).json({
        message: 'Đăng nhập thành công!',
        user: {
          id: admin[0].id,
          name: admin[0].name,
          email: admin[0].email,
          isAdmin: true, // Đánh dấu là admin
        },
      });
    }

    // Kiểm tra trong bảng users
    const [user] = await db.query(
      'SELECT * FROM users WHERE email = ? OR phone = ?',
      [emailOrPhone, emailOrPhone]
    );
    if (user.length === 0) {
      return res.status(404).json({ message: 'Email hoặc số điện thoại không tồn tại!' });
    }

    const isPasswordValid = await bcrypt.compare(password, user[0].password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Sai mật khẩu!' });
    }

    res.status(200).json({
      message: "Đăng nhập thành công!",
      user: {
        id: user[0].id,
        name: user[0].name,
        email: user[0].email,
        phone: user[0].phone, // Thêm số điện thoại
        address: user[0].address, // Thêm địa chỉ
        isAdmin: false,
      },
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Lỗi máy chủ!' });
  }
};

// Cập nhật thông tin người dùng
const updateUser = async (req, res) => {
  const { id } = req.params;
  const { name, phone, address } = req.body;

  try {
    await db.query(
      "UPDATE users SET name = ?, phone = ?, address = ? WHERE id = ?",
      [name, phone, address, id]
    );

    res.status(200).json({ message: "Cập nhật thông tin thành công!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi máy chủ!" });
  }
};

module.exports = { registerUser, loginUser, updateUser };



