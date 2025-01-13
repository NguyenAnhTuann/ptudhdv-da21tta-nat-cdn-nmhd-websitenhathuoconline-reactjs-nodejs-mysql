const express = require("express");
const db = require("../db");
const router = express.Router();
require("dotenv").config();


// Lấy danh sách tất cả đơn hàng
router.get("/orders", async (req, res) => {
  try {
    const [orders] = await db.query(
      `SELECT o.id, o.total_price, o.status, o.created_at, 
              p.name AS product_name, o.quantity, 
              u.name AS user_name, u.phone AS user_phone, u.address AS user_address
       FROM orders o
       JOIN products p ON o.product_id = p.id
       JOIN users u ON o.user_id = u.id
       ORDER BY o.created_at DESC`
    );

    if (orders.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Không có đơn hàng nào.",
      });
    }

    res.status(200).json({ success: true, orders });
  } catch (error) {
    console.error("Lỗi khi lấy danh sách đơn hàng:", error);
    res.status(500).json({ success: false, message: "Lỗi máy chủ." });
  }
});

// Cập nhật trạng thái đơn hàng
const nodemailer = require("nodemailer");

router.put("/orders/:id", async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    // Cập nhật trạng thái đơn hàng
    const [result] = await db.query("UPDATE orders SET status = ? WHERE id = ?", [status, id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy đơn hàng để cập nhật.",
      });
    }

    // Lấy thông tin người dùng từ đơn hàng
    const [orderInfo] = await db.query(
      `SELECT u.email, u.name, o.status FROM orders o
       JOIN users u ON o.user_id = u.id
       WHERE o.id = ?`,
      [id]
    );

    if (orderInfo.length > 0) {
      const { email, name } = orderInfo[0];

      // Gửi email thông báo
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });

      const mailOptions = {
        from: '"Hệ thống Quản lý Đơn hàng" <websitetimdothatlac@gmail.com>',
        to: email,
        subject: "Cập nhật trạng thái đơn hàng của bạn",
        html: `
          <div style="font-family: Arial, sans-serif; line-height: 1.8; color: #333; background-color: #f9f9f9; padding: 20px;">
            <!-- Khung ngoài -->
            <div style="max-width: 600px; margin: auto; background-color: #ffffff; border: 1px solid #ddd; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
              
              <!-- Header -->
              <div style="background-color: #007bff; padding: 20px; text-align: center;">
                <img src="https://res.cloudinary.com/duk8odqun/image/upload/v1736754301/logo_rhovwe.png" alt="Logo" style="max-width: 100px; margin-bottom: 10px;">
                <h1 style="color: #ffffff; font-size: 24px; margin: 0;">Hệ thống Quản lý Đơn hàng</h1>
              </div>
              
              <!-- Nội dung -->
              <div style="padding: 20px;">
                <h2 style="color: #007bff;">Xin chào <strong>${name}</strong>,</h2>
                <p style="font-size: 16px;">Trạng thái đơn hàng của bạn đã được cập nhật thành: 
                  <span style="font-weight: bold; color: #28a745;">${status}</span>.
                </p>
                <p style="font-size: 16px; margin-top: 20px;">Nếu bạn có bất kỳ thắc mắc nào, vui lòng liên hệ với chúng tôi để được hỗ trợ.</p>
              </div>
              
              <!-- Footer -->
              <div style="background-color: #f5f5f5; padding: 20px; text-align: center; border-top: 1px solid #ddd;">
                <p style="font-size: 14px; color: #555; margin: 0;">Trân trọng,</p>
                <p style="font-size: 14px; color: #555; margin: 5px 0 0;"><strong>Đội ngũ hỗ trợ Nhà Thuốc NGUYEN ANH TUAN</strong></p>
                <p style="font-size: 14px; color: #555; margin: 5px 0 0;">Hệ thống Quản lý Đơn hàng</p>
              </div>
            </div>
          </div>
        `,
      };


      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error("Lỗi khi gửi email:", error);
        } else {
          console.log("Email đã được gửi:", info.response);
        }
      });
    }

    res.status(200).json({ success: true, message: "Cập nhật trạng thái thành công." });
  } catch (error) {
    console.error("Lỗi khi cập nhật trạng thái đơn hàng:", error);
    res.status(500).json({ success: false, message: "Lỗi máy chủ." });
  }
});


// Lấy danh sách người dùng
router.get("/users", async (req, res) => {
  try {
    const [users] = await db.query(
      `SELECT id, name, email, phone, address FROM users ORDER BY id ASC`
    );

    if (users.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Không có người dùng nào.",
      });
    }

    res.status(200).json({ success: true, users });
  } catch (error) {
    console.error("Lỗi khi lấy danh sách người dùng:", error);
    res.status(500).json({ success: false, message: "Lỗi máy chủ." });
  }
});

//thêm user mới
router.post("/users", async (req, res) => {
  const { name, email, phone, address, password } = req.body;

  if (!name || !email || !phone || !address || !password) {
    return res.status(400).json({
      success: false,
      message: "Vui lòng cung cấp đầy đủ thông tin.",
    });
  }

  try {
    // Hash mật khẩu trước khi lưu
    const hashedPassword = await require("bcrypt").hash(password, 10);

    const [result] = await db.query(
      `INSERT INTO users (name, email, phone, address, password) VALUES (?, ?, ?, ?, ?)`,
      [name, email, phone, address, hashedPassword]
    );

    if (result.affectedRows > 0) {
      const newUser = {
        id: result.insertId,
        name,
        email,
        phone,
        address,
      };

      res.status(201).json({
        success: true,
        message: "Thêm người dùng thành công.",
        user: newUser,
      });
    } else {
      res.status(500).json({
        success: false,
        message: "Không thể thêm người dùng.",
      });
    }
  } catch (error) {
    console.error("Lỗi khi thêm người dùng:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi máy chủ.",
    });
  }
});

//cập nhật tt user
router.put("/users/:id", async (req, res) => {
  const { id } = req.params;
  const { name, email, phone, address } = req.body;

  if (!name || !email || !phone || !address) {
    return res.status(400).json({
      success: false,
      message: "Vui lòng cung cấp đầy đủ thông tin.",
    });
  }

  try {
    const [result] = await db.query(
      `UPDATE users SET name = ?, email = ?, phone = ?, address = ? WHERE id = ?`,
      [name, email, phone, address, id]
    );

    if (result.affectedRows > 0) {
      res.status(200).json({ success: true, message: "Cập nhật thông tin thành công." });
    } else {
      res.status(404).json({ success: false, message: "Không tìm thấy người dùng." });
    }
  } catch (error) {
    console.error("Lỗi khi cập nhật thông tin người dùng:", error);
    res.status(500).json({ success: false, message: "Lỗi máy chủ." });
  }
});

//xóa user
router.delete("/users/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const [result] = await db.query(`DELETE FROM users WHERE id = ?`, [id]);

    if (result.affectedRows > 0) {
      res.status(200).json({ success: true, message: "Xóa người dùng thành công." });
    } else {
      res.status(404).json({ success: false, message: "Không tìm thấy người dùng." });
    }
  } catch (error) {
    console.error("Lỗi khi xóa người dùng:", error);
    res.status(500).json({ success: false, message: "Lỗi máy chủ." });
  }
});

// Lấy danh sách tất cả danh mục
router.get("/categories", async (req, res) => {
  try {
    const [categories] = await db.query("SELECT * FROM categories ORDER BY id ASC");

    if (categories.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Không có danh mục nào.",
      });
    }

    res.status(200).json({ success: true, categories });
  } catch (error) {
    console.error("Lỗi khi lấy danh sách danh mục:", error);
    res.status(500).json({ success: false, message: "Lỗi máy chủ." });
  }
});

// add loại
router.post("/categories", async (req, res) => {
  const { name } = req.body;

  if (!name || name.trim() === "") {
    return res.status(400).json({
      success: false,
      message: "Vui lòng cung cấp tên danh mục hợp lệ.",
    });
  }

  try {
    const [result] = await db.query("INSERT INTO categories (name) VALUES (?)", [name]);

    if (result.affectedRows > 0) {
      return res.status(201).json({
        success: true,
        message: "Thêm danh mục mới thành công.",
        category: { id: result.insertId, name },
      });
    } else {
      return res.status(500).json({
        success: false,
        message: "Không thể thêm danh mục mới.",
      });
    }
  } catch (error) {
    console.error("Lỗi khi thêm danh mục:", error);
    return res.status(500).json({
      success: false,
      message: "Lỗi máy chủ.",
    });
  }
});

// update loại
router.put("/categories/:id", async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;

  if (!name || name.trim() === "") {
    return res.status(400).json({
      success: false,
      message: "Vui lòng cung cấp tên danh mục hợp lệ.",
    });
  }

  try {
    const [result] = await db.query("UPDATE categories SET name = ? WHERE id = ?", [name, id]);

    if (result.affectedRows > 0) {
      return res.status(200).json({
        success: true,
        message: "Cập nhật danh mục thành công.",
      });
    } else {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy danh mục để cập nhật.",
      });
    }
  } catch (error) {
    console.error("Lỗi khi cập nhật danh mục:", error);
    return res.status(500).json({
      success: false,
      message: "Lỗi máy chủ.",
    });
  }
});

// xóa loại
router.delete("/categories/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const [result] = await db.query("DELETE FROM categories WHERE id = ?", [id]);

    if (result.affectedRows > 0) {
      return res.status(200).json({
        success: true,
        message: "Xóa danh mục thành công.",
      });
    } else {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy danh mục để xóa.",
      });
    }
  } catch (error) {
    console.error("Lỗi khi xóa danh mục:", error);
    return res.status(500).json({
      success: false,
      message: "Lỗi máy chủ.",
    });
  }
});


module.exports = router;
