import { component$, useSignal } from "@builder.io/qwik";
import { Link, routeAction$ } from "@builder.io/qwik-city";
import { LuChevronDown, LuChevronLeft } from "@qwikest/icons/lucide";
import { Button } from "~/components/button";
import { ConfirmationModal } from "~/components/modal/confirmation";
import { handleRequest } from "~/lib/lucia";

export const useLogoutUserAction = routeAction$(async (_, event) => {
  const authRequest = handleRequest(event);
  const { session } = await authRequest.validateUser();

  if (!session) throw event.redirect(302, "/login");

  await authRequest.invalidateSessionCookie(session);

  throw event.redirect(302, "/auth/login");
});

export default component$(() => {
  const logout = useLogoutUserAction();
  const showConfirm = useSignal(false);

  return (
    <>
      <header class="border-b pb-4">
        <Link href="/dashboard/" class="flex items-center space-x-2">
          <LuChevronLeft class="h-6 w-6" />
          <p class="text-xl font-semibold tracking-tight">Settings</p>
        </Link>
      </header>

      <div class="flex justify-center pt-10">
        <div class="w-full max-w-2xl divide-y [&>div]:py-4">
          <div class="flex items-center justify-between">
            <div>
              <h1 class="font-semibold tracking-tight">Appearance</h1>
              <p class="text-zinc-500">Switch to dark or light mode.</p>
            </div>
            <div>
              <Button variant="secondary">
                <span>Light mode</span>
                <LuChevronDown class="h-5 w-5" />
              </Button>
            </div>
          </div>

          <div class="flex items-center justify-between">
            <div>
              <h1 class="font-semibold tracking-tight">Log out</h1>
              <p class="text-zinc-500">Signs you out of your account.</p>
            </div>
            <div>
              <Button onClick$={() => (showConfirm.value = true)}>
                Logout
              </Button>

              <ConfirmationModal
                bind:show={showConfirm}
                title="Are you sure?"
                message="Do you really want to sign out of your account?"
                onConfirm$={() => logout.submit()}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
});
