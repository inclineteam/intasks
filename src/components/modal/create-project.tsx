import { component$, useSignal } from "@builder.io/qwik";
import { Modal } from "@qwik-ui/headless";
import { LuAtSign, LuPlus } from "@qwikest/icons/lucide";
import { Button } from "../button";
import { Form } from "../form";
import { server$, useLocation, useNavigate } from "@builder.io/qwik-city";
import { prisma } from "~/lib/db";
import { useUser } from "~/routes/plugin@auth";
import { useToaster } from "../toast";

interface InvitedUser {
  id: string;
  avatar: string | null;
  username: string;
}

const fetchUser = server$(async (username: string) => {
  const user = await prisma.profile.findUnique({
    where: {
      username,
    },
  });

  if (!user) {
    return {
      user: null,
    };
  }

  return { user };
});

const createProject = server$(async function (
  title: string,
  invitedUsers: InvitedUser[],
  sentById: string | undefined,
) {
  if (!sentById) {
    return {
      success: false,
      message: "No user was found!",
    };
  }

  const project = await prisma.project.create({
    data: {
      title,
      createdBy: {
        connect: {
          id: sentById,
        },
      },
    },
  });

  if (invitedUsers.length) {
    const inviteUsers = async () => {
      return Promise.all(
        invitedUsers.map(async (invitedUser) => {
          await prisma.invitation.create({
            data: {
              project: {
                connect: {
                  id: project.id,
                },
              },
              sentBy: {
                connect: {
                  id: sentById,
                },
              },
              sentTo: {
                connect: {
                  id: invitedUser.id,
                },
              },
            },
          });
        }),
      );
    };

    try {
      await inviteUsers();
      return {
        success: true,
        message: "Successfully created project!",
      };
    } catch (err) {
      return {
        success: false,
        message: "An error occurred while trying to create project!",
      };
    }
  }

  return {
    success: true,
    message: "Successfully created project!",
  };
});

export const CreateProjectModal = component$(() => {
  const createProjectModal = useSignal(false);
  const invitedUsers = useSignal<InvitedUser[]>([]);
  const username = useSignal("");
  const title = useSignal("");
  const error = useSignal(false);
  const user = useUser();
  const { toast } = useToaster();
  const nav = useNavigate();
  const loc = useLocation();

  return (
    <>
      <Modal
        bind:show={createProjectModal}
        class="modal-animation w-full max-w-xl overflow-auto rounded-xl p-8 backdrop:bg-black/40"
      >
        <h1 class="text-2xl font-semibold tracking-tight">Create project</h1>
        <div class="mt-8">
          <div class="mb-4">
            <Form.Label>Project title</Form.Label>
            <input
              bind:value={title}
              type="text"
              name="confirm_password"
              id="confirm_password"
              class="w-full rounded-md border border-zinc-300 bg-transparent px-4 py-2 text-sm outline-none focus:border-zinc-500 focus:ring-4 focus:ring-zinc-200"
            />
          </div>

          <div class="mb-4">
            <Form.Label>Invite collaborators</Form.Label>
            <div class="rounded-md border border-zinc-300">
              <div class="relative flex items-center p-1 px-4 pr-1">
                <div>
                  <LuAtSign class="h-4 w-4 text-zinc-500" />
                </div>
                <input
                  bind:value={username}
                  type="text"
                  placeholder="username"
                  class="flex-1 px-2 py-1 text-sm font-medium outline-none placeholder:text-zinc-400"
                />
                <Button
                  onClick$={async () => {
                    const data = await fetchUser(username.value);
                    if (!data.user) {
                      error.value = true;
                    } else {
                      error.value = false;
                      invitedUsers.value = [
                        ...invitedUsers.value,
                        {
                          id: data.user.id,
                          username: data.user.username,
                          avatar: data.user.avatar,
                        },
                      ];
                      username.value = "";
                    }
                  }}
                  variant="secondary"
                  class="ml-1 w-max space-x-1 rounded px-2 py-0.5"
                >
                  <LuPlus class="h-4 w-4" />
                  <span>Add</span>
                </Button>
              </div>

              {invitedUsers.value.length ? (
                <div class="border-t border-zinc-200 p-4">
                  {invitedUsers.value.map((invitedUser) => (
                    <div
                      key={invitedUser.id}
                      class="flex w-max items-center space-x-1 rounded bg-zinc-100 px-2 py-1"
                    >
                      <div class="h-5 w-5 rounded-full bg-gradient-to-br from-cyan-400 to-violet-600"></div>
                      <p class="text-sm font-semibold text-zinc-800">
                        {invitedUser.username}
                      </p>
                    </div>
                  ))}
                </div>
              ) : null}
            </div>
            {error.value && (
              <small class="mt-1 block text-rose-700">
                This user does not exist.
              </small>
            )}
            <small class="text-zinc-500">
              This will notify the users with the invitation.
            </small>
          </div>

          <div class="flex justify-end space-x-2">
            <Button
              variant="secondary"
              onClick$={() => (createProjectModal.value = false)}
              class="mt-8 w-max"
            >
              Cancel
            </Button>
            <Button
              disabled={title.value ? false : true}
              onClick$={async () => {
                const createdProject = await createProject(
                  title.value,
                  invitedUsers.value,
                  user.value?.id,
                );
                if (createdProject.success) {
                  toast("Success", { description: createdProject.message });
                } else {
                  toast("Error", { description: createdProject.message });
                }

                createProjectModal.value = false;
                nav(loc.url.pathname);
              }}
              class="mt-8 w-max"
            >
              Create
            </Button>
          </div>
        </div>
      </Modal>

      <Button onClick$={() => (createProjectModal.value = true)}>
        <LuPlus class="h-4 w-4" />
        <span>Create project</span>
      </Button>
    </>
  );
});
