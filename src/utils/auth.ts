/* eslint-disable qwik/loader-location */
import { routeLoader$ } from "@builder.io/qwik-city";
import { lucia } from "~/lib/lucia";
import { prisma } from "~/lib/db";

export const useUser = routeLoader$(async (event) => {
  if (event.url.pathname.split("/")[1] === "auth") {
    const cookie = event.cookie.get("intasks_cookie");

    if (!cookie) {
      return;
    }

    return;
  } else {
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

    if (!profile) {
      throw event.redirect(302, "/auth/login");
    }

    return profile;
  }
});
