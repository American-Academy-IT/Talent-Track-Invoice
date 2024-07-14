import { BankOutcomeView, OutcomeView } from '@invoice-system/shared';
import fs from 'fs';
import { join } from 'path';

import { buildInvoice, buildPayment } from './build-income';
import { buildBankOutcome, buildOutcome } from './build-outcome';

const filePath = join(__dirname, '..', '..', 'assets', 'output.pdf');

const BuildPDFInvoice = (type: string, contract: string, invoices: any): Promise<string> => {
  return new Promise((resolve, reject) => {
    const doc = buildInvoice(type, contract, invoices);

    // send
    const writeStream = fs.createWriteStream(filePath);
    doc.pipe(writeStream);
    doc.end();

    writeStream.on('finish', () => {
      resolve(filePath);
    });
    writeStream.on('error', err => {
      reject(err);
    });
  });
};

const BuildPDFPayment = (type: string, contract: string, payments: any): Promise<string> => {
  return new Promise((resolve, reject) => {
    const doc = buildPayment(type, contract, payments);

    // send
    const writeStream = fs.createWriteStream(filePath);
    doc.pipe(writeStream);
    doc.end();

    writeStream.on('finish', () => {
      resolve(filePath);
    });
    writeStream.on('error', err => {
      reject(err);
    });
  });
};

const BuildPDFOutcome = (outcomes: OutcomeView[]): Promise<string> => {
  return new Promise((resolve, reject) => {
    const doc = buildOutcome(outcomes);

    // send
    const writeStream = fs.createWriteStream(filePath);
    doc.pipe(writeStream);
    doc.end();

    writeStream.on('finish', () => {
      resolve(filePath);
    });
    writeStream.on('error', err => {
      reject(err);
    });
  });
};

const BuildPDFBankOutcome = (outcomes: BankOutcomeView[]): Promise<string> => {
  return new Promise((resolve, reject) => {
    const doc = buildBankOutcome(outcomes);

    // send
    const writeStream = fs.createWriteStream(filePath);
    doc.pipe(writeStream);
    doc.end();

    writeStream.on('finish', () => {
      resolve(filePath);
    });
    writeStream.on('error', err => {
      reject(err);
    });
  });
};

export { BuildPDFOutcome, BuildPDFInvoice, BuildPDFPayment, BuildPDFBankOutcome };
