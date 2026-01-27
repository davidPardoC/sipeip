import { Activity } from "@/types/domain/activity.entity";
import { StrategicObjective } from "@/types/domain/strategic-objective.entity";
import * as XLSX from "xlsx";

export class ExportService {
  /**
   * Export activities to Excel format
   */
  exportToExcel(
    activities: Activity[],
    filename: string = "activities"
  ): Buffer {
    const data = activities.map((activity) => ({
      "Activity Code": activity.activityCode,
      Name: activity.name,
      Description: activity.description || "",
      "Responsible Person": activity.responsiblePerson,
      "Start Date": activity.startDate,
      "End Date": activity.endDate,
      "Actual Start Date": activity.actualStartDate || "",
      "Actual End Date": activity.actualEndDate || "",
      "Planned Duration (days)": activity.plannedDuration || "",
      "Progress (%)": activity.progressPercent,
      "Planned Progress": activity.plannedProgress || "",
      "Actual Progress": activity.actualProgress || "",
      "Executed Budget": activity.executedBudget,
      Priority: activity.priority || "",
      Status: activity.status,
      "Reported Status": activity.reportedStatus || "",
      "Project ID": activity.projectId,
      "Created By": activity.createdBy || "",
      "Created At": activity.createdAt || "",
      "Updated At": activity.updatedAt || "",
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Activities");

    // Generate buffer
    const excelBuffer = XLSX.write(workbook, {
      type: "buffer",
      bookType: "xlsx",
    });

    return Buffer.from(excelBuffer);
  }

  /**
   * Export activities to CSV format
   */
  exportToCSV(
    activities: Activity[],
    filename: string = "activities"
  ): string {
    const headers = [
      "Activity Code",
      "Name",
      "Description",
      "Responsible Person",
      "Start Date",
      "End Date",
      "Actual Start Date",
      "Actual End Date",
      "Planned Duration (days)",
      "Progress (%)",
      "Planned Progress",
      "Actual Progress",
      "Executed Budget",
      "Priority",
      "Status",
      "Reported Status",
      "Project ID",
      "Created By",
      "Created At",
      "Updated At",
    ];

    const rows = activities.map((activity) => [
      activity.activityCode,
      this.escapeCsvValue(activity.name),
      this.escapeCsvValue(activity.description || ""),
      this.escapeCsvValue(activity.responsiblePerson),
      activity.startDate,
      activity.endDate,
      activity.actualStartDate || "",
      activity.actualEndDate || "",
      activity.plannedDuration || "",
      activity.progressPercent,
      activity.plannedProgress || "",
      activity.actualProgress || "",
      activity.executedBudget,
      activity.priority || "",
      activity.status,
      activity.reportedStatus || "",
      activity.projectId,
      activity.createdBy || "",
      activity.createdAt || "",
      activity.updatedAt || "",
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.join(",")),
    ].join("\n");

    return csvContent;
  }

  /**
   * Export activities to XML format
   */
  exportToXML(
    activities: Activity[],
    filename: string = "activities"
  ): string {
    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
    xml += "<activities>\n";

    for (const activity of activities) {
      xml += "  <activity>\n";
      xml += `    <activityCode>${this.escapeXml(activity.activityCode)}</activityCode>\n`;
      xml += `    <name>${this.escapeXml(activity.name)}</name>\n`;
      xml += `    <description>${this.escapeXml(activity.description || "")}</description>\n`;
      xml += `    <responsiblePerson>${this.escapeXml(activity.responsiblePerson)}</responsiblePerson>\n`;
      xml += `    <startDate>${activity.startDate}</startDate>\n`;
      xml += `    <endDate>${activity.endDate}</endDate>\n`;
      xml += `    <actualStartDate>${activity.actualStartDate || ""}</actualStartDate>\n`;
      xml += `    <actualEndDate>${activity.actualEndDate || ""}</actualEndDate>\n`;
      xml += `    <plannedDuration>${activity.plannedDuration || ""}</plannedDuration>\n`;
      xml += `    <progressPercent>${activity.progressPercent}</progressPercent>\n`;
      xml += `    <plannedProgress>${activity.plannedProgress || ""}</plannedProgress>\n`;
      xml += `    <actualProgress>${activity.actualProgress || ""}</actualProgress>\n`;
      xml += `    <executedBudget>${activity.executedBudget}</executedBudget>\n`;
      xml += `    <priority>${activity.priority || ""}</priority>\n`;
      xml += `    <status>${activity.status}</status>\n`;
      xml += `    <reportedStatus>${activity.reportedStatus || ""}</reportedStatus>\n`;
      xml += `    <projectId>${activity.projectId}</projectId>\n`;
      xml += `    <createdBy>${this.escapeXml(activity.createdBy || "")}</createdBy>\n`;
      xml += `    <createdAt>${activity.createdAt || ""}</createdAt>\n`;
      xml += `    <updatedAt>${activity.updatedAt || ""}</updatedAt>\n`;
      xml += "  </activity>\n";
    }

    xml += "</activities>";
    return xml;
  }

  /**
   * Export objective fulfillment report to Excel
   */
  exportObjectiveFulfillmentToExcel(
    objectives: Array<
      StrategicObjective & {
        linkedActivities: Activity[];
        completedCount: number;
        inProgressCount: number;
        notStartedCount: number;
      }
    >,
    filename: string = "objective-fulfillment"
  ): Buffer {
    const data = objectives.map((objective) => ({
      Code: objective.code,
      Name: objective.name,
      Description: objective.description,
      "Fulfillment Rule": objective.fulfillmentRule || "AND",
      "Fulfillment Status": objective.fulfillmentStatus || "NO_CUMPLIDO",
      "Total Activities": objective.linkedActivities?.length || 0,
      "Completed Activities": objective.completedCount || 0,
      "In Progress Activities": objective.inProgressCount || 0,
      "Not Started Activities": objective.notStartedCount || 0,
      "Completion Rate (%)":
        objective.linkedActivities?.length > 0
          ? (
              ((objective.completedCount || 0) /
                objective.linkedActivities.length) *
              100
            ).toFixed(2)
          : "0.00",
      Status: objective.status || "",
      "Start Time": objective.startTime,
      "End Time": objective.endTime,
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Objective Fulfillment");

    const excelBuffer = XLSX.write(workbook, {
      type: "buffer",
      bookType: "xlsx",
    });

    return Buffer.from(excelBuffer);
  }

  /**
   * Escape special characters for CSV
   */
  private escapeCsvValue(value: string): string {
    if (value.includes(",") || value.includes('"') || value.includes("\n")) {
      return `"${value.replace(/"/g, '""')}"`;
    }
    return value;
  }

  /**
   * Escape special characters for XML
   */
  private escapeXml(value: string): string {
    return value
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&apos;");
  }
}
