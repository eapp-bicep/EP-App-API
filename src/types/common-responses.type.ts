import { User } from '@prisma/client';

export type CommonMessageResponse = {
  message: string;
};

export type ResponseWithData<T> = {
  message: string;
  data?: T;
};

export type MentorRating = { userId: string; rating: number };

export type DashboardResponse = {
  meetings: number;
  ideas: number;
  mentors: Partial<User>[];
};
