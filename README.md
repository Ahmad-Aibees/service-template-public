# Service-Template

This repository serves as a template for creating consumer microservices in a microservices architecture. It is designed for small companies that prefer a simple microservices structure without the complexity of systems like Kafka. The system uses a REST API for communication, allowing easy integration and minimal configuration.

## Features

- **Microservice Architecture:** Designed for simplicity, the system follows a microservices architecture.
- **Consumer Server:** Manages services provided to users, provides APIs for frontend apps, and connects to internal microservices.
- **Provider Services:** Serve specific purposes (e.g., auth-ms for authorization). Each frontend app corresponds to one provider.
- **Multi-Instance Support:** Addresses single points of failure by supporting multiple instances.

## Rules

1. Consumers can only connect to providers and frontend apps.
2. Each frontend app should have a corresponding provider.
3. Providers cannot connect to other providers.

## Authentication

- Provider services authenticate using tokens hashed with one-way hashing.
- Tokens are generated and submitted to the discovery database.
- Consumers fetch the current token from the discovery database using the service type enum.
- Retry policy for unauthorized tokens: 2 retries on a 401 error.

## Getting Started

1. Run `npm install`.
2. Create a `.env` file in the root folder with the entry `NODE_ENV={environment_type}`.
    - Example: `NODE_ENV=local`.
3. Create a `.{environment_type}.env` file in `src/common/config` folder based on `.example.env` (fill in details based on comments).
    - Example: `.local.env` if NODE_ENV is set to `local`.
4. Run `npm run start`.

## Environment Requirements

- MongoDB server (at least one).

## Swagger Documentation

- Swagger documentation is available at `{uri}/swagger`.
- To enable swagger set swagger_enabled to 1 in the environment config file.

## Note

- Ensure MongoDB is set up before running the code.
