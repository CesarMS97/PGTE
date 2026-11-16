
"use client";

import { useState, type FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff, AlertCircle } from "lucide-react";

import { createClient } from "@/lib/supabase/client";
import {
  authStyles,
  authInputClass,
} from "@/components/auth/authStyles";

type LoginErrors = {
  email?: string;
  password?: string;
};

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [errors, setErrors] = useState<LoginErrors>({});
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const confirmationError =
    searchParams.get("error") === "confirmacion";

  async function handleLogin(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (loading) return;

    setErrors({});
    setServerError("");

    const nextErrors: LoginErrors = {};

    if (!email.trim()) {
      nextErrors.email = "Ingresa tu correo electrónico.";
    } else if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
    ) {
      nextErrors.email = "Ingresa un correo electrónico válido.";
    }

    if (!password) {
      nextErrors.password = "Ingresa tu contraseña.";
    }

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    setLoading(true);

    try {
      const supabase = createClient();

      const { error } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password,
      });

      if (error) {
        switch (error.code) {
          case "email_not_confirmed":
            setServerError(
              "Tu correo electrónico aún no está confirmado. Revisa tu bandeja de entrada para completar la verificación."
            );
            break;

          case "invalid_credentials":
            setServerError(
              "No pudimos iniciar sesión con esos datos. Revisa tu correo y contraseña."
            );
            break;

          case "over_request_rate_limit":
            setServerError(
              "Se realizaron demasiados intentos. Espera unos minutos antes de volver a ingresar."
            );
            break;

          default:
            setServerError(
              "No fue posible iniciar sesión. Inténtalo nuevamente."
            );
        }

        return;
      }

      router.replace("/dashboard");
      router.refresh();
    } catch {
      setServerError(
        "No pudimos conectar con el servicio de autenticación. Revisa tu conexión a internet."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleLogin}
      noValidate
      className={authStyles.form}
    >
      {/* Correo electrónico */}
      <div>
        <label htmlFor="login-email" className={authStyles.label}>
          Correo electrónico
        </label>

        <input
          id="login-email"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            setErrors((prev) => ({
              ...prev,
              email: undefined,
            }));
            setServerError("");
          }}
          placeholder="correo@ejemplo.cl"
          aria-invalid={Boolean(errors.email)}
          aria-describedby={
            errors.email ? "login-email-error" : undefined
          }
          className={authInputClass(Boolean(errors.email))}
        />

        {errors.email && (
          <p id="login-email-error" className={authStyles.error}>
            <AlertCircle
              size={16}
              className="mt-0.5 shrink-0"
              aria-hidden="true"
            />
            {errors.email}
          </p>
        )}
      </div>

      {/* Contraseña */}
      <div>
        <label
            htmlFor="login-password"
            className={authStyles.label}
          >
            Contraseña
        </label>
        <div className="relative">
          <input
            id="login-password"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setErrors((prev) => ({
                ...prev,
                password: undefined,
              }));
              setServerError("");
            }}
            placeholder="Ingresa tu contraseña"
            aria-invalid={Boolean(errors.password)}
            aria-describedby={
              errors.password ? "login-password-error" : undefined
            }
            className={`${authInputClass(
              Boolean(errors.password)
            )} pr-12`}
          />

          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            aria-label={
              showPassword
                ? "Ocultar contraseña"
                : "Mostrar contraseña"
            }
            aria-pressed={showPassword}
            className="absolute inset-y-0 right-0 flex w-12 items-center justify-center text-slate-500 transition-colors hover:text-blue-600"
          >
            {showPassword ? (
              <EyeOff size={19} aria-hidden="true" />
            ) : (
              <Eye size={19} aria-hidden="true" />
            )}
          </button>
        </div>

        {errors.password && (
          <p id="login-password-error" className={authStyles.error}>
            <AlertCircle
              size={16}
              className="mt-0.5 shrink-0"
              aria-hidden="true"
            />
            {errors.password}
          </p>
        )}
        <div className={authStyles.label}>

          <Link
            href="/recuperar-contrasena"
            className="text-xs font-medium text-blue-600 hover:underline"
          >
            ¿Olvidaste tu contraseña?
          </Link>
        </div>
      </div>

      {/* Error de confirmación */}
      {confirmationError && (
        <div
          role="alert"
          className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800"
        >
          No pudimos confirmar tu correo. El enlace puede haber
          expirado o ya haber sido utilizado.
        </div>
      )}

      {/* Error de autenticación */}
      {serverError && (
        <div
          role="alert"
          className="flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700"
        >
          <AlertCircle
            size={19}
            className="shrink-0"
            aria-hidden="true"
          />
          <p>{serverError}</p>
        </div>
      )}

      {/* Botón principal */}
      <button
        type="submit"
        disabled={loading}
        className={authStyles.button}
      >
        {loading ? "Iniciando sesión..." : "Iniciar sesión"}
      </button>

      {/* Enlace al registro */}
      <p className={authStyles.footer}>
        ¿Todavía no tienes una cuenta?{" "}
        <Link href="/registro" className={authStyles.link}>
          Crear cuenta
        </Link>
      </p>
    </form>
  );
}
