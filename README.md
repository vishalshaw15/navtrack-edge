# Tracker Backend

A robust NestJS backend application for tracking and processing events. This application provides a RESTful API with MongoDB integration, JWT authentication, and comprehensive event processing capabilities.

## Features

- **RESTful API**: Built with NestJS, following best practices and clean architecture
- **MongoDB Integration**: Efficient data storage and retrieval using Mongoose
- **JWT Authentication**: Secure user authentication and authorization
- **Event Processing**: Dedicated modules for event handling and processing
- **CORS Support**: Configurable CORS settings for frontend integration
- **Validation**: Request validation using class-validator
- **Configuration Management**: Environment-based configuration using @nestjs/config
- **Testing**: Comprehensive test suite with Jest

## Project Structure

```
src/
├── common/           # Shared utilities, guards, and interceptors
├── config/           # Application configuration
├── events/           # Event-related controllers and services
├── processed-events/ # Processed event handling
├── schemas/          # MongoDB schemas
├── users/            # User management
├── worker/           # Background job processing
├── app.controller.ts # Main application controller
├── app.module.ts     # Root application module
├── app.service.ts    # Main application service
└── main.ts           # Application entry point
```

## Prerequisites

- Node.js (v18 or higher)
- MongoDB (v6 or higher)
- Yarn package manager

## Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd tracker
```

2. Install dependencies:

```bash
yarn install
```

3. Create a `.env` file based on `.env.example`:

```bash
cp .env.example .env
```

4. Update the `.env` file with your configuration:

```env
PORT=3000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/tracker
JWT_SECRET=your-secret-key
JWT_EXPIRATION=1d
FRONTEND_URL=http://localhost:5173
```

## Running the Application

### Development Mode

```bash
# Start the application in development mode with hot-reload
yarn start:dev
```

### Production Mode

```bash
# Build the application
yarn build

# Start the application in production mode
yarn start:prod
```

### Docker Support

The application can be run using Docker:

```bash
# Build the Docker image
docker build -t tracker-backend .

# Run the container
docker run -p 3000:3000 tracker-backend
```

## API Documentation

The API is available at `http://localhost:3000/api` with the following endpoints:

- `/api/events` - Event management
- `/api/processed-events` - Processed event handling

## Testing

```bash
# Run unit tests
yarn test

# Run e2e tests
yarn test:e2e

# Run tests with coverage
yarn test:cov
```

## Development Guidelines

- Follow TypeScript best practices
- Use ESLint and Prettier for code formatting
- Write tests for new features
- Follow the project's architectural patterns
- Use meaningful commit messages

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the UNLICENSED License - see the LICENSE file for details.
