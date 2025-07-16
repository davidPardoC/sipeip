import React from "react";
import { Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const UnauthorizedComponent = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-orange-50 p-4 w-full">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        {/* Icon */}
        <div className="mx-auto w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mb-6">
          <Shield className="w-10 h-10 text-red-600" />
        </div>

        {/* Title */}
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Acceso No Autorizado
        </h1>

        {/* Subtitle */}
        <h2 className="text-lg font-semibold text-red-600 mb-4">
          Error 403 - Prohibido
        </h2>

        {/* Description */}
        <p className="text-gray-600 mb-6 leading-relaxed">
          No tienes permisos para acceder a esta página. Si crees que esto es un
          error, contacta con el administrador del sistema o inicia sesión con
          una cuenta autorizada.
        </p>

        {/* Actions */}
        <div className="space-y-3">
          <Link href="/auth/login" className="w-full">
            <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
              <Shield className="w-4 h-4 mr-2" />
              Iniciar Sesión
            </Button>
          </Link>
        </div>

        {/* Footer */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <p className="text-sm text-gray-500">
            Sistema Integrado de Planificación e Inversión Pública
          </p>
          <p className="text-xs text-gray-400 mt-1">SIPeIP © 2025</p>
        </div>
      </div>
    </div>
  );
};

export default UnauthorizedComponent;
