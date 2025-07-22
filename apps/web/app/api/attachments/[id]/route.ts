import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/infraestructure/database/connection';
import { attachment } from '@/infraestructure/database/schemas/attachments';
import { eq } from 'drizzle-orm';
import { supabase } from '@/infraestructure/storage/supabase';

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const attachmentId = parseInt(params.id);

    if (isNaN(attachmentId)) {
      return NextResponse.json(
        { error: 'Invalid attachment ID' },
        { status: 400 }
      );
    }

    // Get attachment info first
    const attachmentRecord = await db
      .select()
      .from(attachment)
      .where(eq(attachment.id, attachmentId))
      .limit(1);

    if (attachmentRecord.length === 0) {
      return NextResponse.json(
        { error: 'Attachment not found' },
        { status: 404 }
      );
    }

    const attachmentData = attachmentRecord[0];

    // Extract file path from URL for deletion from storage
    const url = new URL(attachmentData.url);
    const filePath = url.pathname.split('/').slice(-2).join('/'); // Get last two parts (projectId/filename)

    // Delete from database first
    await db
      .delete(attachment)
      .where(eq(attachment.id, attachmentId));

    // Then try to delete from storage
    try {
      await supabase.storage
        .from('projects.attachments')
        .remove([filePath]);
    } catch (storageError) {
      console.error('Error deleting file from storage:', storageError);
      // Continue anyway since database record is already deleted
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting attachment:', error);
    return NextResponse.json(
      { error: 'Failed to delete attachment' },
      { status: 500 }
    );
  }
}
