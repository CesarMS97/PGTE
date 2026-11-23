
"use client";

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="es">
      <body>
        <h2>Ha ocurrido un error en PGTE.</h2>
        <button onClick={() => reset()}>
          Intentar nuevamente
        </button>
      </body>
    </html>
  );
}
