const express = require('express');
const cors = require('cors');
const userRoutes = require('./routes/userRoutes');
const productRoutes = require("./routes/productRoutes");
const cartRoutes = require('./routes/cartRoutes');

app.use('/api/cart', cartRoutes);


const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/products", productRoutes);
app.use('/api/users', userRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
