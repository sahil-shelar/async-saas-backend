# AsyncSaaS – Scalable Backend with Asynchronous Processing

AsyncSaaS is a production-style backend system demonstrating how synchronous APIs can offload heavy processing to background workers using message queues.

The project is designed to reflect real-world SaaS architecture patterns such as asynchronous job processing, service isolation, and containerized deployments.

---

## Architecture Overview

The system consists of four core components:

- **API Service (Node.js)** – Handles authentication, job creation, and user-facing APIs.
- **Message Broker (RabbitMQ)** – Acts as a buffer between the API and background workers.
- **Worker Service (Python)** – Consumes jobs asynchronously and processes them independently.
- **Database (MongoDB)** – Persists users, jobs, and processing results.

Client → API → MongoDB
↓
RabbitMQ
↓
Worker → MongoDB


---

## Key Features

- JWT-based authentication
- Multi-tenant data isolation
- Asynchronous job processing
- Background workers using RabbitMQ
- Docker Compose–based orchestration
- One-command local setup

---

## Tech Stack

- Node.js (Express)
- Python
- MongoDB
- RabbitMQ
- Docker & Docker Compose
- JWT Authentication

---

## Running the Project

The entire system can be started using Docker Compose:

```bash
docker-compose up --build

Once running:

API: http://localhost:4000

Health check: GET /health
