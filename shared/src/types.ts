export interface User {
  username: string;
  password: string;
  role: string;
  branch: string;
}

export interface Client {
  clientID: number;
  firstName: string;
  middleName: string;
  lastName: string;
  mobile: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}

export interface Course {
  courseID: number;
  courseName: string;
  coursePrice: number;
  currency: string;
  costCenter: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}

export interface Invoice {
  invoiceID: number;
  clientID: number;
  courseID: number;
  prefix: string;
  coursePrice: number;
  discount: number;
  invoicePrice: number;
  totalPaid: number;
  invoiceDate: Date;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}

export interface InvoiceView extends Invoice {
  costCenter: string;
  clientName: string;
  mobile: string;
  courseName: string;
  currency: string;
  remainingAmount: number;
}

export interface Payment {
  paymentID: number;
  invoiceID: number;
  paymentAmount: number;
  paymentDate: Date;
  paymentMethod: string;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}

export interface PaymentView extends Omit<Payment, 'paymentID' | 'invoiceID'> {
  paymentID: string;
  invoiceID: string;
  courseName: string;
  coursePrice: number;
  discount: number;
  invoicePrice: number;
  totalPaid: number;
  currency: string;
  clientName: string;
  mobile: string;
  invoiceDate: Date;
  remainingAmount: number;
  createdBy: string;
}

export interface Outcome {
  ID: number;
  type: string;
  amount: number;
  description: string;
  prefix: string;
  date: Date;
  method: string;
  currency: string;
  recipient: string;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
}

export interface OutcomeView extends Outcome {
  serial: string;
}

export interface Recipient extends Pick<Outcome, 'recipient'> {}

export interface BankOutcome {
  ID: number;
  prefix: string;
  date: Date;
  description: string;
  method: string;
  currency: string;
  amount: number;
  type: string;
  createdBy: string;
  createdAt: Date;
  deletedAt: Date;
  updatedAt: Date;
}

export interface BankOutcomeView extends BankOutcome {
  serial: string;
}
