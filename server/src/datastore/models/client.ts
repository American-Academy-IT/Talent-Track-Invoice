import { Client, ClientFilterParams } from '@invoice-system/shared';
import { ResultSetHeader, RowDataPacket } from 'mysql2';

import pool from '..';
import { PAGE_SIZE } from '../../utils/constants';

interface ClientRow extends Client, RowDataPacket {}

async function findClients(search: string): Promise<Client[]> {
  const sql = `
  SELECT * FROM client
    WHERE
      CONCAT(firstName,
            IF((middleName IS NULL), '', CONCAT(' ', middleName)),
            ' ', lastName) LIKE ? 
                AND mobile LIKE ?
                AND deletedAt IS NULL
    LIMIT ${PAGE_SIZE};
  `;

  const [result] = await pool.query<ClientRow[]>(sql, [`${search}%`, `${search}%`]);
  return result;
}

async function listClients(params: ClientFilterParams): Promise<Client[]> {
  const sql = `
  SELECT * FROM client
    WHERE CONCAT(firstName,
                 IF((middleName IS NULL), '', CONCAT(' ', middleName)),
                 ' ', lastName) LIKE ? 
                    OR mobile   LIKE ?
                    AND deletedAt IS NULL
    LIMIT ${PAGE_SIZE + 1}
    OFFSET ?;
  `;

  const [result] = await pool.query<ClientRow[]>(sql, [
    `${params.search}%`,
    `${params.search}%`,
    params.page * PAGE_SIZE,
  ]);

  return result;
}

async function getClientById(clientID: number): Promise<Client | undefined> {
  const [client] = await pool.query<ClientRow[]>(
    `SELECT * FROM client 
      WHERE clientID = ? AND deletedAt IS NULL;`,
    [clientID]
  );

  return client[0];
}

async function getClientByMobile(mobile: string): Promise<Client | undefined> {
  const [client] = await pool.query<ClientRow[]>(
    `SELECT * FROM client 
      WHERE mobile=? AND deletedAt IS NULL;`,
    [mobile]
  );

  return client[0];
}

async function createClient(client: Partial<Client>): Promise<number> {
  const sql = `INSERT INTO client (firstName, middleName, lastName, mobile) VALUES (?,?,?,?)`;

  const [inserted] = await pool.execute<ResultSetHeader>(sql, [
    client.firstName,
    client.middleName || null,
    client.lastName,
    client.mobile,
  ]);

  return inserted.insertId;
}

async function updateClient(client: Partial<Client>): Promise<boolean> {
  const sql = `
    UPDATE client 
      SET firstName = ?, middleName = ?, lastName = ?, mobile = ?
      WHERE clientID = ?;
    `;

  const [inserted] = await pool.execute<ResultSetHeader>(sql, [
    client.firstName,
    client.middleName || null,
    client.lastName,
    client.mobile,
    client.clientID,
  ]);

  return inserted.affectedRows > 0;
}

async function deleteClient(clientID: string): Promise<boolean> {
  const sql = `UPDATE client SET deletedAt = NOW() WHERE clientID = ?`;

  const [inserted] = await pool.execute<ResultSetHeader>(sql, [clientID]);
  return inserted.affectedRows > 0;
}

export {
  findClients,
  listClients,
  createClient,
  getClientById,
  updateClient,
  getClientByMobile,
  deleteClient,
};
