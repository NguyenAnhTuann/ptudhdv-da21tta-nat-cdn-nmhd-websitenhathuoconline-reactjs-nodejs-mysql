-- phpMyAdmin SQL Dump
-- version 4.8.5
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jan 05, 2025 at 10:02 AM
-- Server version: 10.1.38-MariaDB
-- PHP Version: 7.3.2

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `websitenhathuoconline`
--

-- --------------------------------------------------------

--
-- Table structure for table `admin`
--

CREATE TABLE `admin` (
  `id` int(11) NOT NULL,
  `name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `admin`
--

INSERT INTO `admin` (`id`, `name`, `email`, `password`) VALUES
(2, 'Admin', 'websitenhathuoconline@gmail.com', '$2b$10$t6VKsLdzY77a.yTzECnRXemWchz6yFCtcmDFm/Ij8sGTq1Oi7R1nq');

-- --------------------------------------------------------

--
-- Table structure for table `categories`
--

CREATE TABLE `categories` (
  `id` int(11) NOT NULL,
  `name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `categories`
--

INSERT INTO `categories` (`id`, `name`) VALUES
(1, 'Kháng sinh'),
(2, 'Giảm đau'),
(3, 'Thuốc ho'),
(4, 'Thuốc dạ dày'),
(5, 'Thuốc cảm cúm'),
(6, 'Thuốc bổ'),
(7, 'Thuốc huyết áp'),
(8, 'Thuốc tiểu đường'),
(9, 'Thuốc chống dị ứng'),
(10, 'Thuốc giảm đau, hạ sốt'),
(12, 'Dầu cá, Omega 3, DHA'),
(13, 'Cân bằng nội tiết tố');

-- --------------------------------------------------------

--
-- Table structure for table `orders`
--

CREATE TABLE `orders` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `quantity` int(11) NOT NULL,
  `total_price` decimal(10,2) NOT NULL,
  `status` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'Chưa nhận hàng',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `products`
--

CREATE TABLE `products` (
  `id` int(11) NOT NULL,
  `images` text COLLATE utf8mb4_unicode_ci,
  `name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `unit` enum('Hộp','Vỉ','Viên') COLLATE utf8mb4_unicode_ci DEFAULT 'Hộp',
  `category_id` int(11) DEFAULT NULL,
  `manufacturer` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `ingredients` text COLLATE utf8mb4_unicode_ci,
  `description` text COLLATE utf8mb4_unicode_ci,
  `price` decimal(10,2) NOT NULL,
  `quantity` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `products`
--

INSERT INTO `products` (`id`, `images`, `name`, `unit`, `category_id`, `manufacturer`, `ingredients`, `description`, `price`, `quantity`) VALUES
(1, '[\"https://res.cloudinary.com/duk8odqun/image/upload/v1735990891/nhathuoconline/vha6xmrhqgf7hf8eerr0.jpg\",\"https://res.cloudinary.com/duk8odqun/image/upload/v1735990891/nhathuoconline/gh9i6a2mjtlqvy6ekehb.jpg\"]', 'Paracetamol 500mg', 'Vỉ', 10, 'Công ty Dược phẩm Bình Minh', 'Paracetamol 500mg', 'Giảm chịu chứng đau nữa đầu hiệu quá hơn bao giờ hết', '15000.00', 22),
(3, '[\"https://res.cloudinary.com/duk8odqun/image/upload/v1735978979/nhathuoconline/mlzjjptjdhzklse2mnb2.jpg\",\"https://res.cloudinary.com/duk8odqun/image/upload/v1735978980/nhathuoconline/pnwsdnjzr2jxk0sewbis.jpg\"]', 'Amoxicillin 500mg', 'Vỉ', 1, 'Công ty Dược phẩm Hà Nội	', 'Amoxicillin', 'Thuốc kháng sinh phổ biến', '25000.00', 50),
(4, '[\"https://res.cloudinary.com/duk8odqun/image/upload/v1735979432/nhathuoconline/vytsthx2liieai6zd2rw.jpg\",\"https://res.cloudinary.com/duk8odqun/image/upload/v1735979432/nhathuoconline/slhz3shhychfp02smnkk.jpg\"]', 'Codein Phosphate 30mg', 'Hộp', 3, 'Công ty Dược phẩm Nam Hà', 'Codein Phosphate', 'Giảm ho hiệu quả', '45000.00', 70),
(5, '[\"https://res.cloudinary.com/duk8odqun/image/upload/v1735979829/nhathuoconline/pz9e3mxfski4gels83jq.jpg\",\"https://res.cloudinary.com/duk8odqun/image/upload/v1735979829/nhathuoconline/onkvryuxqz7cfta2rwgq.jpg\"]', 'Vitamin C 500mg', 'Vỉ', 5, 'Công ty Dược phẩm Bình Minh', 'Omeprazole', 'Hỗ trợ tăng cường sức đề kháng', '50000.00', 80),
(6, '[\"https://res.cloudinary.com/duk8odqun/image/upload/v1736063317/nhathuoconline/c3hdsmqxnbp5azz2kvsk.jpg\",\"https://res.cloudinary.com/duk8odqun/image/upload/v1736063316/nhathuoconline/g512dhivqhf73xkzukoi.jpg\",\"https://res.cloudinary.com/duk8odqun/image/upload/v1736063316/nhathuoconline/b2rxaaaieadtmyz0sh5e.jpg\",\"https://res.cloudinary.com/duk8odqun/image/upload/v1736063315/nhathuoconline/xmexswhlb9flv1c1qwwy.jpg\",\"https://res.cloudinary.com/duk8odqun/image/upload/v1736063316/nhathuoconline/iryq6oirwo2qg7udak0j.jpg\",\"https://res.cloudinary.com/duk8odqun/image/upload/v1736063315/nhathuoconline/ctx9dedzde28n9mr67ys.jpg\",\"https://res.cloudinary.com/duk8odqun/image/upload/v1736063316/nhathuoconline/j9yfjytxybsuexrnb3lm.jpg\",\"https://res.cloudinary.com/duk8odqun/image/upload/v1736063316/nhathuoconline/fhymku4jnr1ltpjfnucr.jpg\"]', 'Bổ Não Ích Trí Gold Tất Thành tăng cường tuần hoàn não (60 viên)', 'Hộp', 6, 'MEDISTAR VN', 'Ginkgo biloba, Rau đắng biển, Magnesium gluconate, Thục địa, Ngưu tất (Rễ), Đan sâm, Ích mẫu, Bạch thược, Đương quy, Tá dược vừa đủ.', 'Bổ Não Ích Trí Gold giúp tăng cường tuần hoàn não, hỗ trợ ngăn ngừa thiếu máu lên não, giúp tăng cường hoạt động não. Hỗ trợ làm giảm các triệu chứng của thiểu năng tuần hoàn não, rối loạn tiền đình. Hỗ trợ giảm nguy cơ và giảm các triệu chứng sau tai biến do tắc mạch.', '210000.00', 514),
(8, '[\"https://res.cloudinary.com/duk8odqun/image/upload/v1736064544/nhathuoconline/nzcyr3kerldtkw8fvjyl.jpg\",\"https://res.cloudinary.com/duk8odqun/image/upload/v1736064545/nhathuoconline/u78ome0el17fin4rdfnl.jpg\",\"https://res.cloudinary.com/duk8odqun/image/upload/v1736064546/nhathuoconline/ocgafxhkwumwijn2s2rx.jpg\",\"https://res.cloudinary.com/duk8odqun/image/upload/v1736064546/nhathuoconline/d0rdrdidnfesrb0ql3ft.jpg\",\"https://res.cloudinary.com/duk8odqun/image/upload/v1736064548/nhathuoconline/vdcgmnai8nfqxmoqxyyt.jpg\"]', 'Viên nang cứng Vương Nữ Khang Royal Care hỗ trợ hạn chế sự phát triển u xơ tử cung, u vú lành tính (', 'Hộp', 8, 'CÔNG TY CỔ PHẦN PHÁT TRIỂN DƯỢC VESTA', 'Trinh nữ hoàng cung, Hoàng cầm, Hoàng kỳ, Tam thất, Curcumin, Betaglucan, Papain', 'Vương Nữ Khang hỗ trợ hạn chế sự phát triển của u xơ tử cung, u vú lành tính ở nữ giới.', '195000.00', 98),
(9, '[\"https://res.cloudinary.com/duk8odqun/image/upload/v1736064954/nhathuoconline/cejzfnmdtt5mgx19zk7j.jpg\",\"https://res.cloudinary.com/duk8odqun/image/upload/v1736064955/nhathuoconline/ripqahsw1yotduxo5l3d.jpg\",\"https://res.cloudinary.com/duk8odqun/image/upload/v1736064954/nhathuoconline/pzjafzgbikgwjdd68ykk.jpg\",\"https://res.cloudinary.com/duk8odqun/image/upload/v1736064954/nhathuoconline/qlp1hzedvvaxuej97kdv.jpg\",\"https://res.cloudinary.com/duk8odqun/image/upload/v1736064954/nhathuoconline/cdsvere3by428fiizput.jpg\",\"https://res.cloudinary.com/duk8odqun/image/upload/v1736064955/nhathuoconline/b0hhrhrckbsaabo5ax0j.jpg\",\"https://res.cloudinary.com/duk8odqun/image/upload/v1736064955/nhathuoconline/ezzdh6mla7itmuijldhl.jpg\"]', 'Viên uống Brauer Baby & Kids Ultra Pure DHA hỗ trợ phát triển não bộ, sức khỏe cho mắt (60 viên)', 'Hộp', 12, 'Lipa Pharmaceuticals Ltd.', 'Omega 3', 'Viên nhai Brauer Baby Kids Ultra Pure DHA dùng bổ sung DHA và EPA cho cơ thể, hỗ trợ phát triển não bộ và sức khỏe cho mắt.', '388000.00', 70),
(10, '[\"https://res.cloudinary.com/duk8odqun/image/upload/v1736065084/nhathuoconline/dgbzkgdgrw4ny5wtoypq.jpg\",\"https://res.cloudinary.com/duk8odqun/image/upload/v1736065083/nhathuoconline/rxzsbehzqzgcunhubysr.jpg\",\"https://res.cloudinary.com/duk8odqun/image/upload/v1736065084/nhathuoconline/aaolbfhmivt8se8kage1.jpg\",\"https://res.cloudinary.com/duk8odqun/image/upload/v1736065083/nhathuoconline/n1dnr0j7bjfzddjdplqh.jpg\"]', 'Viên uống Evening Primrose Oil (EPO) 1000mg Good Health cải thiện nội tiết tố nữ, làm đẹp da (70 viê', 'Hộp', 13, 'GOODHEALTH', 'Vitamin E, Tinh dầu hoa anh thảo, Glycerol trinitrate, Tá dược vừa đủ', 'Evening Primrose Oil (EPO) 1000mg Goodhealth hỗ trợ chống oxy hóa tế bào, giúp da mịn và cải thiện nội tiết tố nữ.', '504000.00', 30);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `phone` varchar(15) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `email` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `address` text COLLATE utf8mb4_unicode_ci
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `password`, `phone`, `email`, `address`) VALUES
(1, 'Nguyen Anh Tuan', '$2b$10$bPsMWMAvCOuC5pHWbOd3sON1P6.cfcY.0vlLVfQYFi974cDv/z/Wi', '0869094929', 'nguyenanhtuan.profile@gmail.com', 'Trà Vinh');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `admin`
--
ALTER TABLE `admin`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indexes for table `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `product_id` (`product_id`);

--
-- Indexes for table `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`id`),
  ADD KEY `category_id` (`category_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `admin`
--
ALTER TABLE `admin`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `categories`
--
ALTER TABLE `categories`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT for table `orders`
--
ALTER TABLE `orders`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `products`
--
ALTER TABLE `products`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `orders`
--
ALTER TABLE `orders`
  ADD CONSTRAINT `orders_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `orders_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`);

--
-- Constraints for table `products`
--
ALTER TABLE `products`
  ADD CONSTRAINT `products_ibfk_1` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
