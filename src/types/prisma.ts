import { Prisma } from '@prisma/client';

export type PrismaUser = Prisma.UserGetPayload<{
  include: {
    building: {
      select: {
        id: true;
        name: true;
      };
    };
  };
}>;

export type PrismaUserUpdateInput = Prisma.UserUpdateInput & {
  status?: string;
  image?: string | null;
}; 