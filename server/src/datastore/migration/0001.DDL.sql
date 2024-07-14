CREATE TABLE IF NOT EXISTS exam_outcome (
  `ID`          INT NOT NULL AUTO_INCREMENT,
  `type`        VARCHAR(7)  NOT NULL,
  `amount`      DECIMAL(10,2) NOT NULL,
  `description` VARCHAR(500)  NOT NULL,
  `prefix`      VARCHAR(3)  NOT NULL,
  `date`        DATE NOT NULL,
  `method`      VARCHAR(4)  NOT NULL,
  `currency`    CHAR(3)  NOT NULL,
  `recipient`   VARCHAR(128)  NOT NULL,
  `createdBy`   VARCHAR(16)  NOT NULL, 
  
  `createdAt`   TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt`   TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deletedAt`   TIMESTAMP,
  
  PRIMARY KEY (`ID`,`type`),
  CONSTRAINT `chk_outcome_amount` CHECK ((`amount` >= 0)),
  CONSTRAINT `chk_outcome_type` CHECK ((`type` IN ('order','receipt')))
);

CREATE TABLE IF NOT EXISTS train_outcome (
  `ID`          INT NOT NULL AUTO_INCREMENT,
  `type`        VARCHAR(7)  NOT NULL,
  `amount`      DECIMAL(10,2) NOT NULL,
  `description` VARCHAR(500)  NOT NULL,
  `prefix`      VARCHAR(3)  NOT NULL,
  `date`        DATE NOT NULL,
  `method`      VARCHAR(4)  NOT NULL,
  `currency`    CHAR(3)  NOT NULL,
  `recipient`   VARCHAR(128)  NOT NULL,
  `createdBy`   VARCHAR(16)  NOT NULL, 
  
  `createdAt`   TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt`    TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deletedAt`   TIMESTAMP,
  
  PRIMARY KEY (`ID`,`type`),
  CONSTRAINT `chk_train_outcome_amount` CHECK ((`amount` >= 0)),
  CONSTRAINT `chk_train_outcome_type` CHECK ((`type` IN ('order','receipt')))
);