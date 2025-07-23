'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import { OdsGoal } from '@/types/domain/ods-goal.entity';
import { getOdsGoals, deleteOdsGoal } from './actions';
import OdsGoalForm from './components/OdsGoalForm';

const OdsPage = () => {
  const [odsGoals, setOdsGoals] = useState<OdsGoal[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch ODS goals
  const fetchOdsGoals = async () => {
    try {
      setLoading(true);
      const data = await getOdsGoals();
      setOdsGoals(data);
    } catch (error) {
      console.error('Error fetching ODS goals:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOdsGoals();
  }, []);

  // Handle delete
  const handleDelete = async (id: number) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este objetivo ODS?')) {
      try {
        const result = await deleteOdsGoal(id);
        if (result.success) {
          await fetchOdsGoals();
        } else {
          console.error('Error deleting ODS goal:', result.error);
        }
      } catch (error) {
        console.error('Error deleting ODS goal:', error);
      }
    }
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Objetivos de Desarrollo Sostenible (ODS)</h1>
        <OdsGoalForm />
      </div>

      {loading ? (
        <div className="text-center">Cargando...</div>
      ) : (
        <div className="border rounded-lg">
          {odsGoals.length === 0 ? (
            <div className="text-center text-gray-500 p-8">No se encontraron objetivos ODS</div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="border-b bg-gray-50">
                  <th className="text-left p-4 font-semibold">Código</th>
                  <th className="text-left p-4 font-semibold">Nombre</th>
                  <th className="text-left p-4 font-semibold">Descripción</th>
                  <th className="text-left p-4 font-semibold">Fecha de Creación</th>
                  <th className="text-right p-4 font-semibold">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {odsGoals.map((odsGoal) => (
                  <tr key={odsGoal.id} className="border-b hover:bg-gray-50">
                    <td className="p-4 font-medium">{odsGoal.code}</td>
                    <td className="p-4">{odsGoal.name}</td>
                    <td className="p-4">
                      <div className="max-w-xs truncate" title={odsGoal.description}>
                        {odsGoal.description}
                      </div>
                    </td>
                    <td className="p-4">
                      {odsGoal.createdAt 
                        ? new Date(odsGoal.createdAt).toLocaleDateString('es-ES')
                        : '-'
                      }
                    </td>
                    <td className="p-4">
                      <div className="flex gap-2 justify-end">
                        <OdsGoalForm editingOdsGoal={odsGoal} />
                        <Button 
                          variant="destructive" 
                          size="sm"
                          onClick={() => handleDelete(odsGoal.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
};

export default OdsPage;