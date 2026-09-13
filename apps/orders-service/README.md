<div align="center">

# 📦 Microservicio de Órdenes (`orders-service`)

![NestJS](https://img.shields.io/badge/NestJS-E0234E?style=for-the-badge&logo=nestjs&logoColor=white)
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

### 🧠 Capas de la Aplicación:

1. **`domain/` (Dominio Puro):**
   * **`Order` (Entidad):** Encapsula el estado de la orden y las reglas de negocio (ej. validación de transiciones de estado mediante `markAsInTransit()`, `markAsDelivered()`, `reportIncident()`). Sin dependencias de NestJS ni TypeORM.
   * **`OrderRepositoryPort` & `EventPublisherPort` (Puertos):** Interfaces de TypeScript que definen los contratos para interactuar con la infraestructura.
   * **`OrderDomainException`:** Excepciones de dominio fuertemente tipadas.

2. **`application/` (Casos de Uso):**
   * **`CreateOrderUseCase`:** Coordina la creación de la orden y emisión del evento `order.created`.
   * **`GetOrderByIdUseCase`:** Recupera órdenes desde el repositorio.
   * **`UpdateOrderStatusUseCase`:** Ejecuta transiciones de estado y publica `order.status_updated`.
   * **DTOs:** Validaciones estrictas de entrada usando `class-validator` y `class-transformer`.

3. **`infrastructure/` (Adaptadores Concretos):**
   * **`persistence/`:** Entidad ORM de TypeORM (`OrderOrmEntity`), Mapeador (`OrderMapper`) y Adaptador de repositorio (`TypeOrmOrderRepositoryAdapter`).
   * **`messaging/`:** Adaptador de publicación a RabbitMQ (`RabbitMqEventPublisherAdapter`).
   * **`http/`:** Controlador REST (`OrderController`).

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
* **Respuesta (201 Created):** Array de 5 órdenes creadas.

### 2. Listar todas las órdenes
* **GET** `/orders`
* **Respuesta (200 OK):**
```json
[
  {
    "id": "e4a9b21f-7f12-4c31-891d-5b32f14a091a",
    "trackingNumber": "TRK-492104",
    "merchantId": "merchant-alpha",
    "originAddress": "Av. Providencia 1234, Santiago",
    "destinationAddress": "Av. Apoquindo 5678, Las Condes",
    "price": 15000,
    "status": "CREATED",
    "createdAt": "2026-09-13T15:25:40.000Z",
    "updatedAt": "2026-09-13T15:25:40.000Z"
  }
]
```

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
* **Respuesta (201 Created):** Objeto `Order` con ID y `trackingNumber` asignado.

### 4. Obtener orden por ID
* **GET** `/orders/:id`
* **Respuesta (200 OK):** Objeto de la orden correspondiente.

### 5. Actualizar estado de una orden
* **PATCH** `/orders/:id/status`
* **Body:**
```json
{
  "status": "IN_TRANSIT"
}
```
* **Respuesta (200 OK):** Orden actualizada con nuevo estado.

---

## 🔔 Eventos Publicados en RabbitMQ

| Event Pattern | Payload | Descripción |
|---|---|---|
| `order.created` | `{ orderId, trackingNumber, merchantId, status, timestamp }` | Emitido al crear una orden. Consumido por el microservicio de telemetría e IA. |
| `order.status_updated` | `{ orderId, trackingNumber, status, updatedAt }` | Emitido al cambiar de estado. |

---

## 🛠️ Ejecución Local

Desde la raíz del monorepo:

```bash
# Iniciar en modo desarrollo con watch
pnpm dev:orders
```

O desde la carpeta `apps/orders-service`:

```bash
pnpm start:dev
```
