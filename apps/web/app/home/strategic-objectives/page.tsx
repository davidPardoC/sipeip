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

  const planId = institutionalPlanId ? Number(institutionalPlanId) : undefined;
  let institutionalPlanName: string | undefined;

  if (planId && !isNaN(planId)) {
    try {
      const institutionalPlan = await getInstitutionalPlanById(planId);
      if (institutionalPlan) {
        institutionalPlanName = institutionalPlan.name;
      }
    } catch (error) {
      console.error("Error fetching institutional plan:", error);
    }
  }

  return (
    <StrategicObjectivesTable
      institutionalPlanId={planId}
      institutionalPlanName={institutionalPlanName}
    />
  );
};

export default StrategicObjectivesPage;
