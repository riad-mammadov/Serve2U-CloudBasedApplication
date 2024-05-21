CREATE DATABASE  IF NOT EXISTS `serve2u` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `serve2u`;
-- MySQL dump 10.13  Distrib 8.0.36, for macos14 (x86_64)
--
-- Host: localhost    Database: serve2u
-- ------------------------------------------------------
-- Server version	8.3.0

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `discount_codes`
--

DROP TABLE IF EXISTS `discount_codes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `discount_codes` (
  `id` int NOT NULL AUTO_INCREMENT,
  `code` varchar(255) NOT NULL,
  `discount_percent` decimal(5,2) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `code` (`code`)
) ENGINE=InnoDB AUTO_INCREMENT=39 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `discount_codes`
--

LOCK TABLES `discount_codes` WRITE;
/*!40000 ALTER TABLE `discount_codes` DISABLE KEYS */;
INSERT INTO `discount_codes` VALUES (37,'test',20.00,'2024-05-07 01:06:03'),(38,'test1',25.00,'2024-05-07 02:22:37');
/*!40000 ALTER TABLE `discount_codes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `order_history`
--

DROP TABLE IF EXISTS `order_history`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `order_history` (
  `order_id` int NOT NULL,
  `total` decimal(10,2) DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `username` varchar(255) DEFAULT NULL,
  `seat` int DEFAULT NULL,
  `stadium` varchar(255) DEFAULT NULL,
  `seat_row` int DEFAULT NULL,
  `seat_number` int DEFAULT NULL,
  `order_notes` text,
  PRIMARY KEY (`order_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `order_history`
--

LOCK TABLES `order_history` WRITE;
/*!40000 ALTER TABLE `order_history` DISABLE KEYS */;
INSERT INTO `order_history` VALUES (106,1400.00,'2024-05-07 03:22:07','riad2',32,'etihad',NULL,NULL,NULL),(107,1050.00,'2024-05-07 03:23:07','riad2',32,'etihad',NULL,NULL,NULL);
/*!40000 ALTER TABLE `order_history` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `order_items`
--

DROP TABLE IF EXISTS `order_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `order_items` (
  `order_item_id` int NOT NULL AUTO_INCREMENT,
  `order_id` int NOT NULL,
  `product_id` int NOT NULL,
  `quantity` int NOT NULL,
  `price` decimal(10,2) NOT NULL,
  PRIMARY KEY (`order_item_id`),
  KEY `product_id` (`product_id`),
  KEY `order_items_ibfk_1` (`order_id`),
  CONSTRAINT `order_items_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`order_id`),
  CONSTRAINT `order_items_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=174 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `order_items`
--

LOCK TABLES `order_items` WRITE;
/*!40000 ALTER TABLE `order_items` DISABLE KEYS */;
/*!40000 ALTER TABLE `order_items` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `order_items_history`
--

DROP TABLE IF EXISTS `order_items_history`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `order_items_history` (
  `order_item_history_id` int NOT NULL AUTO_INCREMENT,
  `order_id` int NOT NULL,
  `product_id` int NOT NULL,
  `quantity` int NOT NULL,
  PRIMARY KEY (`order_item_history_id`),
  KEY `order_items_history_ibfk_1` (`order_id`),
  CONSTRAINT `order_items_history_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `order_history` (`order_id`)
) ENGINE=InnoDB AUTO_INCREMENT=96 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `order_items_history`
--

LOCK TABLES `order_items_history` WRITE;
/*!40000 ALTER TABLE `order_items_history` DISABLE KEYS */;
INSERT INTO `order_items_history` VALUES (90,106,4,1),(91,106,3,1),(93,107,3,1),(94,107,4,1);
/*!40000 ALTER TABLE `order_items_history` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `orders`
--

DROP TABLE IF EXISTS `orders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `orders` (
  `order_id` int NOT NULL AUTO_INCREMENT,
  `total` decimal(10,2) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `username` varchar(255) DEFAULT NULL,
  `seat` varchar(255) DEFAULT NULL,
  `stadium` varchar(255) DEFAULT NULL,
  `seatrow` int DEFAULT NULL,
  `notes` text,
  `scheduled_time` time DEFAULT NULL,
  PRIMARY KEY (`order_id`)
) ENGINE=InnoDB AUTO_INCREMENT=108 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `orders`
--

LOCK TABLES `orders` WRITE;
/*!40000 ALTER TABLE `orders` DISABLE KEYS */;
/*!40000 ALTER TABLE `orders` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `product_reviews`
--

DROP TABLE IF EXISTS `product_reviews`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `product_reviews` (
  `review_id` int NOT NULL AUTO_INCREMENT,
  `product_id` int NOT NULL,
  `username` varchar(255) NOT NULL,
  `review_text` text,
  `rating` int NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`review_id`),
  CONSTRAINT `product_reviews_chk_1` CHECK ((`rating` between 1 and 5))
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `product_reviews`
--

LOCK TABLES `product_reviews` WRITE;
/*!40000 ALTER TABLE `product_reviews` DISABLE KEYS */;
INSERT INTO `product_reviews` VALUES (1,4,'riadmammadov','Very tasty, would 100% recommend to everyone!',5,'2024-04-30 16:59:30'),(2,8,'riadmammadov','Nice!',5,'2024-04-30 17:07:23'),(3,7,'riadmammadov','Very tasty!',5,'2024-04-30 17:08:23'),(4,1,'riadmammadov','very nice',4,'2024-04-30 21:35:34'),(5,10,'nayim123','succulent',5,'2024-05-01 23:43:06'),(8,4,'riadmammadov','',5,'2024-05-05 02:19:30'),(9,24,'riad2','Very nice',4,'2024-05-07 01:30:03');
/*!40000 ALTER TABLE `product_reviews` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `products`
--

DROP TABLE IF EXISTS `products`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `products` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `price` int DEFAULT NULL,
  `image` text,
  `category` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=28 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `products`
--

LOCK TABLES `products` WRITE;
/*!40000 ALTER TABLE `products` DISABLE KEYS */;
INSERT INTO `products` VALUES (1,'Ice Cream',400,'images/snacks/icecream.png','snacks'),(2,'M&M',500,'images/snacks/m&ms.png','snacks'),(3,'Pringles',600,'images/snacks/pringles.png','snacks'),(4,'Burger',800,'images/food/burger.png','food'),(5,'Hot Dog',700,'images/food/hotdog.png','food'),(6,'Pie',500,'images/food/pie.png','food'),(7,'Pizza',1100,'images/food/pizzaslice.png','food'),(8,'Cola',400,'images/drinks/cola.png','drinks'),(9,'Fanta',400,'images/drinks/fanta.png','drinks'),(10,'Water',300,'images/drinks/water.png','drinks'),(12,'Popcorn',500,'images/snacks/popcorn.png','snacks'),(24,'Chips',500,'images/food/chips.jpg','food');
/*!40000 ALTER TABLE `products` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_discounts`
--

DROP TABLE IF EXISTS `user_discounts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_discounts` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `discount_code_id` int NOT NULL,
  `used_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_user_discount` (`user_id`,`discount_code_id`),
  KEY `discount_code_id` (`discount_code_id`),
  CONSTRAINT `user_discounts_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`),
  CONSTRAINT `user_discounts_ibfk_2` FOREIGN KEY (`discount_code_id`) REFERENCES `discount_codes` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=30 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_discounts`
--

LOCK TABLES `user_discounts` WRITE;
/*!40000 ALTER TABLE `user_discounts` DISABLE KEYS */;
INSERT INTO `user_discounts` VALUES (27,11,37,'2024-05-07 01:06:13'),(28,12,37,'2024-05-07 01:22:55'),(29,12,38,'2024-05-07 02:22:47');
/*!40000 ALTER TABLE `user_discounts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `user_id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `family_name` varchar(255) DEFAULT NULL,
  `birthdate` date DEFAULT NULL,
  `cognito_id` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `username` (`username`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'test091','fijasef433@etopys.com','test','test','2024-04-01',NULL),(2,'stafftest','pipimi4779@kravify.com','staff','test','2024-04-01',NULL),(3,'anas123','cibemi6102@etopys.com','anas','anas','2024-02-02',NULL),(4,'test0902','kocakac959@idsho.com','test','tester','2024-04-01',NULL),(5,'Staff12345','waxec23303@idsho.com','Staff','Staff','2024-04-01',NULL),(6,'nayim123','pifehir395@lewenbo.com','nayim','dead baller','2024-05-03',NULL),(7,'hello123','dewep14350@ociun.com','hello','hello','2024-05-01',NULL),(8,'riad888','dogija2206@rehezb.com','riad','riad','2023-09-01',NULL),(9,'Johnd','cekisa1297@lewenbo.com','john','doe','2002-05-03',NULL),(10,'test0033','gohad30182@rehezb.com','Test','test','2022-04-07',NULL),(11,'anas12345','refis70235@ociun.com','anas','anas','2024-05-01',NULL),(12,'riad2','wedawob532@shanreto.com','riad','two','2022-11-03',NULL);
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-05-07 13:40:39
