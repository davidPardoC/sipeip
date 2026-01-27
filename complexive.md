  📋 FUNCTIONALITIES TO IMPLEMENT

  MODULE 1: Enhanced Activity Management ✅ Partially Exists

  Location: apps/web/app/home/projects/[id]/activities/

  What Currently Exists:

  - Basic CRUD operations for activities
  - Activity schema with: name, description, responsiblePerson, startDate, endDate, progressPercent,
  executedBudget, status
  - Basic UI with forms and list views
  - Soft delete capability
  - Kafka audit events

  🔴 What Needs to Be Added:

  1. Database Schema Enhancements (infraestructure/database/schemas/activity.ts):
  // NEW FIELDS REQUIRED:
  - activityCode: string (unique per project: "ACT001", "ACT002")
  - priority: number (1-5)
  - actualStartDate: date (filled when starting execution)
  - actualEndDate: date (filled when completing)
  - plannedDuration: number (days)
  - actualProgress: number (avance_real)
  - plannedProgress: number (avance_planificado)
  - reportedStatus: enum (EN_RIESGO, COMPLETADA, NO_INICIADA)
  2. New Relationship Table:
    - Create activity_objectives table (many-to-many)
    - Activities can be linked to multiple strategic objectives
    - Required for validation V-03

  ---
  MODULE 2: Three-Indicator Monitoring System 🆕 NEW

  Location: Create new apps/web/services/indicator-calculation.service.ts

  Indicators to Implement:

  INDICATOR 1: Activity Progress
  - Formula: (actualProgress / plannedProgress) * 100
  - Unit: Percentage (%)
  - Target: 100%

  INDICATOR 2: Time Variance
  - Formula: actualEndDate - plannedEndDate
  - Unit: Days
  - Target: ≤0

  INDICATOR 3: Deadline Compliance
  - Formula: if actualEndDate ≤ plannedEndDate then "COMPLETADA" else "EN_RIESGO"
  - Updates: reportedStatus field

  Implementation Needs:

  - Service class to calculate indicators
  - Background job or real-time calculation on activity update
  - Store indicator measurements in database
  - API endpoints to retrieve indicator data

  ---
  MODULE 3: Objective Fulfillment Rules Engine 🆕 NEW

  Location: Create new apps/web/services/objective-fulfillment.service.ts

  Three Rules to Implement:

  Rule 1 (AND - Default):
  - Objective fulfilled if ALL indicators are met
  - Status: CUMPLIDO

  Rule 2 (OR - Alternative):
  - Objective fulfilled if AT LEAST ONE indicator is met
  - Status: EN_PROGRESO

  Rule 3 (Fallback):
  - All other cases
  - Status: NO_CUMPLIDO

  Implementation Needs:

  - Add fulfillmentRule field to strategic objectives schema (enum: AND/OR)
  - Add fulfillmentStatus field to strategic objectives (enum: CUMPLIDO/EN_PROGRESO/NO_CUMPLIDO)
  - Service to automatically calculate objective status based on associated activities
  - Trigger calculation when activities are updated

  ---
  MODULE 4: Monitoring Dashboard 🆕 NEW

  Location: Create new apps/web/app/home/monitoring/ or apps/web/app/home/dashboard/

  Required Views (3 Scenarios):

  Scenario 1: Rule 1 (AND) Evidence
  - Show objective with ALL indicators met
  - Display: activities, progress %, status breakdown, measurements

  Scenario 2: Rule 2 (OR) Evidence
  - Show objective with AT LEAST ONE indicator met
  - Display: activities, progress %, status breakdown, measurements

  Scenario 3: Rule 3 (None) Evidence
  - Show objective with NO indicators met
  - Display: activities, progress %, status breakdown, measurements

  Dashboard Components:

  - Activity progress charts
  - Status distribution (pie/bar charts)
  - Time variance indicators
  - Real-time status updates
  - Filter by: project, objective, status, date range

  ---
  MODULE 5: Enhanced Reporting ✅ Partially Exists → 🔴 Needs Extension

  Location: apps/web/services/report.service.ts (exists for programs)

  Current State:

  - PDF reports exist for programs and activities

  🔴 What Needs to Be Added:

  1. Export Formats:
    - Excel (XLS/XLSX) - using exceljs or xlsx
    - CSV - using csv-writer
    - XML - using xml2js
  2. New Report Types:
    - Activity monitoring report (with all 3 indicators)
    - Objective fulfillment report
    - Audit trail report
  3. API Endpoints:
    - GET /api/activities/reports/export?format=pdf|xls|csv|xml
    - GET /api/objectives/[id]/fulfillment-report

  ---
  MODULE 6: Enhanced Audit Trail ✅ Partially Exists → 🔴 Needs Extension

  Location: Currently uses Kafka events to logger microservice

  Current State:

  - Events published to Kafka topic event-log-core
  - Logger app stores in MongoDB
  - Basic tracking of create/update/delete

  🔴 What Needs to Be Added:

  1. Granular Action Tracking:
    - Track specific actions beyond CRUD: approve, reject, start, complete
    - Capture before/after snapshots of ALL fields
    - Track multiple objective associations
  2. Audit Query API:
    - GET /api/activities/[id]/audit-trail
    - Return formatted audit log for UI display
  3. Frontend Audit View:
    - Timeline component showing all activity changes
    - Who, when, what changed
    - Located in activity detail view

  ---
  MODULE 7: Role-Based Access Control Enhancement ✅ Partially Exists → 🔴 Needs Extension

  Location: apps/web/auth.ts and middleware

  Current Roles:

  - SYS_ADMIN
  - PLANIFICATION_TECHNICIAN (maps to PLANIFICADOR)
  - Others...

  🔴 New Roles/Permissions Needed:
  ┌────────────────────┬────────┬────────┬────────┬──────────┬──────────┐
  │        Role        │ Create │ Update │ Delete │   View   │ Monitor  │
  ├────────────────────┼────────┼────────┼────────┼──────────┼──────────┤
  │ PLANIFICADOR       │ ✅     │ ❌     │ ✅     │ ✅       │ ❌       │
  ├────────────────────┼────────┼────────┼────────┼──────────┼──────────┤
  │ APROBADOR          │ ❌     │ ✅     │ ❌     │ ✅       │ ✅       │
  ├────────────────────┼────────┼────────┼────────┼──────────┼──────────┤
  │ USER (General)     │ ❌     │ ❌     │ ❌     │ ✅       │ ❌       │
  ├────────────────────┼────────┼────────┼────────┼──────────┼──────────┤
  │ PLANIFICATION_INST │ ❌     │ ❌     │ ❌     │ ✅ (all) │ ✅ (all) │
  ├────────────────────┼────────┼────────┼────────┼──────────┼──────────┤
  │ AUDITORIA          │ ❌     │ ❌     │ ❌     │ ✅ (all) │ ✅ (all) │
  └────────────────────┴────────┴────────┴────────┴──────────┴──────────┘
  Implementation:
  - Add new role enum values in auth configuration
  - Update RBAC checks in API routes
  - Update frontend RBACComponent permissions

  ---
  MODULE 8: Business Validations ✅ Partially Exists → 🔴 Needs Enhancement

  Location: apps/web/lib/validations/activity.validators.ts

  🔴 Validations to Add:

  V-01: Date Validation (likely exists)
  .refine(data => data.startDate <= data.endDate, {
    message: "Start date must be before or equal to end date"
  })

  V-02: Association Validation (NEW)
  .refine(data => data.projectId && data.objectiveIds.length > 0, {
    message: "Activity must be associated with project and at least one objective"
  })

  V-03: Multiple Objectives (NEW)
  - Allow objectiveIds: number[] array
  - Validate at least one objective selected

  ---
  MODULE 9: Error Handling & User Experience 🔴 Needs Enhancement

  Location: Throughout application

  Requirements:

  - Response time < 5 seconds (performance optimization)
  - User-friendly error messages (not technical stack traces)
  - Loading states for all async operations
  - Success/error toast notifications

  ---
  MODULE 10: Security Enhancements ✅ Exists → 🔴 Needs Review

  Requirements:

  - SSL/TLS for external communications (deployment concern)
  - Input validation (Zod schemas - ✅ exists)
  - SQL injection prevention (Drizzle ORM - ✅ protected)
  - XSS prevention (React escaping - ✅ protected)
  - CSRF tokens (NextAuth - ✅ handles)
  - Rate limiting (needs implementation)

  ---
  📊 IMPLEMENTATION SUMMARY BY MODULE

  Affected Existing Modules:

  1. Activities Module (apps/web/app/home/projects/[id]/activities/)
    - 🔴 Enhance schema with new fields
    - �� Update form to include new fields
    - 🔴 Add objective multi-select
    - 🔴 Add priority field
    - 🔴 Add actual start/end date tracking
  2. Strategic Objectives Module (apps/web/app/home/institutional-plans/[id]/strategic-objectives/)
    - 🔴 Add fulfillment rule configuration
    - 🔴 Display calculated fulfillment status
    - 🔴 Show associated activities
  3. Database Schemas (apps/web/infraestructure/database/schemas/)
    - 🔴 Update activity.ts
    - 🔴 Create activity_objectives.ts (junction table)
    - 🔴 Update strategic-objective.ts
    - 🔴 Create migration files
  4. Services (apps/web/services/)
    - 🔴 Update activity.service.ts
    - 🆕 Create indicator-calculation.service.ts
    - 🆕 Create objective-fulfillment.service.ts
    - 🔴 Enhance report.service.ts
  5. Repositories (apps/web/repositories/)
    - 🔴 Update activity.repository.ts
    - 🆕 Create activity-objective.repository.ts
    - 🔴 Update strategic-objective.repository.ts
  6. API Routes (apps/web/app/api/)
    - 🔴 Enhance /api/activities routes
    - 🆕 Create /api/activities/[id]/indicators
    - 🆕 Create /api/activities/reports/export
    - 🆕 Create /api/objectives/[id]/fulfillment
    - 🆕 Create /api/monitoring/dashboard

  New Modules to Create:

  7. 🆕 Monitoring Dashboard (apps/web/app/home/monitoring/)
    - Dashboard page with charts
    - 3 scenario views
    - Real-time indicator display
    - Filter and search capabilities
  8. 🆕 Indicator Calculation Engine
    - Background calculation service
    - API for indicator data
    - Automatic status updates
  9. 🆕 Enhanced Export System
    - XLS export
    - CSV export
    - XML export
    - Multi-format report generation
  10. 🆕 Audit Trail UI (apps/web/app/home/audit/)
    - Activity audit timeline
    - User action history
    - Change comparison view

  ---
  🎯 PRIORITY IMPLEMENTATION ORDER

  Phase 1: Database & Core Logic (Must do first)

  1. Update activity schema with new fields
  2. Create activity-objectives junction table
  3. Update strategic objective schema
  4. Create migrations and seed data
  5. Update repositories with new queries

  Phase 2: Business Logic (Core functionality)

  6. Implement indicator calculation service
  7. Implement objective fulfillment rules engine
  8. Update activity service with new validations
  9. Add automatic status calculations

  Phase 3: API Layer (Backend endpoints)

  10. Update activity CRUD APIs
  11. Create indicator APIs
  12. Create monitoring/dashboard APIs
  13. Create export APIs

  Phase 4: Frontend (User interface)

  14. Enhance activity form with new fields
  15. Add objective multi-select component
  16. Create monitoring dashboard
  17. Add indicator display components
  18. Implement 3 scenario views

  Phase 5: Reporting & Audit (Supporting features)

  19. Implement XLS/CSV/XML export
  20. Create comprehensive reports
  21. Build audit trail UI
  22. Add user-friendly error messages

  Phase 6: Testing & Documentation (Quality assurance)

  23. Write unit tests
  24. Write integration tests
  25. Update architecture diagrams (Archimate, 4+1)
  26. Document new APIs and components

  ---
  📁 FILES THAT NEED MODIFICATION/CREATION

  To Modify:

  - infraestructure/database/schemas/activity.ts
  - infraestructure/database/schemas/strategic-objective.ts
  - repositories/activity.repository.ts
  - repositories/strategic-objective.repository.ts
  - services/activity.service.ts
  - services/report.service.ts
  - app/api/activities/route.ts
  - app/api/activities/[id]/route.ts
  - app/home/projects/[id]/activities/page.tsx
  - app/home/projects/[id]/activities/components/activity-form.tsx
  - lib/validations/activity.validators.ts
  - types/domain/activity.entity.ts
  - types/event.types.ts
  - auth.ts (role definitions)

  To Create:

  - infraestructure/database/schemas/activity-objective.ts
  - infraestructure/database/schemas/indicator-measurement.ts
  - repositories/activity-objective.repository.ts
  - repositories/indicator-measurement.repository.ts
  - services/indicator-calculation.service.ts
  - services/objective-fulfillment.service.ts
  - services/export.service.ts
  - app/api/activities/[id]/indicators/route.ts
  - app/api/activities/reports/export/route.ts
  - app/api/objectives/[id]/fulfillment/route.ts
  - app/api/monitoring/dashboard/route.ts
  - app/home/monitoring/page.tsx
  - app/home/monitoring/components/scenario-view.tsx
  - app/home/monitoring/components/indicator-chart.tsx
  - app/home/audit/activities/[id]/page.tsx
  - types/domain/indicator-measurement.entity.ts
  - types/domain/objective-fulfillment.entity.ts
  - lib/validations/indicator.validators.ts
  - lib/utils/export-helpers.ts