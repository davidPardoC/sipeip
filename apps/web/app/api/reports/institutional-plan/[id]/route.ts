import { NextRequest, NextResponse } from "next/server";
import PDFDocument from "pdfkit";
import { InstitutionalPlanRepository } from "@/repositories/institutional-plan.repository";
import { InstitutionalPlanService } from "@/services/institutional-plan.service";
import { StrategicObjectiveRepository } from "@/repositories/strategic-objective.repository";
import { StrategicObjectiveService } from "@/services/strategic-objective.service";
import { IndicatorRepository } from "@/repositories/indicator.repository";
import { IndicatorService } from "@/services/indicator.service";
import { ObjectiveAlignmentService } from "@/services/objective-alignment.service";
import { PndObjectiveService } from "@/services/pnd-objective.service";
import { OdsGoalService } from "@/services/ods-goal.service";
import { PndObjectiveRepository } from "@/repositories/pnd-objective.repository";
import { OdsGoalRepository } from "@/repositories/ods-goal.repository";

interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;

    // Initialize repository and service
    const institutionalPlanRepository = new InstitutionalPlanRepository();
    const institutionalPlanService = new InstitutionalPlanService(
      institutionalPlanRepository
    );
    const strategicObjectiveRepository = new StrategicObjectiveRepository();
    const strategicObjectiveService = new StrategicObjectiveService(
      strategicObjectiveRepository
    );
    const indicatorRepository = new IndicatorRepository();
    const indicatorService = new IndicatorService(indicatorRepository);
    
    // Initialize alignment-related services
    const objectiveAlignmentService = new ObjectiveAlignmentService();
    const pndObjectiveRepository = new PndObjectiveRepository();
    const pndObjectiveService = new PndObjectiveService(pndObjectiveRepository);
    const odsGoalRepository = new OdsGoalRepository();
    const odsGoalService = new OdsGoalService(odsGoalRepository);

    // Fetch the actual institutional plan data
    const institutionalPlan = await institutionalPlanService.getById(
      parseInt(id)
    );

    if (!institutionalPlan) {
      return NextResponse.json(
        { error: "Plan institucional no encontrado" },
        { status: 404 }
      );
    }

    // Fetch strategic objectives for this plan
    const strategicObjectives = await strategicObjectiveService.getByInstitutionalPlan(
      parseInt(id)
    );

    // Fetch all PND objectives and ODS goals for reference
    const [allPndObjectives, allOdsGoals] = await Promise.all([
      pndObjectiveService.getAll(),
      odsGoalService.getAll()
    ]);

    // Fetch indicators and alignments for each strategic objective
    const objectivesWithIndicatorsAndAlignments = await Promise.all(
      strategicObjectives.map(async (objective) => {
        const [indicators, alignments] = await Promise.all([
          indicatorService.getByStrategicObjective(objective.id),
          objectiveAlignmentService.getAlignmentsByStrategicObjective(objective.id)
        ]);

        // Enrich alignments with PND and ODS data
        const enrichedAlignments = alignments.map(alignment => ({
          ...alignment,
          pndObjective: allPndObjectives.find(pnd => pnd.id === alignment.pndObjectiveId),
          odsGoal: allOdsGoals.find(ods => ods.id === alignment.odsGoalId)
        }));

        return {
          ...objective,
          indicators,
          alignments: enrichedAlignments
        };
      })
    );

    // Create a new PDF document
    const doc = new PDFDocument({
      size: "A4",
      margin: 50,
      font: "./public/Helvetica.ttf",
    });

    const chunks: Buffer[] = [];

    // Collect all PDF data in memory
    doc.on("data", (...args: unknown[]) => {
      const chunk = args[0] as Buffer;
      chunks.push(chunk);
    });

    // When PDF is finished, create the response
    const pdfBuffer = await new Promise<Buffer>((resolve, reject) => {
      doc.on("end", () => {
        resolve(Buffer.concat(chunks));
      });

      doc.on("error", (...args: unknown[]) => {
        const err = args[0] as Error;
        reject(err);
      });

      // Add content to PDF
      try {
        // Add logo and title header
        const logoPath = "./public/logo.jpg";
        const logoSize = 60; // Logo size
        const logoX = 50;
        const logoY = 40;
        
        // Add logo
        try {
          doc.image(logoPath, logoX, logoY, { width: logoSize, height: logoSize });
        } catch (logoError) {
          console.warn("Could not load logo:", logoError);
          // Continue without logo if it fails to load
        }
        
        // Title next to logo
        doc.fontSize(20);
        doc.text("Reporte de Plan Institucional", logoX + logoSize + 20, logoY + 15, { align: "left" });
        
        // Add some spacing after header
        doc.moveDown(3);

        // Helper function to draw table
        const drawTable = (title: string, data: Array<{label: string, value: string}>, startY: number) => {
          const tableLeft = 50;
          const tableWidth = doc.page.width - 100;
          const rowHeight = 25;
          const colWidth = tableWidth / 2;
          const titleHeight = 30;
          const tableSpacing = 20;

          // Table title with proper spacing
          doc.fontSize(16);
          doc.text(title, tableLeft, startY, { underline: true });
          
          const tableTop = startY + titleHeight;

          // Table header
          doc.fontSize(12);
          doc.rect(tableLeft, tableTop, colWidth, rowHeight).stroke();
          doc.rect(tableLeft + colWidth, tableTop, colWidth, rowHeight).stroke();
          
          doc.fillColor('#f0f0f0');
          doc.rect(tableLeft, tableTop, tableWidth, rowHeight).fill();
          doc.fillColor('black');
          
          doc.text("Campo", tableLeft + 5, tableTop + 8, { width: colWidth - 10 });
          doc.text("Valor", tableLeft + colWidth + 5, tableTop + 8, { width: colWidth - 10 });

          // Table rows
          let currentRowY = tableTop + rowHeight;
          data.forEach((row, index) => {
            // Alternate row colors
            if (index % 2 === 1) {
              doc.fillColor('#f9f9f9');
              doc.rect(tableLeft, currentRowY, tableWidth, rowHeight).fill();
              doc.fillColor('black');
            }
            
            doc.rect(tableLeft, currentRowY, colWidth, rowHeight).stroke();
            doc.rect(tableLeft + colWidth, currentRowY, colWidth, rowHeight).stroke();
            
            doc.text(row.label, tableLeft + 5, currentRowY + 8, { width: colWidth - 10 });
            doc.text(row.value, tableLeft + colWidth + 5, currentRowY + 8, { width: colWidth - 10 });
            
            currentRowY += rowHeight;
          });

          return currentRowY + tableSpacing; // Return next Y position with proper spacing
        };

        let currentY = 130; // Adjusted starting position to accommodate logo and title

        // Plan information table
        const planData = [
          { label: "ID", value: institutionalPlan.id.toString() },
          { label: "Nombre", value: institutionalPlan.name },
          { label: "Versión", value: institutionalPlan.version },
          { label: "Período de inicio", value: new Date(institutionalPlan.periodStart).toLocaleDateString("es-ES") },
          { label: "Período de fin", value: new Date(institutionalPlan.periodEnd).toLocaleDateString("es-ES") },
          { label: "Estado", value: institutionalPlan.status || "No especificado" }
        ];

        currentY = drawTable("Información del Plan", planData, currentY);

        // Public entity information table
        if (institutionalPlan.publicEntity) {
          const entityData = [
            { label: "Código", value: institutionalPlan.publicEntity.code },
            { label: "Nombre", value: institutionalPlan.publicEntity.name },
            { label: "Nombre corto", value: institutionalPlan.publicEntity.shortName },
            { label: "Nivel de gobierno", value: institutionalPlan.publicEntity.govermentLevel }
          ];

          currentY = drawTable("Entidad Pública", entityData, currentY);
        }

        // Metadata table
        const metadataData = [
          { label: "Creado por", value: institutionalPlan.createdBy || "No especificado" },
          { label: "Fecha de creación", value: institutionalPlan.createdAt ? new Date(institutionalPlan.createdAt).toLocaleDateString("es-ES") : "No especificada" },
          { label: "Última actualización", value: institutionalPlan.updatedAt ? new Date(institutionalPlan.updatedAt).toLocaleDateString("es-ES") : "No especificada" }
        ];

        const finalY = drawTable("Metadatos", metadataData, currentY);

        // Strategic objectives table
        let objectivesTableY = finalY;
        if (objectivesWithIndicatorsAndAlignments && objectivesWithIndicatorsAndAlignments.length > 0) {
          // Check if we need a new page
          if (objectivesTableY > 700) {
            doc.addPage();
            objectivesTableY = 50;
          }

          // Create a comprehensive table for strategic objectives
          doc.fontSize(16);
          doc.text("Objetivos Estratégicos, Indicadores y Alineaciones", 50, objectivesTableY, { underline: true });
          objectivesTableY += 30;

          // Create multi-column table for objectives
          const objTableLeft = 50;
          const objTableWidth = doc.page.width - 100;
          const objRowHeight = 35; // Reduced height for more content
          const objColWidths = [35, 70, 150, 110, 115]; // Optimized widths

          // Table header
          doc.fontSize(10);
          let currentX = objTableLeft;
          
          // Header background
          doc.fillColor('#f0f0f0');
          doc.rect(objTableLeft, objectivesTableY, objTableWidth, objRowHeight).fill();
          doc.fillColor('black');

          // Header borders and text
          doc.rect(objTableLeft, objectivesTableY, objTableWidth, objRowHeight).stroke();
          
          // Vertical lines for columns
          currentX = objTableLeft;
          objColWidths.forEach((width, index) => {
            if (index > 0) {
              doc.moveTo(currentX, objectivesTableY)
                 .lineTo(currentX, objectivesTableY + objRowHeight)
                 .stroke();
            }
            currentX += width;
          });

          // Header text
          doc.text("ID", objTableLeft + 3, objectivesTableY + 12, { width: objColWidths[0] - 6 });
          doc.text("Código", objTableLeft + objColWidths[0] + 3, objectivesTableY + 12, { width: objColWidths[1] - 6 });
          doc.text("Nombre", objTableLeft + objColWidths[0] + objColWidths[1] + 3, objectivesTableY + 12, { width: objColWidths[2] - 6 });
          doc.text("Descripción", objTableLeft + objColWidths[0] + objColWidths[1] + objColWidths[2] + 3, objectivesTableY + 12, { width: objColWidths[3] - 6 });
          doc.text("Período", objTableLeft + objColWidths[0] + objColWidths[1] + objColWidths[2] + objColWidths[3] + 3, objectivesTableY + 12, { width: objColWidths[4] - 6 });

          objectivesTableY += objRowHeight;

          // Objective rows with indicators and alignments
          objectivesWithIndicatorsAndAlignments.forEach((objective, index) => {
            // Check if we need a new page for this objective
            const estimatedHeight = objRowHeight + (objective.indicators?.length || 0) * 25 + (objective.alignments?.length || 0) * 25 + 80;
            if (objectivesTableY + estimatedHeight > doc.page.height - 100) {
              doc.addPage();
              objectivesTableY = 50;
            }

            // Alternate row colors
            if (index % 2 === 1) {
              doc.fillColor('#f9f9f9');
              doc.rect(objTableLeft, objectivesTableY, objTableWidth, objRowHeight).fill();
              doc.fillColor('black');
            }

            // Row border
            doc.rect(objTableLeft, objectivesTableY, objTableWidth, objRowHeight).stroke();

            // Vertical lines for columns
            currentX = objTableLeft;
            objColWidths.forEach((width, colIndex) => {
              if (colIndex > 0) {
                doc.moveTo(currentX, objectivesTableY)
                   .lineTo(currentX, objectivesTableY + objRowHeight)
                   .stroke();
              }
              currentX += width;
            });

            // Row data
            const startDate = objective.startTime ? new Date(objective.startTime).toLocaleDateString("es-ES", { day: '2-digit', month: '2-digit', year: 'numeric' }) : "N/A";
            const endDate = objective.endTime ? new Date(objective.endTime).toLocaleDateString("es-ES", { day: '2-digit', month: '2-digit', year: 'numeric' }) : "N/A";
            const period = `${startDate} - ${endDate}`;

            doc.fontSize(8);
            doc.text(objective.id?.toString() || "N/A", objTableLeft + 3, objectivesTableY + 10, { width: objColWidths[0] - 6, align: 'center' });
            doc.text(objective.code || "N/A", objTableLeft + objColWidths[0] + 3, objectivesTableY + 10, { width: objColWidths[1] - 6 });
            doc.text(objective.name || "N/A", objTableLeft + objColWidths[0] + objColWidths[1] + 3, objectivesTableY + 6, { width: objColWidths[2] - 6 });
            doc.text(objective.description || "N/A", objTableLeft + objColWidths[0] + objColWidths[1] + objColWidths[2] + 3, objectivesTableY + 6, { width: objColWidths[3] - 6 });
            doc.text(period, objTableLeft + objColWidths[0] + objColWidths[1] + objColWidths[2] + objColWidths[3] + 3, objectivesTableY + 10, { width: objColWidths[4] - 6, align: 'center' });

            objectivesTableY += objRowHeight;

            // Add indicators for this objective
            if (objective.indicators && objective.indicators.length > 0) {
              // Indicators sub-header
              doc.fillColor('#e8f4f8');
              doc.rect(objTableLeft + 5, objectivesTableY, objTableWidth - 10, 20).fill();
              doc.fillColor('black');
              doc.rect(objTableLeft + 5, objectivesTableY, objTableWidth - 10, 20).stroke();
              
              doc.fontSize(8);
              doc.text("INDICADORES:", objTableLeft + 8, objectivesTableY + 6, { width: objTableWidth - 16 });
              objectivesTableY += 20;

              // Indicators table - simplified format
              const indRowHeight = 25;

              // Indicator rows - simple list format
              objective.indicators.forEach((indicator, indIndex) => {
                // Check page space for indicators
                if (objectivesTableY + indRowHeight > doc.page.height - 100) {
                  doc.addPage();
                  objectivesTableY = 50;
                }

                // Alternate row colors for indicators
                if (indIndex % 2 === 1) {
                  doc.fillColor('#f8f9fa');
                  doc.rect(objTableLeft + 5, objectivesTableY, objTableWidth - 10, indRowHeight).fill();
                  doc.fillColor('black');
                }

                // Indicator row border
                doc.rect(objTableLeft + 5, objectivesTableY, objTableWidth - 10, indRowHeight).stroke();

                // Indicator data - simplified single line format
                const indicatorText = `${indicator.id}: ${indicator.name} | ${indicator.formula || 'N/A'} | ${indicator.unit || 'N/A'} | Base: ${indicator.baseline || 'N/A'}`;
                
                doc.fontSize(7);
                doc.text(indicatorText, objTableLeft + 8, objectivesTableY + 6, { 
                  width: objTableWidth - 16,
                  ellipsis: true
                });

                objectivesTableY += indRowHeight;
              });

              objectivesTableY += 5; // Small space after indicators
            } else {
              // No indicators message
              doc.fillColor('#fff3cd');
              doc.rect(objTableLeft + 5, objectivesTableY, objTableWidth - 10, 18).fill();
              doc.fillColor('black');
              doc.rect(objTableLeft + 5, objectivesTableY, objTableWidth - 10, 18).stroke();
              
              doc.fontSize(7);
              doc.text("Sin indicadores definidos", objTableLeft + 8, objectivesTableY + 5, { width: objTableWidth - 16 });
              objectivesTableY += 23;
            }

            // Add alignments for this objective
            if (objective.alignments && objective.alignments.length > 0) {
              // Alignments sub-header
              doc.fillColor('#f0e6ff');
              doc.rect(objTableLeft + 5, objectivesTableY, objTableWidth - 10, 20).fill();
              doc.fillColor('black');
              doc.rect(objTableLeft + 5, objectivesTableY, objTableWidth - 10, 20).stroke();
              
              doc.fontSize(8);
              doc.text("ALINEACIONES PND-ODS:", objTableLeft + 8, objectivesTableY + 6, { width: objTableWidth - 16 });
              objectivesTableY += 20;

              // Alignments table - simplified format
              const alignRowHeight = 25;

              // Alignment rows - simple list format
              objective.alignments.forEach((alignment, alignIndex) => {
                // Check page space for alignments
                if (objectivesTableY + alignRowHeight > doc.page.height - 100) {
                  doc.addPage();
                  objectivesTableY = 50;
                }

                // Alternate row colors for alignments
                if (alignIndex % 2 === 1) {
                  doc.fillColor('#f8f4ff');
                  doc.rect(objTableLeft + 5, objectivesTableY, objTableWidth - 10, alignRowHeight).fill();
                  doc.fillColor('black');
                }

                // Alignment row border
                doc.rect(objTableLeft + 5, objectivesTableY, objTableWidth - 10, alignRowHeight).stroke();

                // Alignment data - simplified format showing PND and ODS details with weight
                const pndText = alignment.pndObjective ? `${alignment.pndObjective.code}: ${alignment.pndObjective.name}` : `PND ID: ${alignment.pndObjectiveId}`;
                const odsText = alignment.odsGoal ? `${alignment.odsGoal.code}: ${alignment.odsGoal.name}` : `ODS ID: ${alignment.odsGoalId}`;
                const alignmentText = `${parseFloat(alignment.weight)}% | PND: ${pndText} | ODS: ${odsText}`;
                
                doc.fontSize(7);
                doc.text(alignmentText, objTableLeft + 8, objectivesTableY + 6, { 
                  width: objTableWidth - 16,
                  ellipsis: true
                });

                objectivesTableY += alignRowHeight;
              });

              objectivesTableY += 5; // Small space after alignments
            } else {
              // No alignments message
              doc.fillColor('#ffe6e6');
              doc.rect(objTableLeft + 5, objectivesTableY, objTableWidth - 10, 18).fill();
              doc.fillColor('black');
              doc.rect(objTableLeft + 5, objectivesTableY, objTableWidth - 10, 18).stroke();
              
              doc.fontSize(7);
              doc.text("Sin alineaciones PND-ODS definidas", objTableLeft + 8, objectivesTableY + 5, { width: objTableWidth - 16 });
              objectivesTableY += 23;
            }
          });

          objectivesTableY += 10; // Small spacing after table
        } else {
          // Show message when no objectives exist
          doc.fontSize(16);
          doc.text("Objetivos Estratégicos, Indicadores y Alineaciones", 50, objectivesTableY, { underline: true });
          objectivesTableY += 30;
          doc.fontSize(12);
          doc.text("No se encontraron objetivos estratégicos para este plan institucional.", 50, objectivesTableY);
          objectivesTableY += 40;
        }

        // Add extra spacing before the report generation info
        const reportInfoY = objectivesTableY + 20;

        // Check if we need a new page for footer
        if (reportInfoY > doc.page.height - 80) {
          doc.addPage();
          const newReportInfoY = 50;
          // Report generation info
          doc.fontSize(10);
          doc.text(
            `Reporte generado el: ${new Date().toLocaleDateString("es-ES")} a las ${new Date().toLocaleTimeString("es-ES")}`,
            50, newReportInfoY, { align: "center" }
          );
        } else {
          // Report generation info
          doc.fontSize(10);
          doc.text(
            `Reporte generado el: ${new Date().toLocaleDateString("es-ES")} a las ${new Date().toLocaleTimeString("es-ES")}`,
            50, reportInfoY, { align: "center" }
          );
        }

        // Finalize the PDF
        doc.end();
      } catch (contentError) {
        reject(contentError);
      }
    });

    // Set response headers for PDF download
    const headers = new Headers();
    headers.set("Content-Type", "application/pdf");
    headers.set(
      "Content-Disposition",
      `attachment; filename="plan-institucional-${institutionalPlan.name.replace(/[^a-zA-Z0-9]/g, "-")}-${id}.pdf"`
    );
    headers.set("Content-Length", pdfBuffer.length.toString());

    return new NextResponse(pdfBuffer, { headers });
  } catch (error) {
    console.error("Error generating PDF report:", error);
    return NextResponse.json(
      { error: "Failed to generate PDF report" },
      { status: 500 }
    );
  }
}
