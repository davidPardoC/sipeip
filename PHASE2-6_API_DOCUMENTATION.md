# API Documentation - Phases 2-6: Activity Monitoring & Objective Fulfillment

**Version:** 2.0
**Date:** 2026-01-27
**Status:** ✅ IMPLEMENTED

---

## Table of Contents

1. [Overview](#overview)
2. [Activity APIs](#activity-apis)
3. [Indicator APIs](#indicator-apis)
4. [Objective Fulfillment APIs](#objective-fulfillment-apis)
5. [Monitoring Dashboard APIs](#monitoring-dashboard-apis)
6. [Export APIs](#export-apis)
7. [Validation Rules](#validation-rules)
8. [Error Handling](#error-handling)

---

## Overview

This documentation covers the new APIs implemented in Phases 2-6 for activity monitoring, indicator calculation, and objective fulfillment tracking.

### Base URL
```
https://your-domain.com/api
```

### Authentication
All endpoints require authentication via NextAuth.js session.

---

## Activity APIs

### Create Activity
**POST** `/api/activities`

Creates a new activity with enhanced monitoring fields.

**Request Body:**
```json
{
  "activityCode": "ACT001",
  "name": "Develop Feature X",
  "description": "Implementation of Feature X",
  "responsiblePerson": "John Doe",
  "startDate": "2024-01-01",
  "endDate": "2024-03-31",
  "actualStartDate": "2024-01-05",
  "actualEndDate": null,
  "plannedDuration": 90,
  "progressPercent": "0.00",
  "plannedProgress": "0.00",
  "actualProgress": "0.00",
  "executedBudget": "0.00",
  "priority": 3,
  "status": "PLANNED",
  "projectId": 1,
  "objectiveIds": [1, 2, 3]
}
```

**Response:** `201 Created`
```json
{
  "id": 1,
  "activityCode": "ACT001",
  "name": "Develop Feature X",
  "reportedStatus": "NO_INICIADA",
  ...
}
```

**Validations:**
- V-01: `startDate` ≤ `endDate`
- V-02: Activity must be linked to at least one objective (for IN_PROGRESS or COMPLETED status)
- V-03: `objectiveIds` array must have length ≥ 1

---

### Update Activity
**PUT** `/api/activities/[id]`

Updates an existing activity. Auto-calculates `reportedStatus`.

**Request Body:**
```json
{
  "actualProgress": "75.00",
  "actualEndDate": "2024-03-28",
  "status": "IN_PROGRESS"
}
```

**Response:** `200 OK`
```json
{
  "id": 1,
  "actualProgress": "75.00",
  "reportedStatus": "COMPLETADA",
  ...
}
```

**Auto-Calculation:**
- `reportedStatus` is automatically calculated based on:
  - `actualProgress` = 0% → NO_INICIADA
  - `actualEndDate` > `endDate` → EN_RIESGO
  - `actualProgress` = 100% AND `actualEndDate` ≤ `endDate` → COMPLETADA

---

## Indicator APIs

### Calculate Activity Indicators
**GET** `/api/activities/[id]/indicators`

Calculates all three indicators for an activity.

**Response:** `200 OK`
```json
{
  "activityId": 1,
  "indicator1_activityProgress": {
    "value": 75.00,
    "unit": "%",
    "target": 100,
    "status": "BELOW_TARGET",
    "formula": "actualProgress / plannedProgress * 100"
  },
  "indicator2_timeVariance": {
    "value": -3,
    "unit": "days",
    "target": 0,
    "status": "ON_TIME",
    "formula": "actualEndDate - endDate"
  },
  "indicator3_deadlineCompliance": {
    "value": "COMPLETADA",
    "status": "COMPLIANT"
  }
}
```

**Indicator Definitions:**

#### Indicator 1: Activity Progress
- **Formula:** `(actualProgress / plannedProgress) * 100`
- **Target:** 100%
- **Status:**
  - `ON_TARGET`: value ≥ 100
  - `BELOW_TARGET`: value < 100
  - `NOT_STARTED`: value = null

#### Indicator 2: Time Variance
- **Formula:** `actualEndDate - endDate` (in days)
- **Target:** ≤ 0
- **Status:**
  - `ON_TIME`: value ≤ 0
  - `DELAYED`: value > 0
  - `NOT_COMPLETED`: value = null

#### Indicator 3: Deadline Compliance
- **Values:** NO_INICIADA, EN_RIESGO, COMPLETADA
- **Status:**
  - `COMPLIANT`: COMPLETADA
  - `AT_RISK`: EN_RIESGO
  - `NOT_STARTED`: NO_INICIADA

---

### Link Objectives to Activity
**POST** `/api/activities/[id]/objectives`

Links strategic objectives to an activity (V-03).

**Request Body:**
```json
{
  "objectiveIds": [1, 2, 3]
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "objectiveIds": [1, 2, 3]
}
```

---

### Get Activity Objectives
**GET** `/api/activities/[id]/objectives`

Retrieves all objectives linked to an activity.

**Response:** `200 OK`
```json
[
  {
    "id": 1,
    "code": "OE-01",
    "name": "Strategic Objective 1",
    "description": "...",
    "fulfillmentRule": "AND",
    "fulfillmentStatus": "EN_PROGRESO"
  }
]
```

---

## Objective Fulfillment APIs

### Get Objective Fulfillment Status
**GET** `/api/objectives/[id]/fulfillment`

Calculates and returns the fulfillment status of a strategic objective.

**Response:** `200 OK`
```json
{
  "objective": {
    "id": 1,
    "code": "OE-01",
    "name": "Strategic Objective 1",
    "fulfillmentRule": "AND",
    "fulfillmentStatus": "EN_PROGRESO",
    "calculatedStatus": "EN_PROGRESO"
  },
  "linkedActivities": [
    {
      "id": 1,
      "activityCode": "ACT001",
      "name": "Activity 1",
      "status": "IN_PROGRESS",
      "reportedStatus": "EN_RIESGO",
      "actualProgress": "75.00",
      "plannedProgress": "80.00"
    }
  ],
  "summary": {
    "totalActivities": 5,
    "completedCount": 2,
    "inProgressCount": 2,
    "notStartedCount": 1,
    "atRiskCount": 1,
    "completionRate": 40.00
  },
  "fulfillmentAnalysis": {
    "rule": "AND",
    "currentStatus": "EN_PROGRESO",
    "requiresAllActivities": true,
    "requiresAtLeastOne": false,
    "isFulfilled": false
  }
}
```

**Fulfillment Rules:**

#### Rule 1: AND (Conjunction)
- Objective is fulfilled when **ALL** linked activities have `reportedStatus` = "COMPLETADA"
- Status: CUMPLIDO

#### Rule 2: OR (Disjunction)
- Objective is fulfilled when **AT LEAST ONE** activity has `reportedStatus` = "COMPLETADA"
- Status: CUMPLIDO

#### Rule 3: Fallback
- No indicators met
- Status: NO_CUMPLIDO

---

### Update Objective Fulfillment
**PUT** `/api/objectives/[id]/fulfillment`

Recalculates and updates the fulfillment status.

**Response:** `200 OK`
```json
{
  "success": true,
  "objective": {
    "id": 1,
    "fulfillmentStatus": "CUMPLIDO"
  },
  "message": "Fulfillment status updated successfully"
}
```

---

## Monitoring Dashboard APIs

### Get Dashboard Data
**GET** `/api/monitoring/dashboard`

Retrieves comprehensive dashboard data with statistics, charts, and scenarios.

**Response:** `200 OK`
```json
{
  "summary": {
    "activities": {
      "total": 150,
      "completed": 75,
      "atRisk": 25,
      "notStarted": 50,
      "overdue": 10,
      "completionRate": 50.00,
      "averageProgress": 62.50
    },
    "objectives": {
      "total": 30,
      "fulfilled": 10,
      "inProgress": 15,
      "notFulfilled": 5
    }
  },
  "charts": {
    "activitiesByStatus": {
      "NO_INICIADA": 50,
      "EN_RIESGO": 25,
      "COMPLETADA": 75
    },
    "activitiesByPriority": {
      "1": 10,
      "2": 20,
      "3": 60,
      "4": 40,
      "5": 20
    },
    "objectivesByRule": {
      "AND": 20,
      "OR": 10
    },
    "objectivesByFulfillment": {
      "CUMPLIDO": 10,
      "EN_PROGRESO": 15,
      "NO_CUMPLIDO": 5
    }
  },
  "alerts": {
    "highPriorityAtRisk": [
      {
        "id": 1,
        "activityCode": "ACT001",
        "name": "Critical Activity",
        "priority": 5,
        "endDate": "2024-01-30"
      }
    ]
  },
  "scenarios": {
    "scenario1_AND_fulfilled": {
      "description": "Objectives using AND rule with all indicators met (CUMPLIDO)",
      "objectives": [...]
    },
    "scenario2_OR_fulfilled": {
      "description": "Objectives using OR rule with at least one indicator met",
      "objectives": [...]
    },
    "scenario3_none_fulfilled": {
      "description": "Objectives with no indicators met (NO_CUMPLIDO)",
      "objectives": [...]
    }
  },
  "timestamp": "2024-01-27T12:00:00Z"
}
```

---

## Export APIs

### Export Activities
**GET** `/api/activities/reports/export?format={format}&projectId={id}`

Exports activities in various formats.

**Query Parameters:**
- `format`: xlsx | csv | xml (required)
- `projectId`: Filter by project (optional)
- `reportedStatus`: Filter by status (optional)

**Supported Formats:**

#### Excel (XLSX)
```
GET /api/activities/reports/export?format=xlsx
```
Response: Binary file with Content-Type: `application/vnd.openxmlformats-officedocument.spreadsheetml.sheet`

#### CSV
```
GET /api/activities/reports/export?format=csv
```
Response: CSV file with Content-Type: `text/csv`

#### XML
```
GET /api/activities/reports/export?format=xml
```
Response: XML file with Content-Type: `application/xml`

**Export Fields:**
- Activity Code
- Name
- Description
- Responsible Person
- Start/End Dates (Planned & Actual)
- Planned Duration
- Progress (%, Planned, Actual)
- Executed Budget
- Priority
- Status & Reported Status
- Audit Fields

---

## Validation Rules

### V-01: Date Validation
- `startDate` ≤ `endDate`
- `actualStartDate` ≤ `actualEndDate` (if both provided)
- `actualStartDate` should be within [`startDate`, `endDate`] range

**Error Response:**
```json
{
  "error": "Validation error",
  "details": [
    {
      "path": ["endDate"],
      "message": "Start date must be before or equal to end date"
    }
  ]
}
```

### V-02: Association Validation
Activity cannot be set to `IN_PROGRESS` or `COMPLETED` without being linked to at least one strategic objective.

**Error Response:**
```json
{
  "error": "Activity cannot be started or completed without being linked to at least one strategic objective (V-02)"
}
```

### V-03: Multiple Objectives
`objectiveIds` array must have length ≥ 1 when provided.

**Error Response:**
```json
{
  "error": "Validation error",
  "details": [
    {
      "path": ["objectiveIds"],
      "message": "Activity must be linked to at least one strategic objective"
    }
  ]
}
```

---

## Error Handling

### HTTP Status Codes

| Code | Description |
|------|-------------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request (Validation Error) |
| 401 | Unauthorized |
| 404 | Not Found |
| 500 | Internal Server Error |

### Error Response Format
```json
{
  "error": "Error message",
  "details": [...]
}
```

### Common Errors

#### Validation Error (400)
```json
{
  "error": "Validation error",
  "details": [
    {
      "path": ["field"],
      "message": "Error message"
    }
  ]
}
```

#### Not Found (404)
```json
{
  "error": "Activity not found"
}
```

#### Unauthorized (401)
```json
{
  "error": "User not found in session"
}
```

---

## Integration Examples

### Complete Activity Creation Flow

```javascript
// 1. Create activity with objectives
const response = await fetch("/api/activities", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    activityCode: "ACT001",
    name: "New Activity",
    startDate: "2024-01-01",
    endDate: "2024-03-31",
    projectId: 1,
    objectiveIds: [1, 2],
    priority: 4
  })
});

const activity = await response.json();

// 2. Update progress
await fetch(`/api/activities/${activity.id}`, {
  method: "PUT",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    actualProgress: "50.00",
    status: "IN_PROGRESS"
  })
});

// 3. Calculate indicators
const indicators = await fetch(`/api/activities/${activity.id}/indicators`)
  .then(r => r.json());

// 4. Check objective fulfillment
const fulfillment = await fetch(`/api/objectives/1/fulfillment`)
  .then(r => r.json());
```

---

## Testing Endpoints

Use the following test data:

### Test Activity
```json
{
  "activityCode": "TEST001",
  "name": "Test Activity",
  "responsiblePerson": "Test User",
  "startDate": "2024-01-01",
  "endDate": "2024-01-31",
  "projectId": 1,
  "objectiveIds": [1],
  "priority": 3
}
```

### Test Update
```json
{
  "actualProgress": "100.00",
  "actualEndDate": "2024-01-30"
}
```

Expected `reportedStatus`: "COMPLETADA" (100% progress, on time)

---

## Notes

- All date fields use ISO 8601 format (YYYY-MM-DD)
- Decimal fields (progress, budget) are stored as strings with 2 decimal places
- Auto-calculation of `reportedStatus` occurs on every update
- Kafka events are emitted for all mutations for audit trail
- Export endpoints support filtering by projectId and reportedStatus

---

**End of API Documentation**
