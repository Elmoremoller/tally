// Previews only exist on a local setup: a dev server, or a local production build started with PLAN_PREVIEW=1.
// They let the plan page be seen without paying, and the AI allowance be tried without the database.
// Never set PLAN_PREVIEW on Vercel.
export const previewAllowed = process.env.NODE_ENV === "development" || process.env.PLAN_PREVIEW === "1";
