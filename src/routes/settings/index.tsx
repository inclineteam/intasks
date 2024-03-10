import { component$ } from "@builder.io/qwik";
import { Link, routeAction$ } from "@builder.io/qwik-city";
import { LuChevronLeft } from "@qwikest/icons/lucide";
import { Card } from "~/components/card";
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
  return (
    <>
      <header class="border-b pb-4">
        <Link href="/dashboard/" class="flex items-center space-x-2">
          <LuChevronLeft class="h-6 w-6" />
          <p class="text-2xl font-semibold tracking-tight">Settings</p>
        </Link>
      </header>
      <Card class="mt-8">
        <div class="flex gap-6">
          <button onClick$={() => logout.submit()}>Logout</button>
        </div>
      </Card>
    </>
  );
});
