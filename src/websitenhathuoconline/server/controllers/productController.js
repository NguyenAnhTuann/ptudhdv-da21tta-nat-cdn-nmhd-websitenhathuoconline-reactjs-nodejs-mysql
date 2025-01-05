const db = require("../db");
const { cloudinary, storage } = require("../cloudinaryConfig");
const multer = require("multer");
const upload = multer({ storage });

const getProducts = async (req, res) => {
  try {
    const [products] = await db.query("SELECT * FROM products");
    res.status(200).json(products);
  } catch (error) {
    console.error("Lỗi khi lấy danh sách sản phẩm:", error);
    res.status(500).json({ message: "Lỗi máy chủ!" });
  }
};


const addProduct = async (req, res) => {
  const { name, unit, category_id, manufacturer, ingredients, description, price, quantity } = req.body;

  // Kiểm tra dữ liệu từ client
  if (!name || !price || !quantity || !req.files || req.files.length === 0) {
    return res.status(400).json({ message: "Vui lòng nhập đầy đủ thông tin và chọn ít nhất một hình ảnh!" });
  }

  try {
    // Lấy URL của các ảnh tải lên Cloudinary
    const imageUrls = req.files.map((file) => file.path);

    // Thêm sản phẩm vào cơ sở dữ liệu
    const [result] = await db.query(
      "INSERT INTO products (name, unit, category_id, manufacturer, ingredients, description, price, quantity, images) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [name, unit, category_id || null, manufacturer, ingredients, description, price, quantity, JSON.stringify(imageUrls)]
    );

    res.status(201).json({ message: "Sản phẩm đã được thêm thành công!", productId: result.insertId });
  } catch (error) {
    console.error("Lỗi khi thêm sản phẩm:", error);
    res.status(500).json({ message: "Lỗi máy chủ khi thêm sản phẩm!" });
  }
};


const getCategories = async (req, res) => {
  try {
    const [categories] = await db.query("SELECT * FROM categories");
    res.status(200).json(categories);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi máy chủ!" });
  }
};

const updateProduct = async (req, res) => {
  const { id } = req.params;
  const { name, unit, category_id, manufacturer, ingredients, description, price, quantity } = req.body;

  try {
    // Nếu có ảnh mới, upload lên Cloudinary
    let imageUrls;
    if (req.files && req.files.length > 0) {
      imageUrls = req.files.map((file) => file.path);
    } else {
      // Giữ nguyên ảnh cũ nếu không có ảnh mới
      const [existingProduct] = await db.query("SELECT images FROM products WHERE id = ?", [id]);
      imageUrls = existingProduct[0].images;
    }

    // Cập nhật sản phẩm
    await db.query(
      "UPDATE products SET name = ?, unit = ?, category_id = ?, manufacturer = ?, ingredients = ?, description = ?, price = ?, quantity = ?, images = ? WHERE id = ?",
      [
        name,
        unit,
        category_id,
        manufacturer,
        ingredients,
        description,
        price,
        quantity,
        JSON.stringify(imageUrls),
        id,
      ]
    );

    res.status(200).json({ message: "Sản phẩm đã được cập nhật thành công!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi máy chủ!" });
  }
};

const deleteProduct = async (req, res) => {
  const { id } = req.params;

  try {
    // Xóa sản phẩm từ cơ sở dữ liệu
    const [result] = await db.query("DELETE FROM products WHERE id = ?", [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Sản phẩm không tồn tại!" });
    }

    res.status(200).json({ message: "Sản phẩm đã được xóa thành công!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi máy chủ!" });
  }
};


const getProductById = async (req, res) => {
  const { id } = req.params;

  try {
    const [product] = await db.query(
      "SELECT p.*, c.name AS category_name FROM products p LEFT JOIN categories c ON p.category_id = c.id WHERE p.id = ?",
      [id]
    );

    if (product.length === 0) {
      return res.status(404).json({ message: "Sản phẩm không tồn tại!" });
    }

    res.status(200).json(product[0]);
  } catch (error) {
    console.error("Lỗi khi lấy chi tiết sản phẩm:", error);
    res.status(500).json({ message: "Lỗi máy chủ!" });
  }
};


module.exports = { getProducts, addProduct, getCategories, updateProduct, deleteProduct, getProductById };






