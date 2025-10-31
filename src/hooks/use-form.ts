import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useActionState, useEffect, useRef, useState } from "react";

import { authClient } from "@/lib/auth-client";

import type { FormState } from "@/types/formstate";
import type { Route } from "next";

type UseFormProps<TFormData> = {
  action: (
    prev: FormState<TFormData>,
    formData: FormData
  ) => Promise<FormState<TFormData>>;
  initialState: FormState<TFormData>;
  successRedirect?: string;
  awaitSession?: boolean;
  loadingMessage: string;
};

export function useForm<TFormData>({
  action,
  initialState,
  loadingMessage,
  successRedirect,
  awaitSession = false,
}: UseFormProps<TFormData>) {
  const router = useRouter();
  const { data: session, refetch } = authClient.useSession();

  const [waitingForSession, setWaitingForSession] = useState(false);
  const loadingToastRef = useRef<string | number | null>(null);

  const wrappedAction = async (
    prevState: FormState<TFormData>,
    formData: FormData
  ) => {
    loadingToastRef.current = toast.loading(loadingMessage);
    return action(prevState, formData);
  };

  const [state, formAction, pending] = useActionState(wrappedAction, initialState);

  useEffect(() => {
    if (!state?.message) return;

    if (loadingToastRef.current) {
      toast.dismiss(loadingToastRef.current);
      loadingToastRef.current = null;
    }

    if (state.success) {
      toast.success(state.message);

      if (awaitSession) {
        setWaitingForSession(true);
        refetch();
      } else if (successRedirect) {
        router.push(successRedirect as Route);
      }
    } else {
      toast.error(state.message);
    }
  }, [state, awaitSession, successRedirect, refetch, router]);

  useEffect(() => {
    if (!awaitSession || !waitingForSession || !session) return;

    if (successRedirect) {
      router.push(successRedirect as Route);
      router.refresh();
    }

    setWaitingForSession(false);
  }, [session, waitingForSession, awaitSession, successRedirect, router]);

  return {
    state,
    formAction,
    pending,
    waitingForSession,
    session,
  };
}
