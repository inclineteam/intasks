import { component$ } from "@builder.io/qwik";
import {
  routeAction$,
  type DocumentHead,
  zod$,
  z,
  Form as QwikForm,
  routeLoader$,
} from "@builder.io/qwik-city";
import { BsGithub, BsGoogle } from "@qwikest/icons/bootstrap";
import { Card } from "~/components/card";
import { prisma } from "~/lib/db";
import { verifyPassword } from "qwik-lucia";
import { handleRequest, lucia } from "~/lib/lucia";
import { Form } from "~/components/form";

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

export const useLogin = routeAction$(
  async (form, event) => {
    const authRequest = handleRequest(event);

    const user = await prisma.user.findUnique({
      where: {
        email: form.email,
      },
    });

    if (!user) {
      return event.fail(404, {
        message: "User does not exist.",
      });
    }

    const passwordMatch = await verifyPassword(user.password, form.password);

    if (!passwordMatch) {
      return event.fail(400, {
        message: "Incorrect password.",
      });
    }

    const session = await lucia.createSession(user.id, {});

    authRequest.setSession(session);

    throw event.redirect(303, "/");
  },
  zod$({
    email: z.string(),
    password: z.string(),
  }),
);

export default component$(() => {
  const login = useLogin();

  return (
    <div class="w-full max-w-lg">
      <Card>
        <QwikForm action={login}>
          <div class="pb-8">
            <h1 class="text-2xl font-semibold tracking-tight text-zinc-700">
              Log in
            </h1>
            <p class="text-sm text-zinc-500">
              Get back on doing your amazing projects with your peers and
              friends!
            </p>
          </div>
          <div class="mb-4">
            <Form.Label>Email Address</Form.Label>
            <input
              type="text"
              name="email"
              id="email"
              class="w-full rounded-md border border-zinc-300 bg-transparent px-4 py-2 text-sm outline-none focus:border-zinc-500 focus:ring-4 focus:ring-zinc-200"
            />
          </div>

          <div class="mb-4">
            <Form.Label>Password</Form.Label>
            <input
              type="password"
              name="password"
              id="password"
              class="w-full rounded-md border border-zinc-300 bg-transparent px-4 py-2 text-sm outline-none focus:border-zinc-500 focus:ring-4 focus:ring-zinc-200"
            />
          </div>

          {login.value?.failed ? (
            <div class="rounded-md bg-rose-50 py-4 text-center text-sm text-rose-700">
              {login.value.message}
            </div>
          ) : null}

          <button class="mt-4 w-full rounded-md border border-transparent bg-zinc-800 px-4 py-2 text-sm font-medium text-white ring-zinc-500 ring-offset-2 hover:bg-zinc-600 focus:ring-2 active:bg-zinc-700">
            Log in
          </button>

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
  title: "Log in | Intasks",
  meta: [
    {
      name: "description",
      content: "Qwik site description",
    },
  ],
};
