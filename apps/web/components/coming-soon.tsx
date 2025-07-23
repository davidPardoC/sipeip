"use client";

import React from "react";
import { Clock, Sparkles } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const ComingSoon = () => {
  return (
    <div className="min-h-[70vh] flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardContent className="p-8 text-center space-y-6">
          {/* Icon */}
          <div className="flex justify-center">
            <div className="relative">
              <div className="absolute inset-0 animate-pulse bg-gradient-to-r from-blue-500 to-purple-500 rounded-full blur-lg opacity-30"></div>
              <div className="relative bg-gradient-to-r from-blue-500 to-purple-500 p-4 rounded-full">
                <Sparkles className="h-8 w-8 text-white" />
              </div>
            </div>
          </div>

          {/* Title */}
          <div className="space-y-2">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Próximamente
            </h1>
            <p className="text-xl text-muted-foreground">
              Estamos trabajando en algo increíble
            </p>
          </div>

          {/* Description */}
          <div className="space-y-4">
            <p className="text-muted-foreground max-w-lg mx-auto">
              Nuestro equipo está desarrollando nuevas funcionalidades que
              transformarán tu experiencia. Mantente atento para las próximas
              actualizaciones.
            </p>

            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>Lanzamiento estimado: Próximas semanas</span>
            </div>
          </div>

          {/* Features preview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
            <div className="space-y-2">
              <div className="h-12 w-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center mx-auto">
                <div className="h-6 w-6 bg-blue-500 rounded"></div>
              </div>
              <p className="text-sm font-medium">Nuevas herramientas</p>
              <p className="text-xs text-muted-foreground">
                Funcionalidades avanzadas para mejorar tu productividad
              </p>
            </div>

            <div className="space-y-2">
              <div className="h-12 w-12 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center mx-auto">
                <div className="h-6 w-6 bg-purple-500 rounded"></div>
              </div>
              <p className="text-sm font-medium">Interfaz mejorada</p>
              <p className="text-xs text-muted-foreground">
                Diseño renovado y experiencia de usuario optimizada
              </p>
            </div>

            <div className="space-y-2">
              <div className="h-12 w-12 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center mx-auto">
                <div className="h-6 w-6 bg-green-500 rounded"></div>
              </div>
              <p className="text-sm font-medium">Mayor rendimiento</p>
              <p className="text-xs text-muted-foreground">
                Velocidad y eficiencia en todas las operaciones
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ComingSoon;
