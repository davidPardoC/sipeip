import { NextRequest, NextResponse } from "next/server";
import { objectiveAlignmentService } from "@/services";
import { 
  bulkObjectiveAlignmentCreateSchema, 
  objectiveAlignmentCreateSchema,
  objectiveAlignmentUpdateSchema 
} from "@/lib/validations/objective-alignment.validators";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const strategicObjectiveIdParam = searchParams.get("strategicObjectiveId");
    const idParam = searchParams.get("id");

    if (idParam) {
      // Get specific alignment by ID
      const id = parseInt(idParam);
      if (isNaN(id)) {
        return NextResponse.json(
          { error: "ID del objetivo de alineación inválido" },
          { status: 400 }
        );
      }

      const alignment = await objectiveAlignmentService.getAlignmentById(id);
      
      if (!alignment) {
        return NextResponse.json(
          { error: "Alineación de objetivo no encontrada" },
          { status: 404 }
        );
      }

      return NextResponse.json(alignment);
    }

    if (strategicObjectiveIdParam) {
      // Get alignments by strategic objective ID
      const strategicObjectiveId = parseInt(strategicObjectiveIdParam);
      if (isNaN(strategicObjectiveId)) {
        return NextResponse.json(
          { error: "ID del objetivo estratégico inválido" },
          { status: 400 }
        );
      }

      const alignments = await objectiveAlignmentService.getAlignmentsByStrategicObjective(strategicObjectiveId);
      return NextResponse.json(alignments);
    }

    return NextResponse.json(
      { error: "Se requiere strategicObjectiveId o id como parámetro" },
      { status: 400 }
    );
  } catch (error) {
    console.error("Error fetching objective alignments:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Check if it's a bulk operation
    if (body.alignments && Array.isArray(body.alignments)) {
      // Validate bulk request
      const validation = bulkObjectiveAlignmentCreateSchema.safeParse(body);
      
      if (!validation.success) {
        return NextResponse.json(
          { 
            error: "Datos de entrada inválidos",
            details: validation.error.issues 
          },
          { status: 400 }
        );
      }

      const { strategicObjectiveId, alignments, createdBy } = validation.data;

      const newAlignments = await objectiveAlignmentService.bulkCreateAlignments(
        strategicObjectiveId,
        alignments,
        createdBy
      );

      return NextResponse.json(
        { 
          message: "Alineaciones creadas exitosamente",
          data: newAlignments 
        },
        { status: 201 }
      );
    } else {
      // Single alignment creation
      const validation = objectiveAlignmentCreateSchema.safeParse(body);
      
      if (!validation.success) {
        return NextResponse.json(
          { 
            error: "Datos de entrada inválidos",
            details: validation.error.issues 
          },
          { status: 400 }
        );
      }

      const { strategicObjectiveId, pndObjectiveId, odsGoalId, weight, createdBy } = validation.data;

      const newAlignment = await objectiveAlignmentService.createAlignment(
        strategicObjectiveId,
        pndObjectiveId,
        odsGoalId,
        weight,
        createdBy
      );

      return NextResponse.json(
        { 
          message: "Alineación creada exitosamente",
          data: newAlignment 
        },
        { status: 201 }
      );
    }
  } catch (error) {
    console.error("Error creating objective alignment:", error);
    
    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const idParam = searchParams.get("id");

    if (!idParam) {
      return NextResponse.json(
        { error: "ID de alineación es requerido" },
        { status: 400 }
      );
    }

    const id = parseInt(idParam);
    if (isNaN(id)) {
      return NextResponse.json(
        { error: "ID de alineación inválido" },
        { status: 400 }
      );
    }

    const body = await request.json();
    const validation = objectiveAlignmentUpdateSchema.safeParse(body);
    
    if (!validation.success) {
      return NextResponse.json(
        { 
          error: "Datos de entrada inválidos",
          details: validation.error.issues 
        },
        { status: 400 }
      );
    }

    const { weight, pndObjectiveId, odsGoalId, updatedBy } = validation.data;

    const updatedAlignment = await objectiveAlignmentService.updateAlignment(
      id,
      { weight, pndObjectiveId, odsGoalId },
      updatedBy
    );

    if (!updatedAlignment) {
      return NextResponse.json(
        { error: "Alineación de objetivo no encontrada" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: "Alineación actualizada exitosamente",
      data: updatedAlignment,
    });
  } catch (error) {
    console.error("Error updating objective alignment:", error);
    
    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const idParam = searchParams.get("id");

    if (!idParam) {
      return NextResponse.json(
        { error: "ID de alineación es requerido" },
        { status: 400 }
      );
    }

    const id = parseInt(idParam);
    if (isNaN(id)) {
      return NextResponse.json(
        { error: "ID de alineación inválido" },
        { status: 400 }
      );
    }

    const body = await request.json().catch(() => ({}));
    const { deletedBy } = body;

    const deleted = await objectiveAlignmentService.deleteAlignment(id, deletedBy);

    if (!deleted) {
      return NextResponse.json(
        { error: "Alineación de objetivo no encontrada" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: "Alineación eliminada exitosamente",
    });
  } catch (error) {
    console.error("Error deleting objective alignment:", error);
    
    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
