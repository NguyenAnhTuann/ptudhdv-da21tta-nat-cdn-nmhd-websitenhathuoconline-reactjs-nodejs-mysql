const express = require('express');
const cors = require('cors');
const userRoutes = require('./routes/userRoutes');
const productRoutes = require("./routes/productRoutes");
const orderRoutes = require("./routes/orderRoutes");
const userOrderRoutes = require("./routes/userOrderRoutes");
const adminRoutes = require("./routes/adminRoutes");

const db = require("./db");
db.getConnection()
  .then(() => console.log("Kết nối cơ sở dữ liệu thành công"))
  .catch((err) => console.error("Kết nối cơ sở dữ liệu thất bại:", err));

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/products", productRoutes);
app.use('/api/users', userRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/don-hang-cua-ban", userOrderRoutes);
app.use("/api/admin", adminRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
