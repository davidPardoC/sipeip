import { NextRequest, NextResponse } from "next/server";
import PDFDocument from "pdfkit";
import { ProgramRepository } from "@/repositories/program.repository";
import { ProgramService } from "@/services/program.service";
import { ProjectRepository } from "@/repositories/project.repository";
import { ProjectService } from "@/services/project.service";
import { ActivityRepository } from "@/repositories/activity.repository";
import { ActivityService } from "@/services/activity.service";
import { ProjectWithRelations } from "@/types/domain/project.entity";
import { Activity } from "@/types/domain/activity.entity";

interface ProjectWithActivities extends ProjectWithRelations {
  activities: Activity[];
}

interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;

    // Initialize repository and service
    const programRepository = new ProgramRepository();
    const programService = new ProgramService(programRepository);
    const projectRepository = new ProjectRepository();
    const projectService = new ProjectService(projectRepository);
    const activityRepository = new ActivityRepository();
    const activityService = new ActivityService(activityRepository);

    // Fetch the actual program data
    const program = await programService.getById(parseInt(id));

    if (!program) {
      return NextResponse.json(
        { error: "Programa no encontrado" },
        { status: 404 }
      );
    }

    // Fetch projects for this program
    const projects = await projectService.getByProgramId(parseInt(id));

    // Fetch activities for each project
    const projectsWithActivities: ProjectWithActivities[] = await Promise.all(
      projects.map(async (project: ProjectWithRelations) => {
        const activities = await activityService.getByProjectId(project.id);
        return {
          ...project,
          activities
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
        doc.text("Reporte de Programa", logoX + logoSize + 20, logoY + 15, { align: "left" });
        
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

        // Program information table
        const programData = [
          { label: "ID", value: program.id.toString() },
          { label: "Nombre", value: program.name },
          { label: "Presupuesto", value: `$${parseFloat(program.budget).toLocaleString('es-ES', { minimumFractionDigits: 2 })}` },
          { label: "Fecha de inicio", value: new Date(program.startDate).toLocaleDateString("es-ES") },
          { label: "Fecha de fin", value: new Date(program.endDate).toLocaleDateString("es-ES") },
          { label: "Estado", value: program.status || "No especificado" }
        ];

        currentY = drawTable("Información del Programa", programData, currentY);

        // Metadata table
        const metadataData = [
          { label: "Creado por", value: program.createdBy || "No especificado" },
          { label: "Fecha de creación", value: program.createdAt ? new Date(program.createdAt).toLocaleDateString("es-ES") : "No especificada" },
          { label: "Última actualización", value: program.updatedAt ? new Date(program.updatedAt).toLocaleDateString("es-ES") : "No especificada" }
        ];

        const finalY = drawTable("Metadatos", metadataData, currentY);

        // Projects and activities table
        let projectsTableY = finalY;
        if (projectsWithActivities && projectsWithActivities.length > 0) {
          // Check if we need a new page
          if (projectsTableY > 700) {
            doc.addPage();
            projectsTableY = 50;
          }

          // Create a comprehensive table for projects
          doc.fontSize(16);
          doc.text("Proyectos y Actividades", 50, projectsTableY, { underline: true });
          projectsTableY += 30;

          // Create multi-column table for projects
          const projTableLeft = 50;
          const projTableWidth = doc.page.width - 100;
          const projRowHeight = 35;
          const projColWidths = [35, 150, 100, 120, 115]; // [ID, Nombre, Presupuesto, Estado, Período]

          // Table header
          doc.fontSize(10);
          let currentX = projTableLeft;
          
          // Header background
          doc.fillColor('#f0f0f0');
          doc.rect(projTableLeft, projectsTableY, projTableWidth, projRowHeight).fill();
          doc.fillColor('black');

          // Header borders and text
          doc.rect(projTableLeft, projectsTableY, projTableWidth, projRowHeight).stroke();
          
          // Vertical lines for columns
          currentX = projTableLeft;
          projColWidths.forEach((width, index) => {
            if (index > 0) {
              doc.moveTo(currentX, projectsTableY)
                 .lineTo(currentX, projectsTableY + projRowHeight)
                 .stroke();
            }
            currentX += width;
          });

          // Header text
          doc.text("ID", projTableLeft + 3, projectsTableY + 12, { width: projColWidths[0] - 6 });
          doc.text("Código", projTableLeft + projColWidths[0] + 3, projectsTableY + 12, { width: projColWidths[1] - 6 });
          doc.text("Presupuesto", projTableLeft + projColWidths[0] + projColWidths[1] + 3, projectsTableY + 12, { width: projColWidths[2] - 6 });
          doc.text("Estado", projTableLeft + projColWidths[0] + projColWidths[1] + projColWidths[2] + 3, projectsTableY + 12, { width: projColWidths[3] - 6 });
          doc.text("Período", projTableLeft + projColWidths[0] + projColWidths[1] + projColWidths[2] + projColWidths[3] + 3, projectsTableY + 12, { width: projColWidths[4] - 6 });

          projectsTableY += projRowHeight;

          // Project rows with activities
          projectsWithActivities.forEach((project: ProjectWithActivities, index: number) => {
            // Check if we need a new page for this project
            const estimatedHeight = projRowHeight + (project.activities?.length || 0) * 25 + 60;
            if (projectsTableY + estimatedHeight > doc.page.height - 100) {
              doc.addPage();
              projectsTableY = 50;
            }

            // Alternate row colors
            if (index % 2 === 1) {
              doc.fillColor('#f9f9f9');
              doc.rect(projTableLeft, projectsTableY, projTableWidth, projRowHeight).fill();
              doc.fillColor('black');
            }

            // Row border
            doc.rect(projTableLeft, projectsTableY, projTableWidth, projRowHeight).stroke();

            // Vertical lines for columns
            currentX = projTableLeft;
            projColWidths.forEach((width, colIndex) => {
              if (colIndex > 0) {
                doc.moveTo(currentX, projectsTableY)
                   .lineTo(currentX, projectsTableY + projRowHeight)
                   .stroke();
              }
              currentX += width;
            });

            // Row data
            const startDate = project.startDate ? new Date(project.startDate).toLocaleDateString("es-ES", { day: '2-digit', month: '2-digit', year: 'numeric' }) : "N/A";
            const endDate = project.endDate ? new Date(project.endDate).toLocaleDateString("es-ES", { day: '2-digit', month: '2-digit', year: 'numeric' }) : "N/A";
            const period = `${startDate} - ${endDate}`;
            const budget = project.budget ? `$${parseFloat(project.budget).toLocaleString('es-ES')}` : "N/A";

            doc.fontSize(8);
            doc.text(project.id?.toString() || "N/A", projTableLeft + 3, projectsTableY + 10, { width: projColWidths[0] - 6, align: 'center' });
            doc.text(project.code || "N/A", projTableLeft + projColWidths[0] + 3, projectsTableY + 6, { width: projColWidths[1] - 6 });
            doc.text(budget, projTableLeft + projColWidths[0] + projColWidths[1] + 3, projectsTableY + 10, { width: projColWidths[2] - 6 });
            doc.text(project.status || "N/A", projTableLeft + projColWidths[0] + projColWidths[1] + projColWidths[2] + 3, projectsTableY + 10, { width: projColWidths[3] - 6 });
            doc.text(period, projTableLeft + projColWidths[0] + projColWidths[1] + projColWidths[2] + projColWidths[3] + 3, projectsTableY + 8, { width: projColWidths[4] - 6, align: 'center' });

            projectsTableY += projRowHeight;

            // Add activities for this project
            if (project.activities && project.activities.length > 0) {
              // Activities sub-header
              doc.fillColor('#e8f4f8');
              doc.rect(projTableLeft + 5, projectsTableY, projTableWidth - 10, 20).fill();
              doc.fillColor('black');
              doc.rect(projTableLeft + 5, projectsTableY, projTableWidth - 10, 20).stroke();
              
              doc.fontSize(8);
              doc.text("ACTIVIDADES:", projTableLeft + 8, projectsTableY + 6, { width: projTableWidth - 16 });
              projectsTableY += 20;

              // Activities table - simplified format
              const actRowHeight = 25;

              // Activity rows - simple list format
              project.activities.forEach((activity: Activity, actIndex: number) => {
                // Check page space for activities
                if (projectsTableY + actRowHeight > doc.page.height - 100) {
                  doc.addPage();
                  projectsTableY = 50;
                }

                // Alternate row colors for activities
                if (actIndex % 2 === 1) {
                  doc.fillColor('#f8f9fa');
                  doc.rect(projTableLeft + 5, projectsTableY, projTableWidth - 10, actRowHeight).fill();
                  doc.fillColor('black');
                }

                // Activity row border
                doc.rect(projTableLeft + 5, projectsTableY, projTableWidth - 10, actRowHeight).stroke();

                // Activity data - simplified single line format
                const activityBudget = activity.executedBudget ? `$${parseFloat(activity.executedBudget).toLocaleString('es-ES')}` : 'N/A';
                const activityText = `${activity.id}: ${activity.name} | Presupuesto ejecutado: ${activityBudget} | Estado: ${activity.status || 'N/A'}`;
                
                doc.fontSize(7);
                doc.text(activityText, projTableLeft + 8, projectsTableY + 6, { 
                  width: projTableWidth - 16,
                  ellipsis: true
                });

                projectsTableY += actRowHeight;
              });

              projectsTableY += 5; // Small space after activities
            } else {
              // No activities message
              doc.fillColor('#fff3cd');
              doc.rect(projTableLeft + 5, projectsTableY, projTableWidth - 10, 18).fill();
              doc.fillColor('black');
              doc.rect(projTableLeft + 5, projectsTableY, projTableWidth - 10, 18).stroke();
              
              doc.fontSize(7);
              doc.text("Sin actividades definidas", projTableLeft + 8, projectsTableY + 5, { width: projTableWidth - 16 });
              projectsTableY += 23;
            }
          });

          projectsTableY += 10; // Small spacing after table
        } else {
          // Show message when no projects exist
          doc.fontSize(16);
          doc.text("Proyectos y Actividades", 50, projectsTableY, { underline: true });
          projectsTableY += 30;
          doc.fontSize(12);
          doc.text("No se encontraron proyectos para este programa.", 50, projectsTableY);
          projectsTableY += 40;
        }

        // Add extra spacing before the report generation info
        const reportInfoY = projectsTableY + 20;

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
      `attachment; filename="programa-${program.name.replace(/[^a-zA-Z0-9]/g, "-")}-${id}.pdf"`
    );
    headers.set("Content-Length", pdfBuffer.length.toString());

    return new NextResponse(pdfBuffer, { headers });
  } catch (error) {
    console.error("Error generating program PDF report:", error);
    return NextResponse.json(
      { error: "Failed to generate program PDF report" },
      { status: 500 }
    );
  }
}
