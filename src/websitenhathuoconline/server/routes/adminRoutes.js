const express = require("express");
const db = require("../db");
const router = express.Router();

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
router.put("/orders/:id", async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    const [result] = await db.query(
      "UPDATE orders SET status = ? WHERE id = ?",
      [status, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy đơn hàng để cập nhật.",
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
// Thêm user mới
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


module.exports = router;
