import {
  ExportFilterParams,
  Payment,
  PaymentView,
  TableFilterParams,
  formatISO,
} from '@invoice-system/shared';
import { ResultSetHeader, RowDataPacket } from 'mysql2';

import pool from '..';
import { PAGE_SIZE } from '../../utils/constants';

interface PaymentViewRow extends PaymentView, RowDataPacket {}

async function listPayments(params: TableFilterParams): Promise<PaymentView[]> {
  const sql = `
    SELECT invoiceID, paymentID, courseName, coursePrice, discount, invoicePrice, 
      paymentAmount, totalPaid, currency, clientName, mobile, invoiceDate, paymentDate, 
      paymentMethod, remainingAmount, createdAt, updatedAt, deletedAt, createdBy
    FROM v_payment
    WHERE paymentID LIKE ? AND paymentDate LIKE ? AND paymentMethod LIKE ?
    ORDER BY paymentDate DESC, paymentID
    LIMIT ${PAGE_SIZE + 1}
    OFFSET ?;
  `;

  const [result] = await pool.query<PaymentViewRow[]>(sql, [
    `${params.search}%`,
    `${params.date}%`,
    `${params.method}%`,
    params.page * PAGE_SIZE,
  ]);

  return result;
}

async function listFilteredPayments(params: ExportFilterParams): Promise<PaymentView[]> {
  const sql = `
    SELECT invoiceID, paymentID, courseName, coursePrice, discount, invoicePrice, 
        paymentAmount, totalPaid, currency, clientName, mobile, invoiceDate, paymentDate, 
        paymentMethod, remainingAmount, createdAt, updatedAt, deletedAt, createdBy
    FROM v_payment
    WHERE paymentDate >= ? AND paymentDate <= ? AND paymentMethod LIKE ? AND paymentID LIKE ? 
    ORDER BY paymentID AND paymentDate;
  `;

  const [result] = await pool.query<PaymentViewRow[]>(sql, [
    params.startDate,
    params.endDate,
    `${params.method}%`,
    `${params.center}%`,
  ]);

  return result;
}

async function getInvoicePayments(invoiceID: string): Promise<PaymentView[]> {
  const sql = `
    SELECT invoiceID, paymentID, courseName, coursePrice, discount, invoicePrice, 
        paymentAmount, totalPaid, currency, clientName, mobile, invoiceDate, paymentDate, 
        paymentMethod, remainingAmount, createdAt, updatedAt, deletedAt, createdBy
    FROM v_payment
    WHERE invoiceID=?
    ORDER BY paymentID;
  `;

  const [result] = await pool.query<PaymentViewRow[]>(sql, [invoiceID]);
  return result;
}

async function getPayment(paymentID: string): Promise<PaymentView | undefined> {
  const sql = `
    SELECT invoiceID, paymentID, courseName, coursePrice, discount, invoicePrice, 
        paymentAmount, totalPaid, currency, clientName, mobile, invoiceDate, paymentDate, 
        paymentMethod, remainingAmount, createdAt, updatedAt, deletedAt, createdBy
    FROM v_payment
    WHERE paymentID=?
    ORDER BY paymentID;
  `;

  const [result] = await pool.query<PaymentViewRow[]>(sql, [paymentID]);
  return result[0];
}

async function createPayment(payment: Payment): Promise<number> {
  const sql = `
    INSERT INTO payment 
      (invoiceID, paymentDate, paymentMethod, paymentAmount, createdBy)
      VALUES(?,?,?,?,?);
  `;

  const [inserted] = await pool.execute<ResultSetHeader>(sql, [
    payment.invoiceID,
    payment.paymentDate,
    payment.paymentMethod,
    payment.paymentAmount,
    payment.createdBy,
  ]);

  return inserted.insertId;
}

async function updatePayment(payment: Payment): Promise<boolean> {
  const sql = `
    UPDATE payment 
      SET paymentDate = ?, paymentMethod = ?, paymentAmount = ?
    WHERE paymentID = ?;
  `;

  const [inserted] = await pool.execute<ResultSetHeader>(sql, [
    formatISO(new Date(payment.paymentDate), { representation: 'date' }),
    payment.paymentMethod,
    payment.paymentAmount,
    payment.paymentID,
  ]);

  return inserted.affectedRows > 0;
}

async function deletePayment(paymentID: string): Promise<boolean> {
  const sql = `UPDATE payment SET paymentAmount = 0, deletedAt = NOW() WHERE paymentID = ?`;

  const [inserted] = await pool.execute<ResultSetHeader>(sql, [paymentID]);
  return inserted.affectedRows > 0;
}

async function deleteInvoicePayments(invoicedId: string): Promise<number> {
  const sql = `UPDATE payment SET deletedAt = NOW() WHERE invoiceID = ?`;

  const [inserted] = await pool.execute<ResultSetHeader>(sql, [invoicedId]);
  return inserted.affectedRows;
}

export {
  listPayments,
  listFilteredPayments,
  getInvoicePayments,
  getPayment,
  createPayment,
  updatePayment,
  deletePayment,
  deleteInvoicePayments,
};
