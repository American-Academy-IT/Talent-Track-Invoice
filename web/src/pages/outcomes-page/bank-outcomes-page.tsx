import { Flex, HStack, Heading, useDisclosure } from '@chakra-ui/react';
import { currencyFormatter, dateFormatter } from '@invoice-system/shared';
import { useQuery } from '@tanstack/react-query';
import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import CustomButton from '../../components/button/custom-button';
import DownloadButton from '../../components/button/download-button';
import ExportModal from '../../components/modal/export-modal';
import DataTable from '../../components/table/data-table';
import { UserContext } from '../../context/user-context';
import { server } from '../../server-proxy';
import { FORMATE_TABLE_HEADER } from '../../utils/helpers';
import { TableFilters } from './table-filters';

const BankOutcomes = () => {
  const navigate = useNavigate();
  const { canExport } = useContext(UserContext);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [filterParams, setFilterParams] = useState({
    search: '',
    date: '',
    method: '',
    page: 0,
  });

  const { isLoading, data } = useQuery({
    queryKey: ['bank-outcomes', ...Object.values(filterParams)],
    queryFn: () => server.bankOutcomes.list(filterParams),
  });

  // table data
  const headerContent = ['serial', 'description', 'date', 'amount', 'method', 'action'];
  const header = FORMATE_TABLE_HEADER(headerContent);

  const outcomes = data?.outcomes.map(invoice => {
    return {
      ...invoice,
      serial: <DownloadButton serial={invoice.serial} path="outcomes/bank" />,
      date: dateFormatter(invoice.date, { year: 'numeric', month: 'long', day: 'numeric' }),
      amount: currencyFormatter(invoice.amount, invoice.currency),
      action: (
        <CustomButton
          name="More"
          size="xs"
          variant="outline"
          colorScheme="green"
          onClick={() => navigate(`details/${invoice.serial}`, { state: invoice })}
        />
      ),
    };
  });

  return (
    <>
      <ExportModal
        isOpen={isOpen}
        onClose={onClose}
        XLSXdownloadFn={server.bankOutcomes.exportXLSX}
        PDFdownloadFn={server.bankOutcomes.exportPDF}
      />
      <Flex minW="full" flexDir="column" gap={2}>
        <HStack justify="space-between">
          <Heading size="lg" color="gray.400">
            Bank Outcomes
          </Heading>

          {canExport && <CustomButton name="Export" colorScheme="green" onClick={onOpen} />}
        </HStack>
        <TableFilters
          setFilterParams={setFilterParams}
          hasNext={data?.hasNext || false}
          hasPrevious={data?.hasPrevious || false}
        />
        <DataTable columns={header} data={outcomes || []} isLoading={isLoading} />
      </Flex>
    </>
  );
};

export default BankOutcomes;
