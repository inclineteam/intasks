import { component$, Slot } from "@builder.io/qwik";
import { Toaster, useToasterProvider } from "~/components/toast";
import { Sidebar } from "~/components/sidebar/container";

export default component$(() => {
  useToasterProvider();

  return (
    <>
      <Toaster />
      <div class="flex min-h-screen bg-zinc-100">
        <Sidebar />

        <div class="flex flex-1 p-4">
          <div class="flex-1 rounded-2xl border-zinc-200 bg-white p-8">
            <Slot />
          </div>
        </div>
      </div>
    </>
  );
});
