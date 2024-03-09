import { type QwikIntrinsicElements, component$, Slot } from "@builder.io/qwik";
import clmrg from "~/lib/clmrg";

export const FormLabel = component$<QwikIntrinsicElements["label"]>((props) => {
  return (
    <label
      {...props}
      class={clmrg("mb-2 block text-sm font-medium text-zinc-700", props.class)}
    >
      <Slot />
    </label>
  );
});
