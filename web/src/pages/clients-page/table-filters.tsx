import { HStack, IconButton, Input } from '@chakra-ui/react';
import { useEffect, useReducer } from 'react';

import { Icon } from '../../components/UI/icons';
import { ClientFilters } from './clients-page';

const initialValues: ClientFilters = {
  search: '',
  page: 0,
};

const reducer = (state: ClientFilters, action: any) => {
  switch (action.type) {
    case 'page':
      return {
        ...state,
        page: action.page,
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
  setClientFilters: (value: ClientFilters) => void;
  hasNext: boolean;
  hasPrevious: boolean;
}

export const TableFilters = ({ setClientFilters, hasNext, hasPrevious }: Props) => {
  const [paginationValues, dispatch] = useReducer(reducer, initialValues);

  useEffect(() => {
    setClientFilters(paginationValues);
  }, [paginationValues, setClientFilters]);

  const handlePageNumber = (arrow: string) => {
    const curPageNum = paginationValues.page;

    if (arrow === 'prev' && hasPrevious) {
      dispatch({ type: 'page', page: curPageNum - 1 });
    }

    if (arrow === 'next' && hasNext) {
      dispatch({ type: 'page', page: curPageNum + 1 });
    }
  };

  const handleSearchChange = (search: string) => {
    dispatch({ type: 'search', search });
  };

  return (
    <HStack align="end" justify="space-between">
      <Input
        size="xs"
        w="200px"
        type="text"
        placeholder="Find client by name or mobile"
        value={paginationValues.search}
        onChange={event => handleSearchChange(event.target.value)}
      />

      <HStack>
        <IconButton
          size="xs"
          icon={<Icon name="arrowLeft" />}
          isDisabled={!hasPrevious}
          onClick={() => handlePageNumber('prev')}
          aria-label={'arrow left icon button'}
        />
        <IconButton
          size="xs"
          icon={<Icon name="arrowRight" />}
          isDisabled={!hasNext}
          onClick={() => handlePageNumber('next')}
          aria-label={'arrow right icon button'}
        />
      </HStack>
    </HStack>
  );
};
