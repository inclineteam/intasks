import type { RequestHandler } from "@builder.io/qwik-city";

export const onGet: RequestHandler = (event) => {
  throw event.redirect(308, "/dashboard");
};
