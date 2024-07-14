import {
  ExportFilterParams,
  Outcome,
  OutcomeView,
  Recipient,
  TableFilterParams,
  formatISO,
} from '@invoice-system/shared';
import { ResultSetHeader, RowDataPacket } from 'mysql2';

import pool from '..';
import { PAGE_SIZE } from '../../utils/constants';

interface OutcomeRow extends OutcomeView, RowDataPacket {}
interface RecipientRow extends RowDataPacket, Recipient {}

async function getOutcomesList(params: TableFilterParams): Promise<OutcomeView[]> {
  const sql = `
    SELECT serial, ID, prefix, type, amount, description, date, method, 
      currency, recipient, createdBy, createdAt, updatedAt, deletedAt
    FROM v_outcome
    WHERE serial LIKE ? AND date LIKE ? AND method LIKE ? AND deletedAt IS NULL
    ORDER BY createdAt DESC
    LIMIT ${PAGE_SIZE + 1}
    OFFSET ?;
  `;

  const [result] = await pool.query<OutcomeRow[]>(sql, [
    `%${params.search}%`,
    `${params.date}%`,
    `${params.method}%`,
    params.page * PAGE_SIZE,
  ]);

  return result;
}

async function filterOutcomes(params: ExportFilterParams): Promise<OutcomeView[]> {
  const sql = `
    SELECT serial, ID, prefix, type, amount, description, date, method, 
      currency, recipient, createdBy, createdAt, updatedAt, deletedAt
    FROM v_outcome
    WHERE date >= ? AND date <= ? AND serial LIKE ? AND method LIKE ? AND deletedAt IS NULL
    ORDER BY ID, date;
 `;

  const [result] = await pool.query<OutcomeRow[]>(sql, [
    params.startDate,
    params.endDate,
    `${params.center}%`,
    `${params.method}%`,
  ]);

  return result;
}

async function findOutcome(serial: string, type: string): Promise<OutcomeView | undefined> {
  const sql = `
    SELECT serial, ID, prefix, type, amount, description, date, method, 
      currency, recipient, createdBy, createdAt, updatedAt, deletedAt 
    FROM v_outcome 
    WHERE serial=? AND type=? AND deletedAt IS NULL;
  `;

  const [result] = await pool.query<OutcomeRow[]>(sql, [serial, type]);

  return result[0];
}

async function findReceipt(serial: string): Promise<OutcomeView | undefined> {
  const sql = `
    SELECT serial, ID, prefix, type, amount, description, date, method, 
      currency, recipient, createdBy, createdAt, updatedAt, deletedAt 
    FROM v_outcome 
    WHERE serial=? AND type='receipt' AND deletedAt IS NULL;
  `;

  const [result] = await pool.query<OutcomeRow[]>(sql, [serial]);

  return result[0];
}

async function findOrder(serial: string): Promise<OutcomeView | undefined> {
  const sql = `
    SELECT serial, ID, prefix, type, amount, description, date, method, 
      currency, recipient, createdBy, createdAt, updatedAt, deletedAt 
    FROM v_outcome 
    WHERE serial=? AND type='order' AND deletedAt IS NULL;
  `;

  const [result] = await pool.query<OutcomeRow[]>(sql, [serial]);

  return result[0];
}

async function findOrders(search: string): Promise<OutcomeView[]> {
  const sql = `
    SELECT serial, ID, prefix, type, amount, description, date, method, 
      currency, recipient, createdBy, createdAt, updatedAt, deletedAt 
    FROM v_outcome 
    WHERE serial LIKE ? OR recipient LIKE ? AND type='order' AND deletedAt IS NULL
    LIMIT 5;
  `;

  const [result] = await pool.query<OutcomeRow[]>(sql, [`${search}%`, `${search}%`]);

  return result;
}

async function getRecipients(recipient: string): Promise<Recipient[]> {
  const sql = `
    SELECT DISTINCT recipient 
    FROM v_outcome 
    WHERE recipient LIKE ? AND deletedAt IS NULL;
  `;

  const [result] = await pool.query<RecipientRow[]>(sql, [`${recipient}%`]);

  return result;
}

async function findOutcomes(search: string): Promise<OutcomeView[]> {
  const sql = `
    SELECT serial, ID, prefix, type, amount, description, date, method, 
      currency, recipient, createdBy, createdAt, updatedAt, deletedAt 
    FROM v_outcome 
    WHERE serial LIKE ? AND deletedAt IS NULL
    LIMIT 5;
  `;

  const [result] = await pool.query<OutcomeRow[]>(sql, [`%${search}%`]);

  return result;
}

async function createExamOutcome(outcome: Outcome): Promise<number> {
  const sql = `
    INSERT INTO exam_outcome
      (type, amount, description, prefix, date, method, currency, recipient, createdBy)
    VALUES (?,?,?,?,?,?,?,?,?);
  `;

  const [inserted] = await pool.execute<ResultSetHeader>(sql, [
    outcome.type,
    outcome.amount,
    outcome.description,
    outcome.prefix,
    formatISO(new Date(outcome.date!), { representation: 'date' }),
    outcome.method,
    outcome.currency,
    outcome.recipient,
    outcome.createdBy,
  ]);

  return inserted.insertId;
}

async function updateExamOutcome(outcome: Partial<Outcome>): Promise<boolean> {
  const sql = `
    UPDATE exam_outcome SET
      amount=?, description=?, date=?, method=?, currency=?, recipient=?
    WHERE ID=? AND type=?;
  `;

  const [inserted] = await pool.execute<ResultSetHeader>(sql, [
    outcome.amount,
    outcome.description,
    formatISO(new Date(outcome.date!), { representation: 'date' }),
    outcome.method,
    outcome.currency,
    outcome.recipient,
    outcome.ID,
    outcome.type,
  ]);

  return inserted.affectedRows > 0;
}

async function createTrainOutcome(outcome: Outcome) {
  const sql = `
    INSERT INTO train_outcome
      (type, amount, description, prefix, date, method, currency, recipient, createdBy)
    VALUES (?,?,?,?,?,?,?,?,?);
  `;

  const [inserted] = await pool.execute<ResultSetHeader>(sql, [
    outcome.type,
    outcome.amount,
    outcome.description,
    outcome.prefix,
    formatISO(new Date(outcome.date), { representation: 'date' }),
    outcome.method,
    outcome.currency,
    outcome.recipient,
    outcome.createdBy,
  ]);

  return inserted.insertId;
}

async function updateTrainOutcome(outcome: Partial<Outcome>): Promise<boolean> {
  const sql = `
    UPDATE train_outcome SET
      amount=?, description=?, date=?, method=?, currency=?, recipient=?
    WHERE ID=? AND type=?;
  `;

  const [inserted] = await pool.execute<ResultSetHeader>(sql, [
    outcome.amount,
    outcome.description,
    formatISO(new Date(outcome.date!), { representation: 'date' }),
    outcome.method,
    outcome.currency,
    outcome.recipient,
    outcome.ID,
    outcome.type,
  ]);

  return inserted.affectedRows > 0;
}

async function createExamReceipt(receipt: Outcome): Promise<number> {
  const sql = `
    INSERT INTO exam_outcome
      (ID, type, amount, description, prefix, date, method, currency, recipient, createdBy)
    VALUES (?,?,?,?,?,?,?,?,?,?);
  `;

  const [inserted] = await pool.execute<ResultSetHeader>(sql, [
    receipt.ID,
    receipt.type,
    receipt.amount,
    receipt.description,
    receipt.prefix,
    formatISO(new Date(receipt.date!), { representation: 'date' }),
    receipt.method,
    receipt.currency,
    receipt.recipient,
    receipt.createdBy,
  ]);

  return inserted.insertId;
}

async function createTrainReceipt(receipt: Outcome) {
  const sql = `
    INSERT INTO train_outcome
      (ID, type, amount, description, prefix, date, method, currency, recipient, createdBy)
    VALUES (?,?,?,?,?,?,?,?,?,?);
  `;

  const [inserted] = await pool.execute<ResultSetHeader>(sql, [
    receipt.ID,
    receipt.type,
    receipt.amount,
    receipt.description,
    receipt.prefix,
    formatISO(new Date(receipt.date!), { representation: 'date' }),
    receipt.method,
    receipt.currency,
    receipt.recipient,
    receipt.createdBy,
  ]);

  return inserted.insertId;
}

async function deleteTrainOutcome(id: string): Promise<boolean> {
  const sql = `UPDATE train_outcome SET deletedAt = NOW() WHERE ID = ?;`;
  const [result] = await pool.execute<ResultSetHeader>(sql, [id]);
  return result.affectedRows > 0;
}

async function deleteExamOutcome(id: string): Promise<boolean> {
  const sql = `UPDATE exam_outcome SET deletedAt = NOW() WHERE ID = ?;`;
  const [result] = await pool.execute<ResultSetHeader>(sql, [id]);
  return result.affectedRows > 0;
}

export {
  getOutcomesList,
  findOutcomes,
  findOrders,
  findOrder,
  findOutcome,
  findReceipt,
  getRecipients,
  filterOutcomes,
  createExamOutcome,
  createTrainOutcome,
  createExamReceipt,
  createTrainReceipt,
  deleteTrainOutcome,
  deleteExamOutcome,
  updateExamOutcome,
  updateTrainOutcome,
};
