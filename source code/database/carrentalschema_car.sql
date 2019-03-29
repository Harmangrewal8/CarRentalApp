-- MySQL dump 10.13  Distrib 8.0.15, for Win64 (x86_64)
--
-- Host: localhost    Database: carrentalschema
-- ------------------------------------------------------
-- Server version	8.0.15

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
 SET NAMES utf8 ;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `car`
--

DROP TABLE IF EXISTS `car`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `car` (
  `carId` int(11) NOT NULL AUTO_INCREMENT,
  `carType` char(25) NOT NULL,
  `name` varchar(45) NOT NULL,
  `brandName` char(25) NOT NULL,
  `carStatus` varchar(45) NOT NULL,
  `location` varchar(45) NOT NULL,
  PRIMARY KEY (`carId`)
) ENGINE=InnoDB AUTO_INCREMENT=43 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `car`
--

LOCK TABLES `car` WRITE;
/*!40000 ALTER TABLE `car` DISABLE KEYS */;
INSERT INTO `car` VALUES (5,'economy','Spark','chevrolet','available','Richmond'),(6,'compact','Versa','Nissan','available','Richmond'),(9,'mid-size','Elantra','Hyundayi','available','Richmond'),(13,'standard','Versa','Hyundayi','available','Richmond'),(16,'full-size','Elantra','Hyundayi','available','Surrey'),(19,'premium','challenger','Dodge','available','Surrey'),(22,'luxury','Durango','Dodge','available','Surrey'),(24,'van','Transit-2019','Ford','available','Surrey'),(25,'economy','Spark','chevrolet','available','Surrey'),(26,'economy','Spark','chevrolet','available','Langley'),(27,'compact','Versa','Nissan','available','Surrey'),(28,'compact','Versa','Nissan','available','Langley'),(35,'premium','challenger','Dodge','available','Richmond'),(36,'premium','challenger','Dodge','available','Langley'),(37,'luxury','Durango','Dodge','available','Richmond'),(38,'luxury','Durango','Dodge','available','Langley'),(39,'suv','Durango','Dodge','available','Richmond'),(42,'van','Transit-2019','Ford','available','Langley');
/*!40000 ALTER TABLE `car` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2019-03-25 23:42:03
