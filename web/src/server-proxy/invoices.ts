import {
  CreateInvoiceRequest,
  CreateInvoiceResponse,
  FindInvoicesResponse,
  ListInvoiceResponse,
  PaymentView,
  TableFilterParams,
  UpdateInvoiceRequest,
  UpdateInvoiceResponse,
} from '@invoice-system/shared';
import fileDownload from 'js-file-download';

import API from './config';

export async function getInvoice(id: string): Promise<CreateInvoiceResponse> {
  const res = await API.get(`/invoices/${id}`);

  return res.data;
}

export async function findInvoices(search: string): Promise<FindInvoicesResponse> {
  const res = await API.get('/invoices', { params: { search } });

  return res.data;
}

export async function listInvoices(params: TableFilterParams): Promise<ListInvoiceResponse> {
  const res = await API.get('/invoices', { params });
  return res.data;
}

export async function downloadInvoice(id: string): Promise<void> {
  const res = await API.get(`/invoices/download${id}`, { responseType: 'blob' });
  fileDownload(res.data, `${id}.pdf`);
}

export async function getInvoicePayments(id: string): Promise<PaymentView[]> {
  const res = await API.get(`/invoices/${id}/payments`);
  return res.data;
}

export async function createInvoice(invoice: CreateInvoiceRequest): Promise<CreateInvoiceResponse> {
  const res = await API.post(`/invoices`, invoice);
  return res.data;
}

export async function updateInvoice(
  id: string,
  invoice: UpdateInvoiceRequest
): Promise<UpdateInvoiceResponse> {
  const res = await API.put(`/invoices/${id}`, invoice);
  return res.data;
}

export async function deleteInvoice(id: string): Promise<{ message: string }> {
  const res = await API.delete(`/invoices/${id}`);
  return res.data;
}
