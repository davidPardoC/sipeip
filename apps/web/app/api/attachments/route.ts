import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/infraestructure/database/connection';
import { attachment } from '@/infraestructure/database/schemas/attachments';
import { eq } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const projectId = searchParams.get('projectId');

    if (projectId) {
      // Get attachments for specific project
      const attachments = await db
        .select()
        .from(attachment)
        .where(eq(attachment.projectId, parseInt(projectId)));
      
      return NextResponse.json(attachments);
    } else {
      // Get all attachments
      const attachments = await db.select().from(attachment);
      return NextResponse.json(attachments);
    }
  } catch (error) {
    console.error('Error fetching attachments:', error);
    return NextResponse.json(
      { error: 'Failed to fetch attachments' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, url, projectId, createdBy } = body;

    if (!name || !url || !projectId) {
      return NextResponse.json(
        { error: 'Missing required fields: name, url, projectId' },
        { status: 400 }
      );
    }

    const newAttachment = await db
      .insert(attachment)
      .values({
        name,
        url,
        projectId: parseInt(projectId),
        createdBy: createdBy || 'system',
        updatedBy: createdBy || 'system',
      })
      .returning();

    return NextResponse.json(newAttachment[0], { status: 201 });
  } catch (error) {
    console.error('Error creating attachment:', error);
    return NextResponse.json(
      { error: 'Failed to create attachment' },
      { status: 500 }
    );
  }
}
