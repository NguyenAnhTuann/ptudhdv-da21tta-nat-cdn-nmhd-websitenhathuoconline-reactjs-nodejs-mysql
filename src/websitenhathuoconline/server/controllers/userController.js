const crypto = require('crypto');
const nodemailer = require('nodemailer');
const bcrypt = require('bcrypt');
const db = require('../db');
const moment = require('moment');

// Gửi OTP qua email
const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const [user] = await db.query("SELECT * FROM users WHERE email = ?", [email]);
    if (!user.length) {
      return res.status(404).json({ message: "Email không tồn tại!" });
    }

    // Tạo mã OTP
    const otp = crypto.randomInt(100000, 999999).toString();
    const expiry = moment().add(5, 'minutes').format('YYYY-MM-DD HH:mm:ss'); // Thêm 5 phút

    // Lưu OTP và thời gian hết hạn vào cơ sở dữ liệu
    await db.query('UPDATE users SET otp = ?, otp_expiry = ? WHERE email = ?', [otp, expiry, email]);

    // Gửi OTP qua email
    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Đặt lại mật khẩu - OTP",
      text: `Mã OTP của bạn là: ${otp}`,
    };

    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: "Mã OTP đã được gửi tới email của bạn!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Đã xảy ra lỗi!" });
  }
};

// Đặt lại mật khẩu
const resetPassword = async (req, res) => {
  const { email, otp, newPassword } = req.body;

  try {
    // Kiểm tra OTP và thời gian hết hạn trong cơ sở dữ liệu
    const [user] = await db.query('SELECT otp, otp_expiry FROM users WHERE email = ?', [email]);
    if (user.length === 0) {
      return res.status(404).json({ message: "Email không tồn tại!" });
    }

    const { otp: storedOtp, otp_expiry } = user[0];
    const expiryTimestamp = new Date(otp_expiry).getTime();
    
    // Kiểm tra nếu OTP hết hạn
    if (Date.now() > expiryTimestamp) {
      return res.status(400).json({ message: "Mã OTP đã hết hạn!" });
    }

    // Kiểm tra mã OTP
    if (otp !== storedOtp) {
      return res.status(400).json({ message: "Mã OTP không chính xác!" });
    }

    // Mã hóa mật khẩu mới và lưu vào cơ sở dữ liệu
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await db.query('UPDATE users SET password = ?, otp = NULL, otp_expiry = NULL WHERE email = ?', [hashedPassword, email]);

    res.status(200).json({ message: "Mật khẩu đã được đặt lại thành công!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Đã xảy ra lỗi!" });
  }
};



// Đăng ký người dùng
const registerUser = async (req, res) => {
  const { name, email, phone, address, password } = req.body;

  if (!name || !email || !phone || !address || !password) {
    return res.status(400).json({ message: 'Vui lòng điền đầy đủ thông tin!' });
  }

  try {
    // Kiểm tra email trùng lặp
    const [existingEmail] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    if (existingEmail.length > 0) {
      return res.status(400).json({ message: 'Email đã tồn tại!' });
    }

    // Kiểm tra số điện thoại trùng lặp
    const [existingPhone] = await db.query('SELECT * FROM users WHERE phone = ?', [phone]);
    if (existingPhone.length > 0) {
      return res.status(400).json({ message: 'Số điện thoại đã tồn tại!' });
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

module.exports = { registerUser, loginUser, updateUser, forgotPassword, resetPassword };



