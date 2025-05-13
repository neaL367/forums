"use client";

import { useActionState } from "react";
import { signUp } from "../../../lib/actions";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import type { FormField, SignUpFormState } from "../../../lib/difinitions";

export function SignUpForm() {
  const initialState: SignUpFormState = {};
  const [state, action, pending] = useActionState(signUp, initialState);

  const fields: FormField[] = [
    { name: "username", label: "Username", type: "text", required: true },
    { name: "email", label: "Email", type: "email", required: true },
    { name: "password", label: "Password", type: "password", required: true },
    {
      name: "confirm_password",
      label: "Confirm Password",
      type: "password",
      required: true,
    },
  ];

  return (
    <div className="space-y-4 w-full max-w-md mx-auto p-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold">Sign Up</h2>
        <p className="text-muted-foreground">Create a new account</p>
      </div>

      <form action={action} className="space-y-4">
        {fields.map((field) => (
          <div key={field.name} className="space-y-2">
            <Label htmlFor={field.name}>{field.label}</Label>
            <Input
              id={field.name}
              name={field.name}
              type={field.type}
              required={field.required}
              className={
                state.fieldErrors?.[field.name] ? "border-red-500" : ""
              }
              defaultValue={(state.payload?.get(`${field.name}`) || "") as string}
            />
            {state.fieldErrors?.[field.name] && (
              <div className="text-red-500 text-sm space-y-1">
                {Array.isArray(state.fieldErrors[field.name]) ? (
                  state.fieldErrors[field.name]?.map((error, index) => (
                    <p key={index}>{error}</p>
                  ))
                ) : (
                  <p>{state.fieldErrors[field.name]}</p>
                )}
              </div>
            )}
          </div>
        ))}

        {state.formError && (
          <p className="text-red-500 text-center">{state.formError}</p>
        )}
        {state.errorMessage && (
          <p className="text-red-500 text-center">{state.errorMessage}</p>
        )}

        <Button type="submit" disabled={pending} className="w-full">
          {pending ? "Signing up…" : "Sign Up"}
        </Button>
      </form>
    </div>
  );
}
