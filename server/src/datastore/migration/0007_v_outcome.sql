CREATE 
    ALGORITHM = UNDEFINED 
    DEFINER = `root`@`localhost` 
    SQL SECURITY DEFINER
VIEW `v_outcome` AS
    SELECT 
        CONCAT(`train_outcome`.`prefix`,
                '-',
                `train_outcome`.`ID`) AS `serial`,
        `train_outcome`.`ID` AS `ID`,
        `train_outcome`.`type` AS `type`,
        `train_outcome`.`amount` AS `amount`,
        `train_outcome`.`description` AS `description`,
        `train_outcome`.`prefix` AS `prefix`,
        `train_outcome`.`date` AS `date`,
        `train_outcome`.`method` AS `method`,
        `train_outcome`.`currency` AS `currency`,
        `train_outcome`.`recipient` AS `recipient`,
        `train_outcome`.`createdBy` AS `createdBy`,
        `train_outcome`.`createdAt` AS `createdAt`,
        `train_outcome`.`updatedAt` AS `updatedAt`,
        `train_outcome`.`deletedAt` AS `deletedAt`
    FROM
        `train_outcome` 
    UNION SELECT 
        CONCAT(`exam_outcome`.`prefix`,
                '-',
                `exam_outcome`.`ID`) AS `serial`,
        `exam_outcome`.`ID` AS `ID`,
        `exam_outcome`.`type` AS `type`,
        `exam_outcome`.`amount` AS `amount`,
        `exam_outcome`.`description` AS `description`,
        `exam_outcome`.`prefix` AS `prefix`,
        `exam_outcome`.`date` AS `date`,
        `exam_outcome`.`method` AS `method`,
        `exam_outcome`.`currency` AS `currency`,
        `exam_outcome`.`recipient` AS `recipient`,
        `exam_outcome`.`createdBy` AS `createdBy`,
        `exam_outcome`.`createdAt` AS `createdAt`,
        `exam_outcome`.`updatedAt` AS `updatedAt`,
        `exam_outcome`.`deletedAt` AS `deletedAt`
    FROM
        `exam_outcome`