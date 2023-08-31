// export type AuthResponse =

import { User } from '@prisma/client';

export type Tokens = {
  accessToken: string;
  refreshToken: string;
};

export type AuthResponse = Omit<User, 'refreshTokenHash' | 'passwordHash'> &
  Tokens;
