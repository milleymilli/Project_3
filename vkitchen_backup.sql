-- MySQL dump 10.13  Distrib 8.0.41, for Linux (x86_64)
--
-- Host: localhost    Database: vkitchen
-- ------------------------------------------------------
-- Server version	8.0.41-0ubuntu0.24.04.1

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `recipes`
--

DROP TABLE IF EXISTS `recipes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `recipes` (
  `rid` int NOT NULL AUTO_INCREMENT,
  `name` varchar(50) COLLATE utf8mb4_general_ci NOT NULL,
  `description` varchar(300) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `type` enum('French','Italian','Chinese','Indian','Mexican','Others') COLLATE utf8mb4_general_ci NOT NULL,
  `Cookingtime` int DEFAULT NULL,
  `ingredients` varchar(1000) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `instructions` varchar(1000) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `image` varchar(200) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `uid` int unsigned NOT NULL,
  PRIMARY KEY (`rid`),
  KEY `uid` (`uid`),
  CONSTRAINT `recipes_ibfk_1` FOREIGN KEY (`uid`) REFERENCES `users` (`uid`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `recipes`
--

LOCK TABLES `recipes` WRITE;
/*!40000 ALTER TABLE `recipes` DISABLE KEYS */;
INSERT INTO `recipes` VALUES (1,'Classic Spaghetti Carbonara','Creamy Roman pasta dish with eggs, cheese, and pancetta','Italian',20,'Spaghetti 200g, Eggs 2, Pancetta 100g, Pecorino Romano 50g, Black Pepper','1. Cook pasta 2. Fry pancetta 3. Whisk eggs with cheese 4. Combine everything','carbonara.jpg',1),(2,'Beef Bourguignon','Traditional French stew with red wine','French',180,'Beef chuck 500g, Red wine 750ml, Carrots 2, Onions 2, Mushrooms 200g','1. Sear beef 2. Cook vegetables 3. Simmer with wine 4. Bake for 2 hours','bourguignon.jpg',2),(3,'Chicken Tikka Masala','Creamy Indian curry with grilled chicken','Indian',45,'Chicken 500g, Yogurt 200g, Cream 100ml, Tomatoes 400g, Spices','1. Marinate chicken 2. Grill 3. Make sauce 4. Combine and simmer','tikka.jpg',3),(4,'Vegetable Spring Rolls','Crispy Chinese appetizers','Chinese',30,'Cabbage 200g, Carrots 2, Bean sprouts 100g, Spring roll wrappers 10','1. Chop vegetables 2. Fill wrappers 3. Fry until golden','springrolls.jpg',1),(5,'Chocolate Soufflé','Light French dessert with rich chocolate flavor','French',35,'Dark chocolate 200g, Eggs 4, Sugar 100g, Butter 50g','1. Melt chocolate 2. Whip eggs 3. Combine 4. Bake at 375°F','souffle.jpg',2),(6,'beles','nksksns','Chinese',2,'bhbh , bhbhb','dnddndnnd dnndndnd dn dnd ndndnd dn dnd nnnnn dnd dn dndnnn dn dnddddd nd dnd ndndddd nd dnnnn dnd dndddddd nd dn dnd dn dddd',NULL,33),(7,'shiro','njsnsj jsnjnsjsn jnsjsnjsn jsnsjnsjsn','Italian',10,'njnjnj, bhsbhsbsh, nsjjsnsjs','dnddndnnd dnndndnd dn dnd ndndnd dn dnd nnnnn dnd dn dndnnn dn dnddddd nd dnd ndndddd nd dnnnn dnd dndddddd nd dn dnd dn dddddnddndnnd dnndndnd dn dnd ndndnd dn dnd nnnnn dnd dn dndnnn dn dnddddd nd dnd ndndddd nd dnnnn dnd dndddddd nd dn dnd dn dddd','https://upload.wikimedia.org/wikipedia/commons/thumb/7/7e/Shiro_Wot.jpg/800px-Shiro_Wot.jpg',33);
/*!40000 ALTER TABLE `recipes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `uid` int unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`uid`)
) ENGINE=InnoDB AUTO_INCREMENT=34 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'john_chef','chef123!','john.chef@example.com'),(2,'baker_amy','amyBakes!2023','amy.baker@example.com'),(3,'cooking_mike','MikesSecretRecipe1','mike.cooks@example.com'),(4,'healthy_eater','EatClean2023!','health.fan@example.com'),(5,'pasta_lover','Pasta4Ever!','ilovepasta@example.com'),(26,'mjki','$2b$10$dXGucr1b7hA5QxhBHzAVreDwRmxUXYpWscGusgkjVKNlAVJezw1x6','mjhy@gmail.com'),(27,'nhd','$2b$10$B7qHb978dHi8.2rjgUioAeefowMiK5miIRIRouFBd/5.OI17czmdm','mdk@gmail.com'),(28,'Hi there','$2b$10$WDAa8CNkKlNNUKhL057fguPFobb1enW7GV.ZzyGPEItcIDmz1WKOy','makelele@gebar.co'),(29,'john_doe','12345678','john@example.com'),(30,'name','$2a$10$Xnh3mZ5WfO5JZCpP7z.9.eY5U3gk2iZ7JhQN3Yb6X9kD1V2LwYbH2','test@example.com'),(31,'hayle','$2b$10$NdkhYn2h3LvLZ9xvIqdC6.naCfh2VFAU6b8eJsBoDG7pKO8fnTJtm','hayle@gmail.com'),(32,'Milli','$2b$10$8704DZLiDP4cZt4gPRoXDeKYRk1os4L5epaNMRE/kBNxec1fkbhWC','a@a.a'),(33,'b','$2b$10$5IfWUQJbwJMdJfrCQ/x1w.NlA4mtwgVVukH7PorMbS.ZmuMhtgfci','b@b.b');
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

-- Dump completed on 2025-04-24  3:03:29
