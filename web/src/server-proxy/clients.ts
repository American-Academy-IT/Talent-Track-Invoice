import {
  Client,
  ClientFilterParams,
  CreateClientRequest,
  ListClientsResponse,
} from '@invoice-system/shared';

import API from './config';

export async function findClients(search: string): Promise<ListClientsResponse> {
  const res = await API.get('/clients', { params: { search } });
  return res.data;
}

export async function listClients(params: ClientFilterParams): Promise<ListClientsResponse> {
  const res = await API.get('/clients', { params });
  return res.data;
}

export async function getClient(id: string): Promise<Client | undefined> {
  const res = await API.get('/clients/' + id);
  return res.data;
}

export async function createClient(payload: CreateClientRequest) {
  const res = await API.post('/clients', payload);
  return res.data;
}

export async function editClient(clientId: number, payload: CreateClientRequest) {
  const res = await API.put(`/clients/${clientId}`, payload);
  return res.data;
}
