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

- Node.js (v16 or higher recommended)
- pnpm or npm (Node Package Manager) or yarn
- MongoDB (running instance or connection string) - See [MongoDB Installation](https://www.mongodb.com/try/download/community)
- RabbitMQ (running instance if using RabbitMQ) - See [RabbitMQ Installation](https://www.rabbitmq.com/download.html) (Optional)

## Installation

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/BadieF9/Panto_Health_Entrance.git
    cd your-repo-name
    ```

2.  **Install dependencies:**

    ```bash
    pnpm install  # or npm install or yarn install
    ```

## Running the Application

1.  **Configure Environment Variables (Optional):**

    Create a `.env` file in the root of your project and add the necessary environment variables (e.g., database connection string, RabbitMQ connection details). See the Environment Variables from .env.sample file. If you don't use a `.env` file, ensure to set them in the terminal before running the app.

2.  **Start the development server:**

    ```bash
    pnpm start:dev  # or yarn start:dev
    ```

    This will start the NestJS application in development mode with hot reloading.

## Running the Tests

```bash
pnpm test  # or yarn test
```

## API Documentation (Swagger)

This service's API is documented using Swagger. Once the application is running, you can access the interactive API documentation by opening your web browser and navigating to:

```bash
http://localhost:3000/api
```
