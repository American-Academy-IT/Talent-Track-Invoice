CREATE 
    ALGORITHM = UNDEFINED 
    DEFINER = `root`@`localhost` 
    SQL SECURITY DEFINER
VIEW `v_invoice` AS
    SELECT 
        `invoice`.`prefix` AS `prefix`,
        `invoice`.`invoiceID` AS `invoiceID`,
        `client`.`clientID` AS `clientID`,
        `course`.`courseID` AS `courseID`,
        `invoice`.`invoiceDate` AS `invoiceDate`,
        `course`.`costCenter` AS `costCenter`,
        `invoice`.`coursePrice` AS `coursePrice`,
        CONCAT(`client`.`firstName`,
                IF((`client`.`middleName` IS NULL),
                    '',
                    CONCAT(' ', `client`.`middleName`)),
                ' ',
                `client`.`lastName`) AS `clientName`,
        `client`.`mobile` AS `mobile`,
        `course`.`courseName` AS `courseName`,
        `course`.`currency` AS `currency`,
        `invoice`.`discount` AS `discount`,
        `invoice`.`invoicePrice` AS `invoicePrice`,
        IFNULL(`v_tp_s`.`totalPaid`, 0) AS `totalPaid`,
        (`invoice`.`invoicePrice` - IFNULL(`v_tp_s`.`totalPaid`, 0)) AS `remainingAmount`,
        `invoice`.`createdAt` AS `createdAt`,
        `invoice`.`updatedAt` AS `updatedAt`,
        `invoice`.`deletedAt` AS `deletedAt`
    FROM
        (((`invoice`
        JOIN `v_totalpaid_sum` `v_tp_s` ON ((`invoice`.`invoiceID` = `v_tp_s`.`invoiceID`)))
        JOIN `client` ON ((`invoice`.`clientID` = `client`.`clientID`)))
        JOIN `course` ON ((`invoice`.`courseID` = `course`.`courseID`)))
    WHERE
        (`invoice`.`deletedAt` IS NULL)