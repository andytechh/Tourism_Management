import { PageProps as InertiaPageProps } from '@inertiajs/core';

// Define your User type
export interface User {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'staff' | 'tourist';
}

// Extend the default Inertia props
declare module '@inertiajs/core' {
  interface PageProps extends InertiaPageProps {
    auth: {
      user: User;
    };
  }
}
