import { db } from "@/infraestructure/database/connection";
import { activity } from "@/infraestructure/database/schemas/activity";
import { strategicObjective } from "@/infraestructure/database/schemas/strategic-objectives";
import { indicator } from "@/infraestructure/database/schemas/indicator";
import { eq, and } from "drizzle-orm";
import { Activity } from "@/types/domain/activity.entity";
import { goal } from "@/infraestructure/database/schemas/goal";



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
    /**
     * Calculates the compliance status of an indicator based on a measurement.
     * Simple logic: Value >= Target -> CUMPLIDO, else NO_CUMPLIDO.
     * In a real scenario, the direction (Ascending/Descending) should be part of the Indicator definition.
     */
    calculateIndicatorCompliance(current: number, target: number): "CUMPLIDO" | "NO_CUMPLIDO" {
        // Assuming higher is better for now. TODO: Check indicator direction if added to schema.
        return current >= target ? "CUMPLIDO" : "NO_CUMPLIDO";
    }

    /**
     * Determines the compliance state of a Strategic Objective based on its indicators.
     * Rule 1 (AND): All indicators completed -> Compliance fulfilled.
     * Rule 2 (OR): At least one indicator completed -> In Progress.
     * Rule 3: Else -> Not fulfilled.
     */
    async evaluateObjectiveCompliance(objectiveId: number, period: string) {
        // 1. Get Objective to find its Rule
        const objective = await db.query.strategicObjective.findFirst({
            where: eq(strategicObjective.id, objectiveId),
        });

        if (!objective) return "NO_ENCONTRADO";

        const rule = objective.complianceRule || "AND";

        // 2. Fetch indicators for the objective
        const indicators = await db.query.indicator.findMany({
            where: and(
                eq(indicator.ownerId, objectiveId),
                eq(indicator.ownerType, "StrategicObjective")
            )
        });

        if (indicators.length === 0) return "NO_INICIADO";

        // 3. For each indicator, fetch the measurement for the PERIOD
        const indicatorStatuses: string[] = [];

        for (const ind of indicators) {
            // Find Goal for this indicator and period
            // Assuming period matches year or we adapt logic. 
            // For now, let's assume 'period' string in Goal matches the passed period argument (e.g., "2024-Q1")
            const measurement = await db.query.goal.findFirst({
                where: and(
                    eq(goal.indicatorId, ind.id),
                    eq(goal.period, period)
                )
            });

            if (measurement) {
                // Use stored status or recalculate? Let's recalculate to be safe/dynamic
                const status = this.calculateIndicatorCompliance(
                    Number(measurement.actualValue || 0),
                    Number(measurement.targetValue)
                );
                indicatorStatuses.push(status);
            } else {
                indicatorStatuses.push("NO_INICIADO");
            }
        }

        // 4. Apply Rules
        const allCompliant = indicatorStatuses.every(s => s === "CUMPLIDO");
        const anyCompliant = indicatorStatuses.some(s => s === "CUMPLIDO");

        if (rule === "AND") {
            // Regla 1: un objetivo se cumple si TODOS sus indicadores están cumplidos.
            if (allCompliant) return "CUMPLIDO";
            // Check for "En Progreso" logic? 
            // "Regla 3: En todos los demás casos, el Estado Cumplimiento = No cumplido"
            // Wait, standard AND logic implies if 50% met, it's not Met. Is it "En Progreso"?
            // The prompt says: "Regla 3: En todos los demás casos... No cumplido".
            // So for AND, strict All or Nothing? 
            // Let's assume if some are met it's partially done, but strictly following the prompt:
            // "Estado Cumplimiento = Cumplido" (if ALL)
            // Else "No cumplido" (Rule 3)
            // However, usually we want "En Progreso" if started.
            // Let's stick to the prompt's defined Rules 1, 2, 3 explicitly.
            return "NO_CUMPLIDO";
        } else if (rule === "OR") {
            // Regla 2: un objetivo se cumple si AL MENOS UNO de sus indicadores está cumplido. Estado Cumplimiento = En Progreso
            // Wait, prompt says: "Regla 2... Estado Cumplimiento = En Progreso". 
            // Is it ever "CUMPLIDO" for OR rule? 
            // Prompt: "un objetivo se cumple si AL MENOS UNO... Estado Cumplimiento = En Progreso"
            // This wording is tricky. "se cumple" usually means Completed. But it says "Estado = En Progreso".
            // I will return "EN_PROGRESO" if at least one is met.
            if (anyCompliant) return "EN_PROGRESO";
            return "NO_CUMPLIDO";
        }

        return "NO_CUMPLIDO";
    }
}
