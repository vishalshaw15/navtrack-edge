# Development Documentation

## Assumptions

1. **Scalability**

   - Assumed that polling-based event processing is sufficient for the expected load
   - Assumed that MongoDB can handle the expected write/read patterns
   - Assumed that multiple server instances can safely process events concurrently

2. **Data Model**
   - Assumed that event data structure is stable and won't require frequent schema changes
   - Assumed that processed events need to be stored separately from raw events

## High-Level Development Approach

1. **Architecture**

   - Used NestJS framework for structured, modular development
   - Implemented a microservices-like architecture with separate modules for different concerns
   - Used MongoDB for data persistence with Mongoose for schema management
   - Implemented a polling-based event processing system

2. **Module Structure**

   - `EventsModule`: Handles event creation and management
   - `WorkerModule`: Processes unprocessed events
   - `ProcessedEventsModule`: Stores processed event data
   - `CommonModule`: Shared utilities and configurations
   - `ConfigModule`: Environment and application configuration

3. **Event Processing Flow**

   - Events are created and stored in MongoDB
   - Worker service polls for unprocessed events
   - Processing lock mechanism prevents duplicate processing
   - Events are processed and marked as completed
   - Processed events are stored separately for analytics

4. **Error Handling**
   - Implemented global error handling
   - Events with processing errors are marked and stored
   - Processing locks timeout after 5 minutes
   - Failed events can be retried

## Potential Improvements

1. **Event Processing**

   - **Current**: Polling-based approach with fixed intervals
   - **Improvement**: Implement event-driven architecture using message queues (e.g., RabbitMQ, Kafka)
   - **Benefit**: More efficient resource usage, better scalability, real-time processing

2. **Error Handling**

   - **Current**: Basic error logging and storage
   - **Improvement**: Implement structured error handling with retry mechanisms
   - **Benefit**: Better error recovery, improved system reliability

3. **Monitoring and Observability**

   - **Current**: Basic console logging
   - **Improvement**: Implement structured logging and metrics collection
   - **Benefit**: Better system visibility, easier debugging, proactive issue detection

4. **API Design**

   - **Current**: Basic REST endpoints
   - **Improvement**: Implement API versioning and documentation
   - **Benefit**: Better API maintainability, easier client integration

5. **Deployment**

   - **Current**: Basic Docker setup
   - **Improvement**: Implement CI/CD pipeline with automated testing and deployment
   - **Benefit**: Faster deployments, more reliable releases

## Features that could be improved

1. **Enhanced Analytics Dashboard**

   - **Current**: Basic event tracking and time spent metrics
   - **Improvement**: Add comprehensive analytics features

2. **Advanced Filtering Capabilities**

   - **Current**: Basic event filtering
   - **Improvement**: Implement sophisticated filtering options

## Pain Points

There were no significant pain points that I faced during development, except searching for how customJS could be tested without it getting approved, for which I had to do a google search. It would be better if that link to that doc would have been added in custom page marketplace page itself.
