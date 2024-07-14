import { HStack, IconButton, Input, Select } from '@chakra-ui/react';
import { TableFilterParams } from '@invoice-system/shared';
import { useEffect, useReducer } from 'react';

import { Icon } from '../../components/UI/icons';

const initialValues: TableFilterParams = {
  search: '',
  date: '',
  method: '',
  page: 0,
};

const reducer = (state: any, action: any) => {
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

interface Props {
  hasNext: boolean;
  hasPrevious: boolean;
  filterParams: TableFilterParams;
  setFilterParams: (reducerValues: TableFilterParams) => void;
}

export const TableFilters = (props: Props) => {
  const { hasNext, hasPrevious, setFilterParams } = props;
  const [reducerValues, dispatch] = useReducer(reducer, initialValues);

  useEffect(() => {
    setFilterParams(reducerValues);
  }, [reducerValues, setFilterParams]);

  const handlePageChange = (arrow: string) => {
    const curPageNum = reducerValues.page;

    if (arrow === 'prev' && hasPrevious) {
      dispatch({ type: 'page', page: curPageNum - 1 });
    }

    if (arrow === 'next' && hasNext) {
      dispatch({ type: 'page', page: curPageNum + 1 });
    }
  };

  const handleMethodChange = (method: string) => {
    dispatch({ type: 'method', method });
  };

  const handleMonthChange = (date: string) => {
    dispatch({ type: 'date', date });
  };

  const handleSearchChange = (search: string) => {
    dispatch({ type: 'search', search });
  };

  return (
    <HStack align="end" justifyContent="space-between">
      <Input
        size="xs"
        w="200px"
        placeholder="Search by invoice ID"
        value={reducerValues.search}
        onChange={event => handleSearchChange(event.target.value)}
      />

      <Select
        size="xs"
        w="200px"
        placeholder="Select cost center"
        value={reducerValues.search}
        onChange={event => handleSearchChange(event.target.value)}
      >
        <option value="TR">Training Center</option>
        <option value="EX">Exams Center</option>
      </Select>

      <Select
        size="xs"
        w="200px"
        placeholder="Select payment type"
        value={reducerValues.method}
        onChange={event => handleMethodChange(event.target.value)}
      >
        <option value="WIO">WIO</option>
        <option value="CASH">CASH</option>
      </Select>

      <Input
        size="xs"
        w="200px"
        type="month"
        placeholder="Select a date"
        value={reducerValues.date}
        onChange={event => handleMonthChange(event.target.value)}
      />

      <HStack>
        <IconButton
          size="xs"
          icon={<Icon name="arrowLeft" />}
          isDisabled={!hasPrevious}
          onClick={() => handlePageChange('prev')}
          aria-label={'previous button'}
        />
        <IconButton
          size="xs"
          icon={<Icon name="arrowRight" />}
          isDisabled={!hasNext}
          onClick={() => handlePageChange('next')}
          aria-label={'next button'}
        />
      </HStack>
    </HStack>
  );
};
