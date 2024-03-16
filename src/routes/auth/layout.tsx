import { Slot, component$ } from "@builder.io/qwik";
import { Toaster, useToasterProvider } from "~/components/toast";

export default component$(() => {
  useToasterProvider();

  return (
    <div class="flex h-auto min-h-screen flex-col items-center justify-center px-6">
      <Toaster />
      <Slot />
    </div>
  );
});
