import { createColumnHelper } from '@tanstack/react-table';

import { SIDEBAR_LIST } from '../data/constants';

// react table
export const FORMATE_TABLE_HEADER = headerContent => {
  const columnHelper = createColumnHelper();

  return headerContent.map(headerItem =>
    columnHelper.accessor(headerItem, {
      cell: info => info.getValue(),
      header: headerItem,
    })
  );
};

export const GET_LOCAL_USER = () => {
  const localUser = localStorage.getItem('user');
  return JSON.parse(localUser);
};

export const GET_SIDEBAR_LIST = role => {
  // TODO: should be smarter
  if (role && role === 'admin') {
    return SIDEBAR_LIST;
  }

  if (role && role === 'customer-service') {
    return [SIDEBAR_LIST[0], SIDEBAR_LIST[1], SIDEBAR_LIST[4], SIDEBAR_LIST[5]];
  }

  return [
    SIDEBAR_LIST[0],
    SIDEBAR_LIST[1],
    SIDEBAR_LIST[2],
    SIDEBAR_LIST[3],
    SIDEBAR_LIST[4],
    SIDEBAR_LIST[5],
  ];
};
