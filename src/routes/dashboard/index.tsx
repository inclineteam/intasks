import { component$ } from "@builder.io/qwik";
import { type DocumentHead, routeLoader$ } from "@builder.io/qwik-city";
import { Card } from "~/components/card";
import { prisma } from "~/lib/db";
import { useUser } from "../plugin@auth";
import { CreateProjectModal } from "~/components/modal/create-project";

export const useFeed = routeLoader$(async (event) => {
  const profile = await event.resolveValue(useUser);

  const projects = await prisma.project.findMany({
    where: { createdById: profile?.id },
    include: {
      collaborators: true,
    },
  });

  const inCollaborationProjects = await prisma.project.findMany({
    where: {
      collaborators: {
        every: {
          userId: profile?.id,
        },
      },
    },
  });

  const tasks = await prisma.task.findMany({
    where: {
      assignedId: profile?.id,
      status: "INPROGRESS",
    },
  });

  return { projects, inCollaborationProjects, tasks };
});

export default component$(() => {
  const profile = useUser();
  const feed = useFeed();

  return (
    <>
      <div class="mb-8 flex items-center justify-between space-x-2">
        <div class="flex space-x-2">
          <div class="h-10 w-10 rounded-full bg-gradient-to-br from-cyan-400 to-violet-600"></div>
          <div>
            <p class="font-semibold leading-none">
              {profile.value?.firstname} {profile.value?.lastname}
            </p>
            <p class="text-zinc-500">@{profile.value?.username}</p>
          </div>
        </div>
        <div>
          <CreateProjectModal />
        </div>
      </div>

      <h1 class="mb-4 mt-8 font-semibold uppercase tracking-tight text-zinc-800">
        As of today you've made
      </h1>
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

      <h1 class="mb-4 mt-8 font-semibold uppercase tracking-tight text-zinc-800">
        Projects
      </h1>
      {feed.value.projects.length ? (
        feed.value.projects.map((project) => (
          <div
            key={project.id}
            class="w-max rounded-md border border-zinc-200 p-8 shadow-sm"
          >
            <h1 class="mb-2 text-2xl font-semibold tracking-tighter text-zinc-800">
              {project.title}
            </h1>
            <div>
              <p class="text-sm text-zinc-500">
                {project.collaborators.length} Collaborators
              </p>
            </div>
          </div>
        ))
      ) : (
        <div class="rounded-md border border-dashed border-zinc-200 py-12 text-center text-zinc-500">
          You have no projects yet.
        </div>
      )}

      <h1 class="mb-4 mt-8 font-semibold uppercase tracking-tight text-zinc-800">
        Tasks
      </h1>
      {feed.value.tasks.length ? (
        feed.value.tasks.map((project) => (
          <div key={project.id}>{project.title}</div>
        ))
      ) : (
        <div class="rounded-md border border-dashed border-zinc-200 py-12 text-center text-zinc-500">
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
