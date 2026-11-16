# ⚡ PGTE — Plataforma de Gestión Técnica Eléctrica

**PGTE** es una plataforma web diseñada para centralizar y simplificar la gestión de trabajos eléctricos, enfocada principalmente en **técnicos eléctricos independientes**.

Permite organizar información de clientes, inmuebles, proyectos, levantamientos técnicos y cotizaciones en un entorno digital, facilitando el seguimiento de los trabajos y la consulta de antecedentes técnicos.

El proyecto se desarrolla como parte de un trabajo académico de Ingeniería Informática, bajo un enfoque de Producto Mínimo Viable (MVP).

---

## 🎯 Objetivo del proyecto

Desarrollar una plataforma web que permita digitalizar y centralizar la gestión técnica y administrativa de servicios eléctricos domiciliarios, mejorando la organización, trazabilidad y disponibilidad de la información.

### Objetivos específicos

- Digitalizar el registro de clientes e inmuebles.
- Centralizar la información técnica de instalaciones eléctricas.
- Facilitar el registro y seguimiento de levantamientos técnicos.
- Organizar la elaboración y consulta de cotizaciones.
- Mantener antecedentes históricos asociados a cada inmueble.
- Proporcionar una interfaz accesible desde computadores, tablets y dispositivos móviles.

---

## 💡 Problemática

Los técnicos eléctricos independientes suelen administrar información mediante anotaciones manuales, documentos dispersos y herramientas no integradas.

Esto puede generar:

- **Información dispersa:** datos de clientes y antecedentes técnicos almacenados en distintos lugares.
- **Registros manuales:** dificultad para recuperar información de trabajos anteriores.
- **Cotizaciones desorganizadas:** elaboración y seguimiento de presupuestos sin un sistema centralizado.
- **Falta de historial técnico:** dificultad para consultar las condiciones registradas previamente en una instalación.

PGTE busca abordar estos problemas mediante una plataforma de gestión centralizada.

---

## 🚀 Tecnologías utilizadas

| Tecnología | Descripción |
|---|---|
| Next.js 16 | Framework web con App Router y Server Components |
| React 19 | Desarrollo de interfaces de usuario |
| TypeScript | Tipado estático y desarrollo de aplicaciones |
| Tailwind CSS 4 | Diseño responsivo y estilos |
| Supabase | PostgreSQL y autenticación de usuarios |
| Prisma ORM 5 | Modelado y acceso a la base de datos |
| Lucide React | Iconografía de la interfaz |
| Vercel | Plataforma prevista para despliegue |
| Git y GitHub | Control de versiones y colaboración |

### Arquitectura general

La aplicación utiliza una arquitectura web basada en Next.js, con acceso a PostgreSQL mediante Prisma ORM y autenticación gestionada por Supabase Auth.

```text
Usuario / Técnico eléctrico
           |
           v
      Next.js 16
     React + TSX
           |
           v
   Server Components
    Server Actions
           |
     +-----+------+
     |            |
     v            v
 Supabase      Prisma ORM
    Auth           |
                   v
              PostgreSQL
               Supabase
```

Las consultas a la base de datos se realizan desde el servidor, utilizando el contexto del usuario autenticado.

---

## 🧩 Funcionalidades del sistema

### 1. Autenticación y usuarios

- Registro de usuarios.
- Inicio y cierre de sesión.
- Confirmación de correo electrónico.
- Protección de rutas privadas.
- Asociación de usuarios con perfiles de la base de datos.

### 2. Dashboard técnico

Panel principal para consultar y gestionar la información del trabajo eléctrico.

Incluye:

- Resumen de clientes registrados.
- Cantidad de inmuebles asociados.
- Indicadores de levantamientos pendientes.
- Resumen de cotizaciones.
- Accesos rápidos a los principales módulos.

### 3. Gestión de clientes

- Registro de clientes.
- Listado y consulta de información.
- Edición de datos.
- Eliminación de registros según las restricciones del sistema.
- Asociación de clientes con técnicos independientes o empresas.

### 4. Gestión de inmuebles

- Registro de viviendas e inmuebles.
- Asociación con clientes.
- Información de ubicación y características generales.
- Consulta y edición de antecedentes.
- Vinculación con proyectos eléctricos.

### 5. Proyectos eléctricos

Organización de los trabajos asociados a los inmuebles, permitiendo relacionar información del cliente, levantamientos y cotizaciones.

### 6. Levantamientos técnicos

Módulo orientado al registro de las condiciones de instalaciones eléctricas.

El alcance contempla:

- Registro de información del tablero eléctrico.
- Identificación de circuitos.
- Observaciones técnicas.
- Asociación del levantamiento con un proyecto.
- Consulta de antecedentes técnicos.

### 7. Cotizaciones

Gestión de presupuestos asociados a proyectos eléctricos.

El alcance contempla:

- Registro de materiales.
- Costos de mano de obra.
- Cálculo de montos.
- Asociación de cotizaciones con proyectos.
- Seguimiento de cotizaciones.

**Nota:** El proyecto continúa en desarrollo. La disponibilidad y nivel de implementación de las funcionalidades pueden variar según la rama y el avance del MVP.

---

## 🔄 Flujo general del sistema

El flujo funcional previsto para PGTE es:

1. **Autenticación:** el técnico ingresa a la plataforma.
2. **Gestión de clientes:** registra o selecciona un cliente existente.
3. **Gestión de inmuebles:** registra o selecciona el inmueble correspondiente.
4. **Creación del proyecto:** organiza el trabajo eléctrico solicitado.
5. **Levantamiento técnico:** registra las condiciones de la instalación.
6. **Evaluación técnica:** define las soluciones necesarias.
7. **Cotización:** organiza materiales, mano de obra y costos.
8. **Seguimiento:** consulta el estado del proyecto y sus antecedentes.
9. **Historial:** recupera información de trabajos anteriores.

---

## 🔐 Seguridad y control de acceso

PGTE utiliza Supabase Auth para gestionar la autenticación y Prisma ORM para consultar la información almacenada en PostgreSQL.

El sistema contempla:

- Validación de sesiones.
- Protección de rutas privadas.
- Asociación de perfiles con usuarios autenticados.
- Filtrado de clientes según el técnico o empresa correspondiente.
- Validación de pertenencia antes de determinadas operaciones sobre registros.

El objetivo es que cada técnico independiente pueda gestionar su propia información sin acceder a registros pertenecientes a otros usuarios.

La seguridad y el aislamiento de datos continúan siendo aspectos prioritarios de validación durante el desarrollo.

---

## 📂 Estructura general del proyecto

```text
PGTE/
├── README.md
├── .gitignore
└── plataforma-web/
    ├── prisma/
    │   └── schema.prisma
    ├── public/
    ├── src/
    │   ├── app/
    │   ├── components/
    │   ├── lib/
    │   ├── schemas/
    │   └── services/
    ├── package.json
    └── next.config.ts
```

### Organización

- **app:** páginas, rutas y layouts de Next.js.
- **components:** componentes reutilizables de la interfaz.
- **lib:** configuración y utilidades de infraestructura.
- **schemas:** validaciones de datos.
- **services:** lógica de acceso a datos y operaciones del sistema.
- **prisma:** definición del esquema de base de datos.

---

## 🛠️ Instalación y configuración local

### Requisitos previos

- Node.js compatible con Next.js 16 (mínimo 20.9).
- npm.
- Git.
- Acceso autorizado al proyecto Supabase.
- Credenciales de conexión a PostgreSQL.

### 1. Clonar el repositorio

```bash
git clone https://github.com/CesarMS97/PGTE.git
cd PGTE
```

Para trabajar con la rama de desarrollo:

```bash
git switch dev
```

### 2. Acceder a la aplicación

```bash
cd plataforma-web
```

### 3. Instalar dependencias

```bash
npm install
```

### 4. Configurar variables de entorno

Crear un archivo `.env` dentro de `plataforma-web`.

```dotenv
# Supabase Auth
NEXT_PUBLIC_SUPABASE_URL=tu_url_supabase
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=tu_publishable_key

# Prisma / PostgreSQL
DATABASE_URL=tu_cadena_de_conexion_pooler
DIRECT_URL=tu_cadena_de_conexion_directa
```

Las variables deben corresponder al mismo proyecto Supabase.

**Importante:** No subir archivos `.env`, contraseñas ni cadenas de conexión al repositorio.

### 5. Generar Prisma Client

```bash
npx prisma generate
```

Este comando genera Prisma Client a partir de `prisma/schema.prisma`.

Debe ejecutarse después de instalar dependencias y cuando se actualice el esquema de Prisma.

No modifica ni elimina datos de Supabase.

### 6. Iniciar el servidor

```bash
npm run dev
```

Abrir:

http://localhost:3000

### 7. Comprobar el proyecto

```bash
npx tsc --noEmit
npm run build
```

Estos comandos permiten detectar errores de TypeScript y compilación antes de integrar cambios.

---

## 🔧 Solución de problemas frecuentes

### Prisma no reconoce una consulta

Si aparece un error relacionado con argumentos desconocidos de Prisma, comprobar primero que Prisma Client esté actualizado.

```bash
npx prisma generate
```

Reiniciar posteriormente el servidor.

### Problemas con la caché de Next.js

Detener el servidor y eliminar la carpeta de compilación.

En PowerShell:

```powershell
Remove-Item -Recurse -Force .next
npm run dev
```

Next.js volverá a generar la carpeta automáticamente.

### Error de conexión a Supabase

Verificar que:

- Las variables de entorno estén configuradas.
- Las credenciales correspondan al proyecto correcto.
- La base de datos esté disponible.
- Prisma Client se haya generado correctamente.

No utilizar comandos de reinicialización de base de datos como solución a errores de caché o autenticación.

---

## 🌿 Estrategia de ramas Git

El proyecto utiliza una estrategia de integración progresiva.

| Rama | Propósito |
|---|---|
| `main` | Versión estable del proyecto |
| `uat` | Integración y pruebas de aceptación |
| `dev` | Integración de funcionalidades en desarrollo |
| `feature/*` | Desarrollo de nuevas funcionalidades |
| `fix/*` | Corrección de errores |

### Flujo de integración

```text
feature/* o fix/*
        |
        v
       dev
        |
        v
       uat
        |
        v
       main
```

Los cambios se integran primero en `dev`, se validan en `uat` y posteriormente se incorporan a `main`.

Se recomienda utilizar Pull Requests y verificar la compilación antes de integrar cambios a la rama estable.

---

## 📋 Metodología de trabajo

PGTE se desarrolla mediante una metodología ágil basada en Scrum, organizando el trabajo en sprints.

Las actividades incluyen:

- Planificación de funcionalidades.
- Diseño de interfaces y base de datos.
- Implementación incremental.
- Integración de componentes.
- Pruebas funcionales.
- Corrección de errores.
- Validación del MVP.

El proyecto prioriza inicialmente las necesidades de técnicos eléctricos independientes, dejando la ampliación hacia pequeñas empresas como una posible evolución.

---

## 👥 Equipo de trabajo

**César Moreno**
- Frontend.
- Diseño de interfaz.
- Componentes visuales.

**Marcelo Tapia**
- Backend.
- Base de datos.
- Arquitectura.
- Gestión técnica.

El desarrollo se realiza de forma colaborativa mediante Git y GitHub.

---

## 📌 Estado del proyecto

**En desarrollo — MVP académico**

El proyecto se encuentra en una etapa de implementación, integración y validación de sus funcionalidades principales.

Las prioridades son consolidar el flujo de gestión técnica, mantener la separación de información entre usuarios, mejorar la experiencia de uso y validar la estabilidad del sistema.

---

## 🔮 Evolución futura

Entre las posibles mejoras posteriores al MVP se consideran:

- Mayor trazabilidad del historial técnico.
- Gestión ampliada de estados de proyectos.
- Mejoras en la generación y exportación de documentos.
- Gestión de equipos de trabajo y pequeñas empresas.
- Optimización de la experiencia móvil.
- Mejoras de rendimiento y seguridad.

---

## 📄 Licencia

Proyecto desarrollado con fines académicos.

No se ha especificado una licencia de distribución o reutilización pública.

---

**PGTE — Tecnología para el trabajo eléctrico.**
