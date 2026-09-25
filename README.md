# pubAdmin

Sistema web con frontend en Angular (TypeScript) y backend en Spring Boot, con persistencia en PostgreSQL.

## Estructura

```
pubAdmin/
  backend/    Spring Boot 3 + Java 21 + Spring Security (JWT) + JPA + Flyway
  frontend/   Angular 19 standalone, login + dashboard, HttpClient con interceptor JWT
  scripts/dev-env.sh   Carga en el PATH el JDK, Maven y PostgreSQL locales del proyecto
```

## Herramientas usadas

Esta máquina no tenía Homebrew funcional (faltan las Command Line Tools de Xcode/git),
así que se instalaron versiones portables, aisladas en `~/dev-tools`, sin usar `sudo`
ni tocar la configuración global del sistema:

- **JDK 21** (Eclipse Temurin) → `~/dev-tools/jdk-21.0.12.1+1`
- **Maven 3.9.16** → `~/dev-tools/apache-maven-3.9.16`
- **PostgreSQL 16** (binarios de Postgres.app) → `~/dev-tools/Postgres.app`, datos en `~/dev-tools/pgdata`, puerto **5433** (para no chocar con el PostgreSQL 14 que ya corría como servicio del sistema en el puerto 5432)

También se cambió la carpeta de caché de npm (`npm config set cache`) porque la caché
global tenía archivos de otro usuario que bloqueaban `npm install`.

## Primer arranque

```bash
# 1. Cargar las herramientas en el PATH de la sesión de terminal
source scripts/dev-env.sh

# 2. Si PostgreSQL local no está corriendo, levantarlo
pg_ctl -D "$PGDATA" -l ~/dev-tools/pg-log.txt -o "-p 5433" start

# 3. Backend (puerto 8080)
cd backend
mvn spring-boot:run

# 4. Frontend (puerto 4200), en otra terminal
cd frontend
npm start   # o: npx ng serve
```

Abrir http://localhost:4200 — redirige automáticamente a `/login`.

### Desde VS Code

Hay configuración en `../.vscode/` (raíz del workspace, un nivel arriba de `pubAdmin/`):

- **Run and Debug → "pubAdmin: Backend + Frontend"**: levanta el backend con el debugger de Java y abre Chrome apuntando a `ng serve` en una sola ejecución (F5).
- **Terminal → Run Task → "pubAdmin: backend + frontend"**: corre ambos con `mvn spring-boot:run` y `npm start`, sin debugger, cada uno en su propio panel de terminal.

`settings.json` apunta el JDK y Maven al JDK 21 y Maven instalados en `~/dev-tools` (ver sección "Herramientas usadas" más abajo), así que no depende de que `java`/`mvn` estén en el PATH del sistema. Requiere la extensión "Extension Pack for Java" instalada para la opción de debug del backend; la del frontend usa el debugger de Chrome que viene integrado en VS Code.

**Usuario inicial:** `admin` / `admin` (se crea solo la primera vez que arranca el backend,
si la tabla `usuarios` está vacía). Cámbiala después del primer login: hoy el sistema
no tiene todavía una pantalla para eso.

## Diseño de la solución

- **Base de datos**: Flyway crea la tabla `usuarios` (`backend/src/main/resources/db/migration/V1__create_usuarios_table.sql`). Un `CommandLineRunner` (`AdminUserSeeder`) inserta el usuario `admin` con la contraseña `admin` encriptada con BCrypt en el primer arranque.
- **Login**: `POST /api/auth/login` valida credenciales contra la tabla `usuarios` y devuelve un JWT. Las rutas quedan protegidas con Spring Security en modo *stateless* (sin sesión de servidor); el filtro `JwtAuthFilter` valida el token en cada request.
- **Frontend**: `AuthService` guarda el token en `localStorage` y lo agrega automáticamente a cada request vía un `HttpInterceptor`. El `authGuard` bloquea el acceso a `/dashboard` sin token válido.
- **Sin pantalla de bienvenida de Angular**: se reemplazó `app.component.html` por un simple `<router-outlet>`. La ruta raíz (`''`) redirige a `/login`; tras autenticar, se navega a `/dashboard`. La página de bienvenida que trae Angular por defecto (`ng new`) fue eliminada del todo.

## Configuración

Variables de entorno que puede sobrescribir el backend (ver `backend/src/main/resources/application.yml`):

| Variable | Default |
|---|---|
| `DB_HOST` | `localhost` |
| `DB_PORT` | `5433` |
| `DB_NAME` | `pubadmin` |
| `DB_USER` | `pubadmin` |
| `DB_PASSWORD` | `pubadmin` |
| `JWT_SECRET` | valor de desarrollo — **cambiar en producción** |
| `JWT_EXPIRATION_MINUTES` | `120` |

## Pendiente / siguientes pasos sugeridos

- Pantalla para cambiar la contraseña del usuario `admin`.
- CRUD de usuarios (alta/edición/baja) reutilizando la tabla `usuarios`.
- Empaquetar el frontend dentro del backend (o un proxy reverso) para desplegar como un solo artefacto.
- Mover `JWT_SECRET` y credenciales de base de datos a un manejador de secretos antes de producción.
