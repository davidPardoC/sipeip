# Program CRUD Implementation

This document outlines the complete CRUD (Create, Read, Update, Delete) implementation for the Program entity in the SIPEIP application.

## Files Created/Modified

### 1. Domain Types
- **`types/domain/program.entity.ts`** - Program interface definition

### 2. Database Layer
- **`repositories/program.repository.ts`** - Program repository with CRUD operations
- **`repositories/index.ts`** - Updated to include program repository

### 3. Business Logic Layer
- **`services/program.service.ts`** - Program service with business logic and logging
- **`services/index.ts`** - Updated to include program service

### 4. API Layer
- **`app/api/programs/route.ts`** - GET (all) and POST endpoints
- **`app/api/programs/[id]/route.ts`** - GET (by id), PUT, and DELETE endpoints

### 5. Validation Layer
- **`lib/validations/program.validators.ts`** - Zod schemas for validation

### 6. Frontend
- **`app/home/program/page.tsx`** - Complete UI for program management

### 7. Event Types
- **`types/event.types.ts`** - Added program-specific log events

### 8. Tests
- **`__tests__/unit/program.test.ts`** - Basic unit tests

## Features Implemented

### Repository Layer (`ProgramRepository`)
- ✅ `create(data)` - Create new program
- ✅ `getAll()` - Get all active programs
- ✅ `getById(id)` - Get program by ID
- ✅ `update(id, data)` - Update existing program
- ✅ `delete(id)` - Soft delete program (sets deletedAt timestamp)

### Service Layer (`ProgramService`)
- ✅ CRUD operations with business logic
- ✅ Event logging and publishing
- ✅ Automatic timestamp management
- ✅ Error handling for not found scenarios

### API Endpoints

#### GET `/api/programs`
- Returns all active programs
- Error handling with proper HTTP status codes

#### POST `/api/programs`
- Creates new program with validation
- Returns created program with 201 status
- Validates required fields and business rules

#### GET `/api/programs/[id]`
- Returns specific program by ID
- 404 if program not found
- 400 for invalid ID format

#### PUT `/api/programs/[id]`
- Updates existing program
- Validates input data
- 404 if program not found

#### DELETE `/api/programs/[id]`
- Soft deletes program
- 404 if program not found

### Validation
- ✅ Zod schemas for input validation
- ✅ Required field validation
- ✅ Date range validation (start < end)
- ✅ Budget format validation
- ✅ Proper error messages in Spanish

### Frontend Features
- ✅ Program listing with status indicators
- ✅ Create new program modal
- ✅ Edit existing program
- ✅ Delete program with confirmation
- ✅ Form validation
- ✅ Responsive design with Tailwind CSS
- ✅ Loading states
- ✅ Error handling

### Data Model
```typescript
interface Program {
  id: number;
  name: string;
  budget: string;
  startDate: string;
  endDate: string;
  status: "ACTIVE" | "INACTIVE" | "ARCHIVED" | null;
  createdBy?: string | null;
  updatedBy?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
  deletedAt?: string | null;
}
```

### Event Logging
- ✅ Program creation events
- ✅ Program update events  
- ✅ Program deletion events
- ✅ Kafka event publishing
- ✅ Local event emission for real-time updates

## Usage Examples

### Creating a Program
```typescript
const newProgram = await programService.create({
  name: "Infrastructure Development",
  budget: "50000000.00",
  startDate: "2024-01-01",
  endDate: "2024-12-31",
  status: "ACTIVE"
});
```

### API Usage
```bash
# Get all programs
curl GET /api/programs

# Create program
curl -X POST /api/programs \
  -H "Content-Type: application/json" \
  -d '{"name":"Test Program","budget":"100000","startDate":"2024-01-01","endDate":"2024-12-31"}'

# Update program
curl -X PUT /api/programs/1 \
  -H "Content-Type: application/json" \
  -d '{"name":"Updated Program Name"}'

# Delete program
curl -X DELETE /api/programs/1
```

## Security & Best Practices

- ✅ Input validation using Zod schemas
- ✅ Proper error handling and HTTP status codes
- ✅ Soft delete implementation (preserves data)
- ✅ Audit fields (created/updated timestamps and users)
- ✅ Event logging for audit trails
- ✅ TypeScript for type safety
- ✅ Consistent code patterns following existing codebase

## Testing

Basic unit tests are included to verify the entity structure. Integration tests can be added to test the full CRUD flow.

## Database Schema

The program table schema is already defined in `infraestructure/database/schemas/program.ts` with the following structure:

- `id` (serial, primary key)
- `name` (text, not null)
- `budget` (decimal(10,2), not null)
- `startDate` (date, not null)
- `endDate` (date, not null)
- `status` (enum: ACTIVE, INACTIVE, ARCHIVED)
- Audit fields: `createdBy`, `updatedBy`, `createdAt`, `updatedAt`, `deletedAt`

This implementation provides a complete, production-ready CRUD system for the Program entity following the established patterns in the codebase.
