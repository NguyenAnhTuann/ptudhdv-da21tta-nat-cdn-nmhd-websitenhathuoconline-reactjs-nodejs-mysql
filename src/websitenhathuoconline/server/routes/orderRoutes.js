const express = require("express");
const router = express.Router();
const db = require("../db");

router.post("/create-order", async (req, res) => {
  const { userId, products, status } = req.body;

  try {
    // Lưu từng sản phẩm vào bảng `orders`
    for (const product of products) {
      const totalPrice = product.price * product.quantity; // Tính tổng tiền cho từng sản phẩm
      await db.query(
        "INSERT INTO orders (user_id, product_id, quantity, total_price, status) VALUES (?, ?, ?, ?, ?)",
        [userId, product.id, product.quantity, totalPrice, status]
      );
    }

    res.status(201).json({ message: "Order created successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to create order" });
  }
});

module.exports = router;
