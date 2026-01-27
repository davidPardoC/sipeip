import { NextRequest, NextResponse } from "next/server";
import { MonitoringService } from "@/services/monitoring.service";

const monitoringService = new MonitoringService();

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const period = searchParams.get("period") || "2024-Q1"; // Default period for now

        const report = await monitoringService.getComplianceReport(period);
        return NextResponse.json(report);
    } catch (error) {
        console.error("Error fetching compliance report:", error);
        return NextResponse.json({ error: "Failed to fetch report" }, { status: 500 });
    }
}
