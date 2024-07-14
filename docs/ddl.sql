-- MySQL dump 10.13  Distrib 8.0.31, for Win64 (x86_64)
--
-- Host: localhost    Database: invoice
-- ------------------------------------------------------
-- Server version	8.0.31

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
-- Table structure for table `client`
--

DROP TABLE IF EXISTS `client`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `client` (
  `clientID` int NOT NULL AUTO_INCREMENT,
  `firstName` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `middleName` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `lastName` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `mobile` varchar(15) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deletedAt` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`clientID`),
  UNIQUE KEY `mobile` (`mobile`)
) ENGINE=InnoDB AUTO_INCREMENT=4783 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `course`
--

DROP TABLE IF EXISTS `course`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `course` (
  `courseID` int NOT NULL AUTO_INCREMENT,
  `courseName` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `coursePrice` decimal(10,2) NOT NULL,
  `currency` char(3) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `costCenter` varchar(16) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'ACTIVE',
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deletedAt` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`courseID`),
  UNIQUE KEY `unique_course` (`courseName`,`coursePrice`,`costCenter`),
  CONSTRAINT `chk_costCenter` CHECK ((`costCenter` in (_utf8mb4'Train',_utf8mb4'Exam'))),
  CONSTRAINT `chk_currency2` CHECK ((`currency` in (_utf8mb4'AED',_utf8mb4'USD')))
) ENGINE=InnoDB AUTO_INCREMENT=294 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `exam_outcome`
--

DROP TABLE IF EXISTS `exam_outcome`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `exam_outcome` (
  `ID` int NOT NULL AUTO_INCREMENT,
  `type` varchar(7) NOT NULL,
  `amount` decimal(10,2) NOT NULL,
  `description` varchar(500) NOT NULL,
  `prefix` varchar(3) NOT NULL,
  `date` date NOT NULL,
  `method` varchar(4) NOT NULL,
  `currency` char(3) NOT NULL,
  `recipient` varchar(128) NOT NULL,
  `createdBy` varchar(16) NOT NULL,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deletedAt` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`ID`,`type`),
  CONSTRAINT `chk_outcome_amount` CHECK ((`amount` >= 0)),
  CONSTRAINT `chk_outcome_type` CHECK ((`type` in (_utf8mb4'order',_utf8mb4'receipt')))
) ENGINE=InnoDB AUTO_INCREMENT=100641 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `invoice`
--

DROP TABLE IF EXISTS `invoice`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `invoice` (
  `invoiceID` int NOT NULL AUTO_INCREMENT,
  `clientID` int NOT NULL,
  `courseID` int NOT NULL,
  `prefix` varchar(3) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `coursePrice` decimal(10,2) NOT NULL,
  `discount` int NOT NULL DEFAULT '0',
  `invoicePrice` decimal(10,2) NOT NULL,
  `totalPaid` decimal(10,2) DEFAULT '0.00',
  `invoiceDate` date DEFAULT NULL,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deletedAt` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`invoiceID`),
  KEY `clientID` (`clientID`),
  KEY `courseID` (`courseID`),
  CONSTRAINT `invoice_ibfk_1` FOREIGN KEY (`clientID`) REFERENCES `client` (`clientID`),
  CONSTRAINT `invoice_ibfk_2` FOREIGN KEY (`courseID`) REFERENCES `course` (`courseID`),
  CONSTRAINT `chk_discount` CHECK (((0 <= `discount`) and (`discount` <= 100))),
  CONSTRAINT `chk_prefix2` CHECK ((`prefix` in (_utf8mb4'TR',_utf8mb4'EX',_utf8mb4'TRM',_utf8mb4'EXM')))
) ENGINE=InnoDB AUTO_INCREMENT=1015271 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `legacy_payment`
--

DROP TABLE IF EXISTS `legacy_payment`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `legacy_payment` (
  `invoiceID` int NOT NULL AUTO_INCREMENT,
  `clientName` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `prefix` char(2) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `date` date NOT NULL,
  `courseName` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `method` varchar(4) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `currency` char(3) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `amount` decimal(10,2) NOT NULL,
  `createdBy` varchar(16) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `createdAt` timestamp NOT NULL,
  PRIMARY KEY (`invoiceID`),
  CONSTRAINT `chk_amount` CHECK ((`amount` >= 0)),
  CONSTRAINT `chk_currency` CHECK ((`currency` in (_utf8mb4'AED',_utf8mb4'USD'))),
  CONSTRAINT `chk_method` CHECK ((`method` in (_utf8mb4'WIO',_utf8mb4'CASH'))),
  CONSTRAINT `chk_prefix` CHECK ((`prefix` in (_utf8mb4'TR',_utf8mb4'EX')))
) ENGINE=InnoDB AUTO_INCREMENT=1011585 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `outcome_bank`
--

DROP TABLE IF EXISTS `outcome_bank`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `outcome_bank` (
  `ID` int NOT NULL AUTO_INCREMENT,
  `prefix` varchar(3) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `date` date NOT NULL,
  `description` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `method` varchar(11) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `currency` char(3) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `amount` decimal(10,2) NOT NULL,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `createdBy` varchar(16) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `type` varchar(7) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'order',
  `deletedAt` timestamp NULL DEFAULT NULL,
  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`ID`),
  CONSTRAINT `ck_amount` CHECK ((`amount` > 0)),
  CONSTRAINT `ck_currency` CHECK ((`currency` in (_utf8mb4'AED',_utf8mb4'USD'))),
  CONSTRAINT `ck_prefix` CHECK ((`prefix` in (_utf8mb4'TR',_utf8mb4'EX')))
) ENGINE=InnoDB AUTO_INCREMENT=11299 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `payment`
--

DROP TABLE IF EXISTS `payment`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `payment` (
  `paymentID` int NOT NULL AUTO_INCREMENT,
  `invoiceID` int NOT NULL,
  `paymentAmount` decimal(10,2) NOT NULL,
  `paymentDate` date NOT NULL,
  `paymentMethod` varchar(4) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `createdBy` varchar(16) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deletedAt` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`paymentID`),
  KEY `fk_invoice_id` (`invoiceID`),
  CONSTRAINT `fk_invoice_id` FOREIGN KEY (`invoiceID`) REFERENCES `invoice` (`invoiceID`),
  CONSTRAINT `chk_method2` CHECK ((`paymentMethod` in (_utf8mb4'WIO',_utf8mb4'CASH')))
) ENGINE=InnoDB AUTO_INCREMENT=1015704 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `train_outcome`
--

DROP TABLE IF EXISTS `train_outcome`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `train_outcome` (
  `ID` int NOT NULL AUTO_INCREMENT,
  `type` varchar(7) NOT NULL,
  `amount` decimal(10,2) NOT NULL,
  `description` varchar(500) NOT NULL,
  `prefix` varchar(3) NOT NULL,
  `date` date NOT NULL,
  `method` varchar(4) NOT NULL,
  `currency` char(3) NOT NULL,
  `recipient` varchar(128) NOT NULL,
  `createdBy` varchar(16) NOT NULL,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deletedAt` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`ID`,`type`),
  CONSTRAINT `chk_train_outcome_amount` CHECK ((`amount` >= 0)),
  CONSTRAINT `chk_train_outcome_type` CHECK ((`type` in (_utf8mb4'order',_utf8mb4'receipt')))
) ENGINE=InnoDB AUTO_INCREMENT=100992 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user` (
  `username` varchar(16) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` varchar(512) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `role` varchar(16) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `branch` varchar(16) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`username`),
  CONSTRAINT `chk_branch` CHECK ((`branch` in (_utf8mb4'October',_utf8mb4'Maadi'))),
  CONSTRAINT `user_chk_1` CHECK ((length(`username`) > 4))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Temporary view structure for view `v_bank_outcome`
--

DROP TABLE IF EXISTS `v_bank_outcome`;
/*!50001 DROP VIEW IF EXISTS `v_bank_outcome`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `v_bank_outcome` AS SELECT 
 1 AS `serial`,
 1 AS `ID`,
 1 AS `prefix`,
 1 AS `date`,
 1 AS `description`,
 1 AS `method`,
 1 AS `currency`,
 1 AS `amount`,
 1 AS `createdAt`,
 1 AS `createdBy`,
 1 AS `type`,
 1 AS `deletedAt`,
 1 AS `updatedAt`*/;
SET character_set_client = @saved_cs_client;

--
-- Temporary view structure for view `v_invoice`
--

DROP TABLE IF EXISTS `v_invoice`;
/*!50001 DROP VIEW IF EXISTS `v_invoice`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `v_invoice` AS SELECT 
 1 AS `prefix`,
 1 AS `invoiceID`,
 1 AS `clientID`,
 1 AS `courseID`,
 1 AS `invoiceDate`,
 1 AS `costCenter`,
 1 AS `coursePrice`,
 1 AS `clientName`,
 1 AS `mobile`,
 1 AS `courseName`,
 1 AS `currency`,
 1 AS `discount`,
 1 AS `invoicePrice`,
 1 AS `totalPaid`,
 1 AS `remainingAmount`,
 1 AS `createdAt`,
 1 AS `updatedAt`,
 1 AS `deletedAt`*/;
SET character_set_client = @saved_cs_client;

--
-- Temporary view structure for view `v_outcome`
--

DROP TABLE IF EXISTS `v_outcome`;
/*!50001 DROP VIEW IF EXISTS `v_outcome`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `v_outcome` AS SELECT 
 1 AS `serial`,
 1 AS `ID`,
 1 AS `type`,
 1 AS `amount`,
 1 AS `description`,
 1 AS `prefix`,
 1 AS `date`,
 1 AS `method`,
 1 AS `currency`,
 1 AS `recipient`,
 1 AS `createdBy`,
 1 AS `createdAt`,
 1 AS `updatedAt`,
 1 AS `deletedAt`*/;
SET character_set_client = @saved_cs_client;

--
-- Temporary view structure for view `v_payment`
--

DROP TABLE IF EXISTS `v_payment`;
/*!50001 DROP VIEW IF EXISTS `v_payment`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `v_payment` AS SELECT 
 1 AS `invoiceID`,
 1 AS `paymentID`,
 1 AS `courseName`,
 1 AS `coursePrice`,
 1 AS `discount`,
 1 AS `invoicePrice`,
 1 AS `paymentAmount`,
 1 AS `totalPaid`,
 1 AS `currency`,
 1 AS `clientName`,
 1 AS `mobile`,
 1 AS `invoiceDate`,
 1 AS `paymentDate`,
 1 AS `paymentMethod`,
 1 AS `remainingAmount`,
 1 AS `createdAt`,
 1 AS `updatedAt`,
 1 AS `deletedAt`,
 1 AS `createdBy`*/;
SET character_set_client = @saved_cs_client;

--
-- Temporary view structure for view `v_totalpaid_sum`
--

DROP TABLE IF EXISTS `v_totalpaid_sum`;
/*!50001 DROP VIEW IF EXISTS `v_totalpaid_sum`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `v_totalpaid_sum` AS SELECT 
 1 AS `invoiceID`,
 1 AS `totalPaid`*/;
SET character_set_client = @saved_cs_client;

--
-- Final view structure for view `v_bank_outcome`
--

/*!50001 DROP VIEW IF EXISTS `v_bank_outcome`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_0900_ai_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `v_bank_outcome` AS select concat(`outcome_bank`.`prefix`,'-',`outcome_bank`.`ID`) AS `serial`,`outcome_bank`.`ID` AS `ID`,`outcome_bank`.`prefix` AS `prefix`,`outcome_bank`.`date` AS `date`,`outcome_bank`.`description` AS `description`,`outcome_bank`.`method` AS `method`,`outcome_bank`.`currency` AS `currency`,`outcome_bank`.`amount` AS `amount`,`outcome_bank`.`createdAt` AS `createdAt`,`outcome_bank`.`createdBy` AS `createdBy`,`outcome_bank`.`type` AS `type`,`outcome_bank`.`deletedAt` AS `deletedAt`,`outcome_bank`.`updatedAt` AS `updatedAt` from `outcome_bank` */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `v_invoice`
--

/*!50001 DROP VIEW IF EXISTS `v_invoice`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_0900_ai_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `v_invoice` AS select `invoice`.`prefix` AS `prefix`,`invoice`.`invoiceID` AS `invoiceID`,`client`.`clientID` AS `clientID`,`course`.`courseID` AS `courseID`,`invoice`.`invoiceDate` AS `invoiceDate`,`course`.`costCenter` AS `costCenter`,`invoice`.`coursePrice` AS `coursePrice`,concat(`client`.`firstName`,if((`client`.`middleName` is null),'',concat(' ',`client`.`middleName`)),' ',`client`.`lastName`) AS `clientName`,`client`.`mobile` AS `mobile`,`course`.`courseName` AS `courseName`,`course`.`currency` AS `currency`,`invoice`.`discount` AS `discount`,`invoice`.`invoicePrice` AS `invoicePrice`,ifnull(`v_tp_s`.`totalPaid`,0) AS `totalPaid`,(`invoice`.`invoicePrice` - ifnull(`v_tp_s`.`totalPaid`,0)) AS `remainingAmount`,`invoice`.`createdAt` AS `createdAt`,`invoice`.`updatedAt` AS `updatedAt`,`invoice`.`deletedAt` AS `deletedAt` from (((`invoice` join `v_totalpaid_sum` `v_tp_s` on((`invoice`.`invoiceID` = `v_tp_s`.`invoiceID`))) join `client` on((`invoice`.`clientID` = `client`.`clientID`))) join `course` on((`invoice`.`courseID` = `course`.`courseID`))) where (`invoice`.`deletedAt` is null) */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `v_outcome`
--

/*!50001 DROP VIEW IF EXISTS `v_outcome`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_0900_ai_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `v_outcome` AS select concat(`train_outcome`.`prefix`,'-',`train_outcome`.`ID`) AS `serial`,`train_outcome`.`ID` AS `ID`,`train_outcome`.`type` AS `type`,`train_outcome`.`amount` AS `amount`,`train_outcome`.`description` AS `description`,`train_outcome`.`prefix` AS `prefix`,`train_outcome`.`date` AS `date`,`train_outcome`.`method` AS `method`,`train_outcome`.`currency` AS `currency`,`train_outcome`.`recipient` AS `recipient`,`train_outcome`.`createdBy` AS `createdBy`,`train_outcome`.`createdAt` AS `createdAt`,`train_outcome`.`updatedAt` AS `updatedAt`,`train_outcome`.`deletedAt` AS `deletedAt` from `train_outcome` union select concat(`exam_outcome`.`prefix`,'-',`exam_outcome`.`ID`) AS `serial`,`exam_outcome`.`ID` AS `ID`,`exam_outcome`.`type` AS `type`,`exam_outcome`.`amount` AS `amount`,`exam_outcome`.`description` AS `description`,`exam_outcome`.`prefix` AS `prefix`,`exam_outcome`.`date` AS `date`,`exam_outcome`.`method` AS `method`,`exam_outcome`.`currency` AS `currency`,`exam_outcome`.`recipient` AS `recipient`,`exam_outcome`.`createdBy` AS `createdBy`,`exam_outcome`.`createdAt` AS `createdAt`,`exam_outcome`.`updatedAt` AS `updatedAt`,`exam_outcome`.`deletedAt` AS `deletedAt` from `exam_outcome` */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `v_payment`
--

/*!50001 DROP VIEW IF EXISTS `v_payment`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_0900_ai_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `v_payment` AS select concat(`v_invoice`.`prefix`,'-',`v_invoice`.`invoiceID`) AS `invoiceID`,concat(`v_invoice`.`prefix`,'-',`payment`.`paymentID`) AS `paymentID`,`v_invoice`.`courseName` AS `courseName`,`v_invoice`.`coursePrice` AS `coursePrice`,`v_invoice`.`discount` AS `discount`,`v_invoice`.`invoicePrice` AS `invoicePrice`,`payment`.`paymentAmount` AS `paymentAmount`,`v_invoice`.`totalPaid` AS `totalPaid`,`v_invoice`.`currency` AS `currency`,`v_invoice`.`clientName` AS `clientName`,`v_invoice`.`mobile` AS `mobile`,`v_invoice`.`invoiceDate` AS `invoiceDate`,`payment`.`paymentDate` AS `paymentDate`,`payment`.`paymentMethod` AS `paymentMethod`,`v_invoice`.`remainingAmount` AS `remainingAmount`,`payment`.`createdAt` AS `createdAt`,`payment`.`updatedAt` AS `updatedAt`,`payment`.`deletedAt` AS `deletedAt`,`payment`.`createdBy` AS `createdBy` from (`v_invoice` join `payment` on((`v_invoice`.`invoiceID` = `payment`.`invoiceID`))) where (`payment`.`deletedAt` is null) union select concat(`legacy_payment`.`prefix`,'-',`legacy_payment`.`invoiceID`) AS `invoiceID`,concat(`legacy_payment`.`prefix`,'-',`legacy_payment`.`invoiceID`) AS `paymentID`,`legacy_payment`.`courseName` AS `courseName`,`legacy_payment`.`amount` AS `coursePrice`,0 AS `discount`,`legacy_payment`.`amount` AS `invoicePrice`,`legacy_payment`.`amount` AS `paymentAmount`,`legacy_payment`.`amount` AS `totalPaid`,`legacy_payment`.`currency` AS `currency`,`legacy_payment`.`clientName` AS `clientName`,NULL AS `mobile`,`legacy_payment`.`date` AS `invoiceDate`,`legacy_payment`.`date` AS `paymentDate`,`legacy_payment`.`method` AS `paymentMethod`,0 AS `remainingAmount`,`legacy_payment`.`createdAt` AS `createdAt`,NULL AS `updatedAt`,NULL AS `deletedAt`,`legacy_payment`.`createdBy` AS `createdBy` from `legacy_payment` */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `v_totalpaid_sum`
--

/*!50001 DROP VIEW IF EXISTS `v_totalpaid_sum`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_0900_ai_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `v_totalpaid_sum` AS select `invoice`.`invoiceID` AS `invoiceID`,sum(`payment`.`paymentAmount`) AS `totalPaid` from (`invoice` left join `payment` on((`invoice`.`invoiceID` = `payment`.`invoiceID`))) group by `invoice`.`invoiceID` */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2023-11-26 14:15:18
