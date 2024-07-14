import { BankOutcomeView, ExportFilterParams, TableFilterParams } from '@invoice-system/shared';
import { RowDataPacket } from 'mysql2';

import pool from '..';
import { PAGE_SIZE } from '../../utils/constants';

interface BankOutcomeRow extends RowDataPacket, BankOutcomeView {}

async function getBankOutcomesList(params: TableFilterParams): Promise<BankOutcomeView[]> {
  const sql = `
    SELECT serial, ID, prefix, date, description, method, currency, 
      amount, type, createdBy, createdAt, deletedAt, updatedAt
    FROM v_bank_outcome
    WHERE serial LIKE ? AND date LIKE ? AND method LIKE ?
    ORDER BY createdAt DESC
    LIMIT ${PAGE_SIZE + 1}
    OFFSET ?;
  `;

  const [result] = await pool.query<BankOutcomeRow[]>(sql, [
    `%${params.search}%`,
    `${params.date}%`,
    `${params.method}%`,
    params.page * PAGE_SIZE,
  ]);

  return result;
}

async function filterBankOutcomes(params: ExportFilterParams): Promise<BankOutcomeView[]> {
  const sql = `
    SELECT serial, ID, prefix, date, description, method, currency, 
      amount, type, createdBy, createdAt, deletedAt, updatedAt
    FROM v_bank_outcome
    WHERE date >= ? AND date <= ? AND serial LIKE ? AND method LIKE ?
    ORDER BY date;
  `;

  const [result] = await pool.query<BankOutcomeRow[]>(sql, [
    params.startDate,
    params.endDate,
    `${params.center}%`,
    `${params.method}%`,
  ]);

  return result;
}

async function getBankOutcome(serial: string): Promise<BankOutcomeView | undefined> {
  const sql = `
    SELECT serial, ID, prefix, date, description, method, currency, 
      amount, type, createdBy, createdAt, deletedAt, updatedAt
    FROM v_bank_outcome
    WHERE serial = ?
  `;

  const [result] = await pool.query<BankOutcomeRow[]>(sql, [serial]);

  return result[0];
}

export { getBankOutcomesList, getBankOutcome, filterBankOutcomes };
