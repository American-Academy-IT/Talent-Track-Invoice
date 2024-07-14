import { Flex, Skeleton } from '@chakra-ui/react';
import { useQuery } from '@tanstack/react-query';

import API from '../../../src/server-proxy/config';
import Chart from '../../components/chart/chart';
import RevenueProgress from '../../components/featured/revenue-progress';
import Widget from '../../components/widget/widget';

const fetchPaymentDetails = async () => {
  let totalPaidSum = 0;

  try {
    const res = await API.get('/payments', {
      params: { page: 0, search: '', method: '', date: '' },
    });

    if (res.data && Array.isArray(res.data.payments)) {
      res.data.payments.forEach(payment => {
        totalPaidSum += parseInt(payment.totalPaid);
        console.log(res.data)
      });
    } else {
      console.error('Invalid data structure: payments array not found.');
    }
  } catch (error) {
    console.error('Error fetching payment details:', error);
  }

  return { totalPaidSum };
};
const Home = () => {
  const { isLoading, data: paymentDetails } = useQuery({
    queryKey: ['paymentDetails'],
    queryFn: fetchPaymentDetails,
  });

  return (
    <Skeleton as={Flex} gap={2} minW="full" flexDir="column" isLoaded={!isLoading}>
      <Flex w="full" style={{ flexDirection: 'column' }}>
        <RevenueProgress totalPaidSum={paymentDetails?.totalPaidSum || 0} w="100%" />
        <Chart chartData={paymentDetails?.payments || []} w="100%" />
      </Flex>
    </Skeleton>
  );
};

export default Home;
