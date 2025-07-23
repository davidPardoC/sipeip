import React from "react";
import { getStrategicObjectiveById } from "../../actions";
import { getIndicatorsByStrategicObjective } from "./actions";
import IndicatorsPageClient from "./components/IndicatorsPageClient";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

const StrategicObjectivesIndicatorsPage = async ({ params }: PageProps) => {
  const { id } = await params;
  const strategicObjectiveId = parseInt(id);

  if (isNaN(strategicObjectiveId)) {
    return (
      <div className="container mx-auto py-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-destructive">Error</h1>
          <p className="text-muted-foreground">
            ID de objetivo estratégico inválido
          </p>
        </div>
      </div>
    );
  }

  try {
    // Fetch both strategic objective and its indicators
    const [strategicObjective, indicators] = await Promise.all([
      getStrategicObjectiveById(strategicObjectiveId),
      getIndicatorsByStrategicObjective(strategicObjectiveId),
    ]);

    if (!strategicObjective) {
      return (
        <div className="container mx-auto py-6">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-destructive">
              No Encontrado
            </h1>
            <p className="text-muted-foreground">
              El objetivo estratégico no fue encontrado
            </p>
          </div>
        </div>
      );
    }

    return (
      <IndicatorsPageClient
        strategicObjective={strategicObjective}
        initialIndicators={indicators}
      />
    );
  } catch (error) {
    console.error("Error loading indicators page:", error);

    return (
      <div className="container mx-auto py-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-destructive">Error</h1>
          <p className="text-muted-foreground">
            Error al cargar los indicadores
          </p>
        </div>
      </div>
    );
  }
};

export default StrategicObjectivesIndicatorsPage;
