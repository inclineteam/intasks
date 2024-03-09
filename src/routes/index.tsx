import { component$ } from "@builder.io/qwik";
import {
  Link,
  type DocumentHead,
  routeAction$,
  routeLoader$,
} from "@builder.io/qwik-city";
import { Card } from "~/components/card";
import { handleRequest, lucia } from "~/lib/lucia";
import Logo from "../../public/logo.svg?jsx";
import { prisma } from "~/lib/db";
import { LuCheckSquare, LuHome, LuSettings } from "@qwikest/icons/lucide";
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

  if (user.isNew) throw event.redirect(302, "/auth/new-user");

  const profile = await prisma.profile.findUnique({
    where: { userId: user.id },
  });

  return profile;
});

export const useFeed = routeLoader$(async (event) => {
  const user = await event.resolveValue(useUser);

  if (!user) {
    throw event.redirect(302, "/auth/login");
  }

  const projects = await prisma.project.findMany({ where: { id: user.id } });

  const inCollaborationProjects = await prisma.project.findMany({
    where: {
      collaborators: {
        every: {
          userId: user.id,
        },
      },
    },
  });

  const tasks = await prisma.task.findMany({
    where: {
      assignedId: user.id,
      status: "INPROGRESS",
    },
  });

  return { projects, inCollaborationProjects, tasks };
});

export const useLogoutUserAction = routeAction$(async (values, event) => {
  const authRequest = handleRequest(event);
  const { session } = await authRequest.validateUser();

  if (!session) throw event.redirect(302, "/login");

  // Remove the session from the database and from the cookie - Logout
  await authRequest.invalidateSessionCookie(session);

  throw event.redirect(302, "/auth/login");
});

export default component$(() => {
  const logout = useLogoutUserAction();
  const profile = useUser();
  const feed = useFeed();
  const { toast } = useToaster();

  return (
    <div class="flex min-h-screen bg-zinc-100">
      <div class="min-w-[18rem] px-10 pt-10">
        <header class="flex space-x-2">
          <Logo class="h-8 w-8" />
          <p class="text-2xl font-bold tracking-tight text-zinc-800">Intasks</p>
        </header>

        <hr class="my-8" />

        <nav>
          <ul class="space-y-2">
            <li>
              <Link
                href="/"
                class="flex space-x-3 rounded-md bg-zinc-800 px-4 py-2 text-sm font-medium text-white"
              >
                <LuHome class="h-5 w-5" />
                <span>Projects</span>
              </Link>
            </li>
            <li>
              <Link
                href="/"
                class="flex space-x-3 rounded-md px-4 py-2 text-sm font-medium text-zinc-600 hover:bg-zinc-200 hover:text-zinc-800"
              >
                <LuCheckSquare class="h-5 w-5" />
                <span>Tasks</span>
              </Link>
            </li>
            <li>
              <Link
                href="/"
                class="flex space-x-3 rounded-md px-4 py-2 text-sm font-medium text-zinc-600 hover:bg-zinc-200 hover:text-zinc-800"
              >
                <LuSettings class="h-5 w-5" />
                <span>Settings</span>
              </Link>
            </li>
          </ul>
        </nav>
      </div>

      <div class="flex-1 rounded-l-2xl border border-zinc-200 bg-white p-8">
        <div class="mb-8 flex items-center justify-between space-x-2">
          <div class="flex space-x-2">
            <div class="h-10 w-10 rounded-full bg-gradient-to-br from-cyan-400 to-violet-600"></div>
            <div>
              <p class="font-medium leading-none">
                {profile.value?.firstname} {profile.value?.lastname}
              </p>
              <p class="text-zinc-500">{profile.value?.username}</p>
            </div>
          </div>
          <div>
            <button class="w-max rounded-md border border-transparent bg-zinc-800 px-4 py-2 text-sm font-medium text-white ring-zinc-500 ring-offset-2 hover:bg-zinc-600 focus:ring-2 active:bg-zinc-700">
              Create project
            </button>
          </div>
        </div>

        <div class="flex gap-4">
          <Card class="mb-4 w-full max-w-xs">
            <h1 class="text-5xl font-semibold">{feed.value.projects.length}</h1>
            <p class="mt-2 text-zinc-500">Projects</p>
          </Card>

          <Card class="mb-4 w-full max-w-xs">
            <h1 class="text-5xl font-semibold">
              {feed.value.inCollaborationProjects.length}
            </h1>
            <p class="mt-2 text-zinc-500">In collaboration projects</p>
          </Card>

          <Card class="mb-4 w-full max-w-xs">
            <h1 class="text-5xl font-semibold">{feed.value.tasks.length}</h1>
            <p class="mt-2 text-zinc-500">On-going tasks</p>
          </Card>
        </div>

        <h1 class="mb-4 mt-8 text-2xl font-semibold tracking-tight">
          Your projects
        </h1>

        {feed.value.projects.length ? (
          feed.value.projects.map((project) => (
            <div key={project.id}>{project.title}</div>
          ))
        ) : (
          <div class="rounded-md border border-dashed border-zinc-200 py-8 text-center text-zinc-500">
            You have no projects yet.
          </div>
        )}

        <Card class="mt-8">
          <h1 class="text-xl">Hi, {profile.value?.username} 👋</h1>
          <hr class="my-4" />
          <div class="flex gap-6">
            <Link href="/auth/login">
              <button>Login</button>
            </Link>
            <button onClick$={() => logout.submit()}>Logout</button>
            <Link href="/auth/signup">
              <button>Signup</button>
            </Link>
          </div>

          <button
            onClick$={() =>
              toast("Hey", { description: "This is description" })
            }
          >
            Toast
          </button>
        </Card>
      </div>
    </div>
  );
});

export const head: DocumentHead = {
  title: "Intasks",
  meta: [
    {
      name: "description",
      content: "Qwik site description",
    },
  ],
};
