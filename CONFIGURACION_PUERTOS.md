# Configuración de Puertos - Sistema de Farmacia

## Puertos Utilizados

| Servicio         | Puerto Configurado | Archivo de Configuración              |
|------------------|-------------------|---------------------------------------|
| Frontend (React) | 4123              | `client/.env` (variable PORT)         |
| Backend (API)    | 5000              | `.env` (variable PORT)                |
| PostgreSQL       | 5432              | `.env` (variable DB_PORT)             |

---

## Cómo Modificar los Puertos

### 1. Puerto del Backend (API)

**Archivo:** `.env` (en la raíz del proyecto)

```env
PORT=5000
```

Cambia `5000` por el puerto que desees usar para el servidor API.

**Ejemplo:** Para usar el puerto 8080:
```env
PORT=8080
```

**IMPORTANTE:** Si cambias el puerto del backend, también debes actualizar el proxy del frontend.

---

### 2. Puerto del Frontend (React)

**Opción A: Variable de entorno temporal (Windows CMD)**
```cmd
set PORT=3001 && npm run client
```

**Opción B: Variable de entorno temporal (PowerShell)**
```powershell
$env:PORT=3001; npm run client
```

**Opción C: Crear archivo `.env` en la carpeta client**

Crea el archivo `client/.env`:
```env
PORT=3001
```

---

### 3. Puerto de PostgreSQL

**Archivo:** `.env` (en la raíz del proyecto)

```env
DB_PORT=5432
```

Cambia `5432` por el puerto donde esté corriendo tu servidor PostgreSQL.

---

### 4. Configuración del Proxy (Conexión Frontend → Backend)

**Archivo:** `client/package.json`

```json
{
  "proxy": "http://localhost:5000"
}
```

**IMPORTANTE:** Si cambias el puerto del backend, DEBES actualizar esta línea.

**Ejemplo:** Si el backend usa el puerto 8080:
```json
{
  "proxy": "http://localhost:8080"
}
```

---

## Escenarios Comunes

### Escenario 1: Cambiar solo el puerto del Backend a 8080

1. Edita `.env`:
   ```env
   PORT=8080
   ```

2. Edita `client/package.json`:
   ```json
   {
     "proxy": "http://localhost:8080"
   }
   ```

3. Reinicia ambos servidores.

---

### Escenario 2: Cambiar el puerto del Frontend a 4000

1. Crea `client/.env`:
   ```env
   PORT=4000
   ```

2. Reinicia el frontend.

3. Accede a: http://localhost:4000

---

### Escenario 3: PostgreSQL en un puerto diferente (ej: 5433)

1. Edita `.env`:
   ```env
   DB_PORT=5433
   ```

2. Reinicia el backend.

---

## Verificar que los Puertos Estén Funcionando

### Windows (CMD o PowerShell)

Ver puertos en uso:
```cmd
netstat -ano | findstr :5000
netstat -ano | findstr :3000
netstat -ano | findstr :3306
```

### Health Check del Backend

Accede a: http://localhost:5000/api/health

Respuesta esperada:
```json
{
  "status": "OK",
  "message": "Servidor funcionando correctamente",
  "database": "MySQL"
}
```

---

## Resumen de Archivos a Modificar

| Qué cambiar              | Archivo                  | Variable/Propiedad |
|--------------------------|--------------------------|---------------------|
| Puerto Backend           | `.env`                   | `PORT`              |
| Puerto Frontend          | `client/.env`            | `PORT`              |
| Puerto MySQL             | `.env`                   | `DB_PORT`           |
| Conexión Frontend→Backend| `client/package.json`    | `"proxy"`           |

---

## Notas Importantes

1. **Siempre reinicia los servidores** después de cambiar la configuración de puertos.

2. **El proxy solo funciona en desarrollo.** En producción, el frontend compilado se sirve desde el mismo servidor backend.

3. **Evita puertos reservados** (0-1023) a menos que ejecutes como administrador.

4. **Puertos comunes a evitar** si ya están en uso:
   - 80 (HTTP)
   - 443 (HTTPS)
   - 3306 (MySQL por defecto)
   - 5432 (PostgreSQL)
   - 27017 (MongoDB)
