"use client";

import { useActionState } from "react";
import { invitePartner } from "@/app/plan/actions";
import { ArrowRight } from "@/components/icons";

type PartnerCardProps = {
  partnerName: string | null;
  partnerEmail: string | null;
  preview?: string;
};

/** Add my partner: sends them their own link to the same plan. It’s free. */
export function PartnerCard({ partnerName, partnerEmail, preview }: PartnerCardProps) {
  const [state, action, pending] = useActionState(invitePartner, null);
  const them = partnerName ?? "your partner";
  const sentTo = state && "sent" in state ? state.sent : partnerEmail;

  return (
    <>
      {sentTo ? (
        <p className="plan-partner-status" role="status">
          {partnerName ?? "Your partner"} has the same plan, from their side. Their link went to <strong>{sentTo}</strong>.
        </p>
      ) : null}
      <form action={action} className="plan-partner-form" noValidate>
        {preview ? <input type="hidden" name="preview" value={preview} /> : null}
        <label className="quiz-field">
          <span>{partnerName ? `${partnerName}'s email` : "Their email"}</span>
          <input
            type="email"
            name="email"
            inputMode="email"
            autoComplete="off"
            autoCapitalize="off"
            spellCheck={false}
            defaultValue={sentTo ?? ""}
            required
          />
        </label>
        {state && "error" in state ? (
          <p className="quiz-error" role="alert">
            {state.error}
          </p>
        ) : null}
        <button type="submit" className="btn btn-lg" disabled={pending}>
          {pending ? "Sending" : sentTo ? `Send ${them} the link again` : "Add my partner"}
          {pending ? null : <ArrowRight />}
        </button>
      </form>
    </>
  );
}
