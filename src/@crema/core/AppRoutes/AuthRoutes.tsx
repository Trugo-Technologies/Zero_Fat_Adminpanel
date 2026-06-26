import React from 'react';
const Signin = React.lazy(() => import('../../../modules/auth/Signin'));

export const authRouteConfig = [
  {
    path: '/signin',
    element: <Signin />,
  },
];
