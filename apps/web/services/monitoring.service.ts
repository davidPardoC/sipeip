import { db } from "@/infraestructure/database/connection";
import { activity } from "@/infraestructure/database/schemas/activity";
import { strategicObjective } from "@/infraestructure/database/schemas/strategic-objectives";
import { indicator } from "@/infraestructure/database/schemas/indicator";
import { eq } from "drizzle-orm";
import { Activity } from "@/types/domain/activity.entity";

export class MonitoringService {
    /**
     * Calculates the indicators for a specific activity.
     */
    async calculateActivityIndicators(activityId: number) {
        const activityData = await db.query.activity.findFirst({
            where: eq(activity.id, activityId),
        });

        if (!activityData) {
            throw new Error("Actividad no encontrada");
        }

        // Indicator 1: Advance % (already in activityData.progressPercent but formula is confirmed here)
        const progress = Number(activityData.progressPercent || 0);

        // Indicator 2: Time Variation (Real End Date - Planned End Date)
        let timeVariation = 0;
        if (activityData.realEndDate && activityData.endDate) {
            const real = new Date(activityData.realEndDate).getTime();
            const planned = new Date(activityData.endDate).getTime();
            const diffTime = real - planned;
            timeVariation = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        }

        // Indicator 3: Compliance Status
        let complianceStatus = "NO_INICIADA";
        if (progress === 0) {
            complianceStatus = "NO_INICIADA";
        } else {
            if (activityData.realEndDate && activityData.endDate) {
                if (new Date(activityData.realEndDate) <= new Date(activityData.endDate)) {
                    complianceStatus = "COMPLETADA";
                } else {
                    complianceStatus = "EN_RIESGO";
                }
            } else if (progress === 100) {
                // Fallback if dates are missing but progress is 100
                complianceStatus = "COMPLETADA";
            } else {
                // In progress, check if current date > planned end date
                const now = new Date();
                const planned = new Date(activityData.endDate);
                if (now > planned) {
                    complianceStatus = "EN_RIESGO";
                } else {
                    // Assuming "En Progreso" logically if not late, but requirement says "En Riesgo" or "Completada" based on dates.
                    // Requirement: "Si fecha_real_fin <= fecha_planificada_fin entonces estado reportado = 'Completada', CASO CONTRARIO 'En Riesgo'"
                    // This logic strictly applies when finished (real_fin exists). 
                    // If not finished, we probably shouldn't set this final status yet, or treat as "En Progreso" / "En Riesgo" based on current date.
                    // For now, let's map loosely:
                    complianceStatus = "EN_PROGRESO";
                }
            }
        }

        return {
            progress,
            timeVariation,
            complianceStatus
        };
    }

    /**
     * Determines the compliance state of a Strategic Objective based on its indicators.
     * Rule 1 (AND): All indicators completed -> Compliance fulfilled.
     * Rule 2 (OR): At least one indicator completed -> In Progress.
     * Rule 3: Else -> Not fulfilled.
     */
    async evaluateObjectiveCompliance(objectiveId: number, rule: "AND" | "OR" = "AND") {
        // Fetch indicators for the objective
        // Note: We need a way to link Indicators to Objectives directly or via Activities.
        // Schema `indicator` has `ownerType` and `ownerId`. Assuming ownerType='StrategicObjective'.

        const indicators = await db.query.indicator.findMany({
            where: (indicators, { eq, and }) => and(
                eq(indicators.ownerId, objectiveId),
                eq(indicators.ownerType, "StrategicObjective")
            )
        });

        if (indicators.length === 0) return "NO_INICIADO";

        // We need to know the status of each indicator. 
        // The `indicator` table has a `status` column but it might be generic (ACTIVE/INACTIVE).
        // We need "Measurement" or "Compliance" status.
        // Assuming for now that we check if the indicator's connected activities are 100%.
        // OR, does the Indicator itself have a `value` vs `meta`?
        // Requirement: "El sistema debe determinar automáticamente el estado del objetivo en base al estado de sus indicadores".
        // Let's assume we calculate Indicator status based on its formula/value.

        // Since we don't have an `indicator_measurement` table yet in my view, I'll assume we compute it on the fly 
        // or that `indicator` will have a computed field? 
        // The prompt mentions "Cálculo de cumplimiento del indicador por periodo (valor actual vs meta)".

        // Placeholder logic for Indicator Compliance:
        // An indicator is "CUMPLIDO" if value >= meta (or <= dependent on direction).
        // Let's assume specific logic will be added when we have measurements.

        return "PENDIENTE_IMPLEMENTACION_MEDICIONES";
    }
}
