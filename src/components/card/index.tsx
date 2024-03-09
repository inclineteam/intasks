import { type QwikIntrinsicElements, Slot, component$ } from "@builder.io/qwik";
import clmrg from "~/lib/clmrg";

export const Card = component$<QwikIntrinsicElements["div"]>((props) => {
  return (
    <div
      {...props}
      class={clmrg(
        "rounded-lg border border-zinc-200 bg-white p-8 shadow-sm",
        props.class,
      )}
    >
      <Slot />
    </div>
  );
});
