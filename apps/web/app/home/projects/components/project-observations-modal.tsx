'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle
} from '@/components/ui/dialog';
import { ProjectWithRelations } from '@/types/domain/project.entity';
import { ProjectObservation, ProjectObservationWithRelations } from '@/types/domain/project-observation.entity';
import { MessageSquare, Plus, Calendar, User, Loader2, Edit, Trash2 } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';

interface ProjectObservationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: ProjectWithRelations | null;
  onObservationsUpdated?: () => void;
}

const ProjectObservationsModal: React.FC<ProjectObservationsModalProps> = ({
  isOpen,
  onClose,
  project,
  onObservationsUpdated
}) => {
  const [observations, setObservations] = useState<ProjectObservationWithRelations[]>([]);
  const [newObservation, setNewObservation] = useState('');
  const [editingObservation, setEditingObservation] = useState<ProjectObservation | null>(null);
  const [editText, setEditText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);

  // Load observations when modal opens
  useEffect(() => {
    const loadObservations = async () => {
      if (!project) return;
      
      setIsLoading(true);
      try {
        const response = await fetch(`/api/project-observations?projectId=${project.id}`);
        if (response.ok) {
          const observations = await response.json();
          setObservations(observations);
        } else {
          console.error('Failed to load observations');
          setObservations([]);
        }
      } catch (error) {
        console.error('Error loading observations:', error);
        setObservations([]);
      } finally {
        setIsLoading(false);
      }
    };

    if (isOpen && project) {
      loadObservations();
    }
  }, [isOpen, project]);

  const handleAddObservation = async () => {
    if (!newObservation.trim() || !project) return;

    setIsSubmitting(true);
    try {
      const response = await fetch('/api/project-observations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          observation: newObservation.trim(),
          projectId: project.id,
        }),
      });

      if (response.ok) {
        const newObs = await response.json();
        setObservations(prev => [newObs, ...prev]);
        setNewObservation('');
        setShowAddForm(false);
        
        if (onObservationsUpdated) {
          onObservationsUpdated();
        }
      } else {
        const errorData = await response.json();
        console.error('Failed to create observation:', errorData);
      }
    } catch (error) {
      console.error('Error adding observation:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditObservation = async (observationId: number) => {
    if (!editText.trim()) return;
    
    setIsSubmitting(true);
    try {
      const response = await fetch(`/api/project-observations/${observationId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          observation: editText.trim(),
        }),
      });

      if (!response.ok) {
        throw new Error('Error al actualizar la observación');
      }

      // Actualizar la observación en el estado local
      setObservations(observations.map(obs => 
        obs.id === observationId 
          ? { ...obs, observation: editText.trim() }
          : obs
      ));
      
      cancelEdit();
    } catch (error) {
      console.error('Error al actualizar observación:', error);
    } finally {
      setIsSubmitting(false);
    }
  };    const handleDeleteObservation = async (observationId: number) => {
    if (!confirm('¿Estás seguro de que quieres eliminar esta observación?')) {
      return;
    }
    
    try {
      const response = await fetch(`/api/project-observations/${observationId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Error al eliminar la observación');
      }

      // Remover la observación del estado local
      setObservations(observations.filter(obs => obs.id !== observationId));
    } catch (error) {
      console.error('Error al eliminar observación:', error);
    }
  };

  const startEdit = (observation: ProjectObservation) => {
    setEditingObservation(observation);
    setEditText(observation.observation);
  };

  const cancelEdit = () => {
    setEditingObservation(null);
    setEditText('');
  };

  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return 'Fecha no disponible';
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleClose = () => {
    setShowAddForm(false);
    setNewObservation('');
    setEditingObservation(null);
    setEditText('');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Observaciones del Proyecto: {project?.code}
          </DialogTitle>
        </DialogHeader>
        
        <div className="flex-1 overflow-hidden flex flex-col">
          {/* Add new observation section */}
          <div className="border-b pb-4 mb-4">
            {!showAddForm ? (
              <Button
                onClick={() => setShowAddForm(true)}
                className="w-full"
                variant="outline"
              >
                <Plus className="h-4 w-4 mr-2" />
                Agregar Nueva Observación
              </Button>
            ) : (
              <div className="space-y-3">
                <Textarea
                  placeholder="Escriba su observación aquí..."
                  value={newObservation}
                  onChange={(e) => setNewObservation(e.target.value)}
                  rows={4}
                  className="resize-none"
                />
                <div className="flex gap-2 justify-end">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setShowAddForm(false);
                      setNewObservation('');
                    }}
                  >
                    Cancelar
                  </Button>
                  <Button
                    onClick={handleAddObservation}
                    disabled={!newObservation.trim() || isSubmitting}
                  >
                    {isSubmitting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                    Agregar Observación
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Observations list */}
          <div className="flex-1 overflow-y-auto">
            {isLoading ? (
              <div className="flex justify-center items-center py-8">
                <Loader2 className="h-6 w-6 animate-spin mr-2" />
                Cargando observaciones...
              </div>
            ) : observations.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <MessageSquare className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>No hay observaciones para este proyecto</p>
                <p className="text-sm">Agrega la primera observación usando el botón de arriba</p>
              </div>
            ) : (
              <div className="space-y-4">
                {observations.map((observation) => (
                  <div key={observation.id} className="border rounded-lg p-4 bg-gray-50">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <User className="h-4 w-4" />
                        <span className="font-medium">{observation.user?.userName}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1 text-sm text-gray-500">
                          <Calendar className="h-4 w-4" />
                          <span>{formatDate(observation.createdAt)}</span>
                        </div>
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => startEdit(observation)}
                            disabled={editingObservation?.id === observation.id}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteObservation(observation.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                    
                    {editingObservation?.id === observation.id ? (
                      <div className="space-y-3">
                        <Textarea
                          value={editText}
                          onChange={(e) => setEditText(e.target.value)}
                          rows={3}
                          className="resize-none"
                        />
                        <div className="flex gap-2 justify-end">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={cancelEdit}
                          >
                            Cancelar
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => handleEditObservation(observation.id)}
                            disabled={!editText.trim() || isSubmitting}
                          >
                            {isSubmitting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                            Guardar
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <p className="text-gray-800 leading-relaxed">{observation.observation}</p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end pt-4 border-t">
          <Button variant="outline" onClick={handleClose}>
            Cerrar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProjectObservationsModal;
