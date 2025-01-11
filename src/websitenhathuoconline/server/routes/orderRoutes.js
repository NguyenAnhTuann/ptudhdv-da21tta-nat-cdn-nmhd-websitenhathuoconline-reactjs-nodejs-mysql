const express = require("express");
const router = express.Router();
const db = require("../db");

router.post("/create-order", async (req, res) => {
  const { userId, products, status } = req.body;

  try {
    for (const product of products) {
      if (!product.product_id) {
        return res.status(400).json({ message: "Product ID is required." });
      }

      const totalPrice = product.price * product.quantity;
      await db.query(
        "INSERT INTO orders (user_id, product_id, quantity, total_price, status) VALUES (?, ?, ?, ?, ?)",
        [userId, product.product_id, product.quantity, totalPrice, status]
      );
    }

    res.status(201).json({ message: "Order created successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to create order" });
  }
});


module.exports = router;
