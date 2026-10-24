"use client";

import { useActionState } from "react";
import { resendLink } from "@/app/welcome/actions";

export function ResendLink({ sessionId }: { sessionId: string }) {
  const [state, action, pending] = useActionState(resendLink, null);
  return (
    <form action={action} className="page-resend">
      <input type="hidden" name="session_id" value={sessionId} />
      <p>No email after a minute? Check your spam folder, or</p>
      <button type="submit" className="link-button" disabled={pending}>
        {pending ? "Sending" : "send it again"}
      </button>
      {state?.sent ? <p role="status">Sent. It can take a minute to arrive.</p> : null}
      {state?.error ? <p role="alert" className="quiz-error">{state.error}</p> : null}
    </form>
  );
}
