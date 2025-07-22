export interface Attachment {
  id: number;
  name: string;
  url: string;
  projectId: number;
  createdBy?: string;
  updatedBy?: string;
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string;
}

export interface CreateAttachmentDto {
  name: string;
  url: string;
  projectId: number;
  createdBy?: string;
}
