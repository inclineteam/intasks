import { Slot, component$ } from "@builder.io/qwik";
import { FormLabel } from "./label";
import { Form as QwikForm } from "@builder.io/qwik-city";

const FormContainer = component$(() => {
  return (
    <QwikForm>
      <Slot />
    </QwikForm>
  );
});

export const Form = FormContainer as typeof FormContainer & {
  Label: typeof FormLabel;
};

Form.Label = FormLabel;
