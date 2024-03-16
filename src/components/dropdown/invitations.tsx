import { $, component$, useSignal } from "@builder.io/qwik";
import { LuMail } from "@qwikest/icons/lucide";
import { Button } from "../button";
import { Show } from "~/ui/show";
import useTouchOutside from "~/hooks/touch-outside";
import type { Prisma } from "@prisma/client";
import { Badge } from "~/ui/badge";
import { Tab, TabList, TabPanel, Tabs } from "@qwik-ui/headless";
import clmrg from "~/lib/clmrg";

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
  sentInvitations: Prisma.InvitationGetPayload<{
    include: {
      sentTo: {
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
  ({ invitations, sentInvitations }) => {
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

        <div
          class={clmrg(
            "absolute right-0 top-full mt-2 min-w-[30rem] rounded-md border border-zinc-200 bg-white shadow-2xl shadow-black/[0.05] transition-all",
            dropdown.value
              ? "opacity-1 pointer-events-auto translate-y-0"
              : "pointer-events-none -translate-y-2 opacity-0",
          )}
        >
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
            <Tabs class="p-2">
              <TabList class="flex rounded-md bg-zinc-100 p-1">
                <Tab
                  class="flex-1 rounded py-1 text-sm font-semibold text-zinc-500"
                  selectedClassName="bg-white shadow-sm text-zinc-800"
                >
                  Received
                </Tab>
                <Tab
                  class="flex-1 rounded py-1 text-sm font-semibold text-zinc-500"
                  selectedClassName="bg-white shadow-sm text-zinc-800"
                >
                  Sent
                </Tab>
              </TabList>

              <TabPanel>
                {invitations.length ? (
                  <div>
                    {invitations.map((invitation) => (
                      <div key={invitation.id} class="group flex rounded p-3">
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
                                  class="w-max px-2.5 py-1 text-xs font-semibold"
                                >
                                  Decline
                                </Button>
                                <Button class="w-max px-2.5 py-1 text-xs font-semibold">
                                  <span>Join</span>
                                  {/* <LuArrowRight class="h-4 w-4" /> */}
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div class="mt-2 py-6 text-center text-sm text-zinc-500">
                    Nah you ain't have no invs
                  </div>
                )}
              </TabPanel>
              <TabPanel>
                <div class="pt-2">
                  {sentInvitations.length ? (
                    <div>
                      {sentInvitations.map((sentInvitation) => (
                        <div
                          key={sentInvitation.id}
                          class="flex rounded border-b border-zinc-200 p-3 last:border-transparent"
                        >
                          <div class="h-8 w-8 rounded-full bg-gradient-to-br from-cyan-400 to-violet-600"></div>
                          <div class="ml-2 text-sm">
                            <h1 class="font-semibold tracking-tight">
                              {sentInvitation.project.title}
                            </h1>
                            <p class="text-zinc-500">
                              Sent to{" "}
                              <span class="font-medium">
                                @{sentInvitation.sentTo.username}
                              </span>
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div class="py-6 text-center text-sm text-zinc-500">
                      Nah you ain't have no invs
                    </div>
                  )}
                </div>
              </TabPanel>
            </Tabs>
          </main>
        </div>
      </div>
    );
  },
);
