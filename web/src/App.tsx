import { Box, Skeleton } from '@chakra-ui/react';
import { Suspense, useContext } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';

import HeaderComponent from './components/layout/header';
import { UserContext } from './context/user-context';
import ClientsPage from './pages/clients-page/clients-page';
import CoursesPage from './pages/courses-page/courses-page';
import CreateCoursesPage from './pages/create-course-page/create-course-page';
import CreateInvoiceComponent from './pages/create-invoice-page/create-invoice-page';
import NewOutcome from './pages/create-outcome-page/create-outcome-page';
import CreatePaymentPageComponent from './pages/create-payment-page/create-payment-page';
import DashboardPage from './pages/dashboard-page/dashboard-page';
import Details from './pages/details-page/details-page';
import NewInvoiceDirectionComponent from './pages/invoice-direction-page/invoice-direction-page';
import InvoicesPageComponent from './pages/invoices-page/invoices-page';
import LoginPage from './pages/login-page/login-page';
import BankOutcomes from './pages/outcomes-page/bank-outcomes-page';
import Outcomes from './pages/outcomes-page/outcomes-page';
import PaymentsPageComponent from './pages/payments-page/payments-page';
import UsersPage from './pages/users-page/users-page';
import { isLoggedIn } from './server-proxy/auth';

const App = () => {
  const { canAudit, canCreatePayments, canCreateOutcomes, isAdmin } = useContext(UserContext);
  const loggedIn = isLoggedIn();

  if (!loggedIn) {
    return (
      <>
        <HeaderComponent />
        <Suspense fallback={<Skeleton />}>
          <Routes>
            <Route path="*" element={<Navigate replace to="/login" />} />
            <Route path="/login" element={<LoginPage />} />
          </Routes>
        </Suspense>
      </>
    );
  }

  return (
    <>
      <HeaderComponent />
      <Suspense fallback={<Skeleton />}>
        <Box as="main" p={4} overflow="hidden">
          <Routes>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/invoices">
              <Route index element={<InvoicesPageComponent />} />
              <Route path={`/invoices/details/:id`} element={<Details from="Invoices" />} />
              {canAudit && (
                <Route path={`/invoices/edit/:id`} element={<CreateInvoiceComponent />} />
              )}
            </Route>
            <Route path="/payments">
              <Route index element={<PaymentsPageComponent />} />
              {canCreatePayments && (
                <Route path="/payments/create" element={<NewInvoiceDirectionComponent />} />
              )}
              {canCreatePayments && (
                <Route path="/payments/create/invoice" element={<CreateInvoiceComponent />} />
              )}
              {canCreatePayments && (
                <Route path="/payments/create/payment" element={<CreatePaymentPageComponent />} />
              )}
              {canAudit && (
                <Route path="/payments/edit/payment/:id" element={<CreatePaymentPageComponent />} />
              )}
              <Route path="/payments/details/:id" element={<Details from="Payments" />} />
            </Route>
            <Route path="/outcomes">
              <Route index element={<Outcomes />} />
              {canCreateOutcomes && <Route path="/outcomes/create" element={<NewOutcome />} />}
              {canAudit && <Route path="/outcomes/edit/:id" element={<NewOutcome />} />}
              <Route path="/outcomes/details/:id" element={<Details from="Outcomes" />} />
            </Route>
            <Route path="/bank-outcomes">
              <Route index element={<BankOutcomes />} />
              <Route path="/bank-outcomes/details/:id" element={<Details from="Outcomes-Bank" />} />
            </Route>
            <Route path="/courses">
              <Route index element={<CoursesPage />} />
              <Route path="/courses/details/:id" element={<Details from="Courses" />} />
              {canAudit && (
                <>
                  <Route path="/courses/create" element={<CreateCoursesPage />} />
                  <Route path="/courses/edit/:id" element={<CreateCoursesPage />} />
                </>
              )}
            </Route>
            {isAdmin && <Route path="/users" element={<UsersPage />} />}
            <Route path="/clients" element={<ClientsPage />} />
            <Route path="/profile/:id" element={<Details from="Profile" />} />
            <Route path="*" element={<Navigate replace to="/dashboard" />} />
          </Routes>
        </Box>
      </Suspense>
    </>
  );
};

export default App;
