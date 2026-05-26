# Study Pulse — Monorepo Fullstack

Plataforma colaborativa universitaria con **NestJS** (backend) + **React + Vite + TypeScript** (frontend) en un mismo repositorio.

```
study-pulse/
├── backend/          # API NestJS (Postgres + MongoDB)
├── frontend/         # SPA React + Vite + TS
├── package.json      # scripts del monorepo
└── README.md
```

## 1. Requisitos

- Node.js **>= 20**
- npm **>= 10**
- Docker (opcional, recomendado para Postgres + MongoDB)

## 2. Instalación

Desde la raíz del proyecto:

```bash
npm run install:all
```

Esto instala dependencias de la raíz, del backend y del frontend.

## 3. Variables de entorno

### 3.1 Backend — `backend/.env`

Crea el archivo `backend/.env` con el siguiente contenido:

```env
# App
NODE_ENV=development
PORT=3000
API_PREFIX=api/v1
CORS_ORIGIN=http://localhost:5173

# JWT
JWT_ACCESS_SECRET=cambia-este-secreto-super-seguro
JWT_REFRESH_SECRET=cambia-este-refresh-secreto-super-seguro
JWT_ACCESS_EXPIRES=15m
JWT_REFRESH_EXPIRES=7d

# PostgreSQL
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USER=studypulse
DATABASE_PASSWORD=studypulse
DATABASE_NAME=studypulse

# MongoDB
MONGO_URI=mongodb://localhost:27017/studypulse
```

### 3.2 Frontend — `frontend/.env`

Crea el archivo `frontend/.env` con:

```env
VITE_API_URL=http://localhost:3000/api/v1
```

## 4. Bases de datos (opción rápida con Docker)

Desde `backend/` puedes levantar Postgres + Mongo:

```bash
cd backend
docker compose up -d postgres mongo
cd ..
```

## 5. Ejecutar el proyecto

Levanta **backend + frontend a la vez** desde la raíz:

```bash
npm start
```

- Backend: http://localhost:3000/api/v1
- Swagger: http://localhost:3000/api/v1/docs
- Frontend: http://localhost:5173

O por separado:

```bash
npm run start:backend
npm run start:frontend
```

## 6. Build de producción

```bash
npm run build
```

## 7. Conexión frontend ↔ backend

El frontend usa `src/lib/api.ts` que apunta a `VITE_API_URL`. Hay ejemplos en:

- `src/pages/Login.tsx` → `POST /auth/login`
- `src/pages/Register.tsx` → `POST /auth/register`
- `src/pages/Dashboard.tsx` → `GET /dashboard/stats`
- `src/pages/Tareas.tsx`, `Grupos.tsx`, `Materias.tsx`, `Sesiones.tsx`, `Feed.tsx`

## 8. Paleta de colores

`#ED3D9A` · `#D55B63` · `#0D8D86` · `#8DBE55` · `#4B44B1`
