CREATE 
    ALGORITHM = UNDEFINED 
    DEFINER = `root`@`localhost` 
    SQL SECURITY DEFINER
VIEW `v_totalpaid_sum` AS
    SELECT 
        `invoice`.`invoiceID` AS `invoiceID`,
        SUM(`payment`.`paymentAmount`) AS `totalPaid`
    FROM
        (`invoice`
        LEFT JOIN `payment` ON ((`invoice`.`invoiceID` = `payment`.`invoiceID`)))
    GROUP BY `invoice`.`invoiceID`