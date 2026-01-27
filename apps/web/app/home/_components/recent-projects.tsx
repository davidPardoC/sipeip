import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface RecentProjectsProps {
    projects: {
        id: number;
        code: string;
        name: string | null;
        updatedAt: string | null;
        status: string | null;
    }[];
}

export function RecentProjects({ projects }: RecentProjectsProps) {
    const formatDate = (dateString: string | null) => {
        if (!dateString) return "N/A";
        return new Date(dateString).toLocaleDateString("es-CO", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    };

    return (
        <Card className="col-span-4 lg:col-span-3">
            <CardHeader>
                <CardTitle>Proyectos Recientes</CardTitle>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[100px]">Código</TableHead>
                            <TableHead>Programa/Nombre</TableHead>
                            <TableHead>Estado</TableHead>
                            <TableHead className="text-right">Última Actualización</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {projects.map((project) => (
                            <TableRow key={project.id}>
                                <TableCell className="font-medium">{project.code}</TableCell>
                                <TableCell>{project.name || "N/A"}</TableCell>
                                <TableCell>{project.status || "N/A"}</TableCell>
                                <TableCell className="text-right">
                                    {formatDate(project.updatedAt)}
                                </TableCell>
                            </TableRow>
                        ))}
                        {projects.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={4} className="text-center">
                                    No se encontraron proyectos.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}
