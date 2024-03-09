import { component$ } from "@builder.io/qwik";
import {
  Link,
  type DocumentHead,
  routeAction$,
  routeLoader$,
} from "@builder.io/qwik-city";
import { Card } from "~/components/card";
import { handleRequest, lucia } from "~/lib/lucia";

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

  return user;
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

  return (
    <Card class="m-8">
      <h1 class="text-xl">Hi 👋</h1>
      <div class="flex gap-6">
        <Link href="/auth/login">
          <button>Login</button>
        </Link>
        <Link href="/auth/login">
          <button onClick$={() => logout.submit()}>Logout</button>
        </Link>
        <Link href="/auth/signup">
          <button>Signup</button>
        </Link>
      </div>
    </Card>
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
