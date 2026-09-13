<div align="center">

# 🤖 Microservicio de Inteligencia Artificial (`ai-analytics-service`)

![NestJS](https://img.shields.io/badge/NestJS-E0234E?style=for-the-badge&logo=nestjs&logoColor=white)
![Jest](https://img.shields.io/badge/Jest-C21325?style=for-the-badge&logo=jest&logoColor=white)
![Groq AI](https://img.shields.io/badge/Groq_Cloud_API-f34f29?style=for-the-badge&logo=openai&logoColor=white)
![Tavily API](https://img.shields.io/badge/Tavily_Search_API-000000?style=for-the-badge&logo=google&logoColor=white)
![RabbitMQ](https://img.shields.io/badge/RabbitMQ-FF6600?style=for-the-badge&logo=rabbitmq&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)

</div>

---

## 📖 Descripción General

El **`ai-analytics-service`** es el microservicio encargado del **análisis inteligente de incidentes y generación de diagnósticos en tiempo real**. Utiliza **Tavily Search API** para investigar noticias de tráfico y condiciones meteorológicas reales del entorno del despacho, e inferencia ultrarrápida en **Groq Cloud API (groq/compound-mini y modelos de contingencia)** formateada en JSON estructurado.

---

## 🏛️ Arquitectura Hexagonal y Flujo de IA

```text
                               ┌────────────────────────────────┐
                               │  RabbitMQ Event: INCIDENT /    │
                               │    REST POST /ai/analyze       │
                               └───────────────┬────────────────┘
                                               │
                                               ▼
                               ┌────────────────────────────────┐
                               │     AnalyzeIncidentUseCase     │
                               └───────┬────────────────┬───────┘
                                       │                │
             (WebSearchPort)           │                │         (AiModelPort)
    ┌──────────────────────────────────┘                └──────────────────────────────────┐
    ▼                                                                                      ▼
┌──────────────────────────────┐                                       ┌──────────────────────────────┐
│    TavilyWebSearchAdapter    │                                       │     GroqAiClientAdapter      │
│  (Búsqueda de Vías en Tiempo)│                                       │ (LLM Groq JSON Mode)│
└──────────────┬───────────────┘                                       └──────────────┬───────────────┘
               │                                                                      │
               ▼                                                                      ▼
       [ Tavily Web API ]                                                     [ Groq Cloud API ]
```

---

## 🧪 Pruebas Unitarias y Cobertura (Unit Testing)

El microservicio cuenta con pruebas unitarias desarrolladas en **Jest** que aíslan el modelo LLM y las llamadas a la web mediante Mocks de los puertos `AiModelPort` y `WebSearchPort`:

### 🔬 Estructura de Pruebas:

* **Dominio (`test/unit/domain/entities/`):**
  * `incident-analysis.entity.spec.ts`: Valida las reglas de negocio de severidad crítica (`isCritical()`).
* **Aplicación (`test/unit/application/use-cases/`):**
  * `analyze-incident.use-case.spec.ts`: Prueba la coordinación entre la búsqueda en tiempo real con Tavily y la inferencia estructurada de Groq Cloud usando Mocks.

### 🚀 Comandos para Ejecutar las Pruebas:

```bash
# Ejecutar las pruebas unitarias
pnpm test

# Generar reporte de cobertura de código (Code Coverage)
pnpm test:cov
```

---

## 📡 ESPECIFICACIÓN DE ENDPOINTS (REST API)

Base URL: `http://localhost:3003`

### 1. Probar Análisis de Incidente con IA (Demo)
* **POST** `/ai/seed-demo`
* **Descripción:** Ejecuta una demostración de análisis de incidente para la orden `TRK-357064` en Vitacura.

### 2. Analizar Incidente Personalizado
* **POST** `/ai/analyze-incident`
* **Body:**
```json
{
  "trackingNumber": "TRK-990011",
  "location": "Autopista Central km 14, Santiago",
  "description": "Camión ponchado en carril central"
}
```

---

## 🛠️ Ejecución Local

```bash
pnpm start:dev
```
