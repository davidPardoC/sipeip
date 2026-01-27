# Phase 1: Database & Core Logic - COMPLETION SUMMARY

**Date:** 2026-01-27
**Status:** ✅ COMPLETED

## Overview
Phase 1 focused on updating the database schemas to support the new activity monitoring and objective fulfillment tracking requirements from the exam specifications.

---

## 1. New Enum Types Created

### File: `infraestructure/database/schemas/status-enum.ts`

**ActivityReportedStatusEnum**
- `NO_INICIADA` - Activity not started (progress = 0%)
- `EN_RIESGO` - Activity at risk (actual end date > planned end date)
- `COMPLETADA` - Activity completed on time

**FulfillmentRuleEnum**
- `AND` - Objective fulfilled if ALL indicators are met (Rule 1)
- `OR` - Objective fulfilled if AT LEAST ONE indicator is met (Rule 2)

**FulfillmentStatusEnum**
- `CUMPLIDO` - Objective fulfilled
- `EN_PROGRESO` - Objective in progress
- `NO_CUMPLIDO` - Objective not fulfilled

---

## 2. Activity Schema Updates

### File: `infraestructure/database/schemas/activity.ts`

**New Fields Added:**

| Field | Type | Description | Required | Default |
|-------|------|-------------|----------|---------|
| `activityCode` | text | Unique code per project (ACT001, ACT002...) | Yes | - |
| `actualStartDate` | date | Real start date (filled when starting) | No | null |
| `actualEndDate` | date | Real end date (filled when completing) | No | null |
| `plannedDuration` | integer | Planned duration in days | No | null |
| `plannedProgress` | decimal(5,2) | Planned progress percentage | No | 0.00 |
| `actualProgress` | decimal(5,2) | Actual progress (avance_real) | No | 0.00 |
| `priority` | integer | Priority level (1-5) | Yes | 3 |
| `reportedStatus` | enum | Calculated status (NO_INICIADA/EN_RIESGO/COMPLETADA) | No | NO_INICIADA |

**Existing Fields Retained:**
- id, name, description, responsiblePerson
- startDate, endDate, progressPercent, executedBudget
- status (PLANNED/IN_PROGRESS/COMPLETED/CANCELLED/ON_HOLD)
- Audit fields: createdBy, updatedBy, createdAt, updatedAt, deletedAt
- Relation: projectId

---

## 3. New Activity-Objective Junction Table

### File: `infraestructure/database/schemas/activity-objective.ts`

**Purpose:** Enables many-to-many relationship between activities and strategic objectives (V-03 validation requirement)

**Fields:**
- `id` - Primary key
- `activityId` - Foreign key to activity (cascade delete)
- `strategicObjectiveId` - Foreign key to strategic_objective (cascade delete)
- `createdBy` - Audit field
- `createdAt` - Audit field

**Business Rules:**
- Activities can be linked to multiple strategic objectives
- Required for V-02 validation (activity cannot be approved without objectives)
- Cascade delete ensures referential integrity

---

## 4. Strategic Objective Schema Updates

### File: `infraestructure/database/schemas/strategic-objectives.ts`

**New Fields Added:**

| Field | Type | Description | Default |
|-------|------|-------------|---------|
| `fulfillmentRule` | enum | Rule to determine objective fulfillment (AND/OR) | AND |
| `fulfillmentStatus` | enum | Calculated fulfillment status | NO_CUMPLIDO |

**Existing Fields Retained:**
- id, code, name, description, status
- startTime, endTime
- Audit fields: createdBy, createdAt, updatedAt, deletedAt
- Relation: institutionalPlanId

---

## 5. Activity-Objective Repository Created

### File: `repositories/activity-objective.repository.ts`

**Methods Implemented:**

```typescript
create(data: ActivityObjectiveCreate)
createMultiple(activityId, objectiveIds, createdBy)
getObjectivesByActivityId(activityId)
getActivitiesByObjectiveId(objectiveId)
deleteLink(activityId, objectiveId)
deleteAllByActivityId(activityId)
replaceObjectives(activityId, objectiveIds, createdBy)
hasObjectives(activityId) // For V-02 validation
```

**Key Features:**
- Supports batch linking of multiple objectives to an activity
- Provides queries with JOIN to fetch related strategic objective details
- Includes helper method for validation V-02
- Supports transaction-safe replace operation

---

## 6. Database Connection Updated

### File: `infraestructure/database/connection.ts`

**Changes:**
- Added `activity` schema import
- Added `activityObjective` schema import
- Registered both schemas in Drizzle connection

---

## 7. Schema Exports Updated

### File: `infraestructure/database/schemas/index.ts`

**New Exports:**
- `ActivityStatusEnum`
- `ActivityReportedStatusEnum`
- `FulfillmentRuleEnum`
- `FulfillmentStatusEnum`
- `activityObjective`

---

## 8. Database Migration Generated

### File: `infraestructure/database/schemas/migrations/0000_steady_the_anarchist.sql`

**Migration Contents:**
1. **Enum Types Created:**
   - `activity_reported_status`
   - `fulfillment_rule`
   - `fulfillment_status`

2. **Tables Modified:**
   - `activity` - 9 new columns added
   - `strategic_objective` - 2 new columns added

3. **New Table Created:**
   - `activity_objective` with foreign key constraints

4. **Foreign Key Constraints:**
   - `activity_objective.activity_id → activity.id` (CASCADE)
   - `activity_objective.strategic_objective_id → strategic_objective.id` (CASCADE)

**Column Naming:** All database columns use snake_case convention

---

## Database Schema Diagram (Updated)

```
┌──────────────────────┐
│  strategic_objective │
│  ────────────────── │
│  + fulfillmentRule   │◄──┐
│  + fulfillmentStatus │   │
└──────────────────────┘   │
                            │
                 ┌──────────┴─────────────┐
                 │  activity_objective    │ (NEW)
                 │  ────────────────────  │
                 │  activityId            │
                 │  strategicObjectiveId  │
                 └──────────┬─────────────┘
                            │
┌──────────────────────┐   │
│      activity        │◄──┘
│  ──────────────────  │
│  + activityCode      │ (NEW)
│  + actualStartDate   │ (NEW)
│  + actualEndDate     │ (NEW)
│  + plannedDuration   │ (NEW)
│  + plannedProgress   │ (NEW)
│  + actualProgress    │ (NEW)
│  + priority          │ (NEW)
│  + reportedStatus    │ (NEW)
└──────────────────────┘
```

---

## Validation Rules Supported

### V-01: Date Validation
- Database schema supports: startDate, endDate, actualStartDate, actualEndDate
- Application layer will enforce: startDate ≤ endDate

### V-02: Association Validation
- Junction table `activity_objective` ensures activities are linked to objectives
- Repository method `hasObjectives()` supports validation check

### V-03: Multiple Objectives
- Many-to-many relationship allows activities to link to one or more objectives
- Repository method `createMultiple()` supports batch linking

---

## Three Indicator Framework Support

### INDICATOR 1: Activity Progress
- **Formula:** actualProgress / plannedProgress * 100
- **Fields:** `actualProgress`, `plannedProgress`
- **Unit:** Percentage (%)
- **Target:** 100%

### INDICATOR 2: Time Variance
- **Formula:** actualEndDate - plannedEndDate (endDate)
- **Fields:** `actualEndDate`, `endDate`
- **Unit:** Days
- **Target:** ≤0

### INDICATOR 3: Deadline Compliance
- **Formula:** IF actualEndDate ≤ endDate THEN "COMPLETADA" ELSE "EN_RIESGO"
- **Field Updated:** `reportedStatus`
- **Values:** NO_INICIADA, EN_RIESGO, COMPLETADA

---

## How to Apply Migration

### Development Environment:

```bash
cd apps/web

# Option 1: Push schema directly (for development)
npx drizzle-kit push

# Option 2: Apply migration (for production)
npm run migrate
```

### Verify Schema:

```bash
# Connect to PostgreSQL
psql -h localhost -U postgres -d sipeip

# Check new enum types
\dT activity_reported_status
\dT fulfillment_rule
\dT fulfillment_status

# Check updated tables
\d activity
\d strategic_objective
\d activity_objective
```

---

## Next Steps (Phase 2)

With Phase 1 complete, the following can now be implemented:

1. **Business Logic Services:**
   - Indicator calculation service
   - Objective fulfillment rules engine
   - Activity service enhancements

2. **TypeScript Types:**
   - Update `types/domain/activity.entity.ts`
   - Update `types/domain/strategic-objective.entity.ts`
   - Create `types/domain/activity-objective.entity.ts`

3. **Validation Schemas:**
   - Update `lib/validations/activity.validators.ts`
   - Add V-01, V-02, V-03 validation rules

4. **Repository Enhancements:**
   - Update `ActivityRepository` for new fields
   - Add indicator calculation queries

---

## Files Created/Modified Summary

### ✅ Created (3 files):
- `infraestructure/database/schemas/activity-objective.ts`
- `repositories/activity-objective.repository.ts`
- `infraestructure/database/schemas/migrations/0000_steady_the_anarchist.sql`

### ✅ Modified (5 files):
- `infraestructure/database/schemas/status-enum.ts`
- `infraestructure/database/schemas/activity.ts`
- `infraestructure/database/schemas/strategic-objectives.ts`
- `infraestructure/database/schemas/index.ts`
- `infraestructure/database/connection.ts`

---

## Testing Checklist

- [ ] Run migration on development database
- [ ] Verify all enum types created
- [ ] Verify activity table has new columns
- [ ] Verify strategic_objective table has new columns
- [ ] Verify activity_objective junction table created
- [ ] Test foreign key constraints (cascade delete)
- [ ] Insert sample data to validate schema
- [ ] Test ActivityObjectiveRepository methods

---

## Notes

- All database columns follow PostgreSQL snake_case convention
- Cascade delete ensures referential integrity across relationships
- Soft delete pattern preserved for activity and strategic_objective tables
- Migration is reversible (can be rolled back if needed)
- Repository includes helper methods for validation rules

---

**Phase 1 Status:** ✅ COMPLETE
**Ready for Phase 2:** ✅ YES
