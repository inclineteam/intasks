import { type User } from "@prisma/client";
import { isWithinExpirationDate } from "oslo";
import { prisma } from "~/lib/db";

export const verifyVerificationCode = async (
  user: User,
  code: string,
): Promise<boolean> => {
  const dbCode = await prisma.emailVerificationCode.findUnique({
    where: { userId: user.id },
  });

  if (!dbCode || dbCode.code !== code) {
    return false;
  }

  if (!isWithinExpirationDate(dbCode.expiresAt)) {
    return false;
  }

  if (dbCode.email !== user.email) {
    return false;
  }

  await prisma.emailVerificationCode.delete({ where: { id: dbCode.id } });

  return true;
};
