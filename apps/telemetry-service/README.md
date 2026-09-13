<div align="center">

# 📍 Microservicio de Telemetría GPS (`telemetry-service`)

![NestJS](https://img.shields.io/badge/NestJS-E0234E?style=for-the-badge&logo=nestjs&logoColor=white)
![Jest](https://img.shields.io/badge/Jest-C21325?style=for-the-badge&logo=jest&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![Mongoose](https://img.shields.io/badge/Mongoose-880000?style=for-the-badge&logo=mongoose&logoColor=white)
![Socket.io](https://img.shields.io/badge/Socket.io-010101?style=for-the-badge&logo=socketdotio&logoColor=white)
![RabbitMQ](https://img.shields.io/badge/RabbitMQ-FF6600?style=for-the-badge&logo=rabbitmq&logoColor=white)

</div>

---

## 📖 Descripción General

El **`telemetry-service`** es el microservicio encargado del procesamiento de datos de **geolocalización GPS de choferes a alta velocidad**, persistencia de eventos semiestructurados en **MongoDB** y retransmisión en tiempo real vía **WebSockets (Socket.io)** hacia el dashboard de la plataforma. Además, consume asíncronamente los eventos emitidos por el microservicio de órdenes en **RabbitMQ**.

---

## 🏛️ Arquitectura y Flujo de Datos

```text
[ Dispositivo Móvil / Chofer ] ── WebSocket / REST ──┐
                                                    ▼
                                     ┌───────────────────────────────┐
                                     │       TelemetryGateway        │
                                     │         (Socket.io)           │
                                     └──────────────┬────────────────┘
                                                    │
                                                    ▼ (UseCase)
                                     ┌───────────────────────────────┐
                                     │     RecordLocationUseCase     │
                                     └──────────────┬────────────────┘
                                                    │
                                                    ▼ (Adapter)
                                     ┌───────────────────────────────┐
                                     │ MongooseTelemetryRepoAdapter  │
                                     └──────────────┬────────────────┘
                                                    │
                                                    ▼
                                           [ MongoDB Database ]
```

---

## 🧪 Pruebas Unitarias y Cobertura (Unit Testing)

El microservicio incluye pruebas unitarias completas desarrolladas con **Jest** y Mocks de Mongoose y WebSockets:

### 🔬 Estructura de Pruebas:

* **Dominio (`test/unit/domain/entities/`):**
  * `telemetry-point.entity.spec.ts`: Verifica métodos de dominio como la detección de exceso de velocidad (`isHighSpeed()`).
* **Aplicación (`test/unit/application/use-cases/`):**
  * `record-location.use-case.spec.ts`: Prueba la grabación de posiciones GPS usando Mocks del puerto de repositorio.
  * `get-location-history.use-case.spec.ts`: Prueba la consulta de historial de ruta y la generación de puntos simulados (`seedRouteTelemetry`).
* **Infraestructura (`test/unit/infrastructure/`):**
  * `persistence/adapters/mongoose-telemetry-repository.adapter.spec.ts`: Prueba unitaria del adaptador de Mongoose para MongoDB.
  * `websockets/telemetry.gateway.spec.ts`: Prueba la gestión de salas en Socket.io (`joinTrackingRoom`) y la transmisión en vivo de coordenadas (`driverLocationUpdate`).
  * `messaging/consumers/order-events.consumer.spec.ts`: Verifica la recepción de eventos de RabbitMQ.
  * `http/controllers/telemetry.controller.spec.ts`: Prueba los endpoints REST.

### 🚀 Comandos para Ejecutar las Pruebas:

```bash
# Ejecutar las pruebas unitarias
pnpm test

# Generar reporte de cobertura de código (Code Coverage)
pnpm test:cov
```

---

## 🗄️ Colección de MongoDB (`gps_telemetry`)

```json
{
  "_id": "ObjectId",
  "uuid": "550e8400-e29b-41d4-a716-446655440000",
  "orderId": "e4a9b21f-7f12-4c31-891d-5b32f14a091a",
  "trackingNumber": "TRK-492104",
  "driverId": "driver-chofer-1",
  "latitude": -33.4255,
  "longitude": -70.6148,
  "speedKmH": 55.4,
  "batteryLevel": 92,
  "timestamp": "2026-09-13T15:30:00.000Z"
}
```

---

## 📡 ESPECIFICACIÓN DE ENDPOINTS (REST & WebSockets)

Base URL REST: `http://localhost:3002`
WebSocket Namespace: `ws://localhost:3002/telemetry`

### 1. Poblar Ruta de Coordenadas GPS de Prueba (Seeder)
* **POST** `/telemetry/seed/:trackingNumber`

### 2. Consultar Historial de Ruta GPS de una Orden
* **GET** `/telemetry/tracking/:trackingNumber`

### 3. Registrar Coordenada GPS vía REST
* **POST** `/telemetry`

### ⚡ Eventos WebSocket (Socket.io)
* **Evento de Suscripción:** `joinTrackingRoom` con payload `{ "trackingNumber": "TRK-492104" }`.
* **Evento Transmitido en Vivo:** `locationUpdated` con el punto GPS recién grabado.

---

## 🛠️ Ejecución Local

```bash
pnpm start:dev
```
