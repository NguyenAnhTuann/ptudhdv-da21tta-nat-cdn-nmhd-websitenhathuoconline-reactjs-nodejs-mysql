const db = require('../db');

// Thêm sản phẩm vào giỏ hàng
exports.addToCart = (req, res) => {
    const { userId, productId, quantity } = req.body;

    // Kiểm tra xem giỏ hàng của user đã có sản phẩm này chưa
    const checkCartQuery = `
        SELECT * FROM cart
        WHERE user_id = ? AND product_id = ?
    `;

    db.query(checkCartQuery, [userId, productId], (err, results) => {
        if (err) {
            console.error('Lỗi khi kiểm tra giỏ hàng:', err);
            return res.status(500).json({ message: 'Lỗi server!' });
        }

        if (results.length > 0) {
            // Nếu sản phẩm đã có trong giỏ hàng, cập nhật số lượng
            const updateCartQuery = `
                UPDATE cart
                SET quantity = quantity + ?
                WHERE user_id = ? AND product_id = ?
            `;
            db.query(updateCartQuery, [quantity, userId, productId], (err) => {
                if (err) {
                    console.error('Lỗi khi cập nhật giỏ hàng:', err);
                    return res.status(500).json({ message: 'Lỗi server!' });
                }
                return res.status(200).json({ message: 'Cập nhật giỏ hàng thành công!' });
            });
        } else {
            // Nếu sản phẩm chưa có trong giỏ hàng, thêm mới
            const insertCartQuery = `
                INSERT INTO cart (user_id, product_id, quantity)
                VALUES (?, ?, ?)
            `;
            db.query(insertCartQuery, [userId, productId, quantity], (err) => {
                if (err) {
                    console.error('Lỗi khi thêm vào giỏ hàng:', err);
                    return res.status(500).json({ message: 'Lỗi server!' });
                }
                return res.status(200).json({ message: 'Thêm sản phẩm vào giỏ hàng thành công!' });
            });
        }
    });
};

// Lấy giỏ hàng của user
exports.getCart = (req, res) => {
    const { userId } = req.params;

    const getCartQuery = `
        SELECT c.product_id, c.quantity, p.name, p.price, p.images
        FROM cart c
        JOIN products p ON c.product_id = p.id
        WHERE c.user_id = ?
    `;

    db.query(getCartQuery, [userId], (err, results) => {
        if (err) {
            console.error('Lỗi khi lấy giỏ hàng:', err);
            return res.status(500).json({ message: 'Lỗi server!' });
        }

        return res.status(200).json({ cart: results });
    });
};
