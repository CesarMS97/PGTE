export const authStyles = {
  form: "space-y-5",

  label: "mb-2 block text-sm font-medium text-slate-700",

  input:
    "min-h-12 w-full rounded-lg border bg-white px-4 py-3 text-sm text-slate-900 outline-none transition-colors placeholder:text-slate-400 focus:ring-2",

  inputNormal:
    "border-slate-300 focus:border-blue-600 focus:ring-blue-100",

  inputError:
    "border-red-400 focus:border-red-500 focus:ring-red-100",

  button:
    "flex min-h-12 w-full items-center justify-center rounded-lg bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60",

  link:
    "font-semibold text-blue-600 transition-colors hover:text-blue-700 hover:underline",

  footer: "text-center text-sm text-slate-600",

  error:
    "mt-2 flex items-start gap-2 text-sm text-red-600",
};

export function authInputClass(hasError: boolean) {
  return `${authStyles.input} ${
    hasError ? authStyles.inputError : authStyles.inputNormal
  }`;
}