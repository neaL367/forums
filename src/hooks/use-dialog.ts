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

  const wrappedAction = async (
    prevState: FormState<TFormData>,
    formData: FormData,
  ) => {
    loadingToastRef.current = toast.loading(loadingMessage);
    hasShownSuccessToastRef.current = false;
    return action(prevState, formData);
  };

  const [state, formAction, pending] = useActionState(
    wrappedAction,
    initialState,
  );

  useEffect(() => {
    if (!state?.message) return;

    if (loadingToastRef.current) {
      toast.dismiss(loadingToastRef.current);
      loadingToastRef.current = null;
    }

    if (state.success) {
      if (!hasShownSuccessToastRef.current) {
        hasShownSuccessToastRef.current = true;
        toast.success(state.message);
      }
      setOpen(false);
      onSuccessCallbackAction?.();
    } else {
      toast.error(state.message);
    }
  }, [state, onSuccessCallbackAction]);

  const onOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
  };

  return {
    state,
    formAction,
    pending,
    open,
    onOpenChange,
  };
}
