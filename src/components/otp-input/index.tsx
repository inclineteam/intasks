import { $, type QRL, component$, useSignal } from "@builder.io/qwik";

type InputProps = {
  length?: number;
  onComplete$: QRL<(pin: string) => void>;
};

export const OTPInput = component$<InputProps>(
  ({ length = 6, onComplete$ }) => {
    const inputRef = useSignal<HTMLInputElement[]>(Array(length).fill(null));
    const otp = useSignal<string[]>(Array(length).fill(""));

    const handleChange = $((input: string, index: number) => {
      const newPin = [...otp.value];
      newPin[index] = input;
      otp.value = newPin;

      if (input.length === 1 && index < length - 1) {
        inputRef.value[index + 1]?.focus();
      }

      if (input.length === 0 && index > 0) {
        inputRef.value[index - 1]?.focus();
      }

      if (newPin.every((digit) => digit !== "")) {
        onComplete$(newPin.join(""));
      }
    });

    return (
      <div class="flex gap-2">
        {Array.from({ length }, (_, index) => (
          <input
            key={index}
            type="text"
            maxLength={1}
            value={otp.value[index]}
            onInput$={(_, target) => handleChange(target.value, index)}
            ref={(ref) => (inputRef.value[index] = ref)}
            class={`border-border-slate-500 w-full rounded-md border border-zinc-300 px-4 py-2 text-2xl outline-none focus:border-zinc-500 focus:ring-4 focus:ring-zinc-200`}
          />
        ))}
      </div>
    );
  },
);
