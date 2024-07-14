import { Box, Flex, Skeleton } from '@chakra-ui/react';
import { Course, currencyFormatter } from '@invoice-system/shared';
import { useQuery } from '@tanstack/react-query';
import { useFormikContext } from 'formik';
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

import CustomInput from '../../components/input/custom-input';
import Selection from '../../components/input/selection';
import useNotification from '../../hooks/use-notification';
import { server } from '../../server-proxy';
import { InvoiceFormValues } from './create-invoice-page';

const CourseSelectionInput = () => {
  const { state } = useLocation();
  const [isSOW, setIsSOW] = useState(false);
  const { warningNotification } = useNotification();
  const { values, setFieldValue } = useFormikContext<InvoiceFormValues>();
  const { isLoading, data: courses } = useQuery(['courses'], () => server.courses.get());

  useEffect(() => {
    if (!state || !courses) return;

    const course: Course = courses.find((course: Course) => state.courseID === course.courseID);

    // if not exist then it is deleted
    if (course) {
      values.courseID = course.courseID + '';
      setIsSOW(course.courseName.startsWith('SOW'));
    } else {
      warningNotification('Course is deleted. Please contact your administrator!');
    }
  }, [courses]);

  useEffect(() => {
    if (!courses) return;

    const course: Course = courses.find((course: Course) => +values.courseID === course.courseID);

    if (course) {
      setFieldValue('courseID', course.courseID);

      const is_sow = course.courseName.startsWith('SOW');
      let invoicePrice = course.coursePrice - course.coursePrice * (values.discount / 100);
      if (is_sow) {
        invoicePrice = values.coursePrice! - values.coursePrice! * (values.discount / 100);
      }

      if (is_sow) {
        setFieldValue('invoicePrice', invoicePrice);
      }
      setIsSOW(is_sow);
    }
  }, [values.courseID, values.coursePrice, values.discount]);

  return (
    <Skeleton isLoaded={!isLoading} w="full">
      <Flex gap={2}>
        <Box flex={2}>
          <Selection
            isRequired
            name="courseID"
            label="Select course"
            placeholder="select an option"
            options={(courses || [])
              .filter((course: Course) => course.costCenter.startsWith(values.prefix))
              .map((course: Course) => {
                return {
                  key: course.courseID,
                  value: `${course.courseName} - ${currencyFormatter(
                    course.coursePrice,
                    course.currency
                  )}`,
                };
              })}
          />
        </Box>
        {isSOW && (
          <Box flex={1}>
            <CustomInput
              isRequired
              type="number"
              name="coursePrice"
              label="Course Price"
              placeholder="Enter course price"
              leftElement={undefined}
            />
          </Box>
        )}
      </Flex>
    </Skeleton>
  );
};

export default CourseSelectionInput;
