import { Tbody, Td, Tr } from '@chakra-ui/react';
import { flexRender } from '@tanstack/react-table';

export const TableBody = ({ table }) => {
  return (
    <Tbody>
      {table.getRowModel().rows.map(row => (
        <Tr key={row.id}>
          {row.getVisibleCells().map(cell => {
            // see https://tanstack.com/table/v8/docs/API/core/column-def#meta to type this correctly
            const meta = cell.column.columnDef.meta;
            return (
              <Td key={cell.id} isNumeric={meta?.isNumeric} maxW="200px" whiteSpace="normal">
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </Td>
            );
          })}
        </Tr>
      ))}
    </Tbody>
  );
};
