const express = require("express");
const db = require("../db");
const router = express.Router();

router.get("/:userId", async (req, res) => {
  const userId = req.params.userId;

  try {
    const [orders] = await db.query(
      "SELECT o.id, o.total_price, o.status, o.created_at, p.name AS product_name, p.price AS product_price, o.quantity " +
        "FROM orders o " +
        "JOIN products p ON o.product_id = p.id " +
        "WHERE o.user_id = ?",
      [userId]
    );

    if (orders.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy đơn hàng nào cho người dùng này.",
      });
    }

    res.status(200).json({ success: true, orders });
  } catch (error) {
    console.error("Lỗi khi lấy danh sách đơn hàng:", error);
    res.status(500).json({ success: false, message: "Lỗi máy chủ." });
  }
});

module.exports = router;
