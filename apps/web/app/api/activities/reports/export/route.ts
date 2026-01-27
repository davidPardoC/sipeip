import { NextRequest, NextResponse } from "next/server";
import { activityService } from "@/services";
import { ExportService } from "@/services/export.service";
import { checkAuth } from "@/lib/auth.utils";

const exportService = new ExportService();

export async function GET(request: NextRequest) {
  try {
    await checkAuth();

    const { searchParams } = new URL(request.url);
    const format = searchParams.get("format") || "xlsx";
    const projectId = searchParams.get("projectId");
    const reportedStatus = searchParams.get("reportedStatus");

    // Fetch activities based on filters
    let activities;
    if (projectId) {
      activities = await activityService.getByProjectId(parseInt(projectId));
    } else if (reportedStatus) {
      activities = await activityService.getByReportedStatus(
        reportedStatus as "NO_INICIADA" | "EN_RIESGO" | "COMPLETADA"
      );
    } else {
      activities = await activityService.getAll();
    }

    const timestamp = new Date().toISOString().split("T")[0];
    const filename = `activities_${timestamp}`;

    switch (format.toLowerCase()) {
      case "xlsx":
      case "xls": {
        const buffer = exportService.exportToExcel(activities, filename);
        return new NextResponse(buffer, {
          headers: {
            "Content-Type":
              "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            "Content-Disposition": `attachment; filename="${filename}.xlsx"`,
          },
        });
      }

      case "csv": {
        const csvContent = exportService.exportToCSV(activities, filename);
        return new NextResponse(csvContent, {
          headers: {
            "Content-Type": "text/csv",
            "Content-Disposition": `attachment; filename="${filename}.csv"`,
          },
        });
      }

      case "xml": {
        const xmlContent = exportService.exportToXML(activities, filename);
        return new NextResponse(xmlContent, {
          headers: {
            "Content-Type": "application/xml",
            "Content-Disposition": `attachment; filename="${filename}.xml"`,
          },
        });
      }

      default:
        return NextResponse.json(
          { error: "Invalid format. Supported formats: xlsx, csv, xml" },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error("Error exporting activities:", error);
    return NextResponse.json(
      { error: "Failed to export activities" },
      { status: 500 }
    );
  }
}
