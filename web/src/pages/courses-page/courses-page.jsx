import { Flex, HStack, Heading } from '@chakra-ui/react';
import { currencyFormatter } from '@invoice-system/shared';
import { useQuery } from '@tanstack/react-query';
import { useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import CustomButton from '../../components/button/custom-button';
import DataTable from '../../components/table/data-table';
import { UserContext } from '../../context/user-context';
import { server } from '../../server-proxy';
import { FORMATE_TABLE_HEADER } from '../../utils/helpers';
import DeleteButton from './delete-button';

// TODO: add table pagination
const CoursesPageComponent = () => {
  const navigate = useNavigate();
  const { canAudit } = useContext(UserContext);
  const { isLoading, data } = useQuery({
    queryKey: ['courses'],
    queryFn: () => server.courses.get(),
  });

  // table data
  const headerContent = ['course id', 'course name', 'course price', 'cost center', 'action'];
  const header = FORMATE_TABLE_HEADER(headerContent);

  const courses = (data || []).map(course => {
    return {
      'course id': course.courseID,
      'course name': course.courseName,
      'course price': currencyFormatter(course.coursePrice, course.currency),
      'cost center': course.costCenter,
      action: (
        <HStack>
          <CustomButton
            name="More"
            size="xs"
            variant="outline"
            colorScheme="green"
            onClick={() => navigate(`details/${course.courseID}`, { state: course })}
          />
          {canAudit && (
            <CustomButton
              name="Edit"
              size="xs"
              variant="outline"
              colorScheme="yellow"
              isDisabled={!canAudit}
              onClick={() => navigate(`edit/${course.courseID}`, { state: course })}
            />
          )}

          {canAudit && <DeleteButton courseId={course.courseID} />}
        </HStack>
      ),
    };
  });

  return (
    <Flex minW="full" flexDir="column" gap={2}>
      <HStack justify="space-between">
        <Heading size="lg" color="gray.400">
          Courses
        </Heading>
        {canAudit && (
          <CustomButton name="Add Course" colorScheme="teal" onClick={() => navigate('create')} />
        )}
      </HStack>
      <DataTable columns={header} title={'courses'} data={courses} isLoading={isLoading} />
    </Flex>
  );
};

export default CoursesPageComponent;
