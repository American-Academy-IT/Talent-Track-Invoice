import { extendTheme } from '@chakra-ui/react';

export const LIGHT_GRAY = Object.freeze(['gray.100', 'gray.700']);
export const GRAY_COLOR = Object.freeze(['gray.400', 'gray.500']);

// sidebar link names
export const SIDEBAR_LIST = [
  'Invoices',
  'Payments',
  'Outcomes',
  'Bank-Outcomes',
  'Courses',
  'Clients',
  'Users',
];

export const MONTHS = [
  { key: 1, value: 'January' },
  { key: 2, value: 'February' },
  { key: 3, value: 'March' },
  { key: 4, value: 'April' },
  { key: 5, value: 'May' },
  { key: 6, value: 'June' },
  { key: 7, value: 'July' },
  { key: 8, value: 'August' },
  { key: 9, value: 'September' },
  { key: 10, value: 'October' },
  { key: 11, value: 'November' },
  { key: 12, value: 'December' },
];

export const SCROLLBAR_STYLE = {
  '&::-webkit-scrollbar': {
    w: 2,
  },
  '&::-webkit-scrollbar-track': {
    w: 6,
    bg: 'gray.200',
    rounded: 'md',
  },
  '&::-webkit-scrollbar-thumb': {
    rounded: 'md',
    bg: 'gray.400',
  },
};

export const THEME = extendTheme({
  styles: {
    global: {
      body: {
        transitionProperty: 'all',
        transitionDuration: 'normal',
      },
    },
  },
  config: {
    disableTransitionOnChange: false,
  },
});
