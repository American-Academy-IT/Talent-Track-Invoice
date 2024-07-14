import * as auth from './auth';
import * as bnkOutcome from './bank-outcomes';
import * as clients from './clients';
import * as courses from './courses';
import * as invoices from './invoices';
import * as outcomes from './outcomes';
import * as payments from './payments';
import * as users from './user';

export const server = Object.freeze({
  auth: {
    login: auth.login,
    logout: auth.logout,
  },

  clients: {
    get: clients.getClient,
    list: clients.listClients,
    create: clients.createClient,
    edit: clients.editClient,
    find: clients.findClients,
  },

  courses: {
    get: courses.getCourses,
    create: courses.createCourse,
    edit: courses.editCourse,
    delete: courses.deleteCourse,
  },

  invoices: {
    get: invoices.getInvoice,
    find: invoices.findInvoices,
    list: invoices.listInvoices,
    getPayments: invoices.getInvoicePayments,
    download: invoices.downloadInvoice,
    create: invoices.createInvoice,
    update: invoices.updateInvoice,
    delete: invoices.deleteInvoice,
  },

  payments: {
    get: payments.getPayment,
    list: payments.listPayments,
    download: payments.downloadPayment,
    create: payments.createPayment,
    update: payments.updatePayment,
    delete: payments.deletePayment,
    exportXLSX: payments.exportPaymentXLSX,
    exportPDF: payments.exportPaymentPDF,
  },

  outcomes: {
    findOrders: outcomes.findOrders,
    findRecipient: outcomes.findRecipient,
    list: outcomes.listOutcomes,
    create: outcomes.createOutcome,
    createReceipt: outcomes.createReceipt,
    update: outcomes.updateOutcome,
    delete: outcomes.deleteOutcome,
    getPDF: outcomes.getOutcomesPDF,
    exportPDF: outcomes.exportOutcomesPDF,
    exportXLSX: outcomes.exportOutcomesXLSX,
  },

  bankOutcomes: {
    list: bnkOutcome.getBankOutcomesList,
    download: bnkOutcome.downloadBankOutcome,
    exportPDF: bnkOutcome.exportBankOutcomesPDF,
    exportXLSX: bnkOutcome.exportBankOutcomesXLSX,
  },

  users: {
    self: users.getSelf,
    get: users.getUser,
    create: users.createUser,
    list: users.listUsers,
    update: users.updateUser,
    changePassword: users.changeUserPassword,
    delete: users.deleteUser,
  },
});
