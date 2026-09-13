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

## 🎯 Descripción del Proyecto

**LogiPulse AI** es una plataforma SaaS distribuida para la gestión logística de envíos y trazabilidad de flotas en tiempo real. Combina una arquitectura de **microservicios orientada a eventos (EDA)**, **persistencia políglota** (PostgreSQL + MongoDB), **despliegue en contenedores** (Docker y Kubernetes) y **asistencia inteligente de IA** (Groq API + Tavily Search API) para el diagnóstico automático de incidentes de tráfico y clima.

Este proyecto ha sido diseñado bajo los estándares más exigentes de ingeniería de software, aplicando **Arquitectura Hexagonal (Puertos y Adaptadores)**, **principios SOLID**, **Clean Code** y **cobertura de pruebas unitarias automatizadas con Jest**.

---

## 🏛️ Arquitectura del Sistema

```text
                               ┌─────────────────────────────────────────┐
                               │           Next.js 14+ Frontend          │
                               │        (App Router, React, TS)          │
                               └────────────────────┬────────────────────┘
                                                    │ REST / WebSockets
                                                    ▼
                               ┌─────────────────────────────────────────┐
                               │             API Gateway                 │
                               └────────┬──────────────────────┬─────────┘
                                        │                      │
                                        ▼                      ▼
                     ┌───────────────────────┐    ┌───────────────────────┐
                     │    orders-service     │    │   telemetry-service   │
                     │  (NestJS + Hexagonal) │    │  (NestJS + Mongo)     │
                     └──────────┬────────────┘    └──────────┬────────────┘
                                │                            │
                                ▼ RabbitMQ Events            ▼
                     ┌────────────────────────────────────────────┐
                     │            ai-analytics-service            │
                     │       (Groq Cloud API + Tavily)            │
                     └────────────────────────────────────────────┘
```

### 🧩 Patrones de Arquitectura y Buenas Prácticas Aplicadas

* **Arquitectura Hexagonal (Ports & Adapters):** El dominio de negocio permanece 100% aislado de frameworks y ORMs. La infraestructura (DB, brokers de mensajería, APIs externas) implementa puertos mediante inyección de dependencias.
* **Persistencia Políglota (Polyglot Persistence):**
  * **PostgreSQL:** Garantiza integridad ACID para usuarios, órdenes y transacciones financieras.
  * **MongoDB:** Almacena eventos de geolocalización GPS masivos y logs semiestructurados.
* **Event-Driven Architecture (EDA):** Comunicación asíncrona entre microservicios utilizando **RabbitMQ** (AMQP) para desacoplar procesos.
* **Pruebas Unitarias & Cobertura (Jest):** Suite de tests aislando puertos mediante Mocks en cada microservicio para garantizar la confiabilidad del código.
* **Principios SOLID:**
  * *Single Responsibility:* Casos de uso atómicos.
  * *Open/Closed:* Extensión mediante adaptadores sin modificar el dominio.
  * *Liskov Substitution & Interface Segregation:* Puertos de interfaces granulares.
  * *Dependency Inversion:* Los módulos de alto nivel dependen de abstracciones (interfaces), no de implementaciones concretas.

---

## 📁 Estructura del Monorepo (`pnpm workspaces`)

```text
logipulse-ai/
├── apps/
│   ├── orders-service/          # 📦 Microservicio de Órdenes (PostgreSQL + REST + RabbitMQ + Jest)
│   ├── telemetry-service/       # 📍 Microservicio de Telemetría GPS (MongoDB + WebSockets + Jest)
│   ├── ai-analytics-service/    # 🤖 Microservicio de IA (Groq Cloud API + Tavily API + Jest)
│   └── web/                     # 💻 Frontend Next.js 14+ (App Router, Tailwind)
├── packages/
│   ├── shared-types/            # 📐 DTOs e Interfaces compartidas
│   └── config-eslint/           # ⚙️ Reglas de Clean Code
├── k8s/                         # ☸️ Manifiestos de Kubernetes (Deployments, Services, Ingress)
├── docker-compose.yml           # 🐳 Infraestructura Local (Postgres, Mongo, RabbitMQ)
├── pnpm-workspace.yaml          # 📦 Configuración de Monorepo pnpm
└── README.md
```

---

## 📚 Documentación de Microservicios

Para consultar el detalle técnico profundo de la arquitectura, esquemas de BD, endpoints y tests de cada servicio:

* 📦 **[Microservicio de Órdenes (orders-service)](/apps/orders-service/README.md)**: Documentación completa del microservicio relacional en NestJS + PostgreSQL + TypeORM + Jest Tests.
* 📍 **[Microservicio de Telemetría GPS (telemetry-service)](/apps/telemetry-service/README.md)**: Documentación completa del microservicio NoSQL en NestJS + MongoDB + WebSockets (Socket.io) + RabbitMQ Consumer + Jest Tests.
* 🤖 **[Microservicio de IA (ai-analytics-service)](/apps/ai-analytics-service/README.md)**: Documentación completa del microservicio de IA en NestJS + Groq Cloud API (`groq/compound-mini`) + Tavily Search API + Jest Tests.

---

## 🧪 Pruebas Unitarias y Reportes de Cobertura (Code Coverage)

El monorepo cuenta con suites de pruebas unitarias creadas con **Jest** y **NestJS Testing Module**. Para ejecutarlas desde la raíz:

```bash
# 1. Ejecutar pruebas unitarias del microservicio de Órdenes
pnpm test:orders

# 2. Ejecutar pruebas unitarias del microservicio de Telemetría
pnpm test:telemetry

# 3. Ejecutar pruebas unitarias del microservicio de IA
pnpm test:ai

# 4. Ejecutar TODAS las pruebas unitarias del Monorepo
pnpm test:all

# 5. Generar reporte completo de cobertura de código (Code Coverage Table)
pnpm test:cov
```

---

## ⚡ Guía de Inicio Rápido (Quick Start)

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

### 2. Iniciar Infraestructura de Bases de Datos & RabbitMQ con Docker:
```bash
docker-compose up -d
```
* **PostgreSQL:** `localhost:5433` (DB: `logipulse_db`, User: `logipulse_user`)
* **MongoDB:** `localhost:27017` (DB: `logipulse_telemetry`)
* **RabbitMQ Dashboard:** `http://localhost:15672` (User: `guest`, Pass: `guest`)

### 3. Iniciar Microservicios en desarrollo:
```bash
# Terminal 1: Servicio de Órdenes (Puerto 3001)
pnpm dev:orders

# Terminal 2: Servicio de Telemetría (Puerto 3002)
pnpm dev:telemetry

# Terminal 3: Servicio de IA (Puerto 3003)
pnpm dev:ai
```

---

## 🛠️ Tecnologías Utilizadas

| Categoría | Tecnologías |
|---|---|
| **Backend Framework** | NestJS, Node.js, Express, RxJS |
| **Frontend Framework** | Next.js 14+ (App Router), React, Tailwind CSS, TypeScript |
| **Testing & Coverage** | Jest, ts-jest, NestJS Testing Module, Code Coverage Reports |
| **Bases de Datos** | PostgreSQL (Relacional - TypeORM), MongoDB (NoSQL - Mongoose) |
| **Messaging & Async** | RabbitMQ (AMQP), Microservices ClientProxy |
| **IA & LLMs** | Groq Cloud API (`groq/compound-mini`, `groq/compound`, `openai/gpt-oss-120b`), Tavily Search API |
| **DevOps & Containers** | Docker, Docker Compose, Kubernetes, NGINX Ingress |
| **Herramientas & CI/CD** | pnpm Workspaces, Git, GitHub Actions, ESLint |

---

## 📄 Licencia

Este proyecto está licenciado bajo los términos de la licencia **MIT**.
