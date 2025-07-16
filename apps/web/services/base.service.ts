import { auth } from "@/auth";
import { publishLogEvent } from "@/infraestructure/kafka/kafka.publisher";

export class BaseService {
  async emitLogEvent({
    event,
    message,
    after,
    before,
    resourceId,
  }: {
    event: string;
    before?: Record<string, any>;
    after?: Record<string, any>;
    resourceId?: number;
    message?: string;
  }): Promise<void> {
    const session = await auth();
    publishLogEvent({
      event,
      timestamp: new Date().toISOString(),
      userId: session?.user?.id,
      message,
      after,
      before,
      resourceId,
    });
  }
}
