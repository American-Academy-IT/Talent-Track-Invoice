import { User as IUser } from '@invoice-system/shared';
import { ResultSetHeader, RowDataPacket } from 'mysql2';

import pool from '..';

interface User extends IUser, RowDataPacket {}

async function getAllUsers(): Promise<IUser[]> {
  const [result] = await pool.query<User[]>('SELECT username, role, branch FROM user');
  return result;
}

async function getUserById(username: string): Promise<User> {
  const [user] = await pool.query<User[]>('SELECT * FROM user WHERE username=?', [username]);
  return user[0];
}

async function getUserByUsername(username: string): Promise<User> {
  const [user] = await pool.query<User[]>('SELECT * FROM user WHERE username=?', [username]);

  return user[0];
}

async function addNewUser(user: User): Promise<number> {
  const [result] = await pool.execute<ResultSetHeader>(
    'INSERT INTO user SET username=?, password=?, role=?, branch="October"',
    [user.username, user.password, user.role]
  );

  return result.affectedRows;
}

async function updateUserDetails(username: string, user: User): Promise<boolean> {
  const sql = `
    UPDATE user 
    SET username=?, role=?
    WHERE username=?
  `;
  const [result] = await pool.execute<ResultSetHeader>(sql, [user.username, user.role, username]);

  return result.affectedRows > 0;
}

async function changePassword(username: string, password: string): Promise<boolean> {
  const [result] = await pool.execute<ResultSetHeader>(
    'UPDATE user SET password=? WHERE username=?',
    [password, username]
  );
  return result.affectedRows > 0;
}

async function deleteUser(username: string): Promise<boolean> {
  const [result] = await pool.execute<ResultSetHeader>('DELETE FROM user WHERE username=?;', [
    username,
  ]);

  return result.affectedRows > 0;
}

export {
  getAllUsers,
  getUserById,
  getUserByUsername,
  addNewUser,
  updateUserDetails,
  changePassword,
  deleteUser,
};
