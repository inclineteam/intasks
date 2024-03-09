import { type RequestEventAction } from "@builder.io/qwik-city";
import { lucia } from "~/lib/lucia";

export const getSession = async (event: RequestEventAction) => {
  const cookie = event.cookie.get("intasks_cookie");

  if (!cookie) {
    return event.fail(404, {
      message: "Cookie not found",
      user: null,
      session: null,
    });
  }

  const sessionId = lucia.readSessionCookie("intasks_cookie=" + cookie.value);

  if (!sessionId) {
    return event.fail(404, {
      message: "Session ID not found",
      user: null,
      session: null,
    });
  }

  const { user, session } = await lucia.validateSession(sessionId);

  if (!user) {
    return event.fail(404, {
      message: "User not found",
      user: null,
      session: null,
    });
  }

  return { user, session, message: "User found" };
};
