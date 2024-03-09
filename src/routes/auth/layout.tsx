import { Slot, component$ } from "@builder.io/qwik";

export default component$(() => {
  return (
    <div class="flex h-auto min-h-screen flex-col items-center justify-center">
      <Slot />
    </div>
  );
});
