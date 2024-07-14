import {
  CreatePaymentRequest,
  CreatePaymentResponse,
  ExportFilterParams,
  ListPaymentsResponse,
  PaymentView,
  TableFilterParams,
  UpdatePaymentRequest,
} from '@invoice-system/shared';
import fileDownload from 'js-file-download';

import API from './config';

export async function getPayment(id: string): Promise<PaymentView[]> {
  const res = await API.get('/payments/' + id);
  return res.data;
}

export async function listPayments(params: TableFilterParams): Promise<ListPaymentsResponse> {
  const res = await API.get('/payments', { params });
  return res.data;
}

export async function downloadPayment(id: string): Promise<void> {
  const res = await API.get(`/payments/download/${id}`, { responseType: 'blob' });
  fileDownload(res.data, `${id}.pdf`);
}

export async function createPayment(invoice: CreatePaymentRequest): Promise<CreatePaymentResponse> {
  const res = await API.post(`/payments`, invoice);
  return res.data;
}

export async function updatePayment(
  id: string,
  invoice: UpdatePaymentRequest
): Promise<{ message: string }> {
  const res = await API.put(`/payments/${id}`, invoice);
  return res.data;
}

export async function deletePayment(id: string): Promise<{ message: string }> {
  const res = await API.delete(`/payments/${id}`);
  return res.data;
}

export async function exportPaymentXLSX(params: ExportFilterParams): Promise<void> {
  const res = await API.get('/payments/export/xlsx', { params, responseType: 'blob' });
  fileDownload(res.data, `output.xlsx`);
}

export async function exportPaymentPDF(params: ExportFilterParams): Promise<void> {
  const res = await API.get('/payments/export/pdf', { params, responseType: 'blob' });
  fileDownload(res.data, 'output.pdf');
}
