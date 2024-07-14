import {
  BankOutcomeView,
  Client,
  Course,
  Invoice,
  InvoiceView,
  Outcome,
  OutcomeView,
  Payment,
  PaymentView,
  Recipient,
  User,
} from './types';

// queries
export interface ExportFilterParams {
  startDate: string;
  endDate: string;
  center: string;
  method: string;
}

export interface TableFilterParams {
  page: number;
  search: string;
  method: string;
  date: string;
}

export interface InvoiceTableFilterParams {
  center: string;
  page: number;
  search: string;
  date: string;
}

// clients
export interface ClientFilterParams {
  page: number;
  search: string;
}

export interface ListClientsRequest {}
export interface ListClientsResponse {
  clients: Client[];
  hasNext: boolean;
  hasPrevious: boolean;
}

export interface GetClientRequest {}
export interface GetClientResponse extends Partial<Client> {}

export interface CreateClientRequest extends Partial<Client> {}
export interface CreateClientResponse extends Partial<Client> {}

export interface UpdateClientRequest extends Partial<Client> {}
export interface UpdateClientResponse extends Partial<Client> {}

export interface DeleteClientResponse extends Partial<Client> {}
export interface DeleteClientResponse extends Partial<Client> {}

// payments
export type ListPaymentsRequest = {};
export type ListPaymentsResponse = {
  payments: PaymentView[];
  hasNext: boolean;
  hasPrevious: boolean;
};
export type CreatePaymentRequest = Pick<
  Payment,
  'invoiceID' | 'paymentAmount' | 'paymentDate' | 'paymentMethod'
>;
export type CreatePaymentResponse = { paymentID: string };

export type UpdatePaymentRequest = Pick<Payment, 'paymentAmount' | 'paymentDate' | 'paymentMethod'>;

// invoices
export type GetInvoiceRequest = {};
export type GetInvoiceResponse = InvoiceView | undefined;

export type FindInvoicesParams = { search: string };
export type FindInvoicesResponse = {
  invoices: InvoiceView[];
};

export type ListInvoiceResponse = {
  invoices: InvoiceView[];
  hasNext: boolean;
  hasPrevious: boolean;
};
export type CreateInvoiceRequest = Pick<
  Invoice,
  'clientID' | 'courseID' | 'prefix' | 'discount' | 'invoiceDate' | 'invoicePrice'
> & {
  coursePrice?: number;
};
export type CreateInvoiceResponse = InvoiceView;

export type UpdateInvoiceRequest = Pick<
  Invoice,
  'clientID' | 'courseID' | 'prefix' | 'discount' | 'invoiceDate' | 'invoicePrice'
> & {
  coursePrice?: number;
};
export type UpdateInvoiceResponse = InvoiceView;

// courses
export type ListCoursesRequest = null;
export type ListCoursesResponse = {
  courses: Course[];
};

// outcomes
export type ListOutcomesQueryParams = TableFilterParams;

export type ListOutcomesRequest = null;
export type ListOutcomesResponse = {
  hasNext: boolean;
  hasPrevious: boolean;
  outcomes: OutcomeView[];
};

export type FindOrderRequest = null;
export type FindOrdersResponse = {
  orders: OutcomeView[];
};

export type GetRecipientsListRequest = null;
export type GetRecipientsListResponse = {
  recipients: Recipient[];
};

export type CreateOutcomeRequest = Partial<Outcome>;
export type CreateOutcomeResponse = Partial<Outcome> | { message: string };

export type UpdateOutcomeRequest = Partial<Outcome>;
export type UpdateOutcomeResponse = Partial<Outcome> | { message: string };

export type DeleteOutcomeRequest = null;
export type DeleteOutcomeResponse = { message: string };

// bank outcomes
export type ListBankOutcomesRequest = null;
export type ListBankOutcomesResponse = {
  hasNext: boolean;
  hasPrevious: boolean;
  outcomes: BankOutcomeView[];
};

// User
export type UserPayload = Pick<User, 'username' | 'role'> & {
  password?: string;
};

export type ListUsersRequest = null;
export type ListUsersResponse = {
  users: UserPayload[];
};

export type GetUserRequest = {};
export type GetUserResponse = UserPayload;

export type CreateUserRequest = UserPayload;
export type CreateUserResponse = UserPayload;

export type UpdateUserRequest = UserPayload;
export type UpdateUserResponse = { message: string };

export type ChangeUserPasswordRequest = {
  password: string;
  newPassword: string;
};
export type ChangeUserPasswordResponse = { message: string };

export type DeleteUserRequest = null;
export type DeleteUserResponse = { message: string };
