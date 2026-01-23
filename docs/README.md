# Documentacion Tecnica - PharmaCare Pro v2.0

Bienvenido a la documentacion tecnica del sistema PharmaCare Pro.

---

## Indice de Documentacion

### Documentacion Principal
- [README.md](../README.md) - Guia principal del proyecto

### Documentacion Tecnica
- [MODELOS.md](./MODELOS.md) - Documentacion de modelos de base de datos
- [CONTROLADORES.md](./CONTROLADORES.md) - Documentacion de controladores y logica de negocio

### Documentacion Adicional
- [MEJORAS_V2.md](../MEJORAS_V2.md) - Mejoras implementadas en v2.0
- [PUBLICIDAD.md](../PUBLICIDAD.md) - Material de marketing

---

## Resumen del Sistema

### Arquitectura

```
┌─────────────────────────────────────────────────────────────┐
│                        CLIENTE                              │
│                    (React - Puerto 4123)                    │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │  Login   │  │Dashboard │  │ Products │  │  Sales   │   │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘   │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │  Users   │  │Suppliers │  │ Reports  │  │   ...    │   │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘   │
└─────────────────────────────────────────────────────────────┘
                              │
                              │ HTTP/REST
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                       API SERVER                            │
│                  (Express - Puerto 5000)                    │
│  ┌──────────────────────────────────────────────────────┐  │
│  │                    MIDDLEWARE                         │  │
│  │  ┌────────┐  ┌────────────┐  ┌──────────────────┐   │  │
│  │  │  CORS  │  │   Morgan   │  │  JWT Auth        │   │  │
│  │  └────────┘  └────────────┘  └──────────────────┘   │  │
│  └──────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────┐  │
│  │                   CONTROLLERS                         │  │
│  │  ┌────────┐ ┌─────────┐ ┌──────┐ ┌────────────────┐ │  │
│  │  │  Auth  │ │Products │ │Sales │ │ Customers ...  │ │  │
│  │  └────────┘ └─────────┘ └──────┘ └────────────────┘ │  │
│  └──────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────┐  │
│  │                     MODELS                            │  │
│  │  ┌──────┐ ┌─────────┐ ┌──────┐ ┌──────────────────┐ │  │
│  │  │ User │ │ Product │ │ Sale │ │ Customer ...     │ │  │
│  │  └──────┘ └─────────┘ └──────┘ └──────────────────┘ │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                              │
                              │ Sequelize ORM
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                      BASE DE DATOS                          │
│                 (PostgreSQL - Puerto 5432)                  │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  users | products | sales | customers | suppliers    │  │
│  │  sale_items | stock_movements | promotions | alerts  │  │
│  │  returns | return_items                              │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

---

## Tecnologias Utilizadas

### Backend
| Tecnologia | Uso |
|------------|-----|
| Node.js | Runtime de JavaScript |
| Express.js | Framework web |
| Sequelize | ORM para PostgreSQL |
| JWT | Autenticacion |
| Bcrypt.js | Encriptacion |
| PDFKit | Generacion PDF |
| ExcelJS | Generacion Excel |

### Frontend
| Tecnologia | Uso |
|------------|-----|
| React 18 | Biblioteca UI |
| React Router 6 | Navegacion |
| Axios | Cliente HTTP |
| Context API | Estado global |
| CSS3 | Estilos |

### Base de Datos
| Tecnologia | Uso |
|------------|-----|
| PostgreSQL 15+ | Base de datos relacional |

---

## Estructura de Carpetas

```
software-para-farmacia/
├── client/                 # Frontend
│   ├── public/            # Archivos estaticos
│   └── src/               # Codigo fuente React
├── server/                # Backend
│   ├── config/            # Configuraciones
│   ├── controllers/       # Logica de negocio
│   ├── middleware/        # Middleware Express
│   ├── models/            # Modelos Sequelize
│   └── routes/            # Rutas API
├── docs/                  # Documentacion
└── .env                   # Variables de entorno
```

---

## Guia Rapida

### Instalacion
```bash
npm install
cd client && npm install
```

### Configuracion
Crear `.env` con:
```env
PORT=5000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=pharmacare
DB_USER=postgres
DB_PASSWORD=tu_contrasena
JWT_SECRET=clave_secreta
```

### Ejecucion
```bash
npm run dev
```

### Acceso
- Frontend: http://localhost:4123
- API: http://localhost:5000

### Credenciales por defecto
| Usuario | Password | Rol |
|---------|----------|-----|
| admin@farmacia.com | Admin123! | Administrador |
| farmaceutico@farmacia.com | Farm123! | Farmaceutico |
| cajero@farmacia.com | Cajero123! | Cajero |

---

## Contacto

Para dudas tecnicas o soporte, consultar la documentacion detallada en cada archivo.

---

*PharmaCare Pro v2.0 - Documentacion Tecnica*
