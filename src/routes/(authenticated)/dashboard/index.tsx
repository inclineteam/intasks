import { component$ } from "@builder.io/qwik";
import { type DocumentHead, routeLoader$, Link } from "@builder.io/qwik-city";
import { Card } from "~/components/card";
import { prisma } from "~/lib/db";
import { useUser } from "../../plugin@auth";
import { CreateProjectModal } from "~/components/modal/create-project";
import { InvitationsDropdown } from "~/components/dropdown/invitations";
import { Button } from "~/components/button";
import { LuBell, LuSettings } from "@qwikest/icons/lucide";

export const useFeed = routeLoader$(async (event) => {
  const profile = await event.resolveValue(useUser);

  const projects = await prisma.project.findMany({
    where: { createdById: profile?.id },
    include: {
      collaborators: true,
    },
  });

  const ongoingTasks = await prisma.task.findMany({
    where: {
      assignedId: profile?.id,
      status: "INPROGRESS",
    },
  });

  const completedTasks = await prisma.task.findMany({
    where: {
      assignedId: profile?.id,
      status: "FINISHED",
    },
  });

  const invitations = await prisma.invitation.findMany({
    include: {
      sentBy: {
        select: {
          username: true,
        },
      },

      project: {
        select: {
          title: true,
          collaborators: true,
        },
      },
    },
  });

  return {
    projects,
    ongoingTasks,
    completedTasks,
    invitations,
  };
});

export default component$(() => {
  const profile = useUser();
  const feed = useFeed();

  return (
    <>
      <div class="mb-8 flex items-center justify-between space-x-2">
        <div class="flex items-center space-x-2">
          <div class="h-10 w-10 rounded-full bg-gradient-to-br from-cyan-400 to-violet-600"></div>
          <div class="text-sm">
            <p class="font-semibold leading-none">
              {profile.value?.firstname} {profile.value?.lastname}
            </p>
            <p class="text-zinc-500">@{profile.value?.username}</p>
          </div>
        </div>
        <div class="flex items-center gap-4">
          <Button class="w-max p-2" variant="secondary">
            <LuBell class="h-5 w-5" />
          </Button>
          <InvitationsDropdown invitations={feed.value.invitations} />
          <CreateProjectModal />
          <Link href="/settings">
            <Button class="p-2" variant="secondary">
              {/* <Button variant="secondary" class="p-2"> */}
              <LuSettings class="h-5 w-5" />
            </Button>
          </Link>
        </div>
      </div>

      <h1 class="mb-4 mt-8 text-xl font-semibold tracking-tight first-letter:text-zinc-800">
        As of today, you have
      </h1>
      <div class="flex flex-wrap gap-4">
        <Card class="w-full max-w-xs">
          <h1 class="text-5xl font-semibold">{feed.value.projects.length}</h1>
          <p class="mt-2 text-zinc-500">Projects</p>
        </Card>
        <Card class="w-full max-w-xs">
          <h1 class="text-5xl font-semibold">
            {feed.value.ongoingTasks.length}
          </h1>
          <p class="mt-2 text-zinc-500">Ongoing tasks</p>
        </Card>
        <Card class="w-full max-w-xs">
          <h1 class="text-5xl font-semibold">
            {feed.value.completedTasks.length}
          </h1>
          <p class="mt-2 text-zinc-500">Completed tasks</p>
        </Card>
        <Card class="w-full max-w-xs">
          <h1 class="text-5xl font-semibold">
            {feed.value.invitations.length}
          </h1>
          <p class="mt-2 text-zinc-500">Invitations</p>
        </Card>
      </div>

      <h1 class="mb-4 mt-8 text-xl font-semibold tracking-tight text-zinc-800">
        Projects
      </h1>
      {feed.value.projects.length ? (
        <div class="grid grid-cols-4">
          {feed.value.projects.map((project) => (
            <div
              key={project.id}
              class="rounded-md border border-zinc-200 p-8 shadow-sm"
            >
              <span class="mb-2 block w-max rounded-full text-sm font-medium text-orange-600">
                Ongoing
              </span>
              <h1 class="mb-2 text-2xl font-semibold tracking-tighter text-zinc-800">
                {project.title}
              </h1>
              <div>
                <p class="text-zinc-500">
                  {project.collaborators.length} Collaborators
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div class="rounded-md border border-dashed border-zinc-200 py-16 text-center text-zinc-500">
          You have no projects yet.
        </div>
      )}

      <h1 class="mb-4 mt-8 text-xl font-semibold tracking-tight text-zinc-800">
        Tasks
      </h1>
      {feed.value.ongoingTasks.length ? (
        feed.value.ongoingTasks.map((project) => (
          <div key={project.id}>{project.title}</div>
        ))
      ) : (
        <div class="rounded-md border border-dashed border-zinc-200 py-16 text-center text-zinc-500">
          You have no any on-going tasks yet.
        </div>
      )}
    </>
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
