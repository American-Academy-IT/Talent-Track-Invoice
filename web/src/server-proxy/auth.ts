import API from './config';

export const LOCAL_STORAGE_JWT = 'jwtToken';

export const getLocalStorageJWT = (): string => {
  return localStorage.getItem(LOCAL_STORAGE_JWT) || '';
};

export const isLoggedIn = (): boolean => {
  const jwt = getLocalStorageJWT();
  return !!jwt;
};

export const login = async (username: string, password: string) => {
  const res = await API.post('/login', { username, password });
  localStorage.setItem(LOCAL_STORAGE_JWT, res.data.accessToken);
  window.location.reload();
  return res.data;
};

export const logout = () => {
  localStorage.removeItem(LOCAL_STORAGE_JWT);
  window.location.reload();
};
