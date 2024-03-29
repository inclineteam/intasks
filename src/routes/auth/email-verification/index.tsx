import { component$ } from "@builder.io/qwik";
import { Form, routeAction$, z, zod$ } from "@builder.io/qwik-city";
import { Card } from "~/components/card";
import { OTPInput } from "~/components/otp-input";
import { handleRequest, lucia } from "~/lib/lucia";
import { verifyVerificationCode } from "~/utils/code";
import {
  generateEmailVerificationCode,
  sendVerificationCode,
} from "~/utils/email";
import { prisma } from "~/lib/db";
import { Button } from "~/components/button";

export const useResendCode = routeAction$(async (data, event) => {
  const cookie = event.cookie.get("intasks_cookie");

  if (!cookie) {
    return event.fail(404, {
      message: "Cookie not found",
      user: null,
      session: null,
    });
  }

  const sessionId = lucia.readSessionCookie("intasks_cookie=" + cookie.value);

  if (!sessionId) {
    return event.fail(404, {
      message: "Session ID not found",
      user: null,
      session: null,
    });
  }

  const { user } = await lucia.validateSession(sessionId);

  if (!user) {
    return event.fail(404, {
      message: "User not found",
      user: null,
      session: null,
    });
  }

  const verificationCode = await generateEmailVerificationCode(
    user.id,
    user.email,
  );
  await sendVerificationCode(user.email, verificationCode, event.env);

  return {
    message: "A new code was sent to your email.",
  };
});

export const useVerifyCode = routeAction$(
  async (data, event) => {
    const authRequest = handleRequest(event);
    const cookie = event.cookie.get("intasks_cookie");

    if (!cookie) {
      return event.fail(404, {
        message: "Cookie not found",
        user: null,
        session: null,
      });
    }

    const sessionId = lucia.readSessionCookie("intasks_cookie=" + cookie.value);

    if (!sessionId) {
      return event.fail(404, {
        message: "Session ID not found",
        user: null,
        session: null,
      });
    }

    const { user } = await lucia.validateSession(sessionId);

    if (!user) {
      return event.fail(404, {
        message: "User not found",
        user: null,
        session: null,
      });
    }

    const validCode = await verifyVerificationCode(user, data.code);

    if (!validCode) {
      return event.fail(404, {
        message: "Invalid code",
      });
    }

    await lucia.invalidateUserSessions(user.id);
    await prisma.user.update({
      where: { id: user.id },
      data: { email_verified: true },
    });

    const session = await lucia.createSession(user.id, {});
    authRequest.setSession(session);

    if (user.isNew) {
      throw event.redirect(303, "/auth/new-user");
    } else {
      throw event.redirect(303, "/");
    }
  },
  zod$({
    code: z.string(),
  }),
);

export default component$(() => {
  const resendCode = useResendCode();
  const verifyCode = useVerifyCode();

  return (
    <div class="w-full max-w-lg">
      <Card>
        <Form>
          <div class="pb-8">
            <h1 class="text-2xl font-semibold tracking-tight text-zinc-700">
              Verification code
            </h1>
            <p class="text-sm text-zinc-500">
              Please check your email to see the verification code and enter it
              below.
            </p>
          </div>

          <OTPInput onComplete$={(pin) => verifyCode.submit({ code: pin })} />

          <div class="mt-8 flex justify-end space-x-2">
            <Button
              type="button"
              variant="secondary"
              onClick$={() => resendCode.submit()}
              class="w-max"
            >
              <span>Resend code</span>
            </Button>
          </div>
        </Form>
      </Card>
    </div>
  );
});
