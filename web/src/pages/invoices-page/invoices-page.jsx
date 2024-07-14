import { Flex, HStack, Heading } from '@chakra-ui/react';
import { currencyFormatter, dateFormatter } from '@invoice-system/shared';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useContext, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import CustomButton from '../../components/button/custom-button';
import DeleteButton from '../../components/button/delete-button';
import DownloadButton from '../../components/button/download-button';
import DataTable from '../../components/table/data-table';
import { UserContext } from '../../context/user-context';
import { server } from '../../server-proxy';
import { FORMATE_TABLE_HEADER } from '../../utils/helpers';
import { TableFilters } from './table-filters';

const InvoicesPageComponent = () => {
  const navigate = useNavigate();
  const { canAudit } = useContext(UserContext);
  const queryClient = useQueryClient();
  const [invoiceFilters, setInvoiceFilters] = useState({
    center: '',
    search: '',
    date: '',
    page: 0,
  });
  const { isLoading, data } = useQuery({
    queryKey: ['invoices', ...Object.values(invoiceFilters)],
    queryFn: () => server.invoices.list(invoiceFilters),
  });

  const handleDeleteInvoice = async invoiceId => {
    const res = await server.invoices.delete(invoiceId);
    queryClient.invalidateQueries(['invoices', ...Object.values(invoiceFilters)]);
    return res;
  };

  // table data
  const headerContent = [
    'invoice id',
    'client name',
    'mobile',
    'course name',
    'invoice date',
    'course price',
    'discount',
    'invoice price',
    'total paid',
    'remaining amount',
    'action',
  ];
  const header = FORMATE_TABLE_HEADER(headerContent);

  const invoices = data?.invoices.map(invoice => {
    return {
      'invoice id': (
        <DownloadButton serial={`${invoice.prefix}-${invoice.invoiceID}`} path={'invoices'} />
      ),
      'client name': invoice.clientName,
      mobile: invoice.mobile || '-',
      'course name': invoice.courseName,
      'invoice date': dateFormatter(invoice.invoiceDate, {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }),
      'course price': currencyFormatter(invoice.coursePrice, invoice.currency),
      discount: invoice.discount ? invoice.discount + '%' : '-',
      'invoice price': currencyFormatter(invoice.invoicePrice, invoice.currency),
      'total paid': currencyFormatter(invoice.totalPaid, invoice.currency),
      'remaining amount': currencyFormatter(invoice.remainingAmount, invoice.currency),
      action: (
        <HStack>
          <CustomButton
            name="More"
            size="xs"
            variant="outline"
            colorScheme="green"
            onClick={() => navigate(`details/${invoice.invoiceID}`, { state: invoice })}
          />

          {canAudit && (
            <CustomButton
              name="Edit"
              size="xs"
              variant="outline"
              colorScheme="yellow"
              isDisabled={!canAudit}
              onClick={() => navigate(`edit/${invoice.invoiceID}`, { state: invoice })}
            />
          )}

          {canAudit && <DeleteButton onConfirm={() => handleDeleteInvoice(invoice.invoiceID)} />}
        </HStack>
      ),
    };
  });

  return (
    <Flex minW="full" flexDir="column" gap={2}>
      <HStack justify="space-between">
        <Heading size="lg" color="gray.400">
          Invoices
        </Heading>
      </HStack>
      <TableFilters
        setInvoiceFilters={setInvoiceFilters}
        hasNext={data?.hasNext}
        hasPrevious={data?.hasPrevious}
      />
      <DataTable columns={header} title={'invoices'} data={invoices || []} isLoading={isLoading} />
    </Flex>
  );
};

export default InvoicesPageComponent;
