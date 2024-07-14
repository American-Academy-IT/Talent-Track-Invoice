import { HStack, Stack } from '@chakra-ui/react';
import { ExportFilterParams } from '@invoice-system/shared';
import { Form, Formik } from 'formik';
import { useState } from 'react';

import useNotification from '../../hooks/use-notification';
import CustomButton from '../button/custom-button';
import CustomInput from '../input/custom-input';
import Selection from '../input/selection';
import { Modal } from './modal';

interface Props {
  isOpen: boolean;
  onClose(): void;
  PDFdownloadFn(filters: ExportFilterParams): Promise<void>;
  XLSXdownloadFn(filters: ExportFilterParams): Promise<void>;
}

const ExportModal = (props: Props) => {
  const [type, setType] = useState('');
  const { errorNotification } = useNotification();
  const [isDownloading, setIsDownloading] = useState(false);
  const { isOpen, onClose, PDFdownloadFn, XLSXdownloadFn } = props;

  const handleSubmit = async (values: ExportFilterParams, _action: any) => {
    try {
      setIsDownloading(true);
      if (type === 'pdf') {
        await PDFdownloadFn(values);
      } else if (type === 'xlsx') {
        await XLSXdownloadFn(values);
      }
    } catch (error) {
      errorNotification(error);
    } finally {
      setIsDownloading(false);
    }
  };

  const initialValues: ExportFilterParams = {
    startDate: '',
    endDate: '',
    method: '',
    center: '',
  };

  const body = (
    <Formik initialValues={initialValues} onSubmit={handleSubmit}>
      <Form>
        <Stack>
          <HStack>
            <Selection
              name="center"
              label="Cost Center"
              placeholder="filter by cost center"
              options={[
                { key: 'TR', value: 'Training Center' },
                { key: 'EX', value: 'Exams Center' },
              ]}
              isRequired={false}
            />

            <Selection
              name="method"
              label="Payment Method"
              placeholder="filter by method"
              options={[
                { key: 'CASH', value: 'CASH' },
                { key: 'WIO', value: 'WIO' },
              ]}
              isRequired={false}
            />
          </HStack>

          <HStack>
            <CustomInput
              isRequired
              type="date"
              name="startDate"
              label="From"
              leftElement={undefined}
              // validate={}
            />

            <CustomInput
              isRequired
              type="date"
              name="endDate"
              label="To"
              leftElement={undefined} // validate={}
            />
          </HStack>

          <HStack>
            <CustomButton
              type="submit"
              name="PDF"
              colorScheme="red"
              isLoading={isDownloading}
              onClick={() => setType('pdf')}
            />
            <CustomButton
              type="submit"
              name="Excel"
              colorScheme="green"
              isLoading={isDownloading}
              onClick={() => setType('xlsx')}
            />
          </HStack>
        </Stack>
      </Form>
    </Formik>
  );

  return <Modal isOpen={isOpen} onClose={onClose} header="Export as" body={body} />;
};

export default ExportModal;
