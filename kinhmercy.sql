-- phpMyAdmin SQL Dump
-- version 5.2.2
-- https://www.phpmyadmin.net/
--
-- Máy chủ: localhost
-- Thời gian đã tạo: Th5 16, 2026 lúc 01:48 PM
-- Phiên bản máy phục vụ: 5.7.44-log
-- Phiên bản PHP: 8.3.21

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Cơ sở dữ liệu: `kinhmercy`
--

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `cart`
--

CREATE TABLE `cart` (
  `id` int(11) NOT NULL,
  `session_id` varchar(128) COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `product_id` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `variant_name` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `warranty_id` int(11) DEFAULT NULL,
  `quantity` int(11) NOT NULL DEFAULT '1',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `categories`
--

CREATE TABLE `categories` (
  `id` int(11) NOT NULL,
  `name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `slug` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `icon` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `parent_id` int(11) DEFAULT NULL,
  `sort_order` int(11) DEFAULT '0',
  `is_active` tinyint(1) DEFAULT '1',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `categories`
--

INSERT INTO `categories` (`id`, `name`, `slug`, `icon`, `parent_id`, `sort_order`, `is_active`, `created_at`) VALUES
(1, 'Flash Sale', 'flash-sale', 'fas fa-bolt', NULL, 1, 1, '2026-04-06 09:43:23'),
(2, 'K├¡nh Th├┤ng Minh', 'kinh-thong-minh', 'fas fa-glasses', NULL, 2, 1, '2026-04-06 09:43:23'),
(3, '─Éß╗ông Hß╗ô Th├┤ng Minh', 'dong-ho-thong-minh', 'fas fa-clock', NULL, 3, 1, '2026-04-06 09:43:23'),
(4, 'Robot Th├┤ng Minh', 'robot-thong-minh', 'fas fa-robot', NULL, 4, 1, '2026-04-06 09:43:23'),
(5, 'Tai Nghe Th├┤ng Minh', 'tai-nghe-thong-minh', 'fas fa-headphones-alt', NULL, 5, 1, '2026-04-06 09:43:23'),
(6, 'Phß╗Ñ Kiß╗çn Th├┤ng Minh', 'phu-kien-thong-minh', 'fas fa-puzzle-piece', NULL, 6, 1, '2026-04-06 09:43:23'),
(7, 'K├¡nh Quay POV', 'kinh-quay-pov', 'fas fa-video', 2, 1, 1, '2026-04-06 09:43:23'),
(8, 'K├¡nh Dß╗ïch Thuß║¡t', 'kinh-dich-thuat', 'fas fa-language', 2, 2, 1, '2026-04-06 09:43:23'),
(9, 'K├¡nh Th├┤ng Minh AI', 'kinh-thong-minh-ai', 'fas fa-brain', 2, 3, 1, '2026-04-06 09:43:23'),
(10, 'Kính Mắt Thông Minh', 'kinh-mat-thong-minh', '🕶️', NULL, 1, 1, '2026-04-10 02:51:11'),
(11, 'Kính Camera POV', 'kinh-camera-pov', '📹', NULL, 3, 1, '2026-04-10 02:51:11'),
(12, 'Phụ Kiện', 'phu-kien', '🎒', NULL, 4, 1, '2026-04-10 02:51:11'),
(13, 'Robot AI', 'robot-ai', '🤖', NULL, 5, 1, '2026-04-10 02:51:11');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `contact_requests`
--

CREATE TABLE `contact_requests` (
  `id` int(11) NOT NULL,
  `name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `phone` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `message` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'pending',
  `notes` text COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `contact_requests`
--

INSERT INTO `contact_requests` (`id`, `name`, `phone`, `email`, `message`, `status`, `notes`, `created_at`, `updated_at`) VALUES
(1, 'Test', '0921619239', 'test@test.com', 'Test message', 'pending', NULL, '2026-05-09 11:22:08', '2026-05-09 11:22:08'),
(2, 'Test User', '0921619239', 'mtlenduc@gmail.com', 'T', 'pending', NULL, '2026-05-09 11:26:19', '2026-05-09 11:26:19'),
(3, 'Test User', '0921619239', 'mtlenduc@gmail.com', 'Toi muon mua kinh', 'pending', NULL, '2026-05-09 11:26:37', '2026-05-09 11:26:37'),
(4, 'Test User', '0921619239', 'mtlenduc@gmail.com', 'Toi muon mua kinh', 'pending', NULL, '2026-05-09 11:27:06', '2026-05-09 11:27:06'),
(5, 'Test User', '0921619239', 'mtlenduc@gmail.com', 'Toi muon mua kinh', 'pending', NULL, '2026-05-09 11:27:25', '2026-05-09 11:27:25'),
(6, 'Test User', '0921619239', 'mtlenduc@gmail.com', 'Toi muon mua kinh', 'pending', NULL, '2026-05-09 11:27:41', '2026-05-09 11:27:41'),
(7, 'Cày Chay Đức', '0398684921', 'mtienduc@gmail.com', 'sầđá', 'pending', NULL, '2026-05-09 11:50:09', '2026-05-09 11:50:09'),
(8, 'Cày Chay Đức', '0398684921', 'mr.manhdora@gmail.com', 'test', 'pending', NULL, '2026-05-09 11:51:03', '2026-05-09 11:51:03'),
(9, 'a', '0912397123', 'mtienduc@gmail.com', 'a', 'pending', NULL, '2026-05-09 13:42:03', '2026-05-09 13:42:03'),
(10, 'a', '0914658193', 'mtienduc@gmail.com', 'a', 'pending', NULL, '2026-05-09 13:42:24', '2026-05-09 13:42:24'),
(11, 'Mạnh', '0398684921', 'mr.manhdora@gmail.com', 'test', 'pending', NULL, '2026-05-12 14:55:23', '2026-05-12 14:55:23'),
(12, 'ầ', '0398684921', 'mercyglobalstore@gmail.com', 'Test', 'pending', NULL, '2026-05-16 11:28:13', '2026-05-16 11:28:13');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `orders`
--

CREATE TABLE `orders` (
  `id` int(11) NOT NULL,
  `order_code` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `customer_name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `customer_phone` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `customer_email` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `shipping_address` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `subtotal` bigint(20) NOT NULL DEFAULT '0',
  `discount_amount` bigint(20) NOT NULL DEFAULT '0',
  `shipping_fee` bigint(20) NOT NULL DEFAULT '0',
  `total` bigint(20) NOT NULL DEFAULT '0',
  `payment_method` enum('cod','bank_transfer','ewallet') COLLATE utf8mb4_unicode_ci DEFAULT 'cod',
  `status` enum('pending','confirmed','shipping','delivered','cancelled') COLLATE utf8mb4_unicode_ci DEFAULT 'pending',
  `notes` text COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `ip_address` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `payment_amount` bigint(20) DEFAULT '0',
  `payment_ref` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `payment_status` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT 'pending'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `orders`
--

INSERT INTO `orders` (`id`, `order_code`, `user_id`, `customer_name`, `customer_phone`, `customer_email`, `shipping_address`, `subtotal`, `discount_amount`, `shipping_fee`, `total`, `payment_method`, `status`, `notes`, `created_at`, `updated_at`, `ip_address`, `payment_amount`, `payment_ref`, `payment_status`) VALUES
(1, 'MRC0020', 1, 'Khách hàng', '', NULL, '', 4641800, 0, 0, 4641800, 'bank_transfer', 'pending', '[DEPOSIT] CHUYEN TIEN KINH MERCY 0020', '2026-04-29 18:20:50', '2026-04-29 18:20:50', NULL, 0, NULL, 'pending'),
(2, 'MRC0021', 1, 'Khách hàng', '', NULL, '', 4091800, 0, 0, 4091800, 'bank_transfer', 'pending', '[DEPOSIT] CHUYEN TIEN KINH MERCY 0021', '2026-04-29 20:38:40', '2026-04-29 20:38:40', '::1', 0, NULL, 'pending'),
(3, 'MRC0023', 1, 'Khách hàng', '', NULL, '', 4091800, 0, 0, 4091800, 'bank_transfer', 'pending', '[FULL] CHUYEN TIEN KINH MERCY 0023', '2026-04-29 20:49:49', '2026-04-29 20:49:49', '::1', 0, NULL, 'pending'),
(4, 'MRC0005', NULL, 'Khách hàng', '', NULL, '', 4991800, 0, 0, 4991800, 'bank_transfer', 'pending', '[FULL] CHUYEN TIEN KINH MERCY 0005', '2026-05-02 08:40:44', '2026-05-02 08:40:44', '14.248.84.207', 0, NULL, 'pending'),
(5, 'MRC0003', 18784, 'Khách hàng', '', NULL, '', 4091800, 0, 0, 4091800, 'bank_transfer', 'pending', '[DEPOSIT] CHUYEN TIEN KINH MERCY 0003', '2026-05-02 14:34:01', '2026-05-02 14:34:01', '14.162.155.59', 0, NULL, 'pending'),
(6, 'MRC0004', 18784, 'Khách hàng', '', NULL, '', 4991800, 0, 0, 4991800, 'bank_transfer', 'pending', '[FULL] CHUYEN TIEN KINH MERCY 0004', '2026-05-02 14:34:52', '2026-05-02 14:34:52', '14.162.155.59', 0, NULL, 'pending'),
(7, 'MRC0025', 1, 'Khách hàng', '', NULL, '', 4991800, 0, 0, 4991800, 'bank_transfer', 'pending', '[DEPOSIT] CHUYEN TIEN KINH MERCY 0025', '2026-05-09 11:52:40', '2026-05-09 11:52:40', '::1', 0, NULL, 'pending');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `order_items`
--

CREATE TABLE `order_items` (
  `id` int(11) NOT NULL,
  `order_id` int(11) NOT NULL,
  `product_id` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `product_name` varchar(500) COLLATE utf8mb4_unicode_ci NOT NULL,
  `variant_name` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `warranty_name` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `warranty_fee` bigint(20) DEFAULT '0',
  `price` bigint(20) NOT NULL,
  `original_price` bigint(20) NOT NULL DEFAULT '0',
  `quantity` int(11) NOT NULL DEFAULT '1',
  `image_url` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `order_items`
--

INSERT INTO `order_items` (`id`, `order_id`, `product_id`, `product_name`, `variant_name`, `warranty_name`, `warranty_fee`, `price`, `original_price`, `quantity`, `image_url`) VALUES
(1, 1, '1', 'Kính Thông Minh Bluetooth Mercy MCK 5.0 [Black & White] Camera Quay Chụp, Trợ lý AI, Dịch Thuật', NULL, NULL, 0, 4091800, 4091800, 1, '/products/MCK5.0Đôi-0.jpg'),
(2, 1, '10001', 'BH 3 Tháng - Kính Thông Minh Bluetooth Mercy MCK 5.0 [Black & White] Camera Quay Chụp, Trợ lý AI, Dịch Thuật', NULL, NULL, 0, 550000, 550000, 1, '/products/MCK5.0Đôi-0.jpg'),
(3, 2, '3', 'Kính Thông Minh Bluetooth Mercy MCK 5.0 [Black] Camera Quay Chụp, Trợ lý AI, Dịch Thuật', NULL, NULL, 0, 4091800, 4091800, 1, '/products/MCK5.0D-0.jpg'),
(4, 3, '3', 'Kính Thông Minh Bluetooth Mercy MCK 5.0 [Black] Camera Quay Chụp, Trợ lý AI, Dịch Thuật', NULL, NULL, 0, 4091800, 4091800, 1, '/products/MCK5.0D-0.jpg'),
(5, 4, '1', 'Kính Thông Minh Bluetooth Mercy MCK 5.0 [Black & White] Camera Quay Chụp, Trợ lý AI, Dịch Thuật', NULL, NULL, 0, 4091800, 4091800, 1, '/products/MCK5.0Đôi-0.jpg'),
(6, 4, '10001', 'BH 12 Tháng - Kính Thông Minh Bluetooth Mercy MCK 5.0 [Black & White] Camera Quay Chụp, Trợ lý AI, Dịch Thuật', NULL, NULL, 0, 900000, 900000, 1, '/products/MCK5.0Đôi-0.jpg'),
(7, 5, '1', 'Kính Thông Minh Bluetooth Mercy MCK 5.0 [Black & White] Camera Quay Chụp, Trợ lý AI, Dịch Thuật', NULL, NULL, 0, 4091800, 4091800, 1, '/products/MCK5.0Đôi-0.jpg'),
(8, 6, '1', 'Kính Thông Minh Bluetooth Mercy MCK 5.0 [Black & White] Camera Quay Chụp, Trợ lý AI, Dịch Thuật', NULL, NULL, 0, 4091800, 4091800, 1, '/products/MCK5.0Đôi-0.jpg'),
(9, 6, '10001', 'BH 12 Tháng - Kính Thông Minh Bluetooth Mercy MCK 5.0 [Black & White] Camera Quay Chụp, Trợ lý AI, Dịch Thuật', NULL, NULL, 0, 900000, 900000, 1, '/products/MCK5.0Đôi-0.jpg'),
(10, 7, '1', 'Kính Thông Minh Bluetooth Mercy MCK 5.0 [Black & White] Camera Quay Chụp, Trợ lý AI, Dịch Thuật', NULL, NULL, 0, 4091800, 4091800, 1, '/products/MCK5.0Đôi-1.jpg'),
(11, 7, '10001', 'BH 12 Tháng - Kính Thông Minh Bluetooth Mercy MCK 5.0 [Black & White] Camera Quay Chụp, Trợ lý AI, Dịch Thuật', NULL, NULL, 0, 900000, 900000, 1, '/products/MCK5.0Đôi-1.jpg');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `payment_methods`
--

CREATE TABLE `payment_methods` (
  `id` int(11) NOT NULL,
  `bank_code` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `bank_name` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `account_number` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `account_name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `payment_methods`
--

INSERT INTO `payment_methods` (`id`, `bank_code`, `bank_name`, `account_number`, `account_name`, `is_active`, `created_at`, `updated_at`) VALUES
(1, 'ACB', 'Ngân hàng Á Châu', '24488671', 'MAI XUAN ANH', 1, '2026-04-29 21:16:43', '2026-04-29 21:16:43');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `products`
--

CREATE TABLE `products` (
  `id` int(11) NOT NULL,
  `product_id` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `sku` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `name` varchar(500) COLLATE utf8mb4_unicode_ci NOT NULL,
  `short_name` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `category_id` int(11) DEFAULT NULL,
  `category_name` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `price` bigint(20) NOT NULL DEFAULT '0',
  `original_price` bigint(20) NOT NULL DEFAULT '0',
  `discount` int(11) DEFAULT '0',
  `badge` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `rating` decimal(2,1) DEFAULT '0.0',
  `sold` int(11) DEFAULT '0',
  `stock` int(11) DEFAULT '0',
  `brand` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT 'Mercy Tech Global',
  `description` longtext COLLATE utf8mb4_unicode_ci,
  `seo_tags` text COLLATE utf8mb4_unicode_ci,
  `shopee_url` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `tiktok_url` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `is_flash_sale` tinyint(1) DEFAULT '0',
  `flash_sale_percent` int(11) DEFAULT '0',
  `is_active` tinyint(1) DEFAULT '1',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `features_vn` longtext COLLATE utf8mb4_unicode_ci,
  `features_en` longtext COLLATE utf8mb4_unicode_ci,
  `footer_info` text COLLATE utf8mb4_unicode_ci,
  `production_year` int(11) DEFAULT NULL,
  `clearance_price` bigint(20) DEFAULT '0',
  `daily_sale_price` bigint(20) DEFAULT '0',
  `campaign_price` bigint(20) DEFAULT '0',
  `off_platform_price` bigint(20) DEFAULT '0',
  `warranty_data` text COLLATE utf8mb4_unicode_ci
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `products`
--

INSERT INTO `products` (`id`, `product_id`, `sku`, `name`, `short_name`, `category_id`, `category_name`, `price`, `original_price`, `discount`, `badge`, `rating`, `sold`, `stock`, `brand`, `description`, `seo_tags`, `shopee_url`, `tiktok_url`, `is_flash_sale`, `flash_sale_percent`, `is_active`, `created_at`, `updated_at`, `features_vn`, `features_en`, `footer_info`, `production_year`, `clearance_price`, `daily_sale_price`, `campaign_price`, `off_platform_price`, `warranty_data`) VALUES
(1, 'MCK5.0Doi', 'MCK5.0Đôi', 'Kính Thông Minh Bluetooth Mercy MCK 5.0 [Black & White] Camera Quay Chụp, Trợ lý AI, Dịch Thuật', 'MCK 5.0 [Black & White]', 10, 'Kính Thông Minh AI', 4091800, 4990000, 18, NULL, 5.0, 156, 50, 'Mercy Tech Global', 'Mercy MCK 5.1 – Kính Thông Minh Bluetooth Mercy là bước tiến mới trong dòng thiết bị đeo công nghệ. Sản phẩm kết hợp giữa thời trang – sức khỏe – tiện ích thông minh.', NULL, 'https://s.shopee.vn/9zsC6LQWz3', NULL, 1, 15, 1, '2026-04-10 02:51:11', '2026-05-09 08:37:44', NULL, NULL, NULL, NULL, 0, 0, 0, 0, NULL),
(2, 'MCK5.0T', 'MCK5.0T', 'Kính Thông Minh Bluetooth Mercy MCK 5.0 [White] Camera Quay Chụp, Trợ lý AI, Dịch Thuật', 'MCK 5.0 [White]', 10, 'Kính Thông Minh AI', 4091800, 4990000, 18, NULL, 5.0, 203, 45, 'Mercy Tech Global', 'Mercy MCK 5.1 [White] – Kính Thông Minh Bluetooth Mercy là bước tiến mới trong dòng thiết bị đeo công nghệ.', NULL, 'https://s.shopee.vn/AUoShGOcyA', NULL, 1, 15, 1, '2026-04-10 02:51:11', '2026-05-09 08:37:44', NULL, NULL, NULL, NULL, 0, 0, 0, 0, NULL),
(3, 'MCK5.0D', 'MCK5.0D', 'Kính Thông Minh Bluetooth Mercy MCK 5.0 [Black] Camera Quay Chụp, Trợ lý AI, Dịch Thuật', 'MCK 5.0 [Black]', 10, 'Kính Thông Minh AI', 4091800, 4990000, 18, NULL, 4.9, 189, 38, 'Mercy Tech Global', 'Mercy MCK 5.1 [Black] – Kính Thông Minh Bluetooth Mercy là bước tiến mới trong dòng thiết bị đeo công nghệ.', NULL, 'https://s.shopee.vn/AKV2UxPGJ9', NULL, 1, 15, 1, '2026-04-10 02:51:11', '2026-05-09 08:37:44', NULL, NULL, NULL, NULL, 0, 0, 0, 0, NULL),
(4, 'MCK5.1Doi', 'MCK5.1Đôi', 'Kính Thông Minh Bluetooth Mercy MCK 5.1 [Tròng đổi màu & Râm] Camera Quay Chụp, Trợ lý AI', 'MCK 5.1 [Đổi màu & Râm]', 10, 'Kính Thông Minh AI', 4911800, 5990000, 18, NULL, 5.0, 97, 30, 'Mercy Tech Global', 'Mercy MCK 5.1 [Tròng đổi màu & Râm] – Phiên bản cao cấp với tròng đổi màu photochromic.', NULL, 'https://s.shopee.vn/9UvvVQSR00', NULL, 1, 15, 1, '2026-04-10 02:51:11', '2026-05-09 08:37:44', NULL, NULL, NULL, NULL, 0, 0, 0, 0, NULL),
(5, 'MCK5.1T', 'MCK5.1T', 'Kính Thông Minh Bluetooth Mercy MCK 5.1 [Tròng đổi màu] Camera Quay Chụp, Trợ lý AI', 'MCK 5.1 [Tròng đổi màu]', 10, 'Kính Thông Minh AI', 4911800, 5990000, 18, NULL, 4.9, 112, 25, 'Mercy Tech Global', 'Mercy MCK 5.1 [Tròng đổi màu] – Tròng photochromic tự động điều chỉnh sáng/tối theo môi trường.', NULL, 'https://s.shopee.vn/9KcVJ7T4Kz', NULL, 0, 0, 1, '2026-04-10 02:51:11', '2026-05-09 08:37:44', NULL, NULL, NULL, NULL, 0, 0, 0, 0, NULL),
(6, 'MCK5.1D', 'MCK5.1D', 'Kính Thông Minh Bluetooth Mercy MCK 5.1 [Black] Camera Quay Chụp, Trợ lý AI, Dịch Thuật', 'MCK 5.1 [Black]', 10, 'Kính Thông Minh AI', 4911800, 5990000, 18, NULL, 4.8, 145, 32, 'Mercy Tech Global', 'Mercy MCK 5.1 [Black] – Phiên bản cao cấp với tròng râm chống UV.', NULL, 'https://s.shopee.vn/7pnhWSjLfh', NULL, 0, 0, 1, '2026-04-10 02:51:11', '2026-05-09 08:37:44', NULL, NULL, NULL, NULL, 0, 0, 0, 0, NULL),
(7, 'KDT5.0Doi', 'KDT5.0Đôi', 'Kính Dịch Thuật Realtime Mercy KDT 5.0 [Black & White] Thông Minh, Camera Quay Chụp, Trợ lý AI', 'KDT 5.0 [Black & White]', 8, 'Kính Dịch Thuật', 4091800, 4990000, 18, NULL, 5.0, 134, 40, 'Mercy Tech Global', 'Kính Dịch Thuật Realtime Mercy KDT 5.0 – Dịch thuật realtime với độ trễ chỉ 0,5s nhanh nhất thị trường.', NULL, 'https://s.shopee.vn/7KrQvXlFgc', NULL, 1, 15, 1, '2026-04-10 02:51:11', '2026-04-10 02:51:11', NULL, NULL, NULL, NULL, 0, 0, 0, 0, NULL),
(8, 'KDT5.0T', 'KDT5.0T', 'Kính Dịch Thuật Realtime Mercy KDT 5.0 [White] Kính Thông Minh có Camera Quay Chụp, Trợ lý AI', 'KDT 5.0 [White]', 8, 'Kính Dịch Thuật', 4091800, 4990000, 18, NULL, 4.9, 178, 35, 'Mercy Tech Global', 'Kính Dịch Thuật Realtime Mercy KDT 5.0 [White] – Dịch thuật realtime đa ngôn ngữ.', NULL, 'https://s.shopee.vn/7VAr7qkcLf', NULL, 0, 0, 1, '2026-04-10 02:51:11', '2026-04-10 02:51:11', NULL, NULL, NULL, NULL, 0, 0, 0, 0, NULL),
(9, 'KDT5.0D', 'KDT5.0D', 'Kính Dịch Thuật Realtime Mercy KDT 5.0 [Black] Kính Thông Minh có Camera Quay Chụp, Trợ lý AI', 'KDT 5.0 [Black]', 8, 'Kính Dịch Thuật', 4091800, 4990000, 18, NULL, 4.9, 167, 42, 'Mercy Tech Global', 'Kính Dịch Thuật Realtime Mercy KDT 5.0 [Black] – Dịch thuật realtime đa ngôn ngữ.', NULL, 'https://s.shopee.vn/5fjCwTrb4K', NULL, 0, 0, 1, '2026-04-10 02:51:11', '2026-04-10 02:51:11', NULL, NULL, NULL, NULL, 0, 0, 0, 0, NULL),
(10, 'KDT5.1Doi', 'KDT5.1Đôi', 'Kính Dịch Thuật Realtime Mercy KDT 5.1 [Tròng đổi màu & Râm] Thông Minh, Camera, Trợ lý AI', 'KDT 5.1 [Đổi màu & Râm]', 8, 'Kính Dịch Thuật', 4911800, 5990000, 18, NULL, 5.0, 89, 28, 'Mercy Tech Global', 'Kính Dịch Thuật Realtime Mercy KDT 5.1 [Tròng đổi màu & Râm] – Phiên bản cao cấp.', NULL, 'https://s.shopee.vn/7VAr7rtHvi', NULL, 0, 0, 1, '2026-04-10 02:51:11', '2026-04-10 02:51:11', NULL, NULL, NULL, NULL, 0, 0, 0, 0, NULL),
(11, 'KDT5.1T', 'KDT5.1T', 'Kính Dịch Thuật Realtime Mercy KDT 5.1 [Tròng đổi màu] Kính Thông Minh Camera, Trợ lý AI', 'KDT 5.1 [Tròng đổi màu]', 8, 'Kính Dịch Thuật', 4911800, 5990000, 18, NULL, 4.8, 102, 22, 'Mercy Tech Global', 'Kính Dịch Thuật Realtime Mercy KDT 5.1 [Tròng đổi màu] – Tròng photochromic tự động.', NULL, 'https://s.shopee.vn/7KrQvYtvGh', NULL, 0, 0, 1, '2026-04-10 02:51:11', '2026-04-10 02:51:11', NULL, NULL, NULL, NULL, 0, 0, 0, 0, NULL),
(12, 'KDT5.1D', 'KDT5.1D', 'Kính Dịch Thuật Realtime Mercy KDT 5.1 [Black] Kính Thông Minh Camera Quay POV 2K, Trợ lý AI', 'KDT 5.1 [Black]', 8, 'Kính Dịch Thuật', 4911800, 5990000, 18, NULL, 4.9, 95, 30, 'Mercy Tech Global', 'Kính Dịch Thuật Realtime Mercy KDT 5.1 [Black] – Camera quay POV 2K chống rung EIS.', NULL, 'https://s.shopee.vn/5q2d8nzdJQ', NULL, 0, 0, 1, '2026-04-10 02:51:11', '2026-04-10 02:51:11', NULL, NULL, NULL, NULL, 0, 0, 0, 0, NULL),
(13, 'POV5.0Doi', 'POV5.0Đôi', 'Kính Quay Video POV 2K Camera 32MP Mercy POV 5.0 [Black & White] Trợ lý AI Dịch Thuật', 'POV 5.0 [Black & White]', 11, 'Kính Có Camera', 4091800, 4990000, 18, NULL, 5.0, 76, 35, 'Mercy Tech Global', 'Kính Quay Video POV 2K Camera 32MP Mercy POV 5.0 – Quay video 2K POV lên đến 12 phút.', NULL, 'https://s.shopee.vn/Lhh0quBTH', NULL, 0, 0, 1, '2026-04-10 02:51:11', '2026-05-09 08:37:45', NULL, NULL, NULL, NULL, 0, 0, 0, 0, NULL),
(14, 'POV5.0T', 'POV5.0T', 'Kính Quay Video POV 2K Camera 32MP Mercy POV 5.0 [White] Trợ lý AI Dịch Thuật Realtime', 'POV 5.0 [White]', 11, 'Kính Có Camera', 4091800, 4990000, 18, NULL, 4.8, 65, 40, 'Mercy Tech Global', 'Kính Quay Video POV 2K Mercy POV 5.0 [White] – Camera 32MP, quay video 2K POV 12 phút.', NULL, 'https://s.shopee.vn/qdxblsHSO', NULL, 0, 0, 1, '2026-04-10 02:51:11', '2026-05-09 08:37:45', NULL, NULL, NULL, NULL, 0, 0, 0, 0, NULL),
(15, 'POV5.0D', 'POV5.0D', 'Kính Quay Video POV 2K Camera 32MP Mercy POV 5.0 [Black] Trợ lý AI Dịch Thuật Realtime', 'POV 5.0 [Black]', 11, 'Kính Có Camera', 4091800, 4990000, 18, NULL, 4.9, 72, 38, 'Mercy Tech Global', 'Kính Quay Video POV 2K Mercy POV 5.0 [Black] – Camera 32MP, quay 2K POV 12 phút.', NULL, 'https://s.shopee.vn/gKXPSsunN', NULL, 0, 0, 1, '2026-04-10 02:51:11', '2026-05-09 08:37:45', NULL, NULL, NULL, NULL, 0, 0, 0, 0, NULL),
(16, 'POV5.1Doi', 'POV5.1Đôi', 'Kính Quay Video POV 2K Camera 32MP Mercy POV 5.1 [Tròng đổi màu & Râm] Trợ lý AI', 'POV 5.1 [Đổi màu & Râm]', 11, 'Kính Có Camera', 4911800, 5990000, 18, NULL, 5.0, 54, 20, 'Mercy Tech Global', 'Kính Quay Video POV 2K Mercy POV 5.1 [Tròng đổi màu & Râm] – Phiên bản cao cấp.', NULL, 'https://s.shopee.vn/1BGo0Nr0mU', NULL, 0, 0, 1, '2026-04-10 02:51:11', '2026-05-09 08:37:45', NULL, NULL, NULL, NULL, 0, 0, 0, 0, NULL),
(17, 'POV5.1T', 'POV5.1T', 'Kính Quay Video POV 2K Camera 32MP Mercy POV 5.1 [Tròng đổi màu] Trợ lý AI Dịch Thuật', 'POV 5.1 [Tròng đổi màu]', 11, 'Kính Có Camera', 4911800, 5990000, 18, NULL, 4.8, 48, 25, 'Mercy Tech Global', 'Kính Quay Video POV 2K Mercy POV 5.1 [Tròng đổi màu] – Tròng photochromic tự động.', NULL, 'https://s.shopee.vn/8AQYLGT7as', NULL, 0, 0, 1, '2026-04-10 02:51:11', '2026-05-09 08:37:45', NULL, NULL, NULL, NULL, 0, 0, 0, 0, NULL),
(18, 'POV5.1D', 'POV5.1D', 'Kính Quay Video POV 2K Camera 32MP Mercy POV 5.1 [Tròng Râm] Trợ lý AI Dịch Thuật', 'POV 5.1 [Tròng Râm]', 11, 'Kính Có Camera', 4911800, 5990000, 18, NULL, 4.9, 61, 28, 'Mercy Tech Global', 'Kính Quay Video POV 2K Mercy POV 5.1 [Tròng Râm] – Tròng râm chống UV bảo vệ mắt.', NULL, 'https://s.shopee.vn/80788xTkvr', NULL, 0, 0, 1, '2026-04-10 02:51:11', '2026-05-09 08:37:45', NULL, NULL, NULL, NULL, 0, 0, 0, 0, NULL),
(19, 'BD1', 'BD1', 'Bao Da Đựng Kính Mắt Thời Trang Cao Cấp Mercy - Gọn Nhẹ Mịn Mềm Mại', 'Bao Da Mercy', 12, 'Phụ Kiện', 99000, 199000, 50, NULL, 4.7, 320, 100, 'Mercy Tech Global', 'Bao da đựng kính Mercy – chất liệu da Premium mịn màng, thiết kế Slim-fit siêu gọn nhẹ.', NULL, NULL, NULL, 0, 0, 1, '2026-04-10 02:51:11', '2026-04-10 02:51:11', NULL, NULL, NULL, NULL, 0, 0, 0, 0, NULL),
(20, 'RBnu-capy', 'RBnu-capy', 'Gấu Bông AI BabyThree Capybara Thông Minh - Học Tập Luyện Nghe Tiếng Anh +40 Ngôn Ngữ', 'AI BabyThree Capybara', 13, 'Robot AI', 4502000, 5490000, 18, NULL, 5.0, 67, 20, 'Mercy Tech Global', 'Gấu bông AI BabyThree Capybara – Siêu phẩm công nghệ tích hợp trí tuệ nhân tạo.', NULL, NULL, NULL, 1, 15, 1, '2026-04-10 02:51:11', '2026-04-10 02:51:11', NULL, NULL, NULL, NULL, 0, 0, 0, 0, NULL),
(21, 'RBnu-gautruc', 'RBnu-gautruc', 'Gấu Bông AI BabyThree Gấu Trúc Thông Minh - Học Tập Luyện Nghe Tiếng Anh +40 Ngôn Ngữ', 'AI BabyThree Gấu Trúc', 13, 'Robot AI', 4502000, 5490000, 18, NULL, 4.9, 54, 18, 'Mercy Tech Global', 'Gấu bông AI BabyThree Gấu Trúc – Phiên bản Panda dễ thương tích hợp trí tuệ nhân tạo.', NULL, NULL, NULL, 0, 0, 1, '2026-04-10 02:51:11', '2026-04-10 02:51:11', NULL, NULL, NULL, NULL, 0, 0, 0, 0, NULL),
(22, 'RBnu-Tho', 'RBnu-Tho', 'Gấu Bông AI BabyThree Thỏ Hồng Thông Minh - Học Tập Luyện Nghe Tiếng Anh +40 Ngôn Ngữ', 'AI BabyThree Thỏ Hồng', 13, 'Robot AI', 4502000, 5490000, 18, NULL, 4.9, 49, 15, 'Mercy Tech Global', 'Gấu bông AI BabyThree Thỏ Hồng – Phiên bản Bunny xinh xắn.', NULL, NULL, NULL, 0, 0, 1, '2026-04-10 02:51:12', '2026-04-10 02:51:12', NULL, NULL, NULL, NULL, 0, 0, 0, 0, NULL),
(24, 'MCK6.0', 'MCK6.0', 'Kính Thông Minh Bluetooth Mercy MCK 6.0 Có Dock Sạc Camera Quay Chụp, Trợ lý AI, Dịch Thuật', 'Mercy MCK 6.0 Dock Sạc', NULL, 'Kính Thông Minh AI', 4891800, 5990000, 18, 'Mới', 5.0, 0, 100, 'Mercy Tech Global', 'Kính Thông Minh Bluetooth Mercy MCK 6.0 Có Dock sạc - Camera Quay Video/Chụp Hình - Trợ Lý AI - Dịch Thuật - Nghe Gọi - Chống Nước IP65\n\nMercy MCK 6.0 – Kính Thông Minh Bluetooth Mercy là bước tiến mới trong dòng thiết bị đeo công nghệ.\n\nSản phẩm kết hợp giữa thời trang – sức khỏe – tiện ích thông minh, mang đến trải nghiệm hoàn toàn khác biệt cho người dùng hiện đại.\n\nKhông chỉ là một chiếc kính mắt thông thường, Mercy MCK 6.0 còn là tai nghe không dây, camera quay video, trợ lý AI cá nhân, thiết bị ghi âm và dịch thuật realtime với độ trễ chỉ 0,5s nhanh nhất thị trường.\n\n1️⃣Trợ lý AI kết nối APP (Hỗ trợ Full Tiếng Việt)\n- Với AI Q&A và công nghệ xử lý ngôn ngữ tự nhiên, Mercy MCK 6.0 có thể nhanh chóng trả lời mọi câu hỏi.\n\n2️⃣Nghe nhạc – Gọi điện đàm thoại cực rõ\n- Âm thanh định hướng 3D giúp truyền âm thanh trực tiếp đến tai.\n- Micro kép khử ồn AI giúp đàm thoại rõ ràng.\n\n3️⃣Quay phim 2K, chụp ảnh Full HD.\n- Trang bị camera 32MP, hỗ trợ quay video 2K chống rung EIS góc nhìn thứ nhất.\n\n4️⃣Dịch thuật tức thì\n- Kính thông minh Mercy MCK 6.0 hỗ trợ dịch Realtime song song nhiều ngôn ngữ.\n\n5️⃣Có Dock sạc siêu tiện thay thế pin dự phòng. Duy trì pin đến 7 ngày.\n\n6️⃣Độ bền cao – Hoạt động mọi môi trường\n- Vật liệu ABS chống trầy xước, chịu va đập.\n- Chuẩn IP65 chống nước – chống bụi – chống mồ hôi.\n\n7️⃣Pin khỏe – Sạc nhanh\n- Dung lượng 270mAh, nghe nhạc liên tục đến 12 giờ.', 'kính thông minh,kính thông minh mercy,mercy,smart glasses,kính có camera,kính bluetooth,kính nghe nhạc,MCK 6.0,dock sạc', 'https://s.shopee.vn/6Ah9vSRXSn', 'https://www.tiktok.com/view/product/1733225043704055552', 0, 0, 1, '2026-05-09 10:09:41', '2026-05-09 10:09:41', '🔥 CÁC TÍNH NĂNG CỦA KÍNH MERCY \n1. Trợ lý AI cá nhân Mercy (điều khiển bằng giọng nói).\n2. Dịch thuật REALTIME đa ngôn ngữ.\n3. Nghe nhạc chất lượng cao với loa âm thanh 3D định hướng.\n4. Gọi điện rảnh tay với Micro kép khử ồn AI, cho âm thanh trong trẻo.\n5. Quay video 2K với góc nhìn thứ nhất (First Person View).\n6. Chụp ảnh với Camera 32MP chống rung.\n7. Ghi âm 1 chạm.\n8. Nhận dạng hình ảnh AI thông minh (nhận diện vật thể, dịch văn bản).\n9. Pin trâu 270mAh, sử dụng liên tục 6–12 giờ.\n10. Chống nước đạt chuẩn IP65.\n11. Thay tròng kính linh hoạt như màu, kính cận,...', '🔥 FEATURES OF MERCY GLASSES\n1. Mercy personal AI assistant (voice control).\n2. REALTIME multi-language translation.\n3. High-quality music playback with directional 3D speakers.\n4. Hands-free calling with AI-powered dual noise-canceling microphones.\n5. 2K video recording with first-person view.\n6. 32MP camera with image stabilization.\n7. One-touch audio recording.\n8. Intelligent AI image recognition.\n9. Long-lasting 270mAh battery, 6–12 hours of continuous use.\n10. IP65 waterproof rating.\n11. Flexible lens options.', 'Xin chân thành cảm ơn❤️\n© Bản quyền nội dung video thuộc về Mercy\n☞ Vui lòng không Reup!\n🔥MERCY – Smart Vision, Smart Life🔥\nHotline: 0898273899\nLiên hệ hợp tác: 0398684921 (Mr.Manh)', 2025, 0, 0, 0, 0, 'Bảo hành mặc định: 15 ngày | BH 3 Tháng: +550k | BH 6 Tháng: +650k | BH 12 Tháng: +900k');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `product_images`
--

CREATE TABLE `product_images` (
  `id` int(11) NOT NULL,
  `product_id` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `image_url` varchar(500) COLLATE utf8mb4_unicode_ci NOT NULL,
  `sort_order` int(11) DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `product_images`
--

INSERT INTO `product_images` (`id`, `product_id`, `image_url`, `sort_order`) VALUES
(114, 'MCK6.0', '/products/MCK6.0-1.jpg', 9),
(115, 'MCK6.0', '/products/MCK6.0-2.jpg', 1),
(116, 'MCK6.0', '/products/MCK6.0-3.jpg', 2),
(117, 'MCK6.0', '/products/MCK6.0-4.jpg', 3),
(118, 'MCK6.0', '/products/MCK6.0-5.jpg', 4),
(119, 'MCK6.0', '/products/MCK6.0-6.jpg', 5),
(120, 'MCK6.0', '/products/MCK6.0-7.jpg', 6),
(121, 'MCK6.0', '/products/MCK6.0-8.jpg', 7),
(122, 'MCK6.0', '/products/MCK6.0-9.jpg', 8),
(123, 'MCK6.0', '/products/MCK6.0-10.jpg', 0),
(124, 'MCK6.0', '/products/MCK6.0-11.jpg', 10),
(125, 'MCK6.0', '/products/MCK6.0-12.jpg', 11),
(126, 'MCK6.0', '/products/MCK6.0-13.jpg', 12),
(127, 'MCK6.0', '/products/MCK6.0-14.jpg', 13),
(128, 'MCK6.0', '/products/MCK6.0-15.jpg', 14),
(129, 'MCK6.0', '/products/MCK6.0-16.jpg', 15),
(130, 'MCK6.0', '/products/MCK6.0-17.jpg', 16),
(131, 'MCK6.0', '/products/MCK6.0-0.jpg', 17),
(132, 'MCK6.0', '/products/MCK6.0-video.mp4', 18),
(133, 'MCK5.0Doi', '/products/MCK5.0Đôi-1.jpg', 0),
(134, 'MCK5.0Doi', '/products/MCK5.0Đôi-2.jpg', 1),
(135, 'MCK5.0Doi', '/products/MCK5.0Đôi-3.jpg', 2),
(136, 'MCK5.0Doi', '/products/MCK5.0Đôi-0.jpg', 3),
(137, 'MCK5.0T', '/products/MCK5.0T-1.jpg', 0),
(138, 'MCK5.0T', '/products/MCK5.0T-2.jpg', 1),
(139, 'MCK5.0T', '/products/MCK5.0T-3.jpg', 2),
(140, 'MCK5.0T', '/products/MCK5.0T-4.jpg', 3),
(141, 'MCK5.0T', '/products/MCK5.0T-5.jpg', 4),
(142, 'MCK5.0T', '/products/MCK5.0T-6.jpg', 5),
(143, 'MCK5.0T', '/products/MCK5.0T-7.jpg', 6),
(144, 'MCK5.0T', '/products/MCK5.0T-0.jpg', 7),
(145, 'MCK5.0D', '/products/MCK5.0D-1.jpg', 0),
(146, 'MCK5.0D', '/products/MCK5.0D-2.jpg', 1),
(147, 'MCK5.0D', '/products/MCK5.0D-3.jpg', 2),
(148, 'MCK5.0D', '/products/MCK5.0D-4.jpg', 3),
(149, 'MCK5.0D', '/products/MCK5.0D-5.jpg', 4),
(150, 'MCK5.0D', '/products/MCK5.0D-6.jpg', 5),
(151, 'MCK5.0D', '/products/MCK5.0D-0.jpg', 6),
(152, 'MCK5.1Doi', '/products/MCK5.1Đôi-1.jpg', 0),
(153, 'MCK5.1Doi', '/products/MCK5.1Đôi-2.jpg', 1),
(154, 'MCK5.1Doi', '/products/MCK5.1Đôi-3.jpg', 2),
(155, 'MCK5.1Doi', '/products/MCK5.1Đôi-0.jpg', 3),
(156, 'MCK5.1T', '/products/MCK5.1T-1.jpg', 0),
(157, 'MCK5.1T', '/products/MCK5.1T-2.jpg', 1),
(158, 'MCK5.1T', '/products/MCK5.1T-3.jpg', 2),
(159, 'MCK5.1T', '/products/MCK5.1T-0.jpg', 3),
(160, 'MCK5.1D', '/products/MCK5.1D-1.jpg', 0),
(161, 'MCK5.1D', '/products/MCK5.1D-2.jpg', 1),
(162, 'MCK5.1D', '/products/MCK5.1D-3.jpg', 2),
(163, 'MCK5.1D', '/products/MCK5.1D-0.jpg', 3),
(164, 'KDT5.0Doi', '/products/KDT5.0Đôi-1.jpg', 0),
(165, 'KDT5.0Doi', '/products/KDT5.0Đôi-2.jpg', 1),
(166, 'KDT5.0Doi', '/products/KDT5.0Đôi-3.jpg', 2),
(167, 'KDT5.0Doi', '/products/KDT5.0Đôi-0.jpg', 3),
(168, 'KDT5.0T', '/products/KDT5.0T-1.jpg', 0),
(169, 'KDT5.0T', '/products/KDT5.0T-2.jpg', 1),
(170, 'KDT5.0T', '/products/KDT5.0T-3.jpg', 2),
(171, 'KDT5.0T', '/products/KDT5.0T-4.jpg', 3),
(172, 'KDT5.0T', '/products/KDT5.0T-5.jpg', 4),
(173, 'KDT5.0T', '/products/KDT5.0T-6.jpg', 5),
(174, 'KDT5.0T', '/products/KDT5.0T-7.jpg', 6),
(175, 'KDT5.0T', '/products/KDT5.0T-8.jpg', 7),
(176, 'KDT5.0T', '/products/KDT5.0T-0.jpg', 8),
(177, 'KDT5.0D', '/products/KDT5.0D-1.jpg', 0),
(178, 'KDT5.0D', '/products/KDT5.0D-2.jpg', 1),
(179, 'KDT5.0D', '/products/KDT5.0D-3.jpg', 2),
(180, 'KDT5.0D', '/products/KDT5.0D-4.jpg', 3),
(181, 'KDT5.0D', '/products/KDT5.0D-5.jpg', 4),
(182, 'KDT5.0D', '/products/KDT5.0D-6.jpg', 5),
(183, 'KDT5.0D', '/products/KDT5.0D-7.jpg', 6),
(184, 'KDT5.0D', '/products/KDT5.0D-8.jpg', 7),
(185, 'KDT5.0D', '/products/KDT5.0D-0.jpg', 8),
(186, 'KDT5.1Doi', '/products/KDT5.1Đôi-1.jpg', 0),
(187, 'KDT5.1Doi', '/products/KDT5.1Đôi-2.jpg', 1),
(188, 'KDT5.1Doi', '/products/KDT5.1Đôi-3.jpg', 2),
(189, 'KDT5.1Doi', '/products/KDT5.1Đôi-0.jpg', 3),
(190, 'KDT5.1T', '/products/KDT5.1T-1.jpg', 0),
(191, 'KDT5.1T', '/products/KDT5.1T-2.jpg', 1),
(192, 'KDT5.1T', '/products/KDT5.1T-3.jpg', 2),
(193, 'KDT5.1T', '/products/KDT5.1T-0.jpg', 3),
(194, 'KDT5.1D', '/products/KDT5.1D-1.jpg', 0),
(195, 'KDT5.1D', '/products/KDT5.1D-2.jpg', 1),
(196, 'KDT5.1D', '/products/KDT5.1D-3.jpg', 2),
(197, 'KDT5.1D', '/products/KDT5.1D-0.jpg', 3),
(198, 'POV5.0Doi', '/products/POV5.0Đôi-1.jpg', 0),
(199, 'POV5.0Doi', '/products/POV5.0Đôi-2.jpg', 1),
(200, 'POV5.0Doi', '/products/POV5.0Đôi-3.jpg', 2),
(201, 'POV5.0Doi', '/products/POV5.0Đôi-0.jpg', 3),
(202, 'POV5.0T', '/products/POV5.0T-1.jpg', 0),
(203, 'POV5.0T', '/products/POV5.0T-2.jpg', 1),
(204, 'POV5.0T', '/products/POV5.0T-3.jpg', 2),
(205, 'POV5.0T', '/products/POV5.0T-0.jpg', 3),
(206, 'POV5.0D', '/products/POV5.0D-1.jpg', 0),
(207, 'POV5.0D', '/products/POV5.0D-2.jpg', 1),
(208, 'POV5.0D', '/products/POV5.0D-3.jpg', 2),
(209, 'POV5.0D', '/products/POV5.0D-0.jpg', 3),
(210, 'POV5.1Doi', '/products/POV5.1Đôi-1.jpg', 0),
(211, 'POV5.1Doi', '/products/POV5.1Đôi-2.jpg', 1),
(212, 'POV5.1Doi', '/products/POV5.1Đôi-3.jpg', 2),
(213, 'POV5.1Doi', '/products/POV5.1Đôi-0.jpg', 3),
(214, 'POV5.1T', '/products/POV5.1T-1.jpg', 0),
(215, 'POV5.1T', '/products/POV5.1T-2.jpg', 1),
(216, 'POV5.1T', '/products/POV5.1T-3.jpg', 2),
(217, 'POV5.1T', '/products/POV5.1T-0.jpg', 3),
(218, 'POV5.1D', '/products/POV5.1D-1.jpg', 0),
(219, 'POV5.1D', '/products/POV5.1D-2.jpg', 1),
(220, 'POV5.1D', '/products/POV5.1D-3.jpg', 2),
(221, 'POV5.1D', '/products/POV5.1D-0.jpg', 3),
(222, 'RBnu-capy', '/products/RBnu-capy-1.jpg', 0),
(223, 'RBnu-capy', '/products/RBnu-capy-2.jpg', 1),
(224, 'RBnu-capy', '/products/RBnu-capy-3.jpg', 2),
(225, 'RBnu-capy', '/products/RBnu-capy-0.jpg', 3),
(226, 'RBnu-gautruc', '/products/RBnu-gautruc-1.jpg', 0),
(227, 'RBnu-gautruc', '/products/RBnu-gautruc-2.jpg', 1),
(228, 'RBnu-gautruc', '/products/RBnu-gautruc-3.jpg', 2),
(229, 'RBnu-gautruc', '/products/RBnu-gautruc-0.jpg', 3),
(230, 'RBnu-Tho', '/products/RBnu-Tho-1.jpg', 0),
(231, 'RBnu-Tho', '/products/RBnu-Tho-2.jpg', 1),
(232, 'RBnu-Tho', '/products/RBnu-Tho-3.jpg', 2),
(233, 'RBnu-Tho', '/products/RBnu-Tho-0.jpg', 3),
(234, 'BD1', '/products/BD1-0.jpg', 0),
(235, 'BD1', '/products/BD1-1.jpg', 1),
(236, 'BD1', '/products/BD1-2.jpg', 2),
(237, 'BD1', '/products/BD1-3.jpg', 3),
(238, 'BD1', '/products/BD1-4.jpg', 4),
(239, 'BD1', '/products/BD1-5.jpg', 5),
(240, 'BD1', '/products/BD1-6.jpg', 6),
(241, 'BD1', '/products/BD1-7.jpg', 7);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `product_reviews`
--

CREATE TABLE `product_reviews` (
  `id` int(11) NOT NULL,
  `product_id` varchar(50) NOT NULL,
  `reviewer_name` varchar(100) NOT NULL,
  `avatar_letter` varchar(5) DEFAULT '',
  `avatar_color` varchar(30) DEFAULT 'bg-red-500',
  `rating` tinyint(4) NOT NULL DEFAULT '5',
  `review_date` varchar(20) NOT NULL,
  `is_verified` tinyint(1) DEFAULT '0',
  `review_text` text NOT NULL,
  `helpful_count` int(11) DEFAULT '0',
  `image_url` varchar(255) DEFAULT '',
  `is_active` tinyint(1) DEFAULT '1',
  `sort_order` int(11) DEFAULT '0',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Đang đổ dữ liệu cho bảng `product_reviews`
--

INSERT INTO `product_reviews` (`id`, `product_id`, `reviewer_name`, `avatar_letter`, `avatar_color`, `rating`, `review_date`, `is_verified`, `review_text`, `helpful_count`, `image_url`, `is_active`, `sort_order`, `created_at`) VALUES
(1, '3', '123', '1', 'bg-red-500', 5, '5/5/2026', 0, 'như căcc', 0, '', 1, 0, '2026-05-05 11:34:22');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `product_specs`
--

CREATE TABLE `product_specs` (
  `id` int(11) NOT NULL,
  `product_id` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `spec_name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `spec_value` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `sort_order` int(11) DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `product_specs`
--

INSERT INTO `product_specs` (`id`, `product_id`, `spec_name`, `spec_value`, `sort_order`) VALUES
(1, 'MCK5.0Doi', 'Camera', '32MP chống rung EIS', 0),
(2, 'MCK5.0Doi', 'Video', '2K POV (lên đến 12 phút)', 1),
(3, 'MCK5.0Doi', 'Pin', '270mAh', 2),
(4, 'MCK5.0Doi', 'Thời lượng', '6–12 giờ liên tục', 3),
(5, 'MCK5.0Doi', 'Chống nước', 'IP65', 4),
(6, 'MCK5.0Doi', 'Màu sắc', 'Black & White (Combo)', 5),
(7, 'MCK5.0T', 'Camera', '32MP chống rung EIS', 0),
(8, 'MCK5.0T', 'Video', '2K POV (lên đến 12 phút)', 1),
(9, 'MCK5.0T', 'Màu sắc', 'Trắng (White)', 2),
(10, 'MCK5.0D', 'Camera', '32MP chống rung EIS', 0),
(11, 'MCK5.0D', 'Video', '2K POV (lên đến 12 phút)', 1),
(12, 'MCK5.0D', 'Màu sắc', 'Đen (Black)', 2),
(13, 'MCK5.1Doi', 'Camera', '32MP chống rung EIS', 0),
(14, 'MCK5.1Doi', 'Tròng kính', 'Đổi màu & Râm (Combo)', 1),
(15, 'MCK5.1T', 'Camera', '32MP chống rung EIS', 0),
(16, 'MCK5.1T', 'Tròng kính', 'Đổi màu (Photochromic)', 1),
(17, 'MCK5.1D', 'Camera', '32MP chống rung EIS', 0),
(18, 'MCK5.1D', 'Màu sắc', 'Đen (Black) - Tròng râm', 1),
(19, 'KDT5.0Doi', 'Camera', '32MP chống rung EIS', 0),
(20, 'KDT5.0Doi', 'Dịch thuật', 'Realtime 0,5s', 1),
(21, 'KDT5.0Doi', 'Màu sắc', 'Black & White (Combo)', 2),
(22, 'KDT5.0T', 'Camera', '32MP chống rung EIS', 0),
(23, 'KDT5.0T', 'Dịch thuật', 'Realtime 0,5s', 1),
(24, 'KDT5.0T', 'Màu sắc', 'Trắng (White)', 2),
(25, 'KDT5.0D', 'Camera', '32MP chống rung EIS', 0),
(26, 'KDT5.0D', 'Dịch thuật', 'Realtime 0,5s', 1),
(27, 'KDT5.0D', 'Màu sắc', 'Đen (Black)', 2),
(28, 'KDT5.1Doi', 'Camera', '32MP chống rung EIS', 0),
(29, 'KDT5.1Doi', 'Tròng kính', 'Đổi màu & Râm (Combo)', 1),
(30, 'KDT5.1T', 'Camera', '32MP chống rung EIS', 0),
(31, 'KDT5.1T', 'Tròng kính', 'Đổi màu (Photochromic)', 1),
(32, 'KDT5.1D', 'Camera', '32MP chống rung EIS', 0),
(33, 'KDT5.1D', 'Màu sắc', 'Đen (Black) - Tròng râm', 1),
(34, 'POV5.0Doi', 'Camera', '32MP chống rung EIS', 0),
(35, 'POV5.0Doi', 'Video', '2K POV (12 phút)', 1),
(36, 'POV5.0Doi', 'Màu sắc', 'Black & White (Combo)', 2),
(37, 'POV5.0T', 'Camera', '32MP chống rung EIS', 0),
(38, 'POV5.0T', 'Màu sắc', 'Trắng (White)', 1),
(39, 'POV5.0D', 'Camera', '32MP chống rung EIS', 0),
(40, 'POV5.0D', 'Màu sắc', 'Đen (Black)', 1),
(41, 'POV5.1Doi', 'Camera', '32MP chống rung EIS', 0),
(42, 'POV5.1Doi', 'Tròng kính', 'Đổi màu & Râm (Combo)', 1),
(43, 'POV5.1T', 'Camera', '32MP chống rung EIS', 0),
(44, 'POV5.1T', 'Tròng kính', 'Đổi màu (Photochromic)', 1),
(45, 'POV5.1D', 'Camera', '32MP chống rung EIS', 0),
(46, 'POV5.1D', 'Tròng kính', 'Râm chống UV', 1),
(47, 'BD1', 'Chất liệu', 'Da nhân tạo cao cấp', 0),
(48, 'BD1', 'Trọng lượng', '~20g', 1),
(49, 'RBnu-capy', 'Nhân vật', 'Capybara', 0),
(50, 'RBnu-capy', 'Kích thước', 'Cao 15,5 cm', 1),
(51, 'RBnu-capy', 'Ngôn ngữ', '40+ ngôn ngữ', 2),
(52, 'RBnu-gautruc', 'Nhân vật', 'Gấu Trúc (Panda)', 0),
(53, 'RBnu-gautruc', 'Kích thước', 'Cao 15,5 cm', 1),
(54, 'RBnu-gautruc', 'Ngôn ngữ', '40+ ngôn ngữ', 2),
(55, 'RBnu-Tho', 'Nhân vật', 'Thỏ Hồng (Bunny)', 0),
(56, 'RBnu-Tho', 'Kích thước', 'Cao 15,5 cm', 1),
(57, 'RBnu-Tho', 'Ngôn ngữ', '40+ ngôn ngữ', 2),
(61, 'MCK6.0', 'Camera', '32MP chống rung EIS', 1),
(62, 'MCK6.0', 'Video', '2K POV (lên đến 12 phút)', 2),
(63, 'MCK6.0', 'Pin kính', '270mAh', 3),
(64, 'MCK6.0', 'Dock sạc', 'Dung lượng lớn, duy trì 7 ngày', 4),
(65, 'MCK6.0', 'Thời lượng', '6–12 giờ liên tục', 5),
(66, 'MCK6.0', 'Chống nước', 'IP65', 6),
(67, 'MCK6.0', 'Loa', '3D định hướng', 7),
(68, 'MCK6.0', 'Micro', 'Kép khử ồn AI', 8),
(69, 'MCK6.0', 'Trọng lượng', '35g', 9),
(70, 'MCK6.0', 'Chất liệu', 'ABS chống trầy xước', 10),
(71, 'MCK6.0', 'Thương hiệu', 'Mercy', 11);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `product_variants`
--

CREATE TABLE `product_variants` (
  `id` int(11) NOT NULL,
  `product_id` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `variant_name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `is_active` tinyint(1) DEFAULT '1'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `settings`
--

CREATE TABLE `settings` (
  `id` int(11) NOT NULL,
  `key` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `value` text COLLATE utf8mb4_unicode_ci,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `settings`
--

INSERT INTO `settings` (`id`, `key`, `value`, `updated_at`) VALUES
(1, 'siteName', 'Ối dồi ôi Ối dồi ôiỐi dồi ôiỐi dồi ôiỐi dồi ôiỐi dồi ôiỐi dồi ôiỐi dồi ôiỐi dồi ôiỐi dồi ôiỐi dồi ôiỐi dồi ôiỐi dồi ôiỐi dồi ôiỐi dồi ôiỐi dồi ôiỐi dồi ôi Ối dồi ôiỐi dồi ôiỐi dồi ôiỐi dồi ôiỐi dồi ôiỐi dồi ôiỐi dồi ôiỐi dồi ôiỐi dồi ôiỐi dồi ôiỐi dồi ôiỐi dồi ôiỐi dồi ôiỐi dồi ôiỐi dồi ôiỐi dồi ôi Ối dồi ôiỐi dồi ôiỐi dồi ôiỐi dồi ôiỐi dồi ôiỐi dồi ôiỐi dồi ôiỐi dồi ôiỐi dồi ôiỐi dồi ôiỐi dồi ôiỐi dồi ôiỐi dồi ôiỐi dồi ôiỐi dồi ôiỐi dồi ôi Ối dồi ôiỐi dồi ôiỐi dồi ôiỐi dồi ôiỐi dồi ôiỐi dồi ôiỐi dồi ôiỐi dồi ôiỐi dồi ôiỐi dồi ôiỐi dồi ôiỐi dồi ôiỐi dồi ôiỐi dồi ôiỐi dồi ôiỐi dồi ôi Ối dồi ôiỐi dồi ôiỐi dồi ôiỐi dồi ôiỐi dồi ôiỐi dồi ôiỐi dồi ôiỐi dồi ôiỐi dồi ôiỐi dồi ôiỐi dồi ôiỐi dồi ôiỐi dồi ôiỐi dồi ôiỐi dồi ôiỐi dồi ôi Ối dồi ôiỐi dồi ôiỐi dồi ôiỐi dồi ôiỐi dồi ôiỐi dồi ôiỐi dồi ôiỐi dồi ôiỐi dồi ôiỐi dồi ôiỐi dồi ôiỐi dồi ôiỐi dồi ôiỐi dồi ôiỐi dồi ôiỐi dồi ôi Ối dồi ôiỐi dồi ôiỐi dồi ôiỐi dồi ôiỐi dồi ôiỐi dồi ôiỐi dồi ôiỐi dồi ôiỐi dồi ôiỐi dồi ôiỐi dồi ôiỐi dồi ôiỐi dồi ôiỐi dồi ôiỐi dồi ôiỐi dồi ôi Ối dồi ôiỐi dồi ôiỐi dồi ôiỐi dồi ôiỐi dồi ôiỐi dồi ôiỐi dồi ôiỐi dồi ôiỐi dồi ôiỐi dồi ôiỐi dồi ôiỐi dồi ôiỐi dồi ôiỐi dồi ôiỐi dồi ôiỐi dồi ôi Ối dồi ôiỐi dồi ôiỐi dồi ôiỐi dồi ôiỐi dồi ôiỐi dồi ôiỐi dồi ôiỐi dồi ôiỐi dồi ôiỐi dồi ôiỐi dồi ôiỐi dồi ôiỐi dồi ôiỐi dồi ôiỐi dồi ôiỐi dồi ôi Ối dồi ôiỐi dồi ôiỐi dồi ôiỐi dồi ôiỐi dồi ôiỐi dồi ôiỐi dồi ôiỐi dồi ôiỐi dồi ôiỐi dồi ôiỐi dồi ôiỐi dồi ôiỐi dồi ôiỐi dồi ôiỐi dồi ôiỐi dồi ôi Ối dồi ôiỐi dồi ôiỐi dồi ôiỐi dồi ôiỐi dồi ôiỐi dồi ôiỐi dồi ôiỐi dồi ôiỐi dồi ôiỐi dồi ôiỐi dồi ôiỐi dồi ôiỐi dồi ôiỐi dồi ôiỐi dồi ôiỐi dồi ôi Ối dồi ôiỐi dồi ôiỐi dồi ôiỐi dồi ôiỐi dồi ôiỐi dồi ôiỐi dồi ôiỐi dồi ôiỐi dồi ôiỐi dồi ôiỐi dồi ôiỐi dồi ôiỐi dồi ôiỐi dồi ôiỐi dồi ôiỐi dồi ôi Ối dồi ôiỐi dồi ôiỐi dồi ôiỐi dồi ôiỐi dồi ôiỐi dồi ôiỐi dồi ôiỐi dồi ôiỐi dồi ôiỐi dồi ôiỐi dồi ôiỐi dồi ôiỐi dồi ôiỐi dồi ôiỐi dồi ôiỐi dồi ôi Ối dồi ôiỐi dồi ôiỐi dồi ôiỐi dồi ôiỐi dồi ôiỐi dồi ôiỐi dồi ôiỐi dồi ôiỐi dồi ôiỐi dồi ôiỐi dồi ôiỐi dồi ôiỐi dồi ôiỐi dồi ôiỐi dồi ôiỐi dồi ôi Ối dồi ôiỐi dồi ôiỐi dồi ôiỐi dồi ôiỐi dồi ôiỐi dồi ôiỐi dồi ôiỐi dồi ôiỐi dồi ôiỐi dồi ôiỐi dồi ôiỐi dồi ôiỐi dồi ôiỐi dồi ôiỐi dồi ôiỐi dồi ôi Ối dồi ôiỐi dồi ôiỐi dồi ôiỐi dồi ôiỐi dồi ôiỐi dồi ôiỐi dồi ôiỐi dồi ôiỐi dồi ôiỐi dồi ôiỐi dồi ôiỐi dồi ôiỐi dồi ôiỐi dồi ôiỐi dồi ôiỐi dồi ôi Ối dồi ôiỐi dồi ôiỐi dồi ôiỐi dồi ôiỐi dồi ôiỐi dồi ôiỐi dồi ôiỐi dồi ôiỐi dồi ôiỐi dồi ôiỐi dồi ôiỐi dồi ôiỐi dồi ôiỐi dồi ôiỐi dồi ôiỐi dồi ôi Ối dồi ôiỐi dồi ôiỐi dồi ôiỐi dồi ôiỐi dồi ôiỐi dồi ôiỐi dồi ôiỐi dồi ôiỐi dồi ôiỐi dồi ôiỐi dồi ôiỐi dồi ôiỐi dồi ôiỐi dồi ôiỐi dồi ôiỐi dồi ôi Ối dồi ôiỐi dồi ôiỐi dồi ôiỐi dồi ôiỐi dồi ôiỐi dồi ôiỐi dồi ôiỐi dồi ôiỐi dồi ôiỐi dồi ôiỐi dồi ôiỐi dồi ôiỐi dồi ôiỐi dồi ôiỐi dồi ôiỐi dồi ôi Ối dồi ôiỐi dồi ôiỐi dồi ôiỐi dồi ôiỐi dồi ôiỐi dồi ôiỐi dồi ôiỐi dồi ôiỐi dồi ôiỐi dồi ôiỐi dồi ôiỐi dồi ôiỐi dồi ôiỐi dồi ôiỐi dồi ôiỐi dồi ôi Ối dồi ôiỐi dồi ôiỐi dồi ôiỐi dồi ôiỐi dồi ôiỐi dồi ôiỐi dồi ôiỐi dồi ôiỐi dồi ôiỐi dồi ôiỐi dồi ôiỐi dồi ôiỐi dồi ôiỐi dồi ôiỐi dồi ôiỐi dồi ôi Ối dồi ôiỐi dồi ôiỐi dồi ôiỐi dồi ôiỐi dồi ôiỐi dồi ôiỐi dồi ôiỐi dồi ôiỐi dồi ôiỐi dồi ôiỐi dồi ôiỐi dồi ôiỐi dồi ôiỐi dồi ôiỐi dồi ôiỐi dồi ôi Ối dồi ôiỐi dồi ôiỐi dồi ôiỐi dồi ôiỐi dồi ôiỐi dồi ôiỐi dồi ôiỐi dồi ôiỐi dồi ôiỐi dồi ôiỐi dồi ôiỐi dồi ôiỐi dồi ôiỐi dồi ôiỐi dồi ôiỐi dồi ôi Ối dồi ôiỐi dồi ôiỐi dồi ôiỐi dồi ôiỐi dồi ôiỐi dồi ôiỐi dồi ôiỐi dồi ôiỐi dồi ôiỐi dồi ôiỐi dồi ôiỐi dồi ôiỐi dồi ôiỐi dồi ôiỐi dồi ôi', '2026-05-04 17:12:55'),
(2, 'siteUrl', 'https://kinhthongminhmercy.vn', '2026-05-04 17:12:55'),
(3, 'hotline', '0898 273 899', '2026-05-04 17:12:55'),
(4, 'zaloUrl', 'chịu chịu', '2026-05-04 17:12:55'),
(5, 'addressHCM', '36 đường số 5 KĐT Vạn Phúc, Thủ Đức, HCM', '2026-05-04 17:12:55'),
(6, 'addressHN', 'S1.06 Vinsmart City, Nam Từ Liêm, Hà Nội', '2026-05-04 17:12:55');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `username` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password_hash` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `full_name` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT '',
  `phone` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT '',
  `address` text COLLATE utf8mb4_unicode_ci,
  `avatar` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `role` enum('customer','admin') COLLATE utf8mb4_unicode_ci DEFAULT 'customer',
  `is_active` tinyint(1) DEFAULT '1',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `last_login_at` timestamp NULL DEFAULT NULL,
  `register_ip` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `user_agent` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `users`
--

INSERT INTO `users` (`id`, `username`, `email`, `password_hash`, `full_name`, `phone`, `address`, `avatar`, `role`, `is_active`, `created_at`, `updated_at`, `last_login_at`, `register_ip`, `user_agent`) VALUES
(1, 'admin', 'admin@mercytech.vn', '$2b$10$j0O4RPC/povEGSmaTUSbg.sySzNFe7lym1OnWM0wQT4AumrcG27Ga', 'Admin Mercy', '', '', '/avatars/avatar-1-1778327679627.webp', 'admin', 1, '2026-04-06 09:43:23', '2026-05-16 13:16:45', '2026-05-16 13:16:46', NULL, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36');
INSERT INTO `users` (`id`, `username`, `email`, `password_hash`, `full_name`, `phone`, `address`, `avatar`, `role`, `is_active`, `created_at`, `updated_at`, `last_login_at`, `register_ip`, `user_agent`) VALUES
(7, 'tai_khoan_thu1_1777574094111', 'tai_khoan_thu1@gmail.com', '$2b$10$U.4x2CTXZEa8.75DCkqTUeiy8SGKYTJg0.E7/Kx/H/AcDtVJyvfMa', 'tai_khoan_thu1', '', 'tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1tai_khoan_thu1', '', 'customer', 1, '2026-04-30 18:34:54', '2026-05-03 14:24:31', '2026-05-03 14:24:32', NULL, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36');
INSERT INTO `users` (`id`, `username`, `email`, `password_hash`, `full_name`, `phone`, `address`, `avatar`, `role`, `is_active`, `created_at`, `updated_at`, `last_login_at`, `register_ip`, `user_agent`) VALUES
(18784, 'mercyglobalstore_1777732041383', 'mercyglobalstore@gmail.com', '$2b$10$jXlrMTNmOm/NWzGGVB8IfOXydN8ujXB2TX3MGD2lCvGMvbjFNGt5G', ' Mạnh', '0398684921', 'S1.06 Vinsmart City, Tây Mỗ, Nam Từ Liêm, Hà Nội', '', 'customer', 1, '2026-05-02 14:27:21', '2026-05-02 14:33:07', '2026-05-02 14:33:07', '14.162.155.59', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `warranty_options`
--

CREATE TABLE `warranty_options` (
  `id` int(11) NOT NULL,
  `name` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `price` bigint(20) NOT NULL DEFAULT '0',
  `sort_order` int(11) DEFAULT '0',
  `is_active` tinyint(1) DEFAULT '1'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `warranty_options`
--

INSERT INTO `warranty_options` (`id`, `name`, `price`, `sort_order`, `is_active`) VALUES
(1, '15 ng├áy', 0, 1, 1),
(2, '3 Th├íng', 550000, 2, 1),
(3, '6 Th├íng', 650000, 3, 1),
(4, '12 Th├íng', 900000, 4, 1);

--
-- Chỉ mục cho các bảng đã đổ
--

--
-- Chỉ mục cho bảng `cart`
--
ALTER TABLE `cart`
  ADD PRIMARY KEY (`id`),
  ADD KEY `warranty_id` (`warranty_id`),
  ADD KEY `idx_session` (`session_id`),
  ADD KEY `idx_user` (`user_id`);

--
-- Chỉ mục cho bảng `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `slug` (`slug`),
  ADD KEY `parent_id` (`parent_id`),
  ADD KEY `idx_slug` (`slug`);

--
-- Chỉ mục cho bảng `contact_requests`
--
ALTER TABLE `contact_requests`
  ADD PRIMARY KEY (`id`);

--
-- Chỉ mục cho bảng `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `order_code` (`order_code`),
  ADD KEY `idx_order_code` (`order_code`),
  ADD KEY `idx_user` (`user_id`),
  ADD KEY `idx_status` (`status`);

--
-- Chỉ mục cho bảng `order_items`
--
ALTER TABLE `order_items`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_order` (`order_id`);

--
-- Chỉ mục cho bảng `payment_methods`
--
ALTER TABLE `payment_methods`
  ADD PRIMARY KEY (`id`);

--
-- Chỉ mục cho bảng `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `product_id` (`product_id`),
  ADD KEY `idx_product_id` (`product_id`),
  ADD KEY `idx_category` (`category_id`),
  ADD KEY `idx_flash_sale` (`is_flash_sale`),
  ADD KEY `idx_price` (`price`);

--
-- Chỉ mục cho bảng `product_images`
--
ALTER TABLE `product_images`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_product` (`product_id`);

--
-- Chỉ mục cho bảng `product_reviews`
--
ALTER TABLE `product_reviews`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_product_id` (`product_id`);

--
-- Chỉ mục cho bảng `product_specs`
--
ALTER TABLE `product_specs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_product` (`product_id`);

--
-- Chỉ mục cho bảng `product_variants`
--
ALTER TABLE `product_variants`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_product` (`product_id`);

--
-- Chỉ mục cho bảng `settings`
--
ALTER TABLE `settings`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `settings_key_key` (`key`),
  ADD KEY `idx_key` (`key`);

--
-- Chỉ mục cho bảng `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`),
  ADD UNIQUE KEY `email` (`email`),
  ADD KEY `idx_email` (`email`),
  ADD KEY `idx_username` (`username`);

--
-- Chỉ mục cho bảng `warranty_options`
--
ALTER TABLE `warranty_options`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT cho các bảng đã đổ
--

--
-- AUTO_INCREMENT cho bảng `cart`
--
ALTER TABLE `cart`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `categories`
--
ALTER TABLE `categories`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT cho bảng `contact_requests`
--
ALTER TABLE `contact_requests`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT cho bảng `orders`
--
ALTER TABLE `orders`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT cho bảng `order_items`
--
ALTER TABLE `order_items`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT cho bảng `payment_methods`
--
ALTER TABLE `payment_methods`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT cho bảng `products`
--
ALTER TABLE `products`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=25;

--
-- AUTO_INCREMENT cho bảng `product_images`
--
ALTER TABLE `product_images`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=242;

--
-- AUTO_INCREMENT cho bảng `product_reviews`
--
ALTER TABLE `product_reviews`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT cho bảng `product_specs`
--
ALTER TABLE `product_specs`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=72;

--
-- AUTO_INCREMENT cho bảng `product_variants`
--
ALTER TABLE `product_variants`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `settings`
--
ALTER TABLE `settings`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT cho bảng `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18785;

--
-- AUTO_INCREMENT cho bảng `warranty_options`
--
ALTER TABLE `warranty_options`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- Ràng buộc đối với các bảng kết xuất
--

--
-- Ràng buộc cho bảng `cart`
--
ALTER TABLE `cart`
  ADD CONSTRAINT `cart_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `cart_ibfk_2` FOREIGN KEY (`warranty_id`) REFERENCES `warranty_options` (`id`) ON DELETE SET NULL;

--
-- Ràng buộc cho bảng `categories`
--
ALTER TABLE `categories`
  ADD CONSTRAINT `categories_ibfk_1` FOREIGN KEY (`parent_id`) REFERENCES `categories` (`id`) ON DELETE SET NULL;

--
-- Ràng buộc cho bảng `orders`
--
ALTER TABLE `orders`
  ADD CONSTRAINT `orders_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL;

--
-- Ràng buộc cho bảng `order_items`
--
ALTER TABLE `order_items`
  ADD CONSTRAINT `order_items_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE;

--
-- Ràng buộc cho bảng `products`
--
ALTER TABLE `products`
  ADD CONSTRAINT `products_ibfk_1` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE SET NULL;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
