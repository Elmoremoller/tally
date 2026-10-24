"use client";

import { useActionState } from "react";
import { resendPlanLink } from "@/app/plan/actions";

/** Under the note about her email: send the link to her plan again. Nothing to send on a preview. */
export function ResendLink({ token }: { token: string | null }) {
  const [state, action, pending] = useActionState(resendPlanLink, null);
  return (
    <form action={action} className="page-resend">
      <input type="hidden" name="token" value={token ?? ""} />
      <p>No email after a minute? Check your spam folder, or</p>
      <button type="submit" className="link-button" disabled={pending || !token}>
        {pending ? "Sending" : "send it again"}
      </button>
      {state?.sent ? <p role="status">Sent. It can take a minute to arrive.</p> : null}
      {state?.error ? <p role="alert" className="quiz-error">{state.error}</p> : null}
    </form>
  );
}
