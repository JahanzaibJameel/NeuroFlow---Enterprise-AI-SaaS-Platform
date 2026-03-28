import { DefaultSession } from 'next-auth';
import { JWT, DefaultJWT } from 'next-auth/jwt';

// Extend session to include custom user properties
declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      role: 'ADMIN' | 'USER';
    } & DefaultSession['user'];
  }

  interface User {
    role?: 'ADMIN' | 'USER';
  }
}

// Extend JWT token to include custom properties
declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    role: 'ADMIN' | 'USER';
  }
}
