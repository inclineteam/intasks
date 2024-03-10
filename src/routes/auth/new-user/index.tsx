import { component$ } from "@builder.io/qwik";
import {
  routeAction$,
  type DocumentHead,
  zod$,
  z,
  Form as QwikForm,
  routeLoader$,
  useNavigate,
} from "@builder.io/qwik-city";
import { Card } from "~/components/card";
import { prisma } from "~/lib/db";
import { lucia } from "~/lib/lucia";
import { Form } from "~/components/form";
import { useToaster } from "~/components/toast";

export const useUser = routeLoader$(async (event) => {
  const cookie = event.cookie.get("intasks_cookie");

  if (!cookie) {
    throw event.redirect(302, "/auth/login");
  }

  const sessionId = lucia.readSessionCookie("intasks_cookie=" + cookie.value);

  if (!sessionId) {
    throw event.redirect(302, "/auth/login");
  }

  const { user } = await lucia.validateSession(sessionId);

  if (!user) {
    throw event.redirect(302, "/auth/login");
  }

  if (!user.isNew) {
    throw event.redirect(302, "/");
  }

  return user;
});

export const useCreateProfile = routeAction$(
  async (form, event) => {
    const cookie = event.cookie.get("intasks_cookie");

    if (!cookie) {
      throw event.redirect(302, "/auth/login");
    }

    const sessionId = lucia.readSessionCookie("intasks_cookie=" + cookie.value);

    if (!sessionId) {
      throw event.redirect(302, "/auth/login");
    }

    const { user } = await lucia.validateSession(sessionId);

    if (!user) {
      throw event.redirect(302, "/auth/login");
    }

    await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        isNew: false,
      },
    });

    const profile = await prisma.profile.create({
      data: {
        username: form.username,
        lastname: form.lastname,
        firstname: form.firstname,
        email: user.email,
        user: {
          connect: {
            id: user.id,
          },
        },
      },
    });

    // throw event.redirect(303, "/")
    return {
      success: true,
      profile,
    };
  },
  zod$({
    firstname: z.string(),
    lastname: z.string(),
    username: z.string(),
  }),
);

export default component$(() => {
  const createProfile = useCreateProfile();
  const user = useUser();
  const nav = useNavigate();
  const { toast } = useToaster();

  return (
    <div class="w-full max-w-lg">
      <Card>
        <QwikForm
          action={createProfile}
          onSubmitCompleted$={() => {
            if (createProfile.value?.success) {
              toast(
                `Welcome to Intasksm, ${createProfile.value.profile.firstname}!`,
                {
                  description:
                    "Your profile was successfully created. Build amazing projects!",
                },
              );
              nav("/");
            }
          }}
        >
          <div class="pb-8">
            <h1 class="text-2xl font-semibold tracking-tight text-zinc-700">
              Create your profile
            </h1>
            <p class="text-sm text-zinc-500">
              Get back on doing your amazing projects with your peers and
              friends!
            </p>
          </div>
          <div class="mb-8 flex items-end rounded-xl border border-zinc-200 p-4">
            <div class="h-20 w-20 rounded-full bg-gradient-to-br from-cyan-400 to-violet-600"></div>
            <button class="ml-4 rounded-md border border-zinc-200 px-2 py-1 text-sm font-medium shadow-sm hover:bg-zinc-100">
              Change
            </button>
          </div>

          <div class="mb-4 flex space-x-4">
            <div>
              <Form.Label>First name</Form.Label>
              <input
                type="text"
                name="firstname"
                id="firstname"
                class="w-full rounded-md border border-zinc-300 bg-transparent px-4 py-2 text-sm outline-none focus:border-zinc-500 focus:ring-4 focus:ring-zinc-200"
              />
            </div>
            <div>
              <Form.Label>Last name</Form.Label>
              <input
                type="text"
                name="lastname"
                id="last  name"
                class="w-full rounded-md border border-zinc-300 bg-transparent px-4 py-2 text-sm outline-none focus:border-zinc-500 focus:ring-4 focus:ring-zinc-200"
              />
            </div>
          </div>

          <div class="mb-4">
            <Form.Label>Username</Form.Label>
            <input
              type="text"
              name="username"
              id="username"
              value={user.value.username}
              class="w-full rounded-md border border-zinc-300 bg-transparent px-4 py-2 text-sm outline-none focus:border-zinc-500 focus:ring-4 focus:ring-zinc-200"
            />
          </div>

          <button class="mt-4 w-full rounded-md border border-transparent bg-zinc-800 px-4 py-2 text-sm font-medium text-white ring-zinc-500 ring-offset-2 hover:bg-zinc-600 focus:ring-2 active:bg-zinc-700">
            Create
          </button>
        </QwikForm>
      </Card>
    </div>
  );
});

export const head: DocumentHead = {
  title: "Welcome to Intasks!",
  meta: [
    {
      name: "description",
      content: "Qwik site description",
    },
  ],
};
