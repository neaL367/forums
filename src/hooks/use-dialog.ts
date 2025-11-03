"use client";

import { toast } from "sonner";
import { useActionState, useEffect, useRef, useState } from "react";

import type { FormState } from "@/types/formstate";

type UseDialogProps<TFormData> = {
  action: (
    prev: FormState<TFormData>,
    formData: FormData,
  ) => Promise<FormState<TFormData>>;
  initialState: FormState<TFormData>;
  loadingMessage?: string;
  onSuccessCallbackAction?: () => void;
};

export function useDialog<TFormData>({
  action,
  initialState,
  loadingMessage = "Processing...",
  onSuccessCallbackAction,
}: UseDialogProps<TFormData>) {
  const [open, setOpen] = useState(false);
  const loadingToastRef = useRef<string | number | null>(null);
  const hasShownSuccessToastRef = useRef(false);
  const hasCalledCallbackRef = useRef(false);

  const wrappedAction = async (
    prevState: FormState<TFormData>,
    formData: FormData,
  ) => {
    loadingToastRef.current = toast.loading(loadingMessage);
    hasShownSuccessToastRef.current = false;
    hasCalledCallbackRef.current = false;
    return action(prevState, formData);
  };

  const [state, formAction, pending] = useActionState(
    wrappedAction,
    initialState,
  );

  useEffect(() => {
    // Always dismiss loading toast when state changes (success or error)
    if (loadingToastRef.current && (state?.message || state?.success !== undefined)) {
      toast.dismiss(loadingToastRef.current);
      loadingToastRef.current = null;
    }

    if (!state?.message) return;

    if (state.success) {
      if (!hasShownSuccessToastRef.current) {
        hasShownSuccessToastRef.current = true;
        toast.success(state.message);
      }
      setOpen(false);
      if (onSuccessCallbackAction && !hasCalledCallbackRef.current) {
        hasCalledCallbackRef.current = true;
        onSuccessCallbackAction();
      }
    } else {
      toast.error(state.message);
    }
  }, [state, onSuccessCallbackAction]);

  const onOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    // Reset refs when dialog closes to allow fresh state on next open
    if (!newOpen) {
      hasShownSuccessToastRef.current = false;
      hasCalledCallbackRef.current = false;
    }
  };

  return {
    state,
    formAction,
    pending,
    open,
    onOpenChange,
  };
}
