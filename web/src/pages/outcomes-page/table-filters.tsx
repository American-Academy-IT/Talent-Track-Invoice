import { HStack, IconButton, Input, Select } from '@chakra-ui/react';
import { TableFilterParams } from '@invoice-system/shared';
import { useEffect, useReducer } from 'react';

import { Icon } from '../../components/UI/icons';

interface Props {
  hasNext: boolean;
  hasPrevious: boolean;
  setFilterParams: (filterParams: TableFilterParams) => void;
}

const initialValues: TableFilterParams = {
  page: 0,
  search: '',
  method: '',
  date: '',
};

const reducer = (state: TableFilterParams, action: any) => {
  const { type } = action;

  switch (type) {
    case 'page':
      return {
        ...state,
        page: action.page,
      };
    case 'method':
      return {
        ...state,
        page: 0,
        method: action.method,
      };
    case 'date':
      return {
        ...state,
        page: 0,
        date: action.date,
      };
    case 'search':
      return {
        ...state,
        page: 0,
        search: action.search,
      };
    default:
      return initialValues;
  }
};

export const TableFilters = (props: Props) => {
  const { setFilterParams, hasNext, hasPrevious } = props;

  const [filterParams, dispatch] = useReducer(reducer, initialValues);

  useEffect(() => {
    setFilterParams(filterParams);
  }, [filterParams]);

  const handlePageNumber = (arrow: string) => {
    const curPageNum = filterParams.page;

    if (arrow === 'prev' && hasPrevious) {
      dispatch({ type: 'page', page: curPageNum - 1 });
    }

    if (arrow === 'next' && hasNext) {
      dispatch({ type: 'page', page: curPageNum + 1 });
    }
  };

  const handleInvoiceMethod = (method: string) => {
    dispatch({ type: 'method', method });
  };

  const handleInvoiceMonth = (date: string) => {
    dispatch({ type: 'date', date });
  };

  const handleSerialChange = (search: string) => {
    dispatch({ type: 'search', search });
  };

  return (
    <HStack align="end" justifyContent="space-between">
      <Input
        size="xs"
        w="200px"
        placeholder="Find by serial"
        value={filterParams.search}
        onChange={event => handleSerialChange(event.target.value)}
      />

      <Select
        size="xs"
        w="200px"
        placeholder="Select cost center"
        value={filterParams.search}
        onChange={event => handleSerialChange(event.target.value)}
      >
        <option value="TR">Training Center</option>
        <option value="EX">Exams Center</option>
      </Select>

      <Select
        size="xs"
        w="200px"
        placeholder="Select method type"
        value={filterParams.method}
        onChange={event => handleInvoiceMethod(event.target.value)}
      >
        <option value="WIO">WIO</option>
        <option value="CASH">CASH</option>
      </Select>

      <Input
        size="xs"
        w="200px"
        type="month"
        placeholder="Select a date"
        value={filterParams.date}
        onChange={event => handleInvoiceMonth(event.target.value)}
      />

      <HStack>
        <IconButton
          size="xs"
          icon={<Icon name="arrowLeft" />}
          isDisabled={!hasPrevious}
          onClick={() => handlePageNumber('prev')}
          aria-label={''}
        />
        <IconButton
          size="xs"
          icon={<Icon name="arrowRight" />}
          isDisabled={!hasNext}
          onClick={() => handlePageNumber('next')}
          aria-label={''}
        />
      </HStack>
    </HStack>
  );
};
