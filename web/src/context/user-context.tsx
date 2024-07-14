import { UserPayload } from '@invoice-system/shared';
import { useQuery } from '@tanstack/react-query';
import { createContext } from 'react';

import { server } from '../server-proxy';
import { isLoggedIn } from '../server-proxy/auth';

type UserContext = {
  user?: UserPayload;
  isAdmin: boolean;
  canAudit: boolean;
  canExport: boolean;
  canCreatePayments: boolean;
  canCreateOutcomes: boolean;
};

interface Props {
  children: React.ReactNode;
}

export const UserContext = createContext({} as UserContext);

const CurrentUserProvider = (props: Props) => {
  const { data: user } = useQuery({
    queryKey: ['self'],
    queryFn: server.users.self,
    enabled: isLoggedIn(),
  });

  const isAdmin = user?.role === 'admin';
  const canAudit = ['admin', 'audit'].includes(user?.role || '');
  const canExport = ['admin', 'accountant', 'audit', 'review'].includes(user?.role || '');
  const canCreatePayments = ['admin', 'accountant', 'customer-service'].includes(user?.role || '');
  const canCreateOutcomes = ['admin', 'accountant'].includes(user?.role || '');

  const userContext = {
    isAdmin,
    canAudit,
    canExport,
    canCreatePayments,
    canCreateOutcomes,
    user,
  };

  return <UserContext.Provider value={userContext}>{props.children}</UserContext.Provider>;
};

export default CurrentUserProvider;
