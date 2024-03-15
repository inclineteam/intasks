import { $, component$, useSignal } from "@builder.io/qwik";
import { LuArrowRight, LuMail } from "@qwikest/icons/lucide";
import { Button } from "../button";
import { Show } from "~/ui/show";
import useTouchOutside from "~/hooks/touch-outside";
import type { Prisma } from "@prisma/client";
import { Badge } from "~/ui/badge";

interface InvDropdown {
  invitations: Prisma.InvitationGetPayload<{
    include: {
      sentBy: {
        select: {
          username: true;
        };
      };

      project: {
        select: {
          title: true;
          collaborators: true;
        };
      };
    };
  }>[];
}

export const InvitationsDropdown = component$<InvDropdown>(
  ({ invitations }) => {
    const dropdown = useSignal<boolean>(false);
    const { safeAreaRef } = useTouchOutside($(() => (dropdown.value = false)));

    return (
      <div ref={safeAreaRef} class="relative">
        <Button
          class="relative p-2"
          variant="secondary"
          onClick$={() => (dropdown.value = !dropdown.value)}
        >
          <div>
            <Show when={invitations.length ? true : false}>
              <Badge>{invitations.length}</Badge>
            </Show>

            <LuMail class="h-5 w-5" />
          </div>
        </Button>

        <Show when={dropdown.value}>
          <div class="absolute right-0 top-full mt-2 min-w-[30rem] rounded-md border border-zinc-200 bg-white shadow-2xl shadow-black/[0.05]">
            <header class="flex items-end justify-between border-b border-zinc-200 px-5 py-3">
              <p class="font-semibold tracking-tight">Invitations</p>

              <Button
                variant="secondary"
                class="w-max px-2.5 py-1 text-xs font-semibold"
              >
                <span>Decline all</span>
              </Button>
            </header>
            <main>
              {invitations.length ? (
                <div>
                  {invitations.map((invitation) => (
                    <div key={invitation.id} class="group flex rounded p-5">
                      <div class="h-8 w-8 rounded-full bg-gradient-to-br from-cyan-400 to-violet-600"></div>
                      <div class="ml-2 flex-1">
                        <p class="text-sm font-semibold">
                          {invitation.sentBy.username}
                        </p>

                        <div class="mt-2 w-full overflow-hidden rounded border bg-white">
                          <div class="p-4">
                            <p class="mb-2 text-sm text-zinc-500">
                              I would like to work with you on my project
                            </p>
                            <h1 class="font-semibold tracking-tight">
                              {invitation.project.title}
                            </h1>
                            <p class="text-sm text-zinc-500">
                              {invitation.project.collaborators.length}{" "}
                              collaborators
                            </p>

                            <div class="flex justify-end gap-2">
                              <Button
                                variant="secondary"
                                class="w-max text-xs font-semibold"
                              >
                                Decline
                              </Button>
                              <Button class="w-max text-xs font-semibold">
                                <span>Join</span>
                                <LuArrowRight class="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div></div>
              )}
            </main>
          </div>
        </Show>
      </div>
    );
  },
);
