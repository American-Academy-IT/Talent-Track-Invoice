import '@invoice-system/shared';
import {
  ChangeUserPasswordRequest,
  ChangeUserPasswordResponse,
  CreateUserRequest,
  CreateUserResponse,
  DeleteUserResponse,
  GetUserResponse,
  ListUsersResponse,
  UpdateUserRequest,
  UpdateUserResponse,
  UserPayload,
} from '@invoice-system/shared';

import API from './config';

export const getSelf = async (): Promise<UserPayload> => {
  const res = await API.get('users/self');
  return res.data;
};

export const getUser = async (username: string): Promise<GetUserResponse> => {
  const res = await API.get('users/' + username);
  return res.data;
};

export const listUsers = async (): Promise<ListUsersResponse> => {
  const res = await API.get('users');
  return res.data;
};

export const createUser = async (payload: CreateUserRequest): Promise<CreateUserResponse> => {
  const res = await API.post('users', payload);
  return res.data;
};

export const updateUser = async (
  username: string,
  payload: UpdateUserRequest
): Promise<UpdateUserResponse> => {
  const res = await API.put('users/' + username, payload);
  return res.data;
};

export const changeUserPassword = async (
  username: string,
  payload: ChangeUserPasswordRequest
): Promise<ChangeUserPasswordResponse> => {
  const res = await API.put(`users/${username}/change-password`, payload);
  return res.data;
};

export const deleteUser = async (username: string): Promise<DeleteUserResponse> => {
  const res = await API.delete('users/' + username);
  return res.data;
};
