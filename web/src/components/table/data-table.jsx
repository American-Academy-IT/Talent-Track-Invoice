import { Table, TableCaption, TableContainer, Text } from '@chakra-ui/react';
import { getCoreRowModel, getSortedRowModel, useReactTable } from '@tanstack/react-table';
import { useState } from 'react';

import { SCROLLBAR_STYLE } from '../../data/constants';
import LoadingSpinner from '../UI/loading-spinner';
import { TableBody } from './table-body';
import { TableHead } from './table-head';

const DataTable = ({ isLoading, data, columns }) => {
  const [sorting, setSorting] = useState();
  const table = useReactTable({
    data,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  let caption;
  if (isLoading) {
    caption = (
      <>
        <LoadingSpinner />
        <Text>Fetching table data...</Text>
      </>
    );
  }
  if (!isLoading && data.length === 0) {
    caption = <Text>"table is empty"</Text>;
  }

  return (
    <TableContainer h="70vh" overflowY="auto" sx={SCROLLBAR_STYLE}>
      <Table size="sm" border="1px" variant="striped">
        <TableCaption>{caption}</TableCaption>
        <TableHead table={table} />
        <TableBody table={table} />
      </Table>
    </TableContainer>
  );
};

export default DataTable;
