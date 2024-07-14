import { getTime, isValid } from 'date-fns';

const validateText = (text: string, min = 3, max = 64) => {
  if (text.trim() === '') {
    return 'Input must not be empty';
  }

  if (text.length < min) {
    return `Input must be at least ${min} characters long`;
  }

  if (text.length > max) {
    return 'Input is too long';
  }
};

const validateRange = (num: number, min = 0, max = 100) => {
  if (isNaN(num)) {
    return 'Input must be a number';
  }

  if (!(min <= num && num <= max)) {
    return `Input must be in range [${min} - ${max}]`;
  }
};

const validateDate = (date: string, pastDate?: string) => {
  if (!isValid(new Date(date))) {
    return 'Invalid date value';
  }

  if (getTime(new Date(date)) > Date.now()) {
    return 'Future dates are not allowed';
  }

  if (pastDate && getTime(new Date(date)) < getTime(new Date(pastDate))) {
    return 'Invalid date, must be after ORDER date';
  }
};

const validateMobile = (mobile: string) => {
  const MOBILE = /(01)[0-9]+$/i;

  if (!MOBILE.test(mobile)) {
    return 'invalid mobile number';
  }

  const errMobLen = validateText(mobile, 11, 11);
  return errMobLen ? errMobLen : undefined;
};

const validateCurrency = (currency: string) => {
  if (!['AED', 'USD'].includes(currency.toUpperCase())) {
    return 'Invalid currency';
  }
};

const validateMethod = (method: string) => {
  if (!['CASH', 'WIO'].includes(method.toUpperCase())) {
    return 'Invalid method';
  }
};

const validateTestCenter = (prefix: string) => {
  if (!['TR', 'EX', 'TRM', 'EXM'].includes(prefix)) {
    return 'Invalid test center';
  }
};

const validateClient = (client: { firstName: string; lastName: string; mobile: string }) => {
  const { firstName, lastName, mobile } = client;
  if (!firstName || !lastName || !mobile) {
    return 'Missing required fields';
  }

  const errMsg =
    validateMobile(mobile) || validateText(firstName, 3, 32) || validateText(lastName, 0, 32);
  return errMsg ? errMsg : undefined;
};

const validateCourse = (course: {
  courseName: string;
  coursePrice: number;
  costCenter: string;
  currency: string;
}) => {
  const { courseName, coursePrice, costCenter, currency } = course;
  if (!courseName || !costCenter || !currency) {
    return 'missing required fields';
  }

  const errMsg =
    validateRange(coursePrice, 0, 1000000) ||
    validateCurrency(currency) ||
    validateText(courseName, 3, 64);

  return errMsg ? errMsg : undefined;
};

const validateInvoice = (invoice: {
  clientID: string;
  courseID: string;
  prefix: string;
  invoiceDate: string;
  discount: number;
}) => {
  const { clientID, courseID, prefix, invoiceDate, discount } = invoice;

  if (!clientID || !courseID || !prefix) {
    return 'Missing required fields';
  }

  if (0 > discount || discount > 100) {
    return 'Invalid discount value';
  }

  const errCenter = validateTestCenter(prefix) || validateDate(invoiceDate);
  return errCenter ? errCenter : undefined;
};

const validatePayment = (deposit: {
  paymentDate: string;
  paymentAmount: number;
  paymentMethod: string;
}) => {
  const { paymentDate, paymentAmount, paymentMethod } = deposit;

  if (!paymentDate || isNaN(paymentAmount) || !paymentMethod) {
    return 'Missing required field';
  }

  if (paymentAmount < 0) {
    return 'Amount must be a positive value';
  }

  const errMsg = validateMethod(paymentMethod.toUpperCase()) || validateDate(paymentDate);
  return errMsg ? errMsg : undefined;
};

const validateOrder = (order: { description: string; amount: number }) => {
  const { description, amount } = order;

  if (!description || isNaN(amount)) {
    return 'Missing required field';
  }

  if (amount <= 0) {
    return 'Amount should be a positive number';
  }

  const errMsg = validateText(description, 5, 128);
  return errMsg ? errMsg : undefined;
};

const validateOutcome = (outcome: {
  type: string;
  prefix: string;
  currency: string;
  date: string;
  recipient: string;
}) => {
  const { type, prefix, currency, date, recipient } = outcome;

  if (!type || !prefix || !currency || !date || !recipient) {
    return 'Missing required field';
  }

  if (!['order', 'receipt'].includes(type)) {
    return 'Invalid type';
  }

  const errMsg =
    validateText(recipient, 5, 32) ||
    validateTestCenter(prefix) ||
    validateCurrency(currency) ||
    validateDate(date);

  return errMsg ? errMsg : undefined;
};

export {
  validateText,
  validateRange,
  validateDate,
  validateMobile,
  validateCurrency,
  validateMethod,
  validateTestCenter,
  validateClient,
  validateCourse,
  validateInvoice,
  validatePayment,
  validateOutcome,
  validateOrder,
};
