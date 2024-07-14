CREATE 
    ALGORITHM = UNDEFINED 
    DEFINER = `root`@`localhost` 
    SQL SECURITY DEFINER
VIEW `v_bank_outcome` AS
    SELECT 
        CONCAT(`outcome_bank`.`prefix`,
                '-',
                `outcome_bank`.`ID`) AS `serial`,
        `outcome_bank`.`ID` AS `ID`,
        `outcome_bank`.`prefix` AS `prefix`,
        `outcome_bank`.`date` AS `date`,
        `outcome_bank`.`description` AS `description`,
        `outcome_bank`.`method` AS `method`,
        `outcome_bank`.`currency` AS `currency`,
        `outcome_bank`.`amount` AS `amount`,
        `outcome_bank`.`createdAt` AS `createdAt`,
        `outcome_bank`.`createdBy` AS `createdBy`,
        `outcome_bank`.`type` AS `type`,
        `outcome_bank`.`deletedAt` AS `deletedAt`,
        `outcome_bank`.`updatedAt` AS `updatedAt`
    FROM
        `outcome_bank`