import { ERRORS, User } from '@invoice-system/shared';
import { RequestHandler } from 'express';

import {
  addNewUser,
  changePassword,
  deleteUser,
  getAllUsers,
  getUserByUsername,
  updateUserDetails,
} from '../../datastore/models/user';
import encryptPassword from '../../service/encryptPassword';
import { verifyJwt } from '../../service/jwt-auth';

const validateUserInput = (user: User) => {
  const { username, password, role } = user;

  if (!username || !password || !role) {
    return 'missing required fields';
  }

  if (username?.length < 5 || password?.length < 5) {
    return 'username and password must be at least 5 characters';
  }

  if (username?.includes(' ') || password?.includes(' ')) {
    return 'username and password must not contains any spaces';
  }

  if (!['admin', 'accountant', 'customer-service', 'audit', 'review', 'visitor'].includes(role)) {
    return 'invalid role type';
  }

  return '';
};

const httpGetAllUsers: RequestHandler = async (_req, res) => {
  const users = await getAllUsers();
  return res.status(200).send({ users });
};

const httpAddNewUser: RequestHandler = async (req, res) => {
  const errMsg = validateUserInput(req.body);
  if (errMsg) {
    return res.status(400).send({ message: errMsg });
  }

  const { username } = req.body;
  const user = await getUserByUsername(username);
  if (user) {
    return res.status(409).send({ message: ERRORS.DUPLICATE_USER });
  }

  const { password } = req.body;
  await addNewUser({
    ...req.body,
    password: encryptPassword(password),
  });
  return res.status(201).send({ message: 'user created successfully' });
};

const httpGetUser: RequestHandler = async (req, res) => {
  const username = req.params.id;

  const user = await getUserByUsername(username);
  if (!user) {
    return res.status(404).send({ message: 'user not found' });
  }

  return res.status(200).send({
    username: user.username,
    role: user.role,
    branch: user.branch,
  });
};

const httpGetSelf: RequestHandler = async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];

  const jwtObject = verifyJwt(token!);
  const user = await getUserByUsername(jwtObject.username);
  if (!user) {
    return res.status(404).send({ message: 'user not found' });
  }

  return res.status(200).send({
    username: user.username,
    role: user.role,
    branch: user.branch,
  });
};

const httpUpdateUser: RequestHandler = async (req, res) => {
  const username = req.params.id;

  const user = await getUserByUsername(username);
  if (!user) {
    return res.status(404).send({ message: ERRORS.USER_NOT_FOUND });
  }

  await updateUserDetails(username, { ...user, ...req.body });
  return res.status(200).send({ message: 'User updated successfully' });
};

const httpChangePassword: RequestHandler = async (req, res) => {
  const username = req.params.id;
  const { password, newPassword } = req.body;

  if (!password || !newPassword) {
    return res.status(400).send({ message: ERRORS.MISSING_REQUIRED_FIELDS });
  }

  const user = await getUserByUsername(username);
  if (!user) {
    return res.status(404).send({ message: ERRORS.USER_NOT_FOUND });
  }

  if (encryptPassword(password + '') !== user.password) {
    return res.status(404).send({ message: ERRORS.INVALID_PASSWORD });
  }

  await changePassword(username, encryptPassword(newPassword));
  return res.status(200).send({ message: 'Password changed successfully' });
};

const httpDeleteUser: RequestHandler = async (req, res) => {
  const username = req.params.id;

  const user = await getUserByUsername(username);
  if (!user) {
    return res.status(404).send({ message: ERRORS.USER_NOT_FOUND });
  }

  await deleteUser(username);
  return res.status(200).send({ message: 'User deleted successfully' });
};

export {
  httpGetAllUsers,
  httpAddNewUser,
  httpGetUser,
  httpGetSelf,
  httpUpdateUser,
  httpDeleteUser,
  httpChangePassword,
};
