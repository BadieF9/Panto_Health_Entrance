# X-ray Data Processing Service

This service processes and stores x-ray data. It receives data, validates it, and saves it to a database.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Running the Application](#running-the-application)
- [Running the Tests](#running-the-tests)
- [API Documentation (Swagger)](#api-documentation-swagger)

## Prerequisites

Before getting started, ensure you have the following installed:

- **Development Environment:**
  - Node.js (v20 or higher recommended) - [Node.js Installation](https://nodejs.org/)
  - npm (Node Package Manager) or yarn - Included with Node.js installation
  - pnpm (Package manager) - [pnpm Installation](https://pnpm.io/installation)
- **Services (for local development or Docker):**
  - MongoDB (running instance or connection string) - See [MongoDB Installation](https://www.mongodb.com/try/download/community)
  - RabbitMQ (running instance if using RabbitMQ) - See [RabbitMQ Installation](https://www.rabbitmq.com/download.html)
- **Containerization:**
  - Docker and Docker Compose - See [Docker Installation](https://docs.docker.com/get-docker/)

## Installation

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/BadieF9/Panto_Health_Entrance.git
    cd Panto_Health_Entrance
    ```

2.  **Install dependencies:**

    ```bash
    pnpm install  # or npm install or yarn install
    ```

## Running the Application

This application can be run either locally (for development) or using Docker and Docker Compose.

**A. Local Development (without Docker):**

1.  **Start MongoDB:** Ensure you have a running MongoDB instance. If you installed MongoDB locally, start the MongoDB server using the appropriate command for your operating system (e.g., `mongod` in a separate terminal).

2.  **Start RabbitMQ:** Make sure you have a running RabbitMQ instance. Start the RabbitMQ server using the appropriate command for your operating system (e.g., `rabbitmq-server`).

3.  **Configure Environment Variables:**

    Create a `.env` file in the root of your project and add the necessary environment variables (e.g., database connection string, RabbitMQ connection details). See the `.env.sample` file for more details. If you don't use a `.env` file, ensure to set them in the terminal before running the app. Make sure these environment variables point to your _local_ MongoDB and RabbitMQ instances (e.g., `mongodb://localhost:27017/xray_db`, `amqp://localhost:5672`).

4.  **Start the NestJS application:**

    ```bash
    pnpm start:dev  # or npm run start:dev, or yarn start:dev
    ```

    This will start the NestJS application in development mode with hot reloading.

**B. Using Docker and Docker Compose:**

1.  **Configure Environment Variables (Optional):**

    Create a `.env` file in the root of your project and add the necessary environment variables (e.g., database connection string, RabbitMQ connection details). See the `.env.sample` file for more details. If you don't use a `.env` file, ensure to set them in the terminal before running the app. When using Docker, these environment variables should use the container names for MongoDB and RabbitMQ (e.g., `mongodb://mongodb:27017/xray_db`, `amqp://rabbitmq:5672`).

2.  **Start the services using Docker Compose:**

    ```bash
    docker-compose up -d --build
    ```

    - `-d`: Runs the containers in detached mode (in the background).
    - `--build`: Builds (or rebuilds) the Docker images if there are changes to the `Dockerfile`. This is important to ensure that any changes you've made to your code or dependencies are reflected in the running containers.

3.  **Stop the services:**

    ```bash
    docker-compose down
    ```

## Running the Tests

```bash
pnpm test  # or yarn test
```

## API Documentation (Swagger)

This service's API is documented using Swagger. Once the application is running, you can access the interactive API documentation by opening your web browser and navigating to:

```bash
http://localhost:3000/api
```
