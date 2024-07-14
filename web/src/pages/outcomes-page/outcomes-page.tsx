import { Flex, HStack, Heading, useDisclosure } from '@chakra-ui/react';
import { TableFilterParams, currencyFormatter, dateFormatter } from '@invoice-system/shared';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import CustomButton from '../../components/button/custom-button';
import DeleteButton from '../../components/button/delete-button';
import DownloadButton from '../../components/button/download-button';
import ExportModal from '../../components/modal/export-modal';
import DataTable from '../../components/table/data-table';
import { UserContext } from '../../context/user-context';
import { server } from '../../server-proxy';
import { FORMATE_TABLE_HEADER } from '../../utils/helpers';
import { TableFilters } from './table-filters';

const Outcomes = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { canCreateOutcomes, canExport, canAudit } = useContext(UserContext);
  const [filterParams, setFilterParams] = useState<TableFilterParams>({
    page: 0,
    search: '',
    method: '',
    date: '',
  });

  const { isLoading, data } = useQuery({
    queryKey: ['outcomes', ...Object.values(filterParams)],
    queryFn: () => server.outcomes.list(filterParams),
  });

  const handleDeleteOutcome = async (serial: string) => {
    const res = await server.outcomes.delete(serial);
    queryClient.invalidateQueries(['outcomes', ...Object.values(filterParams)]);
    return res;
  };

  // table data
  const headerContent = [
    'serial',
    'type',
    'recipient',
    'description',
    'date',
    'amount',
    'method',
    'action',
  ];
  const header = FORMATE_TABLE_HEADER(headerContent);

  const outcomes = (data?.outcomes || []).map(outcome => {
    return {
      ...outcome,
      serial: <DownloadButton serial={outcome.serial} type={outcome.type} path="outcomes" />,
      date: dateFormatter(outcome.date, { year: 'numeric', month: 'long', day: 'numeric' }),
      amount: currencyFormatter(outcome.amount, outcome.currency),
      action: (
        <HStack>
          <CustomButton
            name="More"
            size="xs"
            variant="outline"
            colorScheme="green"
            onClick={() => navigate(`details/${outcome.serial}`, { state: outcome })}
          />

          {canAudit && (
            <CustomButton
              name="Edit"
              size="xs"
              variant="outline"
              colorScheme="yellow"
              isDisabled={!canAudit}
              onClick={() => navigate(`edit/${outcome.serial}`, { state: outcome })}
            />
          )}

          {canAudit && <DeleteButton onConfirm={() => handleDeleteOutcome(outcome.serial)} />}
        </HStack>
      ),
    };
  });

  return (
    <>
      <ExportModal
        isOpen={isOpen}
        onClose={onClose}
        PDFdownloadFn={server.outcomes.exportPDF}
        XLSXdownloadFn={server.outcomes.exportXLSX}
      />
      <Flex minW="full" flexDir="column" gap={2}>
        <HStack justify="space-between">
          <Heading size="lg" color="gray.400">
            Outcomes
          </Heading>

          <HStack>
            {canExport && <CustomButton name="Export" colorScheme="green" onClick={onOpen} />}
            {canCreateOutcomes && (
              <CustomButton
                name="Create New"
                colorScheme="teal"
                onClick={() => navigate('create')}
              />
            )}
          </HStack>
        </HStack>
        <TableFilters
          hasNext={data?.hasNext || false}
          hasPrevious={data?.hasPrevious || false}
          setFilterParams={setFilterParams}
        />
        <DataTable columns={header} data={outcomes} isLoading={isLoading} />
      </Flex>
    </>
  );
};

export default Outcomes;
