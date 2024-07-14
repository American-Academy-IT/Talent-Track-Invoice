import {
  ExportFilterParams,
  ListBankOutcomesResponse,
  TableFilterParams,
} from '@invoice-system/shared';
import fileDownload from 'js-file-download';

import API from './config';

export async function getBankOutcomesList(
  params: TableFilterParams
): Promise<ListBankOutcomesResponse> {
  const res = await API.get('/outcomes/bank', { params });

  return res.data;
}

export async function downloadBankOutcome(id: string) {
  const res = await API.get(`/outcomes/bank/download/${id}`);
  fileDownload(res.data, `${id}.pdf`);
}

export async function exportBankOutcomesPDF(params: ExportFilterParams) {
  const res = await API.get('/outcomes/bank/export/pdf', { params, responseType: 'blob' });
  fileDownload(res.data, `output.pdf`);
}

export async function exportBankOutcomesXLSX(params: ExportFilterParams) {
  const res = await API.get('/outcomes/bank/export/xlsx', { params, responseType: 'blob' });
  fileDownload(res.data, `output.xlsx`);
}
