import { component$, Slot } from "@builder.io/qwik";
import { Toaster, useToasterProvider } from "../components/toast";

export default component$(() => {
  useToasterProvider();

  return (
    <>
      <Toaster />
      <Slot />
    </>
  );
});
