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
import { Attachment } from '@/types/domain/attachment.entity';
import { AttachmentService } from '@/services/attachment.service';
import { Paperclip, Upload, X, Download, Loader2 } from 'lucide-react';

interface ProjectFilesModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: ProjectWithRelations | null;
  onFilesUpdated?: () => void;
}

const ProjectFilesModal: React.FC<ProjectFilesModalProps> = ({
  isOpen,
  onClose,
  project,
  onFilesUpdated
}) => {
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [existingAttachments, setExistingAttachments] = useState<Attachment[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Load existing attachments when modal opens
  useEffect(() => {
    if (isOpen && project) {
      loadExistingAttachments();
    }
  }, [isOpen, project]);

  const loadExistingAttachments = async () => {
    if (!project) return;
    
    setIsLoading(true);
    try {
      const attachments = await AttachmentService.getProjectAttachments(project.id);
      setExistingAttachments(attachments);
    } catch (error) {
      console.error('Error loading attachments:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      setUploadedFiles(prev => [...prev, ...Array.from(files)]);
    }
  };

  const handleRemoveFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSaveFiles = async () => {
    if (!project || uploadedFiles.length === 0) return;

    setIsUploading(true);
    try {
      const uploadedAttachments = await AttachmentService.uploadFiles(uploadedFiles, project.id);
      
      if (uploadedAttachments.length > 0) {
        // Refresh the attachments list
        await loadExistingAttachments();
        // Clear uploaded files
        setUploadedFiles([]);
        // Notify parent component
        if (onFilesUpdated) {
          onFilesUpdated();
        }
      }
    } catch (error) {
      console.error('Error uploading files:', error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeleteAttachment = async (attachmentId: number) => {
    try {
      const success = await AttachmentService.deleteAttachment(attachmentId);
      if (success) {
        await loadExistingAttachments();
        if (onFilesUpdated) {
          onFilesUpdated();
        }
      }
    } catch (error) {
      console.error('Error deleting attachment:', error);
    }
  };

  const handleCancel = () => {
    setUploadedFiles([]);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>
            Attach Files - {project?.code}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {/* Loading State */}
          {isLoading && (
            <div className="flex items-center justify-center py-4">
              <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
              <span className="ml-2 text-sm text-gray-600">Loading attachments...</span>
            </div>
          )}

          {/* Existing Attachments */}
          {!isLoading && existingAttachments.length > 0 && (
            <div className="space-y-2">
              <h4 className="font-medium text-sm">Existing Files:</h4>
              <div className="max-h-32 overflow-y-auto space-y-1">
                {existingAttachments.map((attachment) => (
                  <div key={attachment.id} className="flex items-center justify-between bg-blue-50 p-2 rounded">
                    <div className="flex items-center space-x-2">
                      <Paperclip className="h-4 w-4 text-blue-500" />
                      <span className="text-sm truncate">{attachment.name}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => window.open(attachment.url, '_blank')}
                        className="h-6 w-6 p-0"
                        title="Download"
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteAttachment(attachment.id)}
                        className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
                        title="Delete"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* File Upload Area */}
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <div className="text-sm text-gray-600 mb-4">
              <p>Drag and drop files here, or click to select</p>
              <p className="text-xs text-gray-500 mt-1">
                Supported formats: PDF, DOC, DOCX, XLS, XLSX, JPG, PNG
              </p>
            </div>
            <input
              type="file"
              multiple
              onChange={handleFileUpload}
              accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png"
              className="hidden"
              id="file-upload"
            />
            <label htmlFor="file-upload">
              <Button variant="outline" className="cursor-pointer" asChild>
                <span>Select Files</span>
              </Button>
            </label>
          </div>

          {/* Uploaded Files List */}
          {uploadedFiles.length > 0 && (
            <div className="space-y-2">
              <h4 className="font-medium text-sm">Selected Files:</h4>
              <div className="max-h-32 overflow-y-auto space-y-1">
                {uploadedFiles.map((file, index) => (
                  <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                    <div className="flex items-center space-x-2">
                      <Paperclip className="h-4 w-4 text-gray-500" />
                      <span className="text-sm truncate">{file.name}</span>
                      <span className="text-xs text-gray-500">
                        ({(file.size / 1024 / 1024).toFixed(2)} MB)
                      </span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveFile(index)}
                      className="h-6 w-6 p-0"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end gap-2 pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={handleCancel}
              disabled={isUploading}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleSaveFiles}
              disabled={uploadedFiles.length === 0 || isUploading}
            >
              {isUploading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Uploading...
                </>
              ) : (
                `Save Files (${uploadedFiles.length})`
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProjectFilesModal;
