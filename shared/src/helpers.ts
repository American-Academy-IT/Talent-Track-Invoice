const currencyFormatter = (amount: number, currency: string) => {
  return new Intl.NumberFormat('en-EG', {
    style: 'currency',
    currency: currency || 'AED',
  }).format(amount);
};

const dateFormatter = (date: Date, options: Intl.DateTimeFormatOptions) => {
  const dateFormat = new Date(date);
  return new Intl.DateTimeFormat('en-EG', options).format(dateFormat);
};

export { currencyFormatter, dateFormatter };
