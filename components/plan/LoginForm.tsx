"use client";

import { useActionState } from "react";
import { requestLink } from "@/app/login/actions";
import { ArrowRight } from "@/components/icons";

export function LoginForm() {
  const [state, action, pending] = useActionState(requestLink, null);
  if (state?.sent) {
    return (
      <p className="page-text" role="status">
        If there’s a plan for that email, we’ve sent you a link. It can take a minute to arrive.
      </p>
    );
  }
  return (
    <form action={action} className="page-form" noValidate>
      <label className="quiz-field">
        <span>Email</span>
        <input type="email" name="email" inputMode="email" autoComplete="email" autoCapitalize="off" spellCheck={false} required />
      </label>
      {state?.error ? (
        <p className="quiz-error" role="alert">
          {state.error}
        </p>
      ) : null}
      <button type="submit" className="btn btn-lg page-cta" disabled={pending}>
        {pending ? "Sending" : "Send me a link"}
        {pending ? null : <ArrowRight />}
      </button>
    </form>
  );
}
