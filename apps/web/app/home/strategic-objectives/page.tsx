import React from "react";
import { redirect } from "next/navigation";
import StrategicObjectivesTable from "./components/StrategicObjectivesTable";
import { getInstitutionalPlanById } from "../planes/actions";

interface StrategicObjectivesPageProps {
  searchParams: Promise<{
    institutionalPlanId?: string;
  }>;
}

const StrategicObjectivesPage = async ({
  searchParams,
}: StrategicObjectivesPageProps) => {
  const { institutionalPlanId } = await searchParams;

  // Si no hay institutionalPlanId, redirigir a planes
  if (!institutionalPlanId || isNaN(Number(institutionalPlanId))) {
    redirect("/home/planes");
  }

  const planId = Number(institutionalPlanId);

  // Obtener información del plan institucional
  let institutionalPlan;
  try {
    institutionalPlan = await getInstitutionalPlanById(planId);
  } catch (error) {
    console.error("Error fetching institutional plan:", error);
    redirect("/home/planes");
  }

  if (!institutionalPlan) {
    redirect("/home/planes");
  }

  return (
    <StrategicObjectivesTable
      institutionalPlanId={planId}
      institutionalPlanName={institutionalPlan.name}
    />
  );
};

export default StrategicObjectivesPage;
