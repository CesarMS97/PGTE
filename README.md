# ⚡ PGTE - Plataforma de Gestión Técnica Eléctrica

**PGTE** es una plataforma web orientada a apoyar la gestión de servicios y proyectos eléctricos, permitiendo centralizar la información asociada a clientes, inmuebles, levantamientos técnicos, soluciones, cotizaciones y ejecución de trabajos.

---

## 🎯 Objetivo del Proyecto
Desarrollar una plataforma web para la gestión y trazabilidad de servicios eléctricos, que permita centralizar la información de clientes, inmuebles, levantamientos, soluciones, cotizaciones y avances de los proyectos, facilitando su seguimiento y consulta histórica[cite: 3].

---

## 🚀 Tecnologías Utilizadas
El proyecto está desarrollado con un stack moderno y robusto:
* **Framework:** [Next.js](https://nextjs.org/) (con *App Router* y componentes de servidor).
* **Lenguaje:** [TypeScript](https://www.typescriptlang.org/) para un tipado estricto de datos.
* **Estilos:** [Tailwind CSS](https://tailwindcss.com/) para una interfaz moderna y responsiva.
* **Base de Datos y Autenticación:** [Supabase](https://supabase.com/).

---

## 🔄 Flujo General del Sistema (MVP)
El flujo principal que la plataforma permite gestionar paso a paso es[cite: 3]:
1. Solicitud del servicio
2. Registro/selección del cliente
3. Selección o creación del inmueble
4. Creación del proyecto
5. Visita técnica y Levantamiento
6. Evaluación y definición de solución
7. Cotización (materiales, mano de obra y costos)
8. Aprobación y Ejecución
9. Registro de avances e Historial

---

## 👥 Equipo de Trabajo
* **César Moreno** — Backend, Base de datos, Arquitectura y Gestión Técnica[cite: 3].
* **Marcelo Tapia** — Frontend, Diseño de interfaz y Componentes visuales[cite: 3].

---

## 🛠️ Guía de Instalación y Configuración Local

Si deseas clonar y ejecutar este proyecto en tu entorno local, sigue estos pasos:

### 1. Clonar el repositorio
```bash
git clone [https://github.com/CesarMS97/PGTE.git](https://github.com/CesarMS97/PGTE.git)
cd pgte
```

### 2. Instalar dependencias
```bash
npm install
```

### 3. Configurar las variables de entorno
Crea un archivo llamado .env.local en la raíz del proyecto y añade tus credenciales de Supabase:
```bash
NEXT_PUBLIC_SUPABASE_URL=tu_url_de_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_clave_anonima_de_supabase
```

### 4. Ejecutar el servidor de desarrollo
```bash
npm run dev
```
