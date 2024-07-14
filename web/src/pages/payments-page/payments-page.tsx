import { Box, Flex, HStack, Heading, useDisclosure } from '@chakra-ui/react';
import {
  PaymentView,
  TableFilterParams,
  currencyFormatter,
  dateFormatter,
} from '@invoice-system/shared';
import { useQuery } from '@tanstack/react-query';
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

const IncomesPageComponent = () => {
  const navigate = useNavigate();
  const { canCreatePayments, canExport, canAudit } = useContext(UserContext);
  const { onClose, isOpen, onOpen } = useDisclosure();
  const [filterParams, setFilterParams] = useState<TableFilterParams>({
    search: '',
    date: '',
    method: '',
    page: 0,
  });

  const { isLoading, data } = useQuery({
    queryKey: ['payments', ...Object.values(filterParams)],
    queryFn: () => server.payments.list(filterParams),
  });

  // table data
  const headerContent = [
    'invoice id',
    'payment id',
    'client name',
    'course name',
    'payment date',
    'payment amount',
    'method',
    'action',
  ];
  const header = FORMATE_TABLE_HEADER(headerContent);

  const payments = data?.payments.map((payment: PaymentView) => {
    return {
      ...payment,
      'invoice id': <DownloadButton serial={payment.invoiceID} path="invoices" />,
      'payment id': <DownloadButton serial={payment.paymentID} path="payments" />,
      'client name': payment.clientName,
      'course name': payment.courseName,
      'payment date': dateFormatter(payment.paymentDate, {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }),
      'payment amount': currencyFormatter(payment.paymentAmount, payment.currency),
      method: payment.paymentMethod,
      action: (
        <HStack>
          <CustomButton
            name="More"
            size="xs"
            variant="outline"
            colorScheme="green"
            onClick={() => navigate(`details/${payment.paymentID}`, { state: payment })}
          />
          {canAudit && (
            <CustomButton
              name="Edit"
              size="xs"
              variant="outline"
              colorScheme="yellow"
              isDisabled={!canAudit}
              onClick={() => navigate(`edit/payment/${payment.paymentID}`, { state: payment })}
            />
          )}
          {canAudit && <DeleteButton onConfirm={() => server.payments.delete(payment.paymentID)} />}
        </HStack>
      ),
    };
  });

  return (
    <>
      <ExportModal
        isOpen={isOpen}
        onClose={onClose}
        PDFdownloadFn={server.payments.exportPDF}
        XLSXdownloadFn={server.payments.exportXLSX}
      />
      <Flex minW="full" flexDir="column" gap={2}>
        <HStack justify="space-between">
          <Heading size="lg" color="gray.400">
            Payments
          </Heading>
          <Box>
            {canExport && (
              <CustomButton name="Export" colorScheme="green" onClick={onOpen} mr={2} />
            )}
            {canCreatePayments && (
              <CustomButton
                name="Create New"
                colorScheme="teal"
                onClick={() => navigate('create')}
              />
            )}
          </Box>
        </HStack>
        <TableFilters
          setFilterParams={setFilterParams}
          filterParams={filterParams}
          hasNext={data?.hasNext || false}
          hasPrevious={data?.hasPrevious || false}
        />
        <DataTable columns={header} data={payments || []} isLoading={isLoading} />
      </Flex>
    </>
  );
};

export default IncomesPageComponent;
