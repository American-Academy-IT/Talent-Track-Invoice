CREATE 
    ALGORITHM = UNDEFINED 
    DEFINER = `root`@`localhost` 
    SQL SECURITY DEFINER
VIEW `v_payment` AS
    SELECT 
        CONCAT(`v_invoice`.`prefix`,
                '-',
                `v_invoice`.`invoiceID`) AS `invoiceID`,
        CONCAT(`v_invoice`.`prefix`,
                '-',
                `payment`.`paymentID`) AS `paymentID`,
        `v_invoice`.`courseName` AS `courseName`,
        `v_invoice`.`coursePrice` AS `coursePrice`,
        `v_invoice`.`discount` AS `discount`,
        `v_invoice`.`invoicePrice` AS `invoicePrice`,
        `payment`.`paymentAmount` AS `paymentAmount`,
        `v_invoice`.`totalPaid` AS `totalPaid`,
        `v_invoice`.`currency` AS `currency`,
        `v_invoice`.`clientName` AS `clientName`,
        `v_invoice`.`mobile` AS `mobile`,
        `v_invoice`.`invoiceDate` AS `invoiceDate`,
        `payment`.`paymentDate` AS `paymentDate`,
        `payment`.`paymentMethod` AS `paymentMethod`,
        `v_invoice`.`remainingAmount` AS `remainingAmount`,
        `payment`.`createdAt` AS `createdAt`,
        `payment`.`updatedAt` AS `updatedAt`,
        `payment`.`deletedAt` AS `deletedAt`,
        `payment`.`createdBy` AS `createdBy`
    FROM
        (`v_invoice`
        JOIN `payment` ON ((`v_invoice`.`invoiceID` = `payment`.`invoiceID`)))
    WHERE
        (`payment`.`deletedAt` IS NULL) 
    UNION SELECT 
        CONCAT(`legacy_payment`.`prefix`,
                '-',
                `legacy_payment`.`invoiceID`) AS `invoiceID`,
        CONCAT(`legacy_payment`.`prefix`,
                '-',
                `legacy_payment`.`invoiceID`) AS `paymentID`,
        `legacy_payment`.`courseName` AS `courseName`,
        `legacy_payment`.`amount` AS `coursePrice`,
        0 AS `discount`,
        `legacy_payment`.`amount` AS `invoicePrice`,
        `legacy_payment`.`amount` AS `paymentAmount`,
        `legacy_payment`.`amount` AS `totalPaid`,
        `legacy_payment`.`currency` AS `currency`,
        `legacy_payment`.`clientName` AS `clientName`,
        NULL AS `mobile`,
        `legacy_payment`.`date` AS `invoiceDate`,
        `legacy_payment`.`date` AS `paymentDate`,
        `legacy_payment`.`method` AS `paymentMethod`,
        0 AS `remainingAmount`,
        `legacy_payment`.`createdAt` AS `createdAt`,
        NULL AS `updatedAt`,
        NULL AS `deletedAt`,
        `legacy_payment`.`createdBy` AS `createdBy`
    FROM
        `legacy_payment`