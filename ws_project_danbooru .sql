-- phpMyAdmin SQL Dump
-- version 5.1.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jun 21, 2023 at 09:03 AM
-- Server version: 10.4.22-MariaDB
-- PHP Version: 8.1.2

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `ws_project_danbooru`
--
CREATE DATABASE IF NOT EXISTS `ws_project_danbooru` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE `ws_project_danbooru`;

-- --------------------------------------------------------

--
-- Table structure for table `favorite`
--

DROP TABLE IF EXISTS `favorite`;
CREATE TABLE IF NOT EXISTS `favorite` (
  `id_fav` int(255) NOT NULL AUTO_INCREMENT,
  `us_username` varchar(255) NOT NULL,
  `id_picture` varchar(255) NOT NULL,
  PRIMARY KEY (`id_fav`),
  KEY `fk_username` (`us_username`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `favorite`
--

INSERT INTO `favorite` (`id_fav`, `us_username`, `id_picture`) VALUES
(1, 'user0', '6420033');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
CREATE TABLE IF NOT EXISTS `users` (
  `us_username` varchar(255) NOT NULL,
  `us_password` varchar(255) NOT NULL,
  `us_kuota` int(255) NOT NULL,
  PRIMARY KEY (`us_username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`us_username`, `us_password`, `us_kuota`) VALUES
('user0', '12345', 10),
('user1', '12345', 10);

--
-- Constraints for dumped tables
--

--
-- Constraints for table `favorite`
--
ALTER TABLE `favorite`
  ADD CONSTRAINT `fk_username` FOREIGN KEY (`us_username`) REFERENCES `users` (`us_username`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
