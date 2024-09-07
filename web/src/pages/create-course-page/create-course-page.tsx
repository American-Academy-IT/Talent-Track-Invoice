import { Container, VStack } from '@chakra-ui/react';
import { validateText } from '@invoice-system/shared';
import { Form, Formik, FormikHelpers, FormikValues } from 'formik';
import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import Card from '../../components/UI/card';
import CustomButton from '../../components/button/custom-button';
import CustomInput from '../../components/input/custom-input';
import Selection from '../../components/input/selection';
import useNotification from '../../hooks/use-notification';
import { server } from '../../server-proxy';

interface CourseFormValues extends FormikValues {
  courseName: string;
  costCenter: string;
  currency: string;
  coursePrice: string;
}

const CreateCoursePage = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const { errorNotification, successNotification } = useNotification();

  const formSubmitHandler = async (
    values: CourseFormValues,
    actions: FormikHelpers<CourseFormValues>
  ) => {
    try {
      setIsLoading(true);
      if (state) {
        await server.courses.edit(state.courseID, values);
      } else {
        await server.courses.create(values);
      }

      successNotification(`course ${!!state ? 'updated' : 'created'} successfully`);
      actions.resetForm();
      navigate(-1);
    } catch (err) {
      errorNotification(err);
    } finally {
      setIsLoading(false);
    }
  };

  const initialValues = {
    courseName: state?.courseName || '',
    costCenter: state?.costCenter || '',
    currency: state?.currency || '',
    coursePrice: state?.coursePrice || '',
  };

  return (
    <Formik initialValues={initialValues} onSubmit={formSubmitHandler}>
      <Form>
        <Container minW="container.md">
          <Card>
            <VStack align="end">
              <CustomInput
                isRequired
                name="courseName"
                type="text"
                label="Course Name"
                placeholder="Enter course name"
                validate={validateText}
                leftElement={undefined}
              />
              <Selection
                isRequired
                name="costCenter"
                label="Select cost center"
                placeholder="select an option"
                options={[
                  { key: 'TRAIN', value: 'Training' },
                  { key: 'EXAM', value: 'Exams' },
                ]}
              />
              <Selection
                isRequired
                name="currency"
                label="Select currency"
                placeholder="select an option"
                options={[
                  { key: 'AED', value: 'AED' },
                  // { key: 'USD', value: 'USD' },
                ]}
              />
              <CustomInput
                isRequired
                name="coursePrice"
                type="number"
                label="Course Price"
                placeholder="enter course coursePrice"
                leftElement={undefined}
              />
              <CustomButton
                type="submit"
                name={`${state ? 'Edit' : 'Add'} Course`}
                colorScheme="blue"
                minW="min-content"
                isLoading={isLoading}
                loadingText="Submitting"
              />
            </VStack>
          </Card>
        </Container>
      </Form>
    </Formik>
  );
};

export default CreateCoursePage;
