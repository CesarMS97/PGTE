"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";

import { createClient } from "@/lib/supabase/client";
import {
  authStyles,
  authInputClass,
} from "@/components/auth/authStyles";
import { crearPerfilDespuesDeRegistro } from "@/services/auth.service";

type Field =
  | "name"
  | "email"
  | "password"
  | "confirmPassword";

type FieldErrors = Partial<Record<Field, string>>;

function validate(
  name: string,
  email: string,
  password: string,
  confirmPassword: string
): FieldErrors {
  const errors: FieldErrors = {};

  if (!name.trim()) {
    errors.name = "Ingresa tu nombre completo para crear tu cuenta.";
  } else if (name.trim().length < 2) {
    errors.name = "Tu nombre debe tener al menos 2 caracteres.";
  } else if (name.trim().length > 120) {
    errors.name = "Tu nombre no puede superar los 120 caracteres.";
  }

  if (!email.trim()) {
    errors.email = "Ingresa tu correo electrónico.";
  } else if (
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
  ) {
    errors.email =
      "Ingresa un correo válido, por ejemplo: nombre@correo.cl.";
  }

  if (!password) {
    errors.password =
      "Crea una contraseña para proteger tu cuenta.";
  } else if (password.length < 8) {
    errors.password =
      "Tu contraseña debe tener al menos 8 caracteres.";
  }

  if (!confirmPassword) {
    errors.confirmPassword =
      "Vuelve a escribir tu contraseña para confirmarla.";
  } else if (password !== confirmPassword) {
    errors.confirmPassword =
      "Las contraseñas no coinciden. Revisa e inténtalo nuevamente.";
  }

  return errors;
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null;

  return (
    <p className={authStyles.error}>
      <AlertCircle
        size={16}
        className="mt-0.5 shrink-0"
        aria-hidden="true"
      />
      <span>{message}</span>
    </p>
  );
}

export default function RegisterForm() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [errors, setErrors] = useState<FieldErrors>({});
  const [serverError, setServerError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  function clearError(field: Field) {
    setErrors((prev) => ({
      ...prev,
      [field]: undefined,
    }));

    setServerError("");
  }

  async function handleRegister(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (loading) return;

    setServerError("");
    setSuccess("");

    const validationErrors = validate(
      name,
      email,
      password,
      confirmPassword
    );

    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) return;

    setLoading(true);

    try {
      const supabase = createClient();

      const cleanedEmail = email.trim().toLowerCase();

      const { data, error } = await supabase.auth.signUp({
        email: cleanedEmail,
        password,
        options: {
          data: {
            full_name: name.trim(),
          },
          emailRedirectTo: `${window.location.origin}/auth/confirm`,
        },
      });

      if (error) {
        switch (error.code) {
          case "weak_password":
            setErrors((prev) => ({
              ...prev,
              password:
                "Esta contraseña no cumple los requisitos de seguridad. Utiliza una contraseña más segura.",
            }));
            break;

          case "email_address_invalid":
            setErrors((prev) => ({
              ...prev,
              email:
                "El correo electrónico ingresado no es válido.",
            }));
            break;

          case "user_already_exists":
          case "email_exists":
            setErrors((prev) => ({
              ...prev,
              email:
                "No se pudo registrar este correo. Si ya tienes una cuenta, intenta iniciar sesión.",
            }));
            break;

          case "over_email_send_rate_limit":
            setServerError(
              "Has solicitado demasiados correos. Espera unos minutos antes de intentarlo nuevamente."
            );
            break;

          case "signup_disabled":
            setServerError(
              "El registro de nuevas cuentas no está disponible en este momento."
            );
            break;

          default:
            setServerError(
              "No pudimos crear tu cuenta. Verifica los datos e inténtalo nuevamente."
            );
        }

        return;
      }

      // Creamos el perfil localmente en Prisma inmediatamente después del éxito en Supabase Auth
      if (data.user) {
        const perfilRes = await crearPerfilDespuesDeRegistro({
          userId: data.user.id,
          nombre: name.trim(),
          email: cleanedEmail,
        });

        if (!perfilRes.success) {
          console.error("Aviso: El usuario se creó en Auth pero hubo un problema al sincronizar el perfil:", perfilRes.error);
        }
      }

      setPassword("");
      setConfirmPassword("");

      if (data.session) {
        router.replace("/dashboard");
        router.refresh();
        return;
      }

      setSuccess(
        "Tu solicitud de registro fue recibida. Revisa tu correo electrónico y sigue el enlace de confirmación para activar tu cuenta."
      );
    } catch {
      setServerError(
        "No pudimos conectar con el servicio de autenticación. Revisa tu conexión a internet e inténtalo nuevamente."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleRegister}
      noValidate
      className={authStyles.form}
    >
      <div>
        <label htmlFor="register-name" className={authStyles.label}>
          Nombre completo
        </label>
        <input
          id="register-name"
          type="text"
          autoComplete="name"
          maxLength={120}
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            clearError("name");
          }}
          placeholder="Ej. Juan Pérez"
          aria-invalid={Boolean(errors.name)}
          aria-describedby={errors.name ? "register-name-error" : undefined}
          className={authInputClass(Boolean(errors.name))}
        />
        <div id="register-name-error">
          <FieldError message={errors.name} />
        </div>
      </div>

      <div>
        <label htmlFor="register-email" className={authStyles.label}>
          Correo electrónico
        </label>
        <input
          id="register-email"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            clearError("email");
          }}
          placeholder="correo@ejemplo.cl"
          aria-invalid={Boolean(errors.email)}
          aria-describedby={errors.email ? "register-email-error" : undefined}
          className={authInputClass(Boolean(errors.email))}
        />
        <div id="register-email-error">
          <FieldError message={errors.email} />
        </div>
      </div>

      <div>
        <label htmlFor="register-password" className={authStyles.label}>
          Contraseña
        </label>
        <div className="relative">
          <input
            id="register-password"
            type={showPassword ? "text" : "password"}
            autoComplete="new-password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              clearError("password");
              clearError("confirmPassword");
            }}
            placeholder="Crea una contraseña segura"
            aria-invalid={Boolean(errors.password)}
            aria-describedby={errors.password ? "register-password-error" : "register-password-hint"}
            className={`${authInputClass(Boolean(errors.password))} pr-12`}
          />
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
            aria-pressed={showPassword}
            className="absolute inset-y-0 right-0 flex w-12 items-center justify-center text-slate-500 transition-colors hover:text-blue-600"
          >
            {showPassword ? <EyeOff size={19} aria-hidden="true" /> : <Eye size={19} aria-hidden="true" />}
          </button>
        </div>
        <div id="register-password-error">
          <FieldError message={errors.password} />
        </div>
        {!errors.password && (
          <p id="register-password-hint" className="mt-2 text-xs text-slate-500">
            Utiliza al menos 8 caracteres.
          </p>
        )}
      </div>

      <div>
        <label htmlFor="register-confirm-password" className={authStyles.label}>
          Confirmar contraseña
        </label>
        <div className="relative">
          <input
            id="register-confirm-password"
            type={showConfirmPassword ? "text" : "password"}
            autoComplete="new-password"
            value={confirmPassword}
            onChange={(e) => {
              setConfirmPassword(e.target.value);
              clearError("confirmPassword");
            }}
            placeholder="Repite tu contraseña"
            aria-invalid={Boolean(errors.confirmPassword)}
            aria-describedby={errors.confirmPassword ? "register-confirm-password-error" : undefined}
            className={`${authInputClass(Boolean(errors.confirmPassword))} pr-12`}
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword((prev) => !prev)}
            aria-label={showConfirmPassword ? "Ocultar confirmación" : "Mostrar confirmación"}
            aria-pressed={showConfirmPassword}
            className="absolute inset-y-0 right-0 flex w-12 items-center justify-center text-slate-500 transition-colors hover:text-blue-600"
          >
            {showConfirmPassword ? <EyeOff size={19} aria-hidden="true" /> : <Eye size={19} aria-hidden="true" />}
          </button>
        </div>
        <div id="register-confirm-password-error">
          <FieldError message={errors.confirmPassword} />
        </div>
      </div>

      {serverError && (
        <div role="alert" className="flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          <AlertCircle size={19} className="shrink-0" aria-hidden="true" />
          <p>{serverError}</p>
        </div>
      )}

      {success && (
        <div role="status" className="flex items-start gap-3 rounded-lg border border-blue-200 bg-blue-50 p-4 text-sm text-blue-800">
          <CheckCircle2 size={20} className="shrink-0" aria-hidden="true" />
          <p>{success}</p>
        </div>
      )}

      <button type="submit" disabled={loading || Boolean(success)} className={authStyles.button}>
        {loading ? "Creando cuenta..." : "Crear cuenta"}
      </button>

      <p className={authStyles.footer}>
        ¿Ya tienes una cuenta?{" "}
        <Link href="/login" className={authStyles.link}>
          Iniciar sesión
        </Link>
      </p>
    </form>
  );
}