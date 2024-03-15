import { type QwikIntrinsicElements, Slot, component$ } from "@builder.io/qwik";
import clmrg from "~/lib/clmrg";

export const Badge = component$<QwikIntrinsicElements["div"]>((props) => {
  return (
    <div
      {...props}
      class={clmrg(
        "absolute -right-2 -top-2 rounded-full border-2 border-white bg-red-600 px-2 py-0.5 text-xs text-white",
        props.class,
      )}
    >
      <Slot />
    </div>
  );
});
