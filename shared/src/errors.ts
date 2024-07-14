export enum ERRORS {
  TOKEN_NOT_FOUND = 'Token not found',
  TOKEN_EXPIRED = 'Token expired',
  BAD_TOKEN = 'Bad token',

  MISSING_REQUIRED_FIELDS = 'Missing required fields',
  MISSING_REQUIRED_PARAMS = 'Missing required parameters',

  INVOICE_NOT_FOUND = 'Invoice not found',

  CLIENT_NOT_FOUND = 'client not found',
  DUPLICATE_CLIENT = 'client with same mobile already exists',

  COURSE_NOT_FOUND = 'course not found',

  PAYMENT_NOT_FOUND = 'Payment not found',

  OUTCOME_NOT_FOUND = 'Outcome not found',
  ORDER_NOT_FOUND = 'Order not found',
  RECEIPT_NOT_FOUND = 'Receipt not found',
  DUPLICATE_RECEIPT = 'Receipt with same ID already exists',
  INVALID_SOW_PRICE = 'You should provide a valid price for SOW courses!',

  USER_NOT_FOUND = 'User not found',
  INVALID_PASSWORD = 'Invalid password!!',
  DUPLICATE_USER = 'username already exists',
}
