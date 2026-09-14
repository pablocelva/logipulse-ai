<div align="center">

# 🚚 LogiPulse AI
### *Plataforma SaaS de Gestión Logística, Telemetría e Inteligencia Artificial en Tiempo Real*

![NestJS](https://img.shields.io/badge/NestJS-E0234E?style=for-the-badge&logo=nestjs&logoColor=white)
![Next.js](https://img.shields.io/badge/Next.js_14+-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Jest](https://img.shields.io/badge/Jest-C21325?style=for-the-badge&logo=jest&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![RabbitMQ](https://img.shields.io/badge/RabbitMQ-FF6600?style=for-the-badge&logo=rabbitmq&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)
![Kubernetes](https://img.shields.io/badge/Kubernetes-326CE5?style=for-the-badge&logo=kubernetes&logoColor=white)
![Groq AI](https://img.shields.io/badge/Groq_Cloud_API-f34f29?style=for-the-badge&logo=openai&logoColor=white)
![pnpm](https://img.shields.io/badge/pnpm_workspaces-F69220?style=for-the-badge&logo=pnpm&logoColor=white)

</div>

---

## 🎯 1. Descripción del Proyecto

**LogiPulse AI** es una plataforma SaaS distribuida para la gestión logística de envíos y trazabilidad de flotas en tiempo real. Combina una arquitectura de **microservicios orientada a eventos (EDA)**, **persistencia políglota** (PostgreSQL + MongoDB), **despliegue en contenedores** (Docker y Kubernetes) y **asistencia inteligente de IA** (Groq API + Tavily Search API) para el diagnóstico automático de incidentes de tráfico y clima.

Este proyecto ha sido diseñado bajo los estándares más exigentes de ingeniería de software, aplicando **Arquitectura Hexagonal (Puertos y Adaptadores)**, **principios SOLID**, **Clean Code** y **cobertura de pruebas unitarias automatizadas con Jest**.

---

## 🏛️ 2. Arquitectura General del Sistema

```text
                               ┌─────────────────────────────────────────┐
                               │           Next.js 14+ Frontend          │
                               │     (App Router, Leaflet, React)        │
                               └────────────────────┬────────────────────┘
                                                    │ REST / WebSockets / Auth Cookie
                                                    ▼
                               ┌─────────────────────────────────────────┐
                               │             API Gateway                 │
                               └───────┬────────────┬─────────────┬──────┘
                                       │            │             │
                                       ▼            │             ▼
                    ┌──────────────────────┐        │  ┌──────────────────────┐
                    │     auth-service     │        │  │   telemetry-service  │
                    │  (NestJS + JWT/Bcrypt│        │  │ (NestJS + Mongo + WS)│
                    │    + HttpOnly Cookie)│        │  └──────────┬───────────┘
                    └──────────────────────┘        │             │
                                                    ▼             │
                                       ┌──────────────────────┐   │
                                       │    orders-service    │   │
                                       │(NestJS + PostgreSQL) │   │
                                       └──────────┬───────────┘   │
                                                  │               │
                                                  ▼ RabbitMQ Events
                                       ┌──────────────────────────┐
                                       │   ai-analytics-service   │
                                       │(Groq Cloud API + Tavily) │
                                       └──────────────────────────┘
```

---

## 📁 3. Estructura del Monorepo (`pnpm workspaces`)

```text
logipulse-ai/
├── .github/workflows/          # 🔄 Pipeline CI/CD GitHub Actions (ci.yml)
├── apps/
│   ├── auth-service/            # 🔐 Microservicio de Autenticación & Usuarios (NestJS + PostgreSQL + JWT + Cookie HttpOnly + Bcrypt + Jest)
│   ├── orders-service/          # 📦 Microservicio de Órdenes (PostgreSQL + REST + RabbitMQ + Dockerfile + Jest)
│   ├── telemetry-service/       # 📍 Microservicio de Telemetría GPS (MongoDB + WebSockets + Dockerfile + Jest)
│   ├── ai-analytics-service/    # 🤖 Microservicio de IA (Groq Cloud API + Tavily API + Dockerfile + Jest)
│   └── web/                     # 💻 Frontend Next.js 14+ (App Router, Standalone Dockerfile, Leaflet)
├── docs/                        # 📚 Documentación Técnica & Roadmap del Proyecto
│   ├── TYPESCRIPT_CONFIG.md     # Guía técnica de TypeScript y solución a advertencias del IDE
│   └── PROJECT_ROADMAP.md       # Roadmap de desarrollo y backlog de fases futuras
├── packages/
│   ├── shared-types/            # 📐 DTOs e Interfaces compartidas
│   └── config-eslint/           # ⚙️ Reglas de Clean Code
├── k8s/                         # ☸️ Manifiestos de Kubernetes (Deployments, Services, ConfigMaps, Secrets, Ingress)
├── docker-compose.yml           # 🐳 Infraestructura Local de Desarrollo (Postgres, Mongo, RabbitMQ)
├── docker-compose.prod.yml      # 📦 Orquestación Completa de Producción (Bases de datos + Microservicios)
├── pnpm-workspace.yaml          # 📦 Configuración de Monorepo pnpm
└── README.md
```

---

## 📚 4. Documentación Detallada de Microservicios

Para consultar diagramas UML, esquemas de bases de datos, especificación de endpoints y cobertura de pruebas de cada servicio:

* 🔐 **[Microservicio de Autenticación (auth-service)](/apps/auth-service/README.md)**: Documentación completa del microservicio de autenticación, persistencia en PostgreSQL (`logipulse_auth_db`), JWT HttpOnly cookies, RBAC (`ADMIN`, `DISPATCHER`, `DRIVER`) y Bcrypt hashing.
* 📦 **[Microservicio de Órdenes (orders-service)](/apps/orders-service/README.md)**: Documentación completa del microservicio transaccional en NestJS + PostgreSQL + TypeORM + Eventos RabbitMQ + Diagramas UML.
* 📍 **[Microservicio de Telemetría GPS (telemetry-service)](/apps/telemetry-service/README.md)**: Documentación completa del microservicio NoSQL en NestJS + MongoDB + Gateways de WebSockets (Socket.io) + Ingestión de Rutas Geográficas + Diagramas UML.
* 🤖 **[Microservicio de IA (ai-analytics-service)](/apps/ai-analytics-service/README.md)**: Documentación completa del microservicio de IA en NestJS + Groq Cloud API (`groq/compound-mini`) + Tavily Search API + Diagnóstico de Incidentes + Diagramas UML.
* 💻 **[Frontend Web (apps/web)](/apps/web/README.md)**: Aplicación Dashboard en Next.js 14+ (App Router), React, Tailwind CSS, Autenticación JWT, Vistas Adaptativas por Rol (`DriverCockpit`), Mapa Interactivo de Flotas (Leaflet), WebSockets Client, MSW Network Mocking, Jest Tests y Playwright E2E Tests.
* 🗺️ **[Roadmap y Fases de Desarrollo del Proyecto](/docs/PROJECT_ROADMAP.md)**: Registro del backlog de funcionalidades para futuras iteraciones (Fases 2, 3 y 4).
* ⚙️ **[Guía de Configuración TypeScript y Advertencias IDE](/docs/TYPESCRIPT_CONFIG.md)**: Documento técnico detallando el comportamiento de `tsconfig.json`, `baseUrl` y `target: "es5"` en el servidor de lenguaje de TypeScript 5+.

---

## 🧪 5. Pruebas Unitarias, Cobertura y E2E (Testing Metrics)

El monorepo cuenta con una suite completa de pruebas unitarias automatizadas desarrolladas con **Jest**, **React Testing Library**, **MSW** y **Playwright E2E**:

| Servicio / Aplicación | Test Suites | Tests Totales | Cobertura / Estado |
|---|---|---|---|
| 🔐 **`auth-service`** | 5 / 5 | 14 / 14 | 🟢 100% Pass |
| 📦 **`orders-service`** | 11 / 11 | 38 / 38 | 🟢 100% Pass |
| 📍 **`telemetry-service`** | 9 / 9 | 22 / 22 | 🟢 100% Pass |
| 🤖 **`ai-analytics-service`** | 4 / 4 | 8 / 8 | 🟢 100% Pass |
| 💻 **`web` (Frontend)** | 4 / 4 | 9 / 9 | 🟢 100% Pass |
| **TOTAL MONOREPO** | **33 / 33** | **91 / 91** | **🟢 100% PASS** |

### 🛠️ Comandos de Prueba:
```bash
# 1. Ejecutar pruebas unitarias de Autenticación
pnpm test:auth

# 2. Ejecutar pruebas unitarias de Órdenes
pnpm test:orders

# 3. Ejecutar pruebas unitarias de Telemetría
pnpm test:telemetry

# 4. Ejecutar pruebas unitarias de IA
pnpm test:ai

# 5. Ejecutar pruebas unitarias del Frontend Web (apps/web)
pnpm --filter @logipulse/web test

# 6. Ejecutar TODAS las pruebas del Monorepo
pnpm test:all

# 7. Generar reporte completo de cobertura de código
pnpm test:cov
```

---

## ⚡ 6. Guía de Inicio Rápido (Quick Start)

### 📋 Requisitos Previos
* Node.js v20+
* pnpm v8+
* Docker Desktop & Docker Compose

### 1. Clonar el repositorio e instalar dependencias:
```bash
git clone https://github.com/tu-usuario/logipulse-ai.git
cd logipulse-ai
pnpm install
```

### 2. Iniciar en Modo Desarrollo (Bases de datos en Docker + Microservicios en Local):
```bash
# Paso 1: Iniciar PostgreSQL, MongoDB y RabbitMQ
docker-compose up -d

# Paso 2: Iniciar Microservicios en Terminales independientes
pnpm dev:auth         # Puerto 3004 (Autenticación & Usuarios)
pnpm dev:orders       # Puerto 3001 (Órdenes y Transacciones)
pnpm dev:telemetry    # Puerto 3002 (Telemetría GPS & WebSockets)
pnpm dev:ai           # Puerto 3003 (IA Analytics & Diagnóstico)
pnpm --filter @logipulse/web dev  # Puerto 3000 (Frontend Web)
```

### 3. Iniciar en Modo Producción (Pila Completa en Docker Compose):
```bash
docker-compose -f docker-compose.prod.yml up --build -d
```

### 4. Desplegar en Kubernetes (k8s):
```bash
kubectl apply -f k8s/
```

---

## 📄 Licencia

Este proyecto está licenciado bajo los términos de la licencia **MIT**.
