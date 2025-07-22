import { supabase } from "@/infraestructure/storage/supabase";
import {
  Attachment,
  CreateAttachmentDto,
} from "@/types/domain/attachment.entity";

export class AttachmentService {
  private static readonly BUCKET_NAME = "projects.attachments";

  /**
   * Upload a file to Supabase storage and save the attachment record
   */
  static async uploadFile(
    file: File,
    projectId: number
  ): Promise<Attachment | null> {
    try {
      // Generate unique filename
      const fileExt = file.name.split(".").pop();
      const fileName = `${projectId}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

      // Upload file to Supabase storage
      const { error: uploadError } = await supabase.storage
        .from(this.BUCKET_NAME)
        .upload(fileName, file, {
          cacheControl: "3600",
          upsert: false,
        });

      if (uploadError) {
        console.error("Error uploading file:", uploadError);
        return null;
      }

      // Get public URL
      const {
        data: { publicUrl },
      } = supabase.storage.from(this.BUCKET_NAME).getPublicUrl(fileName);

      // Save attachment record to database
      const attachmentData: CreateAttachmentDto = {
        name: file.name,
        url: publicUrl,
        projectId: projectId,
        createdBy: "current-user", // TODO: Get from auth context
      };

      const response = await fetch("/api/attachments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(attachmentData),
      });

      if (!response.ok) {
        // If database save fails, delete the uploaded file
        await this.deleteFile(fileName);
        return null;
      }

      const attachment = await response.json();
      return attachment;
    } catch (error) {
      console.error("Error in uploadFile:", error);
      return null;
    }
  }

  /**
   * Upload multiple files
   */
  static async uploadFiles(
    files: File[],
    projectId: number
  ): Promise<Attachment[]> {
    const uploadPromises = files.map((file) =>
      this.uploadFile(file, projectId)
    );
    const results = await Promise.allSettled(uploadPromises);

    return results
      .filter(
        (result): result is PromiseFulfilledResult<Attachment> =>
          result.status === "fulfilled" && result.value !== null
      )
      .map((result) => result.value);
  }

  /**
   * Delete file from storage
   */
  static async deleteFile(fileName: string): Promise<boolean> {
    try {
      const { error } = await supabase.storage
        .from(this.BUCKET_NAME)
        .remove([fileName]);

      return !error;
    } catch (error) {
      console.error("Error deleting file:", error);
      return false;
    }
  }

  /**
   * Get attachments for a project
   */
  static async getProjectAttachments(projectId: number): Promise<Attachment[]> {
    try {
      const response = await fetch(`/api/attachments?projectId=${projectId}`);
      if (!response.ok) {
        return [];
      }
      return await response.json();
    } catch (error) {
      console.error("Error fetching attachments:", error);
      return [];
    }
  }

  /**
   * Delete attachment (both file and database record)
   */
  static async deleteAttachment(attachmentId: number): Promise<boolean> {
    try {
      const response = await fetch(`/api/attachments/${attachmentId}`, {
        method: "DELETE",
      });

      return response.ok;
    } catch (error) {
      console.error("Error deleting attachment:", error);
      return false;
    }
  }
}
