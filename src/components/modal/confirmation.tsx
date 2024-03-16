import type { QRL, Signal } from "@builder.io/qwik";
import { $, component$ } from "@builder.io/qwik";
import { Modal } from "@qwik-ui/headless";
import { Button } from "../button";

interface IConfirmationModal {
  onConfirm$: QRL<() => any>;
  onCancel$?: QRL<() => any>;
  "bind:show": Signal;
  title: string;
  message: string;
}

export const ConfirmationModal = component$<IConfirmationModal>((props) => {
  return (
    <Modal
      bind:show={props["bind:show"]}
      class="modal-animation w-full max-w-xl overflow-auto rounded-xl p-8 backdrop:bg-black/40"
    >
      <h1 class="text-xl font-semibold tracking-tight text-zinc-800">
        {props.title}
      </h1>
      <p class="text-zinc-500">{props.message}</p>

      <footer class="mt-8 flex items-center justify-end gap-2">
        <Button
          onClick$={
            props.onCancel$
              ? props.onCancel$
              : $(() => (props["bind:show"].value = false))
          }
          variant="secondary"
          class="w-max"
        >
          Cancel
        </Button>
        <Button onClick$={props.onConfirm$} class="w-max">
          Confirm
        </Button>
      </footer>
    </Modal>
  );
});
