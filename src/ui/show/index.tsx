import { Slot, component$ } from "@builder.io/qwik";

interface ShowProps {
  when: boolean;
}

export const Show = component$<ShowProps>(({ when }) => {
  return when ? <Slot /> : null;
});
