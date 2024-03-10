import { component$, Slot } from "@builder.io/qwik";
import { Toaster, useToasterProvider } from "../components/toast";
import { Sidebar } from "~/components/sidebar/container";

export default component$(() => {
  useToasterProvider();

  return (
    <>
      <Toaster />
      <div class="flex min-h-screen bg-zinc-100">
        <Sidebar />

        <div class="flex-1 rounded-l-2xl border border-zinc-200 bg-white p-8">
          <Slot />
        </div>
      </div>
    </>
  );
});
