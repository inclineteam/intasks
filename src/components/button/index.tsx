import { type QwikIntrinsicElements, component$, Slot } from "@builder.io/qwik";
import clmrg from "~/lib/clmrg";

type ButtonProps = {
  variant?: "primary" | "secondary";
} & QwikIntrinsicElements["button"];

export const Button = component$<ButtonProps>(
  ({ variant = "primary", ...props }) => {
    const variants = {
      primary: "bg-zinc-800 text-white hover:bg-zinc-600 active:bg-zinc-700",
      secondary:
        "hover:bg-zinc-100 border-zinc-200 focus:border-zinc-500 text-zinc-800 active:bg-zinc-50",
    };

    return (
      <button
        {...props}
        class={clmrg(
          "flex w-full items-center justify-center space-x-2.5 rounded-md border border-transparent px-4 py-2 text-sm font-medium ring-zinc-500 ring-offset-2 focus:ring-2",
          variants[variant],
          props.class,
        )}
      >
        <Slot />
      </button>
    );
  },
);
