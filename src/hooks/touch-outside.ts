import { $, type QRL, useOnWindow, useSignal } from "@builder.io/qwik";

export default function useTouchOutside(action: QRL<() => any>) {
  const safeAreaRef = useSignal<Element>();

  // useTask$(({ track }) => {
  //   track(() => safeAreaRef)

  // })

  const handleClickOutside = $((e: MouseEvent) => {
    if (safeAreaRef.value && !safeAreaRef.value.contains(e.target as Node)) {
      action();
    }
  });

  useOnWindow("mousedown", handleClickOutside);

  return {
    safeAreaRef,
  };
}
