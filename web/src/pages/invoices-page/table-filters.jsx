import { HStack, IconButton, Input, Select } from '@chakra-ui/react';
import { useEffect, useReducer } from 'react';

import { Icon } from '../../components/UI/icons';

const initialValues = {
  center: '',
  search: '',
  date: '',
  page: 0,
};

const reducer = (state, action) => {
  const { type } = action;
  switch (type) {
    case 'search':
      return {
        ...state,
        page: 0,
        search: action.search,
      };
    case 'page':
      return {
        ...state,
        page: action.page,
      };
    case 'date':
      return {
        ...state,
        page: 0,
        date: action.date,
      };
    case 'center':
      return {
        ...state,
        page: 0,
        center: action.center,
      };
    default:
      return initialValues;
  }
};

export const TableFilters = ({ setInvoiceFilters, hasNext, hasPrevious }) => {
  const [filterValues, dispatch] = useReducer(reducer, initialValues);

  useEffect(() => {
    setInvoiceFilters(filterValues);
  }, [filterValues, setInvoiceFilters]);

  const handleInvoiceID = search => {
    dispatch({ type: 'search', search });
  };

  const handlePageNumber = arrow => {
    const curPageNum = filterValues.page;

    if (arrow === 'prev' && hasPrevious) {
      dispatch({ type: 'page', page: curPageNum - 1 });
    }

    if (arrow === 'next' && hasNext) {
      dispatch({ type: 'page', page: curPageNum + 1 });
    }
  };

  const handlePageSize = size => {
    dispatch({ type: 'size', size });
  };

  const handleInvoiceMonth = date => {
    dispatch({ type: 'date', date });
  };

  const handleCenterChange = center => {
    dispatch({ type: 'center', center });
  };

  return (
    <HStack align="end" justifyContent="space-between">
      <Input
        size="xs"
        w="200px"
        placeholder="find invoice"
        value={filterValues.search}
        onChange={event => handleInvoiceID(event.target.value)}
      />

      <Select
        size="xs"
        w="200px"
        placeholder="Select cost center"
        value={filterValues.center}
        onChange={event => handleCenterChange(event.target.value)}
      >
        <option value="TR">Training Center</option>
        <option value="EX">Exams Center</option>
      </Select>

      <Input
        size="xs"
        w="200px"
        type="month"
        placeholder="Select a date"
        value={filterValues.date}
        onChange={event => handleInvoiceMonth(event.target.value)}
      />

      <HStack>
        <IconButton
          size="xs"
          icon={<Icon name="arrowLeft" />}
          isDisabled={!hasPrevious}
          onClick={() => handlePageNumber('prev')}
        />
        <IconButton
          size="xs"
          icon={<Icon name="arrowRight" />}
          isDisabled={!hasNext}
          onClick={() => handlePageNumber('next')}
        />
      </HStack>
    </HStack>
  );
};
