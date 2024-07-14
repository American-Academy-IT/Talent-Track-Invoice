import { Invoice, InvoiceTableFilterParams, InvoiceView, formatISO } from '@invoice-system/shared';
import { ResultSetHeader, RowDataPacket } from 'mysql2';

import pool from '..';
import { PAGE_SIZE, SEARCH_LIMIT } from '../../utils/constants';

interface InvoiceRow extends Invoice, RowDataPacket {}
interface InvoiceViewRow extends InvoiceView, RowDataPacket {}

async function findInvoices(search: string): Promise<InvoiceViewRow[]> {
  const sql = `
    SELECT prefix, invoiceID, clientID, courseID, invoiceDate, costCenter, coursePrice, clientName, mobile,
           courseName, currency, discount, invoicePrice, totalPaid, remainingAmount, createdAt, updatedAt, deletedAt
    FROM v_invoice
    WHERE invoiceID LIKE ? OR clientName LIKE ? OR mobile LIKE ?
    LIMIT ${SEARCH_LIMIT};
  `;

  const [invoices] = await pool.query<InvoiceViewRow[]>(sql, [
    `${search}%`,
    `${search}%`,
    `${search}%`,
  ]);

  return invoices;
}

async function listInvoices(filters: InvoiceTableFilterParams): Promise<InvoiceViewRow[]> {
  const sql = `
      SELECT prefix, invoiceID, clientID, courseID, invoiceDate, costCenter, coursePrice, clientName, mobile,
             courseName, currency, discount, invoicePrice, totalPaid, remainingAmount, createdAt, updatedAt, deletedAt
      FROM v_invoice
      WHERE invoiceID LIKE ? AND invoiceDate LIKE ? AND prefix LIKE ?
      ORDER BY invoiceID DESC
      LIMIT ${PAGE_SIZE + 1}
      OFFSET ?;
  `;

  const values = [
    `${filters.search}%`,
    `${filters.date}%`,
    `${filters.center}%`,
    filters.page * PAGE_SIZE,
  ];

  const [result] = await pool.query<InvoiceViewRow[]>(sql, values);
  return result;
}

async function getInvoiceById(invoiceID: number): Promise<InvoiceViewRow | undefined> {
  const sql = `
    SELECT prefix, invoiceID, clientID, courseID, invoiceDate, costCenter, coursePrice, clientName, mobile,
           courseName, currency, discount, invoicePrice, totalPaid, remainingAmount, createdAt, updatedAt, deletedAt
    FROM v_invoice 
    WHERE invoiceID = ?;`;

  const [invoice] = await pool.query<InvoiceViewRow[]>(sql, [invoiceID]);
  return invoice[0];
}

async function createInvoice(invoice: Partial<Invoice>): Promise<number> {
  const sql: string = `
  INSERT INTO invoice 
    (clientID, courseID, prefix, discount, coursePrice, invoicePrice, invoiceDate)
    VALUES (?, ?, ?, ?, ?, ?, ?);
  `;

  const [inserted] = await pool.query<ResultSetHeader>(sql, [
    invoice.clientID,
    invoice.courseID,
    invoice.prefix,
    invoice.discount,
    invoice.coursePrice,
    invoice.invoicePrice,
    formatISO(new Date(invoice.invoiceDate!), { representation: 'date' }),
  ]);

  return inserted.insertId;
}

async function updateInvoice(invoice: Partial<Invoice>): Promise<boolean> {
  console.log(invoice);

  const sql: string = `
    UPDATE invoice
      SET clientID=?, courseID=?, prefix=?, coursePrice=?, discount=?, invoicePrice=?, invoiceDate=?
    WHERE invoiceID = ?;
  `;

  const values = [
    invoice.clientID,
    invoice.courseID,
    invoice.prefix,
    invoice.coursePrice,
    invoice.discount,
    invoice.invoicePrice,
    formatISO(new Date(invoice.invoiceDate!), { representation: 'date' }),
    invoice.invoiceID,
  ];

  const [inserted] = await pool.execute<ResultSetHeader>(sql, values);
  return inserted.affectedRows > 0;
}

async function deleteInvoice(invoiceID: string): Promise<boolean> {
  const sql: string = `
    UPDATE invoice SET deletedAt = NOW() WHERE invoiceID = ?;
  `;

  const [inserted] = await pool.execute<ResultSetHeader>(sql, [invoiceID]);
  return inserted.affectedRows > 0;
}

export { findInvoices, listInvoices, getInvoiceById, createInvoice, updateInvoice, deleteInvoice };
