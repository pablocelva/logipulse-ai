<div align="center">

# 🚚 LogiPulse AI
### *Plataforma SaaS de Gestión Logística, Telemetría e Inteligencia Artificial en Tiempo Real*

![NestJS](https://img.shields.io/badge/NestJS-E0234E?style=for-the-badge&logo=nestjs&logoColor=white)
![Next.js](https://img.shields.io/badge/Next.js_14+-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![RabbitMQ](https://img.shields.io/badge/RabbitMQ-FF6600?style=for-the-badge&logo=rabbitmq&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)
![Kubernetes](https://img.shields.io/badge/Kubernetes-326CE5?style=for-the-badge&logo=kubernetes&logoColor=white)
![Groq AI](https://img.shields.io/badge/Groq_AI_Llama_3.1-f34f29?style=for-the-badge&logo=openai&logoColor=white)
![pnpm](https://img.shields.io/badge/pnpm_workspaces-F69220?style=for-the-badge&logo=pnpm&logoColor=white)

</div>

---

## 🎯 Descripción del Proyecto

**LogiPulse AI** es una plataforma SaaS distribuida para la gestión logística de envíos y trazabilidad de flotas en tiempo real. Combina una arquitectura de **microservicios orientada a eventos (EDA)**, **persistencia políglota** (PostgreSQL + MongoDB), **despliegue en contenedores** (Docker y Kubernetes) y **asistencia inteligente de IA** (Groq API + Tavily Search API) para el diagnóstico automático de incidentes de tráfico y clima.

Este proyecto ha sido diseñado bajo los estándares más exigentes de ingeniería de software, aplicando **Arquitectura Hexagonal (Puertos y Adaptadores)**, **principios SOLID** y **Clean Code**.

---

## 🏛️ Arquitectura del Sistema

```
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
                     │       (Groq API Llama 3.1 + Tavily)        │
                     └────────────────────────────────────────────┘
```

### 🧩 Patrones de Arquitectura y Buenas Prácticas Aplicadas

* **Arquitectura Hexagonal (Ports & Adapters):** El dominio de negocio permanece 100% aislado de frameworks y ORMs. La infraestructura (DB, brokers de mensajería, APIs externas) implementa puertos mediante inyección de dependencias.
* **Persistencia Políglota (Polyglot Persistence):**
  * **PostgreSQL:** Garantiza integridad ACID para usuarios, órdenes y transacciones financieras.
  * **MongoDB:** Almacena eventos de geolocalización GPS masivos y logs semiestructurados.
* **Event-Driven Architecture (EDA):** Comunicación asíncrona entre microservicios utilizando **RabbitMQ** (AMQP) para desacoplar procesos.
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
│   ├── orders-service/          # 📦 Microservicio de Órdenes (PostgreSQL + REST + RabbitMQ)
│   ├── telemetry-service/       # 📍 Microservicio de Telemetría GPS (MongoDB + WebSockets)
│   ├── ai-analytics-service/    # 🤖 Microservicio de IA (Groq Llama 3.1 + Tavily API)
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

Para consultar el detalle técnico profundo de la arquitectura, esquemas de BD y endpoints de cada servicio:

* 📖 **[Microservicio de Órdenes (orders-service)](/apps/orders-service/README.md)**: Documentación completa del microservicio relacional en NestJS.

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

### 3. Iniciar el Microservicio de Órdenes en desarrollo:
```bash
pnpm dev:orders
```

---

## 🧪 Pruebas y Seeders de Demostración

Una vez que `orders-service` esté corriendo en el puerto `3001`:

```bash
# 1. Poblar la base de datos PostgreSQL con 5 órdenes reales usando el Seeder
curl -X POST http://localhost:3001/orders/seed

# 2. Consultar todas las órdenes registradas
curl http://localhost:3001/orders
```

---

## 🛠️ Tecnologías Utilizadas

| Categoría | Tecnologías |
|---|---|
| **Backend Framework** | NestJS, Node.js, Express, RxJS |
| **Frontend Framework** | Next.js 14+ (App Router), React, Tailwind CSS, TypeScript |
| **Bases de Datos** | PostgreSQL (Relacional - TypeORM), MongoDB (NoSQL - Mongoose) |
| **Messaging & Async** | RabbitMQ (AMQP), Microservices ClientProxy |
| **IA & LLMs** | Groq API (Llama 3.1 70B / Llama 3.3), Tavily Search API |
| **DevOps & Containers** | Docker, Docker Compose, Kubernetes, NGINX Ingress |
| **Herramientas & CI/CD** | pnpm Workspaces, Git, GitHub Actions, Jest, ESLint |

---

## 📄 Licencia

Este proyecto está licenciado bajo los términos de la licencia **MIT**.
