import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ProjectStatusChartProps {
    data: {
        name: string;
        value: number;
    }[];
}

export function ProjectStatusChart({ data }: ProjectStatusChartProps) {
    const total = data.reduce((acc, curr) => acc + curr.value, 0);

    // Sort by value descending
    const sortedData = [...data].sort((a, b) => b.value - a.value);

    return (
        <Card className="col-span-4 lg:col-span-4">
            <CardHeader>
                <CardTitle>Distribución del Estado de los Proyectos</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {sortedData.map((item) => (
                        <div key={item.name} className="space-y-1">
                            <div className="flex items-center justify-between text-sm">
                                <span className="font-medium">{item.name}</span>
                                <span className="text-muted-foreground">
                                    {item.value} ({total > 0 ? Math.round((item.value / total) * 100) : 0}%)
                                </span>
                            </div>
                            <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
                                <div
                                    className="h-full bg-primary"
                                    style={{ width: `${total > 0 ? (item.value / total) * 100 : 0}%` }}
                                />
                            </div>
                        </div>
                    ))}
                    {data.length === 0 && (
                        <div className="text-center text-sm text-muted-foreground">
                            No hay datos disponibles.
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
