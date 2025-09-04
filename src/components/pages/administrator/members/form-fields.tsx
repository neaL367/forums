"use client";

import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Members } from "@/types/member";

interface FormFieldsProps {
  item: Members;
}

export function FormFields({ item }: FormFieldsProps) {
  function Section({ children }: { children: React.ReactNode }) {
    return (
      <fieldset className="space-y-2">
        <div className="space-y-3">{children}</div>
      </fieldset>
    );
  }

  function Field({
    label,
    id,
    defaultValue,
    type = "text",
  }: {
    label: string;
    id: string;
    defaultValue: string;
    type?: string;
  }) {
    return (
      <div className="space-y-2">
        <Label htmlFor={id} className="text-sm font-medium">
          {label}
        </Label>
        <input
          id={id}
          name={id}
          type={type}
          defaultValue={defaultValue}
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        />
      </div>
    );
  }

  function SelectField({
    label,
    id,
    defaultValue,
    options,
    destructive = false,
  }: {
    label: string;
    id: string;
    defaultValue: string;
    options: string[];
    destructive?: boolean;
  }) {
    return (
      <div className="space-y-2">
        <Label htmlFor={id} className="text-sm font-medium">
          {label}
        </Label>
        <Select defaultValue={defaultValue}>
          <SelectTrigger
            id={id}
            className={destructive ? "border-destructive" : ""}
          >
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {options.map((option) => (
              <SelectItem key={option} value={option}>
                {option === "true" ? "Yes" : option === "false" ? "No" : option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <input type="hidden" name={id} value={defaultValue} />
      </div>
    );
  }

  return (
    <form className="space-y-6">
      <Section>
        <Field
          label="Username"
          id="username"
          defaultValue={item.username}
        />
        <Field
          label="Display Name"
          id="displayUsername"
          defaultValue={item.displayUsername}
        />
        <Field label="Image" id="image" defaultValue={item.image || ""} />
      </Section>

      {/* <Section> */}
        {/* <Field label="Email" id="email" defaultValue={item.email} /> */}
        {/* <SelectField
          label="Email Verified"
          id="emailVerified"
          defaultValue={item.emailVerified ? "true" : "false"}
          options={["true", "false"]}
        /> */}
      {/* </Section> */}

      {item.banned && (
        <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg space-y-4">
          <h4 className="text-destructive font-semibold">Ban Info</h4>
          <Field
            label="Ban Reason"
            id="banReason"
            defaultValue={item.banReason || ""}
          />
          <Field
            label="Ban Expires"
            id="banExpires"
            type="date"
            defaultValue={
              item.banExpires
                ? item.banExpires.toISOString().split("T")[0]
                : ""
            }
          />
          <SelectField
            label="Ban Status"
            id="banned"
            defaultValue={item.banned ? "true" : "false"}
            options={["false", "true"]}
            destructive
          />
        </div>
      )}
    </form>
  );
}