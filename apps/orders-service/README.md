<div align="center">

# 📦 Microservicio de Órdenes (`orders-service`)

![NestJS](https://img.shields.io/badge/NestJS-E0234E?style=for-the-badge&logo=nestjs&logoColor=white)
![Jest](https://img.shields.io/badge/Jest-C21325?style=for-the-badge&logo=jest&logoColor=white)
![TypeORM](https://img.shields.io/badge/TypeORM-FE0803?style=for-the-badge&logo=typeorm&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)
![RabbitMQ](https://img.shields.io/badge/RabbitMQ-FF6600?style=for-the-badge&logo=rabbitmq&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)

</div>

---

## 📖 Descripción General

El **`orders-service`** es el microservicio transaccional principal de la plataforma **LogiPulse AI**. Es el responsable de administrar el ciclo de vida de los despachos (creación, cambio de estado a tránsito, entrega o reporte de incidentes), garantizar la consistencia de datos mediante **PostgreSQL** y notificar eventos en tiempo real al resto del sistema vía **RabbitMQ**.

---

## 🏛️ Arquitectura Hexagonal (Ports & Adapters)

Este microservicio aplica de forma estricta el patrón de **Arquitectura Hexagonal**, dividiendo la aplicación en 3 capas desacopladas:

```text
                             [ Client HTTP / REST ]
                                        │
                                        ▼ (Input Adapter)
                        ┌───────────────────────────────┐
                        │      OrderHttpController      │
                        └───────────────┬───────────────┘
                                        │
                                        ▼ (Application Layer)
                        ┌───────────────────────────────┐
                        │      CreateOrderUseCase       │
                        └───────┬───────────────┬───────┘
                                │               │
          (Output Port)         │               │         (Output Port)
     ┌──────────────────────────┘               └──────────────────────────┐
     ▼                                                                     ▼
┌──────────────────────────┐                               ┌──────────────────────────┐
│   OrderRepositoryPort    │                               │    EventPublisherPort    │
└────────────┬─────────────┘                               └────────────┬─────────────┘
             │                                                          │
             ▼ (Output Adapter)                                         ▼ (Output Adapter)
┌──────────────────────────┐                               ┌──────────────────────────┐
│TypeOrmOrderRepoAdapter   │                               │RabbitMqPublisherAdapter  │
└────────────┬─────────────┘                               └────────────┬─────────────┘
             │                                                          │
             ▼                                                          ▼
      [ PostgreSQL DB ]                                            [ RabbitMQ ]
```

---

## 🧪 Pruebas Unitarias y Cobertura (Unit Testing)

El microservicio incluye una suite completa de pruebas unitarias desarrolladas con **Jest** y el módulo `@nestjs/testing`, asegurando la calidad y el aislamiento del dominio:

### 🔬 Estructura de Pruebas:

* **Dominio (`test/unit/domain/`):**
  * `entities/order.entity.spec.ts`: Verifica reglas de negocio como transiciones de estado válidas y descarte de transiciones ilegales.
  * `exceptions/order-domain.exception.spec.ts`: Valida las excepciones personalizadas de dominio.
* **Aplicación (`test/unit/application/use-cases/`):**
  * `create-order.use-case.spec.ts`: Testea el flujo de creación de orden, la llamada al puerto del repositorio y la emisión del evento a RabbitMQ usando `jest.fn()`.
  * `get-order-by-id.use-case.spec.ts`: Valida la consulta por ID y la excepción `OrderNotFoundException`.
  * `update-order-status.use-case.spec.ts`: Prueba cambios de estado y publicación de eventos.
* **Infraestructura (`test/unit/infrastructure/`):**
  * `persistence/mappers/order.mapper.spec.ts`: Prueba la conversión bidireccional entre la entidad ORM y la entidad de dominio.
  * `persistence/adapters/typeorm-order-repository.adapter.spec.ts`: Prueba unitaria del adaptador de TypeORM usando un Mock del repositorio.
  * `messaging/adapters/rabbitmq-event-publisher.adapter.spec.ts`: Verifica la emisión de mensajes con Mock de `ClientProxy`.
  * `http/controllers/order.controller.spec.ts`: Prueba los endpoints HTTP asociándolos a los casos de uso.

### 🚀 Comandos para Ejecutar las Pruebas:

```bash
# Ejecutar las pruebas unitarias
pnpm test

# Generar reporte de cobertura de código (Code Coverage)
pnpm test:cov
```

---

## 🗄️ Esquema de Base de Datos (PostgreSQL)

Tabla **`orders`**:

| Columna | Tipo SQL | Restricciones | Descripción |
|---|---|---|---|
| `id` | `UUID` | PRIMARY KEY | Identificador único universal de la orden |
| `trackingNumber` | `VARCHAR` | UNIQUE, NOT NULL | Código de seguimiento (ej. `TRK-849201`) |
| `merchantId` | `VARCHAR` | NOT NULL | ID del cliente/comercio solicitante |
| `originAddress` | `VARCHAR` | NOT NULL | Dirección física de origen |
| `destinationAddress` | `VARCHAR` | NOT NULL | Dirección física de destino |
| `price` | `DECIMAL(10,2)` | NOT NULL | Monto del despacho |
| `status` | `VARCHAR` | NOT NULL | Estado: `CREATED`, `IN_TRANSIT`, `DELIVERED`, `INCIDENT` |
| `createdAt` | `TIMESTAMP` | DEFAULT `now()` | Fecha de creación |
| `updatedAt` | `TIMESTAMP` | DEFAULT `now()` | Fecha de última actualización |

---

## 📡 ESPECIFICACIÓN DE ENDPOINTS (API REST)

Base URL: `http://localhost:3001`

### 1. Poblar Base de Datos (Seeder)
* **POST** `/orders/seed`
* **Descripción:** Genera e inserta 5 órdenes de prueba realistas con distintos estados en PostgreSQL.

### 2. Listar todas las órdenes
* **GET** `/orders`

### 3. Crear una nueva orden
* **POST** `/orders`
* **Body:**
```json
{
  "merchantId": "merchant-123",
  "originAddress": "Av. Providencia 1234, Santiago",
  "destinationAddress": "Av. Apoquindo 5678, Las Condes",
  "price": 15000
}
```

### 4. Obtener orden por ID
* **GET** `/orders/:id`

### 5. Actualizar estado de una orden
* **PATCH** `/orders/:id/status`

---

## 🔔 Eventos Publicados en RabbitMQ

| Event Pattern | Payload | Descripción |
|---|---|---|
| `order.created` | `{ orderId, trackingNumber, merchantId, status, timestamp }` | Emitido al crear una orden. |
| `order.status_updated` | `{ orderId, trackingNumber, status, updatedAt }` | Emitido al cambiar de estado. |

---

## 🛠️ Ejecución Local

```bash
pnpm start:dev
```
