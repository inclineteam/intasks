import { component$, useSignal } from "@builder.io/qwik";
import {
  routeAction$,
  type DocumentHead,
  zod$,
  z,
  Form as QwikForm,
  routeLoader$,
  Link,
} from "@builder.io/qwik-city";
import { BsGithub, BsGoogle } from "@qwikest/icons/bootstrap";
import { Card } from "~/components/card";
import { prisma } from "~/lib/db";
import { hashPassword } from "qwik-lucia";
import {
  generateEmailVerificationCode,
  sendVerificationCode,
} from "~/utils/email";
import { handleRequest, lucia } from "~/lib/lucia";
import { Form } from "~/components/form";
import { Button } from "~/components/button";

export const useUser = routeLoader$(async (event) => {
  const cookie = event.cookie.get("intasks_cookie");

  if (!cookie) return;

  const sessionId = lucia.readSessionCookie("intasks_cookie=" + cookie.value);

  if (!sessionId) return;

  const { user } = await lucia.validateSession(sessionId);

  if (user) {
    throw event.redirect(303, "/");
  }

  return user;
});

export const useSignup = routeAction$(
  async (form, event) => {
    const authRequest = handleRequest(event);

    const hashedPassword = await hashPassword(form.password);

    const user = await prisma.user.create({
      data: {
        email: form.email,
        email_verified: false,
        password: hashedPassword,
        username: form.email.split("@")[0],
        isNew: true,
      },
    });

    const verificationCode = await generateEmailVerificationCode(
      user.id,
      form.email,
    );
    await sendVerificationCode(user.email, verificationCode, event.env);

    const session = await lucia.createSession(user.id, {});

    authRequest.setSession(session);

    throw event.redirect(303, "/auth/email-verification");
  },
  zod$({
    email: z.string(),
    password: z.string(),
    confirm_password: z.string(),
  }),
);

export default component$(() => {
  const signup = useSignup();
  const email = useSignal("");
  const password = useSignal("");
  const confirm_password = useSignal("");

  return (
    <div class="w-full max-w-lg">
      <Card>
        <QwikForm action={signup}>
          <div class="pb-8">
            <h1 class="text-2xl font-semibold tracking-tight text-zinc-700">
              Sign up
            </h1>
            <p class="text-sm text-zinc-500">
              Join Intasks to collaborate with your peers and friends on your
              projects!
            </p>
          </div>
          <div class="mb-4">
            <Form.Label>Email Address</Form.Label>
            <input
              bind:value={email}
              type="text"
              name="email"
              id="email"
              class="w-full rounded-md border border-zinc-300 bg-transparent px-4 py-2 text-sm outline-none focus:border-zinc-500 focus:ring-4 focus:ring-zinc-200"
            />
          </div>

          <div class="mb-4">
            <Form.Label>Password</Form.Label>
            <input
              bind:value={password}
              type="password"
              name="password"
              id="password"
              class="w-full rounded-md border border-zinc-300 bg-transparent px-4 py-2 text-sm outline-none focus:border-zinc-500 focus:ring-4 focus:ring-zinc-200"
            />
          </div>

          <div class="mb-4">
            <Form.Label>Confirm Password</Form.Label>
            <input
              bind:value={confirm_password}
              type="password"
              name="confirm_password"
              id="confirm_password"
              class="w-full rounded-md border border-zinc-300 bg-transparent px-4 py-2 text-sm outline-none focus:border-zinc-500 focus:ring-4 focus:ring-zinc-200"
            />
          </div>

          <Button
            disabled={
              !email.value || !password.value || !confirm_password.value
                ? true
                : false
            }
            class="mt-8"
          >
            Sign up
          </Button>

          <p class="mt-4 text-center text-sm text-zinc-500">
            Already have an account?{" "}
            <Link
              href="/auth/login"
              class="font-semibold text-zinc-800 underline-offset-2 hover:underline"
            >
              Sign in
            </Link>
          </p>

          <div class="relative my-8 w-full border-t border-zinc-200">
            <span class="absolute left-1/2 top-1/2 block -translate-x-1/2 -translate-y-1/2 bg-white px-4 text-xs text-zinc-500">
              OR CONTINUE WITH
            </span>
          </div>

          <div class="flex space-x-2">
            <button class="flex w-full items-center justify-center space-x-3.5 rounded-md border border-zinc-200 bg-white px-4 py-2 text-sm font-medium text-emerald-700 outline-none ring-zinc-500 ring-offset-2 hover:bg-zinc-100 focus:border-zinc-500 focus:ring-2 active:bg-zinc-50">
              <BsGoogle class="h-4 w-4" />
              <span>Google</span>
            </button>
            <button class="flex w-full items-center justify-center space-x-4 rounded-md border border-zinc-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 outline-none ring-zinc-500 ring-offset-2 hover:bg-zinc-100 focus:border-zinc-500 focus:ring-2 active:bg-zinc-50">
              <BsGithub class="h-4 w-4" />
              <span>Github</span>
            </button>
          </div>
        </QwikForm>
      </Card>
    </div>
  );
});

export const head: DocumentHead = {
  title: "Sign up | Intasks",
  meta: [
    {
      name: "description",
      content: "Qwik site description",
    },
  ],
};
