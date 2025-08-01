
# Project Modules Structure

This directory contains modular components of our application organized by functionality:

## Directory Structure

- `api/`: API clients and services
  - `medusa/`: Medusa e-commerce backend client
  - `payment/`: Payment and shipping integration services

- `hooks/`: Custom React hooks
  - Various hooks for data fetching and state management

- `components/`: (To be created) Reusable UI components
  - Can be further organized by feature or function

- `utils/`: (To be created) Helper functions and utilities
  - Formatting, validation, transformation utilities

- `types/`: (To be created) TypeScript type definitions
  - Shared types and interfaces

## Import Guidelines

For cleaner imports, use the index files in each module directory:

```typescript
// Good - Uses the index file
import { medusaClient } from '@/modules/api';

// Avoid - Direct imports to deep files
import { medusaClient } from '@/modules/api/medusa/medusa-client';
```

## Adding New Modules

When adding new functionality:

1. Create a new directory in the appropriate module category
2. Implement your feature with small, focused files
3. Export from the module's index.ts file
4. Document any necessary usage information
