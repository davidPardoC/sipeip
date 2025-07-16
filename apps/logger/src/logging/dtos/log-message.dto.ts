export class MessageLogEvent {
  event: string;
  timestamp: string;
  before?: Record<string, any>;
  after?: Record<string, any>;
  userId?: number;
  message?: string;
  resourceId?: number;
}
