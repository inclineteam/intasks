import { prisma } from "~/lib/db";
import { TimeSpan, createDate } from "oslo";
import { generateRandomString, alphabet } from "oslo/crypto";
import nodemailer from "nodemailer";
import type { EnvGetter } from "@builder.io/qwik-city/middleware/request-handler";

export const generateEmailVerificationCode = async (
  userId: string,
  email: string,
): Promise<string> => {
  await prisma.emailVerificationCode.deleteMany({ where: { userId } });
  const code = generateRandomString(6, alphabet("0-9"));
  await prisma.emailVerificationCode.create({
    data: {
      email,
      code,
      userId,
      expiresAt: createDate(new TimeSpan(5, "m")),
    },
  });

  return code;
};

export const sendVerificationCode = async (
  email: string,
  verificationCode: string,
  env: EnvGetter,
) => {
  const transporter = nodemailer.createTransport({
    // @ts-ignore
    host: env.get("MAIL_HOST"),
    port: env.get("MAIL_PORT"),
    secure: false, // Use `true` for port 465, `false` for all other ports
    auth: {
      user: env.get("MAIL_USERNAME"),
      pass: env.get("MAIL_PASSWORD"),
    },
  });

  try {
    await transporter.sendMail({
      from: `"Intasks 🚀" ${env.get("MAIL_FROM_ADDRESS")}`, // sender address
      to: email, // list of receivers
      subject: "Verification Code", // Subject line
      html: `<p>Hello world! Here's your verification code: <br /> <b>${verificationCode}</b> </p>`, // html body
    });
  } catch (err) {
    console.log(err);
  }
};
