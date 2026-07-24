"use client";

import { useActionState } from "react";

export type FormState = { status: "idle" | "success" | "error"; message: string };

const IDLE: FormState = { status: "idle", message: "" };

/**
 * A <form> that owns its own useActionState. Because it's meant to be rendered
 * only while a modal is open, its action state (success/error message, pending)
 * resets every time the modal opens — no stale messages on reopen. Calls
 * onSuccess inside the action (not an effect), so modal-close stays lint-clean.
 */
export function ActionForm({
  action,
  onSuccess,
  className,
  children,
}: {
  action: (prev: FormState, formData: FormData) => Promise<FormState>;
  onSuccess?: () => void;
  className?: string;
  children: (state: FormState, pending: boolean) => React.ReactNode;
}) {
  const [state, dispatch, pending] = useActionState(async (prev: FormState, formData: FormData) => {
    const res = await action(prev, formData);
    if (res.status === "success") onSuccess?.();
    return res;
  }, IDLE);

  return (
    <form action={dispatch} className={className} suppressHydrationWarning>
      {children(state, pending)}
    </form>
  );
}
