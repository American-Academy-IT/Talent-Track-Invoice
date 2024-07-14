CREATE 
    ALGORITHM = UNDEFINED 
    DEFINER = `root`@`localhost` 
    SQL SECURITY DEFINER
VIEW `v_outcome` AS
    SELECT 
        CONCAT(`outcome_exam`.`prefix`,
                '-',
                `outcome_exam`.`ID`) AS `serial`,
        `outcome_exam`.`recipient` AS `recipient`,
        `exam_order`.`description` AS `description`,
        `exam_order`.`amount` AS `amount`,
        `outcome_exam`.`currency` AS `currency`,
        `outcome_exam`.`method` AS `method`,
        `outcome_exam`.`date` AS `date`,
        `exam_order`.`type` AS `type`,
        `exam_order`.`createdAt` AS `createdAt`,
        `exam_order`.`createdBy` AS `createdBy`
    FROM
        (`outcome_exam`
        JOIN `exam_order` ON ((`outcome_exam`.`ID` = `exam_order`.`ID`))) 
    UNION SELECT 
        CONCAT(`outcome_train`.`prefix`,
                '-',
                `outcome_train`.`ID`) AS `serial`,
        `outcome_train`.`recipient` AS `recipient`,
        `train_order`.`description` AS `description`,
        `train_order`.`amount` AS `amount`,
        `outcome_train`.`currency` AS `currency`,
        `outcome_train`.`method` AS `method`,
        `outcome_train`.`date` AS `date`,
        `train_order`.`type` AS `type`,
        `train_order`.`createdAt` AS `createdAt`,
        `train_order`.`createdBy` AS `createdBy`
    FROM
        (`outcome_train`
        JOIN `train_order` ON ((`outcome_train`.`ID` = `train_order`.`ID`)))
    ORDER BY `createdAt` DESC