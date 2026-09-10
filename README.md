# CS2 Store

Tienda web full-stack de skins de **Counter-Strike 2**, con catálogo, carrito y pagos
integrados. Arquitectura separada en frontend, backend y proxy, lista para correr con Docker.

## 🧱 Stack

| Capa | Tecnologías |
|---|---|
| **Frontend** | Next.js 16 · React 19 · TypeScript · Zustand · Tailwind CSS 4 |
| **Backend** | FastAPI · SQLAlchemy · Alembic · PostgreSQL · Redis |
| **Auth** | JWT (python-jose · passlib · bcrypt) |
| **Pagos** | MercadoPago |
| **Infra** | Docker Compose · Nginx (reverse proxy) |

## 📁 Estructura

```
cs2-store/
├── frontend/          # App Next.js (catálogo, carrito, checkout)
├── backend/           # API FastAPI (productos, usuarios, pagos)
├── nginx/             # Reverse proxy
└── docker-compose.yml # Orquesta todos los servicios
```

## 🚀 Arranque rápido

> Requiere [Docker](https://www.docker.com/) instalado.

1. Copiá los archivos de entorno de ejemplo y completá tus valores:
   - `backend/.env` (base de datos, JWT, credenciales de MercadoPago)
   - `frontend/.env.local` (URL del backend, etc.)
2. Levantá todo:

```bash
docker compose up -d --build
```

## ⚠️ Notas

- Los archivos `.env` **no se suben** al repo (están en `.gitignore`). Nunca los publiques:
  contienen claves de base de datos y de MercadoPago.

## 📄 Licencia

Uso personal / educativo.
