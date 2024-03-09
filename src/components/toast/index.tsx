import {
  type Signal,
  useContextProvider,
  useSignal,
  createContextId,
  useContext,
  $,
  component$,
  useTask$,
  useId,
} from "@builder.io/qwik";
import { LuInfo, LuX } from "@qwikest/icons/lucide";

export interface ToastProps {
  title: string;
  description?: string;
  id: string;
  duration: number;
}

export function flip(toaster?: HTMLElement) {
  if (!toaster) return;
  const previous: Record<string, number> = {};
  const list = toaster.querySelectorAll("li");
  for (const item of list) {
    previous[item.id] = item.getBoundingClientRect().top;
  }
  const animate = () => {
    const newList = toaster.querySelectorAll("li");
    if (newList.length === list.length) requestAnimationFrame(animate);
    for (const item of newList) {
      const delta = previous[item.id] - item.getBoundingClientRect().top;
      if (delta) {
        item.animate(
          { transform: [`translateY(${delta}px)`, `translateY(0)`] },
          {
            duration: 150,
            easing: "ease-out",
          },
        );
      }
    }
  };
  requestAnimationFrame(animate);
}

export const ToasterContext = createContextId<{
  toaster: Signal<HTMLElement>;
  toasts: Signal<ToastProps[]>;
}>("toaster-context");

export const useToasterProvider = () => {
  const toaster = useSignal<HTMLElement>();
  const toasts = useSignal<ToastProps[]>([]);
  useContextProvider(ToasterContext, { toaster, toasts });
};

export const useToaster = () => {
  const { toaster, toasts } = useContext(ToasterContext);
  return {
    toast: $(
      (title: ToastProps["title"], options?: { description?: string }) => {
        flip(toaster.value);
        toasts.value = toasts.value.concat({
          title,
          description: options?.description,
          duration: 3000,
          id: crypto.randomUUID(),
        } as ToastProps);
      },
    ),
    remove: $((id: string) => {
      const index = toasts.value.findIndex((t) => t.id === id);
      toasts.value[index].duration = 0;
      toasts.value = [...toasts.value];
    }),
  };
};

export const Toaster = component$(() => {
  const { toaster, toasts } = useContext(ToasterContext);

  return (
    <ul
      ref={toaster}
      class="fixed bottom-0 right-2 z-50 flex flex-col gap-2 p-3"
    >
      {toasts.value.map((toast) => (
        <Toast key={toast.id} toast={toast} />
      ))}
    </ul>
  );
});

export const Toast = component$(({ toast }: { toast: ToastProps }) => {
  const itemId = useId();
  const leaving = useSignal(false);
  const entered = useSignal(false);
  const { toasts, toaster } = useContext(ToasterContext);

  useTask$(({ track }) => {
    track(() => toast.duration);
    track(() => entered.value);
    const remove = () => {
      flip(toaster.value);
      toasts.value = toasts.value.filter((t) => t.id !== toast.id);
    };
    const leave = () => {
      leaving.value = true;
      setTimeout(remove, 300);
    };

    if (!toast.duration) return leave();

    const timeout = setTimeout(leave, toast.duration);

    if (entered.value) {
      clearTimeout(timeout);
    }

    return () => clearTimeout(timeout);
  });

  return (
    <li
      id={itemId}
      onMouseEnter$={() => (entered.value = true)}
      class={[
        "toast-item relative min-w-[20rem] rounded-md border border-zinc-900 bg-zinc-800 px-4 py-3 text-white shadow-xl shadow-black/[0.05]",
        leaving.value ? "leave" : "",
      ]}
    >
      <output class="flex space-x-3">
        <div>
          <LuInfo class="h-5 w-5 text-white" />
        </div>
        <div class="flex-1 text-sm">
          <p class="mb-0.5 font-semibold text-white">{toast.title}</p>
          <p class="text-zinc-400">{toast.description}</p>
        </div>
        <div class="flex items-center justify-center pl-4">
          <button
            onClick$={() => {
              flip(toaster.value);
              toasts.value = toasts.value.filter((t) => t.id !== toast.id);
            }}
          >
            <LuX class="h-5 w-5 text-zinc-400" />
          </button>
        </div>
      </output>
    </li>
  );
});
