-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Oct 12, 2025 at 07:48 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `tourism_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `cache`
--

CREATE TABLE `cache` (
  `key` varchar(255) NOT NULL,
  `value` mediumtext NOT NULL,
  `expiration` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `cache`
--

INSERT INTO `cache` (`key`, `value`, `expiration`) VALUES
('laravel_cache_staff@example.co|127.0.0.1', 'i:1;', 1758810002),
('laravel_cache_staff@example.co|127.0.0.1:timer', 'i:1758810002;', 1758810002);

-- --------------------------------------------------------

--
-- Table structure for table `cache_locks`
--

CREATE TABLE `cache_locks` (
  `key` varchar(255) NOT NULL,
  `owner` varchar(255) NOT NULL,
  `expiration` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `destinations`
--

CREATE TABLE `destinations` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `category` enum('marine','nature','cultural','adventure') NOT NULL,
  `location` varchar(255) NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `rating` double DEFAULT NULL,
  `bookings` int(11) NOT NULL DEFAULT 0,
  `status` enum('active','inactive','draft') NOT NULL DEFAULT 'active',
  `image` varchar(255) NOT NULL,
  `description` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `destinations`
--

INSERT INTO `destinations` (`id`, `name`, `category`, `location`, `price`, `rating`, `bookings`, `status`, `image`, `description`, `created_at`, `updated_at`) VALUES
(1, 'Whale Shark Interaction Experience', 'marine', 'Donsol, Sorsogon', 1500.00, NULL, 0, 'active', 'destinations/JSmOrRSErGJWc85Jxb6EUuQMyIDUZrLNEhGMzSID.jpg', 'Swim alongside gentle giants in crystal clear waters with certified guides', '2025-09-26 06:44:22', '2025-10-12 08:57:12'),
(2, 'Firefly River Cruise', 'nature', 'Donsol, Sorsogon', 5000.00, NULL, 0, 'active', 'destinations/0kWPpDcOBFJRZTYM9mRec5wzZAGgtz8NS3pc7eH8.jpg', 'Magical evening cruise to witness thousands of fireflies illuminate the mangroves', '2025-09-26 06:49:24', '2025-10-12 08:58:05'),
(3, 'Island Hopping Adventure', 'marine', 'Donsol, Sorsogon', 2200.00, NULL, 0, 'active', 'destinations/mw9fmynoQGgEgxCIopkqK2cbks03gXetGtt5vPLW.jpg', 'Explore multiple pristine islands with hidden lagoons and white sand beaches', '2025-09-26 06:55:41', '2025-10-12 08:59:29'),
(4, 'Cultural Village Tour', 'cultural', 'Donsol, Sorsogon', 600.00, NULL, 0, 'active', 'destinations/3tCpy0qLZaWPPyHSLnQnL2Hf2kFasTxZEr7pXJh9.jpg', 'Immerse yourself in local culture and traditional crafts of Sorsogon', '2025-09-26 06:55:49', '2025-10-12 09:00:05'),
(5, 'Mangrove Kayaking', 'marine', 'Donsol, Sorsogon', 1500.00, NULL, 0, 'active', 'destinations/xtfPeDLYwqi3OYN8eyo18P4nQBrQe6Z2iBqx3OHU.jpg', 'Paddle through scenic mangrove forests and discover unique ecosystem', '2025-09-26 06:57:10', '2025-10-12 09:00:54'),
(6, 'Sunset Beach Relaxation', 'adventure', 'Donsol, Sorsogon', 500.00, NULL, 0, 'active', 'destinations/FiEhbvhe2cHRUeL5ADJaJj6xn0JltG2AHUPSKK1v.jpg', 'Unwind on pristine beaches with stunning sunset views and tropical drinks', '2025-09-26 07:00:32', '2025-10-12 09:01:38'),
(7, 'Whale Shark Interaction', 'marine', 'Donsol, Sorsogon', 4000.00, NULL, 0, 'active', 'destinations/GK1E0xH59kTq2g1fB8YbqvVwApWBFWAD1tRpYQCr.jpg', 'Donsol’s most famous attraction where visitors can swim with gentle whale sharks (season: November to June).', '2025-09-27 17:51:12', '2025-10-12 09:13:59'),
(12, 'unwind', 'nature', 'donsol', 5000.00, NULL, 0, 'active', 'destinations/ewqdfwV5IZt8hcdkJA5xxoi1nuCseKPJTz9Pdf0O.jpg', 'i want freedom', '2025-10-07 04:43:40', '2025-10-12 09:15:16'),
(14, 'Donsol River Firefly Watching', 'cultural', 'Donsol', 1000.00, NULL, 0, 'active', 'destinations/4HYrXpCmG7oi1OC0jqoQhsvevkR4WbNKPZbmM8v3.jpg', 'Evening boat tour along the Ogod River to see magical fireflies glowing among mangrove trees.', '2025-10-12 09:21:22', '2025-10-12 09:21:22');

-- --------------------------------------------------------

--
-- Table structure for table `failed_jobs`
--

CREATE TABLE `failed_jobs` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `uuid` varchar(255) NOT NULL,
  `connection` text NOT NULL,
  `queue` text NOT NULL,
  `payload` longtext NOT NULL,
  `exception` longtext NOT NULL,
  `failed_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `jobs`
--

CREATE TABLE `jobs` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `queue` varchar(255) NOT NULL,
  `payload` longtext NOT NULL,
  `attempts` tinyint(3) UNSIGNED NOT NULL,
  `reserved_at` int(10) UNSIGNED DEFAULT NULL,
  `available_at` int(10) UNSIGNED NOT NULL,
  `created_at` int(10) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `job_batches`
--

CREATE TABLE `job_batches` (
  `id` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `total_jobs` int(11) NOT NULL,
  `pending_jobs` int(11) NOT NULL,
  `failed_jobs` int(11) NOT NULL,
  `failed_job_ids` longtext NOT NULL,
  `options` mediumtext DEFAULT NULL,
  `cancelled_at` int(11) DEFAULT NULL,
  `created_at` int(11) NOT NULL,
  `finished_at` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `migrations`
--

CREATE TABLE `migrations` (
  `id` int(10) UNSIGNED NOT NULL,
  `migration` varchar(255) NOT NULL,
  `batch` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `migrations`
--

INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES
(1, '0001_01_01_000000_create_users_table', 1),
(2, '0001_01_01_000001_create_cache_table', 1),
(3, '0001_01_01_000002_create_jobs_table', 1),
(4, '2025_08_26_100418_add_two_factor_columns_to_users_table', 1),
(5, '2025_09_26_140202_create_destinations_table', 2);

-- --------------------------------------------------------

--
-- Table structure for table `password_reset_tokens`
--

CREATE TABLE `password_reset_tokens` (
  `email` varchar(255) NOT NULL,
  `token` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `sessions`
--

CREATE TABLE `sessions` (
  `id` varchar(255) NOT NULL,
  `user_id` bigint(20) UNSIGNED DEFAULT NULL,
  `ip_address` varchar(45) DEFAULT NULL,
  `user_agent` text DEFAULT NULL,
  `payload` longtext NOT NULL,
  `last_activity` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `sessions`
--

INSERT INTO `sessions` (`id`, `user_id`, `ip_address`, `user_agent`, `payload`, `last_activity`) VALUES
('GmaO56S8jKX3Vg4jRBfqgI42V3iACg2EqglxCGjE', 5, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36', 'YTo0OntzOjY6Il90b2tlbiI7czo0MDoiN0lBbzY5UldXSEZKNGd6OXB2VUF2R0R0azJrUk9FQ1g1aTRFblFzUyI7czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319czo1MDoibG9naW5fd2ViXzU5YmEzNmFkZGMyYjJmOTQwMTU4MGYwMTRjN2Y1OGVhNGUzMDk4OWQiO2k6NTtzOjk6Il9wcmV2aW91cyI7YToxOntzOjM6InVybCI7czozOToiaHR0cDovL2xvY2FsaG9zdDo4MDAwL3RvdXJpc3QvZGFzaGJvYXJkIjt9fQ==', 1760290682);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `email_verified_at` timestamp NULL DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `two_factor_secret` text DEFAULT NULL,
  `two_factor_recovery_codes` text DEFAULT NULL,
  `two_factor_confirmed_at` timestamp NULL DEFAULT NULL,
  `role` enum('admin','staff','tourist') NOT NULL DEFAULT 'tourist',
  `remember_token` varchar(100) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `email_verified_at`, `password`, `two_factor_secret`, `two_factor_recovery_codes`, `two_factor_confirmed_at`, `role`, `remember_token`, `created_at`, `updated_at`) VALUES
(1, 'Admin User', 'admin@example.com', NULL, '$2y$12$2n0Ghidm2BQ0qkpMNCqUAO6gmCuUpxAk5vAO4I8LO8cN44p6IOgqO', NULL, NULL, NULL, 'admin', NULL, '2025-09-25 03:30:17', '2025-09-25 03:30:17'),
(2, 'Staff User', 'staff@example.com', NULL, '$2y$12$2n0Ghidm2BQ0qkpMNCqUAO6gmCuUpxAk5vAO4I8LO8cN44p6IOgqO', NULL, NULL, NULL, 'staff', 'WhGUtyMurAUAIs9qvrUBftyYkVvTtJ9DdpvVfemFJhBqcFPzTDdZhD7IYmXt', '2025-09-25 03:30:17', '2025-09-25 03:30:17'),
(3, 'Tourist User', 'tourist@example.com', NULL, '$2y$12$dSxt7UNbu0AGW7981Drg/OESypU66zIvydFKCbIOJdNl0286zKkL2', NULL, NULL, NULL, 'tourist', NULL, '2025-09-25 03:30:17', '2025-09-25 03:30:17'),
(4, 'Andy', 'andylazarte@gmail.com', NULL, '$2y$12$VKImPybgPC6cD/Rdm6Yb/ekFYECz6Y6GWZ/UHR4Omn4clZ6kF9ANq', NULL, NULL, NULL, 'tourist', NULL, '2025-09-25 03:31:42', '2025-09-25 03:31:42'),
(5, 'Andy', 'andylzarte@gmail.com', NULL, '$2y$12$2n0Ghidm2BQ0qkpMNCqUAO6gmCuUpxAk5vAO4I8LO8cN44p6IOgqO', NULL, NULL, NULL, 'tourist', NULL, '2025-09-25 05:01:30', '2025-09-25 05:01:30'),
(6, 'Apple', 'apple@gmail.com', NULL, '$2y$12$f3lPlBKSw/rs.b7xTV5evuIVZZahgBpgGjbsRcgRDhzq24MV7in2u', NULL, NULL, NULL, 'tourist', NULL, '2025-09-25 06:09:48', '2025-09-25 06:09:48'),
(7, 'test', 'test@gmail.com', NULL, '$2y$12$mXX8kACDOYbJxcRcquUejeWPGYarWLbeJ9xE.FR9ERgvBsFU1W/2W', NULL, NULL, NULL, 'tourist', NULL, '2025-09-25 08:23:44', '2025-09-25 08:23:44');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `cache`
--
ALTER TABLE `cache`
  ADD PRIMARY KEY (`key`);

--
-- Indexes for table `cache_locks`
--
ALTER TABLE `cache_locks`
  ADD PRIMARY KEY (`key`);

--
-- Indexes for table `destinations`
--
ALTER TABLE `destinations`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `failed_jobs`
--
ALTER TABLE `failed_jobs`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `failed_jobs_uuid_unique` (`uuid`);

--
-- Indexes for table `jobs`
--
ALTER TABLE `jobs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `jobs_queue_index` (`queue`);

--
-- Indexes for table `job_batches`
--
ALTER TABLE `job_batches`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `migrations`
--
ALTER TABLE `migrations`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `password_reset_tokens`
--
ALTER TABLE `password_reset_tokens`
  ADD PRIMARY KEY (`email`);

--
-- Indexes for table `sessions`
--
ALTER TABLE `sessions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `sessions_user_id_index` (`user_id`),
  ADD KEY `sessions_last_activity_index` (`last_activity`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `users_email_unique` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `destinations`
--
ALTER TABLE `destinations`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT for table `failed_jobs`
--
ALTER TABLE `failed_jobs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `jobs`
--
ALTER TABLE `jobs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `migrations`
--
ALTER TABLE `migrations`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
