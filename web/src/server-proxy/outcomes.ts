import {
  CreateOutcomeRequest,
  CreateOutcomeResponse,
  DeleteOutcomeResponse,
  ExportFilterParams,
  FindOrdersResponse,
  GetRecipientsListResponse,
  ListOutcomesResponse,
  TableFilterParams,
  UpdateOutcomeRequest,
  UpdateOutcomeResponse,
} from '@invoice-system/shared';
import fileDownload from 'js-file-download';

import API from './config';

export async function findRecipient(name: string): Promise<GetRecipientsListResponse> {
  const res = await API.get('/outcomes/recipients', { params: { name } });
  return res.data;
}

export async function findOrders(search: string): Promise<FindOrdersResponse> {
  const res = await API.get('/outcomes/orders', { params: { search } });
  return res.data;
}

export async function getOutcomesPDF(id: string): Promise<void> {
  const res = await API.get(`/outcomes/download/${id}`, { responseType: 'blob' });
  fileDownload(res.data, `${id}.pdf`);
}

export async function exportOutcomesXLSX(params: ExportFilterParams): Promise<void> {
  const res = await API.get('/outcomes/export/xlsx', { params, responseType: 'blob' });
  fileDownload(res.data, `output.xlsx`);
}

export async function exportOutcomesPDF(params: ExportFilterParams): Promise<void> {
  const res = await API.get('/outcomes/export/pdf', { params, responseType: 'blob' });
  fileDownload(res.data, 'output.pdf');
}

export async function listOutcomes(params: TableFilterParams): Promise<ListOutcomesResponse> {
  const res = await API.get('/outcomes', { params });
  return res.data;
}

export async function createOutcome(payload: CreateOutcomeRequest): Promise<CreateOutcomeResponse> {
  const res = await API.post('/outcomes', payload);
  return res.data;
}

export async function createReceipt(
  serial: string,
  payload: CreateOutcomeRequest
): Promise<CreateOutcomeResponse> {
  const res = await API.post(`/outcomes/${serial}`, payload);
  return res.data;
}

export async function updateOutcome(
  serial: string,
  payload: UpdateOutcomeRequest
): Promise<UpdateOutcomeResponse> {
  const res = await API.put(`/outcomes/${serial}`, payload);
  return res.data;
}

export async function deleteOutcome(serial: string): Promise<DeleteOutcomeResponse> {
  const res = await API.delete(`/outcomes/${serial}`);
  return res.data;
}
