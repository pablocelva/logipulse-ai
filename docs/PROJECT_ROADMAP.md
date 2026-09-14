# 🗺️ Roadmap de Desarrollo y Backlog del Proyecto - LogiPulse AI

Este documento registra las fases de evolución del sistema **LogiPulse AI** para futuras iteraciones y sprint planning.

---

## 📌 Fases del Roadmap

### 🚀 Fase 1: DevOps, Contenedores & Despliegue a Producción (EN PROCESO)
- **Dockerización Multi-Stage**: `Dockerfile` optimizados para producción con compilación aislada en Node.js 20 Alpine para `orders-service`, `telemetry-service`, `ai-analytics-service` y `apps/web`.
- **Manifiestos de Kubernetes (`k8s/`)**: Arquitectura de orquestación completa con `Deployments`, `Services`, `ConfigMaps`, `Secrets` e `Ingress NGINX`.
- **Pipeline de CI/CD (GitHub Actions)**: Automatización de pruebas unitarias (`pnpm test:all`), linters y construcción de imágenes Docker en `.github/workflows/ci.yml`.

---

### ✨ Fase 2: Funcionalidades Avanzadas de Producto & Dashboard (`apps/web`)
- **Simulador Interactivo de Movimiento Continuo**:
  - Animación fluida paso a paso de camionetas avanzando a lo largo de las carreteras en el mapa.
  - Emisión periódica de WebSockets (`socket.io-client`) cada 2 segundos simulando telemetría viva.
- **Modal de Detalle de Vehículo y Trazado de Ruta (`Polyline`)**:
  - Vista modal emergente al hacer clic en un vehículo o fila de orden.
  - Renderizado del historial de ruta como línea coloreada (`Polyline`) en Leaflet.
  - Gráfico interactivo de velocidad (km/h) y nivel de batería del GPS en el tiempo.
- **Formulario Interactivo para Nuevas Órdenes**:
  - Formulario desplegable con validación `react-hook-form` / `zod` para crear órdenes personalizadas en PostgreSQL desde el Dashboard.
- **Filtros Avanzados y Búsqueda en Vivo**:
  - Filtrado combinado por estado (`CREATED`, `IN_TRANSIT`, `DELIVERED`, `INCIDENT`), comercio/merchant y rango de fechas.

---

### 🔒 Fase 3: Seguridad, Autenticación, Observabilidad & Resiliencia
- **Autenticación & Autorización (JWT / RBAC)**:
  - Implementación de `@nestjs/jwt` y Guards para proteger los endpoints REST.
  - Control de acceso basado en roles (`ADMIN`, `DISPATCHER`, `DRIVER`).
- **Health Checks & Monitoring (`@nestjs/terminus`)**:
  - Endpoints de salud `/health` comprobando disponibilidad en vivo de PostgreSQL, MongoDB y RabbitMQ.
- **Observabilidad (Prometheus + Grafana)**:
  - Exposición de métricas Prometheus para monitorear latencia de peticiones, consumo de CPU/memoria y rendimiento del broker RabbitMQ.
- **Rate Limiting & Throttling (`@nestjs/throttler`)**:
  - Protección de seguridad en endpoints REST y API Gateway contra abusos o ataques DDoS.

---

### 🤖 Fase 4: Evolución del Agente de Inteligencia Artificial
- **Persistencia e Historial de Diagnósticos IA**:
  - Colección MongoDB para auditar todos los análisis generados por Groq LLM + Tavily.
  - Panel analítico para revisar incidentes recurrentes por comuna/región.
- **Disparo Automático de Evento de Reenrutamiento**:
  - Emisión del evento AMQP `incident.diagnosed` cuando la IA detecte severidad `HIGH` o `CRITICAL`.
  - Actualización automática del cliente web ofreciendo un desvío / ruta alternativa calculada en tiempo real.
