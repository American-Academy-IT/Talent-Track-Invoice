import { Container, FormControl, FormLabel, Select } from '@chakra-ui/react';
import { useLocation, useNavigate } from 'react-router-dom';

import Card from '../../components/UI/card';

const InvoiceDirectionPageComponent = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const handleSelection = e => {
    const goTo = e.target.value;
    navigate(`${pathname}/${goTo}`);
  };

  return (
    <Container size="container.md">
      <Card>
        <FormControl>
          <FormLabel>Select invoice type</FormLabel>
          <Select isRequired placeholder="select an option" onChange={handleSelection}>
            <option value="invoice">New Invoice</option>
            <option value="payment">Existing Invoice</option>
          </Select>
        </FormControl>
      </Card>
    </Container>
  );
};

export default InvoiceDirectionPageComponent;
