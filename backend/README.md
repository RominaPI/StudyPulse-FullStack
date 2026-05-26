# Study Pulse — Backend

Plataforma colaborativa universitaria. Backend en **NestJS + TypeScript** con
**PostgreSQL** (datos relacionales), **MongoDB** (datos sociales/realtime),
**JWT** (auth) y **Socket.IO** (chat en tiempo real).

## Stack

- NestJS 10 (arquitectura modular, DI, decoradores)
- TypeORM + PostgreSQL 16
- Mongoose + MongoDB 7
- Passport JWT (access + refresh tokens)
- Socket.IO Gateway (chat grupal/privado, presencia, typing)
- class-validator (DTOs validados)
- Swagger / OpenAPI (`/api/v1/docs`)
- Helmet, CORS, ValidationPipe global
- Jest (unit + e2e)
- Docker Compose (Postgres + Mongo + API)

## Estructura

```
src/
├── main.ts                 # Bootstrap, Swagger, CORS, Helmet
├── app.module.ts           # Módulo raíz (registra TypeORM + Mongoose + módulos)
├── config/
│   └── typeorm.config.ts   # DataSource para migraciones CLI
├── common/
│   ├── decorators/         # @CurrentUser, @Public, @Roles
│   ├── guards/             # JwtAuthGuard (global), RolesGuard
│   ├── filters/            # HttpExceptionFilter global
│   └── dto/                # PaginationDto
├── database/entities/      # Entidades PostgreSQL (TypeORM)
├── mongo/schemas/          # Esquemas MongoDB (Mongoose)
├── auth/                   # Registro / login / forgot-password / JWT strategy
├── users/                  # CRUD de usuarios
├── universities/           # Universidades
├── subjects/               # Materias (con horario JSONB)
├── study-groups/           # Grupos de estudio + join/leave
├── group-members/          # Roles dentro del grupo (owner/admin/member)
├── tasks/                  # Tareas con prioridad, estado, asignación
├── study-sessions/         # Sesiones programadas + check-in + tiempo de foco
├── resources/              # Recursos académicos compartidos en grupo
├── notifications/          # Notificaciones por usuario
├── friendships/            # Solicitudes de amistad
├── chat/                   # Mongo + Gateway WebSocket (chat grupal y DM)
├── feed/                   # Feed social académico (Mongo)
├── comments/               # Comentarios sobre publicaciones
├── reactions/              # Reacciones (emoji) sobre posts/comentarios/mensajes
└── stress-logs/            # Bienestar estudiantil (registro de estrés/ánimo)
```

## Modelo de datos

### PostgreSQL (datos relacionales con integridad)

| Tabla | Descripción |
|---|---|
| `users` | Cuenta del estudiante. Roles: `student`, `moderator`, `admin`. |
| `universities` | Institución educativa. |
| `subjects` | Materia con `code`, horario (JSONB), profesor, créditos. |
| `study_groups` | Grupo asociado opcionalmente a una materia. |
| `group_members` | Membresía con rol (`owner`, `admin`, `member`). |
| `tasks` | Tarea con `priority`, `status`, `progress`, asignación. |
| `study_sessions` | Sesión programada con objetivo y duración. |
| `session_attendances` | Asistencia + minutos de foco por usuario. |
| `resources` | Material académico (link/archivo). |
| `notifications` | Notificaciones in-app. |
| `friendships` | Conexiones entre estudiantes. |

### MongoDB (alta volumetría / esquema flexible)

| Colección | Descripción |
|---|---|
| `chat_messages` | Mensajes (canal grupo o DM), índices por `channel_id + createdAt`. |
| `activity_feed` | Posts del feed social (post, recurso, logro, anuncio). |
| `comments` | Comentarios anidados sobre publicaciones. |
| `reactions` | Reacciones únicas por (target, user, emoji). |
| `stress_logs` | Registro de bienestar (1-10 estrés/ánimo). |

## Endpoints principales

```
POST   /api/v1/auth/register
POST   /api/v1/auth/login
POST   /api/v1/auth/forgot-password
POST   /api/v1/auth/reset-password
GET    /api/v1/auth/me

GET    /api/v1/users/:id
GET    /api/v1/universities
GET    /api/v1/subjects?university_id=...

GET    /api/v1/study-groups
POST   /api/v1/study-groups
POST   /api/v1/study-groups/:id/join
DELETE /api/v1/study-groups/:id/leave

GET    /api/v1/group-members?group_id=...
PATCH  /api/v1/group-members/:id            # cambiar rol

GET    /api/v1/tasks?group_id=...|?mine=1
POST   /api/v1/tasks
PATCH  /api/v1/tasks/:id

GET    /api/v1/study-sessions?group_id=...
POST   /api/v1/study-sessions
POST   /api/v1/study-sessions/:id/check-in
POST   /api/v1/study-sessions/:id/focus    # { focus_minutes }

GET    /api/v1/resources?group_id=...
POST   /api/v1/resources

GET    /api/v1/notifications
PATCH  /api/v1/notifications/:id/read

GET    /api/v1/friendships
POST   /api/v1/friendships                  # { addressee_id }
PATCH  /api/v1/friendships/:id              # { accept: true|false }

GET    /api/v1/feed
POST   /api/v1/feed
GET    /api/v1/comments?post_id=...
POST   /api/v1/comments
POST   /api/v1/reactions/toggle             # { target_id, target_type, emoji }

GET    /api/v1/chat/group/:groupId
GET    /api/v1/chat/dm/:otherId

GET    /api/v1/stress-logs?days=30
POST   /api/v1/stress-logs
```

### WebSocket (Socket.IO, namespace `/ws`)

Auth con `auth.token = '<JWT>'` en el handshake. Eventos:

| Evento | Dirección | Payload |
|---|---|---|
| `join:room` | C → S | `{ room: string }` |
| `chat:send` | C → S | `{ channel_id, channel_type, content, mentions? }` |
| `chat:message` | S → C | mensaje persistido en Mongo |
| `typing` | C ↔ S | `{ channel_id, typing }` |
| `presence:update` | S → C | `{ userId, online }` |

## Cómo correrlo

### Opción A — Docker Compose (recomendado)
```bash
cp .env.example .env
docker compose up --build
# API: http://localhost:3000/api/v1
# Swagger: http://localhost:3000/api/v1/docs
```

### Opción B — Local
```bash
npm install
cp .env.example .env
# Asegúrate de tener Postgres en :5432 y Mongo en :27017
npm run start:dev
```

## Tests

```bash
npm test               # unit tests con Jest
npm run test:cov       # cobertura
npm run test:e2e       # end-to-end con Supertest
```

Para E2E desde el frontend (Cypress) configura `baseUrl` apuntando a este API.

## Migraciones

Por defecto `DB_SYNC=true` para desarrollo. En producción:
```bash
DB_SYNC=false
npm run migration:generate -- src/database/migrations/Init
npm run migration:run
```

## Roles y autorización

- Guard global `JwtAuthGuard`. Marca rutas públicas con `@Public()`.
- `RolesGuard` + `@Roles('admin'|'moderator'|'student')` para RBAC global.
- Roles dentro de un grupo (`group_members.role`) se validan en `StudyGroupsService.assertCanManage()`.

## Notas de seguridad

- Contraseñas hasheadas con bcrypt (cost 12).
- `password_hash` con `select: false` — nunca se devuelve en respuestas.
- JWT separados para access (`1d`) y refresh (`7d`).
- Helmet + CORS configurable por env.
- ValidationPipe global con `whitelist`, `forbidNonWhitelisted`, `transform`.
- Token de reset hasheado en BD (no se almacena en claro).
