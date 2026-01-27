import { NextRequest, NextResponse } from "next/server";
import { checkAuth } from "@/lib/auth.utils";
import { activityService } from "@/services"; // Assuming exported instance
import PDFDocument from "pdfkit";
import { stringify } from "csv-stringify/sync";

export async function GET(request: NextRequest) {
    try {
        await checkAuth();

        const { searchParams } = new URL(request.url);
        const format = searchParams.get("format") || "csv";
        const projectId = searchParams.get("projectId");

        if (!projectId) {
            return NextResponse.json({ error: "Project ID is required" }, { status: 400 });
        }

        const activities = await activityService.getByProjectId(parseInt(projectId));

        if (format === 'csv') {
            const csvData = activities.map(act => ({
                Codigo: act.code || '',
                Actividad: act.name,
                Responsable: act.responsiblePerson,
                Estado: act.reportedStatus || act.status,
                Inicio_Planificado: act.startDate,
                Fin_Planificado: act.endDate,
                Inicio_Real: act.realStartDate || '',
                Fin_Real: act.realEndDate || '',
                Progreso: `${act.progressPercent}%`,
                Prioridad: act.priority
            }));

            const csvString = stringify(csvData, { header: true });

            return new NextResponse(csvString, {
                headers: {
                    'Content-Type': 'text/csv',
                    'Content-Disposition': `attachment; filename="reporte_actividades_${projectId}.csv"`,
                },
            });
        }

        if (format === 'pdf') {
            // Create a PDF document
            const doc = new PDFDocument({ margin: 50 });
            const chunks: Uint8Array[] = [];

            doc.on('data', (chunk: Uint8Array) => chunks.push(chunk));

            return new Promise<NextResponse>((resolve, reject) => {
                doc.on('end', () => {
                    const result = Buffer.concat(chunks);
                    resolve(new NextResponse(result, {
                        headers: {
                            'Content-Type': 'application/pdf',
                            'Content-Disposition': `attachment; filename="reporte_actividades_${projectId}.pdf"`,
                        },
                    }));
                });

                // Header
                doc.fontSize(18).text('Reporte de Monitoreo de Actividades', { align: 'center' });
                doc.moveDown();
                doc.fontSize(10).text(`Generado el: ${new Date().toLocaleDateString()}`, { align: 'right' });
                doc.moveDown();

                // Content
                activities.forEach((act, i) => {
                    const y = doc.y;

                    // Draw separator for each item
                    if (i > 0) {
                        doc.moveTo(50, y - 10).lineTo(550, y - 10).strokeColor('#e5e5e5').stroke();
                    }

                    doc.fillColor('black');
                    doc.font('Helvetica-Bold').fontSize(12).text(`${i + 1}. ${act.name}`, { underline: false });
                    doc.moveDown(0.2);

                    doc.font('Helvetica').fontSize(10);

                    // Column 1
                    doc.text(`Código: ${act.code || 'S/C'}`);
                    doc.text(`Responsable: ${act.responsiblePerson}`);
                    doc.text(`Estado: ${act.reportedStatus || act.status}`);
                    doc.text(`Prioridad: ${act.priority}`);

                    // Column 2 (Simulated by indenting)
                    const col2X = 300;
                    const sentY = doc.y - 45; // Go back up

                    doc.text(`Progreso: ${act.progressPercent}%`, col2X, sentY);
                    doc.text(`Planificado: ${act.startDate} - ${act.endDate}`, col2X, sentY + 11);

                    const realStart = act.realStartDate ? act.realStartDate : 'No ini.';
                    const realEnd = act.realEndDate ? act.realEndDate : 'En curso';
                    doc.text(`Real: ${realStart} - ${realEnd}`, col2X, sentY + 22);

                    doc.moveDown(2);
                });

                doc.end();
            });
        }

        return NextResponse.json({ error: "Invalid format" }, { status: 400 });

    } catch (error) {
        console.error("Error generating report:", error);
        return NextResponse.json(
            { error: "Failed to generate report" },
            { status: 500 }
        );
    }
}
